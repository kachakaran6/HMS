/* eslint-disable no-unused-vars */
import React, { useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Message from "./components/Message";
import AddNewAdmin from "./components/AddNewAdmin";
import AddNewDoctor from "./components/AddNewDoctor";
import Doctor from "./components/Doctor";
import SideBar from "./components/SideBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Context } from "./main";
import axios from "axios";
import "./App.css";
import DashboardLayout from "./layouts/DashboardLayout";
import Appointments from "./components/Appointments";

const App = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  useEffect(() => {
    const fetchUser = async () => {
      const baseURL = import.meta.env.VITE_API_BASE_URL;
      try {
        // http://localhost:3000/api/v1/user/patient/me
        const res = await axios.get(`${baseURL}/api/v1/user/admin/me`, {
          withCredentials: true,
        });
        setIsAuthenticated(true);
        setUser(res.data.user);
      } catch (error) {
        setIsAuthenticated(false);
        setUser({});
      }
    };
    fetchUser();
  }, [isAuthenticated]);
  return (
    <>
      <Router>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Dashboard routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctor />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/doctor/addnew" element={<AddNewDoctor />} />
            <Route path="/admin/addnew" element={<AddNewAdmin />} />
            <Route path="/messages" element={<Message />} />
          </Route>
        </Routes>

        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
