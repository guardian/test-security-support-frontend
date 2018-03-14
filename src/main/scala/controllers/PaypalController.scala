package controllers

import cats.implicits._
import backend.PaypalBackend
import com.typesafe.scalalogging.StrictLogging
import model.{DefaultThreadPool, ResultBody}
import model.paypal._
import play.api.libs.circe.Circe
import play.api.mvc.{AbstractController, Action, ControllerComponents}
import util.RequestBasedProvider

class PaypalController(controllerComponents: ControllerComponents,
    paypalBackendProvider: RequestBasedProvider[PaypalBackend])(implicit pool: DefaultThreadPool) extends AbstractController(controllerComponents) with Circe with JsonUtils with StrictLogging {
  // Other considerations:
  // - CORS
  // - Test users
  // - Remember that API will change: no redirectUrl!

  import util.RequestTypeDecoder.instances._
  import PaypalJsonDecoder._

  def createPayment: Action[CreatePaypalPaymentData] = Action.async(circe.json[CreatePaypalPaymentData]) { createPaypalPaymentRequest =>
    paypalBackendProvider
      .getInstanceFor(createPaypalPaymentRequest)
      .createPayment(createPaypalPaymentRequest.body)
      .subflatMap(PaypalPaymentSuccess.fromPayment)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        payment => Ok(ResultBody.Success(payment))
      )
  }

  def capturePayment(): Action[CapturePaypalPaymentData] = Action.async(circe.json[CapturePaypalPaymentData]) { capturePaypalPaymentRequest =>
    paypalBackendProvider
      .getInstanceFor(capturePaypalPaymentRequest)
      .capturePayment(capturePaypalPaymentRequest.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        _ => Ok(ResultBody.Success(()))
      )
  }

  def executePayment: Action[ExecutePaypalPaymentData] = Action.async(circe.json[ExecutePaypalPaymentData]) { executePaypalPaymentRequest =>
    paypalBackendProvider
      .getInstanceFor(executePaypalPaymentRequest)
      .executePayment(executePaypalPaymentRequest.body)
      .fold(
        err => InternalServerError(ResultBody.Error(err.getMessage)),
        payment => Ok(ResultBody.Success("execute payment success"))
      )
  }


}
