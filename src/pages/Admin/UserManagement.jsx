import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
    address: "",
    isActive: true,
  });

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ================= HANDLE FORM ================= */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
      address: "",
      isActive: true,
    });
    setAvatarFile(null);
    setEditingUser(null);
    setShowForm(false);
  };

  /* ================= UPLOAD AVATAR ================= */
  const uploadAvatar = async () => {
    if (!avatarFile) return editingUser?.avatar || "";

    const formDataUpload = new FormData();
    formDataUpload.append("image", avatarFile); // ⚠ phải trùng backend multer

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formDataUpload,
      });

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      return data.url || data.secure_url || "";
    } catch (err) {
      alert("Upload avatar thất bại");
      return editingUser?.avatar || "";
    } finally {
      setUploading(false);
    }
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let avatarUrl = editingUser?.avatar || "";

      if (avatarFile) {
        avatarUrl = await uploadAvatar();
      }

      const url = editingUser
        ? `http://localhost:5000/api/users/${editingUser._id}`
        : "http://localhost:5000/api/users";

      const method = editingUser ? "PUT" : "POST";

      const payload = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
        phone: formData.phone,
        address: formData.address,
        isActive: formData.isActive,
        avatar: avatarUrl,
        ...(formData.password && { password: formData.password }),
      };

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      alert(data.message || "Thành công");

      resetForm();
      fetchUsers();
    } catch {
      alert("Có lỗi xảy ra");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (user) => {
    setEditingUser(user);
    setAvatarFile(null);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
      isActive: user.isActive,
    });
    setShowForm(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa user này?")) return;

    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch {
      alert("Xóa thất bại");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>⏳ Đang tải...</p>;

  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quản lý người dùng</h2>

      <button style={styles.addBtn} onClick={() => setShowForm(true)}>
        + Thêm user
      </button>

      {/* ===== FORM ===== */}
      {showForm && (
        <form style={styles.form} onSubmit={handleSubmit}>
          <h3>{editingUser ? "Cập nhật user" : "Thêm user mới"}</h3>

          {/* AVATAR */}
          <div style={{ marginBottom: 12 }}>
            <label>Avatar</label>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img
                src={
                  avatarFile
                    ? URL.createObjectURL(avatarFile)
                    : editingUser?.avatar || "/data/default-avatar.png"
                }
                alt="avatar"
                style={{ width: 50, height: 50, borderRadius: "50%" }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setAvatarFile(e.target.files[0])}
              />
            </div>
            {uploading && <small>⏳ Đang upload ảnh...</small>}
          </div>

          <input
            style={styles.input}
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="email"
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <input
            style={styles.input}
            name="phone"
            placeholder="Số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="address"
            placeholder="Địa chỉ"
            value={formData.address}
            onChange={handleChange}
          />

          <input
            style={styles.input}
            name="password"
            type="password"
            placeholder={editingUser ? "Mật khẩu mới (nếu đổi)" : "Mật khẩu"}
            value={formData.password}
            onChange={handleChange}
            required={!editingUser}
          />

          <select
            style={styles.input}
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <label style={{ display: "flex", gap: 6 }}>
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            Kích hoạt tài khoản
          </label>

          <div style={{ marginTop: 12 }}>
            <button style={styles.saveBtn} type="submit">
              Lưu
            </button>
            <button
              style={styles.cancelBtn}
              type="button"
              onClick={resetForm}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* ===== TABLE ===== */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.thCenter}>Avatar</th>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.thCenter}>Role</th>
            <th style={styles.thCenter}>Phone</th>
            <th style={styles.thCenter}>Hành động</th>
          </tr>
        </thead>

        <tbody>
          {users.map((u) => (
            <tr key={u._id} style={styles.tr}>
              <td style={styles.tdCenter}>
                <img
                  src={u.avatar || "/data/default-avatar.png"}
                  alt="avatar"
                  style={styles.avatar}
                />
              </td>

              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.email}</td>

              <td style={styles.tdCenter}>
                <span
                  style={{
                    ...styles.roleBadge,
                    background: u.role === "admin" ? "#fee2e2" : "#dcfce7",
                    color: u.role === "admin" ? "#991b1b" : "#166534",
                  }}
                >
                  {u.role}
                </span>
              </td>

              <td style={styles.tdCenter}>{u.phone || "-"}</td>

              <td style={styles.tdCenter}>
                <div style={styles.actionGroup}>
                  <button
                    style={styles.editBtn}
                    onClick={() => handleEdit(u)}
                    title="Chỉnh sửa"
                  >
                    <i className="bi bi-pencil-square"></i>
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(u._id)}
                    title="Xóa"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: {
    padding: 24,
    background: "#f4f6f8",
    minHeight: "100vh",
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 16,
    color: "#333",
  },

  addBtn: {
    padding: "8px 18px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginBottom: 16,
  },

  form: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    marginBottom: 24,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },

  input: {
    width: "100%",
    padding: "10px 12px",
    marginBottom: 12,
    borderRadius: 6,
    border: "1px solid #ddd",
    fontSize: 14,
  },

  saveBtn: {
    background: "#007bff",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#6c757d",
    color: "#fff",
    padding: "8px 16px",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginLeft: 8,
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  },

  th: {
    padding: "14px 12px",
    background: "#f3f4f6",
    fontWeight: 600,
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
    fontSize: 14,
  },

  thCenter: {
    padding: "14px 12px",
    background: "#f3f4f6",
    fontWeight: 600,
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    fontSize: 14,
  },

  tr: {
    transition: "background 0.2s",
  },

  td: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    color: "#374151",
    fontSize: 14,
  },

  tdCenter: {
    padding: "12px",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "center",
    verticalAlign: "middle",
    fontSize: 14,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #e5e7eb",
  },

  /* ===== ROLE BADGE ===== */
  roleBadge: {
    padding: "4px 12px",
    borderRadius: 999,
    fontSize: 13,
    fontWeight: 600,
    textTransform: "capitalize",
    display: "inline-block",
  },

  /* ===== ACTION ===== */
  actionGroup: {
    display: "flex",
    justifyContent: "center",
    gap: 8,
  },

  editBtn: {
    background: "#facc15",
    border: "none",
    borderRadius: 8,
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    padding: "6px 8px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

