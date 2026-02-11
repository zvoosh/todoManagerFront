import axios from "axios";
import type { TCards } from "../../pages/TaskPages/TaskRenderPage";
import { TASKS_API_URL } from "../constants";

export const createTask = async (formData: TCards) => {
  try {
    const response = await axios.post(`${TASKS_API_URL}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const editTask = async (formData: TCards, id:string) => {
  try {
    const response = await axios.put(`${TASKS_API_URL}/${id}`, formData);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const deleteTask = async (id: string): Promise<void> => {
  try {
    const response = await axios.delete(`${TASKS_API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};