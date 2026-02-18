import { TfiLayoutGrid4Alt, TfiLayoutListPost } from "react-icons/tfi";
import {
  CreateMutationOptions,
  deleteTask,
  useNotification,
} from "../../services";
import { useMemo, useState } from "react";
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
import { Link } from "react-router";

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

  const searchStatusPlaceholder = status.toLowerCase().replace(/_/g, " ");

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
    staleTime: 1000 * 60 * 5,
  });

  const { mutateAsync: deleteTaskMutation } = useMutation(
    CreateMutationOptions<undefined, string>({
      queryKey: ["tasks"],
      mutationFn: (variables: string) => deleteTask(variables),
      successFn: () => {
        showNotification({ msg: "Successfuly added a task!" });
      },
      errorFn: () => {
        showNotification({ msg: "Error deletign task!", type: "error" });
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

  const handleNumberofTask = (status: Status) => {
    return data
      .filter((item: TCards) => item.userId === user?.id)
      .filter((item: TCards) => item.status === status).length;
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
    <div className="w-full h-full py-2 px-10 space-y-5">
      <div>
        <div className="flex justify-between w-full items-center border-b border-gray-800/20">
          <div className="flex items-center gap-2">
            <h1 className="capitalize text-2xl font-semibold">
              {searchStatusPlaceholder} Tasks
            </h1>
            {/* <input
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
            </button> */}
          </div>
          <div className="flex p-4 gap-3">
            <div className="rounded-md text-white bg-white flex border border-gray-800/40">
              <button
                className="cursor-pointer text-white bg-blue-800/80 px-3 py-1 rounded-md rounded-r-none hidden md:block border-r text-lg"
                onClick={() => setIsCreateModalOpen(true)}
              >
                + Create new task
              </button>
              {filteredCards && filteredCards.length > 0 && (
                <>
                  <div
                    className="p-3 cursor-pointer border-gray-800/40 border-r"
                    onClick={handleGrid}
                  >
                    <TfiLayoutGrid4Alt color="black" />
                  </div>
                  <div className="p-3 cursor-pointer" onClick={handleList}>
                    <TfiLayoutListPost color="black" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex w-full items-center gap-10 py-5 pb-1 px-1">
          <Link
            to={"/tasks"}
            className="w-fit pl-3 pr-5 py-2 bg-white rounded-lg cursor-pointer"
          >
            <span className="px-3 py-0.5 mr-2 rounded-full bg-amber-300"></span>
            <span className="font-bold mr-2">
              {handleNumberofTask("PENDING")}
            </span>
            Pending
          </Link>
          <Link
            to="/tasks/in-progress"
            className="w-fit pl-3 pr-5 py-2 bg-white rounded-lg cursor-pointer"
          >
            <span className="px-3 py-0.5 mr-2 rounded-full bg-purple-300"></span>
            <span className="font-bold mr-2">
              {handleNumberofTask("IN_PROGRESS")}
            </span>
            In Progress
          </Link>
          <Link
            to={"/tasks/completed"}
            className="w-fit pl-3 pr-5 py-2 bg-white rounded-lg cursor-pointer"
          >
            <span className="px-3 py-0.5 mr-2 rounded-full bg-green-300"></span>
            <span className="font-bold mr-2">
              {handleNumberofTask("COMPLETED")}
            </span>
            Complete
          </Link>
          <Link
            to={"/tasks/archived"}
            className="w-fit pl-3 pr-5 py-2 bg-white rounded-lg cursor-pointer"
          >
            <span className="px-3 py-0.5 mr-2 rounded-full bg-gray-300"></span>
            <span className="font-bold mr-2">
              {handleNumberofTask("ARCHIVED")}
            </span>
            Archived
          </Link>
        </div>
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
            <p>There are currently no tasks in this segment. </p>
          </div>
        </div>
      )}
      <DetailsModal
        isModalOpen={isModalOpen ? isModalOpen : null}
        setIsModalOpen={setIsModalOpen}
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
