import React, { useEffect, useState } from "react";
import { createTask, updateTask, deleteTask } from "../services/tasks";
import { toast } from "react-toastify";

/* ✅ Helper functions for datetime-local */
const getMinDateTime = () => {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 16);
};

const toDateTimeLocal = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const AddTaskModal = ({ onClose, script, setTasks }) => {
  /* ✅ Normalize ID */
  const taskId = script?._id || script?.id;
  const isEditMode = Boolean(taskId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low Priority",
    status: "To Do",
    dueDate: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* ✅ Prefill on edit / voice */
  useEffect(() => {
    if (!script) {
      // Reset to default for new task
      setForm({
        title: "",
        description: "",
        priority: "Low Priority",
        status: "To Do",
        dueDate: "",
      });
      return;
    }

    // Prefill with existing task data
    setForm({
      title: script.title || "",
      description: script.description || "",
      priority: script.priority || "Low Priority",
      status: script.status || "To Do",
      dueDate: toDateTimeLocal(script.dueDate) || getMinDateTime(),
    });
  }, [script]);

  /* ✅ Handle input changes */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  /* ✅ CREATE or UPDATE */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!form.dueDate) {
      setError("Due date and time is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description || "",
        priority: form.priority,
        status: form.status,
        dueDate: new Date(form.dueDate).toISOString(),
      };

      let response;

      if (isEditMode) {
        // ✅ UPDATE existing task
        response = await updateTask(payload, taskId);
        toast.success("Task updated successfully");
        setTasks((prev) =>
          prev.map((t) =>
            t._id === taskId || t.id === taskId
              ? response.data.data || response.data
              : t
          )
        );
      } else {
        // ✅ CREATE new task
        response = await createTask(payload);
        toast.success("Task created Successfully");

        setTasks((prev) => [...prev, response.data.data || response.data]);
      }

      onClose();
    } catch (err) {
      console.error("Save failed:", err);
      setError(
        err.response?.data?.message || "Failed to save task. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ✅ DELETE */
  const handleDelete = async () => {
    if (!taskId) return;
    const ok = window.confirm("Are you sure you want to delete this task?");
    if (!ok) return;

    try {
      await deleteTask(taskId);
      toast.success("Task deleted successfully");
      setTasks((prev) =>
        prev.filter((t) => t._id !== taskId && t.id !== taskId)
      );
      onClose();
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Something went wrong ❌");
      setError("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#1f2833] text-white w-full max-w-[620px] rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-semibold">
            {isEditMode ? "Update Task" : "Create Task"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-[#2f3b4a]"
          >
            ✕
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title */}
            <input
              className="w-full bg-[#111827] border border-[#2f3b4a]
                rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
              placeholder="Task Title *"
              name="title"
              value={form.title}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {/* Description */}
            <textarea
              rows={4}
              className="w-full bg-[#111827] border border-[#2f3b4a]
                rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500 resize-none"
              placeholder="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isSubmitting}
            />

            {/* Grid: Status, Priority, Due Date */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Status
                </label>
                <select
                  className="w-full bg-[#111827] border border-[#2f3b4a] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Priority
                </label>
                <select
                  className="w-full bg-[#111827] border border-[#2f3b4a] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  name="priority"
                  value={form.priority}
                  onChange={handleChange}
                  disabled={isSubmitting}
                >
                  <option value="Low Priority">Low Priority</option>
                  <option value="High Priority">High Priority</option>
                  <option value="Urgent">Urgent</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              {/* Due Date & Time */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Due Date & Time
                </label>
                <input
                  type="datetime-local"
                  className="w-full bg-[#111827] border border-[#2f3b4a] rounded-lg px-3 py-2.5 text-white focus:outline-none focus:border-blue-500"
                  name="dueDate"
                  min={getMinDateTime()}
                  value={form.dueDate}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between pt-6 border-t border-[#2f3b4a]">
              {/* Delete Button (only in edit mode) */}
              {isEditMode && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-5 py-2.5 rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Delete
                </button>
              )}

              <div className="ml-auto flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-lg border border-[#2f3b4a] text-gray-300 hover:text-white hover:bg-[#2f3b4a] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>
                      {isEditMode ? "Updating..." : "Creating..."}
                    </>
                  ) : isEditMode ? (
                    "Update Task"
                  ) : (
                    "Create Task"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTaskModal;
