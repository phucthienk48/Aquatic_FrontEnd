// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatBox from "../pages/User/Tools/ChatBox"; // 👈 import

export default function UserLayout() {
  return (
    <div
      style={{
        background: "#f0f9ff",
        position: "relative"
      }}
    >
      <Header />

      <main
        className="container my-4"
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "20px",
        }}
      >
        <Outlet />
      </main>

      <Footer />

      {/*  Chatbox cố định góc phải */}
      <div
        style={{
          position: "fixed",
          bottom: "80px", // cách footer (tuỳ chỉnh)
          right: "20px",
          zIndex: 9999
        }}
      >
        <ChatBox />
      </div>
    </div>
  );
}