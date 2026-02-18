import { createContext } from "react";

type NotificationContextType = {
  message: {msg: string, type?: "error" | "success"} | null;
  showNotification: ({ msg, type, }: { msg: string; type?: "error" | "success"; }) => void;
};

export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);
