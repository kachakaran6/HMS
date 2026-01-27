import React from "react";
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

const App = () => {
  return (
    <>
      <Router>
        <SideBar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/doctor/addnew" element={<AddNewDoctor />} />
          <Route path="/admin/addnew" element={<AddNewAdmin />} />
          <Route path="/messages" element={<Message />} />
          <Route path="/doctors" element={<Doctor />} />
        </Routes>
        <ToastContainer position="top-center" />
      </Router>
    </>
  );
};

export default App;
