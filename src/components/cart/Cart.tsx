import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { clearCart } from "../../store/feature/cartSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import QuantityControls from "../quantityControls/QuantityControls";

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
        <>
          {cartItems.map((item) => (
            <div key={item.id}>
              <img src={item.image} />
              <h4>{item.title}</h4>
              <QuantityControls quantity={item.quantity} product={item} />
            </div>
          ))}
          <div>
            <h3>Total: ${totalPrice.toFixed(2)}</h3>
            <button onClick={() => dispatch(clearCart())}>Clear Cart</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
