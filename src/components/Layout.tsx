import { Outlet } from "react-router";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="w-full h-full bg-gray-200">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
