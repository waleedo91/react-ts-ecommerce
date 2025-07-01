import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../../api/fetchData";
import { type Product } from "../../types/types";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import type { RootState } from "../../store//store";
import { addToCart } from "../../store/feature/cartSlice";
import { Link } from "react-router-dom";

import { Card, Button } from "react-bootstrap";
import "./Products.css";
import QuantityControls from "../quantityControls/QuantityControls";
// TODO: Update the product component to a card for each product with required information for the Products List Page.

const Products = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const currentUserId = useAppSelector((state) => state.auth.uid);

  const { data, isLoading, isError } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: fetchProducts,
  });

  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

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
              <Link to={`/products/${product.id}`}>
                <Card.Img
                  variant="top"
                  src={product.image}
                  className="product-list-image"
                />
              </Link>
              <Card.Body className="card-body">
                <Card.Text className="product-list-title">
                  {product.title}
                </Card.Text>
                <Card.Text>${product.price.toFixed(2)}</Card.Text>
                <div className="button-wrapper">
                  {!isAuthenticated ? (
                    <>
                      <Link to="/login">
                        <Button>Login</Button>
                      </Link>
                    </>
                  ) : (
                    <div className="button-wrapper">
                      {quantity === 0 ? (
                        <Button
                          variant="primary"
                          onClick={() =>
                            dispatch(
                              addToCart({ userId: currentUserId, product })
                            )
                          }
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <QuantityControls
                          product={product}
                          quantity={quantity}
                        />
                      )}
                    </div>
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
