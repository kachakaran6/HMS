// import { GiHamburgerMenu } from "react-icons/gi";
import ProfileMenu from "../components/ProfileMenu";

const DashboardHeader = () => {
  return (
    <header className="h-16 sticky top-0 z-40 bg-white border-b px-6 flex items-center justify-between">
      <h2 className="text-l font-bold text-blue-600 leading-tight">
        Hospital Management System
      </h2>

      <ProfileMenu />
    </header>
  );
};

export default DashboardHeader;
