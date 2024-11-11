import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSucess } from '../utils';
import NavbarPublic from '../pages/Navbars/NavbarPublic';
import '../styles/LoginPage.css';
import loginIllustration from '../assets/images/login_screen.png'; // Ensure the correct path

function LoginPage({ setIsAuthenticated }) { // NOSONAR

    const handleEmployeeLogin = () => {
        navigate('/employee');
    };
    const navigate = useNavigate();
    // State to store login information (usernameOrAccountNumber and password)
    const [loginInfo, setLoginInfo] = React.useState({
        usernameOrAccountNumber: '',
        password: ''
    });

    // State to store error messages for usernameOrAccountNumber and password fields
    const [errors, setErrors] = useState({
        usernameOrAccountNumber: '',
        password: ''
    });

    // Handle input changes and update the loginInfo state
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newUserInfo = { ...loginInfo };
        newUserInfo[name] = value;
        setLoginInfo(newUserInfo);

        // Clear the error message for the changed field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };
    // Handle form submission for login
    const handleLogin = async (e) => {
        e.preventDefault();
        const { usernameOrAccountNumber, password } = loginInfo;
    
        // Validate usernameOrAccountNumber and password fields
        if (!usernameOrAccountNumber || !password) {
            setErrors({
                usernameOrAccountNumber: !usernameOrAccountNumber ? 'Username or Account Number is required' : '',
                password: !password ? 'Password is required' : ''
            });
            return handleError('Username or Account Number and password are required');
        }
    
        try {
            const url = "https://localhost:5050/user/login/";
            // Disable SSL verification (for development purposes only)
            //  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
            // Send login request to the server
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });
    
            if (response.status === 429) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    password: 'Too many requests please try again in 5 minutes'
                }));
                return handleError('Too many requests, please try again in 5 minutes.');
            }
    
            const result = await response.json();
            const { success, message, token, name, error } = result;
    
            if (success) {
                // Handle successful login
                localStorage.setItem('token', token);
                localStorage.setItem('userDetails', JSON.stringify({ name: name, email: result.email, joined: 'January 1, 2020' }));
                setIsAuthenticated(true);
                handleSucess(message);
                navigate('/');
    
            } else if (error) {
                // Handle server-side validation errors
                const details = error?.details[0]?.message || error;
                handleError(details);
            } else if (!success) {
                // Handle specific error messages for non-existent user or invalid credentials
                if (message === "User does not exist" || message === "Invalid credentials") {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        usernameOrAccountNumber: message === "" ? message : '',
                        password: message === "Invalid credentials" ? message : ''
                    }));
                } else {
                    handleError(message);
                }
            }
        } catch (error) {
            // Handle network or other errors
            handleError(error.message);
        }
    };
    return (
        <>
            <NavbarPublic />
            
            <div className="login-page">
                {/* Left Side - Image Container */}
                <div className='image'>
                    <div className="image-container">
                        <img src={loginIllustration} alt="Login Illustration" className="login-image" />
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div className="login-form-container">
                    <h2>Welcome to <span className="brand-name">Login</span></h2>

                    {/* Email and Password Form */}
                    <form onSubmit={handleLogin} className="login-form">


                        <label htmlFor='usernameOrAccountNumber'>Username or Account Number</label>
                        <div className="input-group">
                            <input
                                placeholder="Username or Account number"
                                className="input-field"
                                onChange={handleChange}
                                name="usernameOrAccountNumber"
                                autoFocus
                                required
                                value={loginInfo.usernameOrAccountNumber || ''} />
                            {errors.usernameOrAccountNumber && <div className="error">{errors.usernameOrAccountNumber}</div>}
                        </div>

                        <label htmlFor='password'>Password</label>
                        <div className="input-group">
                            <input type="password"
                                placeholder="Password"
                                className="input-field"
                                onChange={handleChange}
                                name="password"
                                required
                                value={loginInfo.password || ''}
                            />
                            {errors.password && <div className="error">{errors.password}</div>}
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
        </>
    );
}

export default LoginPage;