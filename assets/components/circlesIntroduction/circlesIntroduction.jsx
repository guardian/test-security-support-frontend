// @flow

// ----- Imports ----- //

import React from 'react';

import {
  SvgCirclesHeroDesktop,
  SvgCirclesHeroMobileLandscape,
  SvgCirclesHeroMobile,
} from 'components/svg/svg';
import Highlights from 'components/highlights/highlights';


// ----- Types ----- //

type PropTypes = {
  headings: string[],
  highlights?: ?string[],
};


// ----- Component ----- //

function CirclesIntroduction(props: PropTypes) {
  return (
    <section className="component-circles-introduction">
      <SvgCirclesHeroDesktop />
      <SvgCirclesHeroMobileLandscape />
      <SvgCirclesHeroMobile />
      <div className="component-circles-introduction__content gu-content-margin">
        <div className="component-circles-introduction__copy">
          <h1 className="component-circles-introduction__heading">
            {props.headings.map(heading =>
              <span className="component-circles-introduction__heading-line">{heading}</span>)}
          </h1>
          <Highlights highlights={props.highlights} />
        </div>
      </div>
    </section>
  );
}


// ----- Default Props ----- //

CirclesIntroduction.defaultProps = {
  highlights: null,
};


// ----- Exports ----- //

export default CirclesIntroduction;
