// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/user/Home";
import Product from "./pages/User/Product";
// import Cart from "./pages/user/Cart";
import Login from "./pages/auth/Login";
import Contact from "./pages/User/Contact";
import FishKnowledge from "./pages/User/FishKnowledge";
import ProductDetail from "./pages/User/ProductDetail";

import Dashboard from "./pages/admin/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          
          <Route path="/fishknowledge" element={<FishKnowledge />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          {/* <Route path="/cart" element={<Cart />} /> */}
          <Route path="/contact" element={<Contact />} />

        </Route>

        {/* AUTH */}
        <Route path="/login" element={<Login />} />

        {/* ADMIN */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Dashboard />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
