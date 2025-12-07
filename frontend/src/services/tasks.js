import { axiosBaseInstance } from "../axios/instance";
import endpoints from "./endpoints";

const getAllTasks = (params = {}) =>
  axiosBaseInstance.get(endpoints.GET_ALL_TASKS, { params });
const createTask = (payload) =>
  axiosBaseInstance.post(endpoints.CREATE_TASK, payload);
const getTaskById = (id) => axiosBaseInstance.get(endpoints.GET_TASK_BY_ID(id));
const updateTask = (payload, id) =>
  axiosBaseInstance.put(endpoints.UPDATE_TASK(id), payload);
const updateTaskStatus = (payload, id) =>
  axiosBaseInstance.patch(endpoints.UPDATE_TASK_STATUS(id), payload);
const deleteTask = (id) => axiosBaseInstance.delete(endpoints.DELETE_TASK(id));

const getTaskDetailsFromText = (payload) =>
  axiosBaseInstance.post(endpoints.GET_TASK_DETAILS_FROM_TEXT, payload);
export {
  getAllTasks,
  createTask,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskDetailsFromText,
};
