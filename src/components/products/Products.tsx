import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../api/fetchData";
import { type Product } from "../../types/types";
import { useSelector, useDispatch } from "react-redux";
import type { RootState, AppDispatch } from "../../store//store";
import { addToCart } from "../../store/feature/cartSlice";

import { Card, Button } from "react-bootstrap";
import "./Products.css";
import QuantityControls from "../quantityControls/QuantityControls";
// TODO: Update the product component to a card for each product with required information for the Products List Page.

const Products = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  if (isLoading) return <p>Loading Products....</p>;
  if (isError) return <p>No Products found</p>;

  return (
    <div>
      <h1 className="product-list-header">Products</h1>
      <div className="product-list">
        {data?.map((product) => {
          const cartItem = cartItems.find((item) => item.id === product.id);
          const quantity = cartItem?.quantity || 0;
          return (
            <Card
              key={product.id}
              style={{ width: "18rem" }}
              className="product-card"
            >
              <Card.Img
                variant="top"
                src={product.image}
                className="product-list-image"
              />
              <Card.Body className="card-body">
                <Card.Text className="product-list-title">
                  {product.title}
                </Card.Text>
                <Card.Text>${product.price}</Card.Text>
                <div className="button-wrapper">
                  {quantity === 0 ? (
                    <Button
                      variant="primary"
                      onClick={() => dispatch(addToCart(product))}
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <QuantityControls product={product} quantity={quantity} />
                  )}
                </div>
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Products;
