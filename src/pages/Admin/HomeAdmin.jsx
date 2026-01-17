import React from "react";

export default function HomeAdmin() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Trang Quản Trị Shop Thủy Sinh</h1>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🌿 Giới thiệu</h2>
        <p style={styles.text}>
          Shop Thủy Sinh là hệ thống kinh doanh cá cảnh và vật tư thủy sinh,
          cung cấp đa dạng sản phẩm như cá cảnh, cây thủy sinh, hồ cá, vật liệu
          trang trí và phụ kiện chăm sóc.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>🎯 Chức năng hệ thống</h2>
        <ul style={styles.list}>
          <li>Quản lý sản phẩm (thêm, sửa, xóa)</li>
          <li>Quản lý đơn hàng và trạng thái đơn</li>
          <li>Quản lý tài khoản người dùng</li>
          <li>Thống kê doanh thu và đơn hàng</li>
        </ul>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>📦 Quy trình hoạt động</h2>
        <p style={styles.text}>
          Khách hàng đặt hàng trực tuyến → hệ thống xác nhận đơn →
          đóng gói và giao hàng → hoàn tất đơn hàng.
        </p>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>💡 Mục tiêu</h2>
        <p style={styles.text}>
          Xây dựng nền tảng bán cá cảnh hiện đại, tự động hóa quản lý đơn hàng,
          nâng cao trải nghiệm khách hàng và hiệu quả kinh doanh.
        </p>
      </section>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    fontFamily: "Arial, sans-serif",
  },
  title: {
    textAlign: "center",
    color: "#2c7a7b",
    marginBottom: "30px",
  },
  section: {
    backgroundColor: "#fff",
    padding: "20px",
    marginBottom: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  sectionTitle: {
    color: "#2d3748",
    marginBottom: "10px",
  },
  text: {
    color: "#4a5568",
    lineHeight: "1.6",
  },
  list: {
    paddingLeft: "20px",
    color: "#4a5568",
    lineHeight: "1.8",
  },
};
