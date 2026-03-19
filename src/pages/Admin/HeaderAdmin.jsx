import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function HeaderAdmin() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [isHoverBtn, setIsHoverBtn] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header style={styles.header}>
      {/* Hiệu ứng gợn sóng nhẹ phía trên */}
      <div style={styles.waveDecoration}></div>

      <div style={styles.container}>
        {/* LOGO - Mang phong cách thủy sinh */}
        <div style={styles.logo} onClick={() => navigate("/admin")}>
          <div style={styles.logoIcon}>
            {/* <span style={{ fontSize: "28px" }}>🐠</span> */}
          </div>
          <div style={styles.logoText}>
            <span style={styles.brandMain}>AQUAWORLD</span>
            <span style={styles.brandSub}>ADMIN</span>
          </div>
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          {/* USER PROFILE - Thiết kế như một hòn đảo nhỏ */}
          <div 
            style={styles.userCard} 
            onClick={() => navigate("/admin/profile")}
          >
            <div style={styles.avatarWrapper}>
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.username || 'Admin'}&background=00b4d8&color=fff`} 
                alt="avatar" 
                style={styles.avatar}
              />
              <div style={styles.onlineStatus}></div>
            </div>
            <div style={styles.userInfo}>
              <span style={styles.username}>{user?.username || "Chủ Bể Cá"}</span>
              <span style={styles.roleTag}>Quản trị viên</span>
            </div>
          </div>

          <button 
            style={{
              ...styles.logoutBtn,
              ...(isHoverBtn ? styles.logoutBtnHover : {})
            }}
            onMouseEnter={() => setIsHoverBtn(true)}
            onMouseLeave={() => setIsHoverBtn(false)}
            onClick={handleLogout}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            <span>Rời bể</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
header: {
  position: "fixed",      
  top: 0,                 
  left: 0,                
  right: 0,               
  zIndex: 1100,           
  background: "linear-gradient(135deg, #0077b6 0%, #00b4d8 100%)",
  padding: "0 20px",
  height: "75px",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 4px 15px rgba(0, 119, 182, 0.3)",
  overflow: "hidden",
},

  // Trang trí thêm chút cảm giác nước
  waveDecoration: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "4px",
    background: "rgba(255,255,255,0.2)",
    filter: "blur(2px)",
  },

  container: {
    width: "100%",
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1,
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    transition: "transform 0.2s",
  },

  logoIcon: {
    background: "#fff",
    width: "45px",
    height: "45px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
  },

  logoText: {
    display: "flex",
    flexDirection: "column",
    lineHeight: "1",
  },

  brandMain: {
    fontSize: "22px",
    fontWeight: "900",
    letterSpacing: "1px",
    color: "#fff",
  },

  brandSub: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#caf0f8",
    marginTop: "2px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },

  userCard: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "rgba(255, 255, 255, 0.15)",
    padding: "6px 15px 6px 8px",
    borderRadius: "50px",
    cursor: "pointer",
    backdropFilter: "blur(5px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    transition: "all 0.3s ease",
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    border: "2px solid #fff",
    objectFit: "cover",
  },

  onlineStatus: {
    position: "absolute",
    bottom: "2px",
    right: "2px",
    width: "10px",
    height: "10px",
    background: "#4cc9f0",
    borderRadius: "50%",
    border: "2px solid #00b4d8",
  },

  userInfo: {
    display: "flex",
    flexDirection: "column",
  },

  username: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#fff",
  },

  roleTag: {
    fontSize: "10px",
    textTransform: "uppercase",
    color: "#caf0f8",
    fontWeight: "bold",
  },

  logoutBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "10px 18px",
    background: "transparent",
    color: "#fff",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    transition: "all 0.3s ease",
  },

  logoutBtnHover: {
    background: "#fb8500", // Màu cam (giống cá hề Nemo) tạo điểm nhấn nổi bật khi logout
    borderColor: "#fb8500",
    boxShadow: "0 4px 15px rgba(251, 133, 0, 0.4)",
    transform: "translateY(-2px)",
  },
};