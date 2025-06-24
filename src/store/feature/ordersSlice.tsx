import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type {
  CartItem,
  ShippingAddress,
  PaymentDetails,
} from "../../types/types";

interface OrderPayload {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
}

export const submitOrder = createAsyncThunk(
  "order/submitOrder",
  async (orderData: OrderPayload, { rejectWithValue }) => {
    try {
      // Replace this with your real API call:
      await new Promise((res) => setTimeout(res, 1500)); // mock delay

      // You could do:
      // const response = await apiClient.post('/orders', orderData);
      // return response.data;

      return { success: true };
    } catch (error) {
      console.error(error);
      return rejectWithValue("Failed to place order");
    }
  }
);

interface OrderState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: OrderState = {
  loading: false,
  error: null,
  success: false,
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
