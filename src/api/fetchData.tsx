import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  where,
} from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { db, auth } from "../config/firebase";
import type {
  Product,
  LoginResponse,
  LoginCredentials,
  RegisterData,
} from "../types/types";

export const fetchProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, "products"));
  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Product, "id">;
    return { id: doc.id, ...data };
  });
};

export const fetchSingleProduct = async (
  id: string | undefined
): Promise<Product> => {
  if (!id) throw new Error("Product ID is required");

  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Product not found");
  }

  return { id: docSnap.id, ...(docSnap.data() as Omit<Product, "id">) };
};

export const fetchCategories = async (): Promise<string[]> => {
  const snapshot = await getDocs(collection(db, "products"));
  const categories = new Set<string>();

  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.category) categories.add(data.category);
  });

  return Array.from(categories);
};

export const fetchProductByCategory = async (
  category: string
): Promise<Product[]> => {
  const productsRef = collection(db, "products");
  const q = query(productsRef, where("category", "==", category));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data() as Omit<Product, "id">;
    return { id: doc.id, ...data };
  });
};

export const login = async (
  credentials: LoginCredentials
): Promise<LoginResponse> => {
  const { email, password } = credentials;

  const userCredentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const user = userCredentials.user;

  return {
    token: await user.getIdToken(),
    email: user.email ?? "",
    uid: user.uid,
  };
};

export const registerUser = async (userData: RegisterData) => {
  const { email, password, fullname, phone } = userData;

  const userCredentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredentials.user;

  await setDoc(doc(db, "users", user.uid), {
    email,
    fullname,
    phone: phone || null,
    createdAt: new Date().toISOString(),
  });

  return {
    uid: user.uid,
    email: user.email,
    fullname,
    phone,
  };
};
