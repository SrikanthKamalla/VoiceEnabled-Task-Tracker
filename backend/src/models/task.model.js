import mongoose, { Schema } from "mongoose";

const taskSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minlength: [3, "Title must be at least 3 characters long"],
    },
    description: {
      type: String,
      default: "",
    },
    priority: {
      type: String,
      enum: ["Urgent", "High Priority", "Low Priority", "Critical"],
      required: true,
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Done"],
      default: "To Do",
      required: true,
    },
    dueDate: {
      type: Date,
    },
  },
  { timeStampes: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
