import type { ContributionType } from 'helpers/contributions';
import { config } from 'helpers/contributions';
// eslint-disable-next-line import/no-cycle -- these are quite tricky to unpick so we should come back to this
import { getContributionType } from '../checkout/product/selectors/productType';
import type { ContributionsState } from '../contributionsStore';

export function getDefaultContributionType(
	state: ContributionsState,
): ContributionType {
	const { defaultContributionType } = state.common.amounts;
	return defaultContributionType;
}

export function getMinimumContributionAmount(
	state: ContributionsState,
): number {
	const { countryGroupId } = state.common.internationalisation;
	const contributionType = getContributionType(state);
	const { min } = config[countryGroupId][contributionType];

	return min;
}

export function getMaximumContributionAmount(
	state: ContributionsState,
): number {
	const { countryGroupId } = state.common.internationalisation;
	const contributionType = getContributionType(state);

	const { max } = config[countryGroupId][contributionType];

	return max;
}

export function isUserInAbVariant(abTestName: string, variantName: string) {
	return function getAbTestStatus(state: ContributionsState): boolean {
		const participations = state.common.abParticipations;
		return participations[abTestName] === variantName;
	};
}
