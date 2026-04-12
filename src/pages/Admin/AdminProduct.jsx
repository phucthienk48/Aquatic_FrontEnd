import { useEffect, useState } from "react";

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

  const [searchName, setSearchName] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

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


  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, typeFilter, priceFilter]);

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:5000/api/product");
    const data = await res.json();
    setProducts(data.data || data || []);
    setLoading(false);
  };

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

  const filteredProducts = products.filter((p) => {

    // lọc theo tên
    const matchName = p.name
      .toLowerCase()
      .includes(searchName.toLowerCase());

    // lọc theo loại
    const matchType =
      typeFilter === "all" || p.type === typeFilter;

    // lọc theo giá
    let matchPrice = true;

    if (priceFilter === "low") {
      matchPrice = p.price < 100000;
    } else if (priceFilter === "medium") {
      matchPrice = p.price >= 100000 && p.price <= 500000;
    } else if (priceFilter === "high") {
      matchPrice = p.price > 500000;
    }

    return matchName && matchType && matchPrice;
  });

  const indexOfLast = currentPage * productsPerPage;
  const indexOfFirst = indexOfLast - productsPerPage;

  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);


  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>
        <i className="bi-bag-check-fill" style={styles.titleIcon}></i>
        QUẢN LÝ SẢN PHẨM
      </h2>

        <button
        className="btn btn-success d-flex align-items-center gap-2 mb-3"
        onClick={() => setShowForm(true)}
        >
        <i className="bi bi-plus-circle"></i>
        Thêm sản phẩm
        </button>

        <div style={styles.filterBar}>

          {/* tìm tên */}
          <div style={styles.searchBox}>
            <i className="bi bi-search"></i>
            <input
              style={styles.searchInput}
              placeholder="Tìm tên sản phẩm..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          {/* lọc loại */}
          <select
            style={styles.filterSelect}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">Tất cả loại</option>
            {Object.keys(TYPE_LABEL).map((k) => (
              <option key={k} value={k}>
                {TYPE_LABEL[k]}
              </option>
            ))}
          </select>

          {/* lọc giá */}
          <select
            style={styles.filterSelect}
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">Tất cả giá</option>
            <option value="low">Dưới 100k</option>
            <option value="medium">100k - 500k</option>
            <option value="high">Trên 500k</option>
          </select>

        </div>

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={{ ...styles.th, width: 100, textAlign: "center" }}>Ảnh</th>
            <th style={{ ...styles.th, width: 100, textAlign: "center" }}>ID</th>
            <th style={{ ...styles.th }}>Tên sản phẩm</th>
            <th style={{ ...styles.th, width: 170, textAlign: "center" }}>Loại</th>
            <th style={{ ...styles.th, width: 150, textAlign: "center" }}>Giá</th>
            {/* <th style={{ ...styles.th, width: 80, textAlign: "center" }}>SL</th> */}
            <th style={{ ...styles.th, width: 150, textAlign: "center" }}>Trạng thái</th>
            <th style={{ ...styles.th, width: 160, textAlign: "center" }}>Thao tác</th>
          </tr>
        </thead>

        <tbody>
          {currentProducts.map((p) => (
            <tr
              key={p._id}
              style={styles.tr}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0f9ff")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#ffffff")
              }
            >
              <td style={{ textAlign: "center" }}>
                <img
                  src={p.images?.[0] || "https://via.placeholder.com/80"}
                  alt={p.name}
                  style={styles.image}
                />
              </td>

              <td style={styles.tdCenter}>{p.id}</td>

              <td style={styles.tdName}>{p.name}</td>

              <td style={styles.tdCenter}>{TYPE_LABEL[p.type]}</td>

              <td style={styles.tdPrice}>
                {p.price.toLocaleString()} đ
              </td>

              {/* <td style={styles.tdCenter}>{p.quantity}</td> */}

              <td style={styles.tdCenter}>
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

              <td style={styles.tdCenter}>
                <div style={styles.actionGroup}>
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => openEdit(p)}
                    title="Sửa"
                  >
                    <i className="bi bi-pencil-square me-1"></i> Sửa
                  </button>

                  <button
                    className="btn btn-sm btn-outline-danger "
                    onClick={() => deleteProduct(p._id)}
                    title="Xóa"
                  >
                    <i className="bi bi-trash me-1"></i> Xóa
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    <div style={styles.pagination}>
      {/* Prev */}
      <button
        style={{
          ...styles.pageBtn,
          ...(currentPage === 1 && styles.pageBtnDisabled),
        }}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
      >
        ⬅
      </button>

      {/* Page number */}
      {[...Array(totalPages)].map((_, i) => {
        const page = i + 1;
        return (
          <button
            key={page}
            style={{
              ...styles.pageBtn,
              ...(currentPage === page && styles.pageBtnActive),
            }}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </button>
        );
      })}

      {/* Next */}
      <button
        style={{
          ...styles.pageBtn,
          ...(currentPage === totalPages && styles.pageBtnDisabled),
        }}
        onClick={() =>
          setCurrentPage((prev) => Math.min(prev + 1, totalPages))
        }
      >
        ➡
      </button>
    </div>

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
              <button style={styles.saveBtn} onClick={submitForm}>
                <i className="bi bi-save" style={{ marginRight: 6 }}></i>
                Lưu
              </button>

              <button style={styles.cancelBtn} onClick={resetForm}>
                <i className="bi bi-x-circle" style={{ marginRight: 6 }}></i>
                Hủy
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 24,
    background: "#f9fafb",
    minHeight: "100vh",
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
    textTransform: "uppercase"
  },

  titleIcon: {
    fontSize: 30,
    color: "#3b82f6"
  },


table: {
  width: "100%",
  borderCollapse: "collapse",
  background: "#ffffff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 6px 16px rgba(37,99,235,0.12)",
  border: "1px solid #cbd5f5",
},

th: {
  padding: "14px 12px",
  background: "#2563eb",
  color: "#ffffff",
  fontWeight: 600,
  fontSize: 14,
  textAlign: "left",
  borderBottom: "2px solid #1d4ed8",
},

td: {
  padding: "12px",
  borderBottom: "2px solid #e5e7eb", // đường kẻ rõ giữa các dòng
  fontSize: 14,
  color: "#1f2937",
  verticalAlign: "middle",
},

tr: {
  borderBottom: "1px solid #e5e7eb",
  transition: "background 0.2s",
},

tdCenter: {
  padding: 12,
  textAlign: "center",
  borderBottom: "1px solid #e5e7eb",
},

tdPrice: {
  padding: 12,
  textAlign: "right",
  fontWeight: 600,
  color: "#1d4ed8",
  borderBottom: "1px solid #e5e7eb",
},

tdName: {
  padding: 12,
  fontWeight: 500,
  borderBottom: "1px solid #e5e7eb",
},

actionGroup: {
  display: "flex",
  justifyContent: "center",
  gap: 8,
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


  previewImage: {
    width: 120,
    borderRadius: 8,
    border: "1px solid #e5e7eb",
    marginTop: 6,
  },


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
  filterBar: {
  display: "flex",
  gap: 12,
  marginBottom: 16,
  flexWrap: "wrap",
},

searchBox: {
  display: "flex",
  alignItems: "center",
  gap: 6,
  border: "1px solid #d1d5db",
  borderRadius: 6,
  padding: "6px 10px",
  background: "#fff",
},

searchInput: {
  border: "none",
  outline: "none",
  fontSize: 14,
},

filterSelect: {
  padding: "6px 10px",
  borderRadius: 6,
  border: "1px solid #d1d5db",
  fontSize: 14,
},
pagination: {
  marginTop: 20,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 8,
  flexWrap: "wrap",
},

pageBtn: {
  minWidth: 36,
  height: 36,
  padding: "0 12px",
  borderRadius: 8,
  border: "1px solid #cbd5f5",
  background: "#ffffff",
  color: "#1d4ed8",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  transition: "all 0.2s",
},

pageBtnActive: {
  background: "#2563eb",
  color: "#fff",
  border: "1px solid #2563eb",
  boxShadow: "0 4px 10px rgba(37,99,235,0.3)",
},

pageBtnDisabled: {
  opacity: 0.5,
  cursor: "not-allowed",
},
};


