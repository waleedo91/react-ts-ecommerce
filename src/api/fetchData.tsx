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

export const fetchSingleProduct = async (
  id: string | undefined
): Promise<Product> => {
  const res = await fetch(`https://fakestoreapi.com/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};

