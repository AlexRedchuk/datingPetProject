import React, {  useState } from 'react';
import RegisterForm from './RegisterForm';
import { connect } from 'react-redux';
import _ from 'lodash'
import RegisterFormGoogle from './RegisterFormGoogle';
import { register, registerGoogle, logOut } from '../../../actions/authActions';
import angels from '../../imgs/Angels.png'
import { Link } from 'react-router-dom';
import '../auth/Form.scss';

const RegisterPage = ({user, register, registerGoogle, logOut}) => {
    const [step, setStep] = useState(1);
    
    const onSubmit = async (formValues) => {
        console.log(formValues)
        const formData = new FormData();
        const dateOfBirth = `${formValues['year']}-${formValues['month']}-${formValues['day']}`
        for (const key in formValues) {
        if (key === 'photos') {
          
          formValues[key].forEach( value => {
            formData.append('photos', value);
          }) 
        } else {
          formData.append(key, formValues[key]);
        }
      }
      formData.delete('day')
      formData.delete('month')
      formData.delete('year')
      formData.append('dateOfBirth', dateOfBirth)
      if(!_.isEmpty(user)) {
        formData.append('email', user.email);
        formData.append('googleId', user.googleId);
        registerGoogle(formData);
      }
      else {
        register(formData);
      }
    }


    const renderForm = () => {
      if(!_.isEmpty(user)) {
        return <RegisterFormGoogle changeStep={(i) => setStep(i)} step={step} onSubmit={onSubmit}  initialValues={_.pick(user, 'name')} />
      }
      return <RegisterForm changeStep={(i) => setStep(i)} step={step} onSubmit={onSubmit}  />
    }

    return (
        <div className="form_main_container">
            <div className="form_container">
            { renderForm()}
            <img className="angels" src={angels} alt="data error"/>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    }
}
export default connect(mapStateToProps, { registerGoogle, register, logOut })(RegisterPage);