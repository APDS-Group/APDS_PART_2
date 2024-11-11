import React, { useState } from 'react';
import { handleError, handleSucess } from '../utils';
import { Navigate } from 'react-router-dom';
import NavbarPublic from '../pages/Navbars/NavbarPublic';

import '../styles/Register.css';

function Register() {
    const [redirectToLogin, setRedirectToLogin] = useState(false);

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
            } else {
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
        <>
            <NavbarPublic />
            <div className="body-container2">
                <div className="container-reg">
                    <h1>User <span className="brand-name">Register</span></h1>
                    <form onSubmit={handleRegister} style={{ margin: '0px 20px 20px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                        <div className="register-form">
                            {/* Input Fields 1 */}
                            <div className="form-column">
                                <div className="form-group">
                                    <label htmlFor='firstname'>First Name</label>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        name="firstname"
                                        placeholder="Enter your first name"
                                        value={registerInfo.firstname}
                                    />
                                    {errors.firstname && <div className="error">{errors.firstname}</div>}
                                </div>
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                            </div>
                            {/* Input Fields 2 */}
                            <div className="form-column">
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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
                                <div className="form-group">
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

                            </div>
                        </div>

                        <button type="submit" className="submit-btn" style={{ margin: '20px auto' }}>Register</button>
                        <div className="center-text">
                            <span>Already have an account? <a href="/login">Login</a></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Register;