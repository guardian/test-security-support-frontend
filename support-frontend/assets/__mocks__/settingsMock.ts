import type { Settings } from 'helpers/globalsAndSwitches/settings';

export const mockSettings: Settings = {
	switches: {
		oneOffPaymentMethods: {
			stripe: 'On',
			stripeApplePay: 'On',
			stripePaymentRequestButton: 'On',
			payPal: 'On',
			amazonPay: 'On',
		},
		recurringPaymentMethods: {
			stripe: 'On',
			stripeApplePay: 'On',
			stripePaymentRequestButton: 'On',
			payPal: 'On',
			directDebit: 'Off',
			existingCard: 'On',
			existingDirectDebit: 'On',
			amazonPay: 'Off',
			sepa: 'On',
		},
		subscriptionsPaymentMethods: {
			directDebit: 'On',
			creditCard: 'On',
			paypal: 'On',
		},
		subscriptionsSwitches: {
			enableDigitalSubGifting: 'On',
			useDotcomContactPage: 'On',
			checkoutPostcodeLookup: 'Off',
		},
		featureSwitches: {
			enableQuantumMetric: 'On',
			usStripeAccountForSingle: 'On',
		},
		campaignSwitches: {
			enableContributionsCampaign: 'On',
			forceContributionsCampaign: 'Off',
		},
		recaptchaSwitches: {
			enableRecaptchaBackend: 'On',
			enableRecaptchaFrontend: 'On',
		},
		experiments: {},
	},
	amounts: [
		{
			testName: 'FALLBACK_AMOUNTS__GBPCountries',
			liveTestName: '',
			isLive: false,
			target: 'GBPCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 20,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__UnitedStates',
			liveTestName: '',
			isLive: false,
			target: 'UnitedStates',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__EURCountries',
			liveTestName: '',
			isLive: false,
			target: 'EURCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__International',
			liveTestName: '',
			isLive: false,
			target: 'International',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__Canada',
			liveTestName: '',
			isLive: false,
			target: 'Canada',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__AUDCountries',
			liveTestName: '',
			isLive: false,
			target: 'AUDCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
		{
			testName: 'FALLBACK_AMOUNTS__NZDCountries',
			liveTestName: '',
			isLive: false,
			target: 'NZDCountries',
			seed: 0,
			variants: [
				{
					variantName: 'CONTROL',
					defaultContributionType: 'MONTHLY',
					displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
					amountsCardData: {
						ONE_OFF: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						MONTHLY: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
						ANNUAL: {
							amounts: [5, 10, 15, 20],
							defaultAmount: 5,
							hideChooseYourAmount: false,
						},
					},
				},
			],
		},
	],
	contributionTypes: {
		GBPCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		UnitedStates: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		EURCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		International: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		Canada: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		AUDCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
		NZDCountries: [
			{ contributionType: 'ONE_OFF' },
			{ contributionType: 'MONTHLY', isDefault: true },
			{ contributionType: 'ANNUAL' },
		],
	},
	metricUrl:
		'https://metric-push-api-code.support.guardianapis.com/metric-push-api',
};

window.guardian = { ...window.guardian, settings: mockSettings };
