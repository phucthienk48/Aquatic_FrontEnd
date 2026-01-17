import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📞 Liên hệ với Aquatic Shop</h1>

      <div className="row g-4">
        {/* FORM */}
        <div className="col-md-6">
          <form style={styles.formCard} onSubmit={handleSubmit}>
            <h4 style={styles.formTitle}>
              <i className="bi bi-chat-dots"></i> Gửi tin nhắn
            </h4>

            <div style={styles.formGroup}>
              <label style={styles.label}>Họ và tên</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nội dung</label>
              <textarea
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Nhập nội dung bạn muốn liên hệ..."
                style={styles.textarea}
                required
              />
            </div>

            <button style={styles.button}>
              <i className="bi bi-send-fill"></i> Gửi liên hệ
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className="col-md-6">
          <div style={styles.infoCard}>
            <h4 style={styles.shopName}>🏪 Aquatic Shop</h4>
            <p>Chuyên cá cảnh – thuốc thủy sinh – vật tư hồ cá</p>

            <p>📍 <strong>Địa chỉ:</strong> Cần Thơ, Việt Nam</p>
            <p>📧 <strong>Email:</strong> aquaticshop@gmail.com</p>
            <p>📱 <strong>Hotline:</strong> 0909 000 000</p>

            <hr />

            <p><strong>💬 Hỗ trợ nhanh:</strong></p>
            <ul style={styles.list}>
              <li>Chăm sóc & phòng bệnh cá</li>
              <li>Tư vấn hồ & vật tư</li>
              <li>Bảo hành & vận chuyển</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  page: {
    maxWidth: 1100,
    margin: "40px auto",
    padding: "0 16px",
  },

  title: {
    textAlign: "center",
    marginBottom: 40,
    fontWeight: 700,
  },

  /* FORM */
  formCard: {
    background: "#fff",
    padding: 28,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },

  formTitle: {
    marginBottom: 24,
    fontWeight: 600,
    color: "#0d6efd",
  },

  formGroup: {
    marginBottom: 18,
  },

  label: {
    display: "block",
    marginBottom: 6,
    fontSize: 14,
    fontWeight: 500,
    color: "#333",
  },

  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
    outline: "none",
    transition: "0.2s",
  },

  textarea: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid #ddd",
    fontSize: 14,
    resize: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    marginTop: 10,
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: "linear-gradient(135deg, #0d6efd, #4dabf7)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.2s",
  },

  /* INFO */
  infoCard: {
    background: "#f8f9fa",
    padding: 28,
    borderRadius: 16,
    height: "100%",
  },

  shopName: {
    fontWeight: 700,
    color: "#0d6efd",
    marginBottom: 10,
  },

  list: {
    paddingLeft: 20,
    lineHeight: 1.8,
  },
};
