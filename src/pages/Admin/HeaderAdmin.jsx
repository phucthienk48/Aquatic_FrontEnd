import { useNavigate } from "react-router-dom";

export default function HeaderAdmin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* LOGO */}
        <div style={styles.logo} onClick={() => navigate("/admin")}>
          Admin Dashboard
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          <span
            style={styles.user}
            onClick={() => navigate("/admin/profile")}
          >
            👤 {user?.username || user?.email}
          </span>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
const styles = {
  header: {
    background: "linear-gradient(90deg, #212529, #343a40)",
    padding: "14px 0",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,.2)",
  },

  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    fontSize: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },

  user: {
    cursor: "pointer",
    fontWeight: 500,
  },

  logoutBtn: {
    padding: "6px 12px",
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 500,
  },
};
