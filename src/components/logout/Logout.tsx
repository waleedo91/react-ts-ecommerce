import { useNavigate } from "react-router-dom";

import { Button } from "react-bootstrap";
import { useAppDispatch } from "../../hooks/hooks";
import { logout } from "../../store/feature/authSlice";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/products");
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
