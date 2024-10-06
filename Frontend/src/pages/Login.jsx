import React, { useState } from 'react';
import { handleError, handleSucess } from '../utils';
import { useNavigate } from 'react-router-dom';

function Login() {

    // Initialize the useNavigate hook
    const navigate = useNavigate(); 
    const [loginInfo, setLoginInfo] = React.useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({       
        email: '',
        password: ''
    });
   

    const handleChange = (e) => {
        const { name, value } = e.target;   
        const newUserInfo = { ...loginInfo };
        newUserInfo[name] = value;
        setLoginInfo(newUserInfo);

        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;      
        if (!email || !password) {
            setErrors({
                email: !email ? 'Email is required' : '',
                password: !password ? 'Password is required' : ''
            });
            return handleError('Email and password are required');
        }
        try {
            const url = "https://localhost:5050/user/login/";
           
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginInfo),
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
           
            const result = await response.json();
        
            const { success, message, token, name, error } = result;
            if (success) {
                handleSucess(message);
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', name);
               // setTimeout(() => {
               //     Navigate('/home');
               // }, 1000);
               navigate('/home'); 
            } else if (error) {
                const details = error?.details[0]?.message || error;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (error) {
            handleError(error.message);
        }
    };

    return (
        <div >
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