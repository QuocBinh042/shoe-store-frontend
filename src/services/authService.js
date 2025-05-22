import { postData, apiClient } from "./apiService";
import { doLogoutAction } from "../redux/accountSlice";
import store from "../redux/store";
import { em } from "framer-motion/client";

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

const signup = async (values) => {
  try {
    const data = await postData("/auth/sign-up", values);
    return data;
  } catch (error) {
    throw error;
  }
};

const verifyOtp = async ({ email, otp }) => {
  try {
    const data = await apiClient.post("/auth/verify-otp", null, {
      params: { email, otp },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
const resetPassword = async ({ email, otp, newPassword }) => {
  console.log(email,otp,newPassword)
  try {
    const response = await apiClient.post("/auth/reset-password", {
      email,
      otp,
      newPassword,
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    throw error;
  }
};

const resendOtp = async (email) => {
  try {
    const data = await apiClient.post("/auth/resend-verification", null, {
      params: { email },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
const sendOTPForgotPassword = async (email) => {
  try {
    const data = await apiClient.post("/auth/sendOTP-forgot-password", null, {
      params: { email },
    });
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
const checkEmail = async (email) => {
  try {
    const response = await apiClient.get("/auth/check-email", {
      params: { email },
    });
    return response.data; 
  } catch (error) {
    throw error;
  }
};
const changePassword = async ({ currentPassword, newPassword }) => {
  try {
    const response = await apiClient.post("/auth/change-password", {
      currentPassword,
      newPassword,
    });
    return response.data;
  } catch (error) {
    console.log(error)
    throw error;
  }
};

export const authService = {
  login,
  logout,
  refreshAccessToken,
  signup,
  verifyOtp,
  resendOtp,
  checkEmail,
  changePassword,
  sendOTPForgotPassword,
  resetPassword
};