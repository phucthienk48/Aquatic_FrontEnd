import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🔁 Lấy user từ localStorage khi load Header
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // 🚪 Đăng xuất
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        {/* LOGO */}
        <div style={styles.logo} onClick={() => navigate("/")}>
          <img
            src="/data/logo.jpg"
            alt="Aquatic Shop Logo"
            style={styles.logoImg}
          />
          <span>Aquatic Shop</span>
        </div>


        {/* MENU */}
        <nav style={styles.nav}>
          <span style={styles.link} onClick={() => navigate("/")}>Trang chủ</span>
          <span style={styles.link} onClick={() => navigate("/product")}>Sản phẩm</span>
          <span style={styles.link} onClick={() => navigate("/knowledge")}>Kiến thức nuôi cá</span>
          <span style={styles.link} onClick={() => navigate("/contact")}>Liên hệ</span>
          <span style={styles.link} onClick={() => navigate("/orders")}>Đơn hàng</span>
          <span style={styles.link} onClick={() => navigate("/live")}>Phòng live</span>
        </nav>

        {/* ACTIONS */}
        <div style={styles.actions}>
          <span style={styles.cart} onClick={() => navigate("/cart")}>
            🛒 Giỏ hàng
          </span>

          {/* ❌ CHƯA ĐĂNG NHẬP */}
          {!user && (
            <>
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
            </>
          )}

          {/* ✅ ĐÃ ĐĂNG NHẬP */}
          {user && (
            <>
              <span
                style={styles.user}
                onClick={() => navigate("/profile")}
              >
                👤 {user.username || user.email}
              </span>

              <button
                style={styles.logoutBtn}
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </>
          )}
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
  user: {
  fontWeight: "600",
  cursor: "pointer",
  marginRight: "6px",
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
logo: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "18px",
  fontWeight: "bold",
  cursor: "pointer",
},

logoImg: {
  width: "32px",
  height: "32px",
  objectFit: "cover",
  borderRadius: "50%", // bo tròn logo
},


};
