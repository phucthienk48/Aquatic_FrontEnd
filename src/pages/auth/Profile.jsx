import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      // ❌ Chưa đăng nhập → quay về login
      navigate("/login");
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>👤 Thông tin cá nhân</h2>

        <div style={styles.row}>
          <span style={styles.label}>Tên người dùng:</span>
          <span>{user.username || "Chưa cập nhật"}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Email:</span>
          <span>{user.email}</span>
        </div>

        <div style={styles.row}>
          <span style={styles.label}>Password:</span>
          <span>{user.password || "user"}</span>
        </div>

        <button
          style={styles.backBtn}
          onClick={() => navigate("/")}
        >
          ⬅ Quay về trang chủ
        </button>
      </div>
    </div>
  );
}
const styles = {
  container: {
    minHeight: "80vh",
    background: "#f1f5f9",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#0d6efd",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "15px",
  },

  label: {
    fontWeight: "600",
    color: "#555",
  },

  backBtn: {
    marginTop: "20px",
    width: "100%",
    padding: "10px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
  },
};
