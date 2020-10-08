
package utils

import com.gu.acquisition.model.{OphanIds, ReferrerAcquisitionData}
import com.gu.i18n.Currency.{GBP, USD}
import com.gu.i18n.{Country, Currency}
import com.gu.support.catalog.{Everyday, HomeDelivery}
import com.gu.support.redemptions.{RedemptionCode, RedemptionData}
import com.gu.support.workers._
import com.gu.support.zuora.api.ReaderType.{Corporate, Gift}
import org.joda.time.LocalDate
import org.scalatest.flatspec.AnyFlatSpec
import org.scalatest.matchers.should.Matchers
import services.stepfunctions.CreateSupportWorkersRequest
import services.stepfunctions.CreateSupportWorkersRequest.GiftRecipientRequest

class SimpleCheckoutFormValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validDigitalPackRequest

  "SimpleCheckoutFormValidation.passes" should "return true when there are no empty strings" in {
    SimpleCheckoutFormValidation.passes(validDigitalPackRequest) shouldBe true
  }

  it should "reject empty strings in the name field" in {
    val requestMissingFirstName = validDigitalPackRequest.copy(firstName = "")
    SimpleCheckoutFormValidation.passes(requestMissingFirstName) shouldBe false
  }

  it should "reject a first name which is too long" in {
    val requestWithLongFirstName = validDigitalPackRequest.copy(firstName = "TooLongToBeFirstNameAccordingToSalesforce")
    SimpleCheckoutFormValidation.passes(requestWithLongFirstName) shouldBe false
  }

  it should "reject a last name which is too long" in {
    val requestWithLongLastName = validDigitalPackRequest.copy(lastName = "TooLongToBeLastNameAccordingToSalesforceTooLongToBeLastNameAccordingToSalesforce1")
    SimpleCheckoutFormValidation.passes(requestWithLongLastName) shouldBe false
  }

}

class DigitalPackValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validDigitalPackRequest

  "DigitalPackValidation.passes" should "fail if the country is US and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = None),
    )
    DigitalPackValidation.passes(requestMissingState.product.asInstanceOf[DigitalPack])(requestMissingState) shouldBe false
  }

  it should "also fail if the country is Canada and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Canada, state = None),
    )
    DigitalPackValidation.passes(requestMissingState.product.asInstanceOf[DigitalPack])(requestMissingState) shouldBe false
  }

  it should "also fail if the country is Australia and there is no state selected" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Australia, state = None),
      product = DigitalPack(Currency.AUD, Monthly)
    )
    DigitalPackValidation.passes(requestMissingState.product.asInstanceOf[DigitalPack])(requestMissingState) shouldBe false
  }

  it should "also fail if the country is Australia and there is no postcode" in {
    val requestMissingPostcode = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Australia, postCode = None),
      product = DigitalPack(Currency.AUD, Monthly)
    )
    DigitalPackValidation.passes(requestMissingPostcode.product.asInstanceOf[DigitalPack])(requestMissingPostcode) shouldBe false
  }

  it should "also fail if the country is United Kingdom and there is no postcode" in {
    val requestMissingPostcode = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.UK, postCode = None),
      product = DigitalPack(Currency.GBP, Monthly)
    )
    DigitalPackValidation.passes(requestMissingPostcode.product.asInstanceOf[DigitalPack])(requestMissingPostcode) shouldBe false
  }

  it should "also fail if the country is United States and there is no postcode" in {
    val requestMissingPostcode = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(postCode = None),
      product = DigitalPack(Currency.USD, Monthly)
    )
    DigitalPackValidation.passes(requestMissingPostcode.product.asInstanceOf[DigitalPack])(requestMissingPostcode) shouldBe false
  }

  it should "also fail if the country is Canada and there is no postcode" in {
    val requestMissingPostcode = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Canada, postCode = None),
      product = DigitalPack(Currency.CAD, Monthly)
    )
    DigitalPackValidation.passes(requestMissingPostcode.product.asInstanceOf[DigitalPack])(requestMissingPostcode) shouldBe false
  }

  it should "also allow a missing postcode in other countries" in {
    val requestMissingPostcode = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.Ireland, postCode = None),
      product = DigitalPack(Currency.EUR, Monthly)
    )
    DigitalPackValidation.passes(requestMissingPostcode.product.asInstanceOf[DigitalPack])(requestMissingPostcode) shouldBe true
  }

  it should "fail if the source payment field received is an empty string" in {
    val requestMissingState = validDigitalPackRequest.copy(paymentFields = Left(StripeSourcePaymentFields("", None)))
    DigitalPackValidation.passes(requestMissingState.product.asInstanceOf[DigitalPack])(requestMissingState) shouldBe false
  }

  it should "succeed for a standard country and currency combination" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.UK, state = None),
      product = DigitalPack(Currency.GBP, Annual),
    )
    DigitalPackValidation.passes(requestMissingState.product.asInstanceOf[DigitalPack])(requestMissingState) shouldBe true
  }

  it should "fail if the country and currency combination is unsupported" in {
    val requestMissingState = validDigitalPackRequest.copy(
      billingAddress = validDigitalPackRequest.billingAddress.copy(country = Country.US, state = Some("VA")),
      product = DigitalPack(Currency.GBP, Annual)
    )
    DigitalPackValidation.passes(requestMissingState.product.asInstanceOf[DigitalPack])(requestMissingState) shouldBe false
  }

  it should "fail when missing an address line or a city for billing address" in {
    val badBillingAddress = Address(
      lineOne = None,
      lineTwo = None,
      city = None,
      state = None,
      postCode = None,
      country = Country.UK
    )
    val requestMissingAddressLineAndCity = validDigitalPackRequest.copy(billingAddress = badBillingAddress)
    DigitalPackValidation.passes(requestMissingAddressLineAndCity.product.asInstanceOf[DigitalPack])(requestMissingAddressLineAndCity) shouldBe false
  }

  it should "succeed when there is a valid corporate sub" in {
    val corporateSub = validDigitalPackRequest.copy(
      product = DigitalPack(GBP, Monthly, Corporate),
      paymentFields = Right(RedemptionData(RedemptionCode("test-code-123").right.get))
    )

    DigitalPackValidation.passes(corporateSub.product.asInstanceOf[DigitalPack])(corporateSub) shouldBe true
  }

  it should "succeed when there is a valid gift sub purchase" in {
    val giftPurchase = validDigitalPackRequest.copy(
      product = DigitalPack(USD, Monthly, Gift),
      giftRecipient = Some(GiftRecipientRequest(None, "bob", "builder", Some("bob@gu.com"), Some("have a nice sub"), Some(new LocalDate(2020, 10, 2))))
    )

    DigitalPackValidation.passes(giftPurchase.product.asInstanceOf[DigitalPack])(giftPurchase) shouldBe true
  }

  it should "succeed when there is a valid gift sub redemption" in {
    val giftRedemption = validDigitalPackRequest.copy(
      product = DigitalPack(GBP, Monthly, Gift),
      paymentFields = Right(RedemptionData(RedemptionCode("test-code").right.get))
    )

    DigitalPackValidation.passes(giftRedemption.product.asInstanceOf[DigitalPack])(giftRedemption) shouldBe true
  }

}

class PaperValidationTest extends AnyFlatSpec with Matchers {

  import TestData.validPaperRequest

  "PaperValidation.passes" should "fail if the delivery country is US" in {
    val requestDeliveredToUs = validPaperRequest.copy(deliveryAddress = validPaperRequest.deliveryAddress map(_.copy(country = Country.US)))
    PaperValidation.passes(requestDeliveredToUs) shouldBe false
  }

  it should "fail if the currency is USD" in {
    val requestDeliveredToUs = validPaperRequest.copy(product = Paper(Currency.USD, Monthly, HomeDelivery, Everyday))
    PaperValidation.passes(requestDeliveredToUs) shouldBe false
  }

  it should "succeed if the country is UK and the currency is GBP" in {
    val requestDeliveredToUs = validPaperRequest
    PaperValidation.passes(requestDeliveredToUs) shouldBe true
  }

  it should "fail if there is no first delivery date" in {
    val requestDeliveredToUs = validPaperRequest.copy(firstDeliveryDate = None)
    PaperValidation.passes(requestDeliveredToUs) shouldBe false
  }

  it should "fail when missing an address data for billing and delivery address" in {
      val emptyAddress = Address(
        lineOne = None,
        lineTwo = None,
        city = None,
        state = None,
        postCode = None,
        country = Country.UK
      )
      val requestMissingAddressLineAndCity = validPaperRequest.copy(billingAddress = emptyAddress, deliveryAddress = Some(emptyAddress))
      PaperValidation.passes(requestMissingAddressLineAndCity) shouldBe false
  }

  it should "not allow corporate redemptions for paper products" in {
    val requestWithCorporateRedemption = validPaperRequest.copy(paymentFields = Right(RedemptionData(RedemptionCode("test-code-123").right.get)))
    PaperValidation.passes(requestWithCorporateRedemption) shouldBe false
  }

}

object TestData {

  val validDigitalPackRequest = CreateSupportWorkersRequest(
    title = None,
    firstName = "grace",
    lastName = "hopper",
    product = DigitalPack(Currency.USD, Monthly),
    firstDeliveryDate = None,
    paymentFields = Left(StripePaymentMethodPaymentFields(PaymentMethodId("test_token").get, Some(StripePaymentType.StripeCheckout))),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    billingAddress = Address(
      Some("123 easy street"),
      None,
      Some("arlington"),
      state = Some("VA"),
      postCode = Some("111111"),
      country = Country.US,
    ),
    deliveryAddress = None,
    giftRecipient = None,
    deliveryInstructions = None,
    debugInfo = None
  )

  val someDateNextMonth = new LocalDate().plusMonths(1)
  val paperAddress = Address(
    lineOne = Some("Address Line 1"),
    lineTwo = Some("Address Line 2"),
    city = Some("Address Town"),
    state = None,
    postCode = Some("N1 9AG"),
    country = Country.UK
  )
  val validPaperRequest = CreateSupportWorkersRequest(
    title = None,
    firstName = "grace",
    lastName = "hopper",
    product = Paper(Currency.GBP, Monthly, HomeDelivery, Everyday),
    firstDeliveryDate = Some(someDateNextMonth),
    paymentFields = Left(StripePaymentMethodPaymentFields(PaymentMethodId("test_token").get, Some(StripePaymentType.StripeCheckout))),
    ophanIds = OphanIds(None, None, None),
    referrerAcquisitionData = ReferrerAcquisitionData(None, None, None, None, None, None, None, None, None, None, None, None),
    supportAbTests = Set(),
    email = "grace@gracehopper.com",
    telephoneNumber = None,
    promoCode = None,
    billingAddress = paperAddress,
    deliveryAddress = Some(paperAddress),
    giftRecipient = None,
    deliveryInstructions = None,
    debugInfo = None
  )

}
