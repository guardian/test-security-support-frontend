import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import type { SubscriptionProduct } from 'helpers/productPrice/subscriptions';
import type { PersonalDetailsState } from 'helpers/redux/checkout/personalDetails/state';
import type {
	AnyCheckoutState,
	CheckoutState,
} from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import type { FormError } from 'helpers/subscriptionsForms/validation';
import type { Option } from 'helpers/types/option';
import type { Title } from 'helpers/user/details';

export type Stage = 'checkout' | 'thankyou' | 'thankyou-pending';

type GiftingFields = {
	titleGiftRecipient?: Title;
	firstNameGiftRecipient: string;
	lastNameGiftRecipient: string;
	emailGiftRecipient: string;
	giftMessage?: string;
	giftDeliveryDate?: string;
};

export type FormFields = PersonalDetailsState &
	GiftingFields & {
		billingPeriod: BillingPeriod;
		paymentMethod: Option<PaymentMethod>;
		startDate: Option<string>;
		billingAddressIsSame: boolean;
		fulfilmentOption: FulfilmentOptions;
		product: SubscriptionProduct;
		productOption: ProductOptions;
		orderIsAGift?: boolean;
		deliveryInstructions: Option<string>;
		csrUsername?: string;
		salesforceCaseId?: string;
	};
export type FormField = keyof FormFields | 'recaptcha';
export type FormState = Omit<
	FormFields,
	keyof PersonalDetailsState | keyof GiftingFields
> & {
	stage: Stage;
	product: SubscriptionProduct;
	formErrors: Array<FormError<FormField>>;
	submissionError: Option<ErrorReason>;
	formSubmitted: boolean;
	isTestUser: boolean;
	productPrices: ProductPrices;
	payPalHasLoaded: boolean;
	stripePaymentMethod: Option<string>;
	debugInfo: string;
};

function getFormFields(state: AnyCheckoutState): FormFields {
	return {
		title: state.page.checkoutForm.personalDetails.title,
		firstName: state.page.checkoutForm.personalDetails.firstName,
		lastName: state.page.checkoutForm.personalDetails.lastName,
		email: state.page.checkoutForm.personalDetails.email,
		confirmEmail: state.page.checkoutForm.personalDetails.confirmEmail,
		isSignedIn: state.page.checkoutForm.personalDetails.isSignedIn,
		userTypeFromIdentityResponse:
			state.page.checkoutForm.personalDetails.userTypeFromIdentityResponse,
		telephone: state.page.checkoutForm.personalDetails.telephone,
		titleGiftRecipient: state.page.checkoutForm.gifting.title,
		firstNameGiftRecipient: state.page.checkoutForm.gifting.firstName,
		lastNameGiftRecipient: state.page.checkoutForm.gifting.lastName,
		emailGiftRecipient: state.page.checkoutForm.gifting.email,
		startDate: state.page.checkout.startDate,
		billingPeriod: state.page.checkout.billingPeriod,
		paymentMethod: state.page.checkout.paymentMethod,
		fulfilmentOption: state.page.checkout.fulfilmentOption,
		productOption: state.page.checkout.productOption,
		product: state.page.checkout.product,
		billingAddressIsSame: state.page.checkout.billingAddressIsSame,
		orderIsAGift: state.page.checkout.orderIsAGift,
		deliveryInstructions: state.page.checkout.deliveryInstructions,
		giftMessage: state.page.checkoutForm.gifting.giftMessage,
		giftDeliveryDate: state.page.checkoutForm.gifting.giftDeliveryDate,
	};
}

function getEmail(state: CheckoutState): string {
	return state.page.checkoutForm.personalDetails.email;
}

export { getFormFields, getEmail };
