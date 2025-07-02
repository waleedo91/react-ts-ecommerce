import { screen } from "@testing-library/react";
import Header from "./Header";
import { renderWithProviders } from "../../test-utils";

test("renders header text", () => {
  const preloadedState = {
    auth: {
      user: {
        username: null,
        fullname: "Test User",
        address: "123 Test St",
        city: "Test City",
        postalCode: "12345",
        country: "Testland",
      },
      uid: "123",
      loading: false,
      error: null,
      isAuthenticated: true,
    },
    cart: { userId: null, items: [] },
    order: {
      loading: false,
      error: null,
      success: false,
      lastOrderId: null,
    },
    user: {
      profile: null,
      loading: false,
      error: null,
    },
  };

  renderWithProviders(<Header />, { preloadedState });
  expect(screen.getByText(/Test User/i)).toBeInTheDocument();
});
