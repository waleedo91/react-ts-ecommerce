import { Routes, Route } from "react-router-dom";

import ProductsList from "./pages/productsList/ProductsList";
import ProductDisplay from "./pages/productDisplay/ProductDisplay";
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

import "./App.css";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/products" element={<ProductsList />} />
        <Route path="/products/:id" element={<ProductDisplay />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
