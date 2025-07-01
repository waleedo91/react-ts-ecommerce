import { useState, useEffect } from "react";
import { useAppDispatch } from "../../hooks/hooks";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/feature/authSlice";
import { Container, Form, Button, Alert } from "react-bootstrap";
import { type UserData } from "../../types/types";

import "./UpdateForm.css";

const UserProfile = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      try {
        setLoading(true);
        const docRef = doc(db, "users", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data() as UserData);
        } else {
          setError("User Data not found.");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    if (!auth.currentUser || !userData) return;

    try {
      setLoading(true);
      const userRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(userRef, {
        fullname: userData.fullname,
        phone: userData.phone,
        address: userData.address,
      });
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
    </Container>
  );
};

export default UserProfile;
