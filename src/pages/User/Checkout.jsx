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

    const BANK_ID = "970436";        // Mã ngân hàng (VD: Vietcombank)
    const ACCOUNT_NO = "1030670478"; // Số tài khoản nhận tiền
    const ACCOUNT_NAME = "NGUYEN THIEN PHUC";

    const getImageUrl = (image) => {
    if (!image) return "/data/placeholder.jpg";

    // Ảnh Cloudinary / URL đầy đủ
    if (image.startsWith("http")) return image;

    // Ảnh local
    return `/${image.replace(/^\/+/, "")}`;
  };

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
      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert("❌ Có lỗi xảy ra");
    }
  };

  return (
    <div style={styles.container}>
      <h2 className="text-center mb-4 fw-bold text-primary">
        <i className="bi bi-receipt-cutoff me-2"></i>
        Thanh toán
      </h2>

      {/* ===== SHIPPING ===== */}
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light fw-semibold">
        <i className="bi bi-geo-alt-fill text-danger me-2"></i>
        Thông tin giao hàng
      </div>

      <div className="card-body">
        {/* HỌ TÊN */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-person-fill"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Họ tên người nhận"
            value={shippingAddress.fullName}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, fullName: e.target.value })
            }
          />
        </div>

        {/* SĐT */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-telephone-fill"></i>
          </span>
          <input
            type="tel"
            className="form-control"
            placeholder="Số điện thoại"
            value={shippingAddress.phone}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, phone: e.target.value })
            }
          />
        </div>

        {/* ĐỊA CHỈ */}
        <div className="input-group mb-3">
          <span className="input-group-text">
            <i className="bi bi-house-door-fill"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Địa chỉ giao hàng"
            value={shippingAddress.address}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, address: e.target.value })
            }
          />
        </div>

        {/* GHI CHÚ */}
        <div className="form-floating">
          <textarea
            className="form-control"
            placeholder="Ghi chú"
            style={{ height: 90 }}
            value={shippingAddress.note}
            onChange={(e) =>
              setShippingAddress({ ...shippingAddress, note: e.target.value })
            }
          />
          <label>
            <i className="bi bi-pencil-square me-1"></i>
            Ghi chú cho người giao hàng
          </label>
        </div>
      </div>
    </div>

  {/* ===== PRODUCT DETAILS ===== */}
  <div className="card shadow-sm mb-4">
    <div className="card-header bg-light fw-semibold">
      <i className="bi bi-bag-fill text-primary me-2"></i>
      Sản phẩm trong đơn hàng
    </div>

    <div className="card-body p-0">
      {cart.items.map((item) => (
        <div
          key={item.product}
          className="d-flex align-items-center gap-3 px-3 py-3 border-bottom"
        >
          {/* ẢNH */}
          <img
            src={getImageUrl(item.image)}
            alt={item.name}
            className="rounded border"
            style={{ width: 80, height: 80, objectFit: "cover" }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/data/placeholder.jpg";
            }}
          />

          {/* INFO */}
          <div className="flex-grow-1">
            <h6 className="mb-1 fw-semibold">{item.name}</h6>

            <div className="text-muted small">
              <i className="bi bi-tag me-1"></i>
              Đơn giá: {item.price.toLocaleString()} VNĐ
            </div>

            <div className="text-muted small">
              <i className="bi bi-box me-1"></i>
              Số lượng: <b>x{item.quantity}</b>
            </div>
          </div>

          {/* TỔNG */}
          <div className="fw-bold text-success text-end">
            {(item.price * item.quantity).toLocaleString()} VNĐ
          </div>
        </div>
      ))}
    </div>

    {/* TOTAL */}
    <div className="card-footer d-flex justify-content-between align-items-center bg-white">
      <span className="fw-semibold">
        <i className="bi bi-cash-stack me-1 text-success"></i>
        Tổng thanh toán
      </span>

      <span className="fs-5 fw-bold text-danger">
        {totalPrice.toLocaleString()} VNĐ
      </span>
    </div>
  </div>


      {/* ===== PAYMENT ===== */}
    <div className="card shadow-sm mb-4">
      <div className="card-header bg-light fw-semibold">
        <i className="bi bi-credit-card-fill text-success me-2"></i>
        Phương thức thanh toán
      </div>

      <div className="card-body">
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="radio"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          <label className="form-check-label">
            <i className="bi bi-cash-coin me-2 text-warning"></i>
            Thanh toán khi nhận hàng (COD)
          </label>
        </div>

        <div className="form-check">
          <input
            className="form-check-input"
            type="radio"
            checked={paymentMethod === "vietqr"}
            onChange={() => setPaymentMethod("vietqr")}
          />
          <label className="form-check-label">
            <i className="bi bi-qr-code-scan me-2 text-primary"></i>
            Chuyển khoản VietQR
          </label>
        </div>

      {paymentMethod === "vietqr" && (
        <>
          {!isVietQRValid ? (
            <div className="alert alert-warning mt-3">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              Nhập họ tên & số điện thoại để tạo mã VietQR
            </div>
          ) : (
            <div className="text-center mt-3">
              <p className="fw-semibold mb-2">
                <i className="bi bi-qr-code-scan me-2"></i>
                Quét mã VietQR để thanh toán
              </p>

              <img
                src={`https://api.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-print.png?amount=${totalPrice}&addInfo=${encodeURIComponent(
                  transferContent
                )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`}
                alt="VietQR"
                style={{ width: 270 }}
              />

              {/* <p className="small text-muted mt-2">
                Nội dung CK: <b>{transferContent}</b>
              </p> */}
            </div>
          )}
        </>
      )}


      </div>
    </div>


      {/* ===== ACTION ===== */}
      <button
        className="btn btn-success btn-lg w-100 d-flex align-items-center justify-content-center gap-2"
        onClick={placeOrder}
      >
        <i className="bi bi-bag-check-fill"></i>
        Đặt hàng
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
