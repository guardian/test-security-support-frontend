// @flow
// $FlowIgnore - required for hooks
import { useEffect, useState } from 'react';
import { loadStripe, type Stripe as StripeSDK } from '@stripe/stripe-js/pure';
import { onConsentChange } from '@guardian/consent-management-platform';
import { type PaymentMethod, Stripe } from 'helpers/paymentMethods';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { ContributionType } from 'helpers/contributions';

const stripeCardFormIsIncomplete = (
  paymentMethod: PaymentMethod,
  stripeCardFormComplete: boolean,
): boolean =>
  paymentMethod === Stripe &&
  !(stripeCardFormComplete);

export type StripeAccount = 'ONE_OFF' | 'REGULAR';

const stripeAccountForContributionType: {[ContributionType]: StripeAccount } = {
  ONE_OFF: 'ONE_OFF',
  MONTHLY: 'REGULAR',
  ANNUAL: 'REGULAR',
};

function getStripeKey(stripeAccount: StripeAccount, country: IsoCountry, isTestUser: boolean): string {
  switch (country) {
    case 'AU':
      return isTestUser ?
        window.guardian.stripeKeyAustralia[stripeAccount].uat :
        window.guardian.stripeKeyAustralia[stripeAccount].default;
    case 'US':
      return isTestUser ?
        window.guardian.stripeKeyUnitedStates[stripeAccount].uat :
        window.guardian.stripeKeyUnitedStates[stripeAccount].default;
    default:
      return isTestUser ?
        window.guardian.stripeKeyDefaultCurrencies[stripeAccount].uat :
        window.guardian.stripeKeyDefaultCurrencies[stripeAccount].default;
  }
}
//  this is required as useStripeObjects is used in multiple components
//  but we only want to call setLoadParameters once.
const stripeScriptHasBeenAddedToPage = (): boolean =>
  !!document.querySelector('script[src^=\'https://js.stripe.com\']');

export const useStripeObjects = (stripeAccount: StripeAccount, stripeKey: string, isTestUser: boolean) => {
  const [stripeObjects, setStripeObjects] = useState<{[StripeAccount]: StripeSDK | null}>({
    REGULAR: null,
    ONE_OFF: null,
  });
  useEffect(
    () => {
      if (stripeObjects[stripeAccount] === null) {
        new Promise((resolve) => {
          if (isTestUser) {
            resolve(false);
          } else {
            onConsentChange(({ ccpa, tcfv2 }) => {
              if (ccpa) {
                resolve(true);
              }
              if (tcfv2 && tcfv2.consents[1]) {
                resolve(true);
              }
              resolve(false);
            });
          }
        }).then((hasRequiredConsentsForFraudDetection) => {
          if (!stripeScriptHasBeenAddedToPage()) {
            loadStripe.setLoadParameters({ advancedFraudSignals: hasRequiredConsentsForFraudDetection });
          }
          return loadStripe(stripeKey);
        }).then((newStripe) => {
          setStripeObjects(prevData => ({ ...prevData, [stripeAccount]: newStripe }));
        });
      }
    },
    [stripeAccount],
  );

  return stripeObjects;
};


export {
  stripeCardFormIsIncomplete,
  stripeAccountForContributionType,
  getStripeKey,
};
