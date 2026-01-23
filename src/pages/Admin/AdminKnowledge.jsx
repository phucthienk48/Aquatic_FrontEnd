import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000/api/knowledge";
const UPLOAD_URL = "http://localhost:5000/api/upload";

export default function AdminKnowledge() {
  const [list, setList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const emptyForm = {
    knowledgeId: "",
    title: "",
    summary: "",
    img: "",
    _imgFile: null,
    _imgPreview: "",
    instructions: [
      {
        heading: "",
        content: "",
        image: "",
        _file: null,
        _preview: "",
      },
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

  /* ================= UPLOAD IMAGE (GIỐNG SHOP ADMIN) ================= */
  const uploadImage = async (file) => {
    if (!file) return "";

    const fd = new FormData();
    fd.append("image", file);

    setUploading(true);
    const res = await fetch(UPLOAD_URL, {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setUploading(false);

    return data.url;
  };

  /* ================= FORM ================= */
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
    if (form._imgFile) {
      coverImg = await uploadImage(form._imgFile);
    }

    const instructions = await Promise.all(
      form.instructions.map(async (ins) => {
        let image = ins.image;
        if (ins._file) {
          image = await uploadImage(ins._file);
        }
        return {
          heading: ins.heading,
          content: ins.content,
          image,
        };
      })
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
  };

  /* ================= UI ================= */
  return (
    <div className="container py-4">
      <h3 className="mb-4">
        <i className="bi bi-journal-text me-2"></i>
        Quản lý kiến thức nuôi cá
      </h3>

      {/* ===== FORM ===== */}
      <form className="card shadow-sm border-0 mb-5" onSubmit={handleSubmit}>
        <div className="card-header bg-primary text-white">
          <i className="bi bi-pencil-square me-2"></i>
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
              disabled={Boolean(editingId)}
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

          {/* COVER IMAGE */}
          <div className="col-md-6">
            <label className="form-label">
              <i className="bi bi-image me-1"></i> Ảnh đại diện
            </label>
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

            {form._imgPreview && (
              <img src={form._imgPreview} style={styles.coverPreview} />
            )}

            {!form._imgPreview && form.img && (
              <img src={form.img} style={styles.coverPreview} />
            )}
          </div>

          {/* INSTRUCTIONS */}
          <div className="col-12">
            <h5 className="mt-3">
              <i className="bi bi-list-check me-2"></i>Nội dung hướng dẫn
            </h5>

            {form.instructions.map((ins, i) => (
              <div key={i} className="border rounded p-3 mb-3 bg-light">
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

                {ins._preview && (
                  <img src={ins._preview} style={styles.sectionImage} />
                )}

                {!ins._preview && ins.image && (
                  <img src={ins.image} style={styles.sectionImage} />
                )}

                {form.instructions.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-sm btn-outline-danger mt-2"
                    onClick={() => removeInstruction(i)}
                  >
                    <i className="bi bi-trash me-1"></i>Xóa section
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
            <span className="text-warning me-3">
              <i className="bi bi-cloud-upload me-1"></i>Đang upload ảnh...
            </span>
          )}
          <button className="btn btn-success me-2">
            <i className="bi bi-save me-1"></i>
            {editingId ? "Cập nhật" : "Tạo mới"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={resetForm}
            >
              Hủy
            </button>
          )}
        </div>
      </form>

      {/* ===== LIST ===== */}
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white">
          <i className="bi bi-list-ul me-2"></i>Danh sách bài viết
        </div>

        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Knowledge ID</th>
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
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(item.knowledgeId)}
                  >
                    <i className="bi bi-trash"></i>
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
/* ================= STYLE ================= */
const styles = {
  container: {
    maxWidth: 1200,
    margin: "auto",
    padding: 30,
  },

  pageTitle: {
    marginBottom: 20,
    color: "#dc3545",
    display: "flex",
    alignItems: "center",
    gap: 10,
  },

  form: {
    background: "#fff",
    padding: 24,
    borderRadius: 12,
    boxShadow: "0 4px 14px rgba(0,0,0,.08)",
    marginBottom: 40,
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },

  formTitle: {
    marginBottom: 10,
    color: "#333",
  },

  subTitle: {
    marginTop: 10,
    color: "#0d6efd",
  },

  section: {
    border: "1px dashed #ccc",
    borderRadius: 8,
    padding: 12,
    background: "#fafafa",
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },

  addBtn: {
    background: "#e9f2ff",
    border: "1px dashed #0d6efd",
    padding: 8,
    borderRadius: 6,
    cursor: "pointer",
    color: "#0d6efd",
    fontWeight: 600,
  },

  removeBtn: {
    alignSelf: "flex-end",
    background: "#fff",
    border: "none",
    color: "#dc3545",
    cursor: "pointer",
  },

  actions: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  saveBtn: {
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
    fontWeight: 600,
  },

  cancelBtn: {
    background: "#6c757d",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 6,
  },

  listTitle: {
    marginBottom: 10,
    color: "#333",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
    boxShadow: "0 4px 14px rgba(0,0,0,.06)",
    borderRadius: 10,
    overflow: "hidden",
  },

  editBtn: {
    background: "#ffc107",
    border: "none",
    padding: "6px 10px",
    borderRadius: 6,
    cursor: "pointer",
    marginRight: 6,
  },

  deleteBtn: {
    background: "#dc3545",
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
    borderRadius: 6,
  },
  sectionImage: {
    width: "100%",
    maxHeight: 200,
    objectFit: "cover",
    marginTop: 10,
    borderRadius: 6,
  },
};
