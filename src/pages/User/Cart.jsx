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
              {item.price.toLocaleString()} đ
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
        <h4>
          💰 Tổng tiền:{" "}
          <span style={styles.total}>
            {total.toLocaleString()} đ
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

/* ================== CSS ================== */

const styles = {
  container: {
    maxWidth: 850,
    margin: "40px auto",
    padding: 25,
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  },

  title: {
    textAlign: "center",
    marginBottom: 25,
    fontSize: 26,
  },

  item: {
    display: "flex",
    gap: 20,
    padding: "15px 0",
    borderBottom: "1px solid #e0e0e0",
  },

  image: {
    width: 90,
    height: 90,
    objectFit: "cover",
    borderRadius: 8,
    border: "1px solid #ddd",
  },

  info: {
    flex: 1,
  },

  price: {
    color: "#dc3545",
    fontWeight: "bold",
  },

  qtyRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    margin: "10px 0",
  },

  qtyBtn: {
    width: 34,
    height: 34,
    border: "none",
    background: "#0d6efd",
    color: "#fff",
    borderRadius: 6,
    cursor: "pointer",
  },

  qty: {
    minWidth: 24,
    textAlign: "center",
    fontWeight: "bold",
  },

  removeBtn: {
    border: "none",
    background: "transparent",
    color: "#dc3545",
    cursor: "pointer",
    padding: 0,
  },

  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },

  total: {
    color: "#198754",
    fontWeight: "bold",
  },

  clearBtn: {
    background: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "10px 16px",
    borderRadius: 6,
    cursor: "pointer",
  },

  center: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 18,
  },
  actions: {
  display: "flex",
  gap: 10,
},
checkoutBtn: {
  background: "#2e7d32",
  color: "#fff",
  border: "none",
  padding: "10px 16px",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
},

};
