package backend

import cats.syntax.apply._
import cats.syntax.either._
import com.typesafe.scalalogging.StrictLogging
import util.EnvironmentBasedBuilder

import conf.{ConfigLoader, StripeConfig}
import model.{Environment, InitializationResult}
import model.db.ContributionData
import model.stripe.{StripeChargeData, StripeChargeError, StripeChargeSuccess}
import services.{DatabaseProvider, DatabaseService, StripeService}

// Provides methods required by the Stripe controller
// TODO: include dependency on acquisition producer service
class StripeBackend(stripeService: StripeService, databaseService: DatabaseService) extends StrictLogging {

  // TODO: send acquisition event
  def createCharge(data: StripeChargeData): Either[StripeChargeError, StripeChargeSuccess] =
    stripeService.createCharge(data.paymentData)
      // No flat map here - the result the client receives as to whether the charge is successful,
      // should not be dependent on the insertion of the contribution data.
      .map { charge =>
        val contributionData = ContributionData.fromStripeCharge(data.identityData.identityId, charge)
        databaseService.insertContributionData(contributionData)
        StripeChargeSuccess.fromStripeCharge(charge)
      }
}

object StripeBackend {

  private def apply(stripeService: StripeService, databaseService: DatabaseService): StripeBackend =
    new StripeBackend(stripeService, databaseService)

  class Builder(configLoader: ConfigLoader, databaseProvider: DatabaseProvider) extends EnvironmentBasedBuilder[StripeBackend] {
    override def build(env: Environment): InitializationResult[StripeBackend] = (
      configLoader.loadConfig[StripeConfig](env).map(StripeService.fromConfig): InitializationResult[StripeService],
      databaseProvider.loadDatabase(env).map(DatabaseService.apply): InitializationResult[DatabaseService]
    ).mapN(StripeBackend.apply)
  }
}

