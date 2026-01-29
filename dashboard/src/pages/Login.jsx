import React, { useState, useContext, useEffect } from "react";
import { Context } from "../main";
import { toast } from "sonner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Shield, Stethoscope } from "lucide-react";

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
      toast.error("Password and Confirm Password must match", {
        position: "top-right",
      });
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
      toast.error(error.response?.data?.message || "Login failed", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated) navigateTo("/");
  }, [isAuthenticated, navigateTo]);

  return (
    <section className="min-h-[100svh] flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-xl border shadow-sm p-6">
        {/* HEADER */}
        <div className="mb-4 text-center">
          <div className="mx-auto mb-2 w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            HMS
          </div>

          <h1 className="text-lg font-semibold text-slate-900">Admin Login</h1>

          <p className="text-xs text-slate-500">Authorized access only</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-600 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-600 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* Backend requirement */}
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-full h-10 rounded-lg border border-slate-300 px-3 text-sm focus:border-blue-600 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="h-10 rounded-lg text-sm">
              <SelectValue placeholder="Login as" />
            </SelectTrigger>

            <SelectContent className="bg-white border shadow-md rounded-lg">
              <SelectItem value="admin">
                <div className="flex items-center gap-2">
                  <Shield size={14} /> Admin
                </div>
              </SelectItem>

              <SelectItem value="doctor">
                <div className="flex items-center gap-2">
                  <Stethoscope size={14} /> Doctor
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <a
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </a>

          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </section>
  );
};

export default Login;
