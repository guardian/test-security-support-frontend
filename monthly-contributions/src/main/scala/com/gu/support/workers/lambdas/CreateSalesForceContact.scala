package com.gu.support.workers.lambdas

import com.amazonaws.services.lambda.runtime.Context
import com.gu.support.workers.model.SalesForceContact
import com.gu.zuora.soap.model.PaymentMethod
import com.typesafe.scalalogging.LazyLogging
import io.circe.generic.auto._

class CreateSalesForceContact extends Handler[PaymentMethod, SalesForceContact] with LazyLogging {
  override protected def handler(input: PaymentMethod, context: Context) = {
    SalesForceContact("789")
  }
}
