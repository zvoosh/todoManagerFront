import { useMutation } from "@tanstack/react-query";
import { IoClose } from "react-icons/io5";
import type { TCards } from "../../pages/TaskPages/TaskRenderPage";
import { CreateMutationOptions, editTask } from "../../services";
import { useEffect, useState } from "react";


const initialState = {
  title: "",
  description: "",
  status: "PENDING",
  priority: "",
  project: "",
  type: "",
  dueDate: null,
} as TCards;

const EditTaskModal = ({
  isEditModalOpen,
  setIsEditModalOpen,
  showNotification,
}: {
  isEditModalOpen: TCards | null;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<TCards | null>>;
  showNotification: ({
    msg,
    type,
  }: {
    msg: string;
    type?: "error" | "success" | undefined;
  }) => void;
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
        showNotification({ msg: "Successfuly edited a task!" });
      },
      errorFn: () => {
        showNotification({ msg: "Error editing a task!", type: "error" });
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
      [name]: name === "dueDate" ? (value ? new Date(value) : null) : value,
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
    } else if (formData.dueDate === null || "") {
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
      className={`fixed inset-0 bg-black/50 flex items-center justify-center
  transition-opacity duration-300
  ${isEditModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      onClick={() => {
        setFormData(initialState);
        setIsEditModalOpen(null);
      }}
    >
      <div
        className={`bg-white w-[90%] 2xl:w-2/5 rounded-xl
  transform transition-all duration-300
  ${isEditModalOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="m-2 flex justify-end select-none">
          <IoClose
            color="red"
            size={30}
            className="cursor-pointer"
            onClick={() => {
              setFormData(initialState);
              setIsEditModalOpen(null);
            }}
          />
        </div>
        <div className="2xl:px-20 space-y-5 pb-0 2xl:pb-10">
          <div className="flex flex-col 2xl:flex-row 2xl:justify-between 2xl:items-center">
            <h2 className="font-bold text-2xl capitalize pl-6 2xl:pl-0">
              Edit Task
            </h2>
          </div>
          <div className="flex flex-col gap-2 overflow-x-auto 2xl:py-2 overflow-y-hidden">
            <form
              onSubmit={handleSubmit}
              className="bg-white p-2 2xl:p-8 rounded w-full"
              noValidate
            >
              <div className="flex w-full gap-5">
                <div className="2xl:mb-4 w-1/2">
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

                  {error && error.input === "priority" && (
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
                    name="dueDate"
                    value={
                      formData.dueDate
                        ? new Date(formData.dueDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleChange}
                    className="border rounded-md px-3 py-2 w-full
                          focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {error && error.input === "dueDate" && (
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
                  Edit Task
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
