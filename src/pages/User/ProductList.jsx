import { useState } from "react";
import Product from "./Product";
import RecommendProduct from "./RecommendProduct";

export default function ProductPage() {
  const [page, setPage] = useState("recommend");

  return (
    <div>
      {/* ===== HEADER ===== */}
      <div style={styles.header}>
        <button
          style={{
            ...styles.btn,
            ...(page === "recommend" && styles.active),
          }}
          onClick={() => setPage("recommend")}
        >
          <i className="bi bi-stars" style={styles.icon}></i>
          Gợi ý cho bạn
        </button>

        <button
          style={{
            ...styles.btn,
            ...(page === "product" && styles.active),
          }}
          onClick={() => setPage("product")}
        >
          <i className="bi bi-grid-3x3-gap" style={styles.icon}></i>

          Danh sách sản phẩm
        </button>


      </div>

      {/* ===== CONTENT ===== */}
      <div style={styles.content}>
        {page === "recommend" && <RecommendProduct />}
        {page === "product" && <Product />}
      </div>
    </div>
  );
}
const styles = {
  header: {
    display: "flex",
    gap: 24,
    padding: "12px 16px",
    borderBottom: "1px solid #eaeaea",
    background: "#fff",
  },

  btn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: 15,
    color: "#555",
    paddingBottom: 6,
  },

  active: {
    color: "#1976d2",
    borderBottom: "2px solid #1976d2",
    fontWeight: 600,
  },

  icon: {
    fontSize: 16,
  },

  content: {
    padding: 16,
  },
};
