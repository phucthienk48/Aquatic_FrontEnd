import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import SearchProduct from "../pages/User/Tools/SearchProduct";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [cartCount, setCartCount] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Xác định loại thiết bị
  const isMobile = width < 768;      
  const isTablet = width >= 768 && width <= 1024; 
  const isDesktop = width > 1024;    

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchCartCount(parsedUser._id || parsedUser.id);
    }

    const handleResize = () => setWidth(window.innerWidth);
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
      const cart = await res.json();
      const total = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
      setCartCount(total);
    } catch (err) { console.error(err); }
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
     
      <div style={styles.topHeader}>
        <div style={styles.container} className="header-container">
          
          {!isDesktop && (
            <button style={styles.menuIcon} onClick={() => setIsMenuOpen(true)}>
              <i className="bi bi-list"></i>
            </button>
          )}

          <div style={styles.logo} onClick={() => navigate("/")}>
            <img src="/data/logo.png" alt="Logo" style={isMobile ? styles.logoImgMobile : styles.logoImg} />
            {!isMobile && ( 
              <div style={styles.logoText}>
                <h1 style={styles.shopName}>THIÊN PHÚC</h1>
                <span style={styles.shopSlogan}>AQUAWORLD</span>
              </div>
            )}
          </div>

          <div style={{ 
            ...styles.searchContainer, 
            display: (isMobile && width < 400) ? "none" : "block" // Ẩn search trên mobile cực nhỏ nếu cần
          }}>
            <SearchProduct isMobile={!isDesktop} />
          </div>

          {/* . ACTIONS */}
          <div style={styles.actions}>
            <div style={styles.actionItem} onClick={() => navigate("/cart")}>
              <div style={styles.iconBadgeWrapper}>
                <i className="bi bi-bag-check" style={styles.actionIcon}></i>
                {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
              </div>
              {isDesktop && <span style={styles.actionText}>Giỏ hàng</span>}
            </div>

            {/* User Profile */}
            {!user ? (
              <button style={styles.loginBtn} onClick={() => navigate("/login")}>
                {isMobile ? <i className="bi bi-person"></i> : "Đăng nhập"}
              </button>
            ) : (
              <div style={styles.userDropdown}>
                <div style={styles.actionItem} onClick={() => navigate("/profile")}>
                  <img src={user.avatar || "/default-avatar.png"} style={styles.avatarMini} alt="user" />
                  {isDesktop && <span style={styles.actionText}>{user.username}</span>}
                </div>
                {isDesktop && (
                  <button onClick={handleLogout} style={styles.logoutBtnIcon}>
                    <i className="bi bi-box-arrow-right"></i>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- BOTTOM HEADER (Chỉ hiện trên Laptop/Desktop) --- */}
      {isDesktop && (
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

      {/* --- MOBILE/TABLET SIDEBAR MENU --- */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)} style={styles.overlay}
            />
            <motion.div
              initial={{ x: "-100%" }} animate={{ x: 0 }} exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              style={styles.mobileMenu}
            >
              <div style={styles.mobileMenuHeader}>
                <div style={styles.logoMobile}>
                  <img src="/data/logo.png" style={{width: "40px"}} alt="logo" />
                  <span style={{fontWeight: 'bold', marginLeft: '10px'}}>MENU</span>
                </div>
                <button onClick={() => setIsMenuOpen(false)} style={styles.closeBtn}>
                  <i className="bi bi-x-lg"></i>
                </button>
              </div>
              <div style={styles.mobileLinks}>
                {navLinks.map((link) => (
                  <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)} style={styles.mobileLink}>
                    {link.name}
                  </Link>
                ))}
                {user && (
                   <button onClick={handleLogout} style={styles.mobileLogoutBtn}>
                    <i className="bi bi-box-arrow-right me-2"></i> Đăng xuất
                  </button>
                )}
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
    padding: "12px 0",
    color: "#fff",
  },

  container: {
    maxWidth: "1250px",
    margin: "0 auto",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "10px",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    gap: "10px",
  },

  logoImg: {
    width: "45px",
    height: "45px",
    borderRadius: "50%",
    border: "2px solid #fff",
    objectFit: "cover",
  },

  logoImgMobile: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "2px solid #fff",
  },

  logoText: {
    display: "flex",
    flexDirection: "column",
  },

  shopName: {
    fontSize: "20px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "0.5px",
  },

  shopSlogan: {
    fontSize: "13px",
    letterSpacing: "1px",
    opacity: 0.8,
  },

  searchContainer: {
    flex: 1,
    margin: "0 10px",
    minWidth: "150px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  actionItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    cursor: "pointer",
  },

  actionIcon: {
    fontSize: "25px",
  },

  actionText: {
    fontSize: "13px",
    marginTop: "2px",
  },

  iconBadgeWrapper: {
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: "-8px",
    right: "-12px",
    background: "#ff4d4d",
    color: "#fff",
    fontSize: "10px",
    padding: "1px 5px",
    borderRadius: "50%",
    fontWeight: "bold",
  },


  avatarMini: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "1.5px solid #fff",
  },

  userDropdown: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  logoutBtnIcon: {
    background: "rgba(255,255,255,0.15)",
    border: "none",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "4px",
    cursor: "pointer",
  },

  loginBtn: {
    background: "#fff",
    color: "#004d4d",
    border: "none",
    padding: "6px 12px",
    borderRadius: "15px",
    fontWeight: "bold",
    fontSize: "18px",
    cursor: "pointer",
  },

  bottomHeader: {
    background: "#fff",
    borderBottom: "1px solid #eee",
  },

  nav: {
    maxWidth: "1200px",
    margin: "8px auto",
    display: "flex",
    justifyContent: "center",
    padding: "10px 0",
    gap: "30px",
  },

  navLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "16px",
    fontWeight: "700",
    transition: "0.3s",
  },

  menuIcon: {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "24px",
    cursor: "pointer",
  },

  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.6)",
    zIndex: 2000,
  },

  mobileMenu: {
    position: "fixed",
    top: 0,
    left: 0,
    bottom: 0,
    width: "280px",
    background: "#fff",
    zIndex: 2001,
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "5px 0 15px rgba(0,0,0,0.1)",
  },

  mobileMenuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #eee",
    paddingBottom: "15px",
  },

  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "22px",
    color: "#333",
  },

  mobileLinks: {
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  mobileLink: {
    textDecoration: "none",
    color: "#333",
    fontSize: "15px",
    fontWeight: "600",
    padding: "12px 15px",
    borderRadius: "8px",
    transition: "0.2s",
  },

  mobileLogoutBtn: {
    marginTop: "20px",
    padding: "12px",
    background: "#fff1f0",
    color: "#ff4d4f",
    border: "none",
    borderRadius: "8px",
    textAlign: "left",
    fontWeight: "bold",
  },
};