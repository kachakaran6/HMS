import { GiHamburgerMenu } from "react-icons/gi";

const DashboardHeader = ({ onMenuClick }) => {
  return (
    <header className="lg:hidden sticky top-0 z-40 bg-white border-b px-4 py-3 flex items-center">
      <button
        onClick={onMenuClick}
        className="p-2 rounded-lg hover:bg-slate-100"
      >
        <GiHamburgerMenu className="text-2xl" />
      </button>

      <h1 className="ml-3 font-semibold text-slate-900">HMS Admin</h1>
    </header>
  );
};

export default DashboardHeader;
