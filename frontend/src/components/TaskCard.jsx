import React from "react";
import { useDrag } from "react-dnd";
import { FaGripVertical } from "react-icons/fa";

const priorityColor = {
  "Low Priority": "bg-green-600",
  Critical: "bg-red-600",
  "High Priority": "bg-yellow-600",
  Urgent: "bg-orange-600",
};

const TaskCard = ({ task, onTaskClick }) => {
  // Drag functionality ONLY for Board view
  const [{ opacity }, drag, preview] = useDrag(
    () => ({
      type: "task",
      item: {
        id: task._id || task.id,
        title: task.title,
        currentStatus: task.status,
      },
      collect: (monitor) => ({
        opacity: monitor.isDragging() ? 0.4 : 1,
        isDragging: monitor.isDragging(),
      }),
    }),
    [task]
  );

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch (err) {
      return `Invalid date: ${err.message} `;
    }
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "Done";

  return (
    <div
      ref={(node) => {
        drag(node);
        preview(node);
      }}
      style={{ opacity }}
      className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-200 shadow-sm cursor-move transition-all duration-200 hover:scale-[1.02] hover:border-slate-500"
      id={task._id || task.id}
      onClick={() => onTaskClick(task)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <FaGripVertical className="text-slate-500 cursor-move" />
            <h3 className="font-semibold text-[15px]">{task.title}</h3>
          </div>

          {task.description && (
            <p className="text-sm text-slate-400 mt-2 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mt-3">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <span>📅 {formatDate(task.dueDate)}</span>
          {isOverdue && (
            <span className="text-red-400 text-xs bg-red-900/30 px-2 py-0.5 rounded">
              Overdue
            </span>
          )}
        </div>

        <span
          className={`${
            priorityColor[task.priority] || "bg-gray-600"
          } text-white text-xs px-3 py-1 rounded-lg`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
