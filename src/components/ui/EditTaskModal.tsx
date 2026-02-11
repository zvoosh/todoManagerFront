import { useMutation } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";
import type { TCards } from "../../pages/TaskPages/TaskRenderPage";
import { CreateMutationOptions, editTask } from "../../services";
import { useEffect, useState } from "react";

const initialState = {
  title: "",
  description: "",
  status: "",
  priority: "",
  type: "",
  due_date: null,
  project: "",
};

const EditTaskModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  showNotification,
}: {
  isEditModalOpen: TCards | null;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<TCards | null>>;
  showNotification: (msg: string) => void;
}) => {
  const [formData, setFormData] = useState<TCards>(
    isEditModalOpen ?? initialState,
  );
  const [error, setError] = useState<{ input: string; message: string }>({
    input: "",
    message: "",
  });

  useEffect(() => {
    if (isEditModalOpen) {
      setFormData(isEditModalOpen);
    }
  }, [isEditModalOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsEditModalOpen(null);
      }
    };
    if (!isEditModalOpen) return;
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setIsEditModalOpen, isEditModalOpen]);

  const { mutateAsync: editTaskModal } = useMutation(
    CreateMutationOptions<undefined, TCards>({
      queryKey: ["tasks"],
      mutationFn: (taskData: TCards) => editTask(taskData, taskData.id!),
      successFn: () => {
        showNotification("Successfuly added a task!");
      },
    }),
  );

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

  const handleSubmit = async (e: React.FormEvent) => {
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
      await editTaskModal(formData);
      setFormData(initialState);
      setIsEditModalOpen(null);
    }
  };

  return (
    <div
      className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
              w-screen h-screen bg-gray-500/50 flex items-center justify-center select-none
              transition-opacity duration-300 ease-in-out
              ${isEditModalOpen && isEditModalOpen.id ? "opacity-100 pointer-event-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`w-8/9 xl:w-2/5 bg-white h-fit py-0 xl:py-2 px-0 xl:px-2 xl:px-2 rounded-xl select-text overflow-y-auto overflow-x-hidden
                transform transition duration-300 ease-in-out origin-center max-h-full
                ${isEditModalOpen && isEditModalOpen.id ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
      >
        <div
          className="pb-0 md:pb-10 flex justify-end cursor-pointer select-none"
          onClick={() => {
            setFormData(initialState);
            setIsEditModalOpen(null);
          }}
        >
          <IoClose color="red" size={30} />
        </div>
        <div className="md:px-20 space-y-5 pb-0 md:pb-10">
          <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
            <h2 className="font-bold text-2xl capitalize pl-6 md:pl-0">Edit Task</h2>
          </div>
          <div className="flex flex-col gap-2 overflow-x-auto xl:py-2 overflow-y-hidden">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-2 xl:p-8 rounded w-full"
              noValidate
            >
              <div className="flex w-full gap-5">
                <div className="xl:mb-4 w-1/2">
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
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
                  )}
                </div>
                <div className="mb-4 w-1/2">
                  <label className="block text-sm font-medium mb-1">Type</label>
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
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
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
                    <option value="ARCHIVED">Archived</option>
                  </select>

                  {error && error.input === "status" && (
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
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
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
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
                        ? new Date(formData.due_date)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {error && error.input === "status" && (
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
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
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
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
                  <p className="text-red-600 text-sm mt-1">{error.message}</p>
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
  );
};

export default EditTaskModal;
