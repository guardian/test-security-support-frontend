import type { TickerSettings } from 'components/ticker/types';
import type { ContributionTypes } from 'helpers/contributions';

type CampaignCopy = {
	headerCopy?: string | JSX.Element;
	contributeCopy?: string | JSX.Element;
};

export type CampaignSettings = {
	campaignCode: string;
	copy?: (goalReached: boolean) => CampaignCopy;
	formMessage?: JSX.Element;
	termsAndConditions?: (
		contributionsTermsLink: string,
		contactEmail: string,
	) => JSX.Element;
	cssModifiers?: string[];
	contributionTypes?: ContributionTypes;
	backgroundImage?: string;
	extraComponent?: JSX.Element;
	tickerSettings: TickerSettings;
	goalReachedCopy?: JSX.Element;
	// If set, the form will be replaced with this if goal reached
};

const currentCampaignPath: string | null = 'us/contribute';

const usEoy2021Copy = (): CampaignCopy => ({
	headerCopy: "Join us in the fight for America's future",
	contributeCopy:
		'Quality, independent journalism that is freely accessible to all has never been more crucial. We’re raising $1.25m to fund our reporting in 2022. If you can, support the Guardian today.',
});

export const campaign: CampaignSettings = {
	campaignCode: 'Us_eoy_2023',
	copy: usEoy2021Copy,
	tickerSettings: {
		countType: 'money',
		endType: 'unlimited',
		headline: 'End of year campaign',
	},
};

function campaignEnabledForUser(
	campaignCode: string | null | undefined,
): boolean {
	const { campaignSwitches } = window.guardian.settings.switches;
	if (
		currentCampaignPath &&
		campaignSwitches.enableContributionsCampaign === 'On'
	) {
		return (
			campaignSwitches.forceContributionsCampaign === 'On' ||
			window.location.pathname.endsWith(`/${currentCampaignPath}`) ||
			campaign.campaignCode === campaignCode
		);
	}

	return false;
}

export function getCampaignSettings(
	campaignCode?: string,
): CampaignSettings | null {
	if (campaignEnabledForUser(campaignCode)) {
		return campaign;
	}

	return null;
}
export function getCampaignCode(campaignCode?: string): string | null {
	const campaignSettings = getCampaignSettings(campaignCode);

	if (campaignSettings) {
		return campaignSettings.campaignCode;
	}

	return null;
}

export function isCampaignEnabled(campaignCode: string): boolean {
	return (
		window.guardian.settings.switches.campaignSwitches[campaignCode] === 'On'
	);
}
