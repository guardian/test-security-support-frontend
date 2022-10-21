import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source-react-components';
import { useEffect } from 'react';
import type { IsoCountry } from 'helpers/internationalisation/country';
import {
	trackComponentClick,
	trackComponentLoad,
} from 'helpers/tracking/behaviour';
import styles from 'pages/contributions-landing/components/ContributionThankYou/styles';
import { OPHAN_COMPONENT_ID_SURVEY } from 'pages/contributions-landing/components/ContributionThankYou/utils/ophan';

const getFeedbackHeader = (
	countryId: IsoCountry,
	feedbackSurveyHasBeenCompleted: boolean,
): string => {
	const isAus = countryId === 'AU';

	const heading = isAus
		? 'Tell us why you value Guardian Australia'
		: 'Send us your thoughts';

	return feedbackSurveyHasBeenCompleted
		? 'Thank you for sharing your thoughts'
		: heading;
};

function getFeedbackBodyCopy(
	countryId: IsoCountry,
	feedbackSurveyHasBeenCompleted: boolean,
): JSX.Element {
	const isAus = countryId === 'AU';

	return (
		<>
			{feedbackSurveyHasBeenCompleted ? (
				<p>
					You’re helping us deepen our understanding of Guardian supporters.
				</p>
			) : (
				<>
					<p>
						{isAus && (
							<span>
								We would love to know more about your decision to support our
								journalism today. We’ll publish a selection of our favourite
								messages, so other readers can enjoy them too.
							</span>
						)}

						{!isAus && (
							<>
								<span css={styles.hideAfterTablet}>
									Fill out this short form to tell us more about your experience
									of supporting us today – it only takes a minute.
								</span>

								<span css={styles.hideBeforeTablet}>
									We would love to hear more about your experience of supporting
									the Guardian today. Please fill out this short form – it only
									takes a minute.
								</span>
							</>
						)}
					</p>
				</>
			)}
		</>
	);
}

function FeedbackCTA({
	countryId,
	setFeedbackSurveyHasBeenCompleted,
}: {
	countryId: IsoCountry;
	setFeedbackSurveyHasBeenCompleted: (
		feedbackSurveyHasBeenCompleted: boolean,
	) => void;
}): JSX.Element {
	useEffect(() => {
		trackComponentLoad(OPHAN_COMPONENT_ID_SURVEY);
	}, []);

	const isAus = countryId === 'AU';

	const SURVEY_LINK = 'https://www.surveymonkey.co.uk/r/VDQ32ND';
	const AUS_SURVEY_LINK =
		'https://guardiannewsampampmedia.formstack.com/forms/australia_2022';

	const surveyLink = isAus ? AUS_SURVEY_LINK : SURVEY_LINK;

	const onClick = () => {
		trackComponentClick(OPHAN_COMPONENT_ID_SURVEY);
		setFeedbackSurveyHasBeenCompleted(true);
	};

	return (
		<LinkButton
			onClick={onClick}
			href={surveyLink}
			target="_blank"
			rel="noopener noreferrer"
			priority="primary"
			size="default"
			icon={<SvgArrowRightStraight />}
			iconSide="right"
			nudgeIcon
		>
			Share your thoughts
		</LinkButton>
	);
}

export { getFeedbackHeader, getFeedbackBodyCopy, FeedbackCTA };
