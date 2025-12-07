import Task from "../models/task.model.js";
import sendResponse from "../utils/sendResponse.util.js";

// CREATE TASK
export const createTask = async (req, res) => {
  try {
    const task = await Task.create(req.body);

    return sendResponse(res, "Task created successfully", 201, task);
  } catch (error) {
    return sendResponse(res, error.message, 500);
  }
};

// GET ALL TASKS (filters + search)
export const getAllTasks = async (req, res) => {
  try {
    const { status, priority, search } = req.query;

    let query = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    return sendResponse(res, "Tasks fetched successfullys", 200, tasks);
  } catch (error) {
    return sendResponse(res, error.message, 500);
  }
};

// UPDATE TASK (full edit)
export const updateTask = async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) return sendResponse(res, "Task not found", 404);

    return sendResponse(res, "Task updated successfully", 200, updatedTask);
  } catch (error) {
    return sendResponse(res, error.message, 500);
  }
};

// UPDATE STATUS (kanban drag-drop)
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!task) return sendResponse(res, "Task not found", 404);

    return sendResponse(res, "Task status updated", 200, task);
  } catch (error) {
    return sendResponse(res, error.message, 500);
  }
};

// DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) return sendResponse(res, "Task not found", 404);

    return sendResponse(res, "Task deleted successfully", 200);
  } catch (error) {
    return sendResponse(res, error.message, 500);
  }
};
