import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* ==== LOGO ==== */}
        <div>
          <h4 style={styles.title}>PHÚC LONG AQUATIC</h4>
          <p style={styles.text}>
            Chuyên cá cảnh, thuốc và vật tư thủy sinh.
          </p>
        </div>

        {/* ==== LINK ==== */}
        <div>
          <h4 style={styles.title}>Liên kết</h4>
          <Link to="/" style={styles.link}>Trang chủ</Link>
          <Link to="/product" style={styles.link}>Sản phẩm</Link>
          <Link to="/contact" style={styles.link}>Liên hệ</Link>
        </div>

        {/* ==== CONTACT ==== */}
        <div>
          <h4 style={styles.title}>Liên hệ</h4>
          <p style={styles.text}>📞 0397 960 604</p>
          <p style={styles.text}>📧 aquaticshop@gmail.com</p>
        </div>
      </div>

      <div style={styles.bottom}>
        © {new Date().getFullYear()} Aquatic Shop. All rights reserved.
      </div>
    </footer>
  );
}
const styles = {
  footer: {
    background: "#222",
    color: "#ccc",
    padding: "30px 0 10px",
    marginTop: "40px",
  },

  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "auto",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
    flexWrap: "wrap",
  },

  title: {
    color: "#fff",
    marginBottom: "10px",
    fontSize: "16px",
  },

  text: {
    fontSize: "14px",
    marginBottom: "6px",
  },

  link: {
    display: "block",
    color: "#ccc",
    textDecoration: "none",
    marginBottom: "6px",
    fontSize: "14px",
    cursor: "pointer",
  },

  bottom: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#aaa",
  },
};
