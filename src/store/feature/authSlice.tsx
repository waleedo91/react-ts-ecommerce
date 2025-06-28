import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config/firebase";
import type { AuthState } from "../../types/types";
import type { RegisterData } from "../../types/types";

const initialState: AuthState = {
  username: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  { token: string; username: string },
  { username: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ username, password }, { rejectWithValue }) => {
  try {
    const userCredentials = await signInWithEmailAndPassword(
      auth,
      username,
      password
    );
    const user = userCredentials.user;
    const token = await user.getIdToken();
    return {
      token,
      username: user.email ?? username,
    };
  } catch (err: unknown) {
    let message = "Login Failed";
    if (err instanceof Error) {
      message = err.message;
    }
    return rejectWithValue(message);
  }
});

export const registerUser = createAsyncThunk<
  { username: string },
  RegisterData,
  { rejectValue: string }
>("auth/registerUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { username: userCredentials.user.email ?? email };
  } catch (err: unknown) {
    let message = "Registration Failed";

    if (err instanceof Error) {
      message = err.message;
    }

    return rejectWithValue(message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
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
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.username = action.payload.username;
        state.isAuthenticated = true;
      })
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
