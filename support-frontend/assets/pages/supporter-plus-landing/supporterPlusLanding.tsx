import { css } from '@emotion/react';
import { from, neutral, space, textSans } from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import {
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import { CheckoutErrorSummary } from 'components/errorSummary/errorSummary';
import { CheckoutErrorSummaryContainer } from 'components/errorSummary/errorSummaryContainer';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import Nav from 'components/nav/nav';
import { PageScaffold } from 'components/page/pageScaffold';
import { PaymentButtonController } from 'components/paymentButton/paymentButtonController';
import { PaymentRequestButtonContainer } from 'components/paymentRequestButton/paymentRequestButtonContainer';
import { SavedCardButton } from 'components/savedCardButton/savedCardButton';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
import { StripeCardFormContainer } from 'components/stripeCardForm/stripeCardFormContainer';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { LandingPageHeading } from './components/landingPageHeading';
import { PatronsMessage } from './components/patronsMessage';
import { AmountAndBenefits } from './formSections/amountAndBenefits';
import { getPaymentMethodButtons } from './paymentButtons';

const checkoutContainer = css`
	position: relative;
	color: ${neutral[7]};
	${textSans.medium()};

	padding-top: ${space[3]}px;
	padding-bottom: ${space[9]}px;

	${from.mobileLandscape} {
		padding-bottom: ${space[12]}px;
	}

	${from.desktop} {
		padding-bottom: ${space[24]}px;
		padding-top: ${space[6]}px;
	}
`;

// TODO: these are purely for demo purposes, delete once the boxes have real content in
const largeDemoBox = css`
	min-height: 400px;
`;

export function SupporterPlusLandingPage(): JSX.Element {
	const { countryGroupId, countryId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { switches } = useContributionsSelector(
		(state) => state.common.settings,
	);
	const contributionType = useContributionsSelector(getContributionType);

	const countrySwitcherProps: CountryGroupSwitcherProps = {
		countryGroupIds: [
			GBPCountries,
			UnitedStates,
			AUDCountries,
			EURCountries,
			NZDCountries,
			Canada,
			International,
		],
		selectedCountryGroup: countryGroupId,
		subPath: '/contribute',
	};
	const heading = <LandingPageHeading />;

	return (
		<PageScaffold
			id="supporter-plus-landing"
			header={
				<>
					<Header>
						<Hide from="desktop">
							<CountrySwitcherContainer>
								<CountryGroupSwitcher {...countrySwitcherProps} />
							</CountrySwitcherContainer>
						</Hide>
					</Header>
					<Nav {...countrySwitcherProps} />
				</>
			}
			footer={
				<FooterWithContents>
					<FooterLinks></FooterLinks>
				</FooterWithContents>
			}
		>
			<CheckoutHeading heading={heading}>
				<p>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque
					ex justo, varius ut porttitor tristique, rhoncus quis dolor.
				</p>
			</CheckoutHeading>
			<Container sideBorders backgroundColor={neutral[97]}>
				<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Hide from="desktop">{heading}</Hide>
						<Box>
							<AmountAndBenefits />
						</Box>
						<Box>
							<BoxContents>
								{/* The same Stripe provider *must* enclose the Stripe card form and payment button(s). Also enclosing the PRB reduces re-renders. */}
								<ContributionsStripe>
									<CheckoutErrorSummaryContainer
										renderSummary={({ errorList }) => (
											<CheckoutErrorSummary errorList={errorList} />
										)}
									/>
									<SecureTransactionIndicator position="center" />
									<PaymentRequestButtonContainer
										CustomButton={SavedCardButton}
									/>

									<p css={largeDemoBox}>Personal details and payment</p>

									<StripeCardFormContainer />
									<PaymentButtonController
										paymentButtons={getPaymentMethodButtons(
											contributionType,
											switches,
											countryId,
											countryGroupId,
										)}
									/>
								</ContributionsStripe>
							</BoxContents>
						</Box>
						<Box>
							<BoxContents>
								<PatronsMessage />
							</BoxContents>
						</Box>
					</Column>
				</Columns>
			</Container>
		</PageScaffold>
	);
}
