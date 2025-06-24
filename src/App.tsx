import { Routes, Route } from "react-router-dom";

import ProductsList from "./pages/productsList/ProductsList";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";
import Cart from "./components/cart/Cart";
import Login from "./components/login/Login";
import FilteredProducts from "./components/filteredProducts/FilteredProducts";

import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductDisplay />} />
        <Route path="/cart" element={<Cart />} />
        <Route
          path="/products/category/:categoryName"
          element={<FilteredProducts />}
        />
        <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
