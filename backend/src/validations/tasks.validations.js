import { z } from "zod";

//  COMMON ENUMS 
const PriorityEnum = z.enum([
  "Urgent",
  "High Priority",
  "Low Priority",
  "Critical",
]);

const StatusEnum = z.enum(["To Do", "In Progress", "Done"]);

// CREATE TASK
export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters"),
    description: z.string().optional(),
    priority: PriorityEnum,
    status: StatusEnum.optional(), 
    dueDate: z.string().datetime().optional(),
  }),
});

// GET ALL TASKS (filters + search)
export const getAllTasksSchema = z.object({
  query: z.object({
    status: StatusEnum.optional(),
    priority: PriorityEnum.optional(),
    search: z.string().optional(),
  }),
});
// UPDATE TASK (full edit)
export const updateTaskSchema = z.object({
  params: z.object({
    id: z.string().min(24, "Invalid Task ID"),
  }),
  body: z.object({
    title: z.string().min(3).optional(),
    description: z.string().optional(),
    priority: PriorityEnum.optional(),
    status: StatusEnum.optional(),
    dueDate: z.string().datetime().optional(),
  }),
});

// UPDATE STATUS ONLY (drag & drop)
export const updateTaskStatusSchema = z.object({
  params: z.object({
    id: z.string().min(24, "Invalid Task ID"),
  }),
  body: z.object({
    status: StatusEnum,
  }),
});

//DELETE TASK
export const deleteTaskSchema = z.object({
  params: z.object({
    id: z.string().min(24, "Invalid Task ID"),
  }),
});

// PARSE TEXT
export const parseVoiceTaskSchema = z.object({
  body: z.object({
    text: z.string(),
  }),
});
