import { useEffect, useState } from "react";
import socket from "../../socket/socket";

const API = "http://localhost:5000/api/livestream";
const UPLOAD_API = "http://localhost:5000/api/upload";

export default function AdminLivestreamPage() {
  const [rooms, setRooms] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    thumbnail: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const loadRooms = async () => {
    const res = await fetch(API);
    const data = await res.json();
    setRooms(data);
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const uploadThumbnail = async () => {
    if (!imageFile) return form.thumbnail;

    const fd = new FormData();
    fd.append("image", imageFile);

    setUploading(true);
    const res = await fetch(UPLOAD_API, {
      method: "POST",
      body: fd,
    });

    const data = await res.json();
    setUploading(false);

    return data.url;
  };

  const handleCreate = async () => {
    if (!form.title.trim()) {
      alert("Vui lòng nhập tiêu đề livestream");
      return;
    }

    let thumbnailUrl = form.thumbnail;
    if (imageFile) thumbnailUrl = await uploadThumbnail();

    const payload = {
      title: form.title,
      description: form.description,
      thumbnail: thumbnailUrl || "",
    };

    await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    loadRooms();
  };

  /* UPDATE */
  const handleUpdate = async () => {
    let thumbnailUrl = form.thumbnail;
    if (imageFile) thumbnailUrl = await uploadThumbnail();

    await fetch(`${API}/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        thumbnail: thumbnailUrl,
      }),
    });

    resetForm();
    loadRooms();
  };

  /* ACTIONS  */
  const startLive = async (id) => {
    await fetch(`${API}/${id}/start`, { method: "PUT" });

    //  emit socket
    socket.emit("startLivestream", id);

    loadRooms();
  };


  const endLive = async (id) => {
    await fetch(`${API}/${id}/end`, { method: "PUT" });

    //  emit socket
    socket.emit("endLivestream", id);

    loadRooms();
  };


  const deleteRoom = async (id) => {
    if (!window.confirm("Xóa phòng livestream này?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    loadRooms();
  };

  const handleEdit = (room) => {
    setEditingId(room._id);
    setShowCreate(true);
    setForm({
      title: room.title,
      description: room.description || "",
      thumbnail: room.thumbnail || "",
    });
  };

  const resetForm = () => {
    setForm({ title: "", description: "", thumbnail: "" });
    setImageFile(null);
    setEditingId(null);
    setShowCreate(false);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 style={styles.pageTitle}>
          <i className="bi bi-broadcast" style={styles.titleIcon}></i>
          QUẢN LÝ LIVESTREAM
        </h2>

        <button
          className="btn btn-primary"
          onClick={() => setShowCreate(!showCreate)}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Tạo livestream
        </button>
      </div>

      {/* FORM CREATE / EDIT */}
      {showCreate && (
        <div className="card shadow-sm mb-4">
          <div className="card-body">
            <h6 className="mb-3">
              <i className="bi bi-pencil-square me-1"></i>
              {editingId ? "Chỉnh sửa livestream" : "Tạo livestream"}
            </h6>

            <input
              className="form-control mb-2"
              placeholder="Tiêu đề livestream"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />

            <textarea
              className="form-control mb-2"
              rows={2}
              placeholder="Mô tả"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="file"
              className="form-control mb-2"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />

            {form.thumbnail && (
              <img
                src={form.thumbnail}
                alt=""
                style={{
                  width: 140,
                  borderRadius: 8,
                  marginBottom: 10,
                }}
              />
            )}

            <div className="text-end">
              <button
                className="btn btn-success me-2"
                onClick={editingId ? handleUpdate : handleCreate}
                disabled={uploading}
              >
                <i className="bi bi-save me-1"></i>
                {uploading ? "Đang upload..." : "Lưu"}
              </button>

              <button
                className="btn btn-secondary"
                onClick={resetForm}
              >
                <i className="bi bi-x-circle me-1"></i>
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}

      {rooms.map((room) => {
        const isLive = room.status === "live";

        return (
          <div
            key={room._id}
            className="card"
            style={styles.card(isLive)}
          >
            <div className="card-body" style={styles.cardBody}>
              <img
                src={
                  room.thumbnail ||
                  "https://via.placeholder.com/120x80?text=No+Image"
                }
                alt="thumbnail"
                style={styles.thumbnail}
              />

              {/* INFO */}
              <div style={{ flex: 1 }}>
                <h6 style={styles.title}>{room.title}</h6>
                <span
                  className="badge"
                  style={isLive ? styles.badgeLive : styles.badgeEnd}
                >
                  {isLive ? "🔴 Đang live" : "⏹ Đã kết thúc"}
                </span>
              </div>

              {/* ACTIONS */}
              <div style={styles.actions}>
                <button
                  className="btn btn-outline-warning btn-sm"
                  onClick={() => handleEdit(room)}
                >
                  <i className="bi bi-pencil me-1"></i>
                  Sửa
                </button>

                {isLive ? (
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => endLive(room._id)}
                  >
                    <i className="bi bi-stop-fill me-1"></i>
                    Kết thúc
                  </button>
                ) : (
                  <>
                    <button
                      className="btn btn-outline-success btn-sm"
                      onClick={() => startLive(room._id)}
                    >
                      <i className="bi bi-play-fill me-1"></i>
                      Bắt đầu
                    </button>

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={() => deleteRoom(room._id)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Xóa
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}


    </div>
  );
}
const styles = {
  card: (isLive) => ({
    borderRadius: 12,
    marginBottom: 16,
    borderLeft: isLive ? "6px solid #dc3545" : "1px solid #dee2e6",
    transition: "all 0.2s ease",
    backgroundColor: "#fff",
  }),

  cardHover: {
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    transform: "translateY(-2px)",
  },
  pageTitle: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    fontSize: 26,
    fontWeight: 700,
    padding: "12px 18px",
    background: "#eff6ff",
    color: "#1e40af",
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
    textTransform: "uppercase",
  },

  titleIcon: {
    fontSize: 30,
    color: "#3b82f6",
  },
  cardBody: {
    display: "flex",
    alignItems: "center",
    gap: 16,
  },

  thumbnail: {
    width: 120,
    height: 80,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #eee",
    backgroundColor: "#f8f9fa",
  },

  title: {
    marginBottom: 4,
    fontWeight: 600,
  },

  badgeLive: {
    backgroundColor: "#dc3545",
  },

  badgeEnd: {
    backgroundColor: "#6c757d",
  },

  actions: {
    display: "flex",
    gap: 8,
  },
};
