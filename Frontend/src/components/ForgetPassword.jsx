import { Link, useNavigate } from "@tanstack/react-router";
import React, { useState } from "react";
import { EMAIL_REGEX, PASSWORD_REGEX } from "../utils/regex";
import {
  setPassword,
  verifyUserEmail,
  verifyOTPForPasswordChange,
  resendOTPForPasswordChange,
} from "../api/user.api";
import { EmailStep } from "./EmailStep";
import { OTPStep } from "./OTPStep";
import { PasswordStep } from "./PasswordStep";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const navigate = useNavigate();

  const handleSubmit = async () => {
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
      await verifyOTPForPasswordChange(email, otpString);
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
      await resendOTPForPasswordChange(email);
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

  return <div>
    <div className="flex flex-col justify-center">
      {step === 1 && (
        <EmailStep 
          email={email}
          setEmail={setEmail}
          loading={loading}
          error={error}
          handleSubmit={handleSubmit}
        />
      )}

      {step ===2 && (
        <OTPStep 
        email={email}
        error={error}
        onVerify={handleVerification}
        onResend={hanldeResendOTP}
        onGoBack={() => {
          setStep(1)
          setError("")
        }}
        />
      )}

      {step === 3 && (
        <PasswordStep 
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          setNewPassword={setNewPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          error={error}
          onSubmit={handlePasswordReseting}
        />
      )}
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
