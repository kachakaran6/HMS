import React, { useState, useContext, useEffect } from "react";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("admin");

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Password and Confirm Password must match");
      return;
    }

    try {
      const { data } = await axios.post(
        `${baseURL}/api/v1/user/login`,
        {
          email,
          password,
          confirmPassword,
          role, // ✅ admin OR doctor
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      toast.success(data.message);
      localStorage.setItem("role", role);
      setIsAuthenticated(true);
      navigateTo("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigateTo("/");
  }, [isAuthenticated, navigateTo]);

  return (
    <section className="min-h-[100svh] flex items-center justify-center bg-slate-100 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-8">
        {/* Logo / Brand */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center text-white font-bold text-xl">
            A
          </div>
        </div>

        <h1 className="text-2xl font-bold text-slate-900 text-center">
          Admin Login
        </h1>

        <p className="mt-2 text-center text-slate-600 text-sm">
          Only administrators are allowed to access this panel
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Required because backend needs it */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="admin">Admin</option>
            <option value="doctor">Doctor</option>
          </select>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
