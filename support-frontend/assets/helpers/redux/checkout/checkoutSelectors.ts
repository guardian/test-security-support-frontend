import { getOtherAmountErrors } from 'components/otherAmount/selectors';
import type { ContributionsState } from '../contributionsStore';
import { getContributionType } from './product/selectors/productType';

function getPaymentMethodErrors(
	state: ContributionsState,
): Record<string, string[]> {
	const { payment } = state.page.checkoutForm;

	switch (payment.paymentMethod.name) {
		case 'Stripe':
			return payment.stripe.errors;

		case 'DirectDebit':
			return payment.directDebit.errors ?? {};

		case 'Sepa':
			return payment.sepa.errors;

		default:
			return {};
	}
}

function formHasPaymentMethodErrors(state: ContributionsState): boolean {
	const errors = getPaymentMethodErrors(state);
	const errorObjectHasKeys = !!Object.keys(errors).length;
	if (!errorObjectHasKeys) {
		return false;
	}

	const atLeastOneKeyHasErrors = Object.keys(errors).some(
		(key) => errors[key].length,
	);
	return atLeastOneKeyHasErrors;
}

export function getAllErrorsForContributions(
	state: ContributionsState,
): Partial<Record<string, string[]>> {
	const contributionType = getContributionType(state);

	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	const otherAmount = getOtherAmountErrors(state);

	if (contributionType === 'ONE_OFF') {
		return {
			otherAmount,
			email,
			...getPaymentMethodErrors(state),
		};
	}
	return {
		otherAmount,
		firstName,
		lastName,
		email,
		...getPaymentMethodErrors(state),
	};
}

export function contributionsFormHasErrors(state: ContributionsState): boolean {
	const contributionType = getContributionType(state);
	const hasPaymentErrors = formHasPaymentMethodErrors(state);
	const { firstName, lastName, email } =
		state.page.checkoutForm.personalDetails.errors ?? {};

	if (contributionType === 'ONE_OFF') {
		return hasPaymentErrors || !!email?.length;
	}

	const allErrorsLength =
		hasPaymentErrors ||
		!!firstName?.length ||
		!!lastName?.length ||
		!!email?.length;

	return allErrorsLength;
}
