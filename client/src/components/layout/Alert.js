import React from 'react';
import { connect } from 'react-redux';
import ProTypes from 'prop-types';

const Alert = ({ alerts }) => 
    alerts !== null &&
    alerts.length > 0 &&
    alerts.map(alert => (
        <div key={alert.id} className={`alert alert-${alert.alertType}`}>
            {alert.msg}
        </div>
    ));

Alert.ProTypes = {
    alerts: ProTypes.array.isRequired
}

const mapStateToProps = state => ({
    alerts: state.alert
});


export default connect(mapStateToProps)(Alert);
