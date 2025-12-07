import React from "react";
import TaskCard from "./TaskCard";

const ListView = ({ tasks, onTaskClick }) => {
  // Group tasks by status for better organization
  const todos = tasks.filter((t) => t.status === "To Do");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const done = tasks.filter((t) => t.status === "Done");

  // Simple TaskCard without drag functionality
  const SimpleTaskCard = ({ task }) => {
    const priorityColor = {
      "Low Priority": "bg-green-600",
      Critical: "bg-red-600",
      "High Priority": "bg-yellow-600",
      Urgent: "bg-orange-600",
    };

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
        className="bg-slate-800 border border-slate-700 px-4 py-3 rounded-xl text-slate-200 shadow-sm cursor-pointer hover:bg-slate-750 hover:border-slate-600 transition-colors"
        onClick={() => onTaskClick(task)}
      >
        <h3 className="font-semibold text-[15px]">{task.title}</h3>

        {task.description && (
          <p className="text-sm text-slate-400 mt-2 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>📅 {formatDate(task.dueDate)}</span>
            {isOverdue && (
              <span className="text-red-400 text-xs bg-red-900/30 px-2 py-0.5 rounded">
                Overdue
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-1 rounded ${
                task.status === "To Do"
                  ? "bg-slate-600 text-slate-300"
                  : task.status === "In Progress"
                  ? "bg-blue-600 text-blue-100"
                  : "bg-emerald-600 text-emerald-100"
              }`}
            >
              {task.status}
            </span>
            <span
              className={`${
                priorityColor[task.priority] || "bg-gray-600"
              } text-white text-xs px-3 py-1 rounded-lg`}
            >
              {task.priority}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-6 flex flex-col gap-6">
      {/* To Do Section */}
      {todos.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-slate-500"></span>
            To Do ({todos.length})
          </h2>
          <div className="space-y-3">
            {todos.map((task) => (
              <SimpleTaskCard key={task._id || task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* In Progress Section */}
      {inProgress.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-blue-500"></span>
            In Progress ({inProgress.length})
          </h2>
          <div className="space-y-3">
            {inProgress.map((task) => (
              <SimpleTaskCard key={task._id || task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Done Section */}
      {done.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-emerald-500"></span>
            Done ({done.length})
          </h2>
          <div className="space-y-3">
            {done.map((task) => (
              <SimpleTaskCard key={task._id || task.id} task={task} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-400 mb-4">📋</div>
          <h3 className="text-lg font-semibold text-slate-300 mb-2">
            No tasks yet
          </h3>
          <p className="text-slate-500">
            Create your first task to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default ListView;
