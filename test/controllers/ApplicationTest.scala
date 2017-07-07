package controllers

import org.scalatest.WordSpec
import org.scalatest.MustMatchers
import play.api.test.FakeRequest
import play.api.test.Helpers.{contentAsString, header, stubControllerComponents}
import akka.util.Timeout
import assets.AssetsResolver
import com.gu.identity.play.AuthenticatedIdUser
import lib.TestUsers
import lib.actions.{ActionRefiners, CachedAction}
import org.scalatest.mockito.MockitoSugar.mock
import services.IdentityService

import scala.concurrent.ExecutionContext
import scala.concurrent.duration._
import scala.concurrent.ExecutionContext.Implicits.global

class ApplicationTest extends WordSpec with MustMatchers {

  implicit val timeout = Timeout(2.seconds)

  val cachedAction = new CachedAction()(global, stubControllerComponents().actionBuilder)

  val actionRefiner = new ActionRefiners(_ => Some(mock[AuthenticatedIdUser]), "", "", mock[TestUsers], stubControllerComponents())

  "/healthcheck" should {
    "return healthy" in {
      val result = new Application()(
        actionRefiner, mock[AssetsResolver], mock[IdentityService], mock[ExecutionContext], stubControllerComponents(), cachedAction
      ).healthcheck.apply(FakeRequest())
      contentAsString(result) mustBe "healthy"
    }

    "not be cached" in {
      val result = new Application()(
        actionRefiner, mock[AssetsResolver], mock[IdentityService], mock[ExecutionContext], stubControllerComponents(), cachedAction
      ).healthcheck.apply(FakeRequest())
      header("Cache-Control", result) mustBe Some("private")
    }
  }
}
