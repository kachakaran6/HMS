import { useState } from "react";
import SideBar from "../components/SideBar";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-100 grid grid-cols-1 lg:grid-cols-[256px_1fr] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block bg-white border-r">
        <SideBar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      <div
        className={`
          fixed inset-0 z-50 lg:hidden
          transition-opacity duration-300
          ${sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
        `}
      >
        {/* Overlay */}
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSidebarOpen(false)}
        />

        {/* Drawer */}
        <div
          className={`
            absolute left-0 top-0 h-full w-64 bg-white shadow-xl
            transform transition-transform duration-300
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <SideBar onLinkClick={() => setSidebarOpen(false)} />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col h-full min-h-0">
        <DashboardHeader onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 p-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
