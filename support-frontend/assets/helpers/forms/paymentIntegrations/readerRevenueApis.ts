import type { Country } from '@guardian/consent-management-platform/dist/types/countries';
import type { PaymentIntentResult, PaymentMethod } from '@stripe/stripe-js';
import {
	fetchJson,
	getRequestOptions,
	requestOptions,
} from 'helpers/async/fetch';
import { logPromise, pollUntilPromise } from 'helpers/async/promise';
import type { ErrorReason } from 'helpers/forms/errorReasons';
import {
	AmazonPay,
	DirectDebit,
	ExistingCard,
	ExistingDirectDebit,
	PayPal,
	Sepa,
	Stripe,
} from 'helpers/forms/paymentMethods';
import type {
	CaState,
	IsoCountry,
	UsState,
} from 'helpers/internationalisation/country';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { ReaderType } from 'helpers/productPrice/readerType';
import type {
	DigitalPack,
	GuardianWeekly,
	Paper,
} from 'helpers/productPrice/subscriptions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import type {
	AcquisitionABTest,
	OphanIds,
	ReferrerAcquisitionData,
} from 'helpers/tracking/acquisitions';
import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';
import { logException } from 'helpers/utilities/logger';

// ----- Types ----- //
export type StripePaymentMethod =
	| 'StripeCheckout'
	| 'StripeElements'
	// We use Stripe’s payment request button element
	// (https://stripe.com/docs/stripe-js/elements/payment-request-button) for
	// taking Apple Pay and Google Pay payments (and possibly a third wallet I’m
	// unaware of).
	// However, we still use these values to distinguish Apple Pay payments from
	// non-Apple Pay payments. Therefore `StripeApplePay` means ”Apple Pay, via
	// the payment request button”, and `StripePaymentRequestButton` means “any
	// non-Apple-Pay payment method (wallet) that uses the payment request
	// button”
	| 'StripeApplePay'
	| 'StripePaymentRequestButton';
export type StripePaymentRequestButtonMethod = 'none' | StripePaymentMethod;
type RegularContribution = {
	productType: 'Contribution';
	amount: number;
	currency: string;
	billingPeriod: BillingPeriod;
};
type SupporterPlus = {
	productType: 'SupporterPlus';
	amount: number;
	currency: string;
	billingPeriod: BillingPeriod;
};
export type DigitalSubscription = {
	productType: typeof DigitalPack;
	currency: string;
	billingPeriod: BillingPeriod;
	readerType: ReaderType;
	amount?: number;
};
export type PaperSubscription = {
	productType: typeof Paper;
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
	productOptions: ProductOptions;
	deliveryAgent?: number;
};
export type GuardianWeeklySubscription = {
	productType: typeof GuardianWeekly;
	currency: string;
	billingPeriod: BillingPeriod;
	fulfilmentOptions: FulfilmentOptions;
};
export type SubscriptionProductFields =
	| SupporterPlus
	| DigitalSubscription
	| PaperSubscription
	| GuardianWeeklySubscription;
type ProductFields = RegularContribution | SubscriptionProductFields;
type RegularPayPalPaymentFields = {
	baid: string;
};
type RegularStripePaymentIntentFields = {
	paymentMethod: string | PaymentMethod;
	// The ID of the Stripe Payment Method
	stripePaymentType: StripePaymentMethod; // The type of Stripe payment, e.g. Apple Pay
};
type RegularDirectDebitPaymentFields = {
	accountHolderName: string;
	sortCode: string;
	accountNumber: string;
	recaptchaToken?: string;
};
type RegularSepaPaymentFields = {
	accountHolderName: string;
	iban: string;
	country?: Option<Country>;
	streetName?: Option<string>;
};
type GiftRedemption = {
	redemptionCode: string;
};
type RegularExistingPaymentFields = {
	billingAccountId: string;
};
type RegularAmazonPayPaymentFields = {
	amazonPayBillingAgreementId: string;
};
export type RegularPaymentFields =
	| RegularPayPalPaymentFields
	| RegularStripePaymentIntentFields
	| RegularDirectDebitPaymentFields
	| RegularSepaPaymentFields
	| RegularExistingPaymentFields
	| GiftRedemption
	| RegularAmazonPayPaymentFields;
export type RegularPaymentRequestAddress = {
	country: IsoCountry;
	state: UsState | CaState | null;
	lineOne: Option<string>;
	lineTwo: Option<string>;
	postCode: Option<string>;
	city: Option<string>;
};
type GiftRecipientType = {
	title?: Title;
	firstName: string;
	lastName: string;
	email?: string;
	message?: string;
	deliveryDate?: string;
};
// The model that is sent to support-workers
export type RegularPaymentRequest = {
	title?: Title;
	firstName: string;
	lastName: string;
	billingAddress: RegularPaymentRequestAddress;
	deliveryAddress?: RegularPaymentRequestAddress;
	email: string;
	giftRecipient?: GiftRecipientType;
	product: ProductFields;
	firstDeliveryDate: Option<string>;
	paymentFields: RegularPaymentFields;
	ophanIds: OphanIds;
	referrerAcquisitionData: ReferrerAcquisitionData;
	supportAbTests: AcquisitionABTest[];
	telephoneNumber?: string;
	promoCode?: Option<string>;
	deliveryInstructions?: string;
	csrUsername?: string;
	salesforceCaseId?: string;
	recaptchaToken?: string;
	debugInfo: string;
	threeTierCreateSupporterPlusSubscription?: boolean;
};
export type StripePaymentIntentAuthorisation = {
	paymentMethod: typeof Stripe;
	stripePaymentMethod: StripePaymentMethod;
	paymentMethodId: string | PaymentMethod;
	handle3DS?: (clientSecret: string) => Promise<PaymentIntentResult>;
};
export type PayPalAuthorisation = {
	paymentMethod: typeof PayPal;
	token: string;
};
export type DirectDebitAuthorisation = {
	paymentMethod: typeof DirectDebit;
	accountHolderName: string;
	sortCode: string;
	accountNumber: string;
};
export type SepaAuthorisation = {
	paymentMethod: typeof Sepa;
	accountHolderName: string;
	iban: string;
	country?: Country;
	streetName?: string;
};
export type ExistingCardAuthorisation = {
	paymentMethod: typeof ExistingCard;
	billingAccountId: string;
};
export type ExistingDirectDebitAuthorisation = {
	paymentMethod: typeof ExistingDirectDebit;
	billingAccountId: string;
};
export type AmazonPayAuthorisation = {
	paymentMethod: typeof AmazonPay;
	orderReferenceId?: string;
	amazonPayBillingAgreementId?: string;
};
// Represents an authorisation to execute payments with a given payment method.
// This will generally be supplied by third-party code (Stripe, PayPal, GoCardless).
// It applies both to one-off payments, where it is sent to the Payment API which
// immediately executes the payment, and recurring, where it ultimately ends up in Zuora
// which uses it to execute payments in the future.
export type PaymentAuthorisation =
	| StripePaymentIntentAuthorisation
	| PayPalAuthorisation
	| DirectDebitAuthorisation
	| SepaAuthorisation
	| ExistingCardAuthorisation
	| ExistingDirectDebitAuthorisation
	| AmazonPayAuthorisation;

type Status = 'failure' | 'pending' | 'success';

// Represents the end state of the checkout process,
// standardised across payment methods & contribution types.
// The only method/type combination which will not make use of this PayPal one-off,
// because the end of that checkout happens on the backend after the user is redirected to our site.
export type PaymentResult = {
	paymentStatus: Status;
	subscriptionCreationPending?: true;
	error?: ErrorReason;
};

type StatusResponse = {
	status: Status;
	trackingUri: string;
	failureReason?: ErrorReason;
};

// ----- Setup ----- //
const PaymentSuccess: PaymentResult = {
	paymentStatus: 'success',
};
const POLLING_INTERVAL = 3000;
const MAX_POLLS = 10;

// ----- Functions ----- //
function regularPaymentFieldsFromAuthorisation(
	authorisation: PaymentAuthorisation,
): RegularPaymentFields {
	switch (authorisation.paymentMethod) {
		case Stripe:
			if (authorisation.paymentMethodId) {
				return {
					paymentMethod: authorisation.paymentMethodId,
					stripePaymentType: authorisation.stripePaymentMethod,
				};
			}

			throw new Error(
				'Neither token nor paymentMethod found in authorisation data for Stripe recurring contribution',
			);

		case PayPal:
			return {
				baid: authorisation.token,
			};

		case DirectDebit:
			return {
				accountHolderName: authorisation.accountHolderName,
				sortCode: authorisation.sortCode,
				accountNumber: authorisation.accountNumber,
			};

		case Sepa:
			if (authorisation.country && authorisation.streetName) {
				return {
					accountHolderName: authorisation.accountHolderName,
					iban: authorisation.iban.replace(/ /g, ''),
					country: authorisation.country,
					streetName: authorisation.streetName,
				};
			} else {
				return {
					accountHolderName: authorisation.accountHolderName,
					iban: authorisation.iban.replace(/ /g, ''),
				};
			}

		case ExistingCard:
		case ExistingDirectDebit:
			return {
				billingAccountId: authorisation.billingAccountId,
			};

		case AmazonPay:
			if (authorisation.amazonPayBillingAgreementId) {
				return {
					amazonPayBillingAgreementId:
						authorisation.amazonPayBillingAgreementId,
				};
			}

			throw new Error(
				'Cant create a regular Amazon Pay authorisation for one off',
			);

		// TODO: what is a sane way to handle such cases?
		default:
			throw new Error('If Flow works, this cannot happen');
	}
}

/**
 * Process the response for a regular payment from the recurring contribution endpoint.
 *
 * If the payment is:
 * - pending, then we start polling the API until it's done or some timeout occurs
 * - failed, then we bubble up an error value
 * - otherwise, we bubble up a success value
 */
function checkRegularStatus(
	csrf: CsrfState,
): (statusResponse: StatusResponse) => Promise<PaymentResult> {
	const handleCompletion = (json: StatusResponse) => {
		switch (json.status) {
			case 'success':
			case 'pending':
				return PaymentSuccess;

			default: {
				const failureReason = json.failureReason
					? json.failureReason
					: 'unknown';
				const failureResult: PaymentResult = {
					paymentStatus: 'failure',
					error: failureReason,
				};
				return failureResult;
			}
		}
	};

	// Exhaustion of the maximum number of polls is considered a payment success
	const handleExhaustedPolls = (error: Error | undefined) => {
		if (error === undefined) {
			const exhaustedResult: PaymentResult = {
				paymentStatus: 'success',
				subscriptionCreationPending: true,
			};
			return exhaustedResult;
		}

		throw error;
	};

	return (statusResponse: StatusResponse) => {
		switch (statusResponse.status) {
			case 'pending':
				return logPromise(
					pollUntilPromise(
						MAX_POLLS,
						POLLING_INTERVAL,
						() =>
							fetchJson<StatusResponse>(
								statusResponse.trackingUri,
								getRequestOptions('same-origin', csrf),
							),
						(json2: StatusResponse) => json2.status === 'pending',
					)
						.then(handleCompletion)
						.catch(handleExhaustedPolls),
				);

			default:
				return Promise.resolve(handleCompletion(statusResponse));
		}
	};
}

/** Sends a regular payment request to the recurring contribution endpoint and checks the result */
function postRegularPaymentRequest(
	uri: string,
	data: RegularPaymentRequest,
	csrf: CsrfState,
): Promise<PaymentResult> {
	return logPromise(
		fetch(uri, requestOptions(data, 'same-origin', 'POST', csrf)),
	)
		.then((response: Response) => {
			if (response.status === 500) {
				logException(`500 Error while trying to post to ${uri}`);
				return {
					paymentStatus: 'failure',
					error: 'internal_error',
				} as PaymentResult;
			} else if (response.status === 400) {
				return response.text().then((text: string) => {
					logException(
						`Bad request error while trying to post to ${uri} - ${text}`,
					);
					return {
						paymentStatus: 'failure',
						error: text,
					} as PaymentResult;
				});
			}

			return response.json().then(checkRegularStatus(csrf));
		})
		.catch(() => {
			logException(`Error while trying to interact with ${uri}`);
			return {
				paymentStatus: 'failure',
				error: 'unknown',
			};
		});
}

export {
	postRegularPaymentRequest,
	regularPaymentFieldsFromAuthorisation,
	PaymentSuccess,
};
