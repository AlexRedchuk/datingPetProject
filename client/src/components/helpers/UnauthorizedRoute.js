import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from "react-router-dom";

const UnauthorizedRoute = ({ component: Component, auth, ...rest }) => (
    <Route exact {...rest} render={(props) => (
        auth === false 
            ? <Component {...props} />
            : <Redirect to='/home' />
    )} />
)

const mapStateToProps = (state) => {
    return {
        auth: state.auth.isSignedIn
    }
}

export default connect(mapStateToProps, null)(UnauthorizedRoute);