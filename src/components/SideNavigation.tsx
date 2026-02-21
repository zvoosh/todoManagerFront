import { FaCaretDown, FaRegCircleUser } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../services/hooks/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { toogleSideMenu } from "../redux/features/uiSlice";

export const SideNavigation = () => {
  const sideMenu = useSelector(
    (state: { ui: { sideMenu: boolean } }) => state.ui.sideMenu,
  );
  const dispatch = useDispatch();
  const location = useLocation();

  const { setUserCtx } = useAuth();

  return (
    <nav className="text-xl font-semibold text-start w-full h-full px-3 select-none flex flex-col justify-between">
      <div className="flex flex-col gap-1.5">
        <div
          className="flex justify-start items-center gap-2 cursor-pointer"
          onClick={() => {
            dispatch(toogleSideMenu());
          }}
        >
          Tasks <FaCaretDown />
        </div>
        <div
          className={`transition-all duration-300 ease-in-out overflow-hidden ${sideMenu == true ? "max-h-screen" : "max-h-0"}`}
        >
          <Link
            to={"/tasks"}
            className={`py-2 ${location.pathname === "/tasks" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
          >
            Pending
          </Link>
          <Link
            to={"/tasks/in-progress"}
            className={`py-2 ${location.pathname === "/tasks/in-progress" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
          >
            In Progress
          </Link>
          <Link
            to={"/tasks/completed"}
            className={`py-2 ${location.pathname === "/tasks/completed" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
          >
            Completed
          </Link>
          <Link
            to={"/tasks/archived"}
            className={`py-2 ${location.pathname === "/tasks/archived" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
          >
            Archived
          </Link>
          <Link
            to={"/tasks/all"}
            className={`py-2 ${location.pathname === "/tasks/all" && "bg-gray-500/60"} rounded-md px-2 w-full block`}
          >
            All
          </Link>
        </div>
        <div className="flex justify-start items-center gap-2 cursor-pointer">
          Profile <FaRegCircleUser />
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className="px-2 py-1 border border-gray-800/40 cursor-pointer w-full bg-blue-800/80 rounded-md"
          onClick={() => {
            setUserCtx(null);
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
};
