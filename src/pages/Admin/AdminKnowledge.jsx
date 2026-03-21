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

  const fetchData = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setList(data.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleInstructionChange = (i, field, value) => {
    const copy = [...form.instructions];
    copy[i][field] = value;
    setForm({ ...form, instructions: copy });
  };

  const addInstruction = () =>
    setForm({
      ...form,
      instructions: [...form.instructions, { heading: "", content: "", image: "", _file: null, _preview: "" }],
    });

  const removeInstruction = (i) =>
    setForm({ ...form, instructions: form.instructions.filter((_, idx) => idx !== i) });

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

    const payload = { ...form, img: coverImg, instructions };
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

  const handleEdit = async (knowledgeId) => {
    const res = await fetch(`${API_URL}/${knowledgeId}`);
    const data = await res.json();
    setForm({
      ...data.data,
      _imgFile: null,
      _imgPreview: "",
      instructions: data.data.instructions.map((i) => ({ ...i, _file: null, _preview: "" })),
    });
    setEditingId(knowledgeId);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (knowledgeId) => {
    if (!window.confirm("🐟 Bạn có chắc muốn xóa bài viết hướng dẫn này không?")) return;
    await fetch(`${API_URL}/${knowledgeId}`, { method: "DELETE" });
    fetchData();
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div style={styles.container}>
      {/* PAGE HEADER */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={styles.pageTitle}>
            <i className="bi bi-book-half" style={{ marginRight: 12 }}></i>
            Kiến Thức Nuôi Cá
          </h2>
          <p style={{ margin: 0, opacity: 0.8 }}>Quản lý các bài viết hướng dẫn chăm sóc cá cảnh</p>
        </div>
        {!showForm && (
          <button style={styles.addMainBtn} onClick={() => setShowForm(true)}>
            <i className="bi bi-plus-lg"></i> Soạn bài viết mới
          </button>
        )}
      </div>

      {/* FORM SOẠN THẢO */}
      {showForm && (
        <div style={styles.formCard}>
          <div style={styles.formHeader(editingId)}>
            <i className={`bi ${editingId ? "bi-pencil-square" : "bi-journal-plus"} me-2`}></i>
            {editingId ? "Chỉnh sửa nội dung" : "Tạo bài viết hướng dẫn mới"}
          </div>

          <form style={styles.formBody} onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-md-3">
                <label style={styles.label}>Mã định danh (ID)</label>
                <input
                  style={styles.input}
                  name="knowledgeId"
                  placeholder="VD: cach-nuoi-ca-goldfish"
                  value={form.knowledgeId}
                  onChange={handleChange}
                  disabled={!!editingId}
                  required
                />
              </div>
              <div className="col-md-9">
                <label style={styles.label}>Tiêu đề bài viết</label>
                <input
                  style={styles.input}
                  name="title"
                  placeholder="Nhập tiêu đề hấp dẫn..."
                  value={form.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-12">
                <label style={styles.label}>Tóm tắt ngắn gọn</label>
                <textarea
                  style={{ ...styles.input, height: "80px" }}
                  name="summary"
                  placeholder="Mô tả sơ lược về bài viết..."
                  value={form.summary}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* COVER IMAGE */}
              <div className="col-md-12">
                <label style={styles.label}>Ảnh đại diện bài viết</label>
                <div style={styles.uploadArea}>
                  <input
                    type="file"
                    style={{ marginBottom: 10 }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) setForm({ ...form, _imgFile: file, _imgPreview: URL.createObjectURL(file) });
                    }}
                  />
                  {(form._imgPreview || form.img) && (
                    <img src={form._imgPreview || form.img} style={styles.coverPreview} alt="Preview" />
                  )}
                </div>
              </div>

              {/* INSTRUCTIONS SECTIONS */}
              <div className="col-12">
                <h5 style={styles.sectionDivider}>
                  <i className="bi bi-layers-half"></i> Các bước hướng dẫn chi tiết
                </h5>
                {form.instructions.map((ins, i) => (
                  <div key={i} style={styles.instructionStep}>
                    <div style={styles.stepBadge}>Bước {i + 1}</div>
                    <div className="row g-3">
                      <div className="col-md-12">
                        <input
                          style={styles.input}
                          placeholder="Tiêu đề bước này (VD: Chuẩn bị nguồn nước)"
                          value={ins.heading}
                          onChange={(e) => handleInstructionChange(i, "heading", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-8">
                        <textarea
                          style={{ ...styles.input, height: "120px" }}
                          placeholder="Nội dung chi tiết hướng dẫn..."
                          value={ins.content}
                          onChange={(e) => handleInstructionChange(i, "content", e.target.value)}
                          required
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="file"
                          className="form-control form-control-sm mb-2"
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
                          <img src={ins._preview || ins.image} style={styles.stepImage} alt="Step" />
                        )}
                      </div>
                    </div>
                    {form.instructions.length > 1 && (
                      <button type="button" style={styles.removeStepBtn} onClick={() => removeInstruction(i)}>
                        <i className="bi bi-trash"></i> Xóa bước này
                      </button>
                    )}
                  </div>
                ))}

                <button type="button" style={styles.addStepBtn} onClick={addInstruction}>
                  <i className="bi bi-plus-circle"></i> Thêm bước hướng dẫn tiếp theo
                </button>
              </div>
            </div>

            <div style={styles.formFooter}>
              {uploading && <div style={styles.uploadingStatus}><div className="spinner-border spinner-border-sm me-2"></div> Đang xử lý hình ảnh...</div>}
              <button type="submit" style={styles.submitBtn}>
                <i className="bi bi-check2-circle"></i> {editingId ? "Cập nhật bài viết" : "Xuất bản bài viết"}
              </button>
              <button type="button" style={styles.cancelBtn} onClick={resetForm}>Hủy bỏ</button>
            </div>
          </form>
        </div>
      )}

      {/* DANH SÁCH BÀI VIẾT */}
      <div style={styles.listCard}>
        <div style={styles.listHeader}>
          <i className="bi bi-list-ul"></i> Danh sách các bài viết hiện có
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0" style={styles.table}>
            <thead style={styles.thead}>
              <tr>
                <th style={{ paddingLeft: 20 }}>ID</th>
                <th>Hình ảnh</th>
                <th>Tiêu đề bài viết</th>
                <th className="text-end" style={{ paddingRight: 20 }}>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {list.map((item) => (
                <tr key={item._id}>
                  <td style={{ paddingLeft: 20 }}><code style={styles.code}>{item.knowledgeId}</code></td>
                  <td>
                    <img src={item.img} style={styles.tableThumb} alt="thumb" />
                  </td>
                  <td style={{ fontWeight: 600, color: "#005f73" }}>{item.title}</td>
                  <td className="text-end" style={{ paddingRight: 20 }}>
                    <button style={styles.actionEdit} onClick={() => handleEdit(item.knowledgeId)}>
                      <i className="bi bi-pencil me-1"></i> Sửa
                    </button>
                    <button style={styles.actionDelete} onClick={() => handleDelete(item.knowledgeId)}>
                      <i className="bi bi-trash me-1"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "'Inter', sans-serif",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    background: "linear-gradient(135deg, #005f73 0%, #0a9396 100%)",
    padding: "30px",
    borderRadius: "20px",
    color: "#fff",
    boxShadow: "0 10px 25px rgba(0, 95, 115, 0.2)",
  },
  pageTitle: { margin: 0, fontWeight: 800, fontSize: "1.8rem" },
  addMainBtn: {
    background: "#94d2bd",
    color: "#005f73",
    border: "none",
    padding: "10px 20px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  formCard: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
    overflow: "hidden",
    marginBottom: "40px",
    border: "1px solid #e0f2f1",
  },
  formHeader: (editing) => ({
    background: editing ? "#ee9b00" : "#005f73",
    color: "#fff",
    padding: "15px 25px",
    fontSize: "1.1rem",
    fontWeight: "bold",
  }),
  formBody: { padding: "30px" },
  label: { display: "block", marginBottom: "8px", fontWeight: "600", color: "#005f73" },
  input: {
    width: "100%",
    padding: "10px 15px",
    borderRadius: "10px",
    border: "1.5px solid #e0e0e0",
    outline: "none",
    transition: "0.3s",
    fontSize: "0.95rem",
  },
  uploadArea: {
    border: "2px dashed #b7e4c7",
    padding: "20px",
    borderRadius: "15px",
    textAlign: "center",
    background: "#f7fdf9",
  },
  coverPreview: { width: "100%", maxHeight: "300px", objectFit: "cover", borderRadius: "12px", marginTop: "15px" },
  sectionDivider: {
    margin: "40px 0 20px",
    paddingBottom: "10px",
    borderBottom: "2px solid #94d2bd",
    color: "#005f73",
    fontWeight: "bold",
  },
  instructionStep: {
    background: "#f0f9ff",
    padding: "25px",
    borderRadius: "15px",
    marginBottom: "20px",
    position: "relative",
    border: "1px solid #d0e8ff",
  },
  stepBadge: {
    position: "absolute",
    top: "-12px",
    left: "20px",
    background: "#0077be",
    color: "#fff",
    padding: "4px 15px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  stepImage: { width: "100%", height: "150px", objectFit: "cover", borderRadius: "10px", marginTop: "10px" },
  addStepBtn: {
    width: "100%",
    padding: "12px",
    border: "2px dashed #0077be",
    background: "#f0f8ff",
    color: "#0077be",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  removeStepBtn: {
    marginTop: "15px",
    background: "none",
    border: "none",
    color: "#d90429",
    fontSize: "0.9rem",
    fontWeight: "600",
    cursor: "pointer",
  },
  formFooter: {
    marginTop: "30px",
    paddingTop: "20px",
    borderTop: "1px solid #eee",
    display: "flex",
    gap: "15px",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  submitBtn: {
    background: "#0a9396",
    color: "#fff",
    border: "none",
    padding: "12px 30px",
    borderRadius: "12px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  cancelBtn: {
    background: "#e9ecef",
    color: "#495057",
    border: "none",
    padding: "12px 25px",
    borderRadius: "12px",
    cursor: "pointer",
  },
  listCard: {
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.05)",
    overflow: "hidden",
  },
  listHeader: { padding: "20px 25px", fontWeight: "bold", color: "#005f73", borderBottom: "1px solid #eee" },
  table: { fontSize: "0.95rem" },
  thead: { background: "#f8fdfe" },
  code: { background: "#e0f2f1", color: "#00796b", padding: "2px 8px", borderRadius: "5px" },
  tableThumb: { width: "60px", height: "45px", objectFit: "cover", borderRadius: "8px" },
  actionEdit: {
    border: "none",
    background: "#e0f2f1",
    color: "#00796b",
    width: "35px",
    height: "35px",
    borderRadius: "10px",
    marginRight: "8px",
  },
  actionDelete: {
    border: "none",
    background: "#ffebee",
    color: "#c62828",
    width: "35px",
    height: "35px",
    borderRadius: "10px",
  },
  uploadingStatus: { color: "#ee9b00", fontWeight: "600", fontSize: "0.9rem" }
};