import React from "react";
import { FaEye, FaPerson } from "react-icons/fa6";
import { truncateText } from "../../services";
import {
  MdModeEdit,
  MdOutlineDelete,
  MdOutlineDoneOutline,
} from "react-icons/md";
import type { UseMutateAsyncFunction } from "@tanstack/react-query";
import type { TCards } from "../../pages/TaskPages/TaskRenderPage";

const Cards = ({
  filteredCards,
  setIsModalOpen,
  isList,
  deleteTaskMutation,
  setIsEditModalOpen,
}: {
  filteredCards: TCards[];
  isList: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<TCards | null>>;
  deleteTaskMutation: UseMutateAsyncFunction<void, Error, string, unknown>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<TCards | null>>;
}) => {
  const handleDelete = (id: string) => {
    deleteTaskMutation(id);
  };

  return (
    <div
      className={`flex flex-wrap justify-center lg:justify-start gap-5 w-full pb-5 items-stretch`}
    >
      {filteredCards.map((item: TCards) => {
        return (
          <div
            key={item.id}
            className={`w-[350px] flex flex-col rounded-md overflow-hidden transition-all duration-300 ease-in-out overflow-hidden ${isList ? "h-8" : "max-h-[250px]"}`}
          >
            <div
              className={`w-full bg-green-500/60 py-1 rounded-t-md flex justify-between px-3 items-center font-semibold ${isList && "rounded-md py-1"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="cursor-pointer select-none"
                  onClick={() => setIsModalOpen(item)}
                >
                  <FaEye />
                </div>
                <h3 className="capitalize">
                  {truncateText({
                    text: item.title,
                    truncateNumber: 12,
                  })}
                </h3>
              </div>
              <div className="flex gap-3">
                {/* title */}
                <p className="capitalize">{item.status}</p>
                <button
                  className="cursor-pointer"
                  onClick={() => handleDelete(item.id as string)}
                >
                  <MdOutlineDelete color="red" size={"20"} />
                </button>
                <button className="cursor-pointer">
                  <MdModeEdit
                    color="blue"
                    size={"20"}
                    onClick={() => {
                      setIsEditModalOpen(item);
                    }}
                  />
                </button>
                <button className="cursor-pointer">
                  <MdOutlineDoneOutline size={20} />
                </button>
              </div>
            </div>
            <div
              className={`w-full h-full bg-white rounded-b-md flex flex-col justify-between ${isList ? "p-0" : "p-3"}`}
            >
              <div className="space-y-2 bg-gray-200 h-full p-3 rounded-lg">
                <p className="text-lg">
                  {truncateText({
                    text: item.description,
                    truncateNumber: 100,
                  })}
                </p>
              </div>
              <div className="flex gap-5 px-5 py-2 justify-between items-center">
                <div className="w-fit px-5 h-7 bg-[#D84242]/80 text-white text-sm flex items-center justify-center rounded-sm uppercase">
                  {item.type}
                </div>
                <div className=" flex gap-5 items-center">
                  <span className="w-11 h-11 bg-gray-500 rounded-full flex justify-center items-center">
                    <FaPerson />
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default React.memo(Cards);
