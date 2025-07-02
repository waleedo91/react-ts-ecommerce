import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { clearCart } from "../../store/feature/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import QuantityControls from "../quantityControls/QuantityControls";
import { Link } from "react-router-dom";

import "./Cart.css";
import { Card, Button } from "react-bootstrap";
import type { Product } from "../../types/types";

const Cart = () => {
  const currentUserId = useAppSelector((state) => state.auth.uid);
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state) => state.cart.items);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div>
      <h2>
        <FontAwesomeIcon icon={faShoppingCart} />
        Your Cart
      </h2>

      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <div className="cart-container">
          <div className="cart-item">
            {cartItems.map((item) => (
              <Card key={item.id} className="cart-item-card">
                <Card.Img src={item.image} className="cart-item-image" />
                <h4>{item.title}</h4>
                <div className="cart-control">
                  <QuantityControls
                    quantity={item.quantity}
                    product={item as Product}
                  />
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </Card>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <Button
              variant="danger"
              onClick={() => dispatch(clearCart({ userId: currentUserId }))}
            >
              Clear Cart
            </Button>
            <Link to="/cart/checkout">
              <Button>Checkout</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
