import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { NotificationContext } from "./notification.context";

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<{
    msg: string;
    type: "error" | "success";
  } | null>(null);

  const showNotification = ({
    msg,
    type = "success",
  }: {
    msg: string;
    type?: "error" | "success";
  }) => {
    setMessage(() => {
      return { msg, type };
    });
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <NotificationContext.Provider value={{ message, showNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
