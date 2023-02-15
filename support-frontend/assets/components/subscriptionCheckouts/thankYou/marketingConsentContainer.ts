// ----- Imports ----- //
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { sendMarketingPreferencesToIdentity } from 'components/marketingConsent/helpers';
import MarketingConsent from 'components/marketingConsent/marketingConsent';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import type { CsrfState } from 'helpers/redux/checkout/csrf/state';
import { getEmail } from 'helpers/subscriptionsForms/formFields';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';

const mapStateToProps = (state: CheckoutState) => ({
	confirmOptIn: state.page.checkoutForm.marketingConsent.confirmOptIn,
	email: getEmail(state),
	csrf: state.page.checkoutForm.csrf,
});

function mapDispatchToProps(dispatch: Dispatch) {
	return {
		onClick: (email: string, csrf: CsrfState) => {
			sendTrackingEventsOnClick({
				id: 'marketing-permissions',
				componentType: 'ACQUISITIONS_OTHER',
			})();
			sendMarketingPreferencesToIdentity(
				true, // it's TRUE because the button says Sign Me Up!
				email,
				dispatch,
				csrf,
			);
		},
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(MarketingConsent);
