import { useEffect, useState } from "react";
import WriteComment from "./WriteComment";

export default function Orders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/user/${userId}`);
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) return;
    fetchOrders();
  }, [userId]);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("🐟 Bạn có chắc chắn muốn hủy đơn hàng này không?")) return;
    try {
      await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "đã hủy" }),
      });
      fetchOrders();
    } catch (err) {
      alert("Hủy đơn thất bại");
    }
  };

  if (!userId) return <div style={styles.center}>⚠️ Vui lòng đăng nhập để xem đơn hàng</div>;
  if (loading) return <div style={styles.center}><div className="spinner-border text-primary"></div><p>Đang lặn tìm đơn hàng...</p></div>;
  if (orders.length === 0) return <div style={styles.center}>🐚 Bạn chưa có đơn hàng nào</div>;

  const getImageUrl = (image) => {
    if (!image) return "/data/placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `/${image.replace(/^\/+/, "")}`;
  };

  return (
    <div style={styles.container}>
      {/* Thêm CSS Media Queries trực tiếp vào JSX */}
      <style>{`
        @media (max-width: 768px) {
          .order-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .order-header { flex-direction: column; align-items: flex-start !important; gap: 10px; }
          .order-footer { flex-direction: column !important; gap: 15px; align-items: flex-start !important; }
          .total-price { font-size: 1.2rem !important; }
          .cancel-btn { width: 100%; }
        }
      `}</style>

      <div style={styles.pageHeader}>
        <h2 style={{...styles.title, fontSize: isMobile ? "1.5rem" : "2rem"}}>
          <i className="bi-box-seam-fill" style={{ marginRight: 10 }}></i>
          Đơn Hàng
        </h2>
        <p style={{ color: "#666" }}>Theo dõi những chú cá đang bơi về nhà bạn</p>
      </div>

      {orders.map((order) => (
        <div key={order._id} style={styles.orderCard}>
          {/* HEADER */}
          <div style={styles.orderHeader} className="order-header">
            <div>
              <span style={styles.orderId}>#MDH{order._id.slice(-8).toUpperCase()}</span>
              <div style={styles.dateText}>
                <i className="bi bi-clock-history"></i> {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>
            <span style={statusStyle(order.status)}>
              <i className="bi-box-seam-fill"></i> {order.status}
            </span>
          </div>

          <div style={styles.cardBody}>
            <div style={styles.gridContainer} className="order-grid">
              
              {/* CỘT TRÁI: THÔNG TIN TÀI KHOẢN & VẬN CHUYỂN */}
              <div style={styles.infoSection}>
                <h5 style={styles.sectionTitle}><i className="bi bi-person-badge"></i> Chủ bể</h5>
                <div style={styles.accountBox}>
                  <p style={{margin: "2px 0"}}><strong>User:</strong> {order.user?.username || "N/A"}</p>
                  <p style={{margin: "2px 0"}}><strong>Email:</strong> {order.user?.email || "N/A"}</p>
                </div>

                <h5 style={styles.sectionTitle}><i className="bi bi-geo-alt"></i> Nơi nhận cá</h5>
                <div style={styles.shippingBox}>
                  <p><strong>{order.shippingAddress?.fullName}</strong></p>
                  <p><i className="bi bi-telephone"></i> {order.shippingAddress?.phone}</p>
                  <p style={styles.addressText}><i className="bi bi-map"></i> {order.shippingAddress?.address}</p>
                </div>

                {order.shippingAddress?.note && (
                  <div style={styles.noteBox}>
                    <p style={{margin: 0, fontStyle: 'italic', fontSize: '0.85rem'}}>"{order.shippingAddress.note}"</p>
                  </div>
                )}

                <p style={styles.paymentMethod}>
                  <i className="bi bi-wallet2"></i> {order.paymentMethod?.toUpperCase()}
                </p>
              </div>

              {/* CỘT PHẢI: DANH SÁCH SẢN PHẨM */}
              <div style={styles.itemsSection}>
                <h5 style={styles.sectionTitle}><i className="bi bi-fish"></i> Sản phẩm</h5>
                {order.items.map((item, index) => (
                  <div key={index} style={styles.productItem}>
                    <img 
                      src={getImageUrl(item.image)} 
                      alt={item.name} 
                      style={styles.productImg} 
                    />
                    <div style={styles.productInfo}>
                      <div style={styles.productName}>{item.name}</div>
                      <div style={styles.productDetail}>
                        {item.quantity} x <span style={{color: '#0077be', fontWeight: 600}}>{item.price.toLocaleString()}đ</span>
                      </div>
                      
                      {order.status === "hoàn thành" && (
                        <div style={styles.reviewBox}>
                          <WriteComment 
                            userId={userId} 
                            productId={typeof item.product === "object" ? item.product._id : item.product} 
                            orderId={order._id} 
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div style={styles.orderFooter} className="order-footer">
            <div style={styles.totalWrapper}>
              <span>Tổng thanh toán:</span>
              <span style={styles.totalPrice} className="total-price">{order.totalPrice.toLocaleString()} VNĐ</span>
            </div>
            {order.status === "chờ xử lý" && (
              <button 
                style={styles.cancelBtn} 
                className="cancel-btn"
                onClick={() => cancelOrder(order._id)}
              >
                Hủy đơn hàng
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "20px auto",
    padding: "0 15px",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  pageHeader: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    color: "#005f73",
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: "5px"
  },
  orderCard: {
    background: "#fff",
    borderRadius: "15px",
    boxShadow: "0 5px 20px rgba(0, 0, 0, 0.05)",
    marginBottom: "25px",
    overflow: "hidden",
    border: "1px solid #eee",
  },
  orderHeader: {
    background: "linear-gradient(135deg, #0077be 0%, #00a8cc 100%)",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    color: "#fff",
  },
  orderId: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  dateText: {
    fontSize: "0.8rem",
    opacity: 0.9,
  },
  cardBody: {
    padding: "20px",
  },
  gridContainer: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1.8fr",
    gap: "30px",
  },
  sectionTitle: {
    fontSize: "0.95rem",
    color: "#005f73",
    borderBottom: "1px solid #eee",
    paddingBottom: "5px",
    marginBottom: "10px",
    fontWeight: "700",
  },
  infoSection: {
    fontSize: "0.9rem",
    color: "#444",
  },
  accountBox: {
    background: "#f8f9fa",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "15px",
    borderLeft: "3px solid #0077be",
  },
  shippingBox: {
    marginBottom: "10px",
  },
  addressText: {
    color: "#666",
    fontSize: "0.85rem",
  },
  noteBox: {
    background: "#fff9c4",
    padding: "8px 12px",
    borderRadius: "8px",
    marginBottom: "15px",
    border: "1px dashed #fbc02d",
  },
  paymentMethod: {
    display: "inline-block",
    background: "#e3f2fd",
    color: "#0077be",
    padding: "4px 10px",
    borderRadius: "5px",
    fontSize: "0.8rem",
    fontWeight: "600",
  },
  itemsSection: {
    maxHeight: "450px",
    overflowY: "auto",
  },
  productItem: {
    display: "flex",
    gap: "12px",
    marginBottom: "12px",
    paddingBottom: "12px",
    borderBottom: "1px solid #f5f5f5",
  },
  productImg: {
    width: "60px",
    height: "60px",
    objectFit: "cover",
    borderRadius: "8px",
  },
  productName: {
    fontWeight: "600",
    fontSize: "0.95rem",
  },
  productDetail: {
    fontSize: "0.85rem",
    color: "#666",
  },
  orderFooter: {
    background: "#fafafa",
    padding: "15px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #eee",
  },
  totalPrice: {
    color: "#d90429",
    fontSize: "1.5rem",
    fontWeight: "800",
    marginLeft: "10px",
  },
  cancelBtn: {
    background: "#ff7f50",
    color: "#fff",
    border: "none",
    padding: "10px 20px",
    borderRadius: "8px",
    fontWeight: "600",
    cursor: "pointer",
  },
  center: {
    textAlign: "center",
    padding: "80px 20px",
  }
};

const statusStyle = (status) => {
  const base = {
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.75rem",
    fontWeight: "700",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "5px",
    backgroundColor: "#fff"
  };

  switch (status) {
    case "chờ xử lý": return { ...base, color: "#f39c12" };
    case "đã xác nhận": return { ...base, color: "#3498db" };
    case "đang giao hàng": return { ...base, color: "#9b59b6" };
    case "hoàn thành": return { ...base, color: "#27ae60" };
    case "đã hủy": return { ...base, color: "#e74c3c" };
    default: return base;
  }
};