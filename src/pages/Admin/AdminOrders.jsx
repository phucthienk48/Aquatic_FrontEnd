import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";

const API_URL = "http://localhost:5000/api/orders";

export default function AdminOrder() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchName, setSearchName] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchName, priceFilter, statusFilter]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(
      `${API_URL}/${id}/status`,
      { status },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchOrders();
  };

  const deleteOrder = async (id) => {
    if (!window.confirm(" Bạn có chắc muốn xóa vĩnh viễn đơn hàng này?")) return;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  };

  const filteredOrders = orders.filter((o) => {
    const matchName = o.user?.username?.toLowerCase().includes(searchName.toLowerCase());
    const matchStatus = statusFilter === "all" || o.status === statusFilter;
    let matchPrice = true;
    if (priceFilter === "low") matchPrice = o.totalPrice < 200000;
    else if (priceFilter === "medium") matchPrice = o.totalPrice >= 200000 && o.totalPrice <= 1000000;
    else if (priceFilter === "high") matchPrice = o.totalPrice > 1000000;
    return matchName && matchStatus && matchPrice;
  });

  const indexOfLast = currentPage * ordersPerPage;
  const indexOfFirst = indexOfLast - ordersPerPage;

  const currentOrders = filteredOrders.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handlePrint = () => {
    const printContents = document.getElementById("invoice-print").innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    window.location.reload(); // reload lại để tránh lỗi UI
  };
  if (loading) return (
    <div style={styles.center}>
      <div className="spinner-border text-primary"></div>
      <p>Đang tải dữ liệu đại dương...</p>
    </div>
  );

  return (
    <div style={styles.container}>
      {/* HEADER TRANG */}
      <div style={styles.pageHeader}>
        <h2 style={styles.pageTitle}>
          <i className="bi-box-seam-fill" style={{marginRight: 10}}></i>
          Quản Lý Đơn Hàng
        </h2>
        <div style={styles.statsBar}>
          <span>Tổng đơn: <b>{orders.length}</b></span> | 
          <span> Chờ xử lý: <b style={{color: '#f39c12'}}>{orders.filter(o => o.status === 'chờ xử lý').length}</b></span>
        </div>
      </div>

      {/* THANH BỘ LỌC (Filter Bar) */}
      <div style={styles.filterBar}>
        <div style={styles.searchBox}>
          <i className="bi bi-search"></i>
          <input
            style={styles.searchInput}
            placeholder="Tìm tên khách hàng..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </div>

        <select style={styles.filterSelect} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all"> Tất cả trạng thái</option>
          <option value="chờ xử lý">Chờ xử lý</option>
          <option value="đã xác nhận">Đã xác nhận</option>
          <option value="đang giao hàng">Đang giao hàng</option>
          <option value="hoàn thành">Hoàn thành</option>
          <option value="đã hủy">Đã hủy</option>
        </select>

        <select style={styles.filterSelect} value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)}>
          <option value="all">Tất cả giá</option>
          <option value="low">Dưới 200k</option>
          <option value="medium">200k - 1 triệu</option>
          <option value="high">Trên 1 triệu</option>
        </select>
      </div>

      {/* BẢNG ĐƠN HÀNG */}
      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Mã đơn</th>
              <th style={styles.th}>Khách hàng</th>
              <th style={styles.th}>Tổng tiền</th>
              <th style={styles.th}>Trạng thái</th>
              <th style={styles.th}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((o) => (
              <tr key={o._id} style={styles.tr}>
                <td style={styles.td}><b>#{o._id.slice(-6).toUpperCase()}</b></td>
                <td style={styles.td}>
                  <div style={{fontWeight: 600}}>{o.user?.username}</div>
                  <div style={{fontSize: '0.8rem', color: '#666'}}>{o.user?.email}</div>
                </td>
                <td style={styles.priceTd}>{o.totalPrice.toLocaleString()} VNĐ</td>
                <td style={styles.td}>
                  <select
                    style={{ ...styles.statusSelect, ...getStatusBadge(o.status) }}
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                  >
                    <option value="chờ xử lý">Chờ xử lý</option>
                    <option value="đã xác nhận">Đã xác nhận</option>
                    <option value="đang giao hàng">Đang giao hàng</option>
                    <option value="hoàn thành">Hoàn thành</option>
                    <option value="đã hủy">Đã hủy</option>
                  </select>
                </td>
                <td style={styles.td}>
                  <div style={styles.actionGroup}>
                    <button style={styles.viewBtn} onClick={() => setSelectedOrder(o)}>
                      <i className="bi bi-eye me-1"></i> Xem
                    </button>
                    <button style={styles.deleteBtn} onClick={() => deleteOrder(o._id)}>
                      <i className="bi bi-trash me-1"></i> Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      {/* MODAL CHI TIẾT ĐƠN HÀNG */}
      {selectedOrder && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div id="invoice-print">
            <div style={styles.modalHeader}>
              <h3>Chi tiết đơn hàng #{selectedOrder._id.slice(-6).toUpperCase()}</h3>
              <button style={styles.closeIcon} onClick={() => setSelectedOrder(null)}>&times;</button>
            </div>

            <div style={styles.modalBody}>
              <div style={styles.infoGrid}>
                {/* Thông tin khách hàng */}
                <div style={styles.infoBlock}>
                  <h5 style={styles.blockTitle}><i className="bi bi-person-circle"></i> Người nhận</h5>
                  <p><b>Họ tên:</b> {selectedOrder.shippingAddress?.fullName}</p>
                  <p><b>SĐT:</b> {selectedOrder.shippingAddress?.phone}</p>
                  <p><b>Địa chỉ:</b> {selectedOrder.shippingAddress?.address}</p>
                  {selectedOrder.shippingAddress?.note && (
                    <div style={styles.adminNote}>
                      <b> Ghi chú:</b> {selectedOrder.shippingAddress.note}
                    </div>
                  )}
                </div>

                {/* Thông tin thanh toán */}
                <div style={styles.infoBlock}>
                  <h5 style={styles.blockTitle}><i className="bi bi-credit-card"></i> Giao dịch</h5>
                  <p><b>Ngày đặt:</b> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                  <p><b>Thanh toán:</b> <span style={{textTransform: 'uppercase'}}>{selectedOrder.paymentMethod}</span></p>
                  <p><b>Trạng thái:</b> {selectedOrder.status}</p>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <h5 style={styles.blockTitle}><i className="bi bi-box-seam"></i> Danh sách mặt hàng</h5>
              <div style={styles.itemTableWrapper}>
                <table style={styles.itemTable}>
                  <thead>
                    <tr>
                      <th>Sản phẩm</th>
                      <th>SL</th>
                      <th>Đơn giá</th>
                      <th>Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, i) => (
                      <tr key={i}>
                        <td>{item.name}</td>
                        <td textAlign="center">{item.quantity}</td>
                        <td>{item.price.toLocaleString()}</td>
                        <td style={{fontWeight: 600}}>{(item.price * item.quantity).toLocaleString()}đ</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>



              <div style={styles.modalFooterPrice}>
                Tổng cộng: <span>{selectedOrder.totalPrice.toLocaleString()} VNĐ</span>
              </div>
            </div>

            <button style={styles.modalCloseBtn} onClick={() => setSelectedOrder(null)}>Đóng lại</button>
            <button style={styles.printBtn} onClick={handlePrint}>
  <i className="bi bi-printer"></i> In hóa đơn
</button>
          </div>
            </div>
        </div>
      )}
    </div>
  );
}

// Logic màu sắc trạng thái
const getStatusBadge = (status) => {
  const base = { color: "#fff", border: "none" };
  switch (status) {
    case "chờ xử lý": return { ...base, backgroundColor: "#f39c12" };
    case "đã xác nhận": return { ...base, backgroundColor: "#3498db" };
    case "đang giao hàng": return { ...base, backgroundColor: "#9b59b6" };
    case "hoàn thành": return { ...base, backgroundColor: "#27ae60" };
    case "đã hủy": return { ...base, backgroundColor: "#e74c3c" };
    default: return base;
  }
};

const styles = {
  container: {
    padding: "30px",
    backgroundColor: "#f0f4f8",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  pageHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    background: "linear-gradient(135deg, #005f73 0%, #0a9396 100%)",
    padding: "20px",
    borderRadius: "15px",
    color: "#fff",
    boxShadow: "0 4px 15px rgba(0, 95, 115, 0.2)",
  },
  pageTitle: { margin: 0, fontSize: "1.5rem", fontWeight: "700" },
  statsBar: { fontSize: "0.9rem", opacity: 0.9 },
  
  filterBar: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  searchBox: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    border: "1px solid #e0e0e0",
    padding: "8px 15px",
    borderRadius: "8px",
    backgroundColor: "#f9f9f9",
  },
  searchInput: { border: "none", outline: "none", background: "none", width: "100%" },
  filterSelect: {
    padding: "8px 15px",
    borderRadius: "8px",
    border: "1px solid #e0e0e0",
    outline: "none",
    cursor: "pointer",
  },

  tableWrapper: {
    backgroundColor: "#fff",
    borderRadius: "15px",
    overflow: "hidden",
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    backgroundColor: "#f8f9fa",
    color: "#005f73",
    padding: "15px",
    textAlign: "left",
    borderBottom: "2px solid #edf2f7",
    fontWeight: "700",
  },
  td: { padding: "15px", borderBottom: "1px solid #edf2f7", color: "#444" },
  priceTd: { padding: "15px", borderBottom: "1px solid #edf2f7", fontWeight: "700", color: "#d90429" },
  
  statusSelect: {
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "0.8rem",
    fontWeight: "600",
    cursor: "pointer",
    outline: "none",
  },

  actionGroup: { display: "flex", gap: "8px" },
  viewBtn: {
    backgroundColor: "#e0f2f1",
    color: "#00796b",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  deleteBtn: {
    backgroundColor: "#ffebee",
    color: "#c62828",
    border: "none",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  // MODAL STYLES
  modalOverlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 21, 36, 0.6)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 1000,
    backdropFilter: "blur(4px)",
  },
  modalContent: {
    backgroundColor: "#fff",
    width: "700px",
    maxHeight: "90vh",
    borderRadius: "20px",
    padding: "30px",
    position: "relative",
    overflowY: "auto",
    boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #f0f0f0",
    paddingBottom: "15px",
    marginBottom: "20px",
    color: "#005f73",
  },
  closeIcon: { fontSize: "2rem", border: "none", background: "none", cursor: "pointer", color: "#999" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "20px" },
  blockTitle: { color: "#005f73", borderLeft: "4px solid #0a9396", paddingLeft: "10px", marginBottom: "15px" },
  adminNote: { backgroundColor: "#fff9c4", padding: "10px", borderRadius: "8px", marginTop: "10px", fontSize: "0.9rem" },
  itemTable: { width: "100%", marginTop: "10px" },
  modalFooterPrice: {
    textAlign: "right",
    fontSize: "1.2rem",
    marginTop: "20px",
    fontWeight: "700",
    color: "#d90429",
    borderTop: "2px dashed #eee",
    paddingTop: "15px",
  },
  modalCloseBtn: {
    width: "100%", padding: "12px", borderRadius: "10px", border: "none",
    backgroundColor: "#005f73", color: "#fff", fontWeight: "600", marginTop: "20px", cursor: "pointer"
  },
  center: { textAlign: "center", padding: "100px" },

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
  border: "1px solid #0a9396",
  background: "#ffffff",
  color: "#005f73",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 600,
  transition: "all 0.2s",
},

pageBtnActive: {
  background: "#0a9396",
  color: "#fff",
  border: "1px solid #0a9396",
  boxShadow: "0 4px 10px rgba(10,147,150,0.3)",
},

pageBtnDisabled: {
  opacity: 0.5,
  cursor: "not-allowed",
},
printBtn: {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  backgroundColor: "#2d6a4f",
  color: "#fff",
  fontWeight: "600",
  marginTop: "10px",
  cursor: "pointer"
},
};