import { Routes, Route } from "react-router-dom";

import ProductsList from "./pages/productsList/ProductsList";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Cart from "./components/cart/Cart";
import Login from "./components/login/Login";
import FilteredProducts from "./components/filteredProducts/FilteredProducts";
import RegisterForm from "./components/registerForm/RegisterForm";
import Checkout from "./components/checkout/Checkout";

import "./App.css";
import UserDisplay from "./pages/userDisplay/UserDisplay";

function App() {
  return (
    <div className="page-container">
      <Header />
      <main className="content-wrapper">
        <Routes>
          <Route path="/products" element={<ProductsList />} />
          <Route path="/products/:id" element={<ProductDisplay />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/products/category/:categoryName"
            element={<FilteredProducts />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/cart/checkout" element={<Checkout />} />
          <Route path="/user/:id" element={<UserDisplay />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
