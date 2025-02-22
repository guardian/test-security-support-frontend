// ----- Routes ----- //
import type { PaperFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import type { Option } from 'helpers/types/option';
import type { CountryGroupId } from '../internationalisation/countryGroup';
import { countryGroups } from '../internationalisation/countryGroup';
import {
	addQueryParamsToURL,
	getAllQueryParams,
	getOrigin,
	isProd,
} from './url';
import 'helpers/types/option';

const routes: Record<string, string> = {
	recurringContribCheckout: '/contribute/recurring',
	recurringContribCreate: '/contribute/recurring/create',
	recurringContribPending: '/contribute/recurring/pending',
	contributionsSendMarketing: '/contribute/send-marketing',
	getUserType: '/identity/get-user-type',
	contributionsMarketingConfirm: '/contribute/marketing-confirm',
	payPalSetupPayment: '/paypal/setup-payment',
	payPalCreateAgreement: '/paypal/create-agreement',
	payPalOneClickCheckout: '/paypal/one-click-checkout',
	directDebitCheckAccount: '/direct-debit/check-account',
	payPalRestReturnURL: '/paypal/rest/return',
	subscriptionCreate: '/subscribe/create',
	subscriptionsLanding: '/subscribe',
	digitalSubscriptionLanding: '/subscribe/digitaledition',
	digitalSubscriptionLandingGift: '/subscribe/digital/gift',
	paperSubscriptionLanding: '/subscribe/paper',
	paperSubscriptionProductChoices: '/subscribe/paper#HomeDelivery',
	paperSubscriptionDeliveryProductChoices:
		'/subscribe/paper/delivery#HomeDelivery',
	guardianWeeklySubscriptionLanding: '/subscribe/weekly',
	guardianWeeklySubscriptionLandingGift: '/subscribe/weekly/gift',
	guardianWeeklyStudent:
		'https://connect.studentbeans.com/v4/hosted/the-guardian-weekly/uk',
	postcodeLookup: '/postcode-lookup',
	createSignInUrl: '/identity/signin-url',
	stripeSetupIntentRecaptcha: '/stripe/create-setup-intent/recaptcha',
};
const createOneOffReminderEndpoint = isProd()
	? 'https://support.theguardian.com/reminders/create/one-off'
	: 'https://support.code.dev-theguardian.com/reminders/create/one-off';
const createRecurringReminderEndpoint = isProd()
	? 'https://support.theguardian.com/reminders/create/recurring'
	: 'https://support.code.dev-theguardian.com/reminders/create/recurring';

const countryPath = (countryGroupId: CountryGroupId) =>
	countryGroups[countryGroupId].supportInternationalisationId;

function postcodeLookupUrl(postcode: string): string {
	return `${getOrigin() + routes.postcodeLookup}/${postcode}`;
}

function paperSubsUrl(
	paperFulfulmentOption?: PaperFulfilmentOptions,
	promoCode?: Option<string>,
): string {
	const baseURL = [getOrigin(), 'uk/subscribe/paper'].join('/');
	const queryParams = [
		...getAllQueryParams(),
		...(promoCode ? [['promoCode', promoCode]] : []),
	];
	const queryParamsString = queryParams
		.map((keyValuePair) => keyValuePair.join('='))
		.join('&');

	const hash = paperFulfulmentOption ? `#${paperFulfulmentOption}` : '';

	if (queryParamsString) {
		return `${baseURL}?${queryParamsString}${hash}`;
	}

	return baseURL;
}

function digitalSubscriptionLanding(
	countryGroupId: CountryGroupId,
	gift: boolean,
) {
	return `${getOrigin()}/${countryPath(countryGroupId)}${
		gift
			? routes.digitalSubscriptionLandingGift
			: routes.digitalSubscriptionLanding
	}`;
}

function guardianWeeklyLanding(countryGroupId: CountryGroupId, gift: boolean) {
	return `${getOrigin()}/${countryPath(countryGroupId)}${
		gift
			? routes.guardianWeeklySubscriptionLandingGift
			: routes.guardianWeeklySubscriptionLanding
	}`;
}

const promotionTermsUrl = (promoCode: string) =>
	`${getOrigin()}/p/${promoCode}/terms`;

function paperCheckoutUrl(
	fulfilmentOption: FulfilmentOptions,
	productOptions: ProductOptions,
	promoCode?: Option<string>,
) {
	const url = `${getOrigin()}/subscribe/paper/checkout`;
	return addQueryParamsToURL(url, {
		promoCode,
		fulfilment: fulfilmentOption,
		product: productOptions,
	});
}

// If the user cancels before completing the payment flow, send them back to the contribute page.
function payPalCancelUrl(cgId: CountryGroupId): string {
	return `${getOrigin()}/${countryPath(cgId)}/contribute`;
}

function payPalReturnUrl(cgId: CountryGroupId, email: string): string {
	return `${getOrigin()}/${countryPath(
		cgId,
	)}/paypal/rest/return?email=${encodeURIComponent(email)}`;
}

// ----- Exports ----- //
export {
	routes,
	createOneOffReminderEndpoint,
	createRecurringReminderEndpoint,
	postcodeLookupUrl,
	payPalCancelUrl,
	payPalReturnUrl,
	paperSubsUrl,
	paperCheckoutUrl,
	digitalSubscriptionLanding,
	guardianWeeklyLanding,
	promotionTermsUrl,
};
