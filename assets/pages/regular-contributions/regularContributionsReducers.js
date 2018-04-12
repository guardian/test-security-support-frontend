// @flow

// ----- Imports ----- //

import { combineReducers } from 'redux';

import type { User as UserState } from 'helpers/user/userReducer';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { DirectDebitState } from 'components/directDebit/directDebitReducer';
import { userReducer as user } from 'helpers/user/userReducer';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import { marketingConsentReducerFor } from 'containerisableComponents/marketingConsent/marketingConsentReducer';
import csrf from 'helpers/csrf/csrfReducer';
import type { CommonState } from 'helpers/page/page';
import type { Currency } from 'helpers/internationalisation/currency';
import type { Action } from './regularContributionsActions';
import type { PaymentStatus, PayPalButtonType } from './components/regularContributionsPayment';


// ----- Types ----- //

export type State = {
  amount: number,
  currency: Currency,
  error: ?string,
  paymentStatus: PaymentStatus,
  paymentMethod: ?string,
  payPalType: PayPalButtonType,
  payPalHasLoaded: boolean,
  statusUri: ?string,
  pollCount: number,
};

export type CombinedState = {
  regularContrib: State,
  user: UserState,
  csrf: CsrfState,
  directDebit: DirectDebitState
};

export type PageState = {
  common: CommonState,
  page: CombinedState,
};


// ----- Reducers ----- //

function createRegularContribReducer(amount: number, currency: Currency) {

  const initialState: State = {
    amount,
    currency,
    error: null,
    paymentStatus: 'NotStarted',
    paymentMethod: null,
    payPalType: 'NotSet',
    payPalHasLoaded: false,
    statusUri: null,
    pollCount: 0,
  };

  return function regularContrib(state: State = initialState, action: Action): State {
    switch (action.type) {

      case 'CHECKOUT_PENDING':
        return Object.assign({}, state, { paymentStatus: 'PollingTimedOut', paymentMethod: action.paymentMethod });

      case 'CHECKOUT_SUCCESS':
        return Object.assign({}, state, { paymentStatus: 'Success', paymentMethod: action.paymentMethod });

      case 'CHECKOUT_ERROR':
        return Object.assign({}, state, { paymentStatus: 'Failed', error: action.message });

      case 'CREATING_CONTRIBUTOR':
        return Object.assign({}, state, { paymentStatus: 'Pending' });

      case 'SET_PAYPAL_BUTTON':
        return Object.assign({}, state, { payPalType: action.value });

      case 'SET_PAYPAL_HAS_LOADED':
        return Object.assign({}, state, { payPalHasLoaded: true });

      default:
        return state;

    }
  };
}


// ----- Exports ----- //

export default function createRootRegularContributionsReducer(amount: number, currency: Currency) {
  return combineReducers({
    regularContrib: createRegularContribReducer(amount, currency),
    marketingConsent: marketingConsentReducerFor('CONTRIBUTIONS_THANK_YOU'),
    user,
    csrf,
    directDebit,
  });
}
