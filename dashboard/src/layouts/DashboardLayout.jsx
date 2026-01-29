import SideBar from "../components/SideBar";
import DashboardHeader from "./DashboardHeader";
import MobileBottomNav from "../components/MobileBottomNav";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="h-screen bg-slate-100 grid grid-cols-1 lg:grid-cols-[256px_1fr] overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block bg-white border-r">
        <SideBar />
      </aside>

      {/* Content */}
      <div className="flex flex-col h-full min-h-0">
        <DashboardHeader />
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto pb-16 lg:pb-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />
    </div>
  );
};

export default DashboardLayout;
