import { useEffect } from 'react';
import { Router, Switch } from 'react-router-dom';
import history from '../history';
import './App.css';
import Login from './pages/auth/Login';
import MainPage from './pages/main/MainPage';
import HomePage from './pages/home/HomePage';
import { connect } from 'react-redux';
import { checkLogIn } from '../actions/authActions';
import RegisterPage from './pages/register/RegisterPage';
import UnauthorizedRoute from './helpers/UnauthorizedRoute';
import ProtectedRoute from './helpers/ProtectedRoute';


const App = ({ isSignedIn, checkLogIn, googleId }) => {
  useEffect( () => { 
     window.gapi.load('client:auth2', () => {
      window.gapi.client.init({
        clientId: '1057249760018-ejaa9g0o9ha9lhkvrgfbu22ltcfl8kl6.apps.googleusercontent.com',
        scope: 'email'
      })
      if (isSignedIn === null || isSignedIn === true) {
        checkLogIn();
      }
    })
  }, [isSignedIn, checkLogIn, googleId])

  if (isSignedIn === null) {
    return <h1>No content</h1>
  }

  return (<div >
    <Router history={history}>
      <Switch>
        <UnauthorizedRoute path="/" exact component={MainPage} />
        <UnauthorizedRoute path="/login" exact component={Login}/>
        <ProtectedRoute path="/home"  component={HomePage} />
        <UnauthorizedRoute path="/register" exact component={RegisterPage} />
      </Switch>
    </Router>
  </div>)
}

const mapStateToProps = (state) => {
  return {
    isSignedIn: state.auth.isSignedIn,
    googleId: state.auth.user.googleId
  }
}
export default connect(mapStateToProps, { checkLogIn })(App);
