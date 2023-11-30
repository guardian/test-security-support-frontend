import { css } from '@emotion/react';
import { from, neutral, space, textSans } from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import {
	Divider,
	FooterLinks,
	FooterWithContents,
} from '@guardian/source-react-components-development-kitchen';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, BoxContents } from 'components/checkoutBox/checkoutBox';
import { CheckoutHeading } from 'components/checkoutHeading/checkoutHeading';
import type { CountryGroupSwitcherProps } from 'components/countryGroupSwitcher/countryGroupSwitcher';
import CountryGroupSwitcher from 'components/countryGroupSwitcher/countryGroupSwitcher';
import GridImage from 'components/gridImage/gridImage';
import { CountrySwitcherContainer } from 'components/headers/simpleHeader/countrySwitcherContainer';
import { Header } from 'components/headers/simpleHeader/simpleHeader';
import { Container } from 'components/layout/container';
import { LoadingOverlay } from 'components/loadingOverlay/loadingOverlay';
import Nav from 'components/nav/nav';
import { PageScaffold } from 'components/page/pageScaffold';
import { KindleSubscriberPaymentButtonContainer } from 'components/paymentButton/kindleSubscriberPaymentButtonContainer';
import { PaymentButtonController } from 'components/paymentButton/paymentButtonController';
import { PaymentMethodSelector } from 'components/paymentMethodSelector/paymentMethodSelector';
import PaymentMethodSelectorContainer from 'components/paymentMethodSelector/PaymentMethodSelectorContainer';
import { PersonalDetails } from 'components/personalDetails/personalDetails';
import { PersonalDetailsContainer } from 'components/personalDetails/personalDetailsContainer';
import { SecureTransactionIndicator } from 'components/secureTransactionIndicator/secureTransactionIndicator';
import { ContributionsStripe } from 'components/stripe/contributionsStripe';
import {
	AUDCountries,
	Canada,
	EURCountries,
	GBPCountries,
	International,
	NZDCountries,
	UnitedStates,
} from 'helpers/internationalisation/countryGroup';
import { useContributionsSelector } from 'helpers/redux/storeHooks';
import { getPaymentMethodButtons } from 'pages/digital-subscriber-checkout/paymentButtons';
import { GuardianTsAndCs } from 'pages/supporter-plus-landing/components/guardianTsAndCs';
import { LandingPageHeading } from 'pages/supporter-plus-landing/components/landingPageHeading';
import { PatronsMessage } from 'pages/supporter-plus-landing/components/patronsMessage';
import { PaymentFailureMessage } from 'pages/supporter-plus-landing/components/paymentFailure';
import { BillingPeriodSelector } from './components/billingPeriodSelector';
import { PaymentTsAndCs } from './components/paymentTsAndCs';

const checkoutContainer = css`
	position: relative;
	color: ${neutral[7]};
	${textSans.medium()};

	padding-top: ${space[3]}px;
	padding-bottom: ${space[9]}px;

	${from.tablet} {
		padding-bottom: ${space[12]}px;
	}

	${from.desktop} {
		padding-top: ${space[6]}px;
	}
`;

const divider = css`
	max-width: 100%;
	margin: 40px 0 ${space[6]}px;
`;

const subheading = css`
	font-weight: normal;
	padding-right: ${space[2]}px;
`;

export function SupporterPlusLandingPage({
	thankYouRoute,
}: {
	thankYouRoute: string;
}): JSX.Element {
	const { countryGroupId, countryId } = useContributionsSelector(
		(state) => state.common.internationalisation,
	);
	const { switches } = useContributionsSelector(
		(state) => state.common.settings,
	);

	const contributionType = 'MONTHLY';

	const { paymentComplete, isWaiting } = useContributionsSelector(
		(state) => state.page.form,
	);

	const navigate = useNavigate();

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
		subPath: '/kindle',
	};
	const heading = (
		<LandingPageHeading heading="Under no one’s thumb but yours" />
	);

	useEffect(() => {
		if (paymentComplete) {
			navigate(thankYouRoute, { replace: true });
		}
	}, [paymentComplete]);

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
			<CheckoutHeading
				heading={heading}
				image={
					<GridImage
						gridId="supporterPlusLanding"
						srcSizes={[500]}
						sizes="500px"
						imgType="png"
						altText=""
					/>
				}
			>
				<p css={subheading}>
					Keep informed on the day’s top stories with the Guardian digital
					edition. Read the headlines, along with your favourite political
					commentators, lifestyle columnists, sport pundits and more - in a
					daily, digestible read, across all your devices.
				</p>
			</CheckoutHeading>
			<Container sideBorders backgroundColor={neutral[97]}>
				<Columns cssOverrides={checkoutContainer} collapseUntil="tablet">
					<Column span={[0, 2, 5]}></Column>
					<Column span={[1, 8, 7]}>
						<Box>
							<BillingPeriodSelector />
						</Box>
						<Box>
							<BoxContents>
								{/* The same Stripe provider *must* enclose the Stripe card form and payment button(s). */}
								<ContributionsStripe
									contributionTypeOverride={contributionType}
								>
									<SecureTransactionIndicator align="center" />
									<PersonalDetailsContainer
										renderPersonalDetails={(personalDetailsProps) => (
											<PersonalDetails
												{...personalDetailsProps}
												hideDetailsHeading
											/>
										)}
									/>
									<Divider size="full" cssOverrides={divider} />
									<PaymentMethodSelectorContainer
										contributionTypeOverride={contributionType}
										render={(paymentMethodSelectorProps) => (
											<PaymentMethodSelector {...paymentMethodSelectorProps} />
										)}
									/>
									<PaymentButtonController
										defaultContainer={KindleSubscriberPaymentButtonContainer}
										paymentButtons={getPaymentMethodButtons(
											contributionType,
											switches,
											countryId,
											countryGroupId,
										)}
									/>
									<PaymentFailureMessage />
								</ContributionsStripe>
								<PaymentTsAndCs />
							</BoxContents>
						</Box>
						<Divider size="full" cssOverrides={divider} />
						<PatronsMessage countryGroupId={countryGroupId} />
						<Divider
							size="full"
							cssOverrides={css`
								max-width: 100%;
								margin: ${space[4]}px 0 ${space[4]}px;
							`}
						/>
						<GuardianTsAndCs />
					</Column>
				</Columns>
			</Container>
			{isWaiting && (
				<LoadingOverlay>
					<p>Processing transaction</p>
					<p>Please wait</p>
				</LoadingOverlay>
			)}
		</PageScaffold>
	);
}
