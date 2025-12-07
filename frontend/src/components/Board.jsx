import React from "react";
import Column from "./Column";

const Board = ({ tasks, setTasks, onTaskClick, onTaskStatusUpdate }) => {
  // Group tasks by status
  const todos = tasks.filter((t) => t.status === "To Do");
  const inProgress = tasks.filter((t) => t.status === "In Progress");
  const done = tasks.filter((t) => t.status === "Done");

  // Handle task drop
  const handleDrop = (taskId, newStatus) => {
    // Update the task status locally first for immediate feedback
    onTaskStatusUpdate(taskId, newStatus);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      <Column
        key="To Do"
        title="To Do"
        status="To Do"
        tasks={todos}
        onTaskClick={onTaskClick}
        onDrop={handleDrop}
        setTasks={setTasks}
      />
      <Column
        key="In Progress"
        title="In Progress"
        status="In Progress"
        tasks={inProgress}
        onTaskClick={onTaskClick}
        onDrop={handleDrop}
        setTasks={setTasks}
      />
      <Column
        key="Done"
        title="Done"
        status="Done"
        tasks={done}
        onTaskClick={onTaskClick}
        onDrop={handleDrop}
        setTasks={setTasks}
      />
    </div>
  );
};

export default Board;
