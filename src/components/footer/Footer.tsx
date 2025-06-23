import { Navbar, Container } from "react-bootstrap";

const Footer = () => {
  return (
    <div>
      <Navbar className="bg-body-tertiary" sticky="bottom" data-bs-theme="dark">
        <Container>
          <Navbar.Brand href="#home">Quick-ee-Mart</Navbar.Brand>
        </Container>
      </Navbar>
    </div>
  );
};

export default Footer;
