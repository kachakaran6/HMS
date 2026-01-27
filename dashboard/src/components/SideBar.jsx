import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../main";
import { AiFillMessage } from "react-icons/ai";
import { RiLogoutBoxFill } from "react-icons/ri";
import { TiHome } from "react-icons/ti";
import { FaUserMd, FaCalendarCheck } from "react-icons/fa";
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";

import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";

const SideBar = () => {
  const { setIsAuthenticated } = useContext(Context);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const baseURL = import.meta.env.VITE_API_BASE_URL;

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${baseURL}/api/v1/user/adminLogout`,
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
    <>
      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow"
        onClick={() => setOpen(true)}
      >
        <GiHamburgerMenu />
      </button>

      {/* Overlay (mobile) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen w-64 bg-white border-r border-slate-200
          p-4 flex flex-col justify-between
          transform transition-transform
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        {/* Logo */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-8">HMS Admin</h2>

          {/* Links */}
          <nav className="space-y-2">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <TiHome /> Dashboard
            </NavLink>

            <NavLink
              to="/doctors"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <FaUserMd /> Doctors
            </NavLink>

            <NavLink
              to="/appointments"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <FaCalendarCheck /> Appointments
            </NavLink>

            <NavLink
              to="/admin/addnew"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <MdAddModerator /> Add Admin
            </NavLink>

            <NavLink
              to="/doctor/addnew"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <IoPersonAddSharp /> Add Doctor
            </NavLink>

            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `${linkClass} ${isActive ? activeClass : ""}`
              }
              onClick={() => setOpen(false)}
            >
              <AiFillMessage /> Messages
            </NavLink>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition"
        >
          <RiLogoutBoxFill /> Logout
        </button>
      </aside>
    </>
  );
};

export default SideBar;
