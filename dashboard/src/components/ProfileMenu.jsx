import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../main";
import axios from "axios";
import { toast } from "sonner";

const ProfileMenu = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated, user } = useContext(Context);
  const role = localStorage.getItem("role");
  const [doctors, setDoctors] = useState([]);

  const baseURL = import.meta.env.VITE_API_BASE_URL;

  // const avatarUrl =
  //   user?.docAvatar?.url || user?.avatar?.url || "/default-avatar.png";

  const userInitial =
    user?.firstName?.charAt(0)?.toUpperCase() ||
    user?.lastName?.charAt(0)?.toUpperCase() ||
    "?";

  useEffect(() => {
    // http://localhost:3000/api/v1/user/allDoc
    const fetchDoctors = async () => {
      const { data } = await axios.get(`${baseURL}/api/v1/user/allDoc`, {
        withCredentials: true,
      });
      setDoctors(data.users || []);
      console.log(data.users);
    };
    fetchDoctors();
  }, [isAuthenticated]);

  console.log(doctors.firstName + " from profile menu");

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
    <div className="relative">
      {/* AVATAR BUTTON */}
      <button
        className="w-9 h-9 rounded-full overflow-hidden border"
        onClick={() => setOpen((prev) => !prev)}
      >
        {user?.docAvatar?.url || user?.avatar?.url ? (
          <img
            src={user?.docAvatar?.url || user?.avatar?.url}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <span>{userInitial}</span>
        )}
      </button>

      {/* DROPDOWN */}
      {open && (
        <>
          {/* Overlay for mobile */}
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />

          <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-lg z-40">
            <button
              onClick={() => navigate("/profile")}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
            >
              Profile
            </button>

            <button
              onClick={() => navigate("/forgot-password")}
              className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
            >
              Change Password
            </button>

            {role === "admin" && (
              <>
                <button
                  onClick={() => navigate("/admin/addnew")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Add Admin
                </button>
                <button
                  onClick={() => navigate("/doctor/addnew")}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100"
                >
                  Add Doctor
                </button>
              </>
            )}

            <div className="border-t my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileMenu;
