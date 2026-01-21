import { useEffect, useState } from "react";

/* ===== MAP LABEL ===== */
const STATUS_LABEL = {
  new: "Mới",
  processed: "Đã xử lý",
};

export default function AdminContact() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  /* ================= FETCH ================= */
  const fetchContacts = async () => {
    const res = await fetch("http://localhost:5000/api/contact");
    const data = await res.json();
    setContacts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  /* ================= ACTION ================= */
  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/contact/${id}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchContacts();
  };

  const deleteContact = async (id) => {
    if (!window.confirm("Xóa liên hệ này?")) return;
    await fetch(`http://localhost:5000/api/contact/${id}`, {
      method: "DELETE",
    });
    fetchContacts();
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-secondary">
        <i className="bi bi-hourglass-split me-2"></i>Đang tải dữ liệu...
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h3 className="mb-4">
        <i className="bi bi-envelope-paper-fill me-2"></i>
        Quản lý liên hệ
      </h3>

      <div className="table-responsive">
        <table className="table table-hover align-middle shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Người gửi</th>
              <th>Email</th>
              <th>SĐT</th>
              <th>Ngày gửi</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>

          <tbody>
            {contacts.map((c) => (
              <tr key={c._id}>
                <td>
                  <i className="bi bi-person-circle me-1"></i>
                  {c.name}
                </td>
                <td>{c.email}</td>
                <td>{c.phone || "-"}</td>
                <td>{new Date(c.createdAt).toLocaleString()}</td>
                <td>
                  <span
                    className={`badge ${
                      c.status === "new"
                        ? "bg-warning text-dark"
                        : "bg-success"
                    }`}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary rounded-circle me-2"
                    title="Xem chi tiết"
                    onClick={() => setSelected(c)}
                  >
                    <i className="bi bi-eye"></i>
                  </button>

                  {c.status === "new" && (
                    <button
                      className="btn btn-sm btn-outline-success rounded-circle me-2"
                      title="Đánh dấu đã xử lý"
                      onClick={() => updateStatus(c._id, "processed")}
                    >
                      <i className="bi bi-check2-circle"></i>
                    </button>
                  )}

                  <button
                    className="btn btn-sm btn-outline-danger rounded-circle"
                    title="Xóa"
                    onClick={() => deleteContact(c._id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}

            {contacts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center text-muted py-4">
                  <i className="bi bi-inbox me-2"></i>
                  Chưa có liên hệ nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL CHI TIẾT ================= */}
      {selected && (
        <div
          className="modal fade show"
          style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-envelope-open me-2"></i>
                  Chi tiết liên hệ
                </h5>
                <button
                  className="btn-close"
                  onClick={() => setSelected(null)}
                ></button>
              </div>

              <div className="modal-body">
                <p>
                  <b>👤 Người gửi:</b> {selected.name}
                </p>
                <p>
                  <b>📧 Email:</b> {selected.email}
                </p>
                <p>
                  <b>📞 SĐT:</b> {selected.phone || "-"}
                </p>
                <p>
                  <b>🕒 Thời gian:</b>{" "}
                  {new Date(selected.createdAt).toLocaleString()}
                </p>
                <hr />
                <p>
                  <b>📝 Nội dung:</b>
                </p>
                <p className="bg-light p-3 rounded">
                  {selected.message}
                </p>
              </div>

              <div className="modal-footer">
                {selected.status === "new" && (
                  <button
                    className="btn btn-success"
                    onClick={() => {
                      updateStatus(selected._id, "processed");
                      setSelected(null);
                    }}
                  >
                    <i className="bi bi-check-circle me-1"></i>
                    Đánh dấu đã xử lý
                  </button>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={() => setSelected(null)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
const styles = {
  container: {
    maxWidth: "1200px",
  },

  /* ===== TABLE ===== */
  table: {
    background: "#fff",
    borderRadius: "12px",
    overflow: "hidden",
  },

  theadTh: {
    fontWeight: 600,
    fontSize: "15px",
    color: "#374151",
    textTransform: "uppercase",
    letterSpacing: "0.03em",
  },

  tbodyTd: {
    verticalAlign: "middle",
    fontSize: "15px",
    color: "#374151",
  },

  tableRowHover: {
    transition: "background-color 0.2s ease",
  },

  tableRowHoverActive: {
    backgroundColor: "#f9fafb",
  },

  /* ===== BADGE ===== */
  badge: {
    fontSize: "13px",
    padding: "6px 10px",
    borderRadius: "999px",
  },

  badgeNew: {
    backgroundColor: "#facc15",
    color: "#1f2937",
  },

  badgeProcessed: {
    backgroundColor: "#22c55e",
    color: "#fff",
  },

  /* ===== ACTION BUTTON ===== */
  actionBtn: {
    width: "34px",
    height: "34px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "50%",
    transition: "all 0.2s ease",
  },

  /* ===== MODAL ===== */
  modalBackdrop: {
    background: "rgba(0,0,0,0.5)",
  },

  modalContent: {
    borderRadius: "14px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
  },

  modalHeader: {
    background: "#f8fafc",
    borderBottom: "1px solid #e5e7eb",
  },

  modalTitle: {
    fontWeight: 600,
  },

  modalBodyText: {
    fontSize: "15px",
    color: "#374151",
  },

  modalMessage: {
    background: "#f9fafb",
    borderLeft: "4px solid #0d6efd",
  },

  /* ===== EMPTY ===== */
  emptyText: {
    fontSize: "16px",
    color: "#6b7280",
  },
};
