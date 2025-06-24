export interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
}

export type CartItemType = {
  id: number;
  quantity: number;
};

export interface LoginResponse {
  token: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  username: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}
