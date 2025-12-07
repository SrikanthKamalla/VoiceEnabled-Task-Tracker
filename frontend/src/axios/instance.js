import axios from "axios";
const BASE_URL = import.meta.env.VITE_SERVER_URL;

export const axiosBaseInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: false,
});

axiosBaseInstance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

axiosBaseInstance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
