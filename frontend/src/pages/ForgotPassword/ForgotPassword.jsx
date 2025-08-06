import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleNext = () => {
    setError("");

    if (step === 1) {
      if (!email || !email.includes("@")) {
        setError("Please enter a valid email address.");
        return;
      }
      // Simulate API call
      alert(`OTP sent to: ${email}`);
      setStep(2);
    } else if (step === 2) {
      if (!otp || otp.length < 4) {
        setError("Please enter a valid OTP.");
        return;
      }
      alert("OTP verified.");
      setStep(3);
    } else if (step === 3) {
      if (!newPassword || newPassword.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      alert("Password reset successful!");
      setStep(4);
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-3xl font-bold text-center text-[#111416] mb-4">
          {step === 1 && "Forgot password?"}
          {step === 2 && "Enter OTP"}
          {step === 3 && "Reset your password"}
          {step === 4 && "All set!"}
        </h2>

        {step === 1 && (
          <>
            <p className="text-[#607589] text-center mb-6">
              Enter the email associated with your account and we’ll send an OTP
              to reset your password.
            </p>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-3 bg-[#EFF2F4] text-[#607589] rounded-lg border border-[#DBE0E5] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </>
        )}

        {step === 2 && (
          <input
            type="text"
            placeholder="Enter your OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full p-3 mb-3 bg-[#EFF2F4] text-[#607589] rounded-lg border border-[#DBE0E5] focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        )}

        {step === 3 && (
          <>
            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 mb-3 bg-[#EFF2F4] text-[#607589] rounded-lg border border-[#DBE0E5] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 mb-3 bg-[#EFF2F4] text-[#607589] rounded-lg border border-[#DBE0E5] focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </>
        )}

        {step === 4 && (
          <p className="text-center text-[#607589] mb-4">
            Your password has been successfully reset. You can now log in with
            your new credentials.
          </p>
        )}

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          onClick={handleNext}
          className="w-full bg-[#0C7FF2] text-white font-bold py-3 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? (
            <ClipLoader size={20} color="white" />
          ) : step === 1 ? (
            "Send OTP"
          ) : step === 2 ? (
            "Submit OTP"
          ) : step === 3 ? (
            "Reset Password"
          ) : (
            "Back to Login"
          )}
        </button>

        {step < 4 && (
          <button
            onClick={() => navigate("/login")}
            className="block mx-auto mt-4 text-[#607589] text-sm hover:underline"
          >
            Back to login
          </button>
        )}
      </div>
    </div>
  );
}
