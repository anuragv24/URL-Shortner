import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/regex";
import {
  resendOTP,
  verifyUser,
  setPassword,
  verifyUserEmail,
} from "../api/user.api";
import OTPComp from "./OTPComp";

const ForgetPassword = () => {
  const [email, setEmail] = useState("example.com");
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(3);
  const [showNPassword, setShowNPassword] = useState(false);
  const [showCPassword, setShowCPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      await verifyUserEmail(email);
      setStep(2);
    } catch (error) {
      setError(error.message || "Please try again");
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (otpString) => {
    setLoading(true);
    setError("");

    try {
      await verifyUser(email, otpString);
      setStep(3);
    } catch (error) {
      setError(error.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const hanldeResendOTP = async () => {
    setError("");
    try {
      await resendOTP(email);
    } catch (error) {
      setError(error.message || "Could not resnd OTP. Try again");
    }
  };

  const handlePasswordReseting = async (e) => {
    e.preventDefault();
    setError("");

    if (!PASSWORD_REGEX.test(newPassword)) {
      setError(
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
      );
      return;
    }
    if (!PASSWORD_REGEX.test(confirmPassword)) {
      setError(
        "Password must be at least 8 characters, include an uppercase letter, a number, and a special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password mismatched.");
      return;
    }

    setLoading(true);

    try {
      await setPassword(email, newPassword);
      setStep(1)
      navigate({ to: "/login" });
    } catch (error) {
      setError(error.message || "Something went wrong. Try again later");
    } finally {
      setLoading(false);
    }
  };

  const ErrorBox = ({message}) => (
    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
      {message}
    </div>
  )

  const EmailStep = () => (
    <div>
          <h2 className="font-semibold text-center mb-5 text-2xl">
            Forgot Password
          </h2>

          {error && <ErrorBox>{error}</ErrorBox>}

          <p className="text-center mb-5 text-gray-600">
            Don't worry it happens. Please enter the email associated with your
            accound.
          </p>
          <form
            autoComplete="off"
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <label
              htmlFor="email"
              className="block font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email address"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-3 py-2"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 items-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 rounded-md"
            >
              {loading ? "Sending Code... " : "Send Code"}
            </button>
          </form>
        </div>
  )

  const OTPStep = () => (
    <div>
          <h1 className="font-semibold text-center text-2xl mb-5">
            Verification
          </h1>

            <p className="text-center mb-2 text-gray-600">
              Code sent to <b>{email}</b>
            </p>

            <p className="text-center text-sm mb-4">
              Wrong Email?{" "}
              <button
                onClick={() => {
                  setStep(1);
                  setError("");
                }}
                className="text-blue-500 hover:text-blue-600 cursor-pointer"
              >
                Go Back
              </button>
            </p>

          {error && <ErrorBox>{error}</ErrorBox>}

          <div className="flex justify-center">
            <OTPComp 
              onVerify={handleVerification} 
              onResend={hanldeResendOTP} 
            />
          </div>
        </div>
  )

  const PasswordStep = () => (
    <div>
          <h1 className="font-semibold text-center mb-5 text-2xl">
            New Password
          </h1>
          
          {error && <ErrorBox>{error}</ErrorBox>}

          <form
            onSubmit={handlePasswordReseting}
            autoComplete="off"
            className="space-y-4"
          >
            <label
              htmlFor="newPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showNPassword ? "text" : "password"}
                id="newPassword"
                placeholder="********"
                autoComplete="new-password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={loading}
                required
                className={`w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1 pr-10 ${
                  loading ? " bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {newPassword && (
                <button
                  type="button"
                  onClick={() => setShowNPassword(!showNPassword)}
                  className="absolute right-2 top-1.5 text-sm text-gray-600 hover:text-blue-500"
                >
                  {showNPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>

            <label
              htmlFor="confirmPassword"
              className="block font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showCPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="********"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
                required
                className={`w-full min-w-max border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 rounded-md px-2 py-1 pr-10 ${
                  loading ? " bg-gray-100 cursor-not-allowed" : ""
                }`}
              />
              {confirmPassword && (
                <button
                  type="button"
                  onClick={() => setShowCPassword(!showCPassword)}
                  className="absolute right-2 top-1.5 text-sm text-gray-600 hover:text-blue-500"
                >
                  {showCPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 items-center font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 rounded-md"
            >
              {loading ? "Password Reseting..." : "Reset Password"}
            </button>
          </form>
        </div>
  )

  const renderStep = () => {
    switch (step) {
      case 1: return <EmailStep />
      case 2: return <OTPStep />
      case 3: return <PasswordStep />
      default: return null
    }
  }

  return <div>
    <div className="min-h-[380px] flex flex-col justify-center">
      {renderStep()}
    </div>
      
      {step !== 3 && (
        <div className="flex justify-center items-center mt-6">
          <p className="text-sm text-gray-800">
            Remember Password?
            <Link
              to="/login"
              className="ml-1 text-blue-500 hover:text-blue-600 font-semibold"
            >
              {" "}
              Log in
            </Link>
          </p>
        </div>
      )}

    </div>
};

export default ForgetPassword;
