import React, { Component } from 'react';
import LoginForm from './LoginForm';
import { connect } from 'react-redux';
import { logIn} from '../../../actions/authActions';
import angels from '../../imgs/Angels.png'
import { Link } from 'react-router-dom';
import './Form.scss'

class Login extends Component {
    
    onSubmit = (formValues) => {
       this.props.logIn(formValues);
    }

    render() {
        return (
            <div className="form_main_container">
                <div className="form_container">
                    <LoginForm onSubmit={this.onSubmit} />
                    <img className="angels" src={angels} alt="data error"/>
                </div>
            </div>
        );
    }
}



export default connect(null, { logIn })(Login);