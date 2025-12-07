import express from "express";
import validate from "../middlewares/validate.js";

import {
  createTaskSchema,
  getAllTasksSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  deleteTaskSchema,
  parseVoiceTaskSchema,
} from "../validations/tasks.validations.js";

import {
  createTask,
  getAllTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/tasks.controllers.js";
import { parseVoiceTask } from "../controllers/voice.controller.js";

const router = express.Router();

router.post("/", validate(createTaskSchema), createTask);
router.get("/", validate(getAllTasksSchema), getAllTasks);
router.put("/:id", validate(updateTaskSchema), updateTask);
router.patch("/:id/status", validate(updateTaskStatusSchema), updateTaskStatus);
router.delete("/:id", validate(deleteTaskSchema), deleteTask);

router.post("/parse-task", validate(parseVoiceTaskSchema), parseVoiceTask);

export default router;
