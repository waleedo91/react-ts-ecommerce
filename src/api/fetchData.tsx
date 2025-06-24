import axios from "axios";
import type {
  Product,
  LoginResponse,
  LoginCredentials,
  RegisterData,
} from "../types/types";

const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const fetchCategories = async (): Promise<string[]> => {
  const response = await apiClient.get("/products/categories");
  return response.data;
};

export const fetchProductByCategory = async (category: string) => {
  const response = await fetch(
    `https://fakestoreapi.com/products/category/${category}`
  );
  if (!response.ok) throw new Error("Failed to fetch Category");
  return response.json();
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get("/products");
  return response.data;
};

export const fetchSingleProduct = async (
  id: string | undefined
): Promise<Product> => {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
  );
  return response.data;
};

export const registerUser = async (userData: RegisterData) => {
  const response = await apiClient.post("/users", userData);
  return response.data;
};
