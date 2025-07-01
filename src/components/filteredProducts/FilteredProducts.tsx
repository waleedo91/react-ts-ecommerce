import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProductByCategory } from "../../api/fetchData";
import { type Product } from "../../types/types";
import QuantityControls from "../quantityControls/QuantityControls";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { addToCart } from "../../store/feature/cartSlice";

import { Card, Container, Button } from "react-bootstrap";
import { type RootState } from "../../store/store";

import "./FilteredProducts.css";

const FilteredProducts = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const currentUserId = useAppSelector((state) => state.auth.uid);

  const { categoryName } = useParams();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const {
    data: products = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["products", categoryName],
    queryFn: () => {
      if (!categoryName) throw new Error("Category is undefined");
      return fetchProductByCategory(categoryName);
    },
    enabled: !!categoryName,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading products</p>;

  return (
    <Container>
      <h2 className="mb-4 text-capitalize">{categoryName} Products</h2>

      <div className="filtered-list">
        {products.map((product: Product) => {
          const cartItem = cartItems?.find((item) => item.id === product.id);
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
                      <QuantityControls product={product} quantity={quantity} />
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </div>
    </Container>
  );
};

export default FilteredProducts;
