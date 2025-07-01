export interface Product {
  id: string;
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
  email: string;
  uid: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UserData {
  fullname: string;
  email: string;
  phone: string;
  address: string;
}

export interface AuthState {
  uid: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  username: string | null;
  fullname: string | null;
  phone?: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullname: string;
  phone?: string;
  address: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
}
