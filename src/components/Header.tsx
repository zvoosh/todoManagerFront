import { useState } from "react";
import { useAuth } from "../services/hooks/useAuth";
import { Link, useNavigate } from "react-router";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, setUserCtx } = useAuth();
  const navigate = useNavigate();

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full h-14 flex items-center text-[#2b2b2b]">
      <div className="h-14 w-full bg-blue-500/90 text-white flex gap-5 items-center justify-between px-4 fixed backdrop-blur-md z-10">
        <div
          className="flex flex-col gap-1 cursor-pointer select-none block lg:hidden"
          onClick={handleToggleMenu}
        >
          <span className="w-4 h-[2px] bg-gray-800 rounded-sm"></span>
          <span className="w-4 h-[2px] bg-gray-800 rounded-sm"></span>
          <span className="w-4 h-[2px] bg-gray-800 rounded-sm"></span>
        </div>
        <div className="flex gap-2 items-center">
          <h2 className="text-lg font-bold">To-do list Manager</h2>
          <span className="font-bold text-xl hidden md:block">-</span>
          <p className="font-semibold capitalize text-lg hidden md:block">
            {user?.username}
          </p>
        </div>
        <nav className="hidden lg:block absolute left-1/2 transform -translate-x-1/2">
          <ul className="flex font-semibold text-lg select-none space-x-2">
            <li className={`relative transition duration-500 px-3 py-1 cursor-pointer ${location.pathname === '/tasks' ? "active-link" : ""}`}><Link to={"/tasks"}>Pending </Link></li>
            <li className={`relative transition duration-500 px-3 py-1 cursor-pointer ${location.pathname === '/tasks/completed' ? "active-link" : ""}`}><Link to={"/tasks/completed"}>Completed</Link></li>
            <li className={`relative transition duration-500 px-3 py-1 cursor-pointer ${location.pathname === '/tasks/archived' ? "active-link" : ""}`}><Link to={"/tasks/archived"}>Archived</Link></li>
            <li className={`relative transition duration-500 px-3 py-1 cursor-pointer ${location.pathname === '/tasks/in-progress' ? "active-link" : ""}`}><Link to={"/tasks/in-progress"}>In Progress</Link></li>
          </ul>
        </nav>
        <button
          className="font-semibold bg-black px-2 text-lg py-1 rounded-md cursor-pointer border-none"
          onClick={() => {
            setUserCtx(null);
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
      <nav
        className={`fixed top-14 left-0 w-full bg-green-500/10 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "h-full" : "h-0"}`}
      >
        <ul className="flex flex-col font-semibold">
          <li className="px-4 py-2 text-xl capitalize underline underline-offset-5">{user?.username}</li>
          <li className="px-4 py-2 cursor-pointer">Pending</li>
          <li className="px-4 py-2 cursor-pointer">Completed</li>
          <li className="px-4 py-2 cursor-pointer">Archived</li>
          <li className="px-4 py-2 cursor-pointer">In Progress</li>
        </ul>
      </nav>
    </header>
  );
};
