import { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { registerUser, loginUser } from "../../store/feature/authSlice";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import type { RegisterData } from "../../types/types";

import "./RegisterForm.css";

import { Container, Form, Button, Alert } from "react-bootstrap";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const registerData: RegisterData = {
      email,
      password,
      fullname: fullname,
      phone,
      address,
    };

    const registerResult = await dispatch(registerUser(registerData));

    if (registerUser.fulfilled.match(registerResult)) {
      const loginResult = await dispatch(
        loginUser({ username: email, password })
      );

      if (loginUser.fulfilled.match(loginResult) && loginResult.payload) {
        localStorage.setItem("token", loginResult.payload.token);
        navigate("/products");
      } else {
        console.error("Auto-login failed after registration.");
      }
    } else {
      console.error("Registration failed.");
    }
  };

  return (
    <Container className="register-container" style={{ maxWidth: "500px" }}>
      <h2>Register</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Alert variant="info">Registering...</Alert>}
      <Form onSubmit={handleSubmit} className="register-form">
        <Form.Group className="mb-3">
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            disabled={loading}
            required
            placeholder="Enter your full name"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
            placeholder="Enter email"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
            placeholder="Enter username"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={loading}
            required
            placeholder="Enter your phone number"
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            placeholder="Enter address"
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            placeholder="Enter password"
          />
        </Form.Group>
        <Button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </Button>
      </Form>

      <h6 className="mt-3">
        Already have an account? <Link to="/login">Login Here!</Link>
      </h6>
    </Container>
  );
};

export default RegisterForm;
