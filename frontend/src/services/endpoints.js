const endpoints = {
  GET_ALL_TASKS: "/tasks",
  CREATE_TASK: "/tasks",
  GET_TASK_BY_ID: (id) => `/tasks/${id}`,
  UPDATE_TASK: (id) => `/tasks/${id}`,
  UPDATE_TASK_STATUS: (id) => `/tasks/${id}/status`,
  DELETE_TASK: (id) => `/tasks/${id}`,
  GET_TASK_DETAILS_FROM_TEXT: "/tasks/parse-task",
};

export default endpoints;
