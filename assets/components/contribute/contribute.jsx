// @flow

// ----- Imports ----- //

import React from 'react';

import PageSection from 'components/pageSection/pageSection';
import Secure from 'components/secure/secure';
import type { Node } from 'react';

// ----- Types ----- //
type PropTypes = {
  copy: string | Node,
  children: Node,
  heading?: string,
};

// ----- Component ----- //

export default function Contribute(props: PropTypes) {
  return (
    <div className={'component-contribute'}>
      <PageSection
        modifierClass="contribute"
        heading={heading}
        headingChildren={<Secure modifierClass="contribute-header" />}
      >
        <Secure modifierClass="contribute-body" />
        <p className={classNameWithModifiers('component-contribute__description', modifiers)}>{props.copy}</p>
        {props.children}
      </PageSection>
    </div>
  );

}

Contribute.defaultProps = {
  heading: 'Contribute',
};
