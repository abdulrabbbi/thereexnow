import { GLOBAL_CONFIG } from "@/global-config";

import _axios from "axios";

const axios = _axios.create({
  timeout: 999999,
  baseURL: GLOBAL_CONFIG.baseUrl + "/api/",
});

axios.interceptors.response.use(
  (response) => response,
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong!"
    )
);

export default axios;
