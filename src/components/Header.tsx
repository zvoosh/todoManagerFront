import { useState } from "react";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <header className="w-full h-14 flex items-center text-[#2b2b2b]">
      <div className="h-14 w-full bg-green-500/20 flex gap-5 items-center px-4 fixed backdrop-blur-md z-10">
        <div
          className="flex flex-col gap-1 cursor-pointer select-none"
          onClick={handleToggleMenu}
        >
          <span className="w-4 h-[2px] bg-gray-800 rounded-sm"></span>
          <span className="w-4 h-[2px] bg-gray-800 rounded-sm"></span>
          <span className="w-4 h-[2px] bg-gray-800 rounded-sm"></span>
        </div>
        <h2 className="text-lg font-semibold">Todo list Manager</h2>
      </div>
      <nav className={`fixed top-14 left-0 w-full bg-green-500/10 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "h-full" : "h-0"}`}>
        <ul className="flex flex-col font-semibold">
          <li className="px-4 py-2 cursor-pointer">Pending</li>
          <li className="px-4 py-2 cursor-pointer">Completed</li>
          <li className="px-4 py-2 cursor-pointer">Archived</li>
          <li className="px-4 py-2 cursor-pointer">In Progress</li>
          <li className="px-4 py-2 cursor-pointer">Logout</li>
        </ul>
      </nav>
    </header>
  );
};
