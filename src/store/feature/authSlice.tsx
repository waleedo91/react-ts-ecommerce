import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  login as loginApi,
  registerUser as registerApi,
} from "../../api/fetchData";
import type { AuthState } from "../../types/types";
import { AxiosError } from "axios";
import type { RegisterData, RegisterResponse } from "../../types/types";

const initialState: AuthState = {
  token: localStorage.getItem("token") || null,
  username: localStorage.getItem("username") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  { token: string; username: string },
  { username: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async (Credentials, { rejectWithValue }) => {
  try {
    const response = await loginApi(Credentials);
    return { token: response.token, username: Credentials.username };
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response && error.response.data) {
      return rejectWithValue(error.response.data.message || "Login Failed");
    }
    return rejectWithValue("Login Failed");
  }
});

export const registerUser = createAsyncThunk<
  RegisterResponse,
  RegisterData,
  { rejectValue: string }
>("auth/registerUser", async (userData: RegisterData, { rejectWithValue }) => {
  try {
    const response = await registerApi(userData);
    return response;
  } catch (err) {
    const error = err as AxiosError<{ message?: string }>;
    if (error.response && error.response.data) {
      return rejectWithValue(
        error.response.data.message || "Registration Failed"
      );
    }
    return rejectWithValue("Registration Failed");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.username = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loading = false;
        state.token = action.payload.token;
        state.username = action.payload.username;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("username", action.payload.username);
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        registerUser.fulfilled,
        (state, action: PayloadAction<RegisterResponse>) => {
          state.loading = false;
          state.username = action.payload.username;
        }
      )
      .addCase(
        registerUser.rejected,
        (state, action: PayloadAction<string | undefined>) => {
          state.loading = false;
          state.error = action.payload ?? "Unknown error occurred";
        }
      );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
