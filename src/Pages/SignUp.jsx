import React from 'react'
import { useState } from 'react'
import { useNavigate, NavLink } from 'react-router'
import { getUsers, saveUsers } from '../utils/auth.js';
import LogoImage from "../assets/logo.png"




const SignUp = () => {
    const navigate = useNavigate ();
   const [user, setUser] = useState({
      username: "",
      password: "",
      email: "",
    });
    const [error, setError] = useState({
      username: "",
      password: "",
      email: "",
    });
  
      const email_regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
    const handleChange = (e) => {

        const {name, value} = e.target;
        setUser({...user,[name]:value})
        let newError = {...error};

        if (name === "email") {
          if (value === "") {
            newError.email = "Email is required";

          } else if (!email_regex.test(value)){
            newError.email = "Invalid email format";
          }else{
            newError.email = "";
          }
        } 

       if (name === "username") {
  newError.username = value === "" ? "Username is Required" : "";
}

        if (name === "password") {
      if (value === "") {
        newError.password = "Password is required";
      } else if (value.length < 6) {
        newError.password = "Password must be at least 6 characters";
      } else {
        newError.password = "";
      }
    }

    setError(newError);
  };
   const handleSignup = (e) => {
  e.preventDefault();
  let newError = {
    username: user.username === "" ? "Username is Required" : "",
    email: user.email === "" ? "Email is required"
      : !email_regex.test(user.email) ? "Invalid email address"
      : "",
    password: user.password === "" ? "Password is Required" : "",
  };
  setError(newError);
  const hasErrors = Object.values(newError).some((msg) => msg !== "");
  if (hasErrors) return;

  const users = getUsers();
  const emailTaken = users.some((u) => u.email === user.email);
  if (emailTaken) {
    setError({ ...newError, email: "An account with this email already exists" });
    return;
  }

  const newUser = {
    id: Date.now().toString(),
    username: user.username,
    email: user.email,
    password: user.password,
  };
  saveUsers([...users, newUser]);
  alert("Account created! You can now log in.");
  navigate("/");
};
    

  return (
    <div className='signup-container flex flex-col justify-center items-center h-screen bg-gray-50 px-4'>
      
      <div className="signup-form   w-full max-w-sm bg-white p-8 rounded-lg shadow-md">
        <div className="login-heading flex flex-col items-center mb-8">
      <h3 className="text-blue-600 font-extrabold text-4xl p-4"> PagePace</h3>
        <p className="text-gray-500 text-sm">Welcome back! Lets get back to work</p>
      </div>
       <form className="sign-up-form   flex flex-col gap-4   " onSubmit={handleSignup}>
          <label htmlFor="username text-sm font-medium text-gray-700 mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={user.username}
            onChange={handleChange}
            placeholder="Enter your username"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          {error.username && <p className="error">{error.username}</p>} 
          <label htmlFor="email text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          {error.email && <p className='error'>{error.email}</p>}
          <label htmlFor="password text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={user.password}
            onChange={handleChange}
            placeholder="Enter your password"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          {error.password && <p className="error">{error.password}</p>}
          <button type="submit" className="bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition">Sign Up</button>
          <p>Already have an account? <span><NavLink to="/" className="text-blue-600 font-medium">
          Login
          </NavLink></span>
           </p>
        </form>





      </div>
    </div>
  )
}

export default SignUp;