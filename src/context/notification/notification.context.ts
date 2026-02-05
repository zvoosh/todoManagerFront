import { createContext } from "react";

type NotificationContextType = {
  message: string;
  showNotification: (msg: string) => void;
};

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);