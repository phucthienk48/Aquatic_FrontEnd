import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Đăng nhập thất bại");

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      
      if (result.user.role === "admin") navigate("/admin");
      else window.location.href = "/";
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Tạo hiệu ứng bong bóng khí bay lên
  const bubbles = Array.from({ length: 8 });

  return (
    <div style={styles.container}>
      {/* Background Bubbles Animation */}
      {bubbles.map((_, i) => (
        <motion.div
          key={i}
          style={{
            ...styles.bubble,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 40 + 10}px`,
            height: `${Math.random() * 40 + 10}px`,
          }}
          animate={{
            y: [0, -800],
            opacity: [0, 0.5, 0],
            x: [0, Math.sin(i) * 50]
          }}
          transition={{
            duration: Math.random() * 5 + 5,
            repeat: Infinity,
            delay: Math.random() * 5,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={styles.glassCard}
      >
        {/* Phần Hình ảnh Thủy sinh */}
        <div style={styles.leftSide}>
          <div style={styles.imageOverlay}>
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <h1 style={styles.brandTitle}>AquaWorld</h1>
              <p style={styles.brandSlogan}>Chạm tay vào thế giới thủy sinh</p>
            </motion.div>
          </div>
        </div>

        {/* Phần Form Đăng nhập */}
        <div style={styles.rightSide}>
          <form style={styles.form} onSubmit={handleSubmit}>
            <div style={styles.header}>
              <h2 style={styles.title}>Đăng Nhập</h2>
              <div style={styles.underline}></div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  style={styles.errorBox}
                >
                  <i className="bi bi-water" style={{marginRight: 8}}></i> {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div style={styles.inputArea}>
              <div style={styles.inputGroup}>
                <label style={styles.label}>Email thành viên</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-envelope-at" style={styles.icon}></i>
                  <input
                    style={styles.input}
                    type="email"
                    name="email"
                    placeholder="example@aqua.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.label}>Mật khẩu</label>
                <div style={styles.inputWrapper}>
                  <i className="bi bi-shield-lock" style={styles.icon}></i>
                  <input
                    style={styles.input}
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div style={styles.options}>
              <label style={styles.checkbox}>
                <input type="checkbox" /> Duy trì đăng nhập
              </label>
              <span style={styles.forgot}>Quên mật khẩu?</span>
            </div>

            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "#00a8a8" }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              style={{ ...styles.submitBtn, ...(loading ? styles.disabled : {}) }}
              disabled={loading}
            >
              {loading ? "Đang kết nối..." : "Đăng nhập"}
            </motion.button>

            <p style={styles.footerText}>
              Lần đầu đến với hồ thủy sinh?{' '}
              <Link to="/register" style={styles.link}>Đăng ký tài khoản</Link>
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
    background: "linear-gradient(180deg, #004d4d 0%, #001a1a 100%)",
    overflow: "hidden",
    position: "relative",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  bubble: {
    position: "absolute",
    bottom: -100,
    background: "rgba(255, 255, 255, 0.2)",
    borderRadius: "50%",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    zIndex: 1,
  },
  glassCard: {
    display: "flex",
    width: "950px",
    height: "600px",
    background: "rgba(255, 255, 255, 0.95)",
    borderRadius: "40px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    zIndex: 10,
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  leftSide: {
    flex: 1.1,
    background: "url('https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80') center center/cover",
    position: "relative",
  },
  imageOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "linear-gradient(to bottom, rgba(0, 77, 77, 0.4), rgba(0, 26, 26, 0.8))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    textAlign: "center",
  },
  brandTitle: {
    fontSize: "48px",
    fontWeight: "900",
    letterSpacing: "2px",
    margin: 0,
    textShadow: "0 4px 10px rgba(0,0,0,0.3)",
  },
  brandSlogan: {
    fontSize: "16px",
    opacity: 0.9,
    fontStyle: "italic",
  },
  rightSide: {
    flex: 1,
    padding: "50px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    background: "#fff",
  },
  form: {
    width: "100%",
  },
  header: {
    marginBottom: "35px",
  },
  title: {
    fontSize: "28px",
    color: "#004d4d",
    margin: 0,
    fontWeight: "800",
  },
  underline: {
    width: "50px",
    height: "4px",
    background: "#00b3b3",
    borderRadius: "2px",
    marginTop: "5px",
  },
  inputArea: {
    marginBottom: "20px",
  },
  inputGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "13px",
    fontWeight: "700",
    color: "#555",
    marginBottom: "8px",
    textTransform: "uppercase",
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    background: "#f0f7f7",
    borderRadius: "15px",
    padding: "0 15px",
    border: "1px solid #e0eeee",
    transition: "all 0.3s ease",
  },
  icon: {
    color: "#008080",
    fontSize: "18px",
  },
  input: {
    flex: 1,
    padding: "14px",
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "15px",
    color: "#333",
  },
  options: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "13px",
    marginBottom: "30px",
    color: "#666",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
  },
  forgot: {
    color: "#008080",
    fontWeight: "600",
    cursor: "pointer",
  },
  submitBtn: {
    width: "100%",
    padding: "16px",
    borderRadius: "15px",
    border: "none",
    background: "#008080",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "700",
    cursor: "pointer",
    boxShadow: "0 10px 20px rgba(0, 128, 128, 0.2)",
  },
  disabled: {
    background: "#ccc",
    boxShadow: "none",
  },
  footerText: {
    marginTop: "25px",
    textAlign: "center",
    fontSize: "14px",
    color: "#777",
  },
  link: {
    color: "#008080",
    textDecoration: "none",
    fontWeight: "700",
  },
  errorBox: {
    background: "#fff0f0",
    color: "#d9534f",
    padding: "12px",
    borderRadius: "12px",
    fontSize: "14px",
    marginBottom: "20px",
    borderLeft: "4px solid #d9534f",
  }
};