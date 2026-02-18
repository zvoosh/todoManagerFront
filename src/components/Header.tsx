import { useState } from "react";

export const Header = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const handleSearch = async (value: string) => {
    setSearchValue(value.toLowerCase().trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e.currentTarget.value);
    }
  };
  return (
    <header className="w-full h-14 flex items-center text-[#2b2b2b] border-b-2 border-gray-800/20">
      <div className="flex gap-2 items-center w-1/7 bg-gray-300 h-full border-r-2 border-b-2 border-gray-800/20">
        <h2 className="text-2xl font-bold w-full text-center text-gray-700">
          To-do list Manager
        </h2>
      </div>
      <div className="pl-10">
        <input
          type="search"
          onInput={(e) => setSearchValue((e.target as HTMLInputElement).value)}
          placeholder={`Search tasks...`}
          onKeyDown={handleKeyDown}
          className="w-100 px-2 py-1 rounded-md border border-gray-700/40
        focus:outline-none focus:ring-1 focus:ring-blue-500 
        focus:border-blue-500 transition duration-200"
        />
      </div>
    </header>
  );
};
