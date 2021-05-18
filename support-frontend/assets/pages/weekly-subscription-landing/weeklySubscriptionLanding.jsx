// @flow

// ----- Imports ----- //

import * as React from 'react';
import { Provider } from 'react-redux';

import Page from 'components/page/page';
import headerWithCountrySwitcherContainer
  from 'components/headers/header/headerWithCountrySwitcher';
import WeeklyFooter from 'components/footerCompliant/WeeklyFooter';

import {
  AUDCountries,
  Canada,
  type CountryGroupId,
  detect,
  EURCountries,
  GBPCountries,
  International,
  NZDCountries,
  UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { routes } from 'helpers/routes';

import FullWidthContainer from 'components/containers/fullWidthContainer';
import CentredContainer from 'components/containers/centredContainer';
import Block from 'components/page/block';
import GiftNonGiftCta from 'components/product/giftNonGiftCta';

import 'stylesheets/skeleton/skeleton.scss';

import { WeeklyHero } from './components/hero/hero';
import Benefits from './components/content/benefits';
import GiftBenefits from './components/content/giftBenefits';

import WeeklyProductPrices from './components/weeklyProductPrices';
import reducer from './weeklySubscriptionLandingReducer';

import './weeklySubscriptionLanding.scss';
import { promoQueryParam, getPromotionCopy } from 'helpers/productPrice/promotions';
import { promotionTermsUrl } from 'helpers/routes';
import { getQueryParameter } from 'helpers/url';

import { countryId, productPrices, promotionCopy, orderIsAGift } from './weeklySubscriptionLandingState';

// ----- Redux Store ----- //

const store = pageInit(() => reducer, true);

// ----- Internationalisation ----- //

const countryGroupId: CountryGroupId = detect();

const reactElementId: {
  [CountryGroupId]: string,
} = {
  GBPCountries: 'weekly-landing-page-uk',
  UnitedStates: 'weekly-landing-page-us',
  AUDCountries: 'weekly-landing-page-au',
  NZDCountries: 'weekly-landing-page-nz',
  EURCountries: 'weekly-landing-page-eu',
  Canada: 'weekly-landing-page-ca',
  International: 'weekly-landing-page-int',
};

const path = orderIsAGift ? routes.guardianWeeklySubscriptionLandingGift : routes.guardianWeeklySubscriptionLanding;
const giftNonGiftLink = orderIsAGift ?
  routes.guardianWeeklySubscriptionLanding : routes.guardianWeeklySubscriptionLandingGift;

const Header = headerWithCountrySwitcherContainer({
  path,
  countryGroupId,
  listOfCountryGroups: [
    GBPCountries,
    UnitedStates,
    AUDCountries,
    EURCountries,
    Canada,
    NZDCountries,
    International,
  ],
  trackProduct: 'GuardianWeekly',
});

// ----- Render ----- //

const sanitisedPromoCopy = getPromotionCopy(promotionCopy);
const defaultPromo = orderIsAGift ? 'GW20GIFT1Y' : '10ANNUAL';
const promoTermsLink = promotionTermsUrl(getQueryParameter(promoQueryParam) || defaultPromo);

// ID for Selenium tests
const pageQaId = `qa-guardian-weekly${orderIsAGift ? '-gift' : ''}`;

const WeeklyLandingPage = () => (
  <Provider store={store}>
    <Page
      id={pageQaId}
      header={<Header />}
      footer={<WeeklyFooter centred promoTermsLink={promoTermsLink} />}
    >
      <WeeklyHero
        orderIsAGift={orderIsAGift || false}
        countryGroupId={countryGroupId}
        promotionCopy={sanitisedPromoCopy}
      />
      <FullWidthContainer>
        <CentredContainer>
          <Block>
            {orderIsAGift ? <GiftBenefits /> : <Benefits />}
          </Block>
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="dark" hasOverlap>
        <CentredContainer>
          <WeeklyProductPrices
            countryId={countryId}
            productPrices={productPrices}
            orderIsAGift={orderIsAGift || false}
          />
        </CentredContainer>
      </FullWidthContainer>
      <FullWidthContainer theme="white">
        <CentredContainer>
          <GiftNonGiftCta product="Guardian Weekly" href={giftNonGiftLink} orderIsAGift={orderIsAGift || false} />
        </CentredContainer>
      </FullWidthContainer>
    </Page>
  </Provider>
);

renderPage(<WeeklyLandingPage />, reactElementId[countryGroupId]);
