import { useEffect, useState } from "react";

export default function Orders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH ORDERS ===== */
  const fetchOrders = async () => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/orders/user/${userId}`
      );
      const data = await res.json();
      console.log("ORDERS API:", data);
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

  /* ===== CANCEL ORDER ===== */
  const cancelOrder = async (orderId) => {
    if (!window.confirm("Bạn chắc chắn muốn hủy đơn hàng này?")) return;

    try {
      await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: "đã hủy" }),
        }
      );

      fetchOrders(); // reload lại danh sách
    } catch (err) {
      console.error("Cancel order error:", err);
      alert("Hủy đơn thất bại");
    }
  };

  /* ===== GUARDS ===== */
  if (!userId)
    return <p style={styles.center}>⚠️ Vui lòng đăng nhập</p>;

  if (loading)
    return <p style={styles.center}>⏳ Đang tải đơn hàng...</p>;

  if (orders.length === 0)
    return <p style={styles.center}>📦 Bạn chưa có đơn hàng nào</p>;

  const getImageUrl = (image) => {
    if (!image) return "/data/placeholder.jpg";
    if (image.startsWith("http")) return image;
    return `/${image.replace(/^\/+/, "")}`;
  };

  /* ===== RENDER ===== */
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Đơn hàng của tôi</h2>

      {orders.map((order) => (
        <div key={order._id} style={styles.orderBox}>
          {/* ===== HEADER ===== */}
          <div style={styles.header}>
            <div>
              <p><b>Mã đơn:</b> {order._id}</p>
              <p><b>Ngày đặt:</b> {new Date(order.createdAt).toLocaleString()}</p>
            </div>
            <span style={statusStyle(order.status)}>
              {order.status}
            </span>
          </div>

          {/* ===== USER INFO ===== */}
          {order.user && (
            <div style={styles.section}>
              <h4>👤 Thông tin người đặt</h4>
              <p><b>Tài khoản:</b> {order.user.username}</p>
              <p><b>Email:</b> {order.user.email}</p>
            </div>
          )}

          {/* ===== SHIPPING ADDRESS ===== */}
          {order.shippingAddress && (
            <div style={styles.section}>
              <h4>📍 Địa chỉ giao hàng</h4>
              <p><b>Họ tên:</b> {order.shippingAddress.fullName}</p>
              <p><b>SĐT:</b> {order.shippingAddress.phone}</p>
              <p><b>Địa chỉ:</b> {order.shippingAddress.address}</p>
              {order.shippingAddress.note && (
                <p><b>Ghi chú:</b> {order.shippingAddress.note}</p>
              )}
            </div>
          )}

          {/* ===== PAYMENT ===== */}
          <div style={styles.section}>
            <h4>💳 Thanh toán</h4>
            <p>
              <b>Phương thức:</b> {order.paymentMethod?.toUpperCase()}
            </p>
          </div>

          {/* ===== ITEMS ===== */}
          <div style={styles.section}>
            <h4>🛒 Sản phẩm</h4>

            {order.items.map((item, index) => (
              <div key={index} style={styles.item}>
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  style={styles.image}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/data/placeholder.jpg";
                  }}
                />
                <div style={styles.info}>
                  <h5>{item.name}</h5>
                  <p>Số lượng: {item.quantity}</p>
                  <p>Đơn giá: {item.price.toLocaleString()} đ</p>
                  <p style={styles.subtotal}>
                    Thành tiền: {(item.price * item.quantity).toLocaleString()} đ
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ===== TOTAL ===== */}
          <div style={styles.footer}>
            <span><b>Tổng tiền:</b></span>
            <span style={styles.total}>
              {order.totalPrice.toLocaleString()} đ
            </span>
          </div>

          {/* ===== ACTION ===== */}
          {order.status === "chờ xử lý" && (
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button
                style={styles.cancelBtn}
                onClick={() => cancelOrder(order._id)}
              >
                ❌ Hủy đơn hàng
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}


/* ===== STYLES ===== */

const styles = {
  cancelBtn: {
  background: "#ef4444",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: 8,
  fontWeight: 600,
  cursor: "pointer",
},

  container: {
    maxWidth: 950,
    margin: "20px auto",
    padding: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  center: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 18,
  },
  orderBox: {
    border: "1px solid #ddd",
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    background: "#fff",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #eee",
    paddingBottom: 10,
    marginBottom: 12,
  },
  section: {
    marginBottom: 14,
  },
  item: {
    display: "flex",
    gap: 12,
    padding: "10px 0",
    borderBottom: "1px solid #eee",
  },
  image: {
    width: 90,
    height: 90,
    objectFit: "cover",
    borderRadius: 8,
  },
  info: {
    flex: 1,
  },
  subtotal: {
    color: "#1976d2",
    fontWeight: 600,
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 16,
    paddingTop: 10,
    borderTop: "2px dashed #ddd",
    fontSize: 18,
    fontWeight: 700,
  },
  total: {
    color: "#2e7d32",
  },
};

/* ===== STATUS COLOR ===== */
const statusStyle = (status) => {
  const base = {
    padding: "6px 14px",
    borderRadius: 20,
    color: "#fff",
    fontSize: 14,
    textTransform: "capitalize",
    fontWeight: 600,
  };

  switch (status) {
    case "chờ xử lý":
      return { ...base, background: "#f9a825" };
    case "đã xác nhận":
      return { ...base, background: "#0288d1" };
    case "đang giao hàng":
      return { ...base, background: "#6a1b9a" };
    case "hoàn thành":
      return { ...base, background: "#2e7d32" };
    case "đã hủy":
      return { ...base, background: "#c62828" };
    default:
      return base;
  }
};
