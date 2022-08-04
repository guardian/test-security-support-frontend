import {
	combineReducers,
	configureStore,
	createListenerMiddleware,
} from '@reduxjs/toolkit';
import { fireEvent, screen } from '@testing-library/react';
import { digitalProducts } from '__mocks__/productInfoMocks';
import { renderWithStore } from '__test-utils__/render';
import { isSwitchOn } from 'helpers/globalsAndSwitches/globals';
import { addAddressSideEffects } from 'helpers/redux/checkout/address/sideEffects';
import { setInitialCommonState } from 'helpers/redux/commonState/actions';
import { commonReducer } from 'helpers/redux/commonState/reducer';
import type { SubscriptionsStartListening } from 'helpers/redux/subscriptionsStore';
import type { WithDeliveryCheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { createReducer } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import DigitalCheckoutFormGift from './digitalCheckoutFormGift';

function setUpStore(initialState: WithDeliveryCheckoutState) {
	const listenerMiddleware = createListenerMiddleware();

	const store = configureStore({
		reducer: combineReducers({
			page: createReducer(),
			common: commonReducer,
		}),
		preloadedState: initialState,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().prepend(listenerMiddleware.middleware),
	});

	addAddressSideEffects(
		listenerMiddleware.startListening as SubscriptionsStartListening,
	);

	store.dispatch(setInitialCommonState(initialState.common));

	return store;
}

jest.mock('helpers/globalsAndSwitches/globals', () => ({
	__esModule: true,
	isSwitchOn: jest.fn(),
	getSettings: jest.fn(),
	getGlobal: jest.fn(),
}));

const mock = (mockFn: unknown) => mockFn as jest.Mock;

describe('Digital gift checkout form', () => {
	// Suppress warnings related to our version of Redux and improper JSX
	console.warn = jest.fn();
	console.error = jest.fn();

	let initialState: unknown;
	beforeEach(() => {
		initialState = {
			page: {
				checkout: {
					formErrors: [],
				},
				checkoutForm: {
					billingAddress: {
						fields: {
							country: 'GB',
							errors: [],
						},
					},
					product: {
						productType: 'DigitalPack',
						billingPeriod: 'Monthly',
						productOption: 'NoProductOptions',
						fulfilmentOption: 'NoFulfilmentOptions',
						productPrices: digitalProducts,
					},
				},
			},
			common: {
				internationalisation: {
					countryGroupId: 'GBPCountries',
					countryId: 'GB',
					currencyId: 'GBP',
				},
			},
		};
	});

	describe('Payment methods', () => {
		describe('with all switches on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(() => true);

				renderWithStore(<DigitalCheckoutFormGift />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('shows all payment options', () => {
				expect(screen.queryByText('PayPal')).toBeInTheDocument();
				expect(screen.queryByText('Direct debit')).toBeInTheDocument();
				expect(screen.queryByText('Credit/Debit card')).toBeInTheDocument();
			});

			it('shows the direct debit option when the currency is GBP and the billing address is in the UK', () => {
				expect(screen.queryByText('Direct debit')).toBeInTheDocument();
			});

			it('does not show the direct debit option when the currency is not GBP', async () => {
				const countrySelect = await screen.findByLabelText('Country');
				fireEvent.change(countrySelect, {
					target: {
						value: 'US',
					},
				});
				expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
			});
		});

		describe('with only paypal switch on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(
					(key) => key === 'subscriptionsPaymentMethods.paypal',
				);

				renderWithStore(<DigitalCheckoutFormGift />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('does not show the direct debit option', () => {
				expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
			});
			it('does not show the credit/debit card option', () => {
				expect(screen.queryByText('Credit/Debit card')).not.toBeInTheDocument();
			});
		});

		describe('with only direct debit switch on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(
					(key) => key === 'subscriptionsPaymentMethods.directDebit',
				);

				renderWithStore(<DigitalCheckoutFormGift />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('does not show the direct debit option', () => {
				expect(screen.queryByText('PayPal')).not.toBeInTheDocument();
			});
			it('does not show the credit/debit card option', () => {
				expect(screen.queryByText('Credit/Debit card')).not.toBeInTheDocument();
			});
		});

		describe('with only credit/debit card switch on', () => {
			beforeEach(() => {
				mock(isSwitchOn).mockImplementation(
					(key) => key === 'subscriptionsPaymentMethods.creditCard',
				);

				renderWithStore(<DigitalCheckoutFormGift />, {
					initialState,
					// @ts-expect-error -- Type mismatch is unimportant for tests
					store: setUpStore(initialState),
				});
			});

			it('does not show the direct debit option', () => {
				expect(screen.queryByText('PayPal')).not.toBeInTheDocument();
			});
			it('does not show the credit/debit card option', () => {
				expect(screen.queryByText('Direct debit')).not.toBeInTheDocument();
			});
		});
	});
});
