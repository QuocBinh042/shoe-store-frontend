import { authService } from "../services/authService";
import { apiClient } from "../services/apiService";
import { createSlice } from "@reduxjs/toolkit";

const initialUser = {
  isAuthenticated: false,
  user: null,
  isAppLoading: true,
};

export const accountSlice = createSlice({
  name: "account",
  initialState: {
    isAuthenticated: false,
    user: null,
    isAppLoading: true,
  },
  reducers: {
    doLoginAction: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.isAppLoading = false;
    },
    doLogoutAction: (state) => {
      localStorage.removeItem("accessToken");
      document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      return { isAuthenticated: false, user: null, isAppLoading: false };
    },
    setAppLoading: (state, action) => {
      state.isAppLoading = action.payload;
    },
    setUser: (state, action) => {
      if (action.payload) {
        state.user = action.payload;
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
    },
  },
});


export const { doLoginAction, doLogoutAction, setAppLoading, setUser } = accountSlice.actions;
export default accountSlice.reducer;

export const fetchUser = () => async (dispatch, getState) => {
  dispatch(setAppLoading(true)); // Bắt đầu loading
  try {
      let accessToken = localStorage.getItem("accessToken");

      const fetchProfile = async (token) => {
          return apiClient.get("auth/me", {
              headers: { Authorization: `Bearer ${token}` },
          });
      };

      let response;
      try {
          response = await fetchProfile(accessToken);
      } catch (error) {
          if (error.response?.status === 401) {
              console.log("Access token hết hạn, thử refresh...");
              try {
                  const refreshResponse = await authService.refreshAccessToken();
                  if (refreshResponse.data.statusCode === 200) {
                      accessToken = refreshResponse.data.data.access_token;
                      localStorage.setItem("accessToken", accessToken);
                      response = await fetchProfile(accessToken);
                  } else {
                      throw new Error("Refresh token không hợp lệ");
                  }
              } catch (refreshError) {
                  await authService.logout();
                  dispatch(doLogoutAction());
                  dispatch(setAppLoading(false)); // Kết thúc loading
                  return;
              }
          } else {
              throw error;
          }
      }

      if (response?.data?.statusCode === 200) {
          dispatch(doLoginAction(response.data.data));
      } else {
          throw new Error("Unauthorized");
      }
  } catch (error) {
      console.error("Không thể xác thực lại", error);
      await authService.logout();
      dispatch(doLogoutAction());
  } finally {
      dispatch(setAppLoading(false)); // Kết thúc loading
  }
};


