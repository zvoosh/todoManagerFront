import { Outlet } from "react-router";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="w-full h-full bg-gray-200">
      <Header />
      <div className="flex h-full w-full">
        <div className="w-1/7 h-full bg-gray-700">dusan</div>
        <div className="w-6/7 overflow-y-auto h-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
