import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { UserProfile, UserState } from "../../types/types";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchUserProfile = createAsyncThunk(
  "user/fetchUserProfile",
  async (uid: string) => {
    const docRef = doc(db, "users", uid);
    const userSnap = await getDoc(docRef);

    if (!userSnap.exists()) {
      throw new Error("User Profile Not Found");
    }

    const data = userSnap.data();

    return {
      fullname: data.fullname ?? "",
      address: data.address ?? "",
      city: data.city ?? "",
      postalCode: data.postalCode ?? "",
      country: data.country ?? "",
      payment: data.payment ?? {
        cardLast4: "",
        expiryDate: "",
      },
    } satisfies UserProfile;
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    clearUserProfile(state) {
      state.profile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "failed to fetch user profile.";
      });
  },
});

export const { clearUserProfile } = userSlice.actions;
export default userSlice.reducer;
export const userInitialState: UserState = initialState;
