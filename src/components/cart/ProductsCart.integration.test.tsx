import { describe, it, expect, vi } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderWithProviders } from "../../test-utils";
import { configureStore } from "@reduxjs/toolkit";
import authReducer, { authInitialState } from "../../store/feature/authSlice";
import cartReducer, { cartInitialState } from "../../store/feature/cartSlice";
import orderReducer, {
  orderInitialState,
} from "../../store/feature/ordersSlice";
import userReducer, { userInitialState } from "../../store/feature/userSlice";
import { Provider } from "react-redux";
import Products from "../products/Products";
import Cart from "../cart/Cart";

vi.mock("../../api/fetchData", () => ({
  fetchProducts: vi.fn(() =>
    Promise.resolve([
      {
        id: "1",
        title: "Test Product",
        price: 19.99,
        image: "https://via.placeholder.com/150",
      },
    ])
  ),
}));

const queryClient = new QueryClient();

function renderWithProvidersAndQueryClient(
  ui: React.ReactElement,
  store: ReturnType<typeof configureStore>
) {
  return renderWithProviders(
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>{ui}</Provider>
    </QueryClientProvider>
  );
}

describe("Integration: Products and Cart", () => {
  it("updates the cart when 'Add to Cart' button is clicked", async () => {
    // Create store with initial state
    const store = configureStore({
      reducer: {
        auth: authReducer,
        cart: cartReducer,
        order: orderReducer,
        user: userReducer,
      },
      preloadedState: {
        auth: { ...authInitialState, uid: "user123", isAuthenticated: true },
        cart: { ...cartInitialState, items: [] },
        order: { ...orderInitialState },
        user: { ...userInitialState },
      },
    });

    // Render Products with the shared store
    renderWithProvidersAndQueryClient(<Products />, store);

    // Wait for product to appear
    await waitFor(() =>
      expect(screen.getByText("Test Product")).toBeInTheDocument()
    );

    // Click 'Add to Cart'
    fireEvent.click(screen.getByText("Add to Cart"));

    // Render Cart with the same store (should reflect updated cart)
    renderWithProvidersAndQueryClient(<Cart />, store);

    // Wait for the cart header
    await waitFor(() =>
      expect(screen.getByText("Your Cart")).toBeInTheDocument()
    );

    // Check that the product is in the cart
    const products = screen.getAllByText("Test Product");
    expect(products[0]).toBeInTheDocument();

    // Optionally check that quantity and price display correctly
    const priceElements = screen.getAllByText("$19.99");
    expect(priceElements[0]).toBeInTheDocument();
  });
});
