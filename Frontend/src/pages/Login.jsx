// Import necessary modules and hooks from React and react-router-dom
import React, { useState } from 'react';
import { handleError, handleSucess } from '../utils';
import { useNavigate } from 'react-router-dom';

function Login() {

    // Initialize the useNavigate hook for navigation
    const navigate = useNavigate(); 

    // State to store login information (email and password)
    const [loginInfo, setLoginInfo] = React.useState({
        email: '',
        password: ''
    });

    // State to store error messages for email and password fields
    const [errors, setErrors] = useState({       
        email: '',
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
        const { email, password } = loginInfo;      

        // Validate email and password fields
        if (!email || !password) {
            setErrors({
                email: !email ? 'Email is required' : '',
                password: !password ? 'Password is required' : ''
            });
            return handleError('Email and password are required');
        }

        try {
            const url = "https://localhost:5050/user/login/";
           
            // Send login request to the server
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });

            const result = await response.json();
            const { success, message, token, name, error } = result;

            if (success) {
                // Handle successful login
                handleSucess(message);
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', name);
                navigate('/home'); 
            } else if (error) {
                // Handle server-side validation errors
                const details = error?.details[0]?.message || error;
                handleError(details);
            } else if (!success) {
                // Handle specific error messages for non-existent user or invalid credentials
                if (message === "User does not exist" || message === "Invalid credentials") {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: message === "User does not exist" ? message : '',
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
        <div>
            <div className='container'>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input
                            onChange={handleChange}
                            type="email"
                            name="email"
                            autoFocus
                            placeholder="Enter your email"
                            value={loginInfo.email}
                        />
                        {errors.email && <div className="error">{errors.email}</div>}
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={handleChange}
                            type="password"
                            name="password"
                            autoFocus
                            placeholder="Enter your password"
                            value={loginInfo.password}
                        />
                        {errors.password && <div className="error">{errors.password}</div>}
                    </div>
                    <button type="submit">Login</button>
                    <div className="center-text">
                        <span>Don't have an account? <a href="/register">Register</a></span>
                    </div>
                </form>          
            </div>      
        </div>
    );
}

export default Login;

// (Shaikh, 2024) __---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____---____---____---____---__\\