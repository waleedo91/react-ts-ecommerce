import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { type RootState } from "../../store/store"; // your store root type
import { submitOrder, resetOrder } from "../../store/feature/ordersSlice";
import { clearCart } from "../../store/feature/cartSlice"; // your cart slice
import { Container, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { fetchUserProfile } from "../../store/feature/userSlice";

const Checkout = () => {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector((state: RootState) => state.cart.items);
  const currentUserId = useAppSelector((state) => state.auth.uid);
  const { loading, error, success } = useAppSelector(
    (state: RootState) => state.order
  );
  const userData = useAppSelector((state: RootState) => state.user.profile)!;

  const [shippingAddress, setShippingAddress] = useState({
    fullname: "",
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

  useEffect(() => {
    const fetchProfile = async () => {
      const { currentUser } = getAuth();
      if (currentUser) {
        await dispatch(fetchUserProfile(currentUser.uid));
      }
    };
    if (!userData) {
      fetchProfile();
    }
  }, [dispatch, userData]);

  useEffect(() => {
    if (userData) {
      console.log("user", userData);
      setShippingAddress({
        fullname: userData.fullname || "",
        address: userData.address || "",
        city: userData.city || "",
        postalCode: userData.postalCode || "",
        country: userData.country || "",
      });
      setPaymentDetails({
        cardNumber: "**** **** **** " + userData.payment?.cardLast4,
        expiryDate: userData.payment?.expiryDate || "",
        cvv: "",
      });
    }
  }, [userData]);

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

    const sanitizedPayment = {
      cardNumber: paymentDetails.cardNumber.slice(-4),
      expiryDate: paymentDetails.expiryDate,
      cvv: paymentDetails.cvv,
    };

    const transformedCartItems = cartItems.map((item) => ({
      id: item.id,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image: item.image,
      category: item.category,
      description: item.description,
    }));

    await dispatch(
      submitOrder({
        cartItems: transformedCartItems,
        shippingAddress,
        paymentDetails: sanitizedPayment,
      })
    );

    if (!error) {
      dispatch(clearCart({ userId: currentUserId }));
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
            name="fullname"
            value={shippingAddress.fullname}
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
            placeholder="Enter Card Number"
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
            type="password"
            name="cvv"
            value={paymentDetails.cvv}
            onChange={handlePaymentChange}
            required
            maxLength={4}
            placeholder="Enter CVV"
            autoComplete="off"
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
