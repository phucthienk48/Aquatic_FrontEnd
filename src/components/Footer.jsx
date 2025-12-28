export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div>
          <h4 style={styles.title}>🐟 Aquatic Shop</h4>
          <p>Chuyên cá cảnh, thuốc và vật tư thủy sinh.</p>
        </div>

        <div>
          <h4 style={styles.title}>Liên kết</h4>
          <p>Trang chủ</p>
          <p>Sản phẩm</p>
          <p>Liên hệ</p>
        </div>

        <div>
          <h4 style={styles.title}>Liên hệ</h4>
          <p>📞 0123 456 789</p>
          <p>📧 aquaticshop@gmail.com</p>
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
  },
  title: {
    color: "#fff",
    marginBottom: "8px",
  },
  bottom: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
    color: "#aaa",
  },
};
