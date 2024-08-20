import axios from "axios";

import { store } from "../state/store";

const axiosInstance = axios.create({
  // baseURL: "https://jijnas-backend-service-nvwmghbpda-el.a.run.app/",
  baseURL: "http://localhost:8000/",

  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Content-Type"] = "application/json";
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { dispatch } = store;
    if (error.response.status === 401) {
      dispatch({ type: "RESET" });
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
