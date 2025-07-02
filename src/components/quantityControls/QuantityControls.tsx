import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../store/store";
import { addToCart, decreaseQuantity } from "../../store/feature/cartSlice";
import { Button } from "react-bootstrap";
import { type Product } from "../../types/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

import "./QuantityControls.css";
import { useAppSelector } from "../../hooks/hooks";

type Props = {
  product: Product;
  quantity: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

const QuantityControls = ({
  product,
  quantity,
  onIncrease,
  onDecrease,
}: Props) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUserId = useAppSelector((state) => state.auth.uid);
  const handleDecrease = () => {
    dispatch(decreaseQuantity({ userId: currentUserId, id: product.id }));
    if (onDecrease) onDecrease();
  };

  const handleIncrease = () => {
    dispatch(addToCart({ userId: currentUserId, product }));
    if (onIncrease) onIncrease();
  };

  return (
    <div className="quantity-controls">
      <Button
        variant="outline-danger"
        onClick={handleDecrease}
        className="quantity-button"
      >
        {quantity === 1 ? <FontAwesomeIcon icon={faTrash} /> : "-"}
      </Button>
      <span>{quantity}</span>
      <Button
        variant="outline-success"
        onClick={handleIncrease}
        className="quantity-button"
      >
        +
      </Button>
    </div>
  );
};

export default QuantityControls;
