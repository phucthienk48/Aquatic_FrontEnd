import { useEffect, useMemo, useState } from "react";

export default function AdminComment() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [ratingFilter, setRatingFilter] = useState("all");
  const [productFilter, setProductFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 


  /*  FETCH COMMENTS  */
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/comment/all");
        const data = await res.json();
        setComments(Array.isArray(data) ? data : data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  /*  DELETE  */
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bình luận này?")) return;
    await fetch(`http://localhost:5000/api/comment/${id}`, {
      method: "DELETE",
    });
    setComments((prev) => prev.filter((c) => c._id !== id));
  };

  /*  IMAGE  */
  const getImageUrl = (img) => {
    if (!img) return "/data/placeholder.jpg";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img.replace(/^\/+/, "")}`;
  };

  /*  PRODUCT LIST  */
  const products = useMemo(() => {
    const map = new Map();
    comments.forEach((c) => {
      if (typeof c.product === "object" && c.product?._id) {
        map.set(c.product._id, c.product.name);
      }
    });
    return Array.from(map.entries());
  }, [comments]);

  /*  FILTER  */
  const filteredComments = comments.filter((c) => {
    const byRating = ratingFilter === "all" || c.rating === Number(ratingFilter);
    const byProduct = productFilter === "all" || c.product?._id === productFilter;
    return byRating && byProduct;
  });

  useEffect(() => {
    setCurrentPage(1);
  }, [ratingFilter, productFilter]);

  const totalPages = Math.ceil(filteredComments.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <p className="text-center mt-4">⏳ Đang tải bình luận...</p>;

  return (
    <div className="container mt-4" style={styles.container}>
      {/*  HEADER  */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 style={styles.pageTitle}>
          <i className="bi bi-chat-dots-fill" style={styles.titleIcon}></i>
          Quản lý bình luận
        </h4>
        <span style={styles.badgeCount}>
          <i className="bi bi-chat-left-text me-1"></i>
          {filteredComments.length} bình luận
        </span>
      </div>

      {/*  FILTER TOOLBAR  */}
      <div className="card mb-4" style={styles.filterCard}>
        <div className="card-body py-3">
          <div className="row g-3 align-items-center">
            <div className="col-md-3">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-star-fill text-warning"></i>
                </span>
                <select
                  className="form-select"
                  value={ratingFilter}
                  onChange={(e) => setRatingFilter(e.target.value)}
                >
                  <option value="all">Tất cả số sao</option>
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} sao</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="col-md-4">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-box-seam"></i>
                </span>
                <select
                  className="form-select"
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                >
                  <option value="all">Tất cả sản phẩm</option>
                  {products.map(([id, name]) => (
                    <option key={id} value={id}>{name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/*  TABLE  */}
      <div className="table-responsive shadow-sm bg-white rounded">
        <table className="table table-bordered align-middle mb-0" style={styles.table}>
          <thead style={styles.tableHeader}>
            <tr>
              <th>User</th>
              <th>Sản phẩm</th>
              <th className="text-center"><i className="bi bi-star-fill text-warning"></i></th>
              <th>Nội dung</th>
              <th>Ảnh</th>
              <th>Thời gian</th>
              <th>Hoạt động</th>
            </tr>
          </thead>

          <tbody>
            {currentComments.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-muted">Không có bình luận</td>
              </tr>
            ) : (
              currentComments.map((c) => (
                <tr key={c._id}>
                  <td>
                    <strong>{c.user?.username}</strong>
                    <br />
                    <small className="text-muted">{c.user?.email}</small>
                  </td>
                  <td>
                    {typeof c.product === "object" ? (
                      <>
                        <strong>{c.product?.name}</strong>
                        <br />
                        <small className="text-muted">{c.product?.price?.toLocaleString()} đ</small>
                      </>
                    ) : (
                      <span className="text-muted">Đã xóa</span>
                    )}
                  </td>
                  <td className="text-center text-nowrap">
                    {[...Array(c.rating || 0)].map((_, i) => (
                      <i key={i} className="bi bi-star-fill text-warning me-1"></i>
                    ))}
                  </td>
                  <td style={{ maxWidth: 220 }}>{c.content}</td>
                  <td>
                    {c.images?.length > 0 ? (
                      c.images.map((img, i) => (
                        <img key={i} src={getImageUrl(img)} alt="" style={styles.image} />
                      ))
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>{new Date(c.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(c._id)}>
                      <i className="bi bi-trash-fill me-1"></i> Xóa
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <nav className="d-flex justify-content-center mt-4">
          <ul className="pagination shadow-sm">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage - 1)}>
                Trước
              </button>
            </li>
            
            {[...Array(totalPages)].map((_, index) => (
              <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => paginate(index + 1)}>
                  {index + 1}
                </button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => paginate(currentPage + 1)}>
                Sau
              </button>
            </li>
          </ul>
        </nav>
      )}
      {/* ---*/}
    </div>
  );
}

const styles = {
  container: {
    background: "#f8fafc",
    padding: "20px 20px 40px 20px",
    borderRadius: 12,
    minHeight: "80vh"
  },
  image: {
    width: 45,
    height: 45,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid #e5e7eb",
    marginRight: 4
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
    marginBottom: 0,
    boxShadow: "0 3px 8px rgba(0,0,0,0.05)",
    textTransform: "uppercase",
  },
  titleIcon: {
    fontSize: 30,
    color: "#3b82f6",
  },
  filterCard: {
    borderRadius: 12,
    border: "none",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
  },
  badgeCount: {
    background: "linear-gradient(135deg,#22c55e,#16a34a)",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 20,
    fontSize: 16,
    fontWeight: 600
  },
  table: {
    background: "#fff",
  },
  tableHeader: {
    background: "linear-gradient(135deg, #0d6efd, #3a8bfd)",
    color: "#fff",
    fontWeight: "600",
    fontSize: "14px"
  },
};