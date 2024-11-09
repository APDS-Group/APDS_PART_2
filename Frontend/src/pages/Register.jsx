// Import necessary modules and hooks from React and react-router-dom
import React, { useState } from 'react';
import { handleError, handleSucess } from '../utils';
import { Navigate } from 'react-router-dom';


function Register() {

    // State to handle redirection to the login page after successful registration
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    // State to store registration information (name, email, password)
    const [registerInfo, setRegInfo] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountNumber: '',
        idNumber: ''
    });

    // State to store error messages for name, email, and password fields
    const [errors, setErrors] = useState({
        firstname: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountNumber: '',
        idNumber: ''
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
        const { firstname, lastname, username, email, password, confirmPassword, accountNumber, idNumber } = registerInfo;

        if (!firstname || !lastname || !username || !email || !password || !confirmPassword || !accountNumber || !idNumber) {
            setErrors({
                firstname: !firstname ? 'First name is required' : '',
                lastname: !lastname ? 'Last name is required' : '',
                username: !username ? 'Username is required' : '',
                email: !email ? 'Email is required' : '',
                password: !password ? 'Password is required' : '',
                confirmPassword: !confirmPassword ? 'Confirm password is required' : '',
                accountNumber: !accountNumber ? 'Account number is required' : '',
                idNumber: !idNumber ? 'ID number is required' : ''
            });
            return;
        }
        if (password !== confirmPassword) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                confirmPassword: 'Passwords do not match'
            }));
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
            } else {
                // Handle other errors
                handleError(message);
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
                    <label htmlFor='firstname'>First Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="firstname"
                        autoFocus
                        placeholder="Enter your first name"
                        value={registerInfo.firstname}
                    />
                    {errors.firstname && <div className="error">{errors.firstname}</div>}
                </div>
                <div>
                    <label htmlFor='lastname'>Last Name</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="lastname"
                        placeholder="Enter your last name"
                        value={registerInfo.lastname}
                    />
                    {errors.lastname && <div className="error">{errors.lastname}</div>}
                </div>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="username"
                        placeholder="Enter your username"
                        value={registerInfo.username}
                    />
                    {errors.username && <div className="error">{errors.username}</div>}
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
                <div>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={registerInfo.confirmPassword}
                    />
                    {errors.confirmPassword && <div className="error">{errors.confirmPassword}</div>}
                </div>
                <div>
                    <label htmlFor='accountNumber'>Account Number</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="accountNumber"
                        placeholder="Enter your account number"
                        value={registerInfo.accountNumber}
                    />
                    {errors.accountNumber && <div className="error">{errors.accountNumber}</div>}
                </div>
                <div>
                    <label htmlFor='idNumber'>ID Number</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="idNumber"
                        placeholder="Enter your ID number"
                        value={registerInfo.idNumber}
                    />
                    {errors.idNumber && <div className="error">{errors.idNumber}</div>}
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