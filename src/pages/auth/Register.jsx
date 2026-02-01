import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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
        body: JSON.stringify({
          username,
          email,
          password,
          phone,
          address,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Đăng ký thất bại");
      }

      alert("🎉 Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.box} onSubmit={handleSubmit}>
        <h2 style={styles.title}>📝 Đăng ký tài khoản</h2>

        {error && <p style={styles.error}>{error}</p>}

        <input
          style={styles.input}
          name="username"
          placeholder="Tên đăng nhập *"
          value={form.username}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="email"
          name="email"
          placeholder="Email *"
          value={form.email}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="phone"
          placeholder="Số điện thoại"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          name="address"
          placeholder="Địa chỉ"
          value={form.address}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="password"
          placeholder="Mật khẩu *"
          value={form.password}
          onChange={handleChange}
        />

        <input
          style={styles.input}
          type="password"
          name="confirmPassword"
          placeholder="Nhập lại mật khẩu *"
          value={form.confirmPassword}
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
          {loading ? "⏳ Đang xử lý..." : "Đăng ký"}
        </button>

        <p style={styles.loginLink}>
          Đã có tài khoản?{" "}
          <Link to="/login" style={styles.link}>
            Đăng nhập
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

  loginLink: {
    textAlign: "center",
    marginTop: "15px",
  },

  link: {
    color: "#0d6efd",
    textDecoration: "none",
    fontWeight: "500",
  },
};
