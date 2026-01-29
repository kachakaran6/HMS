import { Navigate, Outlet } from "react-router-dom";

const RoleRoute = ({ allowedRoles }) => {
  const role = localStorage.getItem("role");

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;
