/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Message from "./components/Message";
import AddNewAdmin from "./components/AddNewAdmin";
import AddNewDoctor from "./components/AddNewDoctor";
import Doctor from "./components/Doctor";
import Appointments from "./components/Appointments";
import DashboardLayout from "./layouts/DashboardLayout";
import { Spinner } from "@/components/ui/spinner";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { Context } from "./main";
import axios from "axios";
import "./App.css";
import Users from "./components/Users";
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
        <Spinner className="h-8 w-8 text-blue-600" />
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route
          element={
            isAuthenticated ? <DashboardLayout /> : <Navigate to="/login" />
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/doctors" element={<Doctor />} />
          <Route path="/users" element={<Users />} />
          <Route path="/appointments" element={<Appointments />} />
          <Route path="/doctor/addnew" element={<AddNewDoctor />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/messages" element={<Message />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>

      <ToastContainer position="top-center" />
      <Toaster />
    </Router>
  );
};

export default App;
