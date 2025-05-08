import axios from "axios";
import logout from "../utils/logout";
import { API_BASE_URL } from "@/src/constant/constants";
let Api = axios.create({
  baseURL: API_BASE_URL,
  "Content-Type": "application/json",
});

const getToken = () => {
  if (typeof window !== "undefined" && localStorage.getItem("aToken")) {
    let token = localStorage.getItem("aToken");
    if (!!!token) {
      return null;
    }
    return token;
  }
};

Api.interceptors.request.use(
  (request) => {
    if (
      (request.url.includes("v1/") ||
        request.url.includes("v2/") ||
        request.url.includes("checkout")) &&
      !request.url.includes("login")
    ) {
      const token = getToken();
      if (token) {
        request.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    request.headers.platform = "web";

    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => {
    return response?.data;
  },
  (error) => {
    console.log("🚀 ~ error:", error, error?.response?.status);

    if (error?.request?.responseURL?.includes("login")) {
      return Promise.reject(error);
    }

    if (error?.response?.status === 401 || error?.response?.data?.errorCode === 403) {
      logout();
      if (typeof window !== "undefined") {
        alert("Please sign in to continue");
      }
    }

    return Promise.reject(error);
  }
);
export default Api;
