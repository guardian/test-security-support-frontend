// ----- Imports ----- //
import React from 'react';
import type { SelectedAmounts } from 'helpers/contributions';
import 'helpers/contributions';
import type { ContributionType } from 'helpers/contributions';
import 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import { formatAmount } from 'helpers/forms/checkouts';
import { ChoiceCardGroup, ChoiceCard } from '@guardian/src-choice-card';
import ContributionAmountChoicesChoiceLabel from './ContributionAmountChoicesChoiceLabel';
import { until } from '@guardian/src-foundations/mq';
import { css } from '@emotion/core';
const choiceCardGridStyles = css`
	${until.mobileLandscape} {
		> div {
			width: 100%;
			display: grid;
			grid-template-columns: 1fr 1fr;
			grid-gap: 8px;

			> label {
				margin-bottom: 0px;
			}
		}
	}
`;
const choiceCardGridFullWidthOtherStyles = css`
	${choiceCardGridStyles}

	> div > label:last-of-type {
		grid-column-start: 1;
		grid-column-end: 3;
	}
`;
type ContributionAmountChoicesProps = {
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	contributionType: ContributionType;
	validAmounts: number[];
	defaultAmount: number;
	showOther: boolean;
	selectedAmounts: SelectedAmounts;
	selectAmount: (
		arg0: number | 'other',
		arg1: CountryGroupId,
		arg2: ContributionType,
	) => () => void;
	shouldShowFrequencyButtons: boolean;
};

const isSelected = (
	amount: number,
	selectedAmounts: SelectedAmounts,
	contributionType: ContributionType,
	defaultAmount: number,
) => {
	if (selectedAmounts[contributionType]) {
		return (
			selectedAmounts[contributionType] !== 'other' &&
			amount === selectedAmounts[contributionType]
		);
	}

	return amount === defaultAmount;
};

const ContributionAmountChoices = ({
	validAmounts,
	defaultAmount,
	countryGroupId,
	contributionType,
	showOther,
	selectAmount,
	selectedAmounts,
	currency,
	shouldShowFrequencyButtons,
}: ContributionAmountChoicesProps) => {
	const isOtherAmountFullWidth = validAmounts.length % 2 === 0;
	return (
		<ChoiceCardGroup
			name="amounts"
			columns={2}
			cssOverrides={
				isOtherAmountFullWidth
					? choiceCardGridFullWidthOtherStyles
					: choiceCardGridStyles
			}
		>
			{validAmounts.map((amount: number) => (
				<ChoiceCard
					id={`contributionAmount-${amount}`}
					name="contributionAmount"
					value={amount}
					checked={isSelected(
						amount,
						selectedAmounts,
						contributionType,
						defaultAmount,
					)}
					onChange={selectAmount(amount, countryGroupId, contributionType)}
					label={
						<ContributionAmountChoicesChoiceLabel
							formattedAmount={formatAmount(
								currencies[currency],
								spokenCurrencies[currency],
								amount,
								false,
							)}
							shouldShowFrequencyButtons={shouldShowFrequencyButtons}
							contributionType={contributionType}
						/>
					}
				/>
			))}
			<ChoiceCard
				id="contributionAmount-other"
				name="contributionAmount"
				value="other"
				checked={showOther}
				onChange={selectAmount('other', countryGroupId, contributionType)}
				label="Other"
			/>
		</ChoiceCardGroup>
	);
};

export default ContributionAmountChoices;
