// @flow

// ----- Imports ----- //

import React from 'react';
import { Provider } from 'react-redux';

import SimpleHeader from 'components/headers/simpleHeader/simpleHeader';
import Footer from 'components/footer/footer';

import { init as pageInit } from 'helpers/page/page';
import { renderPage } from 'helpers/render';
import { getQueryParameter } from 'helpers/url';

import Introduction from './components/introduction';
import Bundles from './components/bundles';
import StackedBundle from './components/stackedBundle';
import WhySupport from './components/whySupport';
import WaysOfSupport from './components/waysOfSupport';
import reducer from './bundlesLandingReducers';

// ----- Redux Store ----- //

/* eslint-disable no-underscore-dangle */
const store = pageInit(
  reducer,
  null,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
);
/* eslint-enable */


// ----- Render ----- //

const bundle: ?string = getQueryParameter('bundle');

let bundlesSelected;

if (bundle === 'contribute') {
  bundlesSelected = <StackedBundle products={['CONTRIBUTE']} />;
} else if (bundle === 'subscribe') {
  bundlesSelected = <StackedBundle products={['PAPER_SUBSCRIPTION', 'DIGITAL_SUBSCRIPTION']} />;
} else if (bundle === 'contribute-and-digipack') {
  bundlesSelected = <Bundles products={['CONTRIBUTE', 'DIGITAL_SUBSCRIPTION']} />;
} else {
  bundlesSelected = <StackedBundle products={['CONTRIBUTE', 'PAPER_SUBSCRIPTION', 'DIGITAL_SUBSCRIPTION']} />;
}

const whyAndWaysOfSupport = (bundle === 'contribute')
  ? ''
  : (
    [<WhySupport />, <WaysOfSupport />]
  );

const content = (
  <Provider store={store}>
    <div className="gu-content">
      <SimpleHeader />
      <Introduction />
      {bundlesSelected}
      {whyAndWaysOfSupport}
      <Footer privacyPolicy disclaimer />
    </div>
  </Provider>
);

renderPage(content, 'bundles-landing-page');
