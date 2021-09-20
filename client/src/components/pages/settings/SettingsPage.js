import React from 'react';
import { connect } from 'react-redux';
import { deleteUser } from '../../../actions/authActions';

const SettingsPage = ({userId, deleteUser}) => {
    return (<div>
        SettingsPage
        <button onClick={deleteUser}>Delete account</button>
    </div>)
}

const mapStateToProps = (state) => {
    return {
        userId: state.auth.userId
    }
}

export default connect(mapStateToProps, { deleteUser})(SettingsPage);