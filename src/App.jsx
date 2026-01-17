// src/App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/User/Home";
import Product from "./pages/User/Product";
import Cart from "./pages/User/Cart";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/auth/Profile";

import Contact from "./pages/User/Contact";
import KnowledgeList from "./pages/User/KnowledgeList";
import KnowledgeDetail from "./pages/User/KnowledgeDetail";
import ProductDetail from "./pages/User/ProductDetail";
import Checkout from "./pages/User/Checkout";
import Orders from "./pages/User/Orders";

import Dashboard from "./pages/Admin/Dashboard";
import HomeAdmin from "./pages/Admin/HomeAdmin";
import UserManagement from "./pages/Admin/UserManagement";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProduct from "./pages/Admin/AdminProduct";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          
        <Route path="/knowledge" element={<KnowledgeList />} />
        <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders" element={<Orders />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
           <Route path="/profile" element={<Profile />} />
        </Route>

        {/* AUTH */}


        {/* ADMIN */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<HomeAdmin />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProduct />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
