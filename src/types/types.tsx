import { Timestamp } from "firebase/firestore";

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
  city: string;
  postalCode: string;
  country: string;
  payment?: PaymentInfo;
}

export interface AuthState {
  uid: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: {
    username: string | null;
    fullname: string | null;
    phone?: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export interface UserProfile {
  fullname: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  payment?: {
    cardLast4: string;
    expiryDate: string;
  };
}

export interface UserState {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
}

export interface PaymentInfo {
  cardLast4: string;
  expiryDate: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullname: string;
  phone?: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface RegisterResponse {
  id: number;
  email: string;
  username: string;
}

export interface ShippingAddress {
  fullname: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface ShippingAddress {
  fullname: string;
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

export interface OrderPayload {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress;
  paymentDetails: PaymentDetails;
}

export interface OrderState {
  loading: boolean;
  error: string | null;
  success: boolean;
  lastOrderId: string | null;
}

export interface Order {
  id: string;
  createdAt: Timestamp;
  cartItems: CartItem[];
  shippingAddress: {
    address: string;
  };
  payment?: {
    cardLast4: string;
    expiryDate: string;
  };
}

export interface CartState {
  userId: string | null;
  items: CartItem[];
}
