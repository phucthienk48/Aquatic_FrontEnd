import { Outlet, useNavigate, useLocation } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để kiểm tra menu đang active
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
        <div className="text-center p-5 shadow rounded bg-white">
          <i className="bi bi-shield-slash text-danger display-1"></i>
          <h2 className="mt-3">Truy cập bị từ chối</h2>
          <p className="text-muted">Bạn không có quyền quản trị để vào khu vực này.</p>
          <button className="btn btn-primary" onClick={() => navigate("/")}>Quay lại trang chủ</button>
        </div>
      </div>
    );
  }

  const menuItems = [
    { path: "/admin", icon: "bi-shop", label: "Thông tin shop" },
    { path: "/admin/contact", icon: "bi-envelope-paper-fill", label: "Liên Hệ" },
    { path: "/admin/live", icon: "bi-camera-video-fill", label: "Phòng Live" },
    { path: "/admin/users", icon: "bi-people-fill", label: "Quản lý tài khoản" },
    { path: "/admin/products", icon: "bi-bag-check-fill", label: "Quản lý sản phẩm" },
    { path: "/admin/orders", icon: "bi-box-seam-fill", label: "Quản lý đơn hàng" },
    { path: "/admin/comment", icon: "bi-chat-left-dots-fill", label: "Quản lý bình luận" },
    { path: "/admin/knowledge", icon: "bi-book-half", label: "Kiến thức nuôi cá" },
    { path: "/admin/reports", icon: "bi-graph-up-arrow", label: "Báo cáo thống kê" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        {/* Brand/Logo Area */}
        {/* <div style={styles.brandArea}>
          <div style={styles.logoCircle}>
            <i className="bi bi-water text-white fs-4"></i>
          </div>
          <div className="ms-3">
            <h6 className="mb-0 fw-bold text-white">AQUA ADMIN</h6>
            <small style={{ fontSize: '10px', color: '#8ecae6' }}>HỆ THỐNG QUẢN TRỊ</small>
          </div>
        </div>

        <div style={styles.divider}></div> */}

        {/* User Info */}
        {/* <div style={styles.userProfile}>
           <img 
            src={`https://ui-avatars.com/api/?name=${user.username || 'Admin'}&background=023e8a&color=fff`} 
            alt="avatar" 
            style={styles.avatar} 
           />
           <div className="ms-2 overflow-hidden">
              <div className="text-truncate fw-bold text-white small">{user.username || 'Quản trị viên'}</div>
              <div style={{ fontSize: '11px', color: '#00b4d8' }}>Đang trực tuyến</div>
           </div>
        </div> */}

        {/* Navigation Menu */}
        <nav style={styles.navMenu}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.path}
                style={{
                  ...styles.menuItem,
                  ...(isActive ? styles.menuActive : {}),
                }}
                onClick={() => navigate(item.path)}
              >
                <i className={`bi ${item.icon}`} style={styles.icon}></i>
                <span style={styles.menuLabel}>{item.label}</span>
                {isActive && <div style={styles.activeIndicator}></div>}
              </div>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={styles.logoutWrapper}>
            <button style={styles.logoutBtn} onClick={handleLogout}>
                <i className="bi bi-box-arrow-left me-2"></i> Đăng xuất
            </button>
        </div>
      </aside>

      {/* CONTENT AREA */}
      <main style={styles.content}>
        <div style={styles.topHeader}>
           <h5 className="mb-0 fw-bold text-secondary">
             Dashboard / <span className="text-dark">{menuItems.find(i => i.path === location.pathname)?.label || "Tổng quan"}</span>
           </h5>
           <div className="d-flex align-items-center">
              <i className="bi bi-bell-fill fs-5 text-muted me-3"></i>
              <span className="badge bg-info text-dark">V1.0.4 - Aquarium Edition</span>
           </div>
        </div>
        <div style={styles.innerContent}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  sidebar: {
    width: "260px",
    background: "linear-gradient(180deg, #023e8a 0%, #001233 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    padding: "20px 15px",
    position: "fixed",
    height: "100vh",
    zIndex: 100,
    boxShadow: "4px 0 10px rgba(0,0,0,0.1)",
  },
  brandArea: {
    display: "flex",
    alignItems: "center",
    padding: "10px 5px 20px 5px",
  },
  logoCircle: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.3)",
  },
  divider: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    margin: "10px 0 20px 0",
  },
  userProfile: {
    display: "flex",
    alignItems: "center",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "15px",
    marginBottom: "25px",
    border: "1px solid rgba(255,255,255,0.1)",
  },
  avatar: {
    width: "35px",
    height: "35px",
    borderRadius: "10px",
    objectFit: "cover",
  },
  navMenu: {
    flex: 1,
    overflowY: "auto",
    paddingRight: "5px",
  },
  menuItem: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    cursor: "pointer",
    borderRadius: "12px",
    marginBottom: "6px",
    transition: "all 0.3s ease",
    color: "rgba(255,255,255,0.7)",
    position: "relative",
  },
  menuActive: {
    background: "rgba(255,255,255,0.15)",
    color: "#fff",
    fontWeight: "600",
  },
  activeIndicator: {
    position: "absolute",
    left: "0",
    width: "4px",
    height: "20px",
    background: "#00b4d8",
    borderRadius: "0 4px 4px 0",
  },
  icon: {
    fontSize: "1.1rem",
    width: "25px",
    marginRight: "12px",
  },
  menuLabel: {
    fontSize: "0.95rem",
  },
  logoutWrapper: {
    paddingTop: "20px",
  },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    border: "none",
    background: "rgba(231, 76, 60, 0.15)",
    color: "#ff7675",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  content: {
    flex: 1,
    marginLeft: "260px", // Khớp với độ rộng của sidebar
    display: "flex",
    flexDirection: "column",
  },
  topHeader: {
    height: "70px",
    background: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
  },
  innerContent: {
    padding: "30px",
    flex: 1,
    overflowY: "auto",
  },
};