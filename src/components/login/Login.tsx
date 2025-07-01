import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Alert, Container } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { loadUserCart, loginUser } from "../../store/feature/authSlice";

import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading, error, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/cart");
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const resultAction = await dispatch(loginUser({ username, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      const uid = resultAction.payload.uid;
      dispatch(loadUserCart(uid));
    }
  };

  if (isAuthenticated) return <p>You are Logged in!</p>;

  return (
    <Container className="login-container">
      <h2>Login</h2>
      {error && <Alert>{error}</Alert>}
      <Form onSubmit={handleSubmit} className="login-form">
        <Form.Group>
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            required
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
          />
        </Form.Group>
        <Button type="submit" className="login-button">
          {loading ? "Logging in..." : "Login"}
        </Button>
      </Form>
      <h6>
        Need an account? <Link to="/register">Register Here!</Link>
      </h6>
    </Container>
  );
};

export default Login;
