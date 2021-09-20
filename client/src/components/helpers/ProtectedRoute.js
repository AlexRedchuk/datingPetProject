import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, auth, ...rest }) => (
    <Route exact {...rest} render={(props) => (
        auth === true
            ? <Component {...props} />
            : <Redirect to='/' />
    )} />
)

const mapStateToProps = (state) => {
    return {
        auth: state.auth.isSignedIn
    }
}

export default connect(mapStateToProps, null)(ProtectedRoute);