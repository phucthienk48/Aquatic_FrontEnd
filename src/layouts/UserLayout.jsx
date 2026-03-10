// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function UserLayout() {
  return (
    <div
      style={{
        // backgroundImage: "url('/data/nen02.jpg')",
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        // minHeight: "100vh",
        background: "#f0f9ff",
      }}
    >
      <Header />

      <main className="container my-4"
        style={{
          background: "#fff",
          borderRadius: "8px",
          padding: "20px",
        }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
