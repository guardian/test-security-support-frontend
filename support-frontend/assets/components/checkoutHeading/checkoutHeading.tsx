import { css } from '@emotion/react';
import {
	brand,
	from,
	neutral,
	space,
	textSans,
} from '@guardian/source-foundations';
import { Column, Columns, Hide } from '@guardian/source-react-components';
import { Container } from 'components/layout/container';
import type { CSSOverridable } from 'helpers/types/cssOverrideable';

const mainStyles = css`
	position: absolute;
	left: 0;
	right: 0;
	color: ${neutral[100]};
`;

const headingContentContainer = css`
	min-height: 480px;
	${from.desktop} {
		min-height: 440px;
	}
	padding-top: ${space[6]}px;
	${textSans.large({ fontWeight: 'bold' })}
`;

const leftColImageEditions = css`
	height: 129px;

	img {
		max-width: 100%;
	}
`;

export interface CheckoutHeadingProps extends CSSOverridable {
	heading: React.ReactNode;
	children?: React.ReactNode;
	image?: React.ReactNode;
	withTopborder?: true;
}

export function CheckoutHeading(props: CheckoutHeadingProps): JSX.Element {
	return (
		<div css={mainStyles}>
			<Container
				sideBorders={true}
				topBorder={props.withTopborder}
				borderColor={brand[600]}
				backgroundColor={brand[400]}
			>
				<Columns collapseUntil="desktop">
					<Column span={[1, 2, 5]}>
						<div css={headingContentContainer}>
							<Hide until="desktop">
								{props.heading}
								{props.children}
								<figure css={leftColImageEditions}>{props.image}</figure>
							</Hide>
						</div>
					</Column>
				</Columns>
			</Container>
		</div>
	);
}
