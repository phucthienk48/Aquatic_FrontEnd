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

  //  Chặn không phải admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
    setLoading(false);
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
    if (!window.confirm("Xóa đơn hàng này?")) return;
    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchOrders();
  };
    const getStatusStyle = (status) => {
    switch (status) {
        case "chờ xử lý":
        return {
            backgroundColor: "#fef3c7",
            color: "#92400e",
            border: "1px solid #f59e0b",
        };
        case "đã xác nhận":
        return {
            backgroundColor: "#dbeafe",
            color: "#1e40af",
            border: "1px solid #3b82f6",
        };
        case "đang giao hàng":
        return {
            backgroundColor: "#e0f2fe",
            color: "#0369a1",
            border: "1px solid #38bdf8",
        };
        case "hoàn thành":
        return {
            backgroundColor: "#dcfce7",
            color: "#166534",
            border: "1px solid #22c55e",
        };
        case "đã hủy":
        return {
            backgroundColor: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #ef4444",
        };
        default:
        return {};
    }
    };

  if (loading) return <p>Loading...</p>;

  const filteredOrders = orders.filter((o) => {

    // lọc tên khách
    const matchName =
      o.user?.username
        ?.toLowerCase()
        .includes(searchName.toLowerCase());

    // lọc trạng thái
    const matchStatus =
      statusFilter === "all" || o.status === statusFilter;

    // lọc tổng tiền
    let matchPrice = true;

    if (priceFilter === "low") {
      matchPrice = o.totalPrice < 200000;
    } else if (priceFilter === "medium") {
      matchPrice = o.totalPrice >= 200000 && o.totalPrice <= 1000000;
    } else if (priceFilter === "high") {
      matchPrice = o.totalPrice > 1000000;
    }

    return matchName && matchStatus && matchPrice;
  });

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>
        <i className="bi bi-receipt-cutoff" style={styles.titleIcon}></i>
        QUẢN LÝ ĐƠN HÀNG
      </h2>

    <div style={styles.filterBar}>

      {/* tìm tên khách */}
      <div style={styles.searchBox}>
        <i className="bi bi-search"></i>
        <input
          style={styles.searchInput}
          placeholder="Tìm khách hàng..."
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
        />
      </div>

      {/* lọc trạng thái */}
      <select
        style={styles.filterSelect}
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="all">Tất cả trạng thái</option>
        <option value="chờ xử lý">Chờ xử lý</option>
        <option value="đã xác nhận">Đã xác nhận</option>
        <option value="đang giao hàng">Đang giao hàng</option>
        <option value="hoàn thành">Hoàn thành</option>
        <option value="đã hủy">Đã hủy</option>
      </select>

      {/* lọc tổng tiền */}
      <select
        style={styles.filterSelect}
        value={priceFilter}
        onChange={(e) => setPriceFilter(e.target.value)}
      >
        <option value="all">Tất cả giá</option>
        <option value="low">Dưới 200k</option>
        <option value="medium">200k - 1 triệu</option>
        <option value="high">Trên 1 triệu</option>
      </select>

    </div>
      {/* ===== BẢNG ĐƠN HÀNG ===== */}
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{ ...styles.th, width: "15%" }}>Mã</th>
          <th style={{ ...styles.th, width: "20%" }}>Khách hàng</th>
          <th style={{ ...styles.th, width: "20%" }}>Tổng tiền</th>
          <th style={{ ...styles.th, width: "25%" }}>Trạng thái</th>
          <th style={{ ...styles.th, width: "20%" }}>Hành động</th>
        </tr>
      </thead>

      <tbody>
        {filteredOrders.map((o) => (
          <tr
            key={o._id}
            style={styles.tr}
            onMouseEnter={(e)=>
              e.currentTarget.style.background="#f0fdf4"
            }
            onMouseLeave={(e)=>
              e.currentTarget.style.background="#ffffff"
            }
          >
            <td style={styles.td}>{o._id.slice(-6)}</td>

            <td style={{ ...styles.td, fontWeight: 500 }}>
              {o.user?.username}
            </td>

            <td style={styles.price}>
              {o.totalPrice.toLocaleString()} VNĐ
            </td>

            <td style={styles.td}>
              <select
                style={{
                  ...styles.statusSelect,
                  ...getStatusStyle(o.status),
                }}
                value={o.status}
                onChange={(e) =>
                  updateStatus(o._id, e.target.value)
                }
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
                <button
                  style={styles.viewBtn}
                  onClick={() => setSelectedOrder(o)}
                >
                  <i className="bi bi-eye me-1"></i> Xem
                </button>

                <button
                  style={styles.deleteBtn}
                  onClick={() => deleteOrder(o._id)}
                >
                  <i className="bi bi-trash me-1"></i> Xóa
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>


            {/* ===== CHI TIẾT ĐƠN HÀNG ===== */}
            {selectedOrder && (
              <div style={styles.detailOverlay}>
                <div style={styles.detailBox}>
                  <h3 style={styles.detailTitle}>Chi tiết đơn hàng</h3>

                  {/* ==== THÔNG TIN NGƯỜI NHẬN ==== */}
                  <div style={styles.section}>
                    <h4 style={styles.sectionTitle}>Thông tin người nhận</h4>

                    <p style={styles.detailText}>
                      <b>Người nhận:</b> {selectedOrder.shippingAddress?.fullName || "—"}
                    </p>
                    <p style={styles.detailText}>
                      <b>SĐT:</b> {selectedOrder.shippingAddress?.phone || "—"}
                    </p>
                    <p style={styles.detailText}>
                      <b>Địa chỉ:</b> {selectedOrder.shippingAddress?.address || "—"}
                    </p>
                    <p style={styles.detailText}>
                      <b>Ghi chú:</b> {selectedOrder.note || "Không có"}
                    </p>
                  </div>

            {/* ==== THÔNG TIN ĐƠN HÀNG ==== */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Thông tin đơn hàng</h4>

              <p style={styles.detailText}>
                <b>Mã đơn:</b> {selectedOrder._id}
              </p>
              <p style={styles.detailText}>
                <b>Trạng thái:</b> {selectedOrder.status}
              </p>
              <p style={styles.detailText}>
                <b>Thanh toán:</b> {selectedOrder.paymentMethod}
              </p>
              <p style={styles.detailText}>
                <b>Ngày tạo:</b>{" "}
                {new Date(selectedOrder.createdAt).toLocaleString()}
              </p>
            </div>

            {/* ==== DANH SÁCH SẢN PHẨM ==== */}
            <div style={styles.section}>
              <h4 style={styles.sectionTitle}>Sản phẩm</h4>

          <table style={styles.itemTable}>
            <thead>
              <tr>
                <th style={{ ...styles.th, textAlign: "left" }}>Tên sản phẩm</th>
                <th style={{ ...styles.th, width: 80 }}>SL</th>
                <th style={{ ...styles.th, width: 120 }}>Giá</th>
                <th style={{ ...styles.th, width: 140 }}>Tạm tính</th>
              </tr>
            </thead>

            <tbody>
              {selectedOrder.items.map((item, i) => (
                <tr
                  key={i}
                  style={styles.tr}
                  onMouseEnter={(e)=>
                    e.currentTarget.style.background="#f0fdf4"
                  }
                  onMouseLeave={(e)=>
                    e.currentTarget.style.background="#ffffff"
                  }
                >
                  <td style={{ ...styles.td, textAlign: "left", fontWeight: 500 }}>
                    {item.name}
                  </td>

                  <td style={{ ...styles.td, textAlign: "center" }}>
                    {item.quantity}
                  </td>

                  <td style={{ ...styles.td, textAlign: "right", color: "#ea580c" }}>
                    {item.price.toLocaleString()} VNĐ
                  </td>

                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 600 }}>
                    {(item.price * item.quantity).toLocaleString()} VNĐ
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>

            {/* ==== TỔNG TIỀN ==== */}
            <div style={styles.totalPrice}>
              Tổng thanh toán:{" "}
              <b>{selectedOrder.totalPrice.toLocaleString()} VNĐ</b>
            </div>

            <button
              style={styles.closeBtn}
              onClick={() => setSelectedOrder(null)}
            >
              Đóng
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
const styles = {
  container: {
    padding: "24px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    // fontFamily: "Inter, system-ui, sans-serif",
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    marginBottom: 20,
    color: "#1f2937",
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

table: {
  width: "100%",
  borderCollapse: "separate",
  borderSpacing: 0,
  backgroundColor: "#ffffff",
  borderRadius: 12,
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
  border: "1px solid #e5e7eb",
},

th: {
  backgroundColor: "#2563eb", // xanh dương
  color: "#ffffff",
  padding: "14px 12px",
  textAlign: "center",
  fontSize: 15,
  fontWeight: 600,
  borderBottom: "2px solid #1d4ed8",
},

td: {
  padding: "12px",
  fontSize: 15,
  textAlign: "center",
  color: "#374151",
  borderBottom: "1px solid #e5e7eb",
},

itemTable: {
  width: "100%",
  borderCollapse: "collapse",
  marginTop: 10,
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  overflow: "hidden",
},

tr: {
  borderBottom: "1px solid #e5e7eb",
  transition: "background 0.2s",
},

price: {
  padding: 12,
  textAlign: "center",
  fontWeight: 600,
  color: "red", // cam nổi bật
  borderBottom: "1px solid #e5e7eb",
},

actionGroup: {
  display: "flex",
  justifyContent: "center",
  gap: 8,
},

viewBtn: {
  background: "#22c55e",
  border: "none",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
},

deleteBtn: {
  background: "#ef4444",
  border: "none",
  color: "#fff",
  padding: "6px 10px",
  borderRadius: 6,
  cursor: "pointer",
},
  statusSelect: {
    padding: "6px 10px",
    borderRadius: 6,
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    cursor: "pointer",
  },

  actionGroup: {
    // display: "flex",
    textAlign: "center",
    verticalAlign: "middle",
    gap: 8,
  },

  viewBtn: {
    padding: "6px 12px",
    borderRadius: 6,
    border: "1px solid #2563eb",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "6px 12px",
    margin: "0 12px",
    borderRadius: 6,
    border: "1px solid #dc2626",
    backgroundColor: "#dc2626",
    color: "#fff",
    fontSize: 13,
    cursor: "pointer",
  },

  detailOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },

  detailBox: {
    width: "480px",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    animation: "fadeIn 0.2s ease",
  },

  detailTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 12,
    color: "#111827",
  },

  detailText: {
    fontSize: 14,
    marginBottom: 6,
    color: "#374151",
  },

  itemList: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 18,
  },

  totalPrice: {
    fontWeight: 600,
    fontSize: 15,
    marginTop: 8,
    color: "#111827",
  },

  closeBtn: {
    marginTop: 12,
    width: "100%",
    padding: "8px 0",
    borderRadius: 8,
    border: "none",
    backgroundColor: "#1f2937",
    color: "#fff",
    cursor: "pointer",
  },
  statusSelect: {
  padding: "6px 10px",
  borderRadius: 999,
  fontWeight: 500,
  cursor: "pointer",
  outline: "none",
  transition: "all 0.2s ease",
},
filterBar: {
  display: "flex",
  gap: 12,
  marginBottom: 18,
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

};
