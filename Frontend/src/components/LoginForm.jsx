import React, { useEffect, useState } from "react";
import { loginUser } from "../api/user.api";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/slice/authSlice";
import {Link, useNavigate} from '@tanstack/react-router'
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/regex";

const LoginForm = () => {
  const [email, setEmail] = useState("one@gmail.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const handleSubmit = async (e) => {
    e.preventDefault()

    if(!EMAIL_REGEX.test(email)){
          setError("Please enter a valid email address.")
          return
        }
    
    if (!PASSWORD_REGEX.test(password)) {
          setError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
          return;
        }

    setLoading(true)
    setError('')

    try {
        const data = await loginUser(email, password)
        dispatch(login(data.user))
        navigate({to:"/dashboard", replace: true})
        
    } catch (error) {
        setError(error.message || "Login faild. Please check your credentials")
    } finally{
        setLoading(false)
    } 
  }
  
  return (
    <div>
      <h2 className='font-semibold text-center mb-5 text-2xl' >Login</h2>
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
        </div>
      )}
      <form autoComplete="off" onSubmit={handleSubmit} className="space-y-4" >
        <label 
            htmlFor="email" 
            className="block font-medium text-gray-700 mb-1"
            >Email
        </label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1"
        />

        <label 
            htmlFor="password"
            className="block font-medium text-gray-700 mb-1"
            >Password
        </label>
        <input
          type="password"
          id="password"
          placeholder="**********"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1"
        />

        <button 
            type="submit"
            disabled={!isFormValid || loading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 items-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 rounded-md"
            >{loading ? "Signing In.... " : "Sign In"}
        </button>
      </form>
    
    <div className="flex items-center justify-center mt-5">
        <p className="text-sm text-gray-800" >Don't have an account?<Link to="/register" className="text-blue-500 hover:text-blue-600">Register</Link></p>

    </div>
    </div>
  );
};

export default LoginForm;
