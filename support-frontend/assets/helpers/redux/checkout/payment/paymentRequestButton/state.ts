import type { ErrorReason } from 'helpers/forms/errorReasons';
import type { StripeAccount } from 'helpers/forms/stripe';

type StripePaymentRequestButtonData = {
	buttonClicked: boolean;
	completed: boolean;
	paymentError?: ErrorReason;
};

export type PaymentRequestError = {
	account: StripeAccount;
	error: ErrorReason;
};

export type PaymentRequestButtonState = Record<
	StripeAccount,
	StripePaymentRequestButtonData
>;

export const initialPaymentRequestButtonState: PaymentRequestButtonState = {
	ONE_OFF: {
		buttonClicked: false,
		completed: false,
	},
	REGULAR: {
		buttonClicked: false,
		completed: false,
	},
};
