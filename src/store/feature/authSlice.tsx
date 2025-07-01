import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth, db } from "../../config/firebase";
import type { AuthState, RegisterData } from "../../types/types";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const initialState: AuthState = {
  uid: null,
  username: null,
  fullname: null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk<
  { token: string; username: string; fullname: string | null; uid: string },
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

    // Fetch fullname from Firestore
    const userDoc = await getDoc(doc(db, "users", user.uid));
    const fullname = userDoc.exists()
      ? (userDoc.data().fullname as string)
      : null;

    return {
      token,
      username: user.email ?? username,
      fullname,
      uid: user.uid,
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
  { username: string; uid: string },
  RegisterData,
  { rejectValue: string }
>(
  "auth/registerUser",
  async (
    { email, password, fullname, phone, address },
    { rejectWithValue }
  ) => {
    try {
      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      await setDoc(doc(db, "users", user.uid), {
        email,
        fullname,
        phone,
        address,
        createdAt: serverTimestamp(),
      });

      return { username: user.email ?? email, uid: user.uid };
    } catch (err: unknown) {
      let message = "Registration Failed";
      if (err instanceof Error) {
        message = err.message;
      }
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.username = null;
      state.fullname = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("fullname");
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        if (!action.payload) return;
        state.loading = false;
        state.username = action.payload.username;
        state.fullname = action.payload.fullname;
        state.uid = action.payload.uid;
        state.isAuthenticated = true;

        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("username", action.payload.username);
        if (action.payload.fullname) {
          localStorage.setItem("fullname", action.payload.fullname);
        }
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
        state.uid = action.payload.uid;
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
