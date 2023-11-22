import { useEffect } from 'react';
import type { StripeAccount } from 'helpers/forms/stripe';
import {
	getStripeKey,
	stripeAccountForContributionType,
} from 'helpers/forms/stripe';
import {
	setStripeAccountName,
	setStripePublicKey,
} from 'helpers/redux/checkout/payment/stripeAccountDetails/actions';
import { getContributionType } from 'helpers/redux/checkout/product/selectors/productType';
import {
	useContributionsDispatch,
	useContributionsSelector,
} from 'helpers/redux/storeHooks';
import { StripeElements } from './stripeElements';

type ContributionsStripeProps = {
	children: React.ReactNode;
	// Overriding this allows us to
	overrideStripeAccount?: StripeAccount;
};

export function ContributionsStripe({
	children,
	overrideStripeAccount,
}: ContributionsStripeProps): JSX.Element {
	const country = useContributionsSelector(
		(state) => state.common.internationalisation.countryId,
	);
	const contributionType = useContributionsSelector(getContributionType);
	const { isTestUser } = useContributionsSelector((state) => state.page.user);
	const { publicKey } = useContributionsSelector(
		(state) => state.page.checkoutForm.payment.stripeAccountDetails,
	);

	const dispatch = useContributionsDispatch();

	useEffect(() => {
		const stripeAccount =
			overrideStripeAccount ??
			stripeAccountForContributionType[contributionType];
		const publicKey = getStripeKey(stripeAccount, country, isTestUser);

		dispatch(setStripeAccountName(stripeAccount));
		dispatch(setStripePublicKey(publicKey));
	}, [contributionType]);

	/**
	 * The `key` attribute is necessary here because you cannot update the stripe object on the Elements.
	 * Instead, we create separate instances for ONE_OFF and REGULAR
	 */
	return (
		<>
			<StripeElements key={publicKey} stripeKey={publicKey}>
				{children}
			</StripeElements>
		</>
	);
}
