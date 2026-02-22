import { Link, Outlet } from "react-router-dom";
import { Header } from "./Header";
import { SideNavigation } from "./SideNavigation";
import { useDispatch, useSelector } from "react-redux";
import { GiHamburgerMenu } from "react-icons/gi";
import {
  toogleMobileSideMenu,
  toogleSideMenu,
} from "../redux/features/uiSlice";
import { FaCaretDown, FaRegCircleUser } from "react-icons/fa6";

const Layout = () => {
  const mobileSideMenu = useSelector(
    (state: { ui: { mobileSideMenu: boolean; sideMenu: boolean } }) => state.ui,
  );

  const dispatch = useDispatch();

  return (
    <div className="w-full h-full bg-gray-200 flex flex-col">
      <div className="h-14 w-full">
        <Header />
      </div>
      <div className="flex flex-1 h-86">
        <div
          className={`h-full bg-gray-700 text-white py-2 pt-5 overflow-hidden w-0 2xl:w-1/7`}
        >
          <SideNavigation />
        </div>
        <div
          className={`overflow-y-auto overflow-x-hidden h-full w-full 2xl:w-6/7 `}
        >
          <Outlet />
        </div>
      </div>
      <div
        className={`bg-gray-700 text-white overflow-hidden w-full absolute z-99 top-0 transition-all duration-200 ease-in-out ${mobileSideMenu.mobileSideMenu ? "h-screen max-h-screen" : "max-h-0"}`}
      >
        <div className="w-full p-5 md:p-0 h-14 flex items-center">
          <div className="md:w-1/7 flex justify-center">
            <GiHamburgerMenu
              size={20}
              onClick={() => {
                dispatch(toogleMobileSideMenu());
              }}
            />
          </div>
          <h2 className="text-2xl font-bold text-center md:text-start justify-items-center md:justify-items-start md:pl-40  flex-1">
            To-do list Manager
          </h2>
        </div>
        <div className="flex flex-col gap-1.5 p-5 md:pl-10 text-lg font-semibold">
          <div
            className="flex justify-start items-center gap-2 cursor-pointer"
            onClick={() => {
              dispatch(toogleSideMenu());
            }}
          >
            Tasks <FaCaretDown />
          </div>
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${mobileSideMenu.sideMenu == true ? "max-h-screen" : "max-h-0"}`}
          >
            <Link
              to={"/tasks"}
              className={`py-2 ${location.pathname === "/tasks" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
              onClick={()=> {dispatch(toogleMobileSideMenu())}}
            >
              Pending
            </Link>
            <Link
              to={"/tasks/in-progress"}
              className={`py-2 ${location.pathname === "/tasks/in-progress" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
              onClick={()=> {dispatch(toogleMobileSideMenu())}}
            >
              In Progress
            </Link>
            <Link
              to={"/tasks/completed"}
              className={`py-2 ${location.pathname === "/tasks/completed" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
              onClick={()=> {dispatch(toogleMobileSideMenu())}}
            >
              Completed
            </Link>
            <Link
              to={"/tasks/archived"}
              className={`py-2 ${location.pathname === "/tasks/archived" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
              onClick={()=> {dispatch(toogleMobileSideMenu())}}
            >
              Archived
            </Link>
            <Link
              to={"/tasks/all"}
              className={`py-2 ${location.pathname === "/tasks/all" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
              onClick={()=> {dispatch(toogleMobileSideMenu())}}
            >
              All
            </Link>
          </div>
          <div className="flex justify-start items-center gap-2 cursor-pointer">
            Profile <FaRegCircleUser />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
