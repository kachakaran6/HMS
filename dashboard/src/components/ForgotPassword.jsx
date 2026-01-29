import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const sendOtp = async () => {
    try {
      await axios.post(`${baseURL}/api/v1/auth/send-otp`, { email });
      toast.success("OTP sent");
      setOtpSent(true);
    } catch {
      toast.error("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${baseURL}/api/v1/auth/verify-otp`, { email, otp });
      toast.success("OTP verified");
      setOtpVerified(true);
    } catch {
      toast.error("Invalid OTP");
    }
  };

  const resetPassword = async () => {
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    try {
      await axios.post(`${baseURL}/api/v1/auth/rest-password`, {
        email,
        newPassword,
      });

      toast.success("Password reset successfully");
      window.location.href = "/login";
    } catch {
      toast.error("Reset failed");
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold text-center mb-4">
          Forgot Password
        </h2>

        {!otpSent && (
          <>
            <input
              className="w-full h-10 border rounded-lg px-3 mb-3"
              placeholder="Registered Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              onClick={sendOtp}
              className="w-full h-10 bg-blue-600 text-white rounded-lg"
            >
              Send OTP
            </button>
          </>
        )}

        {otpSent && !otpVerified && (
          <>
            <input
              className="w-full h-10 border rounded-lg px-3 mb-3 text-center tracking-widest"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              onClick={verifyOtp}
              className="w-full h-10 bg-green-600 text-white rounded-lg"
            >
              Verify OTP
            </button>
          </>
        )}

        {otpVerified && (
          <>
            <input
              type="password"
              className="w-full h-10 border rounded-lg px-3 mb-3"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              className="w-full h-10 border rounded-lg px-3 mb-3"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              onClick={resetPassword}
              className="w-full h-10 bg-blue-600 text-white rounded-lg"
            >
              Reset Password
            </button>
          </>
        )}
      </div>
    </section>
  );
};

export default ForgotPassword;
