import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatar: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const parsed = JSON.parse(storedUser);
    setUser(parsed);
    setForm({
      username: parsed.username || "",
      email: parsed.email || "",
      password: "",
      confirmPassword: "",
      avatar: parsed.avatar || "",
      phone: parsed.phone || "",
      address: parsed.address || "",
    });
  }, [navigate]);

  if (!user) return null;

  const uploadAvatar = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔴 Cần thay thế
    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // 🔴 Cần thay thế
        { method: "POST", body: data }
      );
      const result = await res.json();
      setForm({ ...form, avatar: result.secure_url });
    } catch (err) {
      alert("Lỗi upload ảnh");
    } finally {
      setUploading(false);
    }
  };

  const handleUpdate = async () => {
    if (form.password && form.password.length < 6) return alert("Mật khẩu phải ít nhất 6 ký tự");
    if (form.password !== form.confirmPassword) return alert("Mật khẩu xác nhận không khớp");

    try {
      setLoading(true);
      const userId = user.id || user._id;
      const payload = {
        username: form.username,
        email: form.email,
        phone: form.phone,
        address: form.address,
        ...(form.avatar && { avatar: form.avatar }),
        ...(form.password && { password: form.password }),
      };

      const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      const updatedUser = { ...user, ...payload, avatar: payload.avatar ?? user.avatar };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setEditing(false);
      alert("Cập nhật hồ sơ thành công 🌿");
    } catch {
      alert("Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Dữ liệu của bạn sẽ biến mất vĩnh viễn. Bạn chắc chắn muốn xóa tài khoản?")) return;
    try {
      const userId = user.id || user._id;
      await fetch(`http://localhost:5000/api/users/${userId}`, { method: "DELETE" });
      localStorage.clear();
      navigate("/register");
    } catch {
      alert("Không thể xóa tài khoản");
    }
  };

  const bubbles = Array.from({ length: 8 });

  return (
    <div style={styles.container}>
      {/* Hiệu ứng bong bóng */}
      {bubbles.map((_, i) => (
        <motion.div key={i} style={{ ...styles.bubble, left: `${i * 15}%` }}
          animate={{ y: [0, -1000], opacity: [0, 0.3, 0] }}
          transition={{ duration: Math.random() * 5 + 5, repeat: Infinity, delay: i }}
        />
      ))}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={styles.card}>
        {/* HEADER PROFILE */}
        <div style={styles.header}>
          <div style={styles.avatarWrapper}>
            <img src={form.avatar || user.avatar || "https://via.placeholder.com/150"} alt="Avatar" style={styles.avatar} />
            {editing && (
              <label style={styles.uploadBtn}>
                <i className="bi bi-camera-fill"></i>
                <input type="file" hidden onChange={(e) => uploadAvatar(e.target.files[0])} />
              </label>
            )}
            {uploading && <div style={styles.uploadOverlay}><div className="spinner-border text-light spinner-border-sm"></div></div>}
          </div>
          <h2 style={styles.userName}>{user.username}</h2>
          <span style={styles.userRole}>{user.role === 'admin' ? ' Quản trị viên' : ' Thành viên AquaWorld'}</span>
        </div>

        {/* CONTENT */}
        <div style={styles.content}>
          <div style={styles.infoGrid}>
            {[
              { label: "Tên đăng nhập", key: "username", icon: "bi-person", type: "text" },
              { label: "Địa chỉ Email", key: "email", icon: "bi-envelope", type: "email" },
              { label: "Số điện thoại", key: "phone", icon: "bi-telephone", type: "text" },
              { label: "Địa chỉ liên hệ", key: "address", icon: "bi-geo-alt", type: "text" },
            ].map((field) => (
              <div key={field.key} style={styles.inputBox}>
                <label style={styles.label}><i className={`bi ${field.icon}`}></i> {field.label}</label>
                <input
                  style={{ ...styles.input, ...(editing ? styles.inputActive : {}) }}
                  disabled={!editing}
                  type={field.type}
                  value={form[field.key]}
                  onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                />
              </div>
            ))}
          </div>

          <AnimatePresence>
            {editing && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: "hidden" }}>
                <div style={styles.divider}>Đổi mật khẩu (Nếu cần)</div>
                <div style={styles.infoGrid}>
                  <div style={styles.inputBox}>
                    <label style={styles.label}><i className="bi bi-key"></i> Mật khẩu mới</label>
                    <input style={{ ...styles.input, ...styles.inputActive }} type="password" placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                  </div>
                  <div style={styles.inputBox}>
                    <label style={styles.label}><i className="bi bi-shield-check"></i> Xác nhận lại</label>
                    <input style={{ ...styles.input, ...styles.inputActive }} type="password" placeholder="••••••••" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ACTIONS */}
        <div style={styles.actions}>
          {!editing ? (
            <div style={styles.buttonGroup}>
              <button style={styles.btnEdit} onClick={() => setEditing(true)}>
                <i className="bi bi-pencil-square"></i> Chỉnh sửa hồ sơ
              </button>
              <div style={styles.flexRow}>
                <button style={styles.btnHome} onClick={() => navigate("/")}>Trang chủ</button>
                <button style={styles.btnDelete} onClick={handleDelete}>Xóa tài khoản</button>
              </div>
            </div>
          ) : (
            <div style={styles.buttonGroup}>
              <button style={styles.btnSave} onClick={handleUpdate} disabled={loading}>
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
              <button style={styles.btnCancel} onClick={() => setEditing(false)}>Hủy bỏ</button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(180deg, #004d4d 0%, #001a1a 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
    position: "relative",
    overflow: "hidden",
    fontFamily: "'Inter', sans-serif",
  },
  bubble: {
    position: "absolute",
    bottom: -100,
    width: "20px",
    height: "20px",
    background: "rgba(255, 255, 255, 0.1)",
    borderRadius: "50%",
  },
  card: {
    width: "100%",
    maxWidth: "800px",
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "32px",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    overflow: "hidden",
    zIndex: 10,
  },
  header: {
    background: "linear-gradient(to bottom, #f0fdfa, #fff)",
    padding: "40px 0 20px",
    textAlign: "center",
    borderBottom: "1px solid #f0f0f0",
  },
  avatarWrapper: {
    position: "relative",
    width: "120px",
    height: "120px",
    margin: "0 auto 15px",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    boxShadow: "0 10px 20px rgba(0,128,128,0.2)",
  },
  uploadBtn: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    background: "#008080",
    color: "#fff",
    width: "35px",
    height: "35px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    border: "3px solid #fff",
    transition: "0.3s",
  },
  uploadOverlay: {
    position: "absolute",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.4)",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  userName: { margin: "0", fontSize: "24px", color: "#004d4d", fontWeight: "800" },
  userRole: { fontSize: "14px", color: "#666", fontWeight: "600" },
  content: { padding: "30px 40px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" },
  inputBox: { marginBottom: "15px" },
  label: { display: "block", fontSize: "12px", fontWeight: "700", color: "#008080", marginBottom: "6px", textTransform: "uppercase" },
  input: {
    width: "100%",
    padding: "12px 15px",
    borderRadius: "12px",
    border: "1.5px solid transparent",
    background: "#f8fafc",
    fontSize: "15px",
    color: "#334155",
    transition: "0.3s",
  },
  inputActive: {
    background: "#fff",
    border: "1.5px solid #008080",
    boxShadow: "0 0 0 4px rgba(0,128,128,0.05)",
  },
  divider: { margin: "20px 0", fontSize: "13px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "10px" },
  actions: { padding: "0 40px 40px" },
  buttonGroup: { display: "flex", flexDirection: "column", gap: "12px" },
  flexRow: { display: "flex", gap: "12px" },
  btnEdit: {
    background: "#008080", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", fontSize: "16px"
  },
  btnSave: {
    background: "#10b981", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", cursor: "pointer"
  },
  btnCancel: {
    background: "#f1f5f9", color: "#475569", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", cursor: "pointer"
  },
  btnHome: {
    flex: 1, background: "#f1f5f9", color: "#475569", border: "none", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer"
  },
  btnDelete: {
    flex: 1, background: "#fff1f2", color: "#e11d48", border: "none", padding: "12px", borderRadius: "12px", fontWeight: "600", cursor: "pointer"
  },
};