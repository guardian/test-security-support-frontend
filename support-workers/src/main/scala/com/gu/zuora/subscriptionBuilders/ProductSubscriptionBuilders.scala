package com.gu.zuora.subscriptionBuilders

import java.util.UUID
import com.gu.i18n.Country
import com.gu.support.catalog
import com.gu.support.catalog.{ProductRatePlan, ProductRatePlanId}
import com.gu.support.config.ZuoraContributionConfig
import com.gu.support.promotions.{PromoCode, PromoError, PromotionService}
import com.gu.support.workers._
import com.gu.support.workers.exceptions.CatalogDataNotFoundException
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.ContributionState
import com.gu.support.zuora.api.ReaderType.Direct
import com.gu.support.zuora.api._
import org.joda.time.{DateTimeZone, LocalDate}

object ProductSubscriptionBuilders {

  def validateRatePlan(maybeProductRatePlan: Option[ProductRatePlan[catalog.Product]], productDescription: String): ProductRatePlanId =
    maybeProductRatePlan.map(_.id) match {
      case Some(value) => value
      case None => throw new CatalogDataNotFoundException(s"RatePlanId not found for $productDescription")
    }

  def applyPromoCodeIfPresent(
    promotionService: PromotionService,
    maybePromoCode: Option[PromoCode],
    country: Country,
    productRatePlanId: ProductRatePlanId,
    subscriptionData: SubscriptionData
  ): Either[PromoError, SubscriptionData] = {
    val withPromotion = maybePromoCode.map { promoCode =>
      for {
        promotionWithCode <- promotionService.findPromotion(promoCode)
        subscriptionWithPromotion <- promotionService.applyPromotion(promotionWithCode, country, productRatePlanId, subscriptionData, isRenewal = false)
      } yield subscriptionWithPromotion
    }

    withPromotion.getOrElse(Right(subscriptionData))
  }

}
