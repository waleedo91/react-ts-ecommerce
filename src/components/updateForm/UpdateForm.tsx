import { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/feature/authSlice";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { type CartItem, type Order, type UserData } from "../../types/types";

import "./UpdateForm.css";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentInfo, setPaymentInfo] = useState<{
    cardLast4: string;
    expiryDate: string;
  }>({
    cardLast4: "",
    expiryDate: "",
  });
  const [fullCardNumber, setFullCardNumber] = useState("");
  const [cvv, setCvv] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      try {
        setLoading(true);
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data() as UserData;
          setUserData(data);

          if (data.payment) {
            setPaymentInfo({
              cardLast4: data.payment.cardLast4 || "",
              expiryDate: data.payment.expiryDate || "",
            });
          }
        } else {
          setError("User Data not found.");
        }

        const ordersRef = collection(
          db,
          "users",
          auth.currentUser.uid,
          "orders"
        );

        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const orderList: Order[] = snapshot.docs.map((doc) => {
          const data = doc.data();

          return {
            id: doc.id,
            createdAt: data.createdAt,
            cartItems: data.cartItems,
            shippingAddress: data.shippingAddress,
            payment: data.payment,
          };
        });
        setOrders(orderList);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!auth.currentUser || !userData) return;

    const cardLast4 = fullCardNumber
      ? fullCardNumber.slice(-4)
      : paymentInfo.cardLast4;

    try {
      setLoading(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        fullname: userData.fullname,
        phone: userData.phone,
        address: userData.address,
        city: userData.city,
        postalCode: userData.postalCode,
        country: userData.country,
        payment: {
          cardLast4,
          expiryDate: paymentInfo.expiryDate,
        },
      });
      setPaymentInfo({ cardLast4, expiryDate: paymentInfo.expiryDate });
      setFullCardNumber("");
      setCvv("");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!auth.currentUser) return;

    try {
      await deleteDoc(doc(db, "users", auth.currentUser.uid));
      await auth.currentUser.delete();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  //   TODO: Change to spinner later
  if (loading) return <p>Loading...</p>;
  if (!userData) return <Alert>User not found.</Alert>;

  return (
    <Container style={{ maxWidth: "600px" }}>
      <h2>Hello, {userData.fullname}</h2>
      {error && <Alert variant="danger">{error}</Alert>}

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={userData.fullname || ""}
            onChange={(e) =>
              setUserData({ ...userData, fullname: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" value={userData.email} disabled />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Phone</Form.Label>
          <Form.Control
            type="tel"
            value={userData.phone || ""}
            onChange={(e) =>
              setUserData({ ...userData, phone: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={userData.address || ""}
            onChange={(e) =>
              setUserData({ ...userData, address: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>City</Form.Label>
          <Form.Control
            type="text"
            value={userData.city || ""}
            onChange={(e) => setUserData({ ...userData, city: e.target.value })}
            disabled={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Zip</Form.Label>
          <Form.Control
            type="text"
            value={userData.postalCode || ""}
            onChange={(e) =>
              setUserData({ ...userData, postalCode: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Country</Form.Label>
          <Form.Control
            type="text"
            value={userData.country || ""}
            onChange={(e) =>
              setUserData({ ...userData, country: e.target.value })
            }
            disabled={!isEditing}
          />
        </Form.Group>
        <h4>Payment Information</h4>
        <Form.Group className="mb-3">
          <Form.Label>Card Number (Last 4 digits)</Form.Label>
          <Form.Control
            type="text"
            value={`**** **** **** ${paymentInfo.cardLast4}`}
            disabled
          />
        </Form.Group>
        {isEditing && (
          <Form.Group className="mb-3">
            <Form.Label>Full Card Number</Form.Label>
            <Form.Control
              type="text"
              name="fullCardNumber"
              maxLength={16}
              value={fullCardNumber}
              onChange={(e) => setFullCardNumber(e.target.value)}
              placeholder="Enter new card number"
            />
          </Form.Group>
        )}
        <Form.Group className="mb-3">
          <Form.Label>Card Last 4 Digits</Form.Label>
          <Form.Control
            type="text"
            name="cardLast4"
            maxLength={16}
            value={paymentInfo.cardLast4}
            onChange={handlePaymentChange}
            disabled={!isEditing}
            placeholder="****"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Expiry Date (MM/YY)</Form.Label>
          <Form.Control
            type="text"
            name="expiryDate"
            maxLength={5}
            value={paymentInfo.expiryDate}
            onChange={(e) =>
              setPaymentInfo((prev) => ({
                ...prev,
                expiryDate: e.target.value,
              }))
            }
            disabled={!isEditing}
            placeholder="MM/YY"
          />
        </Form.Group>
        {isEditing && (
          <Form.Group className="mb-3">
            <Form.Label>CVV</Form.Label>
            <Form.Control
              type="password"
              name="cvv"
              maxLength={4}
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
              placeholder="Enter CVV"
              autoComplete="off"
            />
          </Form.Group>
        )}
        <div className="update-button-group">
          {isEditing ? (
            <Button onClick={handleSave} className="me-2">
              Save
            </Button>
          ) : (
            <Button onClick={() => setIsEditing(true)} className="me-2">
              Edit
            </Button>
          )}

          <Button variant="danger" onClick={handleDelete}>
            Delete Account
          </Button>
        </div>
      </Form>

      <div className="mt-5">
        <h4>Past Orders</h4>
        {orders.length === 0 ? (
          <p>No past orders found.</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="mb-3 p-3 border rounded bg-light">
              <p>
                <strong>Date: </strong>{" "}
                {order.createdAt?.toDate
                  ? order.createdAt.toDate().toLocaleString()
                  : "Unknown"}
              </p>
              <p>
                <strong>Shipping:</strong> {order.shippingAddress?.address}
              </p>

              <p>
                <strong>Items:</strong>
              </p>
              <ul>
                {order.cartItems?.map((item: CartItem, idx: number) => (
                  <li key={idx}>
                    {item.title} - {item.quantity} x ${item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </Container>
  );
};

export default UserProfile;
