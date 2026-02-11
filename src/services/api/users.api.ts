import axios from "axios";
import { USER_API_URL } from "../constants";
import type { CreateUserData, LoginUserData } from "../../types";

export const registerHook = async (formData: CreateUserData) => {
  try {
    const response = await axios.post(`${USER_API_URL}/register`, formData);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const loginHook = async (formData: LoginUserData) => {
  try {
    const response = await axios.post(`${USER_API_URL}/login`, formData);
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};