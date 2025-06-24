import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./feature/cartSlice";
import authReducer from "./feature/authSlice";
import orderReducer from "./feature/ordersSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
