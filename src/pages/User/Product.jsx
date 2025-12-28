import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Product() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/product");
      if (!res.ok) throw new Error("Không thể tải sản phẩm");

      const result = await res.json();
      const list = Array.isArray(result)
        ? result
        : result.data || result.products || [];

      setProducts(list);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>⏳ Đang tải...</p>;
  if (error) return <p style={{ color: "red", padding: 20 }}>{error}</p>;

  /* ================= PHÂN LOẠI ================= */
  const fishList = products.filter((p) => p.type === "fish");
  const medicineList = products.filter((p) => p.type === "medicine");
  const equipmentList = products.filter((p) => p.type === "equipment");

  /* ================= RENDER LIST ================= */
  const renderList = (title, icon, list) => (
    <>
      <h3 style={styles.sectionTitle}>
        {icon} {title}
      </h3>

      <div style={styles.grid}>
        {list.map((item) => {
          const hasDiscount =
            item.oldprice && item.oldprice > item.price;

          return (
            <div
              key={item._id}
              style={styles.card}
              onClick={() =>
                item._id && navigate(`/product/${item._id}`)
              }
            >
              <img
                src={item.images?.[0] || "https://via.placeholder.com/250"}
                alt={item.name}
                style={styles.image}
              />

              <h4 style={styles.name}>{item.name}</h4>

              {item.type === "fish" && item.species && (
                <p style={styles.species}>Loài: {item.species}</p>
              )}

              {/* PRICE */}
              <div style={styles.priceBox}>
                {hasDiscount && (
                  <span style={styles.oldprice}>
                    {item.oldprice.toLocaleString()} đ
                  </span>
                )}

                <span
                  style={
                    hasDiscount ? styles.priceSale : styles.priceNormal
                  }
                >
                  {item.price.toLocaleString()} đ
                </span>

                {hasDiscount && (
                  <span style={styles.discount}>
                    -{Math.round(
                      ((item.oldprice - item.price) / item.oldprice) *
                        100
                    )}%
                  </span>
                )}
              </div>

              <button
                style={styles.button}
                onClick={(e) => {
                  e.stopPropagation();
                  alert("🛒 Thêm vào giỏ hàng (demo)");
                }}
              >
                Mua
              </button>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Danh sách sản phẩm</h2>

      {renderList("Cá cảnh", "🐠", fishList)}
      {renderList("Thuốc & Hóa chất", "💊", medicineList)}
      {renderList("Hồ & Thiết bị", "🛠", equipmentList)}
    </div>
  );
}

/* ================= STYLES ================= */

const styles = {
  container: {
    width: "90%",
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px 0",
  },

  title: {
    marginBottom: "30px",
  },

  sectionTitle: {
    margin: "30px 0 15px",
    color: "#0d6efd",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    borderRadius: "6px",
    padding: "15px",
    boxShadow: "0 0 10px rgba(0,0,0,.1)",
    textAlign: "center",
    cursor: "pointer",
    transition: "transform .2s, box-shadow .2s",
  },

  image: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "6px",
    marginBottom: "10px",
  },

  name: {
    fontSize: "16px",
    marginBottom: "6px",
  },

  species: {
    fontSize: "14px",
    color: "#444",
  },

  priceBox: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "8px",
    margin: "8px 0",
    flexWrap: "wrap",
  },

  oldprice: {
    fontSize: "14px",
    color: "#888",
    textDecoration: "line-through",
  },

  priceSale: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#dc3545",
  },

  priceNormal: {
    fontSize: "16px",
    fontWeight: "bold",
    color: "#0d6efd",
  },

  discount: {
    fontSize: "13px",
    background: "#dc3545",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: "4px",
  },

  button: {
    padding: "8px 20px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
