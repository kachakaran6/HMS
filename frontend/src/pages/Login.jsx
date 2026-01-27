import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Login = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${baseURL}/api/v1/user/login`,
        {
          email,
          password,
          confirmPassword,
          role: "patient",
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        },
      );

      toast.success(data.message);
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
    <section className="min-h-[90svh] flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
        <h2 className="text-3xl font-bold text-slate-900 text-center">
          Sign In
        </h2>

        <p className="mt-2 text-center text-slate-600">
          Please login to continue
        </p>

        <form onSubmit={handleLogin} className="mt-8 space-y-5">
          <input
            type="email"
            placeholder="Email address"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <input
            type="password"
            placeholder="Confirm Password"
            className="input"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex justify-end text-sm">
            <span className="text-slate-600 mr-1">Not registered?</span>
            <Link
              to="/register"
              className="text-blue-600 hover:underline font-medium"
            >
              Register now
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-teal-500 text-white font-medium hover:opacity-90 transition"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
