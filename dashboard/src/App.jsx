/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Message from "./pages/Message";
import AddNewAdmin from "./pages/AddNewAdmin";
import AddNewDoctor from "./pages/AddNewDoctor";
import Doctor from "./pages/Doctor";
import Appointments from "./pages/Appointments";
import DashboardLayout from "./layouts/DashboardLayout";
import { Spinner } from "@/components/ui/spinner";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Context } from "./main";
import axios from "axios";
import "./App.css";
import Users from "./pages/Users";
import { Toaster } from "sonner";
import ForgotPassword from "./components/ForgotPassword";
import NotFound from "./components/NotFound";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      const role = localStorage.getItem("role"); // admin | doctor

      if (!role) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${baseURL}/api/v1/user/${role}/me`, {
          withCredentials: true,
        });

        setUser(res.data.user);
        setIsAuthenticated(true);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
        localStorage.removeItem("role");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // 🔥 WAIT until auth check finishes
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Spinner className="h-8 w-8 text-blue-500" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ================= */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ================= AUTH REQUIRED ================= */}
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctor />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/messages" element={<Message />} />

            {/* ================= ADMIN ONLY ================= */}
            <Route element={<RoleRoute allowedRoles={["admin"]} />}>
              <Route path="/users" element={<Users />} />
              <Route path="/admin/addnew" element={<AddNewAdmin />} />
              <Route path="/doctor/addnew" element={<AddNewDoctor />} />
            </Route>

            {/* ================= 404 ================= */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Route>
      </Routes>

      <ToastContainer position="top-center" />
      <Toaster />
    </Router>
  );
};

export default App;
