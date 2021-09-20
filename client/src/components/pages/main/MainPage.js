import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../imgs/Afrodite logo.png'
import angels from '../../imgs/Angels.png'
import './MainPage.css'

const MainPage = () => {
    return (<div className="form_main_container">
        <div className="form_container"
         >
        
        <div style={{
            paddingTop: '60px'
        }}>
        <Link to="/"><img className="login_logo" src={logo} alt="logo"/> </Link>
        <div style={{
            marginTop: '20px',
            display: 'flex',
            flexDirection: 'column'
        }}>
        <Link className="login_button main"  to='/login'>Login</Link> 
        <Link className="registration_button main" to='/register'>Register</Link>

        </div>
        </div>
        <img className="angels" src={angels} alt="data error"/>
        </div>
    </div>)
}

export default MainPage;