import { renderWithProviders } from "../../test-utils";
import { screen, fireEvent } from "@testing-library/react";
import Products from "./Products";
import { vi } from "vitest";
import * as hooks from "../../hooks/hooks";
import * as reactQuery from "@tanstack/react-query";
import { type Product } from "../../types/types";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual<typeof import("@tanstack/react-query")>(
    "@tanstack/react-query"
  );
  return {
    ...actual,
    useQuery: vi.fn(), // now this can be mocked
  };
});

import { useQuery } from "@tanstack/react-query";

const mockProduct: Product = {
  id: "1",
  title: "Test Product",
  price: 19.99,
  image: "test.jpg",
  description: "Test description",
  category: "Test category",
};

describe("Products Component", () => {
  it("dispatches addToCart when 'Add to Cart' button is clicked", () => {
    const mockDispatch = vi.fn();

    // Mock hooks
    vi.spyOn(hooks, "useAppDispatch").mockReturnValue(mockDispatch);
    vi.spyOn(hooks, "useAppSelector").mockImplementation((selector: any) =>
      selector({
        auth: { isAuthenticated: true, uid: "123" },
        cart: { items: [] },
      })
    );

    // Mock React Query
    (useQuery as ReturnType<typeof vi.fn>).mockReturnValue({
      data: [mockProduct],
      isLoading: false,
      isError: false,
    });

    renderWithProviders(<Products />);

    const addButton = screen.getByText("Add to Cart");
    fireEvent.click(addButton);

    expect(mockDispatch).toHaveBeenCalled();
  });
});
