import { useEffect, useState } from "react";

/* ================= MAP HIỂN THỊ ================= */
const TYPE_LABEL = {
  fish: "Cá cảnh",
  medicine: "Thuốc",
  equipment: "Thiết bị",
  food: "Thức ăn",
  other: "Khác",
};

const STATUS_LABEL = {
  available: "Còn hàng",
  out_of_stock: "Hết hàng",
};

export default function AdminProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    id: "",
    name: "",
    type: "fish",
    species: "",
    price: "",
    oldprice: "",
    quantity: 0,
    description: "",
    instruction: "",
    storage: "",
    warning: "",
    images: "",
    status: "available",
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/product");
    const data = await res.json();
    setProducts(data.data || data || []);
    setLoading(false);
  };

  /* ================= FORM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingProduct(null);
    setShowForm(false);
    setImageFile(null);
    setForm({
      id: "",
      name: "",
      type: "fish",
      species: "",
      price: "",
      oldprice: "",
      quantity: 0,
      description: "",
      instruction: "",
      storage: "",
      warning: "",
      images: "",
      status: "available",
    });
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setShowForm(true);
    setForm({
      id: p.id,
      name: p.name,
      type: p.type,
      species: p.species,
      price: p.price,
      oldprice: p.oldprice,
      quantity: p.quantity,
      description: p.description || "",
      instruction: p.instruction || "",
      storage: p.storage || "",
      warning: p.warning || "",
      images: p.images?.[0] || "",
      status: p.status,
    });
    setImageFile(null);
  };

  /* ================= UPLOAD IMAGE ================= */
  const uploadImage = async () => {
    if (!imageFile) return form.images;

    const formData = new FormData();
    formData.append("image", imageFile);

    setUploading(true);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setUploading(false);

    return data.url;
  };

  /* ================= CRUD ================= */
  const submitForm = async () => {
    let imageUrl = form.images;

    if (imageFile) {
      imageUrl = await uploadImage();
    }

    const payload = {
      ...form,
      price: Number(form.price),
      oldprice: Number(form.oldprice),
      quantity: Number(form.quantity),
      images: imageUrl ? [imageUrl] : [],
    };

    const url = editingProduct
      ? `http://localhost:5000/api/product/${editingProduct._id}`
      : "http://localhost:5000/api/product";

    await fetch(url, {
      method: editingProduct ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    resetForm();
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) return;
    await fetch(`http://localhost:5000/api/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  };

  if (loading) return <p style={{ padding: 20 }}>⏳ Đang tải...</p>;

  /* ================= UI ================= */
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Quản lý sản phẩm</h2>

        <button
        className="btn btn-success d-flex align-items-center gap-2 mb-3"
        onClick={() => setShowForm(true)}
        >
        <i className="bi bi-plus-circle"></i>
        Thêm sản phẩm
        </button>


      <table style={styles.table}>
        <thead>
        <tr>
            <th style={styles.th}>Ảnh</th>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Tên</th>
            <th style={styles.th}>Loại</th>
            <th style={styles.th}>Giá</th>
            <th style={styles.th}>SL</th>
            <th style={styles.th}>Trạng thái</th>
            <th style={styles.th}>Thao tác</th>
        </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/80"}
                  alt={p.name}
                  style={styles.image}
                />
              </td>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{TYPE_LABEL[p.type]}</td>
              <td>{p.price.toLocaleString()} đ</td>
              <td>{p.quantity}</td>
              <td>
                <span
                  style={{
                    ...styles.status,
                    background:
                      p.status === "available" ? "#dcfce7" : "#fee2e2",
                    color:
                      p.status === "available" ? "#166534" : "#991b1b",
                  }}
                >
                  {STATUS_LABEL[p.status]}
                </span>
              </td>
              <td>
                <button
                className="btn btn-sm btn-outline-primary rounded-circle me-2"
                onClick={() => openEdit(p)}
                title="Sửa"
                >
                <i className="bi bi-pencil-square"></i>
                </button>

                <button
                className="btn btn-sm btn-outline-danger rounded-circle"
                onClick={() => deleteProduct(p._id)}
                title="Xóa"
                >
                <i className="bi bi-trash"></i>
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && (
        <div style={styles.modal}>
          <div style={styles.form}>
            <h3>{editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}</h3>

            <input style={styles.input} name="id" placeholder="ID" value={form.id} onChange={handleChange} />
            <input style={styles.input} name="name" placeholder="Tên sản phẩm" value={form.name} onChange={handleChange} />

            <select style={styles.input} name="type" value={form.type} onChange={handleChange}>
              {Object.keys(TYPE_LABEL).map((k) => (
                <option key={k} value={k}>{TYPE_LABEL[k]}</option>
              ))}
            </select>

            <input style={styles.input} name="species" placeholder="Loài" value={form.species} onChange={handleChange} />
            <input style={styles.input} name="price" placeholder="Giá" value={form.price} onChange={handleChange} />
            <input style={styles.input} name="oldprice" placeholder="Giá cũ" value={form.oldprice} onChange={handleChange} />
            <input style={styles.input} name="quantity" placeholder="Số lượng" value={form.quantity} onChange={handleChange} />

            <textarea style={styles.textarea} name="description" placeholder="Mô tả" value={form.description} onChange={handleChange} />
            <textarea style={styles.textarea} name="instruction" placeholder="Hướng dẫn" value={form.instruction} onChange={handleChange} />
            <textarea style={styles.textarea} name="storage" placeholder="Bảo quản" value={form.storage} onChange={handleChange} />
            <textarea style={styles.textarea} name="warning" placeholder="Cảnh báo" value={form.warning} onChange={handleChange} />

            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
            {uploading && <p>⏳ Đang upload ảnh...</p>}
            {form.images && <img src={form.images} alt="preview" style={{ width: 120, borderRadius: 8 }} />}

            <select style={styles.input} name="status" value={form.status} onChange={handleChange}>
              <option value="available">Còn hàng</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>

            <div style={styles.actionRow}>
              <button style={styles.saveBtn} onClick={submitForm}>💾 Lưu</button>
              <button style={styles.cancelBtn} onClick={resetForm}>❌ Hủy</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= CSS ================= */
const styles = {
  /* ===== PAGE ===== */
  container: {
    padding: 24,
    background: "#f9fafb",
    minHeight: "100vh",
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 16,
    color: "#111827",
  },

  /* ===== TABLE ===== */
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  },

  th: {
    padding: 12,
    background: "#f3f4f6",
    fontWeight: 600,
    color: "#374151",
    borderBottom: "1px solid #e5e7eb",
    textAlign: "left",
  },

  td: {
    padding: 12,
    borderBottom: "1px solid #e5e7eb",
    verticalAlign: "middle",
  },

  image: {
    width: 70,
    height: 70,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #e5e7eb",
  },

  /* ===== STATUS ===== */
  status: {
    padding: "4px 12px",
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
    display: "inline-block",
  },

  /* ===== MODAL ===== */
  modal: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
  },

  form: {
    background: "#ffffff",
    width: 460,
    maxHeight: "90vh",
    overflowY: "auto",
    padding: 20,
    borderRadius: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  /* ===== FORM INPUT ===== */
  input: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 14,
  },

  textarea: {
    padding: "8px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    fontSize: 14,
    minHeight: 70,
    resize: "vertical",
  },

  /* ===== IMAGE PREVIEW ===== */
  previewImage: {
    width: 120,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    marginTop: 6,
  },

  /* ===== ACTION ROW ===== */
  actionRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 10,
  },

  saveBtn: {
    background: "#2563eb",
    color: "#ffffff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },

  cancelBtn: {
    background: "#9ca3af",
    color: "#ffffff",
    border: "none",
    padding: "8px 14px",
    borderRadius: 6,
    fontWeight: 600,
    cursor: "pointer",
  },
};


