import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchProduct from "../pages/User/Tools/SearchProduct";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Trạng thái đóng mở menu mobile

  /* LOAD USER & CART */
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      const userId = parsedUser._id || parsedUser.id;
      if (userId) fetchCartCount(userId);
    }
  }, []);

  /* RESPONSIVE CHECK */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 992);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  const fetchCartCount = async (userId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
      if (!res.ok) return;
      const cart = await res.json();
      const total = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(total);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err);
    }
  };

  const navLinks = [
    { name: "TRANG CHỦ", path: "/" },
    { name: "SẢN PHẨM", path: "/product" },
    { name: "KIẾN THỨC", path: "/knowledge" },
    { name: "LIÊN HỆ", path: "/contact" },
    { name: "ĐƠN HÀNG", path: "/orders" },
    { name: "PHÒNG LIVE", path: "/live" },
  ];

  return (
    <header style={styles.header}>
      {/* --- TOP HEADER --- */}
      <div style={styles.topHeader}>
        <div style={styles.container} className="header-container">
          
          {/* Mobile Menu Toggle */}
          {isMobile && (
            <button style={styles.menuIcon} onClick={() => setIsMenuOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
          )}

          {/* LOGO */}
          <div style={styles.logo} onClick={() => navigate("/")}>
            <img src="/data/logo.png" alt="Logo" style={styles.logoImg} />
            {!isMobile && (
              <div style={styles.logoText}>
                <h1 style={styles.shopName}>THIÊN PHÚC</h1>
                <span style={styles.shopSlogan}>AQUAWORLD</span>
              </div>
            )}
          </div>

          {/* SEARCH (Ẩn trên mobile nhỏ, chỉ hiện icon hoặc thu gọn) */}
          <div style={styles.searchContainer}>
            <SearchProduct isMobile={isMobile} />
          </div>

          {/* ACTIONS */}
          <div style={styles.actions}>
            {/* Giỏ hàng */}
            <div style={styles.actionItem} onClick={() => navigate("/cart")}>
              <div style={styles.iconBadgeWrapper}>
                <i className="bi bi-bag-check" style={styles.actionIcon}></i>
                {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
              </div>
              {!isMobile && <span style={styles.actionText}>Giỏ hàng</span>}
            </div>

            {/* User */}
            {!user ? (
              <div style={styles.authButtons}>
                <button style={styles.loginBtn} onClick={() => navigate("/login")}>Đăng nhập</button>
              </div>
            ) : (
              <div style={styles.userDropdown}>
                <div style={styles.actionItem} onClick={() => navigate("/profile")}>
                  <img src={user.avatar || "/default-avatar.png"} style={styles.avatarMini} alt="user" />
                  {!isMobile && <span style={styles.actionText}>{user.username}</span>}
                </div>
                <button onClick={handleLogout} style={styles.logoutBtnIcon} title="Đăng xuất">
                  <i className="bi bi-box-arrow-right"></i>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BOTTOM HEADER (Desktop Navigation) --- */}
      {!isMobile && (
        <div style={styles.bottomHeader}>
          <nav style={styles.nav}>
            {navLinks.map((link) => (
              <Link key={link.path} to={link.path} style={styles.navLink}>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* --- MOBILE SIDEBAR MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              style={styles.overlay}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              style={styles.mobileMenu}
            >
              <div style={styles.mobileMenuHeader}>
                <h2 style={styles.mobileMenuTitle}>MENU</h2>
                <button onClick={() => setIsMenuOpen(false)} style={styles.closeBtn}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div style={styles.mobileLinks}>
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    style={styles.mobileLink}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "#fff",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  topHeader: {
    background: "linear-gradient(135deg, #004d4d 0%, #008080 100%)",
    padding: "10px 0",
    color: "#fff",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "12px",
  },
  logoImg: {
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "2px solid #fff",
    objectFit: "cover",
  },
  logoText: {
    display: "flex",
    flexDirection: "column",
  },
  shopName: {
    fontSize: "18px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "1px",
    lineHeight: "1",
  },
  shopSlogan: {
    fontSize: "11px",
    letterSpacing: "2px",
    opacity: 0.8,
  },
  searchContainer: {
    flex: 1,
    margin: "0 30px",
    maxWidth: "500px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  actionItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
    position: "relative",
    transition: "0.3s",
  },
  actionIcon: {
    fontSize: "22px",
  },
  actionText: {
    fontSize: "12px",
    marginTop: "2px",
  },
  iconBadgeWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: "-5px",
    right: "-10px",
    background: "#ff4d4d",
    color: "#fff",
    fontSize: "10px",
    padding: "2px 6px",
    borderRadius: "10px",
    fontWeight: "bold",
  },
  avatarMini: {
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    border: "2px solid #fff",
  },
  userDropdown: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  logoutBtnIcon: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    padding: "5px 8px",
    borderRadius: "5px",
    cursor: "pointer",
  },
  loginBtn: {
    background: "#fff",
    color: "#004d4d",
    border: "none",
    padding: "8px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  /* BOTTOM HEADER */
  bottomHeader: {
    background: "#fff",
    borderBottom: "1px solid #eee",
  },
  nav: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    padding: "12px 0",
    gap: "40px",
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "14px",
    fontWeight: "700",
    transition: "0.3s",
    position: "relative",
    paddingBottom: "5px",
  },
  /* MOBILE MENU STYLES */
  menuIcon: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "28px",
    cursor: "pointer",
  },
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 1001,
  },
  mobileMenu: {
    position: "fixed",
    top: 0, left: 0, bottom: 0,
    width: "280px",
    background: "#fff",
    zIndex: 1002,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
  },
  mobileMenuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
  },
  mobileMenuTitle: {
    margin: 0,
    fontSize: "18px",
    color: "#004d4d",
  },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
  },
  mobileLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  mobileLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "600",
    padding: "10px 0",
    borderBottom: "1px solid #f9f9f9",
  },
};