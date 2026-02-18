import { useNotification } from "../../services/hooks/useNotification";

export const Notification = () => {
  const { message } = useNotification();

  if (!message) return null;

  return (
    <div
      key={message.msg}
      className="fixed top-4 left-[50%] -translate-x-1/2 animate-fadeout pointer-events-none z-999"
    >
      <div
        className={`${message.type === "error" ? "bg-red-500" : "bg-green-500"} text-white px-4 py-2 rounded shadow`}
      >
        <p>{message.msg}</p>
      </div>
    </div>
  );
};
