import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";

const Register = () => {
  const { isAuthenticated } = useContext(Context);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [patientId, setPatientId] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [password, setPassword] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigateTo = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${baseURL}/api/v1/user/register`,
        {
          firstName,
          lastName,
          email,
          password,
          phone,
          patientId,
          dob,
          gender,
          role: "patient",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      toast.success(data.message || "Registered successfully", {
        position: "top-right",
      });
      navigateTo("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Registration failed", {
        position: "top-right",
      });
    }
  };

  // already logged in → redirect
  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <section className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Create Account
        </h2>

        <p className="mt-2 text-center text-slate-600">
          Sign up to access our healthcare services
        </p>

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
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

          {/* Redirect */}
          <div className="flex justify-end text-sm">
            <span className="text-slate-600 mr-1">Already registered?</span>
            <Link
              to="/login"
              className="text-blue-600 hover:underline font-medium"
            >
              Login now
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
};

export default Register;
