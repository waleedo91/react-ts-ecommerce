import React from "react";
import { Provider } from "react-redux";
import { configureStore, type EnhancedStore } from "@reduxjs/toolkit";
import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import authReducer from "./store/feature/authSlice";
import cartReducer from "./store/feature/cartSlice";
import orderReducer from "./store/feature/ordersSlice";
import userReducer from "./store/feature/userSlice";

import type { RootState } from "./store/store";

interface ExtendedRenderOptions extends Omit<RenderOptions, "queries"> {
  preloadedState?: Partial<RootState>;
  store?: EnhancedStore;
}

export function renderWithProviders(
  ui: React.ReactElement,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        user: userReducer,
      },
      preloadedState: preloadedState as RootState,
    }),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children?: React.ReactNode }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
