import React, { useState, useEffect } from "react";
import { registerUser, verifyUser, resendOTP } from "../api/user.api";
import { useDispatch } from "react-redux";
import { login } from "../store/slice/authSlice";
import { Link, useNavigate } from "@tanstack/react-router";
import OTPComp from "./OTPComp";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/regex";

const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isFormValid = email.trim() !== "" && password.trim() !== ""

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!EMAIL_REGEX.test(email)){
      setError("Please enter a valid email address.")
      return
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError("Password must be at least 8 characters, include an uppercase letter, a number, and a special character.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await registerUser(name, email, password);
      // console.log(data);
      // dispatch(login(data.user));
      // navigate({ to: "/dashboard" });
      setStep(2);
    } catch (error) {
      setError(error.message || "Registration failed, Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (otpString) => {
    setLoading(true)
    setError("")
    try {
      const data = await verifyUser(email, otpString)
      dispatch(login(data.user))
      navigate({to: "/dashboard"})
    } catch (error) {
      setError(error.message || "Invalid OTP")
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    setError("")
    try {
      await resendOTP(email)
      // notification new code sent
    } catch (error) {
      setError(error.message || "Could not resend OTP")
    }
  }


  return (
    <div>
      {step === 1 && (
        <div className="">
          <h1 className="font-semibold text-center mb-5 text-2xl">
            Create Account
          </h1>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <label
              htmlFor="name"
              className="block font-medium text-gray-700 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              required
              className={`w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1 ${loading ? 'bg-gray-100 cursor-not-allowed' : ''}`}
            />

            <label
              htmlFor="email"
              className="block font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className={`w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1 ${loading ? "bg-gray-100 cursor-not-allowed" : ""}`}
            />

            <label
              htmlFor="password"
              className="block font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <div className="relative">
              <input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="**********"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className={`w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1 pr-10 ${loading ? " bg-gray-100 cursor-not-allowed" : ""}`}
            />
            {password && <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1.5 text-sm text-gray-600 hover:text-blue-500"
            >
              {showPassword ? "Hide" : "Show"}
            </button>}
            </div>
            

            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 items-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 rounded-md"
            >
              {loading ? "Sending OTP..." : "Register"}
            </button>
          </form>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col justify-center items-center">
          <h1 className="font-semibold text-center mb-5 text-2xl">
            Verify Email
          </h1>
          <div className="flex flex-col">
            <p className="mb-1 text-gray-600">
              Code sent to <b>{email}</b>{" "}
            </p>
            <p className="text-sm text-gray-800" >
              Wrong Email ? {" "}
              <button
                onClick={() => {
                  setStep(1)
                  setPassword("")
                  setError("")
                }}
                className="text-sm text-blue-500 hover:text-blue-600 mb-4 "
              >
                Go Back
              </button>
            </p>
          </div>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
          <OTPComp 
            onVerify={handleVerification} 
            onResend={handleResendOTP}
            // isLoading={loading}
            />
        </div>
      )}

      <div className="flex items-center justify-center mt-5">
        <p className="text-sm text-gray-800">
          Already have an account ? {" "}
          <Link
            to="/login"
            className="text-blue-500  hover:text-blue-600"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterForm;
