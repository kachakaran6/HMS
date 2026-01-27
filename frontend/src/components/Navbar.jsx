import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Context } from "../main";
import { toast } from "react-toastify";
import axios from "axios";
import { GiHamburgerMenu } from "react-icons/gi";

const Navbar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const navigateTo = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${baseURL}/api/v1/user/userLogout`,
        {},
        { withCredentials: true },
      );
      toast.success(res.data.message);
      setIsAuthenticated(false);
    } catch (error) {
      toast.error("Error logging out", error);
    }
  };

  const gotoLogin = () => navigateTo("/login");

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-blue-600">
            A<span className="text-gray-700">Care</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            <Link
              to="/appointment"
              className="text-gray-700 hover:text-blue-600"
            >
              Appointment
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-blue-600">
              About Us
            </Link>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={gotoLogin}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setShow(!show)}
          >
            <GiHamburgerMenu />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {show && (
        <div className="md:hidden bg-white border-t shadow-sm">
          <div className="flex flex-col px-4 py-4 gap-4">
            <Link to="/" onClick={() => setShow(false)}>
              Home
            </Link>
            <Link to="/appointment" onClick={() => setShow(false)}>
              Appointment
            </Link>
            <Link to="/about" onClick={() => setShow(false)}>
              About Us
            </Link>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white py-2 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShow(false);
                  gotoLogin();
                }}
                className="bg-blue-600 text-white py-2 rounded-lg"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
