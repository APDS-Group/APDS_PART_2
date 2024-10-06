import React from 'react';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSucess } from '../utils';
import { Navigate } from 'react-router-dom';

function Register() {

    const[registerInfo, setRegInfo] = React.useState({
        name: '',
        email: '',
        password: ''
    });
 const handleChange = (e) => {
    const { name, value } = e.target;
            console.log(name,value);
            const newUserInfo = { ...registerInfo};
            newUserInfo[name] = value;
            setRegInfo(newUserInfo);
 };
 console.log('loginInfo-->', registerInfo);

 const  handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password } = registerInfo;
    if(!name || !email || !password) {
        return handleError('name , email and password are required');
      
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
         const{ success, message,error} = result;
         if (success) {
            handleSucess(message);
            setTimeout(()=> {
                Navigate('/login');
            },1000);
         }
         else if (error) {
            const details = error?.details[0].message;
                handleError(details);
         }
         else if (!success)
         {
            handleError(message);
         }
         
    } catch (error) {
        handleError(error);
    }
 };


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
                        value={registerInfo.name}/>
                </div>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input
                     onChange={handleChange}
                        type="email"
                        name="email"
                        autoFocus
                        placeholder="Enter your email"
                        value={registerInfo.email}/>
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input
                     onChange={handleChange}
                        type="password"
                        name="password"
                        autoFocus
                        placeholder="Enter your password" 
                        value={registerInfo.password}/>
                </div>
                <button type="submit">Register</button>
                <span>Already have an account? <a href="/login">Login</a></span>


            </form>
            <ToastContainer />
        </div>
    );
}

export default Register;