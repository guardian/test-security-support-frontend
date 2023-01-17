import { css } from '@emotion/react';
import { neutral } from '@guardian/source-foundations';
import { Column, Columns, Container } from '@guardian/source-react-components';
import type { CheckoutBenefitsListProps } from 'components/checkoutBenefits/checkoutBenefitsList';
import { CheckoutBenefitsList } from 'components/checkoutBenefits/checkoutBenefitsList';
import { checkListData } from 'components/checkoutBenefits/checkoutBenefitsListData';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';

export default {
	title: 'Checkouts/Benefits List',
	component: CheckoutBenefitsList,
	argTypes: {
		handleButtonClick: { action: 'button clicked' },
	},
	decorators: [
		(Story: React.FC): JSX.Element => (
			<Container backgroundColor={neutral[97]}>
				<Columns
					collapseUntil="tablet"
					cssOverrides={css`
						justify-content: center;
						padding: 1rem 0;
					`}
				>
					<Column width={[1, 3 / 4, 1 / 2]}>
						<Box>
							<BoxContents>
								<Story />
							</BoxContents>
						</Box>
					</Column>
				</Columns>
			</Container>
		),
	],
};

function Template(args: CheckoutBenefitsListProps) {
	return <CheckoutBenefitsList {...args} />;
}

function onNudgeClick(): () => void {
	throw new Error('Function not implemented.');
}

Template.args = {} as Omit<CheckoutBenefitsListProps, 'handleButtonClick'>;

export const AllBenefitsUnlocked = Template.bind({});

AllBenefitsUnlocked.args = {
	title: "For £12 per month, you'll unlock",
	checkListData: checkListData({ higherTier: true }),
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
	buttonCopy: null,
	nudgeTitleCopySection1: 'Consider monthly',
	nudgeTitleCopySection2: 'to sustain us long term',
	onNudgeClick: onNudgeClick,
};

export const LowerTierUnlocked = Template.bind({});

LowerTierUnlocked.args = {
	title: "For £5 per month, you'll unlock",
	checkListData: checkListData({ higherTier: false }),
	contributionType: 'MONTHLY',
	countryGroupId: 'GBPCountries',
	buttonCopy: 'Switch to £12 per month to unlock all extras',
	nudgeTitleCopySection1: 'Consider monthly',
	nudgeTitleCopySection2: 'to sustain us long term',
	onNudgeClick: onNudgeClick,
};

export const NudgeOneOff = Template.bind({});

NudgeOneOff.args = {
	title: "For £5 per month, you'll unlock",
	checkListData: checkListData({ higherTier: false }),
	contributionType: 'ONE_OFF',
	countryGroupId: 'GBPCountries',
	buttonCopy: 'Switch to £12 per month to unlock all extras',
	nudgeTitleCopySection1: 'Consider monthly',
	nudgeTitleCopySection2: 'to sustain us long term',
	onNudgeClick: onNudgeClick,
};
