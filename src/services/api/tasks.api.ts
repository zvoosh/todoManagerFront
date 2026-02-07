import axios from "axios";
import type { TCards } from "../../pages/PendingPage";
import { TASKS_API_URL } from "../constants";

export const createTask = async (formData: TCards) => {
  try {
    const response = await axios.post(`${TASKS_API_URL}`, formData);
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${TASKS_API_URL}/${id}`);
    console.log("Server response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};