import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

  /* ================= LOAD USER ================= */
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

  /* ================= CLOUDINARY UPLOAD ================= */
  const uploadAvatar = async (file) => {
    setUploading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔴 sửa
    data.append("folder", "avatars");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // 🔴 sửa
      { method: "POST", body: data }
    );

    const result = await res.json();
    setUploading(false);

    return result.secure_url;
  };

  /* ================= UPDATE PROFILE ================= */
  const handleUpdate = async () => {
    if (form.password && form.password.length < 6) {
      return alert("Mật khẩu phải ít nhất 6 ký tự");
    }

    if (form.password !== form.confirmPassword) {
      return alert("Mật khẩu xác nhận không khớp");
    }

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
        ...payload,
        avatar: payload.avatar ?? user.avatar,
      };

      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setEditing(false);
      alert("Cập nhật thông tin thành công");
    } catch {
      alert("Không thể cập nhật thông tin");
    } finally {
      setLoading(false);
    }
  };


  /* ================= DELETE ACCOUNT ================= */
  const handleDelete = async () => {
    if (!window.confirm("Bạn chắc chắn muốn xóa tài khoản?")) return;

    try {
      const userId = user.id || user._id;
      await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: "DELETE",
      });

      localStorage.clear();
      navigate("/register");
    } catch {
      alert("Không thể xóa tài khoản");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h4 style={styles.title}>
          <i className="bi bi-person-circle"></i> Hồ sơ cá nhân
        </h4>

        {/* ===== AVATAR ===== */}
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <img
            src={user.avatar || "/data/default-avatar.png"}
            alt="avatar"
            style={styles.avatar}
          />

          {editing && (
            <div>
              <input
                type="file"
                accept="image/*"
                className="form-control mt-2"
                onChange={async (e) => {
                  const url = await uploadAvatar(e.target.files[0]);
                  setForm({ ...form, avatar: url });
                }}
              />
              {uploading && (
                <small className="text-muted">Đang upload ảnh...</small>
              )}
            </div>
          )}
        </div>

        {/* ===== INPUTS ===== */}
        {[
          { label: "Tên người dùng", key: "username", icon: "bi-person" },
          { label: "Email", key: "email", icon: "bi-envelope" },
          { label: "Số điện thoại", key: "phone", icon: "bi-telephone" },
          { label: "Địa chỉ", key: "address", icon: "bi-geo-alt" },
        ].map((item) => (
          <div key={item.key} style={styles.field}>
            <label>
              <i className={`bi ${item.icon}`}></i> {item.label}
            </label>
            <input
              className="form-control"
              disabled={!editing}
              value={form[item.key]}
              onChange={(e) =>
                setForm({ ...form, [item.key]: e.target.value })
              }
            />
          </div>
        ))}

        {editing && (
          <>
            <div style={styles.field}>
              <label>
                <i className="bi bi-lock"></i> Mật khẩu mới
              </label>
              <input
                type="password"
                className="form-control"
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
                className="form-control"
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({ ...form, confirmPassword: e.target.value })
                }
              />
            </div>
          </>
        )}

        {/* ===== BUTTONS ===== */}
        {!editing ? (
          <>
            <button
              className="btn btn-primary w-100 mb-2"
              onClick={() => setEditing(true)}
            >
              <i className="bi bi-pencil-square"></i> Chỉnh sửa
            </button>

            <button
              className="btn btn-outline-secondary w-100 mb-2"
              onClick={() => navigate("/")}
            >
              <i className="bi bi-house"></i> Trang chủ
            </button>

            <button
              className="btn btn-danger w-100"
              onClick={handleDelete}
            >
              <i className="bi bi-trash"></i> Xóa tài khoản
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-success w-100 mb-2"
              onClick={handleUpdate}
              disabled={loading}
            >
              <i className="bi bi-save"></i> Lưu thay đổi
            </button>

            <button
              className="btn btn-secondary w-100"
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

/* ================= STYLES ================= */

const styles = {
  container: {
    minHeight: "100vh",
    background: "#e0f2fe",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 420,
    background: "#fff",
    padding: 28,
    borderRadius: 14,
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
    color: "#0284c7",
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: "50%",
    objectFit: "cover",
    border: "3px solid #0284c7",
  },
  field: {
    marginBottom: 12,
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
};
