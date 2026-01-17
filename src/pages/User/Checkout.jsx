import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: "",
    phone: "",
    address: "",
    note: "",
  });

  /* ===== FETCH CART ===== */
  useEffect(() => {
    if (!userId) return;

    fetch(`http://localhost:5000/api/cart/${userId}`)
      .then((res) => res.json())
      .then(setCart)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId]);

  if (!userId)
    return <p style={styles.center}>⚠️ Vui lòng đăng nhập</p>;

  if (loading)
    return <p style={styles.center}>⏳ Đang tải...</p>;

  if (!cart || cart.items.length === 0)
    return <p style={styles.center}>🛒 Giỏ hàng trống</p>;

  const totalPrice = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const isVietQRValid =
    shippingAddress.fullName.trim() &&
    shippingAddress.phone.trim();

  const transferContent = `${shippingAddress.fullName} ${shippingAddress.phone}`;

  /* ===== PLACE ORDER ===== */
  const placeOrder = async () => {
    if (
      !shippingAddress.fullName ||
      !shippingAddress.phone ||
      !shippingAddress.address
    ) {
      alert("Vui lòng nhập đầy đủ thông tin giao hàng");
      return;
    }

    if (paymentMethod === "vietqr" && !isVietQRValid) {
      alert("Vui lòng nhập họ tên và số điện thoại để tạo mã VietQR");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          items: cart.items,
          totalPrice,
          paymentMethod,
          shippingAddress,
        }),
      });

      if (!res.ok) throw new Error("Đặt hàng thất bại");

      await fetch(
        `http://localhost:5000/api/cart/clear/${userId}`,
        { method: "DELETE" }
      );

      alert("🎉 Đặt hàng thành công!");
      navigate("/order");
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi xảy ra");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧾 Thanh toán</h2>

      {/* ===== SHIPPING ===== */}
      <div style={styles.box}>
        <h4>📍 Thông tin giao hàng</h4>

        <input
          style={styles.input}
          placeholder="Họ tên người nhận"
          value={shippingAddress.fullName}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, fullName: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Số điện thoại"
          value={shippingAddress.phone}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, phone: e.target.value })
          }
        />

        <input
          style={styles.input}
          placeholder="Địa chỉ giao hàng"
          value={shippingAddress.address}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, address: e.target.value })
          }
        />

        <textarea
          style={styles.textarea}
          placeholder="Ghi chú"
          value={shippingAddress.note}
          onChange={(e) =>
            setShippingAddress({ ...shippingAddress, note: e.target.value })
          }
        />
      </div>
{/* ===== PRODUCT DETAILS ===== */}
<div style={styles.box}>
  <h4>🛍️ Sản phẩm trong đơn hàng</h4>

  {cart.items.map((item) => (
    <div key={item.product} style={styles.productRow}>
      <img
        src={`/${item.image}`}
        alt={item.name}
        style={styles.productImg}
        onError={(e) => (e.target.src = "/data/placeholder.jpg")}
      />

      <div style={styles.productInfo}>
        <h5 style={styles.productName}>{item.name}</h5>

        <p style={styles.muted}>
          Đơn giá: {item.price.toLocaleString()} đ
        </p>

        <p style={styles.muted}>
          Số lượng: <b>x{item.quantity}</b>
        </p>
      </div>

      <div style={styles.productTotal}>
        {(item.price * item.quantity).toLocaleString()} đ
      </div>
    </div>
  ))}

  <hr />

  <div style={styles.totalRow}>
    <span><b>Tổng thanh toán</b></span>
    <span style={styles.total}>
      {totalPrice.toLocaleString()} đ
    </span>
  </div>
</div>

      {/* ===== PAYMENT ===== */}
      <div style={styles.box}>
        <h4>💳 Phương thức thanh toán</h4>

        <label style={styles.radio}>
          <input
            type="radio"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          Thanh toán khi nhận hàng (COD)
        </label>

        <label style={styles.radio}>
          <input
            type="radio"
            checked={paymentMethod === "vietqr"}
            onChange={() => setPaymentMethod("vietqr")}
          />
          Chuyển khoản VietQR
        </label>

        {paymentMethod === "vietqr" && (
          <>
            {!isVietQRValid ? (
              <p style={styles.warning}>
                ⚠️ Vui lòng nhập <b>Họ tên</b> và <b>Số điện thoại</b> để hiển thị mã QR
              </p>
            ) : (
              <div style={styles.qrBox}>
                <p><b>Quét mã VietQR để thanh toán</b></p>
                <img
                  src={`https://api.vietqr.io/image/970422-1234567890-print.png?amount=${totalPrice}&addInfo=${encodeURIComponent(
                    transferContent
                  )}`}
                  alt="VietQR"
                  style={styles.qr}
                />
                <p>Nội dung CK: <b>{transferContent}</b></p>
              </div>
            )}
          </>
        )}
      </div>

      {/* ===== ACTION ===== */}
      <button style={styles.submitBtn} onClick={placeOrder}>
        🛍️ Đặt hàng
      </button>
    </div>
  );
}

/* ===== STYLES ===== */

const styles = {
  container: { maxWidth: 800, margin: "auto", padding: 16 },
  title: { textAlign: "center", marginBottom: 20 },
  center: { textAlign: "center", marginTop: 40 },
  box: {
    border: "1px solid #ddd",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  textarea: {
    width: "100%",
    padding: 10,
    minHeight: 60,
    borderRadius: 6,
    border: "1px solid #ccc",
  },
  radio: { display: "block", marginBottom: 8 },
  qrBox: {
    marginTop: 12,
    padding: 12,
    border: "1px dashed #999",
    borderRadius: 8,
    textAlign: "center",
  },
  qr: { width: 200, margin: "10px auto" },
  warning: { color: "#d32f2f", marginTop: 8 },
  submitBtn: {
    width: "100%",
    padding: 14,
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    borderRadius: 10,
    fontSize: 16,
    cursor: "pointer",
  },
  productRow: {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "12px 0",
  borderBottom: "1px solid #eee",
},

productImg: {
  width: 80,
  height: 80,
  objectFit: "cover",
  borderRadius: 8,
  border: "1px solid #ddd",
},

productInfo: {
  flex: 1,
},

productName: {
  margin: 0,
  fontSize: 16,
},

productTotal: {
  fontWeight: 600,
  color: "#2e7d32",
  minWidth: 120,
  textAlign: "right",
},

muted: {
  margin: "4px 0",
  fontSize: 14,
  color: "#666",
},

};
