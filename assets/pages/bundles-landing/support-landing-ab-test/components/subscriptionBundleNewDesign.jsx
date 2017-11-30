// @flow

// ----- Imports ----- //

import React from 'react';

import CtaCircle from 'components/ctaCircle/ctaCircle';
import GridImage from 'components/gridImage/gridImage';
import FeatureList from 'components/featureList/featureList';

import type { ListItem } from 'components/featureList/featureList';


// ----- Types ----- //

type PropTypes = {
  heading: string,
  price: string,
  from: boolean,
  copy: ListItem[],
  ctaText: string,
  image: string,
  ctaUrl: string,
};


// ----- Component ----- //

export default function SubscriptionBundle(props: PropTypes) {

  return (
    <div className="subscription-bundle">
      <GridImage
        gridId={props.image}
        srcSizes={[600]}
        sizes="600px"
        altText={`${props.heading} bundle`}
        imgType="png"
      />
      <h3 className="subscription-bundle__heading">{props.heading}</h3>
      <h4 className="subscription-bundle__price">
        {props.from ? 'from ' : ''}
        £{props.price}/month
      </h4>
      <p className="subscription-bundle__copy">
        <FeatureList listItems={props.copy} />
      </p>
      <CtaCircle
        text={props.ctaText}
        url={props.ctaUrl}
      />
    </div>
  );

}
