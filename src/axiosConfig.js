import axios from "axios";

axios.defaults.baseURL = "http://127.0.0.1:8000/api";

axios.interceptors.request.use(
  function (config) {
    const access_token = localStorage.getItem("token");
    if (access_token) {
      config.headers.Authorization = `Bearer ${access_token}`;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axios;
