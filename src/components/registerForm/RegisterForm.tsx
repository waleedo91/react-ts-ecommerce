import React, { useState, type FormEvent } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { registerUser } from "../../store/feature/authSlice";
import { Link, useNavigate } from "react-router-dom";
import type { RootState } from "../../store/store";
import type { RegisterData } from "../../types/types";
import { loginUser } from "../../store/feature/authSlice";

import "./RegisterForm.css";

import { Container, Form, Button, Alert } from "react-bootstrap";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const registerData: RegisterData = { email, username, password };

    const registerResult = await dispatch(registerUser(registerData));

    if (registerUser.fulfilled.match(registerResult)) {
      const loginResult = await dispatch(loginUser({ username, password }));

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
      <Form onSubmit={handleSubmit} className="register-form">
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
