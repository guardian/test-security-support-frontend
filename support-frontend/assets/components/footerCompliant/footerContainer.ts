// ----- Imports ----- //
import { connect } from 'react-redux';
import type { CommonState } from 'helpers/redux/commonState/state';
import Footer from './Footer';

// ----- State Maps ----- //
function mapStateToProps(state: { common: CommonState }) {
	return {
		countryGroupId: state.common.internationalisation.countryGroupId,
	};
} // ----- Exports ----- //

export default connect(mapStateToProps)(Footer);
