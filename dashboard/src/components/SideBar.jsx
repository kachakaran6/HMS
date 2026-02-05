import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "sonner";

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
      toast.success(data.message, { position: "top-right" });
      setIsAuthenticated(false);
      navigate("/login");
    } catch {
      toast.error("Logout failed", { position: "top-right" });
    }
  };

  return (
    <aside className="fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col h-screen">
      {/* LOGO */}
      {/* SIDEBAR HEADER */}
      <div className="h-16 px-5 flex flex-col justify-center border-b">
        <h2 className="text-xl font-bold text-blue-600 leading-tight">
          HMS Admin
        </h2>
        {/* <p className="text-xs text-slate-500 leading-tight">
          Hospital Management System
        </p> */}
      </div>

      {/* NAVIGATION (SCROLLABLE) */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
          ${
            isActive
              ? "bg-blue-600 text-white shadow"
              : "text-slate-700 hover:bg-slate-100"
          }`
          }
          onClick={onLinkClick}
        >
          <TiHome className="text-lg" />
          Dashboard
        </NavLink>

        <NavLink
          to="/doctors"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
          ${
            isActive
              ? "bg-blue-600 text-white shadow"
              : "text-slate-700 hover:bg-slate-100"
          }`
          }
          onClick={onLinkClick}
        >
          <FaUserMd className="text-lg" />
          Doctors
        </NavLink>

        <NavLink
          to="/appointments"
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
          ${
            isActive
              ? "bg-blue-600 text-white shadow"
              : "text-slate-700 hover:bg-slate-100"
          }`
          }
          onClick={onLinkClick}
        >
          <FaCalendarCheck className="text-lg" />
          Appointments
        </NavLink>

        {/* ADMIN ONLY */}
        {role === "admin" && (
          <>
            <div className="mt-4 mb-2 px-4 text-xs uppercase tracking-wide text-slate-400">
              Administration
            </div>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
              ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100"
              }`
              }
              onClick={onLinkClick}
            >
              <FaUser className="text-lg" />
              All Users
            </NavLink>

            <NavLink
              to="/admin/addnew"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
              ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100"
              }`
              }
              onClick={onLinkClick}
            >
              <MdAddModerator className="text-lg" />
              Add Admin
            </NavLink>

            <NavLink
              to="/doctor/addnew"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
              ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100"
              }`
              }
              onClick={onLinkClick}
            >
              <IoPersonAddSharp className="text-lg" />
              Add Doctor
            </NavLink>

            <NavLink
              to="/messages"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition
              ${
                isActive
                  ? "bg-blue-600 text-white shadow"
                  : "text-slate-700 hover:bg-slate-100"
              }`
              }
              onClick={onLinkClick}
            >
              <AiFillMessage className="text-lg" />
              Messages
            </NavLink>
          </>
        )}
      </nav>

      {/* LOGOUT (ALWAYS VISIBLE) */}
      <div className="px-4 py-4 border-t bg-white">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition"
        >
          <RiLogoutBoxFill className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideBar;
