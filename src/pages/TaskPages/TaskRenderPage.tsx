import { TfiLayoutGrid4Alt, TfiLayoutListPost } from "react-icons/tfi";
import {
  CreateMutationOptions,
  deleteTask,
  useNotification,
} from "../../services";
import { useMemo, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoReload } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TASKS_API_URL } from "../../services/constants";
import {
  Cards,
  CreateTaskModal,
  DetailsModal,
  EditTaskModal,
} from "../../components";
import { useAuth } from "../../services/hooks/useAuth";

export type TCards = {
  id?: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  userId?: string;
  project?: string;
  type: string;
  due_date: Date | null;
};

export const Status = {
  Pending: "PENDING",
  Completed: "COMPLETED",
  InProgress: "IN_PROGRESS",
  Archived: "ARCHIVED",
} as const;

export type Status = (typeof Status)[keyof typeof Status];

const TaskRenderPage = ({ status }: { status: Status }) => {
  const [isList, setIsList] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<TCards | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<TCards | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");

  const { showNotification } = useNotification();
  const { user } = useAuth();

  const searchStatusPlaceholder = status.toLowerCase();

  const { data, isError, isPending } = useQuery({
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
  });

  const { mutateAsync: deleteTaskMutation } = useMutation(
    CreateMutationOptions<undefined, string>({
      queryKey: ["tasks"],
      mutationFn: (variables: string) => deleteTask(variables),
      successFn: () => {
        showNotification("Successfuly added a task!");
      },
    }),
  );
  const filteredCards = useMemo(() => {
    if (!data) return [];
    const usersTasks = data.filter((item: TCards) => item.userId === user?.id);
    const pendingTasks = usersTasks.filter(
      (item: TCards) => item.status === status,
    );
    if (searchValue || searchValue.length > 1) {
      return pendingTasks.filter(
        (item: TCards) =>
          item.title.toLowerCase().trim().includes(searchValue) ||
          item.type.toLowerCase().trim().includes(searchValue),
      );
    }
    return pendingTasks;
  }, [data, searchValue, user?.id, status]);

  const handleList = () => {
    setIsList(true);
  };

  const handleGrid = () => {
    setIsList(false);
  };

  const handleSearch = async (value: string) => {
    setSearchValue(value.toLowerCase().trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e.currentTarget.value);
    }
  };

  if (isPending) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <IoReload className="animate-spin" color="green" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <h2 className="text-2xl font-bold">
          Error loading tasks, please try again later
        </h2>
      </div>
    );
  }

  return (
    <div className="w-full p-[8px] space-y-[20px]">
      {/* seearch and layouttoogle */}
      <div>
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-2">
            <input
              type="search"
              onInput={(e) =>
                setSearchValue((e.target as HTMLInputElement).value)
              }
              placeholder={`Search ${searchStatusPlaceholder} tasks...`}
              onKeyDown={handleKeyDown}
              className="w-56 px-4 py-2 rounded-md border border-gray-300 
            focus:outline-none focus:ring-1 focus:ring-green-500 
            focus:border-green-500 transition duration-200"
            />
            <button
              className="p-2 bg-blue-500 rounded-full cursor-pointer"
              onClick={(e) => handleSearch(e.currentTarget.value)}
            >
              <CiSearch color="white" size={20} />
            </button>
            <button
              className="cursor-pointer text-white bg-green-800/80 px-2 py-1 rounded-md hidden md:block"
              onClick={() => setIsCreateModalOpen(true)}
            >
              Create new task
            </button>
          </div>
          {filteredCards && filteredCards.length > 0 && (
            <div className="flex p-4 gap-3">
              <div
                className="p-2 bg-gray-200/40 rounded-md cursor-pointer"
                onClick={handleGrid}
              >
                <TfiLayoutGrid4Alt />
              </div>
              <div
                className="p-2 bg-gray-200/40 rounded-md cursor-pointer"
                onClick={handleList}
              >
                <TfiLayoutListPost />
              </div>
            </div>
          )}
        </div>
        <button
          className="cursor-pointer text-white bg-green-800/80 px-2 py-1 rounded-md block md:hidden"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create new task
        </button>
      </div>
      {/* tasks */}
      {filteredCards && filteredCards.length > 0 ? (
        <Cards
          filteredCards={filteredCards}
          deleteTaskMutation={deleteTaskMutation}
          isList={isList}
          setIsModalOpen={setIsModalOpen}
          setIsEditModalOpen={setIsEditModalOpen}
        />
      ) : (
        <div className="w-full h-1/2 flex items-center justify-center text-2xl text-semibold select-none">
          <div className="w-1/2 md:w-1/4 xl:w-1/7 2xl:w-1/9 h-fit text-center opacity-50">
            <img src="/creature.png" className="w-full" />
            <p>No current tasks, please create a new task.</p>
          </div>
        </div>
      )}
      <DetailsModal
        isModalOpen={isModalOpen ? isModalOpen : null}
        setIsModalOpen={setIsModalOpen}
        deleteTaskMutation={deleteTaskMutation}
      />
      <CreateTaskModal
        setIsCreateModalOpen={setIsCreateModalOpen}
        showNotification={showNotification}
        isCreateModalOpen={isCreateModalOpen}
        status={status}
      />
      <EditTaskModal
        setIsEditModalOpen={setIsEditModalOpen}
        showNotification={showNotification}
        isEditModalOpen={isEditModalOpen}
      />
    </div>
  );
};

export default TaskRenderPage;
