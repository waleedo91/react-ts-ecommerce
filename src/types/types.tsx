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
