// src/layouts/UserLayout.jsx
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
// import ChatBot from "../components/chatbot/ChatBot";

export default function UserLayout() {
  return (
    <>
      <Header />
      <main className="container my-4">
        <Outlet />
      </main>
      {/* <ChatBot /> */}
      <Footer />
    </>
  );
}
