import SideBar from "../components/SideBar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <SideBar />

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Nested routes render here */}
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
