import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    address: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { username, email, phone, address, password, confirmPassword } = form;

    if (!username || !email || !password) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự");
      return;
    }
    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }
    if (phone && !/^[0-9]{9,11}$/.test(phone)) {
      setError("Số điện thoại không hợp lệ");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, phone, address }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Đăng ký thất bại");

      alert("🎉 Chào mừng bạn đến với cộng đồng Thủy sinh!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Hiệu ứng bong bóng khí
  const bubbles = Array.from({ length: 10 });

  return (
    <div style={styles.container}>
      {/* Bong bóng nền */}
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          style={{
            ...styles.bubble,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 30 + 10}px`,
            height: `${Math.random() * 30 + 10}px`,
          }}
          animate={{
            y: [0, -900],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: Math.random() * 6 + 4,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={styles.glassWrapper}
      >
        {/* Bên trái: Hình ảnh & Welcome */}
        <div style={styles.leftSide}>
          <div style={styles.overlay}></div>
          <div style={styles.leftContent}>
            <i className="bi bi-droplet-half" style={styles.mainIcon}></i>
            <h2 style={styles.welcomeTitle}>Gia Nhập AquaWorld</h2>
            <p style={styles.welcomeText}>
              Bắt đầu hành trình tạo nên hệ sinh thái dưới nước tuyệt đẹp của riêng bạn.
            </p>
          </div>
        </div>

        {/* Bên phải: Form đăng ký */}
        <div style={styles.rightSide}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.header}>
              <h2 style={styles.title}>Đăng Ký Tài Khoản</h2>
              <p style={styles.subtitle}>Điền thông tin để tham gia cộng đồng</p>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }}
                  style={styles.errorAlert}
                >
                  <i className="bi bi-exclamation-triangle" style={{marginRight: 8}}></i>
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={styles.gridFields}>
              {/* Tên đăng nhập */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Tên đăng nhập *</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-person" style={styles.icon}></i>
                  <input style={styles.input} name="username" placeholder="Ví dụ: AquaMaster" value={form.username} onChange={handleChange} />
                </div>
              </div>

              {/* Email */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email *</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-envelope" style={styles.icon}></i>
                  <input style={styles.input} type="email" name="email" placeholder="email@vi-du.com" value={form.email} onChange={handleChange} />
                </div>
              </div>

              {/* Số điện thoại */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Số điện thoại</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-phone" style={styles.icon}></i>
                  <input style={styles.input} name="phone" placeholder="090..." value={form.phone} onChange={handleChange} />
                </div>
              </div>

              {/* Địa chỉ */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Địa chỉ</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-geo-alt" style={styles.icon}></i>
                  <input style={styles.input} name="address" placeholder="Tỉnh/Thành phố" value={form.address} onChange={handleChange} />
                </div>
              </div>

              {/* Mật khẩu */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Mật khẩu *</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-lock" style={styles.icon}></i>
                  <input style={styles.input} type="password" name="password" placeholder="••••••••" value={form.password} onChange={handleChange} />
                </div>
              </div>

              {/* Nhập lại mật khẩu */}
              <div style={styles.inputGroup}>
                <label style={styles.label}>Xác nhận mật khẩu *</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-shield-check" style={styles.icon}></i>
                  <input style={styles.input} type="password" name="confirmPassword" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#00a8a8" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{ ...styles.submitBtn, ...(loading ? styles.disabledBtn : {}) }}
              disabled={loading}
            >
              {loading ? "Đang xử lý hồ sơ..." : "Đăng Ký"}
            </motion.button>

            <p style={styles.footerLink}>
              Đã có tài khoản? <Link to="/login" style={styles.link}>Quay lại Đăng nhập</Link>
            </p>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #004d4d 0%, #001a1a 100%)",
    position: "relative",
    overflow: "hidden",
    padding: "20px",
    fontFamily: "'Inter', sans-serif",
  },
  bubble: {
    position: "absolute",
    bottom: -50,
    background: "rgba(255, 255, 255, 0.15)",
    borderRadius: "50%",
    zIndex: 1,
  },
  glassWrapper: {
    display: "flex",
    width: "1100px",
    minHeight: "650px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    overflow: "hidden",
    boxShadow: "0 25px 50px rgba(0,0,0,0.4)",
    zIndex: 10,
    backdropFilter: "blur(10px)",
  },
  leftSide: {
    flex: 0.8,
    background: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80') center center/cover",
    position: "relative",
    display: "none", // Ẩn trên mobile nếu cần, hiện trên desktop
    "@media (min-width: 768px)": { display: "flex" },
  },
  overlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "linear-gradient(135deg, rgba(0, 128, 128, 0.85) 0%, rgba(0, 40, 40, 0.9) 100%)",
  },
  leftContent: {
    position: "relative",
    zIndex: 2,
    padding: "60px",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  mainIcon: {
    fontSize: "60px",
    marginBottom: "20px",
    color: "#40e0d0",
  },
  welcomeTitle: {
    fontSize: "32px",
    fontWeight: "800",
    marginBottom: "15px",
  },
  welcomeText: {
    fontSize: "16px",
    lineHeight: "1.6",
    opacity: 0.9,
  },
  rightSide: {
    flex: 1.2,
    padding: "50px 60px",
    background: "#fff",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  form: { width: "100%" },
  header: { marginBottom: "30px" },
  title: { fontSize: "28px", color: "#004d4d", fontWeight: "800", margin: 0 },
  subtitle: { fontSize: "15px", color: "#666", marginTop: "5px" },
  gridFields: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px",
  },
  inputGroup: { display: "flex", flexDirection: "column" },
  label: { fontSize: "13px", fontWeight: "700", color: "#444", marginBottom: "8px", textTransform: "uppercase" },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#f0f7f7",
    border: "1px solid #e0eeee",
    borderRadius: "12px",
    padding: "0 15px",
    transition: "all 0.3s",
  },
  icon: { color: "#008080", fontSize: "16px" },
  input: {
    flex: 1,
    padding: "12px",
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "15px",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #008080 0%, #004d4d 100%)",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0, 80, 80, 0.2)",
  },
  disabledBtn: { background: "#ccc", cursor: "not-allowed", boxShadow: "none" },
  footerLink: { marginTop: "25px", textAlign: "center", fontSize: "14px", color: "#666" },
  link: { color: "#008080", fontWeight: "700", textDecoration: "none" },
  errorAlert: {
    background: "#fff0f0",
    color: "#d9534f",
    padding: "12px 15px",
    borderRadius: "10px",
    fontSize: "14px",
    marginBottom: "20px",
    borderLeft: "5px solid #d9534f",
  },
};