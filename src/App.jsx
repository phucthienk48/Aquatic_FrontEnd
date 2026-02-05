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
import LiveRoom from "./pages/User/LiveRoom";
import ProductList from "./pages/User/ProductList";
import RecommendProduct from "./pages/User/RecommendProduct"

import Dashboard from "./pages/Admin/Dashboard";
import AdminProfile from "./pages/auth/AdminProfile"
import UserManagement from "./pages/Admin/UserManagement";
import AdminOrders from "./pages/Admin/AdminOrders";
import AdminProduct from "./pages/Admin/AdminProduct";
import ShopAdmin from "./pages/Admin/ShopAdmin";
import AdminContact from "./pages/Admin/AdminContact";
import AdminLive from "./pages/Admin/AdminLive";
import AdminComment from "./pages/Admin/AdminComment";
import AdminKnowledge from "./pages/Admin/AdminKnowledge";
import AdminReport from "./pages/Admin/AdminReport";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* USER */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Product />} />
          <Route path="/product" element={<ProductList />} />
          <Route path="/recommened" element={<RecommendProduct />} />
          
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

          <Route path="/live" element={<LiveRoom />} /> 
        </Route>

        {/* AUTH */}


        {/* ADMIN */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<ShopAdmin />} />
          <Route path="/admin/profile" element={<AdminProfile />} />
          <Route path="/admin/contact" element={<AdminContact />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProduct />} />
          
          <Route path="/admin/live" element={<AdminLive />} />
          <Route path="/admin/comment" element={<AdminComment />} />
          <Route path="/admin/knowledge" element={<AdminKnowledge />} />
          <Route path="/admin/reports" element={<AdminReport />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;
