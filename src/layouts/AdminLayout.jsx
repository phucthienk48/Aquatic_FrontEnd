// src/layouts/AdminLayout.jsx
import { Outlet } from "react-router-dom";
import HeaderAdmin from "../pages/Admin/HeaderAdmin";

export default function AdminLayout() {
  return (
    <>
      <HeaderAdmin />
      <div className="admin-layout">

        <section>
          <Outlet />
        </section>
      </div>
    </>
  );
}
