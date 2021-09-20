
import React from 'react';
import { connect } from 'react-redux';
import { authGoogle, logOut } from '../../../actions/authActions';
import {ReactComponent as GoogleLogo} from '../../svg/Google logo.svg' 
import './GoogleAuth.css';

class GoogleAuth extends React.Component {

    componentDidMount() {
        window.gapi.load('client:auth2', () => {
            window.gapi.client.init({
                clientId: '1057249760018-ejaa9g0o9ha9lhkvrgfbu22ltcfl8kl6.apps.googleusercontent.com',
                scope: 'email'
            }).then(() => {
                this.auth = window.gapi.auth2.getAuthInstance();
                this.onAuthChange(this.auth.isSignedIn.get());
                this.auth.isSignedIn.listen(this.onAuthChange);
            })
        });
    }

    onAuthChange = isSignedIn => {
        if (isSignedIn) {
            this.props.authGoogle({
                googleId: this.auth.currentUser.get().getId(),
                email: this.auth.currentUser.get().getBasicProfile().getEmail(),
                name: this.auth.currentUser.get().getBasicProfile().getGivenName()
            });
            //console.log(this.auth.currentUser.get().dt.getEmail())
        }
        else {
            this.props.logOut();
        }
    }


    onSignInClick = () => {
        this.auth.signIn();
    }

    renderAuthButton() {
        return <GoogleLogo  
                onClick={this.onSignInClick}
                className="google_button">
            Sign In With Google
        </GoogleLogo>
    }

    render() {
        return <div>{this.renderAuthButton()}</div>
    }
}

const mapStateToProps = (state) => {
    return {
        isSignedIn: state.auth.isSignedIn
    }
}

export default connect(mapStateToProps, { authGoogle, logOut})(GoogleAuth);