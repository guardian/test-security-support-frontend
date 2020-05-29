package controllers

import actions.CustomActionBuilders
import actions.CustomActionBuilders.AuthRequest
import admin.settings.{AllSettings, AllSettingsProvider}
import akka.util.ByteString
import assets.{AssetsResolver, RefPath, StyleContent}
import cats.data.EitherT
import cats.implicits._
import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Country
import com.gu.i18n.Currency.GBP
import com.gu.identity.model.{User => IdUser}
import com.gu.support.catalog.Corporate
import com.gu.support.redemptions.{CorporateCustomer, CorporateRedemption}
import com.gu.support.redemptions.redemptions.RedemptionCode
import com.gu.support.workers
import com.gu.support.workers.{Address, DigitalPack, Monthly, User}
import com.sun.jndi.cosnaming.IiopUrl.Address
import play.api.mvc.{AbstractController, Action, AnyContent, BodyParser, ControllerComponents, Request, RequestHeader}
import play.twirl.api.Html
import services.{IdentityService, MembersDataService, TestUserService}
import views.EmptyDiv
import io.circe.syntax._
import ophan.thrift.event.AbTest
import play.api.libs.circe.Circe
import services.stepfunctions.{CreateSupportWorkersRequest, StatusResponse, SupportWorkersClient}
import utils.CheckoutValidationRules
import lib.PlayImplicits._
import play.api.libs.streams.Accumulator
import play.api.libs.ws.{WSRequest, WSResponse}
import views.html.helper.CSRF
import views.html.subscriptionRedemptionForm

import scala.concurrent.{ExecutionContext, Future}
import RedemptionController._

class RedemptionController(
  val actionRefiners: CustomActionBuilders,
  val assets: AssetsResolver,
  settingsProvider: AllSettingsProvider,
  identityService: IdentityService,
  membersDataService: MembersDataService,
  testUsers: TestUserService,
  client: SupportWorkersClient,
  components: ControllerComponents,
  fontLoaderBundle: Either[RefPath, StyleContent],
)(
  implicit val ec: ExecutionContext
) extends AbstractController(components) with Circe {

  import actionRefiners._

  implicit val a: AssetsResolver = assets

  implicit val settings: AllSettings = settingsProvider.getAllSettings()
  val title = "Support the Guardian | Redeem your code"
  val id = EmptyDiv("subscriptions-redemption-page")
  val js = "subscriptionsRedemptionPage.js"
  val css = "digitalSubscriptionCheckoutPage.css" //TODO: Don't need this?

  def displayForm(redemptionCode: String) = NoCacheAction().async {
    implicit request =>
      getCorporateCustomer(redemptionCode).value.map(
        customerOrError =>
          Ok(subscriptionRedemptionForm(
            title,
            id,
            js,
            css,
            fontLoaderBundle,
            None,
            false,
            "checkout",
            redemptionCode,
            customerOrError,
            None,
            false
          ))
      )

  }

  import cats.implicits._

  def create(redemptionCode: String) =
    authenticatedAction(subscriptionsClientId).async {
      implicit request: AuthRequest[Any] =>
        val blah = for {
          user <- identityService.getUser(request.user.minimalUser)
          corporateCustomer <- getCorporateCustomer(redemptionCode)
        } yield showProcessing(redemptionCode, corporateCustomer, user)
        blah.value.map(
          _.fold(
            BadRequest(_),
            result => result
          )
        )
    }

  def showProcessing(redemptionCode: RedemptionCode, corporateCustomer: CorporateCustomer, user: IdUser)(implicit request: AuthRequest[Any]) = {
    val csrf = CSRF.getToken.value
    Ok(subscriptionRedemptionForm(
      title,
      id,
      js,
      css,
      fontLoaderBundle,
      Some(csrf),
      false,
      "processing",
      redemptionCode,
      Right(corporateCustomer),
      Some(user),
      true
    ))
  }

  def validateCode(redemptionCode: String) = CachedAction().async {
    getCorporateCustomer(redemptionCode).value.map(
      _.fold(
        errorString => Ok(RedemptionValidationResult(valid = false, Some(errorString)).asJson),
        customer => Ok(RedemptionValidationResult(valid = true, None).asJson)
      ))
  }
}

object RedemptionController {
  def getCorporateCustomer(redemptionCode: RedemptionCode)(implicit ec: ExecutionContext): EitherT[Future, String, CorporateCustomer] =
    if (redemptionCode == "test-code")
      EitherT.fromEither(Right(CorporateCustomer("1", "Test Company", "test-code")))
    else
      EitherT.fromEither(Left("This code is not valid"))
}

