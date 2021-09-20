import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Field, reduxForm } from 'redux-form';
import logo from '../../imgs/Afrodite logo.png'
import GoogleAuth from '../google-auth/GoogleAuth';
import './AuthForm.scss';


class LoginForm extends Component {


    renderError = ({error, touched}) => {
        if(touched && error) {
            return (<div className="form_error_container">
                <div className="form_error">{error}</div>
            </div>);
        }
    };

    renderInput = ({ input, label, meta, placeholder, type }) => { // formProps
        const labelClass = `input_field ${(meta.touched && meta.error) ? 'error' : ''}`;
        return (
            <div className="input_justifier">
                <label className={`input_label ${(meta.touched && meta.error) ? 'error' : ''}`} >{label}</label>
                <input className={labelClass} autoComplete='off' placeholder={placeholder} type={type} {...input}  />
                {this.renderError(meta)}
        </div>
        );
    };

    onSubmit = formValues => {
        this.props.onSubmit(formValues);
    };

    render() {
        return (
            <form className="auth_form" onSubmit={this.props.handleSubmit(this.onSubmit)}>
                <Link to="/"><img className="login_logo" src={logo} alt="logo"/> </Link>
                <span className="enter_words">Введіть дані, щоб увійти або створіть новий аккаунт <Link to="/register" className="orange_words">тут.</Link></span>
                <Field name="email" component={this.renderInput} label="Логін" placeholder="Введіть ваш Email"/>
                <Field name="password" type="password" component={this.renderInput} label="Пароль" placeholder="Введіть ваш пароль" />
                <div className="forgot_password">Забули пароль?</div>
                <button type="submit" className="login_button" >Увійти</button>
                <div className="or_google"><span className="google_login_text">Або через </span><GoogleAuth className="login_google_svg"/> </div>
            </form>
        );
    }
}

const validate = (formValues) => {
    const errors = {};
    if(!formValues.email) {
        errors.email = 'Будь-ласка введіть Email'
    }
    if(!formValues.password) {
        errors.password = 'Будь-ласка введіть пароль'
    }
    return errors
}

export default reduxForm({
    form: 'loginForm',
    validate
})(LoginForm);