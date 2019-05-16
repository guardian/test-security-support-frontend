// @flow

// ----- Imports ----- //

import { combineReducers, type Dispatch } from 'redux';
import { type DigitalBillingPeriod, Monthly } from 'helpers/billingPeriods';
import { getQueryParameter } from 'helpers/url';
import csrf from 'helpers/csrf/csrfReducer';
import { type IsoCountry } from 'helpers/internationalisation/country';
import { fromCountry, GBPCountries } from 'helpers/internationalisation/countryGroup';
import { directDebitReducer as directDebit } from 'components/directDebit/directDebitReducer';
import { marketingConsentReducerFor } from 'components/marketingConsent/marketingConsentReducer';
import { createUserReducer } from 'helpers/user/userReducer';
import { validateForm } from 'pages/digital-subscription-checkout/helpers/validation';
import type { Action } from 'helpers/subscriptionsForms/formActions';
import { showPaymentMethod } from './helpers/paymentProviders';
import { addressReducerFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import { DigitalPack } from 'helpers/subscriptions';
import { createCheckoutReducer } from 'helpers/subscriptionsForms/formReducer';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';


// ----- Functions ----- //

function submitForm(dispatch: Dispatch<Action>, state: CheckoutState) {
  if (validateForm(dispatch, state)) {
    showPaymentMethod(dispatch, state);
  }
}

// ----- Reducer ----- //xc

function initReducer(initialCountry: IsoCountry) {
  const billingPeriodInUrl = getQueryParameter('period');
  const initialBillingPeriod: DigitalBillingPeriod = billingPeriodInUrl === 'Monthly' || billingPeriodInUrl === 'Annual'
    ? billingPeriodInUrl
    : Monthly;

  return combineReducers({
    checkout: createCheckoutReducer(
      initialCountry,
      DigitalPack,
      initialBillingPeriod, null, null, null,
    ),
    user: createUserReducer(fromCountry(initialCountry) || GBPCountries),
    directDebit,
    billingAddress: addressReducerFor('billing', initialCountry),
    csrf,
    marketingConsent: marketingConsentReducerFor('MARKETING_CONSENT'),
  });
}


// ----- Export ----- //

export {
  initReducer,
  submitForm,
};
