import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
    } else {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      setForm({
        username: parsed.username || "",
        email: parsed.email || "",
        password: "",
        confirmPassword: "",
      });
    }
  }, [navigate]);

  if (!user) return null;

  /* ===== UPDATE PROFILE ===== */
  const handleUpdate = async () => {
    if (form.password && form.password.length < 6) {
      return alert("❌ Mật khẩu phải ít nhất 6 ký tự");
    }

    if (form.password !== form.confirmPassword) {
      return alert("❌ Mật khẩu xác nhận không khớp");
    }

    try {
      const userId = user._id || user.id;

      const payload = {
        username: form.username,
        email: form.email,
        ...(form.password && { password: form.password }),
      };

      const res = await fetch(
        `http://localhost:5000/api/users/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error();

      const updatedUser = {
        ...user,
        username: form.username,
        email: form.email,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      setForm((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
      }));

      alert("✅ Cập nhật thông tin thành công");
    } catch {
      alert("❌ Không thể cập nhật thông tin");
    }
  };

  /* ===== DELETE ACCOUNT ===== */
  const handleDelete = async () => {
    if (!window.confirm("⚠ Bạn chắc chắn muốn xóa tài khoản?")) return;

    try {
      const userId = user._id || user.id;
      await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });

      localStorage.clear();
      navigate("/register");
    } catch {
      alert("❌ Không thể xóa tài khoản");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          <i className="bi bi-person-circle"></i> Hồ sơ cá nhân
        </h2>

        <div style={styles.field}>
          <label>
            <i className="bi bi-person"></i> Tên người dùng
          </label>
          <input
            type="text"
            disabled={!editing}
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
          />
        </div>

        <div style={styles.field}>
          <label>
            <i className="bi bi-envelope"></i> Email
          </label>
          <input
            type="email"
            disabled={!editing}
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />
        </div>

        {editing && (
          <>
            <div style={styles.field}>
              <label>
                <i className="bi bi-lock"></i> Mật khẩu mới
              </label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <div style={styles.field}>
              <label>
                <i className="bi bi-shield-lock"></i> Xác nhận mật khẩu
              </label>
              <input
                type="password"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </div>
          </>
        )}

        {!editing ? (
          <>
            <button
              style={styles.editBtn}
              onClick={() => setEditing(true)}
            >
              <i className="bi bi-pencil-square"></i> Chỉnh sửa
            </button>

            <button
              style={styles.backBtn}
              onClick={() => navigate("/")}
            >
              <i className="bi bi-house"></i> Trang chủ
            </button>

            <button
              style={styles.deleteBtn}
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i> Xóa tài khoản
            </button>
          </>
        ) : (
          <>
            <button
              style={styles.saveBtn}
              onClick={handleUpdate}
            >
              <i className="bi bi-save"></i> Lưu thay đổi
            </button>

            <button
              style={styles.cancelBtn}
              onClick={() => setEditing(false)}
            >
              <i className="bi bi-x-circle"></i> Hủy
            </button>
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage: "url('/data/banner01.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },


  card: {
    width: "100%",
    maxWidth: 420,
    background: "rgba(255,255,255,0.95)",
    padding: 28,
    borderRadius: 14,
    boxShadow: "0 8px 25px rgba(0,0,0,0.25)",
    backdropFilter: "blur(4px)",
  },


  title: {
    textAlign: "center",
    marginBottom: 24,
    color: "#dc3545",
  },

  field: {
    marginBottom: 14,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },

  editBtn: {
    width: "100%",
    padding: 10,
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    marginBottom: 10,
    cursor: "pointer",
  },

  saveBtn: {
    width: "100%",
    padding: 10,
    background: "#198754",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    marginBottom: 10,
    cursor: "pointer",
  },

  cancelBtn: {
    width: "100%",
    padding: 10,
    background: "#6c757d",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    marginBottom: 10,
    cursor: "pointer",
  },

  backBtn: {
    width: "100%",
    padding: 10,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 8,
    marginBottom: 10,
    cursor: "pointer",
  },

  deleteBtn: {
    width: "100%",
    padding: 10,
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
