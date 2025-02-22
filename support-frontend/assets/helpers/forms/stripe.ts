import type { Stripe as StripeJs } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js/pure';
import { useEffect, useState } from 'react';
import type { ContributionType } from 'helpers/contributions';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { Stripe } from 'helpers/forms/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';

const stripeCardFormIsIncomplete = (
	paymentMethod: PaymentMethod,
	stripeCardFormComplete: boolean,
): boolean => paymentMethod === Stripe && !stripeCardFormComplete;

export type StripeAccount = 'ONE_OFF' | 'REGULAR';

export type StripePaymentIntentResult = {
	client_secret?: string;
};

const stripeAccountForContributionType: Record<
	ContributionType,
	StripeAccount
> = {
	ONE_OFF: 'ONE_OFF',
	MONTHLY: 'REGULAR',
	ANNUAL: 'REGULAR',
};

export interface StripeKey {
	ONE_OFF: {
		test: string;
		default: string;
	};
	REGULAR: {
		test: string;
		default: string;
	};
}

function getStripeKey(
	stripeAccount: StripeAccount,
	country: IsoCountry,
	isTestUser: boolean,
): string {
	switch (country) {
		case 'AU':
			return isTestUser
				? window.guardian.stripeKeyAustralia[stripeAccount].test
				: window.guardian.stripeKeyAustralia[stripeAccount].default;

		case 'US':
			return isTestUser
				? window.guardian.stripeKeyUnitedStates[stripeAccount].test
				: window.guardian.stripeKeyUnitedStates[stripeAccount].default;

		default:
			return isTestUser
				? window.guardian.stripeKeyDefaultCurrencies[stripeAccount].test
				: window.guardian.stripeKeyDefaultCurrencies[stripeAccount].default;
	}
}

//  this is required as useStripeObjects is used in multiple components
//  but we only want to call setLoadParameters once.
const stripeScriptHasBeenAddedToPage = (): boolean =>
	!!document.querySelector("script[src^='https://js.stripe.com']");

interface StripeObjects {
	ONE_OFF: StripeJs | null;
	REGULAR: StripeJs | null;
}

export const useStripeObjects = (
	stripeAccount: StripeAccount,
	stripeKey: string,
): StripeObjects => {
	const [stripeObjects, setStripeObjects] = useState<StripeObjects>({
		REGULAR: null,
		ONE_OFF: null,
	});

	useEffect(() => {
		if (stripeObjects[stripeAccount] === null) {
			if (!stripeScriptHasBeenAddedToPage()) {
				loadStripe.setLoadParameters({
					advancedFraudSignals: false,
				});
			}

			void loadStripe(stripeKey).then((newStripe) => {
				setStripeObjects((prevData) => ({
					...prevData,
					[stripeAccount]: newStripe,
				}));
			});
		}
	}, [stripeAccount]);
	return stripeObjects;
};

export function useStripeAccount(stripeKey: string): StripeJs | null {
	const [stripeSdk, setStripeSdk] = useState<StripeJs | null>(null);

	useEffect(() => {
		if (stripeSdk === null && stripeKey) {
			if (!stripeScriptHasBeenAddedToPage()) {
				loadStripe.setLoadParameters({
					advancedFraudSignals: false,
				});
			}

			void loadStripe(stripeKey).then((newStripe) => {
				setStripeSdk(newStripe);
			});
		}
	}, [stripeKey]);

	return stripeSdk;
}

export {
	stripeCardFormIsIncomplete,
	stripeAccountForContributionType,
	getStripeKey,
};
