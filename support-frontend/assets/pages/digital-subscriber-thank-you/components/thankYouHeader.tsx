import DirectDebitMessage from 'pages/supporter-plus-thank-you/components/thankYouHeader/directDebitMessage';
import {
	header,
	headerSupportingText,
	headerTitleText,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/thankYouHeader';
import Heading from './heading';
import Subheading from './subheading';

type ThankYouHeaderProps = {
	name: string | null;
	showDirectDebitMessage: boolean;
};

function ThankYouHeader({
	name,
	showDirectDebitMessage,
}: ThankYouHeaderProps): JSX.Element {
	return (
		<header css={header}>
			<h1 css={headerTitleText}>
				<Heading name={name} />
			</h1>
			<p css={headerSupportingText}>
				{showDirectDebitMessage && <DirectDebitMessage />}
				<Subheading />
			</p>
		</header>
	);
}

export default ThankYouHeader;
