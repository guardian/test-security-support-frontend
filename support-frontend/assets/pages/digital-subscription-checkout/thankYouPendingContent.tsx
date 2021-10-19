// ----- Imports ----- //
import * as React from 'react';
import Content from 'components/content/content';
import Text, { LargeParagraph } from 'components/text/text';
import HeadingBlock from 'components/headingBlock/headingBlock';
import ThankYouHero from './components/thankYou/hero';
import { HeroWrapper } from 'components/productPage/productPageHero/productPageHero';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import 'helpers/internationalisation/countryGroup';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import { SubscriptionsSurvey } from 'components/subscriptionCheckouts/subscriptionsSurvey/SubscriptionsSurvey';
// ----- Types ----- //
type PropTypes = {
	countryGroupId: CountryGroupId;
	marketingConsent: React.ReactNode;
	includePaymentCopy: boolean;
};

// ----- Component ----- //
function ThankYouPendingContent(props: PropTypes) {
	return (
		<div className="thank-you-stage">
			<ThankYouHero countryGroupId={props.countryGroupId} />
			<HeroWrapper appearance="custom">
				<HeadingBlock>
					Your digital subscription is being processed
				</HeadingBlock>
			</HeroWrapper>
			<Content>
				<Text>
					<LargeParagraph>
						Thank you for subscribing to the Digital Subscription. Your
						subscription is being processed and you will receive an email when
						your account is live.
					</LargeParagraph>
					<p>
						If you require any further assistance, you can visit our{' '}
						{
							<a
								onClick={sendTrackingEventsOnClick({
									id: 'help',
									product: 'DigitalPack',
									componentType: 'ACQUISITIONS_BUTTON',
								})}
								href="https://manage.theguardian.com/help-centre"
							>
								Help Centre
							</a>
						}{' '}
						to find answers to common user issues and get customer support.
					</p>
				</Text>
			</Content>
			{props.includePaymentCopy ? (
				<SubscriptionsSurvey product={DigitalPack} />
			) : null}
			<Content>{props.marketingConsent}</Content>
		</div>
	);
} // ----- Export ----- //

export default ThankYouPendingContent;
