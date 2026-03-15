import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/knowledge";
const UPLOAD_URL = "http://localhost:5000/api/upload";

export default function AdminKnowledge() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    knowledgeId: "",
    title: "",
    summary: "",
    img: "",
    _imgFile: null,
    _imgPreview: "",
    instructions: [
      { heading: "", content: "", image: "", _file: null, _preview: "" },
    ],
  };

  const [form, setForm] = useState(emptyForm);

  /* ================= FETCH ================= */
  const fetchData = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setList(data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  /* ================= UPLOAD ================= */
  const uploadImage = async (file) => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("image", file);

    setUploading(true);
    const res = await fetch(UPLOAD_URL, { method: "POST", body: fd });
    const data = await res.json();
    setUploading(false);

    return data.url;
  };

  /* ================= FORM HANDLER ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleInstructionChange = (i, field, value) => {
    const copy = [...form.instructions];
    copy[i][field] = value;
    setForm({ ...form, instructions: copy });
  };

  const addInstruction = () =>
    setForm({
      ...form,
      instructions: [
        ...form.instructions,
        { heading: "", content: "", image: "", _file: null, _preview: "" },
      ],
    });

  const removeInstruction = (i) =>
    setForm({
      ...form,
      instructions: form.instructions.filter((_, idx) => idx !== i),
    });

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    let coverImg = form.img;
    if (form._imgFile) coverImg = await uploadImage(form._imgFile);

    const instructions = await Promise.all(
      form.instructions.map(async (ins) => ({
        heading: ins.heading,
        content: ins.content,
        image: ins._file ? await uploadImage(ins._file) : ins.image,
      }))
    );

    const payload = {
      knowledgeId: form.knowledgeId,
      title: form.title,
      summary: form.summary,
      img: coverImg,
      instructions,
    };

    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_URL}/${editingId}` : API_URL;

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    fetchData();
  };

  /* ================= CRUD ================= */
  const handleEdit = async (knowledgeId) => {
    const res = await fetch(`${API_URL}/${knowledgeId}`);
    const data = await res.json();

    setForm({
      ...data.data,
      _imgFile: null,
      _imgPreview: "",
      instructions: data.data.instructions.map((i) => ({
        ...i,
        _file: null,
        _preview: "",
      })),
    });

    setEditingId(knowledgeId);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (knowledgeId) => {
    if (!window.confirm("Xóa bài viết này?")) return;
    await fetch(`${API_URL}/${knowledgeId}`, { method: "DELETE" });
    fetchData();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      <h3 style={styles.pageTitle}>
        <i className="bi bi-journal-text" style={styles.titleIcon}></i>
        Quản lý kiến thức nuôi cá
      </h3>

      {/* ===== ADD BUTTON ===== */}
      <div className="text-end mb-3">
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          <i className="bi bi-plus-circle me-1"></i> Thêm bài viết
        </button>
      </div>

      {/* ===== FORM ===== */}
      {showForm && (
        <form className="card shadow-sm border-0 mb-4" onSubmit={handleSubmit}>
          <div
            className={`card-header ${
              editingId ? "bg-warning" : "bg-primary"
            } text-white`}
          >
            <i
              className={`bi ${
                editingId ? "bi-pencil" : "bi-plus-circle"
              } me-2`}
            ></i>
            {editingId ? "Chỉnh sửa bài viết" : "Thêm bài viết mới"}
          </div>

          <div className="card-body row g-3">
            <div className="col-md-4">
              <label className="form-label">Knowledge ID</label>
              <input
                className="form-control"
                name="knowledgeId"
                value={form.knowledgeId}
                onChange={handleChange}
                disabled={!!editingId}
                required
              />
            </div>

            <div className="col-md-8">
              <label className="form-label">Tiêu đề</label>
              <input
                className="form-control"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Tóm tắt</label>
              <textarea
                className="form-control"
                rows="2"
                name="summary"
                value={form.summary}
                onChange={handleChange}
                required
              />
            </div>

            {/* COVER */}
            <div className="col-md-6">
              <label className="form-label">Ảnh đại diện</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  setForm({
                    ...form,
                    _imgFile: file,
                    _imgPreview: URL.createObjectURL(file),
                  });
                }}
              />
              {(form._imgPreview || form.img) && (
                <img
                  src={form._imgPreview || form.img}
                  style={styles.coverPreview}
                />
              )}
            </div>

            {/* INSTRUCTIONS */}
            <div className="col-12">
              <h5>Nội dung hướng dẫn</h5>
              {form.instructions.map((ins, i) => (
                <div key={i} className="border rounded p-3 mb-3">
                  <input
                    className="form-control mb-2"
                    placeholder="Heading"
                    value={ins.heading}
                    onChange={(e) =>
                      handleInstructionChange(i, "heading", e.target.value)
                    }
                    required
                  />
                  <textarea
                    className="form-control mb-2"
                    placeholder="Nội dung"
                    value={ins.content}
                    onChange={(e) =>
                      handleInstructionChange(i, "content", e.target.value)
                    }
                    required
                  />
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const copy = [...form.instructions];
                      copy[i]._file = file;
                      copy[i]._preview = URL.createObjectURL(file);
                      setForm({ ...form, instructions: copy });
                    }}
                  />
                  {(ins._preview || ins.image) && (
                    <img
                      src={ins._preview || ins.image}
                      style={styles.sectionImage}
                    />
                  )}

                  {form.instructions.length > 1 && (
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger mt-2"
                      onClick={() => removeInstruction(i)}
                    >
                      Xóa section
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="btn btn-outline-primary"
                onClick={addInstruction}
              >
                <i className="bi bi-plus-circle me-1"></i>Thêm section
              </button>
            </div>
          </div>

          <div className="card-footer text-end">
            {uploading && (
              <span className="text-warning me-3">Đang upload ảnh...</span>
            )}
            <button className="btn btn-success me-2">
              {editingId ? "Cập nhật" : "Tạo mới"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* ===== LIST ===== */}
      <div className="card shadow-sm border-0">
        <div style={styles.cardHeader}>
          <i className="bi bi-journal-text" style={{ marginRight: 8 }}></i>
          Danh sách bài viết
        </div>
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th width="160">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item) => (
              <tr key={item._id}>
                <td>{item.knowledgeId}</td>
                <td>{item.title}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(item.knowledgeId)}
                  >
                    <i className="bi bi-pencil me-1"></i> Sửa
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item.knowledgeId)}
                  >
                    <i className="bi bi-trash me-1"></i> Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
const styles = {
  container: {
    maxWidth: 1200,
    margin: "auto",
    padding: 30,
    background: "#f8fafc",
  },
cardHeader: {
  background: "linear-gradient(135deg, #60a5fa, #3b82f6)",
  color: "#0d0808",
  fontWeight: 600,
  fontSize: 20,
  padding: "14px 18px",
  borderTopLeftRadius: 12,
  borderTopRightRadius: 12,
  display: "flex",
  alignItems: "center",
},
  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 24,
    color: "#1f2937",
    display: "flex",
    alignItems: "center",
    gap: 10,
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
  form: {
    background: "#ffffff",
    padding: 26,
    borderRadius: 14,
    boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
    marginBottom: 40,
    display: "flex",
    flexDirection: "column",
    gap: 14,
    border: "1px solid #e5e7eb",
  },

  formTitle: {
    fontSize: 18,
    fontWeight: 600,
    color: "#111827",
  },

  subTitle: {
    marginTop: 10,
    fontWeight: 600,
    color: "#2563eb",
  },

  section: {
    border: "1px dashed #d1d5db",
    borderRadius: 10,
    padding: 14,
    background: "#f9fafb",
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  addBtn: {
    background: "#eff6ff",
    border: "1px dashed #3b82f6",
    padding: "8px 10px",
    borderRadius: 6,
    cursor: "pointer",
    color: "#2563eb",
    fontWeight: 600,
    transition: "all .2s",
  },

  removeBtn: {
    alignSelf: "flex-end",
    background: "#fff",
    border: "none",
    color: "#ef4444",
    cursor: "pointer",
    fontWeight: 500,
  },

  actions: {
    display: "flex",
    gap: 12,
    marginTop: 12,
  },

  saveBtn: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#9ca3af",
    color: "#fff",
    border: "none",
    padding: "8px 18px",
    borderRadius: 6,
    cursor: "pointer",
  },

  listTitle: {
    marginBottom: 14,
    fontSize: 18,
    fontWeight: 600,
    color: "#1f2937",
  },

  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: 0,
    background: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
    border: "1px solid #e5e7eb",
  },

  editBtn: {
    background: "#facc15",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 6,
    color: "#000",
  },

  deleteBtn: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
  },

  coverPreview: {
    width: "100%",
    maxHeight: 220,
    objectFit: "cover",
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },

  sectionImage: {
    width: "100%",
    maxHeight: 200,
    objectFit: "cover",
    marginTop: 10,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },
};
