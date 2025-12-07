import React, { useRef } from "react";
import TaskCard from "./TaskCard";
import { useDrop } from "react-dnd";
import { updateTaskStatus } from "../services/tasks";
import { toast } from "react-toastify";

const headerColors = {
  "To Do": "bg-slate-600",
  "In Progress": "bg-blue-800",
  Done: "bg-emerald-800",
};

const Column = ({ title, status, tasks, onTaskClick, onDrop, setTasks }) => {
  const ref = useRef(null);

  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "task",
      drop: async (item, monitor) => {
        if (status !== item.currentStatus) {
          try {
            // Update on server first
            await updateTaskStatus({ status }, item.id);

            // Then update locally
            onDrop(item.id, status);

            // Also update the setTasks to ensure consistency
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task._id === item.id || task.id === item.id
                  ? { ...task, status }
                  : task
              )
            );
          } catch (error) {
            console.error("Failed to update task status:", error);
            toast.error("Something went wrong ❌");
            onDrop(item.id, item.currentStatus);
          }
        }
        return { dropped: true };
      },
      canDrop: (item) => item.currentStatus !== status,
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [status, onDrop, setTasks]
  );

  drop(ref);

  const columnClasses = `w-full transition-all duration-200 ${
    isOver && canDrop ? "bg-slate-900/30 rounded-lg p-2" : ""
  }`;

  return (
    <div className={columnClasses} ref={ref}>
      <div
        className={`${headerColors[title]} text-white px-4 py-2 rounded-xl
                    flex justify-between items-center`}
      >
        <span className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-white/80"></span>
          {title}
        </span>
        <span>{tasks.length}</span>
      </div>

      <div className="mt-4 flex flex-col gap-4 min-h-[200px]">
        {tasks.map((task) => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onTaskClick={onTaskClick}
            currentStatus={status}
          />
        ))}

        {/* Drop indicator */}
        {isOver && canDrop && (
          <div className="border-2 border-dashed border-blue-400 rounded-xl p-4 text-center text-blue-400 bg-blue-400/10">
            Drop here to move to {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
