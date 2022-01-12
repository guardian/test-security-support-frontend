package controllers

import actions.CustomActionBuilders
import akka.stream.scaladsl.Flow
import akka.util.ByteString
import cats.data.EitherT
import cats.implicits._
import com.gu.monitoring.SafeLogger
import com.gu.monitoring.SafeLogger._
import com.gu.support.workers._
import config.Configuration.GuardianDomain
import io.circe.syntax._
import lib.PlayImplicits._
import org.joda.time.DateTime
import play.api.libs.circe.Circe
import play.api.libs.streams.Accumulator
import play.api.mvc._
import services.AsyncAuthenticationService.IdentityIdAndEmail
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import services.{IdentityService, TestUserService}
import utils.CheckoutValidationRules.{Invalid, Valid}
import utils.NormalisedTelephoneNumber.asFormattedString
import utils.{CheckoutValidationRules, NormalisedTelephoneNumber}

import scala.concurrent.{ExecutionContext, Future}

class CreateSubscriptionController(
  client: SupportWorkersClient,
  actionRefiners: CustomActionBuilders,
  identityService: IdentityService,
  testUsers: TestUserService,
  components: ControllerComponents,
  guardianDomain: GuardianDomain
)(implicit val ec: ExecutionContext) extends AbstractController(components) with Circe {

  import actionRefiners._

  sealed abstract class CreateSubscriptionError(message: String)
  case class ServerError(message: String) extends CreateSubscriptionError(message)
  case class RequestValidationError(message: String) extends CreateSubscriptionError(message)

  type ApiResponseOrError[RES] = EitherT[Future, CreateSubscriptionError, RES]

  def create: EssentialAction =
    alarmOnFailure(PrivateAction.async(new LoggingCirceParser(components).requestParser) {
      implicit request =>
        val res = for {
          maybeLoggedInUser <- EitherT.right[CreateSubscriptionError](asyncAuthenticationService.tryAuthenticateUser(request))
          maybeLoggedInIdentityIdAndEmail = maybeLoggedInUser.map(authIdUser => IdentityIdAndEmail(authIdUser.id, authIdUser.primaryEmailAddress))
          userDesc = maybeLoggedInIdentityIdAndEmail match {
            case None => s"Guest User ${request.body.email}"
            case Some(idAndEmail) => s"User ${idAndEmail.primaryEmailAddress}"
          }
          _ = SafeLogger.info(s"$userDesc is attempting to create a new ${request.body.product.describe} [${request.uuid}]")
          userAndEmail <- maybeLoggedInIdentityIdAndEmail match {
            case Some(identityIdAndEmail) => EitherT.pure[Future, CreateSubscriptionError](identityIdAndEmail)
            case None => getOrCreateIdentityUser(request.body).leftMap(ServerError)
          }
          result <- handleCreateSupportWorkersRequest(userAndEmail)
        } yield result
        respondToClient(res, request.body.product)
    })

  private def getOrCreateIdentityUser(body: CreateSupportWorkersRequest): EitherT[Future, String, IdentityIdAndEmail] = {
    val existingIdentityId = identityService.getUserIdFromEmail(body.email)
    val identityId = existingIdentityId.leftFlatMap(_ => identityService.createUserIdFromEmailUser(body.email, body.firstName, body.lastName))
    identityId.map(identityId => IdentityIdAndEmail(identityId, body.email))
  }

  private def handleCreateSupportWorkersRequest(identityIdAndEmail: IdentityIdAndEmail)(
    implicit request: Request[CreateSupportWorkersRequest]
  ): EitherT[Future, CreateSubscriptionError, StatusResponse] = {

    val normalisedTelephoneNumber = NormalisedTelephoneNumber.fromStringAndCountry(request.body.telephoneNumber, request.body.billingAddress.country)

    val createSupportWorkersRequest = request.body.copy(
      telephoneNumber = normalisedTelephoneNumber.map(asFormattedString)
    )

    CheckoutValidationRules.validate(createSupportWorkersRequest) match {
      case Valid =>
        val isTestUser = testUsers.isTestUser(request)
        for {
          statusResponse <- client.createSubscription(request, buildUser(identityIdAndEmail, createSupportWorkersRequest, isTestUser), request.uuid)
            .leftMap[CreateSubscriptionError](error => ServerError(error))
        } yield statusResponse

      case Invalid(message) =>
        SafeLogger.warn(s"validation of the request body failed with $message - body was $createSupportWorkersRequest")
        EitherT.leftT(RequestValidationError("validation of the request body failed"))
    }
  }

  private def respondToClient(
    result: EitherT[Future, CreateSubscriptionError, StatusResponse],
    product: ProductType
  )(implicit request: Request[CreateSupportWorkersRequest]): Future[Result] = {
    result.fold(
      { error =>
        SafeLogger.error(scrub"[${request.uuid}] Failed to create new ${request.body.product.describe}, due to $error")
        error match {
          case _: RequestValidationError => BadRequest
          case _: ServerError => InternalServerError
        }
      },
      { statusResponse =>
        SafeLogger.info(s"[${request.uuid}] Successfully created a support workers execution for a new ${request.body.product.describe}")
        Accepted(statusResponse.asJson).withCookies(cookies(product):_*)
      }
    )
  }

  private def cookies(product: ProductType) = {
    // Setting the user attributes cookies used by frontend. See:
    // https://github.com/guardian/frontend/blob/main/static/src/javascripts/projects/common/modules/commercial/user-features.js#L69
    val standardCookies = List(
      "gu_user_features_expiry" -> DateTime.now.plusDays(1).getMillis.toString,
      "gu_hide_support_messaging" -> true.toString
    )
    val productCookies = product match {
      case Contribution(amount, currency, billingPeriod) => List(
        s"gu.contributions.recurring.contrib-timestamp.$billingPeriod" -> DateTime.now.getMillis.toString,
        "gu_recurring_contributor" -> true.toString
      )
      case DigitalPack(currency, billingPeriod, readerType) => List(
        "gu_digital_subscriber" -> true.toString,
        "GU_AF1" -> DateTime.now().plusDays(1).getMillis.toString
      )
      case p: Paper if p.productOptions.hasDigitalSubscription => List(
        "gu_digital_subscriber" -> true.toString,
        "GU_AF1" -> DateTime.now().plusDays(1).getMillis.toString
      )
      case _: Paper => List.empty
      case _: GuardianWeekly => List.empty
    }
    (standardCookies ++ productCookies).map { case (name, value) =>
      Cookie(
        name = name,
        value = value,
        secure = true,
        httpOnly = false,
        domain = Some(guardianDomain.value)
      )
    }
  }

  private def buildUser(identityIdAndEmail: IdentityIdAndEmail, request: CreateSupportWorkersRequest, isTestUser: Boolean) = {
    User(
      id = identityIdAndEmail.id,
      primaryEmailAddress = identityIdAndEmail.primaryEmailAddress,
      title = request.title,
      firstName = request.firstName,
      lastName = request.lastName,
      billingAddress = request.billingAddress,
      deliveryAddress = request.deliveryAddress,
      telephoneNumber = request.telephoneNumber,
      allowMembershipMail = false,
      // Previously the values for the fields allowThirdPartyMail and allowGURelatedMail
      // were derived by looking for the fields: statusFields.receive3rdPartyMarketing and
      // statusFields.receiveGnmMarketing in the JSON object that models a user.
      // However, a query of the identity database indicates that these fields aren't defined for any users
      // (nor are they included in the StatusFields class in identity-model).
      // Therefore, setting them statically to false is not a regression.
      // TODO: in a subsequent PR set these values based on the respective user.
      allowThirdPartyMail = false,
      allowGURelatedMail = false,
      isTestUser = isTestUser,
      deliveryInstructions = request.deliveryInstructions
    )
  }

}

class LoggingCirceParser(controllerComponents: ControllerComponents) extends Circe {

  override protected def onCirceError(e: io.circe.Error): Result = {
    SafeLogger.warn(s"circe decode failure: $e")
    super.onCirceError(e)
  }

  val requestParser: BodyParser[CreateSupportWorkersRequest] = {
    val underlying = circe.json[CreateSupportWorkersRequest]
    BodyParser.apply("LoggingCirceParser(" + underlying.toString() + ")") {
      requestHeader: RequestHeader =>
        val accumulator: Accumulator[ByteString, Either[Result, CreateSupportWorkersRequest]] = underlying.apply(requestHeader)
        accumulator.through(Flow.fromFunction { (byteString: ByteString) =>
          SafeLogger.info("incoming POST: " + byteString.utf8String)
          byteString
        })
    }
  }

  def parse: PlayBodyParsers = controllerComponents.parsers
}
