
import com.amazonaws.services.simplesystemsmanagement.AWSSimpleSystemsManagement
import play.api._
import play.api.ApplicationLoader.Context
import play.api.db.{DBComponents, HikariCPComponents}
import router.Routes
import util.RequestBasedProvider

import aws.AWSClientBuilder
import backend.StripeBackend

import _root_.controllers.StripeController
import conf.ConfigLoader
import model.RequestEnvironments
import services.DatabaseProvider

class MyApplicationLoader extends ApplicationLoader {
  def load(context: Context): Application = {
    LoggerConfigurator(context.environment.classLoader).foreach {
      _.configure(context.environment, context.initialConfiguration, Map.empty)
    }
    new MyComponents(context).application
  }
}

class MyComponents(context: Context)
  extends BuiltInComponentsFromContext(context)
  with DBComponents
  with NoHttpFiltersComponents
  with HikariCPComponents {

  val requestEnvironments: RequestEnvironments = RequestEnvironments.forAppMode(isProd = false)

  val awsClientBuilder = new AWSClientBuilder(applicationLifecycle)
  val ssm: AWSSimpleSystemsManagement = awsClientBuilder.buildAWSSimpleSystemsManagementClient()
  val configLoader: ConfigLoader = new ConfigLoader(ssm)

  override val configuration: Configuration =
    DatabaseProvider.ConfigurationUpdater.updateConfiguration(configLoader, super.configuration, requestEnvironments)

  val databaseProvider = new DatabaseProvider(dbApi)

  val stripeBackendProvider: RequestBasedProvider[StripeBackend] =
    new StripeBackend.Builder(configLoader, databaseProvider)
      .buildRequestBasedProvider(requestEnvironments)
      .valueOr(throw _)

  override val router =
    new Routes(
      httpErrorHandler,
      new StripeController(controllerComponents, stripeBackendProvider)
    )
}
