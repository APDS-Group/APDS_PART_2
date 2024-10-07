import React, { useState } from 'react';
import { handleError, handleSucess } from '../utils';
import { Navigate } from 'react-router-dom';

function Register() {

    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [registerInfo, setRegInfo] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    }); 

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newUserInfo = { ...registerInfo };
        newUserInfo[name] = value;
        setRegInfo(newUserInfo);
       
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, email, password } = registerInfo;
        if (!name || !email || !password) {
            setErrors({
                name: !name ? 'Name is required' : '',
                email: !email ? 'Email is required' : '',
                password: !password ? 'Password is required' : ''
            });
          //  return handleError('Name, email, and password are required');
        }
        try {
            const url = "https://localhost:5050/user/signup";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registerInfo),
            });
            const result = await response.json();
            const { success, message, errors } = result;
            if (success) {
                handleSucess(message);
                setTimeout(() => {
                    setRedirectToLogin(true);
                }, 1000);
            } else if (errors) {
                setErrors(errors);
            } else if (!success) {
                handleError(message);
            }
        } catch (error) {
            handleError(error.message);
        }
    };

    if (redirectToLogin) {
        return <Navigate to="/login" />;
    }

    return (
        <div className='container'>
            <h1>Register</h1>
            <form onSubmit={handleRegister}>
                <div>
                    <label htmlFor='name'>Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="name"
                        autoFocus
                        placeholder="Enter your name"
                        value={registerInfo.name}
                    />
                    {errors.name && <div className="error">{errors.name}</div>}
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={registerInfo.email}
                    />
                    {errors.email && <div className="error">{errors.email}</div>}
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        value={registerInfo.password}
                    />
                    {errors.password && <div className="error">{errors.password}</div>}
                </div>
                <button type="submit">Register</button>
                <div className="center-text">
                <span>Already have an account? <a href="/login">Login</a></span>
            </div>
            </form>         
        </div>
    );
}

export default Register;