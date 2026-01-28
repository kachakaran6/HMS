import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "react-toastify";

import { AiFillMessage } from "react-icons/ai";
import { RiLogoutBoxFill } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import { FaUserMd, FaCalendarCheck } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";

const SideBar = ({ onLinkClick }) => {
  const { setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;
  const role = localStorage.getItem("role");
  //   const [roleState, setRoleState] = useState(role);

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${baseURL}/api/v1/user/userLogout`,
        {},
        { withCredentials: true },
      );
      toast.success(data.message);
      setIsAuthenticated(false);
      navigate("/login");
    } catch {
      toast.error("Logout failed");
    }
  };

  const linkClass =
    "flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-200 transition";

  const activeClass = "bg-blue-600 text-white hover:bg-blue-600";

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b">
        <h2 className="text-xl font-bold text-slate-900">HMS Admin</h2>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
          onClick={onLinkClick}
        >
          <TiHome /> Dashboard
        </NavLink>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
          onClick={onLinkClick}
        >
          <FaUserMd /> Doctors
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
          onClick={onLinkClick}
        >
          <FaCalendarCheck /> Appointments
        </NavLink>

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <>
            <NavLink to="/users" className={linkClass}>
              <FaUser /> All Users
            </NavLink>
            <NavLink to="/admin/addnew" className={linkClass}>
              <MdAddModerator /> Add Admin
            </NavLink>

            <NavLink to="/doctor/addnew" className={linkClass}>
              <IoPersonAddSharp /> Add Doctor
            </NavLink>

            <NavLink to="/messages" className={linkClass}>
              <AiFillMessage /> Messages
            </NavLink>
          </>
        )}

        {/* <NavLink
          to="/messages"
          className={({ isActive }) =>
            `${linkClass} ${isActive ? activeClass : ""}`
          }
          onClick={onLinkClick}
        >
          <AiFillMessage /> Messages
        </NavLink> */}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <RiLogoutBoxFill /> Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
