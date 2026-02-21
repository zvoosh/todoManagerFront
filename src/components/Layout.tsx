import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { SideNavigation } from "./SideNavigation";

const Layout = () => {
  return (
    <div className="w-full h-full bg-gray-200 flex flex-col">
      <div className="h-14 w-full">
        <Header />
      </div>
      <div className="flex flex-1">
        <div className="w-1/7 h-full bg-gray-700 text-white py-2 pt-5">
          <SideNavigation />
        </div>
        <div className="w-6/7 overflow-y-auto overflow-x-hidden h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
