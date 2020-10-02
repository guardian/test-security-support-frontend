package com.gu.support.redemption.gifting.generator

import com.gu.support.redemption.gifting.generator.GiftDuration.{Gift12Month, Gift3Month}
import com.gu.support.workers.{Annual, BillingPeriod}

class GiftCodeGeneratorService {
  private[this] def toDuration(billingPeriod: BillingPeriod): GiftDuration = billingPeriod match {
    case Annual => Gift12Month
    case _ => Gift3Month
  }

  def generateCode(billingPeriod: BillingPeriod): CodeBuilder.GiftCode = GiftCodeGenerator.randomGiftCodes.next().withDuration(toDuration(billingPeriod))
}
