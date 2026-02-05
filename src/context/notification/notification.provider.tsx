import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { NotificationContext } from "./notification.context";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");

  const showNotification = (msg: string) => {
    setMessage(msg);
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <NotificationContext.Provider value={{ message, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};