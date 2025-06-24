import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { type RootState } from "../../store/store"; // your store root type
import { submitOrder, resetOrder } from "../../store/feature/ordersSlice";
import { clearCart } from "../../store/feature/cartSlice"; // your cart slice
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const { loading, error, success } = useAppSelector(
    (state: RootState) => state.order
  );

  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShippingAddress({ ...shippingAddress, [e.target.name]: e.target.value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    await dispatch(submitOrder({ cartItems, shippingAddress, paymentDetails }));

    if (!error) {
      dispatch(clearCart());
    }
  };

  if (success) {
    return (
      <Container className="mt-5">
        <h2>Thank you for your purchase!</h2>
        <Link to="/products">
          <Button variant="primary" onClick={() => dispatch(resetOrder())}>
            Back to shopping
          </Button>
        </Link>
      </Container>
    );
  }

  const cartTotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <Container className="mt-5" style={{ maxWidth: "600px" }}>
      <h2>Checkout</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <h4>Shipping Address</h4>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            name="fullName"
            value={shippingAddress.fullName}
            onChange={handleShippingChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Address</Form.Label>
          <Form.Control
            name="address"
            value={shippingAddress.address}
            onChange={handleShippingChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>City</Form.Label>
          <Form.Control
            name="city"
            value={shippingAddress.city}
            onChange={handleShippingChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Postal Code</Form.Label>
          <Form.Control
            name="postalCode"
            value={shippingAddress.postalCode}
            onChange={handleShippingChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Country</Form.Label>
          <Form.Control
            name="country"
            value={shippingAddress.country}
            onChange={handleShippingChange}
            required
          />
        </Form.Group>

        <h4>Payment Details</h4>
        <Form.Group className="mb-3">
          <Form.Label>Card Number</Form.Label>
          <Form.Control
            name="cardNumber"
            value={paymentDetails.cardNumber}
            onChange={handlePaymentChange}
            required
            maxLength={16}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Expiry Date</Form.Label>
          <Form.Control
            name="expiryDate"
            value={paymentDetails.expiryDate}
            onChange={handlePaymentChange}
            required
            placeholder="MM/YY"
            maxLength={5}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>CVV</Form.Label>
          <Form.Control
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handlePaymentChange}
            required
            maxLength={4}
          />
        </Form.Group>

        <h4>Order Summary</h4>
        <p>Total: ${cartTotal.toFixed(2)}</p>

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Place Order"}
        </Button>
      </Form>
    </Container>
  );
};

export default Checkout;
