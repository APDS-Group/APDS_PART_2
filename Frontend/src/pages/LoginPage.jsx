import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/LoginPage.css'; 
import loginIllustration from '../Assets/images/login_screen.png'; // Ensure the correct path

function LoginPage() {

    const navigate = useNavigate();

    const handleEmployeeLogin = () => {
        navigate('/employee');
    };
    return (
        <div className="login-page">
            {/* Left Side - Image Container */}
            <div className="image-container">
                <img src={loginIllustration} alt="Login Illustration" className="login-image" />
            </div>

            {/* Right Side - Login Form */}
            <div className="login-form-container">
                <h2>Welcome to <span className="brand-name">Login</span></h2>


                {/* Email and Password Form */}
                <form className="login-form">
                <label htmlFor='usernameOrAccountNumber'>Username or Account Number</label>
                    <div className="input-group">
                        <input  placeholder="Username or Account number" className="input-field" />
                    </div>
                    <label htmlFor='password'>Password</label>
                    <div className="input-group">
                        <input type="password" placeholder="Password" className="input-field" />
                        <span className="toggle-password">👁️</span>
                    </div>

                  

                    <button type="submit" className="login-btn">Login</button>
                    <p className="register-link">
                    Don't have an account? <a href="/register">Register</a>
                </p>             
                <div className="divider"><span>OR</span></div>
                    <button type="submit" className="button-bordered" onClick={handleEmployeeLogin}>Employee Login</button>
                </form>              

            </div>
        </div>
    );
}

export default LoginPage;