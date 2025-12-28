// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside>MENU ADMIN</aside>
      <section>
        <Outlet />
      </section>
    </div>
  );
}
