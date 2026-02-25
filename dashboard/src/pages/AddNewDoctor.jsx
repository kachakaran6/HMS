/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useState, useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Context } from "../main";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

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
  const [showPassword, setShowPassword] = useState(false);

  const [timeLeft, setTimeLeft] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);

  const generatePatientId = () => {
    const now = new Date();

    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yyyy = now.getFullYear();
    const hh = String(now.getHours()).padStart(2, "0");
    const min = String(now.getMinutes()).padStart(2, "0");

    const random = Math.floor(100 + Math.random() * 900); // 3 digit random

    return `${dd}${mm}${yyyy}${hh}${min}${random}`;
  };

  useEffect(() => {
    setPatientId(generatePatientId());
  }, []);

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

      toast.success("Doctor added. OTP sent to doctor email.", {
        position: "top-right",
      });
      setShowOtpBox(true);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed", {
        position: "top-right",
      });
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
    <section className="bg-slate-50 p-6 rounded-xl">
      <div className="max-w-3xl bg-white rounded-2xl border shadow-sm p-8">
        {/* HEADER */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Add Doctor</h2>
          <p className="mt-1 text-sm text-slate-600">
            Enter professional and personal details to register a doctor
          </p>
        </div>

        <form onSubmit={handleAddNewDoc} className="space-y-8">
          {/* ================= AVATAR ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Profile Photo
            </h3>

            <div className="flex items-center gap-6">
              <img
                src={docAvatarPreview || "/docHolder.jpg"}
                alt="Doctor Avatar"
                className="w-28 h-28 rounded-full object-cover border"
              />

              <label className="cursor-pointer">
                <span className="inline-block px-5 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium hover:bg-blue-100 transition">
                  Upload Avatar
                </span>
                <input type="file" onChange={handleAvatar} className="hidden" />
              </label>
            </div>
          </section>

          {/* ================= BASIC INFO ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">First Name</label>
                <input
                  type="text"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Last Name</label>
                <input
                  type="text"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ================= CONTACT ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Contact Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">Email</label>
                <input
                  type="email"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Phone</label>
                <input
                  type="tel"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* ================= PERSONAL ================= */}
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
              Personal & Role
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-700">Doctor ID</label>
                <input
                  type="text"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Date of Birth</label>
                <input
                  type="date"
                  className="mt-1 w-full h-11 rounded-lg border border-slate-300 px-3 focus:border-blue-600 focus:outline-none"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-slate-700">Gender</label>

                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="mt-1 w-full h-11 rounded-lg border border-slate-300 text-sm focus:border-blue-600">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>

                  <SelectContent className="bg-white border shadow-md rounded-lg">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-slate-700">Password</label>

                <div className="relative mt-1">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full h-11 rounded-lg border border-slate-300 px-3 pr-10
                 focus:border-blue-600 focus:outline-none"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm text-slate-700">Department</label>

              <Select value={docDepartment} onValueChange={setDocDepartment}>
                <SelectTrigger className="mt-1 w-full h-11 rounded-lg border border-slate-300 text-sm focus:border-blue-600">
                  <SelectValue placeholder="Select Department" />
                </SelectTrigger>

                <SelectContent className="bg-white border shadow-md rounded-lg">
                  {departmentsArray.map((depart) => (
                    <SelectItem key={depart} value={depart}>
                      {depart}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* ================= EMAIL OTP ================= */}
          {showOtpBox && !otpVerified && (
            <section className="space-y-4 border-t pt-6">
              <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                Email Verification
              </h3>

              <p className="text-sm text-slate-600">
                An OTP has been sent to <strong>{email}</strong>
              </p>

              <input
                type="text"
                maxLength={6}
                disabled={verifyingOtp}
                className="w-full md:w-64 h-11 rounded-lg border border-slate-300 text-center tracking-widest focus:border-blue-600 focus:outline-none"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              <p className="text-sm text-slate-500">
                OTP expires in{" "}
                <span className="font-semibold text-slate-700">
                  {Math.floor(timeLeft / 60)}:
                  {String(timeLeft % 60).padStart(2, "0")}
                </span>
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={verifyingOtp}
                  className="px-8 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition disabled:opacity-60"
                >
                  {verifyingOtp ? "Verifying..." : "Verify OTP"}
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
            </section>
          )}

          {/* ================= SUBMIT ================= */}
          <div className="pt-6 border-t flex justify-end">
            <button
              type="submit"
              disabled={sendingOtp}
              className="px-10 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60"
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
