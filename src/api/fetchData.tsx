import axios from "axios";
import { type Product } from "../types/types";

const apiClient = axios.create({
  baseURL: "https://fakestoreapi.com",
});

export const fetchCategories = async (): Promise<string[]> => {
  const response = await apiClient.get("/products/categories");
  return response.data;
};

export const fetchProducts = async (): Promise<Product[]> => {
  const response = await apiClient.get("/products");
  return response.data;
};
