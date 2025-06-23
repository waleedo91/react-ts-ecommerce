import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";
import { addToCart, decreaseQuantity } from "../../store/feature/cartSlice";
import { Button } from "react-bootstrap";
import { type Product } from "../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import "./QuantityControls.css";

type Props = {
  product: Product;
  quantity: number;
};

const QuantityControls = ({ product, quantity }: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  return (
    <div className="quantity-controls">
      <Button
        variant="outline-danger"
        onClick={() => dispatch(decreaseQuantity(product.id))}
        className="quantity-button"
      >
        {quantity === 1 ? <FontAwesomeIcon icon={faTrash} /> : "-"}
      </Button>
      <span>{quantity}</span>
      <Button
        variant="outline-success"
        onClick={() => dispatch(addToCart(product))}
        className="quantity-button"
      >
        +
      </Button>
    </div>
  );
};

export default QuantityControls;
