// @flow

// ----- Imports ----- //

import React from 'react';

import RadioToggle from 'components/radioToggle/radioToggle';
import NumberInput from 'components/numberInput/numberInput';
import {
  generateClassName,
  clickSubstituteKeyPressHandler,
} from 'helpers/utilities';
import { CONFIG as contribConfig } from 'helpers/contributions';
import type { Contrib, ContribError, Amounts } from 'helpers/contributions';
import type { Radio } from 'components/radioToggle/radioToggle';
import type { IsoCountry } from 'helpers/internationalisation/country';
import { forCountry } from 'helpers/internationalisation/currency';
import type { Participations } from '../../helpers/abtest';

// ----- Types ----- //

// Disabling the linter here because it's just buggy...
/* eslint-disable react/no-unused-prop-types */

type PropTypes = {
  contribAmount: Amounts,
  contribType: Contrib,
  contribError: ?ContribError,
  changeContribAnnualAmount: (string) => void,
  changeContribMonthlyAmount: (string) => void,
  changeContribOneOffAmount: (string) => void,
  changeContribAmount: (string) => void,
  toggleContribType: (string) => void,
  onNumberInputKeyPress: () => void,
  isoCountry: IsoCountry,
  abTests: Participations,
};

/* eslint-enable react/no-unused-prop-types */

type AmountToggle = {
  [Contrib]: {
    name: string,
    radios: Radio[],
  },
};

type Toggle = {
  name: string,
  radios: Radio[],
};

type ContribAttrs = {
  toggleAction: (string) => void,
  checked: ?string,
  toggles: Toggle,
  selected: boolean,
  contribType: Contrib,
  accessibilityHint: string,
};

// ----- Setup ----- //
const amountRadiosAnnual = {
  GB: [
    {
      value: '50',
      text: '£50',
      accessibilityHint: 'contribute fifty pounds annually',
    },
    {
      value: '75',
      text: '£75',
      accessibilityHint: 'contribute seventy five pounds annually',
    },
    {
      value: '100',
      text: '£100',
      accessibilityHint: 'contribute one hundred pounds annually',
    },
  ],
  US: [
    {
      value: '50',
      text: '$50',
      accessibilityHint: 'contribute fifty dollars annually',
    },
    {
      value: '75',
      text: '$75',
      accessibilityHint: 'contribute seventy five dollars annually',
    },
    {
      value: '100',
      text: '$100',
      accessibilityHint: 'contribute one hundred dollars annually',
    },
  ],
};

const amountRadiosMonthly = {
  GB: [
    {
      value: '5',
      text: '£5',
      accessibilityHint: 'contribute five pounds per month',
    },
    {
      value: '10',
      text: '£10',
      accessibilityHint: 'contribute ten pounds per month',
    },
    {
      value: '20',
      text: '£20',
      accessibilityHint: 'contribute twenty pounds per month',
    },
  ],
  US: [
    {
      value: '5',
      text: '$5',
      accessibilityHint: 'contribute five dollars per month',
    },
    {
      value: '10',
      text: '$10',
      accessibilityHint: 'contribute ten dollars per month',
    },
    {
      value: '20',
      text: '$20',
      accessibilityHint: 'contribute twenty dollars per month',
    },
  ],
};

const amountRadiosOneOff = {
  GB: [
    {
      value: '25',
      text: '£25',
      accessibilityHint: 'make a one-off contribution of twenty five pounds',
    },
    {
      value: '50',
      text: '£50',
      accessibilityHint: 'make a one-off contribution of fifty pounds',
    },
    {
      value: '100',
      text: '£100',
      accessibilityHint: 'make a one-off contribution of one hundred pounds',
    },
    {
      value: '250',
      text: '£250',
      accessibilityHint: 'make a one-off contribution of two hundred and fifty pounds',
    },
  ],
  US: [
    {
      value: '25',
      text: '$25',
      accessibilityHint: 'make a one-time contribution of twenty five dollars',
    },
    {
      value: '50',
      text: '$50',
      accessibilityHint: 'make a one-time contribution of fifty dollars',
    },
    {
      value: '100',
      text: '$100',
      accessibilityHint: 'make a one-time contribution of one hundred dollars',
    },
    {
      value: '250',
      text: '$250',
      accessibilityHint: 'make a one-time contribution of two hundred and fifty dollars',
    },
  ],
};

const contribCaptionRadios = {
  GB_WITH_ANNUAL: [
    {
      value: 'ANNUAL',
      text: 'Annual',
      accessibilityHint: 'Make a regular annual contribution',
    },
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
      accessibilityHint: 'Make a one-off contribution',
    },
  ],
  GB: [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      value: 'ONE_OFF',
      text: 'One-off',
      accessibilityHint: 'Make a one-off contribution',
    },
  ],
  US: [
    {
      value: 'MONTHLY',
      text: 'Monthly',
      accessibilityHint: 'Make a regular monthly contribution',
    },
    {
      id: 'qa-one-off-toggle',
      value: 'ONE_OFF',
      text: 'One-time',
      accessibilityHint: 'Make a one-time contribution',
    },
  ],
};

// ----- Functions ----- //

function amountToggles(isoCountry: IsoCountry = 'GB'): AmountToggle {
  return {
    ANNUAL: {
      name: 'contributions-amount-annual-toggle',
      radios: amountRadiosAnnual[isoCountry],
    },
    MONTHLY: {
      name: 'contributions-amount-monthly-toggle',
      radios: amountRadiosMonthly[isoCountry],
    },
    ONE_OFF: {
      name: 'contributions-amount-oneoff-toggle',
      radios: amountRadiosOneOff[isoCountry],
    },
  };
}

function contribToggle(isoCountry: IsoCountry = 'GB', showAnnual: boolean, accessibilityHint: ?string): Toggle {
  return {
    name: 'contributions-period-toggle',
    radios: showAnnual ? contribCaptionRadios.GB_WITH_ANNUAL : contribCaptionRadios[isoCountry],
    accessibilityHint,
  };
}

function errorMessage(error: ?ContribError,
  contribType: Contrib,
  isoCountry: IsoCountry): ?React$Element<any> {

  const limits = contribConfig[contribType];
  const currencyGlyph = forCountry(isoCountry).glyph;

  const contribErrors: {
    [ContribError]: string,
  } = {
    tooLittle: `Please enter at least ${currencyGlyph}${limits.min}`,
    tooMuch: `We are presently only able to accept contributions of ${currencyGlyph}${limits.max} or less`,
    invalidEntry: 'Please enter a numeric amount',
  };

  if (error) {
    return <p className="component-contrib-amounts__error-message">{contribErrors[error]}</p>;
  }

  return null;

}

function getAttrs(props: PropTypes): ContribAttrs {

  if (props.contribType === 'ANNUAL') {

    const userDefined = props.contribAmount.annual.userDefined;
    return {
      toggleAction: props.changeContribAnnualAmount,
      checked: !userDefined ? props.contribAmount.annual.value : null,
      toggles: amountToggles(props.isoCountry).ANNUAL,
      selected: userDefined,
      contribType: props.contribType,
      accessibilityHint: 'Annual contribution',
    };
  } else if (props.contribType === 'MONTHLY') {

    const userDefined = props.contribAmount.monthly.userDefined;
    return {
      toggleAction: props.changeContribMonthlyAmount,
      checked: !userDefined ? props.contribAmount.monthly.value : null,
      toggles: amountToggles(props.isoCountry).MONTHLY,
      selected: userDefined,
      contribType: props.contribType,
      accessibilityHint: 'Monthly contribution',
    };

  }

  const userDefined = props.contribAmount.oneOff.userDefined;
  return {
    toggleAction: props.changeContribOneOffAmount,
    checked: !userDefined ? props.contribAmount.oneOff.value : null,
    toggles: amountToggles(props.isoCountry).ONE_OFF,
    selected: userDefined,
    contribType: props.contribType,
    accessibilityHint: `${props.isoCountry === 'us' ? 'one time' : 'one-off'} contribution`,
  };

}

function getClassName(contribType: Contrib): string {
  switch (contribType) {
    case 'ANNUAL':
    case 'MONTHLY':
      return generateClassName('component-contrib-amounts__amounts', 'recurring');
    default:
      return generateClassName('component-contrib-amounts__amounts', 'one-off');
  }
}

// ----- Component ----- //

function getShowAnnual(props): boolean {
  return props.isoCountry === 'GB' &&
    props.abTests !== undefined &&
    props.abTests.addAnnualContributions !== undefined &&
    props.abTests.addAnnualContributions === 'variant';
}

export default function ContribAmounts(props: PropTypes) {

  const showAnnual: boolean = getShowAnnual(props);
  const attrs = getAttrs(props);
  const className = getClassName(attrs.contribType);
  const contribTypeTermHint = props.isoCountry === 'US' ? 'one-time' : 'one-off';
  const contribTypeDescription = props.contribType === 'MONTHLY' ? 'monthly' : contribTypeTermHint;
  const contribMinMonthlyAmountHint = props.isoCountry === 'US' ? 'five dollars or more' : 'five pounds or more';
  const contribGroupAccessibilityHint = `Choose either to make a ${contribTypeTermHint} contribution or set up a regular contribution`;
  const contribAmountHint = `Enter an amount of ${props.contribType === 'MONTHLY' ? contribMinMonthlyAmountHint : 'your choice'}`;
  const contribOtherAmountAccessibilityHintId = `accessibility-hint-other-amount-${props.contribType.toLowerCase()}`;
  const contribOtherAmountAccessibilityHint = `${contribAmountHint} for your ${contribTypeDescription} contribution.`;
  return (
    <div className="component-contrib-amounts">
      <div className="contrib-type">
        <RadioToggle
          {...contribToggle(props.isoCountry, showAnnual, contribGroupAccessibilityHint)}
          toggleAction={props.toggleContribType}
          checked={props.contribType}
          showAnnual={showAnnual}
        />
      </div>
      <div className={className}>
        <RadioToggle
          {...attrs.toggles}
          toggleAction={attrs.toggleAction}
          checked={attrs.checked}
          showAnnual={showAnnual}
        />
        <div className="component-contrib-amounts__other-amount">
          <NumberInput
            onFocus={props.changeContribAmount}
            onInput={props.changeContribAmount}
            selected={attrs.selected}
            placeholder={`Other amount (${forCountry(props.isoCountry).glyph})`}
            onKeyPress={clickSubstituteKeyPressHandler(props.onNumberInputKeyPress)}
            ariaDescribedBy={contribOtherAmountAccessibilityHintId}
          />

          <p className="accessibility-hint" id={contribOtherAmountAccessibilityHintId}>
            {contribOtherAmountAccessibilityHint}
          </p>
        </div>
        {errorMessage(props.contribError, attrs.contribType, props.isoCountry)}
      </div>
    </div>
  );

}
