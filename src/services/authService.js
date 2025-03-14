import { postData, apiClient } from "./apiService";
import { doLogoutAction } from "../redux/accountSlice";
import store from "../redux/store";

const ACCESS_TOKEN_KEY = "accessToken";

const saveAccessToken = (token) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

const clearAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
};

const login = async (values) => {
  try {
    const data = await postData("/auth/login", values);
    if (data.statusCode === 200) {
      saveAccessToken(data.data.access_token);
    }
    return data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    await apiClient.post("/auth/logout");
  } catch (error) {
    console.error("Lỗi khi gọi API logout:", error);
  }
  clearAccessToken();
  store.dispatch(doLogoutAction());
};

const refreshAccessToken = async () => {
  try {
    const response = await apiClient.post("/auth/refresh-token", null, {
      withCredentials: true,
      validateStatus: () => true,
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi gọi refresh token API:", error);
    throw error;
  }
};

export const authService = {
  login,
  logout,
  refreshAccessToken,
};
