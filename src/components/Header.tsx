import { useQuery } from "@tanstack/react-query";
import { useState, useRef, useEffect } from "react";
import { TASKS_API_URL } from "../services/constants";
import axios from "axios";
import { Status, type TCards } from "../pages/TaskPages/TaskRenderPage";
import { IoReload, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

const statusRouteMap: Record<Status, string> = {
  [Status.Pending]: "/tasks",
  [Status.InProgress]: "/tasks/in-progress",
  [Status.Completed]: "/tasks/completed",
  [Status.Archived]: "/tasks/archived",
};

export const Header = () => {
  const [searchValue, setSearchValue] = useState<string>("");
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const { data, isError, isPending, isFetching } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${TASKS_API_URL}`);
        return response.data;
      } catch {
        console.error("Error getting tasks");
      }
    },
    select: (data) => data ?? [],
    staleTime: 1000 * 60 * 5,
  });

  const filteredTasks = data?.filter((task: TCards) => {
    if (!searchValue.trim()) return false;
    return (
      task.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      task.type.toLowerCase().includes(searchValue.toLowerCase())
    );
  });

  // klik van wrapper-a zatvara dropdown
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Esc zatvara dropdown
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setShowDropdown(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="w-full h-full flex items-center text-[#2b2b2b] border-b-2 border-gray-800/20">
      <div className="flex gap-2 items-center w-1/7 bg-gray-300 h-full border-r-2 border-b-2 border-gray-800/20">
        <h2 className="text-2xl font-bold w-full text-center text-gray-700">
          To-do list Manager
        </h2>
      </div>

      <div className="pl-10 relative" ref={wrapperRef}>
        <div className="relative w-100">
          <input
            ref={inputRef}
            type="input"
            value={searchValue}
            onChange={(e) => {
              setSearchValue(e.target.value);
              setShowDropdown(true);
            }}
            placeholder={isError ? `Cannot search tasks currently...` : `Search tasks...`}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                navigate("/tasks/all", { state: { search: searchValue } });
                setShowDropdown(true);
              }
            }}
            className="w-full px-3 py-1 rounded-md border border-gray-700/40 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            disabled={isError}
            aria-label="Search tasks"
          />

          {searchValue && (
            <button
              type="button"
              onClick={() => {
                setSearchValue("");
                setShowDropdown(false);
                inputRef.current?.focus();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-600 hover:text-gray-900"
              aria-label="Clear search"
            >
              <IoClose size={18} />
            </button>
          )}
        </div>

        {/* dropdown prikazuje samo ako showDropdown === true i postoji searchValue */}
        {showDropdown && (
          <div className="absolute mt-2 w-100 bg-white shadow-lg rounded-md max-h-60 overflow-y-auto z-50">
            {searchValue && (isPending || isFetching) ? (
              <div className="w-full flex items-center justify-center py-2">
                <IoReload className="animate-spin text-green-600" size={20} />
              </div>
            ) : (
              <>
                {filteredTasks && searchValue && filteredTasks.length === 0 && (
                  <div className="p-2 text-gray-500">No results found</div>
                )}
                {filteredTasks &&
                  filteredTasks.map((item: TCards) => (
                    <div
                      key={item.id}
                      className="p-2 cursor-pointer border-b border-gray-200/60 last:border-b-0 flex justify-between hover:bg-gray-100 select-none"
                      onClick={() => {
                        navigate(statusRouteMap[item.status], { state: { task: item, search: searchValue } });
                        setShowDropdown(false); // zatvori dropdown, ali ne brisi input
                      }}
                    >
                      <div className="font-medium flex gap-1">
                        <div>
                          <span
                            className={`px-3 py-0.5 mr-2 rounded-full ${item.status === Status.Pending ? "bg-amber-300" : item.status === Status.InProgress ? "bg-purple-300" : item.status === Status.Completed ? "bg-green-300" : "bg-gray-300"}`}
                          ></span>
                        </div>
                        <div>{item.title}</div>
                      </div>
                      <div className="w-fit px-5 h-7 bg-[#D84242]/80 text-white flex items-center rounded-md uppercase text-sm">
                        {item.type}
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};