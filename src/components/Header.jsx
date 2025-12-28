import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* LOGO */}
        <div style={styles.logo} onClick={() => navigate("/")}>
          🐠 Aquatic Shop
        </div>

        {/* MENU */}
        <nav style={styles.nav}>
          <span style={styles.link} onClick={() => navigate("/")}>
            Trang chủ
          </span>
          <span style={styles.link} onClick={() => navigate("/product")}>
            Sản phẩm
          </span>
          <span style={styles.link} onClick={() => navigate("/fishknowledge")}>
            Kiến thức nuôi cá
          </span>
          <span style={styles.link} onClick={() => navigate("/contact")}>
            Liên hệ
          </span>
        </nav>

        {/* ACTIONS */}
        <div style={styles.actions}>
          <span style={styles.cart} onClick={() => navigate("/cart")}>
            🛒 Giỏ hàng
          </span>

          <button
            style={styles.loginBtn}
            onClick={() => navigate("/login")}
          >
            Đăng nhập
          </button>

          <button
            style={styles.registerBtn}
            onClick={() => navigate("/register")}
          >
            Đăng ký
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    background: "linear-gradient(90deg, #0d6efd, #0b5ed7)",
    padding: "14px 0",
    color: "#fff",
    boxShadow: "0 2px 6px rgba(0,0,0,.15)",
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
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
    userSelect: "none",
  },

  nav: {
    display: "flex",
    gap: "25px",
  },

  link: {
    cursor: "pointer",
    fontWeight: 500,
    transition: "opacity 0.2s",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  cart: {
    cursor: "pointer",
    fontWeight: 500,
    marginRight: "6px",
  },

  loginBtn: {
    padding: "6px 12px",
    background: "#fff",
    color: "#0d6efd",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 500,
  },

  registerBtn: {
    padding: "6px 12px",
    background: "#ffc107",
    color: "#000",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: 500,
  },
};
