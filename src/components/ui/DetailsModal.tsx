import type { TCards } from "../../pages/TaskPages/TaskRenderPage";
import { IoClose } from "react-icons/io5";
import { useEffect } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { formattedDate } from "../../services/hooks/formatedDate";

const DetailsModal = ({
  setIsModalOpen,
  isModalOpen,
}: {
  isModalOpen: TCards | null;
  setIsModalOpen: React.Dispatch<React.SetStateAction<TCards | null>>;
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsModalOpen(null);
      }
    };
    if (!isModalOpen) return;
    window.addEventListener("keydown", handleEsc);
    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [setIsModalOpen, isModalOpen]);


  return (
    <div
      className={`absolute top-[50%] left-[50%] -translate-x-[50%] -translate-y-[50%]
              w-screen h-screen bg-gray-500/50 flex items-center justify-center select-none
              transition-opacity duration-300 ease-in-out
              ${isModalOpen ? "opacity-100 pointer-event-auto" : "opacity-0 pointer-events-none"}`}
    >
      <div
        className={`w-8/9 xl:w-2/5 bg-white h-fit py-2 xl:py-2 px-2 xl:px-2 rounded-xl select-text overflow-y-auto overflow-x-hidden
                transform transition duration-300 ease-in-out origin-center
                ${isModalOpen ? "opacity-100 scale-100" : "opacity-0 scale-0"}`}
      >
        <div
          className="pb-2 xl:pb-10 flex justify-end cursor-pointer select-none"
          onClick={() => {
            setIsModalOpen(null);
          }}
        >
          <IoClose color="red" size={30} />
        </div>
        {isModalOpen && (
          <div className="px-5 xl:px-20 space-y-5 pb-2 xl:pb-10">
            <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center">
              <h2 className="font-bold text-2xl capitalize">
                {isModalOpen.title}
              </h2>
              <div className="flex gap-3 items-center justify-between xl:justify-start">
                <p className="font-semibold text-xl capitalize">
                  {isModalOpen.status}
                </p>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto py-2 overflow-y-hidden whitespace-nowrap">
              <div className="w-fit px-5 h-7 bg-[#D84242]/80 text-white text-sm flex items-center justify-center rounded-sm uppercase cursor-pointer ">
                {isModalOpen.type}
              </div>
            </div>
            <div>{isModalOpen.description}</div>
            <div className="flex gap-1 items-center">
              <div className="flex items-center gap-1">
                <FaRegCalendarAlt /> Due:
              </div>{" "}
              {formattedDate(isModalOpen.due_date!)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsModal;
