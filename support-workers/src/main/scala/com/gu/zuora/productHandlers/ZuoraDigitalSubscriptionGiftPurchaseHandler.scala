package com.gu.zuora.productHandlers

import cats.implicits._
import com.gu.WithLoggingSugar._
import com.gu.salesforce.Salesforce.SfContactId
import com.gu.support.redemption.gifting.GiftCodeValidator
import com.gu.support.workers.User
import com.gu.support.workers.states.CreateZuoraSubscriptionProductState.DigitalSubscriptionGiftPurchaseState
import com.gu.support.workers.states.SendThankYouEmailState
import com.gu.support.workers.states.SendThankYouEmailState.SendThankYouEmailDigitalSubscriptionGiftPurchaseState
import com.gu.zuora.ZuoraSubscriptionCreator
import com.gu.zuora.subscriptionBuilders.{BuildSubscribePromoError, DigitalSubscriptionGiftPurchaseBuilder}
import org.joda.time.DateTime

import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

class ZuoraDigitalSubscriptionGiftPurchaseHandler(
  zuoraSubscriptionCreator: ZuoraSubscriptionCreator,
  now: () => DateTime,
  digitalSubscriptionGiftPurchaseBuilder: DigitalSubscriptionGiftPurchaseBuilder,
  user: User,
) {

  def subscribe(state: DigitalSubscriptionGiftPurchaseState): Future[SendThankYouEmailState] =
    for {
      subscriptionBuildResult <- Future.fromTry(digitalSubscriptionGiftPurchaseBuilder.build(state).leftMap(BuildSubscribePromoError).toTry)
        .withEventualLogging("subscription data")
      (subscribeItem, giftCode) = subscriptionBuildResult
      paymentSchedule <- zuoraSubscriptionCreator.preview(subscribeItem, state.product.billingPeriod)
      (account, sub) <- zuoraSubscriptionCreator.ensureSubscriptionCreated(subscribeItem)
    } yield {
      val lastRedemptionDate = (() => now().toLocalDate) ().plusMonths(GiftCodeValidator.expirationTimeInMonths).minusDays(1)
      SendThankYouEmailDigitalSubscriptionGiftPurchaseState(
        user,
        SfContactId(state.salesforceContacts.giftRecipient.get.Id),
        state.product,
        state.giftRecipient,
        giftCode,
        lastRedemptionDate,
        state.paymentMethod,
        paymentSchedule,
        state.promoCode,
        account.value,
        sub.value,
      )
    }

}
