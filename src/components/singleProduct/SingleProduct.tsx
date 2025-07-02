import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchSingleProduct } from "../../api/fetchData";
import type { Product, CartItemType } from "../../types/types";
import type { RootState } from "../../store/store";
import { addToCart } from "../../store/feature/cartSlice";
import QuantityControls from "../quantityControls/QuantityControls";
import { useAppSelector } from "../../hooks/hooks";

import "./SingleProduct.css";
import { Card, Alert, Spinner, Button } from "react-bootstrap";

const SingleProduct = () => {
  const { id } = useParams<{ id: string }>();
  const currentUserId = useAppSelector((state) => state.auth.uid);
  const dispatch = useDispatch();
  const {
    data: product,
    isLoading,
    isError,
  } = useQuery<Product, Error>({
    queryKey: ["product", id] as const,
    queryFn: () => fetchSingleProduct(id),
  });

  const cartItem = useSelector((state: RootState) =>
    state.cart.items.find((item: CartItemType) => item.id === product?.id)
  );

  const quantity = cartItem ? cartItem.quantity : 0;
  if (isLoading) return <Spinner animation="border" />;
  if (isError || !product)
    return <Alert variant="danger">Failed to load Product</Alert>;

  return (
    <div className="single-product">
      <Card className="product-image-container">
        <Card.Title>{product.title}</Card.Title>
        <Card.Img variant="top" src={product.image} className="product-image" />
      </Card>
      <Card className="product-info-container">
        <Card.Body>
          <Card.Text>{product.description}</Card.Text>
          <Card.Text>{product.category}</Card.Text>
          <Card.Text>${product.price.toFixed(2)}</Card.Text>

          <div className="button-wrapper">
            {quantity === 0 ? (
              <Button
                variant="primary"
                onClick={() =>
                  dispatch(addToCart({ userId: currentUserId, product }))
                }
              >
                Add to Cart
              </Button>
            ) : (
              <QuantityControls product={product} quantity={quantity} />
            )}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SingleProduct;
