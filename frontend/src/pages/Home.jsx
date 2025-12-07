import React, { useEffect, useState } from "react";
import FilterBar from "../components/FilterBar";
import Board from "../components/Board";
import ListView from "../components/ListView";
import AddTaskModal from "../components/AddTaskModal";
import { IoGridOutline, IoList } from "react-icons/io5";
import { getAllTasks } from "../services/tasks";

import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Home = () => {
  const [toggleView, setToggleView] = useState("board");
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [script, setScript] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const response = await getAllTasks();
        setTasks(response.data.data || response.data);
      } catch (err) {
        console.error("Failed to fetch tasks:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Handle task status update after drag-and-drop
  const handleTaskStatusUpdate = (taskId, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      )
    );
  };

  const handleAddTask = () => {
    setScript(null);
    setAddModalOpen(true);
  };

  const handleEditTask = (task) => {
    setScript(task);
    setAddModalOpen(true);
  };

  const closeModal = () => {
    setAddModalOpen(false);
    setScript(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="px-10 py-6">
        <FilterBar
          onAdd={handleAddTask}
          setScript={setScript}
          setTasks={setTasks}
          tasks={tasks}
        />

        {/* View Toggle */}
        <div className="flex my-4 text-white rounded-lg">
          <div className="bg-[#333e4d] rounded-lg flex p-1">
            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                toggleView === "board" ? "bg-[#1f2937]" : ""
              }`}
              onClick={() => setToggleView("board")}
            >
              <IoGridOutline />
              Board
            </button>

            <button
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                toggleView === "list" ? "bg-[#1f2937]" : ""
              }`}
              onClick={() => setToggleView("list")}
            >
              <IoList />
              List
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Main View */}
            {toggleView === "board" ? (
              <Board
                tasks={tasks}
                setTasks={setTasks}
                onTaskClick={handleEditTask}
                onTaskStatusUpdate={handleTaskStatusUpdate}
              />
            ) : (
              <ListView
                tasks={tasks}
                setTasks={setTasks}
                onTaskClick={handleEditTask}
              />
            )}
          </>
        )}

        {/* Add / Edit Modal */}
        {isAddModalOpen && (
          <AddTaskModal
            onClose={closeModal}
            script={script}
            setTasks={setTasks}
          />
        )}
      </div>
    </DndProvider>
  );
};

export default Home;
