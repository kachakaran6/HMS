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

  const handleLogout = async () => {
    // http://localhost:3000/api/v1/user/userLogout

    await axios
      .post(
        `${baseURL}/api/v1/user/userLogout`,
        {},
        {
          withCredentials: true,
        },
      )
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error("Error logging out", err);
      });
    // window.location.reload();
  };

  const navigateTo = useNavigate();

  const gotoLogin = () => {
    navigateTo("/login");
  };
  return (
    <nav className="container">
      <div className="logo">A care</div>
      <div className={show ? "navLinks showmenu" : "navLinks"}>
        <div className="links">
          <Link to="/" onClick={() => setShow(!show)}>
            Home
          </Link>
          <Link to="/appointment" onClick={() => setShow(!show)}>
            Appointment
          </Link>
          <Link to="/about" onClick={() => setShow(!show)}>
            About Us
          </Link>
        </div>
        {isAuthenticated ? (
          <button className="logoutBtn btn" onClick={handleLogout}>
            LogOut
          </button>
        ) : (
          <button className="logoutBtn btn" onClick={gotoLogin}>
            Login
          </button>
        )}
      </div>
      <div className="hamburger" onClick={() => setShow(!show)}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
