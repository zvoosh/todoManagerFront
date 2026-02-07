import { TfiLayoutGrid4Alt, TfiLayoutListPost } from "react-icons/tfi";
import {
  CreateMutationOptions,
  createTask,
  deleteTask,
  truncateText,
  useNotification,
} from "../services";
import { FaEye, FaPerson } from "react-icons/fa6";
import { MdModeEdit, MdOutlineDelete } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoClose, IoReload } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TASKS_API_URL } from "../services/constants";

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
const initialState = {
  title: "",
  description: "",
  status: "",
  priority: "",
  type: "",
  due_date: null,
  project: "",
};

const PendingPage = () => {
  const [isList, setIsList] = useState<boolean>(false);
  const [filteredCards, setFilteredCards] = useState<TCards[]>([]);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<TCards | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<TCards>(initialState);
  const [error, setError] = useState<{ input: string; message: string }>({
    input: "",
    message: "",
  });
  const { showNotification } = useNotification();

  const { data, isError, isPending } = useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      try {
        const response = await axios.get(`${TASKS_API_URL}`);
        return response.data;
      } catch {
        console.error("Error getting tasks:", error);
      }
    },
  });

  const { mutateAsync: createTaskMutation } = useMutation(
    CreateMutationOptions<undefined, TCards>({
      queryKey: ["tasks"],
      mutationFn: (taskData: TCards) => createTask(taskData),
      successFn: () => {
        showNotification("Successfuly added a task!");
      },
    }),
  );

  const { mutateAsync: deleteTaskMutation } = useMutation(
    CreateMutationOptions<undefined, string>({
      queryKey: ["tasks"],
      mutationFn: (variables: string) => deleteTask(variables),
      successFn: () => {
        showNotification("Successfuly added a task!");
      },
    }),
  );

  useEffect(() => {
    setFilteredCards(data);
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: name === "due_date" ? (value ? new Date(value) : null) : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.trim() === "") {
      setError({
        input: "title",
        message: "Please enter a valid title",
      });
    } else if (formData.description.trim() === "") {
      setError({
        input: "description",
        message: "Please enter a valid description",
      });
    } else if (formData.type.trim() === "") {
      setError({
        input: "type",
        message: "Please enter a valid type",
      });
    } else if (formData.project && formData.project.trim() === "") {
      setError({
        input: "project",
        message: "Please enter a valid project",
      });
    } else if (formData.status.trim() === "") {
      setError({
        input: "status",
        message: "Please enter a valid status",
      });
    } else if (formData.priority.trim() === "") {
      setError({
        input: "priority",
        message: "Please enter a valid priority",
      });
    } else if (formData.due_date === null || "") {
      setError({
        input: "priority",
        message: "Please enter a valid priority",
      });
    } else {
      setError({ input: "", message: "" });
      createTaskMutation(formData);
      setFormData(initialState);
      setIsCreateModalOpen(false);
    }
  };
  const handleList = () => {
    setIsList(true);
  };

  const handleGrid = () => {
    setIsList(false);
  };

  const handleSearch = async () => {
    const searchValue = searchRef.current?.value.toLowerCase().trim();
    if (!searchValue || searchValue.length < 1) {
      setFilteredCards(data);
      return;
    }

    const filteredData = data.filter(
      (item: TCards) =>
        item.title.toLowerCase().trim().includes(searchValue) ||
        item.type.toLowerCase().trim().includes(searchValue),
    );
    setFilteredCards(filteredData);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleDelete = (id: string) => {
    deleteTaskMutation(id)
  }

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
    <div className="w-full h-full p-[8px] space-y-[20px]">
      {/* seearch and layouttoogle */}
      <div>
        <div className="flex justify-between w-full items-center">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search pending tasks..."
              onKeyDown={handleKeyDown}
              className="w-56 px-4 py-2 rounded-md border border-gray-300 
            focus:outline-none focus:ring-1 focus:ring-green-500 
            focus:border-green-500 transition duration-200"
              ref={searchRef}
            />
            <button
              className="p-2 bg-blue-500 rounded-full cursor-pointer"
              onClick={handleSearch}
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
        <div
          className={`flex flex-wrap justify-center lg:justify-start gap-5 w-full pb-5 items-stretch`}
        >
          {filteredCards.map((item) => {
            return (
              <div
                key={item.id}
                className={`w-[350px] flex flex-col rounded-md overflow-hidden transition-all duration-300 ease-in-out overflow-hidden ${isList ? "h-8" : "h-auto"}`}
              >
                <div
                  className={`w-full bg-green-500/60 h-8 rounded-t-md flex justify-between px-3 items-center font-semibold ${isList && "rounded-md py-1"}`}
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
                        truncateNumber: 15,
                      })}
                    </h3>
                  </div>
                  <div className="flex gap-3">
                    {/* title */}
                    <p className="capitalize">{item.status}</p>
                    <button className="cursor-pointer">
                      <MdModeEdit color="blue" size={"20"} />
                    </button>
                    <button className="cursor-pointer" onClick={()=> handleDelete(item.id as string)}>
                      <MdOutlineDelete color="red" size={"20"} />
                    </button>
                  </div>
                </div>
                <div
                  className={`w-full bg-gray-300/40 rounded-b-md flex flex-col justify-between ${isList ? "p-0" : "p-3"}`}
                >
                  <div className="space-y-2 bg-white p-2 rounded-lg">
                    <p className="text-lg">
                      {truncateText({
                        text: item.description,
                        truncateNumber: 200,
                      })}
                    </p>
                  </div>
                  <div className="flex gap-5 px-5 pt-2 justify-between items-center">
                    <div className="w-fit px-5 h-7 bg-[#D84242]/80 text-white text-sm flex items-center justify-center rounded-sm uppercase">
                      {item.type}
                    </div>
                    <div className=" flex gap-5 items-center">
                      <p>Dusan Ilic</p>
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
      ) : (
        <div className="w-full text-center text-2xl text-semibold select-none">
          No pending tasks for today...
        </div>
      )}
      {isModalOpen && (
        <div
          className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-screen h-screen overflow-hidden bg-gray-500/50 flex items-center justify-center select-none ${isModalOpen ? "block" : "hidden"}`}
        >
          <div className="w-8/9 xl:w-2/5 bg-white h-fit py-2 xl:py-2 px-2 xl:px-2 rounded-xl select-text overflow-y-auto overflow-x-hidden">
            <div
              className="pb-2 xl:pb-10 flex justify-end cursor-pointer select-none"
              onClick={() => {
                setIsModalOpen(null);
              }}
            >
              <IoClose color="red" size={30} />
            </div>
            <div className="px-5 xl:px-20 space-y-5 pb-2 xl:pb-10">
              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
                <h2 className="font-bold text-2xl capitalize">
                  {isModalOpen.title}
                </h2>
                <div className="flex gap-5 items-center justify-between xl:justify-start">
                  <p className="font-semibold text-xl capitalize">
                    {isModalOpen.status}
                  </p>
                  <div className="flex gap-2">
                    <button className="cursor-pointer">
                      <MdModeEdit color="blue" size={"20"} />
                    </button>
                    <button className="cursor-pointer">
                      <MdOutlineDelete color="red" size={"20"}  onClick={()=> handleDelete(isModalOpen.id as string)}/>
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 overflow-x-auto py-2 overflow-y-hidden whitespace-nowrap">
                <div className="w-fit px-5 h-7 bg-[#D84242]/80 text-white text-sm flex items-center justify-center rounded-sm uppercase cursor-pointer ">
                  {isModalOpen.type}
                </div>
              </div>
              <div>{isModalOpen.description}</div>
              <div className=" flex gap-5 items-center">
                <span className="w-11 h-11 bg-gray-500 rounded-full flex justify-center items-center">
                  <FaPerson />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
      {isCreateModalOpen && (
        <div
          className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-screen h-screen overflow-hidden bg-gray-500/50 flex items-center justify-center select-none ${isCreateModalOpen ? "block" : "hidden"}`}
        >
          <div className="w-8/9 xl:w-2/5 bg-white h-fit py-2 xl:py-2 px-2 xl:px-2 rounded-xl select-text overflow-y-auto overflow-x-hidden">
            <div
              className="pb-2 xl:pb-10 flex justify-end cursor-pointer select-none"
              onClick={() => {
                setIsCreateModalOpen(false);
                setFormData(initialState);
              }}
            >
              <IoClose color="red" size={30} />
            </div>
            <div className="px-5 xl:px-20 space-y-5 pb-2 xl:pb-10">
              <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
                <h2 className="font-bold text-2xl capitalize">
                  Create new Task
                </h2>
              </div>
              <div className="flex flex-col gap-2 overflow-x-auto py-2 overflow-y-hidden">
                <form
                  onSubmit={handleSubmit}
                  className="bg-white p-8 rounded w-full"
                  noValidate
                >
                  <div className="flex w-full gap-5">
                    <div className="mb-4 w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        placeholder="Title..."
                        name="title"
                        className={`w-full px-3 py-2 border ${
                          error && error.input === "title"
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded focus:outline-none focus:ring-2 ${
                          error && error.input === "title"
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        }`}
                        value={formData.title}
                        onChange={handleChange}
                        required
                      />
                      {error && error.input === "title" && (
                        <p className="text-red-600 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Type
                      </label>
                      <input
                        type="text"
                        placeholder="Type..."
                        name="type"
                        className={`w-full px-3 py-2 border ${
                          error && error.input === "type"
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded focus:outline-none focus:ring-2 ${
                          error && error.input === "type"
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        }`}
                        value={formData.type}
                        onChange={handleChange}
                        required
                      />
                      {error && error.input === "type" && (
                        <p className="text-red-600 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full gap-5">
                    <div className="mb-4 w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition duration-200"
                      >
                        <option value="">Select Status</option>
                        <option value="PENDING">Pending</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="IN_PROGRESS">In progress</option>
                      </select>

                      {error && error.input === "status" && (
                        <p className="text-red-600 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        value={formData.priority}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-blue-500 transition duration-200"
                      >
                        <option value="">Select Priority</option>
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                      </select>

                      {error && error.input === "status" && (
                        <p className="text-red-600 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full gap-5">
                    <div className="mb-4 w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Due Date
                      </label>
                      <input
                        type="date"
                        name="due_date"
                        value={
                          formData.due_date
                            ? formData.due_date.toISOString().split("T")[0]
                            : ""
                        }
                        onChange={handleChange}
                        className="border rounded-md px-3 py-2 w-full
                   focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />

                      {error && error.input === "status" && (
                        <p className="text-red-600 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4 w-1/2">
                      <label className="block text-sm font-medium mb-1">
                        Project
                      </label>
                      <input
                        type="text"
                        placeholder="Project..."
                        name="project"
                        className={`w-full px-3 py-2 border ${
                          error && error.input === "project"
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded focus:outline-none focus:ring-2 ${
                          error && error.input === "project"
                            ? "focus:ring-red-500"
                            : "focus:ring-blue-500"
                        }`}
                        value={formData.project}
                        onChange={handleChange}
                        required
                      />
                      {error && error.input === "project" && (
                        <p className="text-red-600 text-sm mt-1">
                          {error.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      placeholder="Description of task..."
                      rows={4}
                      cols={20}
                      className={`w-full px-3 py-2 border ${
                        error && error.input === "description"
                          ? "border-red-500"
                          : "border-gray-300"
                      } rounded focus:outline-none focus:ring-2 ${
                        error && error.input === "description"
                          ? "focus:ring-red-500"
                          : "focus:ring-blue-500"
                      }`}
                      value={formData.description}
                      onChange={handleChange}
                      required
                    />
                    {error && error.input === "description" && (
                      <p className="text-red-600 text-sm mt-1">
                        {error.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                      Create Task
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingPage;
