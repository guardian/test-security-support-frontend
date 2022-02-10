import { css } from '@emotion/react';
import { body, from } from '@guardian/source-foundations';
import * as React from 'react';

const bodyContainer = css`
	p,
	li {
		${body.small()};

		${from.tablet} {
			font-size: 17px;
		}
	}
`;
type ActionBodyProps = {
	children: React.ReactNode;
};

const ActionBody: React.FC<ActionBodyProps> = ({
	children,
}: ActionBodyProps) => <div css={bodyContainer}>{children}</div>;

export default ActionBody;
