import { Outlet } from "react-router";
import { Header } from "./Header";

const Layout = () => {
  return (
    <div className="w-full h-full">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;
