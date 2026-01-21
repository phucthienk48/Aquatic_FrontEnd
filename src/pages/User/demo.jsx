import { useEffect, useState } from "react";

export default function Orders() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH ORDERS ===== */
  useEffect(() => {
    if (!userId) return;

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


    fetchOrders();
  }, [userId]);

  /* ===== GUARDS ===== */
  if (!userId)
    return <p style={styles.center}>⚠️ Vui lòng đăng nhập</p>;

  if (loading)
    return <p style={styles.center}>⏳ Đang tải đơn hàng...</p>;

  if (orders.length === 0)
    return <p style={styles.center}>📦 Bạn chưa có đơn hàng nào</p>;

  const getImageUrl = (image) => {
    if (!image) return "/data/placeholder.jpg";

    // Ảnh Cloudinary / URL đầy đủ
    if (image.startsWith("http")) return image;

    // Ảnh local (từ backend)
    return `/${image.replace(/^\/+/, "")}`;
  };
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

    fetchOrders(); // reload lại đơn hàng
  } catch (err) {
    console.error("Cancel order error:", err);
    alert("Hủy đơn thất bại");
  }
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
              <p>
                <b>Ngày đặt:</b>{" "}
                {new Date(order.createdAt).toLocaleString()}
              </p>
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
              <b>Phương thức:</b>{" "}
              {order.paymentMethod?.toUpperCase()}
            </p>
          </div>

          {/* ===== ITEMS ===== */}
          <div style={styles.section}>
            <h4>🛒 Sản phẩm</h4>

            {Array.isArray(order.items) &&
              order.items.map((item, index) => (
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
                      Thành tiền:{" "}
                      {(item.price * item.quantity).toLocaleString()} đ
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
