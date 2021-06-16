/* eslint-disable react/no-unused-prop-types */
// @flow
import React, { Component, type Node } from 'react';
import { css } from '@emotion/core';
import { from } from '@guardian/src-foundations/mq';

import AdFreeSection from 'components/adFreeSection/adFreeSection';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import GridPicture from 'components/gridPicture/gridPicture';
import cx from 'classnames';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { ListHeading } from 'components/productPage/productPageList/productPageList';
import BlockLabel from 'components/blockLabel/blockLabel';
import { arrowSvg } from '../arrow';


const labelMobileMargin = css`
  margin-top: 20px;

  ${from.mobileLandscape} {
    margin-top: 25px;
  }

  ${from.tablet} {
    margin-top: 0;
  }
`;

const sectionLabel = css`
  ${from.tablet} {
    transform: translateY(-100%);
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const Plus = () => <BlockLabel cssOverrides={labelMobileMargin}>+ Plus</BlockLabel>;
type DropdownPropTypes = {
  children: Node,
  showDropDown: boolean,
  product: string,
}

const Dropdown = ({
  children, showDropDown, product,
}: DropdownPropTypes) => (
  <div
    id={`product-details-${product}`}
    className={cx('product-block__dropdown--hide', { 'product-block__dropdown--show': showDropDown })}
    aria-hidden={showDropDown ? 'false' : 'true'}
  >
    <span className="product-block__ul-handler">
      {children}
    </span>
  </div>
);

type ButtonPropTypes = {
  showDropDown: boolean,
  handleClick: Function,
  product: 'daily' | 'app',
}

const Button = ({
  showDropDown, handleClick, product,
}: ButtonPropTypes) => (
  <button
    aria-controls={`product-details-${product}`}
    aria-expanded={showDropDown ? 'true' : 'false'}
    onClick={handleClick}
    className={cx('product-block__button--hide', { 'product-block__button--show': showDropDown })}
  >
    <span className="product-block__button__text">
      <div className={showDropDown ? 'product-block__arrow--up' : 'product-block__arrow--down'}>{arrowSvg}</div>
      <span className="product-block__button__text--bold">
        {showDropDown ? 'Less detail' : 'More detail'}
      </span>
    </span>
  </button>
);

const dailyImage = (
  <GridPicture
    sources={[
      {
        gridId: 'editionsRowMobile',
        srcSizes: [140, 500],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'editionsRowDesktop',
        srcSizes: [140, 500, 1000],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="editionsRowDesktop"
    fallbackSize={500}
    altText=""
    fallbackImgType="png"
  />
);

const appImage = (
  <GridPicture
    sources={[
      {
        gridId: 'liveAppMobile',
        srcSizes: [140, 500],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'liveAppDesktop',
        srcSizes: [140, 500, 1000],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="liveAppDesktop"
    fallbackSize={500}
    altText=""
    fallbackImgType="png"
  />
);

type ProductCardPropTypes = {
  title: string,
  subtitle: string,
  image: Node,
  second: boolean,
}

const ProductCard = ({
  title, subtitle, image, second = false,
}: ProductCardPropTypes) => (
  <section className="product-block__item">
    <h3 className="product-block__item__title">{title}</h3>
    <p className="product-block__item__subtitle">
      <span className={`product-block__item__subtitle--desktop${second ? '--second' : ''}`}>{subtitle}</span>
    </p>
    <span className={`product-block__item__image${second ? '--second' : '--first-row'}`}>{image}</span>
  </section>
);

ProductCard.defaultProps = {
  shortSubTitle: '',
};

type StateTypes = {
  showDropDownDaily: boolean,
  showDropDownApp: boolean,
}


type PropTypes = {
  // eslint-ignore no-unused-prop-types
  countryGroupId: CountryGroupId,
}

class ProductBlock extends Component<PropTypes, StateTypes> {
  constructor(props: PropTypes) {
    super(props);
    this.state = {
      showDropDownDaily: false,
      showDropDownApp: false,
    };
  }

  handleClick = (product: string): void => {
    this.setState({
      [`showDropDown${product}`]: !this.state[`showDropDown${product}`],
    });
    const clickAction = this.state[`showDropDown${product}`] ? 'open' : 'close';
    sendTrackingEventsOnClick({
      id: `digital-subscriptions-landing-page--accordion--${product}--${clickAction}`,
      componentType: 'ACQUISITIONS_OTHER',
    })();
  }

  render() {
    const { state } = this;
    return (
      <div className="hope-is-power__products">
        <section className="product-block__container hope-is-power--centered">
          <BlockLabel tag="h2" cssOverrides={[sectionLabel, labelMobileMargin]}>What&apos;s included?</BlockLabel>
          <ProductCard
            title="UK Daily in The Guardian Editions app"
            subtitle="Each day&apos;s edition, in one simple, elegant app"
            image={dailyImage}
            second={false}
          />
          <Dropdown
            showDropDown={state.showDropDownDaily}
            product="daily"
          >
            <ListHeading
              items={[
                {
                  boldText: 'A new way to read',
                  explainer: 'The newspaper, reimagined for mobile and tablet',
                },
                { boldText: 'Published daily', explainer: 'Each edition available to read by 6am (GMT), 7 days a week' },
                { boldText: 'Easy to navigate', explainer: 'Read the complete edition, or swipe to the sections you care about' },
              ]}
            />
            <ListHeading
              items={[
                { boldText: 'Multiple devices', explainer: 'Beautifully designed for your mobile or tablet on iOS and Android' },
                { boldText: 'Read offline', explainer: 'Download and read whenever it suits you' },
                { boldText: 'Ad-free', explainer: 'Enjoy our journalism uninterrupted, without adverts' },
                { boldText: 'Enjoy our other editions', explainer: 'Australia Weekend and other special editions are all included in The Guardian Editions app as part of your subscription' },
              ]}
            />
          </Dropdown>
          <Button
            showDropDown={state.showDropDownDaily}
            handleClick={() => this.handleClick('Daily')}
            product="daily"
          />
          <Plus />
          <ProductCard
            title="Premium access to The Guardian Live app"
            subtitle="Live news, as it happens"
            image={appImage}
            second
          />
          <Dropdown
            showDropDown={state.showDropDownApp}
            product="app"
          >
            <ListHeading
              items={[
                { boldText: 'Live', explainer: 'Follow a live feed of breaking news and sport, as it happens' },
                { boldText: 'Discover', explainer: 'Explore stories you might have missed, tailored to you' },
                { boldText: 'Enhanced offline reading', explainer: 'Download the news whenever it suits you' },
              ]}
            />
            <ListHeading
              items={[
                { boldText: 'Daily Crossword', explainer: 'Play the daily crossword wherever you are' },
                { boldText: 'Ad-free', explainer: 'Enjoy our journalism uninterrupted, without adverts' },
              ]}
            />
          </Dropdown>
          <Button
            showDropDown={state.showDropDownApp}
            handleClick={() => this.handleClick('App')}
            product="app"
          />
          <Plus />
          <AdFreeSection />
        </section>
      </div>
    );

  }
}


export default ProductBlock;
