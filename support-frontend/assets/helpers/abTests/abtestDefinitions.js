// @flow
import type { Tests } from './abtest';
import { USV1, AusAmounts, UkAmountsV1 } from './data/testAmountsData';
import { detect as detectCountryGroupId, GBPCountries } from 'helpers/internationalisation/countryGroup';

// ----- Tests ----- //

const usOnlyLandingPage = '/us/contribute(/.*)?$';
const auOnlyLandingPage = '/au/contribute(/.*)?$';
const ukOnlyLandingPage = '/uk/contribute(/.*)?$';
export const subsShowcaseAndDigiSubPages = '(/??/subscribe(\\?.*)?$|/??/subscribe/digital(\\?.*)?$)';
const digitalCheckout = '/subscribe/digital/checkout';

export const tests: Tests = {
  usAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: USV1,
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    targetPage: usOnlyLandingPage,
    seed: 5,
  },

  auAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: AusAmounts,
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    targetPage: auOnlyLandingPage,
    seed: 8,
  },

  ukAmountsTest: {
    type: 'AMOUNTS',
    variants: [
      {
        id: 'control',
      },
      {
        id: 'V1',
        amountsRegions: UkAmountsV1,
      },
    ],
    audiences: {
      ALL: {
        offset: 0,
        size: 1,
      },
    },
    isActive: true,
    referrerControlled: false,
    targetPage: ukOnlyLandingPage,
    seed: 9,
  },
};
