/* eslint-disable react/no-unused-prop-types */
// @flow
import React, { Component, type Node } from 'react';
import AdFreeSection from 'components/adFreeSection/adFreeSection';
import { trackComponentClick } from 'helpers/tracking/behaviour';
import GridPicture from 'components/gridPicture/gridPicture';
import cx from 'classnames';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { ListHeading } from 'components/productPage/productPageList/productPageList';

// styles
import '../digitalSubscriptionLanding.scss';

const Plus = () => <div className="product-block__plus">+ Plus</div>;

const arrowSvg = (
  <svg width="18" height="10" xmlns="http://www.w3.org/2000/svg">
    <defs><path d="M16 0l1.427 1.428-7.035 7.036.035.035L9 9.927l-.035-.035-.036.035L7.5 8.5l.036-.035L.5 1.428 1.928 0l7.036 7.036L15.999 0z" id="a" /></defs>
    <use fill="#121212" xlinkHref="#a" fillRule="evenodd" />
  </svg>);

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

const weekendImage = (
  <GridPicture
    sources={[
      {
        gridId: 'weekendPackshotMobile',
        srcSizes: [140, 500],
        imgType: 'png',
        sizes: '90vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'weekendPackshotDesktop',
        srcSizes: [140, 500, 1000],
        imgType: 'png',
        sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="weekendPackshotDesktop"
    fallbackSize={500}
    altText=""
    fallbackImgType="png"
  />
);

const appImageAus = (
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
    fallbackImgType="jpg"
  />
);

type ProductCardPropTypes = {
  title: string,
  shortTitle: string,
  subtitle: Node,
  image: Node,
  first: boolean,
  secondImage: boolean,
}

const ProductCard = ({
  title, shortTitle, subtitle, image, first, secondImage,
}: ProductCardPropTypes) => (
  <section className="product-block__item">
    <h2 className={`product-block__item__title${first ? '--first' : ''}`}>
      <span className="product-block__item__title--desktop-Aus">{title}</span>
      <span className="product-block__item__title--mobile-Aus">{shortTitle}</span>
    </h2>
    <p className="product-block__item__subtitle">{subtitle}</p>
    <span className={`product-block__item__image${secondImage ? '--second' : ''}`}>{image}</span>
  </section>
);

type StateTypes = {
  showDropDownDaily: boolean,
  showDropDownApp: boolean,
}


type PropTypes = {
  // eslint-ignore no-unused-prop-types
  countryGroupId: CountryGroupId,
}

class ProductBlockAus extends Component<PropTypes, StateTypes> {
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
    trackComponentClick(`digital-subscriptions-landing-page--accordion--${product}--${clickAction}`);
  }

  render() {
    const { state } = this;
    return (
      <div className="hope-is-power__products">
        <section className="product-block__container hope-is-power--centered">
          <div className="product-block__container__label--top">What&apos;s included?</div>
          <ProductCard
            title="Australia Weekend in The Guardian Editions app"
            shortTitle="Australia Weekend"
            subtitle={
              <span className="product-block__item__subtitle--short-first">
                Everything you need to make sense of the week, in one simple, elegant app
              </span>}
            image={weekendImage}
            first
            secondImage={false}
          />
          <Dropdown
            showDropDown={state.showDropDownDaily}
            product="daily"
          >
            <ListHeading
              items={[
                {
                  boldText: 'A new way to read',
                  explainer: 'The weekend paper, reimagined for mobile and tablet. Each new edition available to read Saturday at 6am (AEST)',
                },
                { boldText: 'Start your weekend informed', explainer: 'Enjoy advance access to the best journalism planned for the weekend' },
                { boldText: 'Easy to navigate', explainer: 'Read the complete edition, or swipe to the sections you care about' },
              ]}
            />
            <ListHeading
              items={[
                { boldText: 'Read offline', explainer: 'Download and read whenever it suits you' },
                { boldText: 'Ad-free', explainer: 'Enjoy our journalism uninterrupted, without adverts' },
                { boldText: 'Multiple devices', explainer: 'Beautifully designed for your mobile or tablet on iOS and Android' },
                {
                  boldText: 'Enjoy our other editions',
                  explainer: 'The UK Daily and other special editions are all included in The Guardian Editions app as part of your subscription',
                },
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
            shortTitle="Premium access to The Guardian Live app"
            subtitle={<span className="product-block__item__subtitle--short-second">Live news, as it happens</span>}
            image={appImageAus}
            first={false}
            secondImage
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


export default ProductBlockAus;
