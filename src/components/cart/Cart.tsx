import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { clearCart } from "../../store/feature/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import QuantityControls from "../quantityControls/QuantityControls";

import "./Cart.css";
import { Card } from "react-bootstrap";

const Cart = () => {
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
                <div className='cart-control'>
                  <QuantityControls quantity={item.quantity} product={item} />
                </div>
              </Card>
            ))}
          </div>
          <div className="cart-total">
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
