/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";

const AddNewDoctor = () => {
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");
  const [docDepartment, setDocDepartment] = useState("");
  const [docAvatar, setDocAvatar] = useState("");
  const [docAvatarPreview, setDocAvatarPreview] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const OTP_DURATION = 300; // 5 minutes in seconds

  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (!showOtpBox) return;

    setTimeLeft(OTP_DURATION);
    setCanResend(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showOtpBox]);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Gynecologist",
    "Neurology",
    "Radiology",
    "Dermatology",
    "Cardiology",
  ];

  const navigateTo = useNavigate();

  const handleAvatar = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setDocAvatarPreview(reader.result);
      setDocAvatar(file);
    };
  };

  const handleAddNewDoc = async (e) => {
    e.preventDefault();
    setSendingOtp(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("patientId", patientId);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", docDepartment);
      formData.append("docAvatar", docAvatar);

      const res = await axios.post(
        `${baseURL}/api/v1/user/doctor/addnew`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      toast.success("Doctor added. OTP sent to doctor email.");
      setShowOtpBox(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setSendingOtp(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("patientId", patientId);
      formData.append("dob", dob);
      formData.append("gender", gender);
      formData.append("doctorDepartment", docDepartment);
      formData.append("docAvatar", docAvatar);

      await axios.post(`${baseURL}/api/v1/user/doctor/addnew`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("OTP resent successfully");
      setTimeLeft(OTP_DURATION);
      setCanResend(false);
    } catch (error) {
      toast.error("Failed to resend OTP", error);
    } finally {
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    setVerifyingOtp(true);

    try {
      const res = await axios.post(
        `${baseURL}/api/v1/auth/verify-otp`,
        { email, otp },
        { withCredentials: true },
      );

      toast.success("OTP verified successfully");
      setOtpVerified(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setVerifyingOtp(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <section className="space-y-6">
      <div className="max-w-3xl bg-white rounded-2xl shadow p-8">
        <h2 className="text-2xl font-bold text-slate-900">Add Doctor</h2>

        <p className="mt-1 text-slate-600">
          Please enter details of the doctor
        </p>

        <form onSubmit={handleAddNewDoc} className="mt-6 space-y-6">
          {/* Avatar + Upload */}
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <img
              src={docAvatarPreview ? docAvatarPreview : "/docHolder.jpg"}
              alt="Doctor Avatar"
              className="w-32 h-32 rounded-full object-cover border"
            />

            <label className="cursor-pointer">
              <span className="inline-block px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition">
                Upload Avatar
              </span>
              <input type="file" onChange={handleAvatar} className="hidden" />
            </label>
          </div>

          {/* Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="First Name"
              className="input"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="email"
              placeholder="Email"
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Phone Number"
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Patient ID & DOB */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient ID"
              className="input"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
            />
            <input
              type="date"
              className="input"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
          </div>

          {/* Gender & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              className="input"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Department */}
          <select
            className="input"
            value={docDepartment}
            onChange={(e) => setDocDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            {departmentsArray.map((depart) => (
              <option value={depart} key={depart}>
                {depart}
              </option>
            ))}
          </select>
          {showOtpBox && !otpVerified && (
            <div className="space-y-4 border-t pt-6">
              <h3 className="text-lg font-semibold text-slate-900">
                Email Verification
              </h3>

              <p className="text-sm text-slate-600">
                An OTP has been sent to <strong>{email}</strong>
              </p>

              <input
                type="text"
                placeholder="Enter 6-digit OTP"
                className="input text-center tracking-widest"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
                disabled={verifyingOtp}
              />

              {/* Timer */}
              <p className="text-sm text-slate-500">
                OTP expires in{" "}
                <span className="font-semibold text-slate-700">
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </p>

              <div className="flex flex-col md:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp}
                  className="px-8 py-3 rounded-xl bg-green-600 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
                >
                  {verifyingOtp ? "Verifying OTP..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={!canResend || sendingOtp}
                  className="px-8 py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition disabled:opacity-50"
                >
                  {sendingOtp ? "Resending..." : "Resend OTP"}
                </button>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={sendingOtp}
              className="w-full md:w-auto px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {sendingOtp ? "Sending OTP..." : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddNewDoctor;
