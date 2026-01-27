import SideBar from "../components/SideBar";
import DashboardHeader from "./DashboardHeader";
import { Outlet } from "react-router-dom";
import { useState } from "react";

const DashboardLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-[100svh] bg-slate-100 grid grid-cols-1 lg:grid-cols-[256px_1fr]">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:block bg-white border-r">
        <SideBar />
      </aside>

      {/* Mobile Sidebar Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <SideBar onClose={() => setOpen(false)} />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-col">
        {/* Header (mobile only) */}
        <DashboardHeader onMenuClick={() => setOpen(true)} />

        <main className="p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
