import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Cart() {
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id || user?._id;

  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    const res = await fetch(`http://localhost:5000/api/cart/${userId}`);
    const data = await res.json();
    setCart(data);
  };

  useEffect(() => {
    if (userId) fetchCart();
  }, [userId]);

  const getImageUrl = (image) => {
    if (!image) return "/data/placeholder.jpg";

    // Cloudinary hoặc URL đầy đủ
    if (image.startsWith("http")) return image;

    // Ảnh local
    return `/${image.replace(/^\/+/, "")}`;
  };

  const updateQty = async (productId, quantity) => {
    if (quantity < 1) return;

    await fetch("http://localhost:5000/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, productId, quantity }),
    });
    fetchCart();
  };

  const removeItem = async (productId) => {
    await fetch(
      `http://localhost:5000/api/cart/remove/${userId}/${productId}`,
      { method: "DELETE" }
    );
    fetchCart();
  };

  const clearCart = async () => {
    await fetch(
      `http://localhost:5000/api/cart/clear/${userId}`,
      { method: "DELETE" }
    );
    setCart({ items: [] });
  };
  
  const navigate = useNavigate();

  const goToCheckout = () => {
    navigate("/checkout");
  };

  if (!cart || cart.items.length === 0)
    return <p style={styles.center}>🛒 Giỏ hàng trống</p>;

  const total = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        <i className="bi bi-cart3"></i> Giỏ hàng
      </h2>

      {cart.items.map((item) => (
        <div key={item.product} style={styles.item}>
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
            <p style={styles.price}>
              {item.price.toLocaleString()} VNĐ
            </p>

            <div style={styles.qtyRow}>
              <button
                style={styles.qtyBtn}
                onClick={() =>
                  updateQty(item.product, item.quantity - 1)
                }
              >
                <i className="bi bi-dash"></i>
              </button>

              <span style={styles.qty}>{item.quantity}</span>

              <button
                style={styles.qtyBtn}
                onClick={() =>
                  updateQty(item.product, item.quantity + 1)
                }
              >
                <i className="bi bi-plus"></i>
              </button>
            </div>

            <button
              style={styles.removeBtn}
              onClick={() => removeItem(item.product)}
            >
              <i className="bi bi-trash"></i> Xóa
            </button>
          </div>
        </div>
      ))}

      <div style={styles.footer}>
        <h4 style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <i className="bi bi-cash-stack" style={{ fontSize: 22, color: "#198754" }}></i>
          Tổng tiền:
          <span style={styles.total}>
            {total.toLocaleString()} VNĐ
          </span>
        </h4>

        <div style={styles.actions}>
          <button style={styles.checkoutBtn} onClick={goToCheckout}>
            <i className="bi bi-credit-card"></i> Thanh toán
          </button>

          <button style={styles.clearBtn} onClick={clearCart}>
            <i className="bi bi-trash3"></i> Xóa toàn bộ giỏ
          </button>
        </div>
      </div>

    </div>
  );
}


const styles = {
  container: {
    maxWidth: 900,
    margin: "40px auto",
    padding: 25,
    background: "#ffffff",
    borderRadius: 10,
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
  },

  title: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "30px",
    background: "linear-gradient(90deg,#0f172a,#1d4ed8)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },

  titleIcon: {
    fontSize: "30px",
    color: "#0d6efd"
  },

  item: {
    display: "flex",
    gap: 18,
    padding: 18,
    marginBottom: 15,
    borderRadius: 10,
    border: "1px solid #e9ecef",
    background: "#fafafa",
    alignItems: "center",
    transition: "all 0.2s ease"
  },

  image: {
    width: 95,
    height: 95,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #ddd"
  },

  info: {
    flex: 1
  },

  price: {
    color: "#e53935",
    fontWeight: 700,
    fontSize: 16
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    margin: "10px 0"
  },

  qtyBtn: {
    width: 32,
    height: 32,
    border: "1px solid #dee2e6",
    background: "#f8f9fa",
    borderRadius: 6,
    cursor: "pointer"
  },

  qty: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: 600
  },

  removeBtn: {
    border: "1px solid #dc3545",
    background: "#fff",
    color: "#dc3545",
    cursor: "pointer",
    padding: "6px 12px",
    borderRadius: 8,
    fontSize: 14,
    fontWeight: 600,
    display: "inline-flex",
    alignItems: "center",
    gap: 6
  },

  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTop: "2px solid #f1f1f1",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  },

  total: {
    color: "#2e7d32",
    fontWeight: 700,
    fontSize: 20,
    marginLeft: 10
  },

  actions: {
    display: "flex",
    gap: 12
  },

  checkoutBtn: {
    background: "#2e7d32",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(46,125,50,0.3)"
  },

  clearBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 600
  },

  center: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 18,
    color: "#666"
  }
};
