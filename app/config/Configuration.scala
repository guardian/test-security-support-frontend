package config

import com.gocardless.GoCardlessClient
import com.gu.support.config.{PayPalConfigProvider, Stage, StripeConfigProvider}
import com.typesafe.config.ConfigFactory
import config.ConfigImplicits._
import services.GoCardlessConfigProvider
import services.aws.AwsConfig
import services.stepfunctions.StateMachineArn

class Configuration {
  val config = ConfigFactory.load()

  lazy val stage = Stage.fromString(config.getString("stage")).get

  lazy val sentryDsn = config.getOptionalString("sentry.dsn")

  lazy val identity = new Identity(config.getConfig("identity"))

  lazy val googleAuth = new GoogleAuth(config.getConfig("googleAuth"))

  lazy val aws = new AwsConfig(config.getConfig("aws"))

  lazy val guardianDomain = config.getString("guardianDomain")

  lazy val supportUrl = config.getString("support.url")

  lazy val contributionsStripeEndpoint = config.getString("contributions.stripe.url")

  lazy val contributionsPayPalAuthEndpoint = config.getString("contributions.paypal.url")

  lazy val contributionsFrontendUrl = config.getString("contribution.url")

  lazy val membersDataServiceApiUrl = config.getString("membersDataService.api.url")

  lazy val goCardlessConfigProvider = new GoCardlessConfigProvider(config, stage)

  lazy val payPalConfigProvider = new PayPalConfigProvider(config, stage)

  lazy val regularStripeConfigProvider = new StripeConfigProvider(config, stage)

  lazy val oneOffStripeConfigProvider = new StripeConfigProvider(config, stage, "oneOffStripe")

  lazy val stepFuctionArn = StateMachineArn.fromString(config.getString("supportWorkers.arn")).get
}
