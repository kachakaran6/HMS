import { NavLink } from "react-router-dom";
import { TiHome } from "react-icons/ti";
import { FaUserMd, FaCalendarCheck } from "react-icons/fa";
import { MdAddModerator } from "react-icons/md";
import { AiFillMessage } from "react-icons/ai";
import { FaUser } from "react-icons/fa";

const MobileBottomNav = () => {
  const role = localStorage.getItem("role");

  const linkClass = (isActive) =>
    `flex flex-col items-center justify-center text-[11px] gap-1 transition ${
      isActive ? "text-blue-600" : "text-slate-500"
    }`;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t flex justify-around py-2">
      <NavLink to="/" end className={({ isActive }) => linkClass(isActive)}>
        <TiHome className="text-xl" />
        Home
      </NavLink>

      <NavLink to="/doctors" className={({ isActive }) => linkClass(isActive)}>
        <FaUserMd className="text-lg" />
        Doctors
      </NavLink>

      <NavLink
        to="/appointments"
        className={({ isActive }) => linkClass(isActive)}
      >
        <FaCalendarCheck className="text-lg" />
        Appointments
      </NavLink>

      <NavLink to="/messages" className={({ isActive }) => linkClass(isActive)}>
        <AiFillMessage className="text-lg" />
        Messages
      </NavLink>

      {/* ADMIN QUICK ACCESS */}
      {role === "admin" && (
        <>
          <NavLink
            to="/users"
            className={({ isActive }) => linkClass(isActive)}
          >
            <FaUser className="text-lg" />
            Users
          </NavLink>

          <NavLink
            to="/admin/addnew"
            className={({ isActive }) => linkClass(isActive)}
          >
            <MdAddModerator className="text-lg" />
            Add Admin
          </NavLink>
        </>
      )}
    </nav>
  );
};

export default MobileBottomNav;
