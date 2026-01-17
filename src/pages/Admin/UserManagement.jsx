import { useEffect, useState } from "react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  /* ================= FETCH USERS ================= */
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      username: "",
      email: "",
      password: "",
      role: "user",
    });
    setEditingUser(null);
    setShowForm(false);
  };

  /* ================= CREATE / UPDATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editingUser
        ? `http://localhost:5000/api/users/${editingUser._id}`
        : "http://localhost:5000/api/users";

      const method = editingUser ? "PUT" : "POST";

      const bodyData = editingUser
        ? { username: formData.username, email: formData.email, role: formData.role }
        : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await res.json();
      alert(data.message || "Thành công");

      resetForm();
      fetchUsers();
    } catch (err) {
      alert("Có lỗi xảy ra");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      password: "",
      role: user.role,
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
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  if (loading) return <p>Đang tải...</p>;

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

          {!editingUser && (
            <input
              style={styles.input}
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          )}

          <select
            style={styles.input}
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div>
            <button style={styles.saveBtn} type="submit">
              Lưu
            </button>
            <button style={styles.cancelBtn} type="button" onClick={resetForm}>
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* ===== TABLE ===== */}
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Hành động</th>
          </tr>
        </thead>

          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td style={styles.td}>{u.username}</td>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.role}</td>
                <td style={styles.td}>
                  <button style={styles.editBtn} onClick={() => handleEdit(u)}>
                    Sửa
                  </button>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete(u._id)}
                  >
                    Xóa
                  </button>
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
    padding: "24px",
    background: "#f4f6f8",
    minHeight: "100vh",
    // fontFamily: "Arial, sans-serif",
  },

  title: {
    fontSize: "22px",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#333",
  },
  addBtn: {
    padding: "8px 16px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
    marginBottom: 15,
  },
  form: {
    background: "#fff",
    padding: 15,
    borderRadius: 6,
    marginBottom: 20,
    boxShadow: "0 0 8px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: 8,
    marginBottom: 10,
  },
  saveBtn: {
    background: "#007bff",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    marginRight: 8,
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    background: "#fff",
    borderRadius: "10px",
    borderCollapse: "collapse",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },

  thead: {
    background: "#f1f5f9",
  },

  th: {
    padding: "12px",
    textAlign: "left",
    fontSize: "16px",
    textAlign: "center",
    fontWeight: "600",
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
  },

  td: {
    padding: "12px",
    fontSize: "16px",
    textAlign: "center",
    color: "#374151",
    borderBottom: "1px solid #f1f5f9",
  },

  rowHover: {
    background: "#f9fafb",
  },
  editBtn: {
    background: "#ffc107",
    border: "none",
    borderRadius: 6,
    padding: "5px 8px",
    marginRight: 5,
    cursor: "pointer",
  },
  deleteBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "5px 8px",
    cursor: "pointer",
  },
};
