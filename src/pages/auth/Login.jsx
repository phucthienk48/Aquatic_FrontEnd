import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

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

      if (!res.ok || result.success === false) {
        throw new Error(result.message || "Đăng nhập thất bại");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem(
      "user",
      JSON.stringify({
        id: result.user._id || result.user.id,
        username: result.user.username,
        email: result.user.email,
        role: result.user.role,
        avatar: result.user.avatar || "",
        phone: result.user.phone || "",
        address: result.user.address || "",
        password: result.user.password, // giữ nguyên nếu backend trả
      })
    );


      alert("Đăng nhập thành công!");
      
      // window.location.href = "/";
    //  Điều hướng theo role
    if (result.user.role === "admin") {
      navigate("/admin");
    } else {
      window.location.href = "/";
    }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }``
  };

  return (
    <div style={styles.container}>
      <form style={styles.box} onSubmit={handleSubmit}>
        <h2 style={styles.title}>
        <i className="bi bi-shield-lock-fill" style={{ marginRight: "8px" }}></i>
          Đăng nhập
        </h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Mật khẩu"
          value={form.password}
          onChange={handleChange}
        />

        <button
          type="submit"
          style={{
            ...styles.button,
            ...(loading ? styles.buttonDisabled : {}),
          }}
          disabled={loading}
        >
          {loading ? "⏳ Đang xử lý..." : "Đăng nhập"}
        </button>

        <p style={styles.registerLink}>
          Chưa có tài khoản?{" "}
          <Link to="/register" style={styles.link}>
            Đăng ký ngay
          </Link>
        </p>
      </form>
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "80vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f1f5f9",
    fontFamily: '"Times New Roman", Times, serif',
  },

  box: {
    width: "100%",
    maxWidth: "420px",
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 15px rgba(0,0,0,0.1)",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#0d6efd",
  },

  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },

  button: {
    width: "100%",
    padding: "12px",
    border: "none",
    borderRadius: "6px",
    background: "#0d6efd",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
  },

  buttonDisabled: {
    background: "#999",
    cursor: "not-allowed",
  },

  error: {
    background: "#ffe5e5",
    color: "#dc3545",
    padding: "10px",
    borderRadius: "6px",
    marginBottom: "15px",
    textAlign: "center",
  },

  registerLink: {
    textAlign: "center",
    marginTop: "15px",
  },

  link: {
    color: "#0d6efd",
    textDecoration: "none",
    fontWeight: "500",
  },
};
