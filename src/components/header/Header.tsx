import { Link } from "react-router-dom";

import Categories from "../categories/Categories";
import Apu from "../../images/apu.png";

import {
  Navbar,
  Container,
  Nav,
  NavDropdown,
  Button,
  Form,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import "./Header.css";

// TODO: Create link for categories that filter only products with that category.
// TODO: Update Welcome Shopper to a login and logout button as well as the logged in users name rather than shopper.
// TODO: update cart logo to show how many items are currently in users cart.

const Header = () => {
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
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Search"
              className="me-2 search-input"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Welcome, <strong style={{ color: "white" }}>Shopper</strong>
          </Navbar.Text>
          <FontAwesomeIcon className="shopping-cart" icon={faShoppingCart} />
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
