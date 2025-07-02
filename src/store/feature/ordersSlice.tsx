import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import type { OrderPayload, OrderState } from "../../types/types";
import { type RootState } from "../store";

export const submitOrder = createAsyncThunk<
  { success: boolean },
  OrderPayload,
  { state: RootState; rejectValue: string }
>("order/submitOrder", async (orderData, { getState, rejectWithValue }) => {
  try {
    const uid = getState().auth.uid;
    if (!uid) {
      return rejectWithValue("User not logged in.");
    }
    const orderRef = collection(db, "users", uid, "orders");

    const maskedPayment = {
      cardLast4: orderData.paymentDetails.cardNumber.slice(-4),
      expiryDate: orderData.paymentDetails.expiryDate,
    };

    const docRef = await addDoc(orderRef, {
      cartItems: orderData.cartItems,
      shippingAddress: orderData.shippingAddress,
      payment: maskedPayment,
      createdAt: serverTimestamp(),
    });

    return { success: true, orderId: docRef.id };
  } catch (error) {
    console.error(error);
    return rejectWithValue("Failed to place order");
  }
});

const initialState: OrderState = {
  loading: false,
  error: null,
  success: false,
  lastOrderId: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOrder.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetOrder } = orderSlice.actions;
export default orderSlice.reducer;
export const orderInitialState: OrderState = initialState;
