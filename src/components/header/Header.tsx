import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/hooks";

import Categories from "../categories/Categories";
import Apu from "../../images/apu.png";

import { Navbar, Container, Nav, NavDropdown, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";
import Logout from "../logout/Logout";

// TODO: Create link for categories that filter only products with that category.
// TODO: Update Welcome Shopper to a login and logout button as well as the logged in users name rather than shopper.
// TODO: update cart logo to show how many items are currently in users cart.

const Header = () => {
  const fullname = useAppSelector((state) => state.auth.fullname);
  const cartCount = useAppSelector((state) =>
    state.cart.items.reduce((sum, item) => sum + item.quantity, 0)
  );
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const username = useAppSelector((state) => state.auth.username);
  const uid = useAppSelector((state) => state.auth.uid);

  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand as={Link} to="/products" className="brand-flex">
          <img
            alt=""
            src={Apu}
            width="50"
            height="50"
            className="d-inline-block align-top apu-brand"
          />{" "}
          Quick-ee-Mart
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <Nav.Link as={Link} to="/products">
              Home
            </Nav.Link>

            <NavDropdown title="Categories" id="navbarScrollingDropdown">
              <Categories />
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {isAuthenticated ? (
              <div className="user-section">
                Hello, <Link to={`/user/${uid}`}>{fullname ?? username}</Link>
                <Logout />
                <Link to="/cart" className="cart-button">
                  <FontAwesomeIcon
                    className="shopping-cart"
                    icon={faShoppingCart}
                  />
                  {cartCount}
                </Link>
              </div>
            ) : (
              <Button>
                <Link to="/login" className="login-header-button">
                  Login
                </Link>
              </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
