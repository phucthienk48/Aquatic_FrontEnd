import { Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || user.role !== "admin") {
    return <h2>⛔ Bạn không có quyền truy cập</h2>;
  }

  return (
    <div style={styles.wrapper}>
      {/* SIDEBAR */}
      <aside style={styles.sidebar}>
        {/* <h2 style={styles.logo}>
          <i className="bi bi-shield-lock-fill" style={{ marginRight: 8 }}></i>
          ADMIN
        </h2> */}



          <div style={styles.menuItem} onClick={() => navigate("/admin")}>
            <i className="bi bi-shop"></i>
            <span> Thông tin shop</span>
          </div>
          
          <div style={styles.menuItem} onClick={() => navigate("/admin/contact")}>
            <i className="bi bi-envelope-paper-fill me-2"></i>
            <span> Liên Hệ</span>
          </div>

          <div style={styles.menuItem} onClick={() => navigate("/admin/live")}>
            <i
              className="bi bi-camera-video-fill"
              style={{ marginRight: 8, fontSize: 18 }}
            ></i>
            <span>Phòng Live</span>
          </div>


        <div style={styles.menuItem} onClick={() => navigate("/admin/users")}>
          <i className="bi bi-people-fill"></i>
          <span> Quản lý tài khoản</span>
        </div>

        <div style={styles.menuItem} onClick={() => navigate("/admin/products")}>
          <i className="bi bi-bag-fill"></i>
          <span> Quản lý sản phẩm</span>
        </div>

        <div style={styles.menuItem} onClick={() => navigate("/admin/orders")}>
          <i className="bi bi-box-seam-fill"></i>
          <span> Quản lý đơn hàng</span>
        </div>

          <div style={styles.menuItem} onClick={() => navigate("/admin/comment")}>
            <i className="bi bi-chat-left-text"></i>
            <span> Quản lý bình luận</span>
          </div>

          <div style={styles.menuItem} onClick={() => navigate("/admin/knowledge")}>
            <i className="bi bi-book-half"></i>
            <span> Kiến thức nuôi cá</span>
          </div>

        <div style={styles.menuItem} onClick={() => navigate("/admin/reports")}>
          <i className="bi bi-graph-up-arrow"></i>
          <span> Báo cáo thống kê</span>
        </div>

      </aside>

      {/* CONTENT */}
      <main style={styles.content}>
        <Outlet />
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    minHeight: "100vh",
  },
  sidebar: {
    width: "230px",
    background: "#08111dff",
    color: "#fff",
    padding: "20px",
  },
  logo: {
    marginBottom: "20px",
    textAlign: "center",
  },
  menuItem: {
    padding: "12px",
    cursor: "pointer",
    borderRadius: "6px",
    marginBottom: "8px",
    background: "rgba(255,255,255,0.1)",
  },
  content: {
    flex: 1,
    padding: "30px",
    background: "#f8f9fa",
  },
  
};
