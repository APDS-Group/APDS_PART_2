import React from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../utils';
import { Navigate } from 'react-router-dom';

function Login() {
    const [loginInfo, setLoginInfo] = React.useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value); // Log the input changes
        const newUserInfo = { ...loginInfo };
        newUserInfo[name] = value;
        setLoginInfo(newUserInfo);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('Email and password are required');
        }
        try {
            const url = "https://localhost:5050/user/login/";
            console.log('Sending login request:', loginInfo); // Log the request being sent
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
            console.log('Received response:', result); // Log the received response
            const { success, message, token, name, error } = result;
            if (success) {
                handleSucess(message);
                localStorage.setItem('token', token);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    Navigate('/home');
                }, 1000);
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
                </div>
                <button type="submit">Login</button>
                <span>Don't have an account? <a href="/register">Register</a></span>
            </form>
            <ToastContainer />
        </div>
    );
}

export default Login;