// Import necessary modules and hooks from React and react-router-dom
import React, { useState } from 'react';
import { handleError, handleSucess } from '../utils';
import { Navigate } from 'react-router-dom';


function Register() {

    // State to handle redirection to the login page after successful registration
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    // State to store registration information (name, email, password)
    const [registerInfo, setRegInfo] = useState({
        name: '',
        email: '',
        password: ''
    });

    // State to store error messages for name, email, and password fields
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: ''
    }); 

    // Handle input changes and update the registerInfo state
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newUserInfo = { ...registerInfo };
        newUserInfo[name] = value;
        setRegInfo(newUserInfo);
       
        // Clear the error message for the changed field
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: ''
        }));
    };

    // Handle form submission for registration
    const handleRegister = async (e) => {
        e.preventDefault();
        const { name, email, password } = registerInfo;

        // Validate name, email, and password fields
        if (!name || !email || !password) {
            setErrors({
                name: !name ? 'Name is required' : '',
                email: !email ? 'Email is required' : '',
                password: !password ? 'Password is required' : ''
            });
            return;
        }

        try {
            const url = "https://localhost:5050/user/signup";
            // Send registration request to the server
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
                // Handle successful registration
                handleSucess(message);
                setTimeout(() => {
                    setRedirectToLogin(true);
                }, 1000);
            } else if (errors) {
                // Handle validation errors from the server
                setErrors(errors);
            } else if (!success) {
                // Handle specific error message for existing user
                if (message === "User already exists") {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        email: message
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

    // Redirect to the login page if registration is successful
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
// (Shaikh, 2024) __---____---____---____---____---____---____---__.ooo END OF FILE ooo.__---____---____---____---____---____---____---__\\