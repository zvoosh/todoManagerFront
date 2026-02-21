import React from "react";
import { FaEye } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { TbProgressCheck } from "react-icons/tb";
import {
  CreateMutationOptions,
  editTask,
  truncateText,
  useNotification,
} from "../../services";
import {
  MdModeEdit,
  MdOutlineArchive,
  MdOutlineDelete,
  MdOutlineDoneOutline,
} from "react-icons/md";
import {
  useMutation,
  useQueryClient,
  type UseMutateAsyncFunction,
} from "@tanstack/react-query";
import { Status, type TCards } from "../../pages/TaskPages/TaskRenderPage";
import { formattedDate } from "../../services/hooks/formatedDate";

const Cards = ({
  filteredCards,
  setIsModalOpen,
  isGrid,
  deleteTaskMutation,
  setIsEditModalOpen,
}: {
  filteredCards: TCards[];
  isGrid: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<TCards | null>>;
  deleteTaskMutation: UseMutateAsyncFunction<void, Error, string, unknown>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<TCards | null>>;
}) => {
  const handleDelete = (id: string) => {
    deleteTaskMutation(id);
  };

  const queryClient = useQueryClient();

  const { showNotification } = useNotification();
  // .replace(/_/g, " ")
  const { mutateAsync: editTaskModal } = useMutation(
    CreateMutationOptions<undefined, TCards>({
      queryKey: ["tasks"],
      mutationFn: (taskData: TCards) => editTask(taskData, taskData.id!),
      successFn: () => {
        queryClient.invalidateQueries({queryKey: ["tasks"]})
        showNotification({
          msg: `Task now ${filteredCards[0].status.toLowerCase().replace(/_/g, " ")}`,
        });
      },
      errorFn: () => {
        showNotification({ msg: "Error editing a task!", type: "error" });
      },
    }),
  );

  const handleStatusChange = (item: TCards, status: Status) => {
    item.status = status;
    editTaskModal(item);
  };

  return (
    <div
      className={`flex flex-wrap justify-center lg:justify-start gap-5 w-full pb-5 items-stretch`}
    >
      {filteredCards.map((item: TCards) => {
        return (
          <div
            key={item.id}
            className={`w-87.5 flex flex-col rounded-md transition-all duration-300 ease-in-out overflow-hidden ${isGrid ? "max-h-62.5" : "h-10"}`}
          >
            <div
              className={`w-full ${item.status === Status.Pending ? "bg-amber-300" : item.status === Status.InProgress ? "bg-purple-300" : item.status === Status.Completed ? "bg-green-300" : "bg-gray-300"} py-1 rounded-t-md flex justify-between px-3 items-center font-semibold ${!isGrid && "rounded-md py-1"}`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="cursor-pointer select-none"
                  onClick={() => setIsModalOpen(item)}
                >
                  <FaEye />
                </div>
                <h3 className="capitalize text-lg font-semibold">
                  {truncateText({
                    text: item.title,
                    truncateNumber: 20,
                  })}
                </h3>
              </div>
              <div className="flex gap-3">
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
                  {item.status === Status.Pending && (
                    <TbProgressCheck
                      size={20}
                      onClick={() => {
                        handleStatusChange(item, Status.InProgress);
                      }}
                    />
                  )}
                  {item.status === Status.InProgress && (
                    <MdOutlineDoneOutline
                      size={20}
                      onClick={() => {
                        handleStatusChange(item, Status.Completed);
                      }}
                    />
                  )}
                  {item.status === Status.Completed && (
                    <MdOutlineArchive
                      size={20}
                      onClick={() => {
                        handleStatusChange(item, Status.Archived);
                      }}
                    />
                  )}
                </button>
              </div>
            </div>
            <div
              className={`w-full h-full bg-white rounded-md flex flex-col justify-between ${isGrid ? "p-2" : "p-0"}`}
            >
              <div className="space-y-2 bg-gray-200 h-full p-3 rounded-lg">
                <p className="text-sm">
                  {truncateText({
                    text: item.description,
                    truncateNumber: 100,
                  })}
                </p>
              </div>
              <div className="flex gap-5 px-1 pt-2 justify-between items-center">
                <div className="w-fit px-5 h-7 bg-[#D84242]/80 text-white text-sm flex items-center justify-center rounded-sm uppercase">
                  {item.type}
                </div>
                <div className="flex gap-1 items-center">
                  <div className="flex items-center gap-1">
                    <FaRegCalendarAlt /> Due:
                  </div>{" "}
                  {formattedDate(item.dueDate!)}
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
