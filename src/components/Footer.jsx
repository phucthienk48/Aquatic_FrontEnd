import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* ==== BRAND COLUMN ==== */}
        <div style={styles.column}>
          <h2 style={styles.brandTitle}>THIÊN PHÚC <span style={styles.accent}>AQUAWORLD</span></h2>
          <p style={styles.description}>
            Nâng tầm không gian sống với những bể cá thủy sinh nghệ thuật. Chuyên cung cấp cá cảnh, thuốc và vật tư chất lượng cao.
          </p>
          <div style={styles.socialIcons}>
            <a href="#" style={styles.icon}>FB</a>
            <a href="#" style={styles.icon}>YT</a>
            <a href="#" style={styles.icon}>Zalo</a>
          </div>
        </div>

        {/* ==== QUICK LINKS ==== */}
        <div style={styles.column}>
          <h4 style={styles.sectionTitle}>Liên kết nhanh</h4>
          <ul style={styles.list}>
            <li><Link to="/" style={styles.link}>Trang chủ</Link></li>
            <li><Link to="/product" style={styles.link}>Sản phẩm</Link></li>
            <li><Link to="/contact" style={styles.link}>Liên hệ</Link></li>
            <li><Link to="/knowledge" style={styles.link}>Kiến thức nuôi cá</Link></li>
          </ul>
        </div>

        {/* ==== CONTACT INFO ==== */}
        <div style={styles.column}>
          <h4 style={styles.sectionTitle}>Thông tin liên hệ</h4>
          <p style={styles.contactItem}>📍 124/7 Xuân Khánh, Ninh Kiều, Cần Thơ</p>
          <p style={styles.contactItem}>📞 0397 960 604</p>
          <p style={styles.contactItem}>📧 aquaworldshop@gmail.com</p>
          <p style={styles.contactItem}>⏰ 08:00 - 21:00 (Thứ 2 - CN)</p>
        </div>
      </div>

      <div style={styles.bottomBar}>
        <div style={styles.bottomContent}>
          <p>© {new Date().getFullYear()} Phuc Long Aquatic. Thiết kế bởi Team.</p>
          <div style={styles.bottomLinks}>
            <span style={{cursor: 'pointer'}}>Quy định</span>
            <span style={{marginLeft: '20px', cursor: 'pointer'}}>Bảo mật</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#111827", // Dark blue-gray
    color: "#e5e7eb",
    paddingTop: "60px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "40px",
    padding: "0 20px 40px 20px",
  },
  column: {
    display: "flex",
    flexDirection: "column",
  },
  brandTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "15px",
    letterSpacing: "1px",
    color: "#fff",
  },
  accent: {
    color: "#10b981", // Màu xanh lá/thủy sinh
  },
  description: {
    fontSize: "14px",
    lineHeight: "1.6",
    color: "#9ca3af",
    marginBottom: "20px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#fff",
    borderBottom: "2px solid #10b981",
    width: "fit-content",
    paddingBottom: "5px",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  link: {
    color: "#9ca3af",
    textDecoration: "none",
    fontSize: "15px",
    marginBottom: "12px",
    display: "block",
    transition: "color 0.3s ease",
  },
  // Lưu ý: Hover hiệu ứng cần CSS file, nếu dùng inline style thì khó làm hover
  contactItem: {
    fontSize: "14px",
    marginBottom: "12px",
    color: "#9ca3af",
  },
  socialIcons: {
    display: "flex",
    gap: "15px",
  },
  icon: {
    backgroundColor: "#1f2937",
    width: "35px",
    height: "35px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    color: "#fff",
    textDecoration: "none",
    fontSize: "12px",
  },
  bottomBar: {
    borderTop: "1px solid #1f2937",
    padding: "20px 0",
    marginTop: "20px",
  },
  bottomContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    fontSize: "13px",
    color: "#6b7280",
  },
};