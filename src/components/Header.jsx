import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchProduct from "../pages/User/Tools/SearchProduct";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  /*  LOAD USER */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const userId = parsedUser._id || parsedUser.id;
      if (userId) fetchCartCount(userId);
    }
  }, []);

  /*  RESPONSIVE */
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };
  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      if (!res.ok) return;

      const cart = await res.json();

      // Giả sử cấu trúc: cart.items = [{ quantity }]
      const total =
        cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

      setCartCount(total);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };
  

  return (
    <header style={styles.header}>
      <div style={styles.topHeader}>
        <div
          style={{
            ...styles.container,
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? "10px" : 0,
          }}
        >
          {/* LOGO */}
          <div style={styles.logo} onClick={() => navigate("/")}>
            <img
              src="/data/logo.jpg"
              alt="Aquatic Shop Logo"
              style={{
                ...styles.logoImg,
                width: isMobile ? "55px" : "90px",
                height: isMobile ? "55px" : "90px",
              }}
            />
            <span style={styles.shopName}>PHÚC LONG AQUATIC</span>

          </div>

          {/* SEARCH */}
          {/* <div
            style={{
              ...styles.searchBox,
              width: isMobile ? "100%" : "380px",
            }}
          >
            <input
              style={styles.searchInput}
              placeholder="Tìm kiếm sản phẩm..."
            />
            <button style={styles.searchBtn}>
              <i className="bi bi-search"></i>
            </button>
          </div> */}
          {/* SEARCH */}
          <SearchProduct isMobile={isMobile} />


          {/* SUPPORT – ẨN MOBILE */}
          {!isMobile && (
            <div style={styles.support}>
              <i className="bi bi-telephone-fill"></i>
              <div>
                <div style={styles.supportText}>Hỗ Trợ Khách Hàng</div>
                <strong>0397 960 604</strong>
              </div>
            </div>
          )}

          {/* ACTIONS */}
          <div style={styles.actions}>
            <span style={styles.cart} onClick={() => navigate("/cart")}>
              <i className="bi bi-bag-fill" style={styles.cartIcon}></i>
              Giỏ hàng
              {cartCount > 0 && (
                <span style={styles.cartBadge}>{cartCount}</span>
              )}
            </span>

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

            {user && (
              <>
                <span
                  style={styles.user}
                  onClick={() => navigate("/profile")}
                >
                  <i
                    className="bi bi-person-circle"
                    style={styles.userIcon}
                  ></i>
                  {user.username || user.email}
                </span>
                <button style={styles.logoutBtn} onClick={handleLogout}>
                  Đăng xuất
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/*  BOTTOM MENU  */}
      <div style={styles.bottomHeader}>
        <nav
          style={{
            ...styles.menu,
            overflowX: isMobile ? "auto" : "visible",
            whiteSpace: isMobile ? "nowrap" : "normal",
            gap: isMobile ? "18px" : "30px",
          }}
        >
          <span style={styles.link} onClick={() => navigate("/")}>
            TRANG CHỦ
          </span>
          <span style={styles.link} onClick={() => navigate("/product")}>
            SẢN PHẨM
          </span>
          <span style={styles.link} onClick={() => navigate("/knowledge")}>
            KIẾN THỨC NUÔI CÁ
          </span>
          <span style={styles.link} onClick={() => navigate("/contact")}>
            LIÊN HỆ
          </span>
          <span style={styles.link} onClick={() => navigate("/orders")}>
            ĐƠN HÀNG
          </span>
          <span style={styles.link} onClick={() => navigate("/live")}>
            PHÒNG LIVE
          </span>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "linear-gradient(180deg, #ecfeff, #f0f9ff)",
    boxShadow: "0 4px 12px rgba(0, 150, 180, 0.15)",
  },
  shopName: {
    fontSize: "22px",
    fontWeight: "800",
    letterSpacing: "2px",
    background: "linear-gradient(90deg, #fb923c, #f97316, #ea580c)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 4px 14px rgba(249,115,22,0.45)",
    textTransform: "uppercase",
  },

  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  /* ===== TOP ===== */
  topHeader: {
    background: "#ecfeff",
    borderBottom: "1px solid #0284",
    padding: "15px 0 5px 0",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "18px",
    fontWeight: 700,
    cursor: "pointer",
    color: "#0ea5a4", // xanh ngọc
  },

  logoImg: {
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #67e8f9",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  /* ===== SEARCH ===== */
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#ffffff",
    borderRadius: "24px",
    border: "1px solid #bae6fd",
    overflow: "hidden",
  },

  searchInput: {
    flex: 1,
    border: "none",
    outline: "none",
    padding: "10px 14px",
    fontSize: "14px",
    background: "#ffffff",
  },

  searchBtn: {
    border: "none",
    background: "linear-gradient(135deg, #0ea5a4, #0284c7)",
    color: "#fff",
    padding: "0 16px",
    cursor: "pointer",
    fontSize: "16px",
  },

  /* ===== SUPPORT ===== */
  support: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    color: "red",
  },

  supportText: {
    fontSize: "13px",
    color: "black",
  },

  /* ===== CART ===== */
  cart: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    position: "relative",
    padding: "6px 14px",
    borderRadius: "20px",
    fontWeight: 600,
    fontSize: "14px",
    color: "#0f766e",
    background: "linear-gradient(135deg, #ccfbf1, #e0f2fe)",
  },

  cartIcon: {
    fontSize: "26px",
  },

  cartBadge: {
    position: "absolute",
    top: 0,
    right: 2,
    background: "red",
    color: "#fff",
    borderRadius: "50%",
    minWidth: 18,
    height: 18,
    fontSize: 11,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 600,
  },

  /* ===== USER ===== */
  user: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    cursor: "pointer",
    fontWeight: 700,
    color: "#0284c7",
  },

  userIcon: {
    fontSize: "20px",
  },

  loginBtn: {
    padding: "6px 12px",
    background: "#ffffff",
    color: "#0284c7",
    border: "1px solid #0284c7",
    borderRadius: "8px",
    cursor: "pointer",
  },

  registerBtn: {
    padding: "6px 12px",
    background: "linear-gradient(135deg, #14b8a6, #0ea5a4)",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "6px 12px",
    background: "#64748b",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  /* ===== MENU ===== */
  bottomHeader: {
    background: "linear-gradient(135deg, #0369a1, #0284c7)",
  },

  menu: {
    width: "90%",
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    padding: "14px 0",
  },

  link: {
    color: "#ecfeff",
    fontWeight: 600,
    cursor: "pointer",
  },
};


