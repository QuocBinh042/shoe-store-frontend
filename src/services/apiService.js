import axios from "axios";
import { authService } from "./authService";
import { doLogoutAction } from "../redux/accountSlice";
import store from "../redux/store";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

const getAccessToken = () => localStorage.getItem("accessToken");

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newToken) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const state = store.getState();
    const isAuthenticated = state.account.isAuthenticated;
    if (!isAuthenticated) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshResponse = await authService.refreshAccessToken();
        if (refreshResponse.data.statusCode === 200) {
          const newToken = refreshResponse.data.data.access_token;
          localStorage.setItem("accessToken", newToken);
          apiClient.defaults.headers.Authorization = `Bearer ${newToken}`;

          onRefreshed(newToken);

          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        } else {
          throw new Error("Refresh token không hợp lệ");
        }
      } catch (refreshError) {
        console.error("Lỗi refresh token, đăng xuất...");
        localStorage.removeItem("accessToken");
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        await authService.logout();
        store.dispatch(doLogoutAction());
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export const fetchData = async (endpoint, requiresAuth = false) => {
  try {
    const headers = requiresAuth ? { Authorization: `Bearer ${getAccessToken()}` } : {};
    const response = await apiClient.get(endpoint, { headers });
    return response.data;
  } catch (error) {
    console.error("API GET Error:", error);
    throw error;
  }
};

export const postData = async (endpoint, data) => {
  try {
    const response = await apiClient.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("API POST Error:", error);
    throw error;
  }
};

export const putData = async (endpoint, data) => {
  try {
    const response = await apiClient.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error("API PUT Error:", error);
    throw error;
  }
};

export const deleteData = async (endpoint) => {
  try {
    const response = await apiClient.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error("API DELETE Error:", error);
    throw error;
  }
};

export { apiClient };
