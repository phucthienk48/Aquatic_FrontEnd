import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecommendProduct() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* FETCH RECOMMEND */
  useEffect(() => {
    fetchRecommend();
  }, []);

  const fetchRecommend = async () => {
    try {
      const url = userId
        ? `http://localhost:5000/api/recommend?userId=${userId}`
        : `http://localhost:5000/api/recommend`;

      const res = await fetch(url);
      if (!res.ok) throw new Error("Không thể tải sản phẩm gợi ý");

      const data = await res.json();
      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      setProducts(list);

      /* fetch rating */
      const ratingMap = {};
      for (const p of list) {
        ratingMap[p._id] = await fetchRating(p._id);
      }
      setRatings(ratingMap);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  /* FETCH RATING */
  const fetchRating = async (productId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/comment/product/${productId}`
      );
      const comments = await res.json();

      if (!Array.isArray(comments) || comments.length === 0) {
        return { avg: 0, count: 0 };
      }

      const total = comments.reduce(
        (sum, c) => sum + (c.rating || 0),
        0
      );

      return {
        avg: total / comments.length,
        count: comments.length,
      };
    } catch {
      return { avg: 0, count: 0 };
    }
  };

  /* RENDER STAR */
  const renderStars = (avg = 0) => {
    const full = Math.floor(avg);
    const half = avg - full >= 0.5;

    return [...Array(5)].map((_, i) => {
      if (i < full)
        return <i key={i} className="bi bi-star-fill text-warning"></i>;
      if (i === full && half)
        return <i key={i} className="bi bi-star-half text-warning"></i>;
      return <i key={i} className="bi bi-star text-warning"></i>;
    });
  };

  /* ADD TO CART */
  const handleAddToCart = async (product) => {
    if (!userId) return alert("Vui lòng đăng nhập");

    const image =
      product.images?.[0]?.replace(/^\/+/, "") ||
      "data/placeholder.jpg";

    try {
      const res = await fetch("http://localhost:5000/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          image,
          quantity: 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("✅ Đã thêm vào giỏ hàng");
    } catch (err) {
      alert(err.message || "Lỗi thêm giỏ hàng");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>⏳ Đang tải gợi ý...</p>;
  if (error) return <p style={{ color: "red", padding: 20 }}>{error}</p>;

  /* RENDER LIST */
  const renderList = (title, icon, list) => (
    <div style={styles.section}>
      <div style={styles.ribbonWrap}>
        <div style={styles.ribbonTail} />
        <div style={styles.ribbon}>
          <span style={styles.ribbonIcon}>{icon}</span>
          {title}
        </div>
      </div>

      <div style={styles.divider}></div>

      <div style={styles.grid}>
        {list.map((item) => {
          const hasDiscount =
            item.oldprice && item.oldprice > item.price;

          const r = ratings[item._id] || { avg: 0, count: 0 };

          return (
            <div
              key={item._id}
              style={styles.card}
              onClick={() => navigate(`/product/${item._id}`)}
            >
              <img
                src={item.images?.[0] || "https://via.placeholder.com/250"}
                alt={item.name}
                style={styles.image}
              />

              <h4 style={styles.name}>{item.name}</h4>

              <div style={styles.rating}>
                {renderStars(r.avg)}
                <span style={styles.ratingText}>
                  {r.avg.toFixed(1)} ({r.count})
                </span>
              </div>

              <div style={styles.priceBox}>
                {hasDiscount && (
                  <span style={styles.oldprice}>
                    {item.oldprice.toLocaleString()} VNĐ
                  </span>
                )}

                <span
                  style={
                    hasDiscount
                      ? styles.priceSale
                      : styles.priceNormal
                  }
                >
                  {item.price.toLocaleString()} VNĐ
                </span>

                {hasDiscount && (
                  <span style={styles.discount}>
                    -
                    {Math.round(
                      ((item.oldprice - item.price) /
                        item.oldprice) *
                        100
                    )}
                    %
                  </span>
                )}
              </div>

              <button
                style={{
                  ...styles.button,
                  opacity: userId ? 1 : 0.6,
                  cursor: userId ? "pointer" : "not-allowed",
                }}
                disabled={!userId}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToCart(item);
                }}
              >
                <i className="bi bi-cart-plus me-2"></i>
                {userId ? "Chọn Mua" : "Đăng nhập để mua"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
         {userId ? "Gợi ý dành cho bạn" : "Sản phẩm nổi bật"}
      </h2>

      {renderList(
        userId ? "Phù hợp với nhu cầu của bạn" : "Bán chạy & đánh giá cao",
        "",
        products
      )}
    </div>
  );
}

/* STYLE */

const styles = {
  container: {
    width: "92%",
    maxWidth: "1200px",
    margin: "auto",
    padding: "20px 0",
  },
  title: {
    marginBottom: 30,
    fontSize: 26,
    fontWeight: 700,
  },
  section: { marginBottom: 40 },
  ribbonWrap: { display: "flex", alignItems: "center", marginBottom: 18 },
  ribbonTail: {
    width: 0,
    height: 0,
    borderTop: "18px solid transparent",
    borderBottom: "18px solid transparent",
    borderRight: "20px solid #dc3545",
  },
  ribbon: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    background: "#dc3545",
    color: "#fff",
    padding: "8px 26px",
    fontWeight: 600,
    borderRadius: "0 6px 6px 0",
  },
  ribbonIcon: { fontSize: 18 },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 22,
  },
  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 14,
    boxShadow: "0 6px 18px rgba(0,0,0,.08)",
    cursor: "pointer",
    transition: "transform .2s",
    textAlign: "center",
  },
  image: {
    width: "100%",
    height: 210,
    objectFit: "cover",
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: 600,
    margin: "6px 0",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  rating: { display: "flex", justifyContent: "center", gap: 6 },
  ratingText: { fontSize: 13, color: "#666" },
  priceBox: { display: "flex", gap: 8, justifyContent: "center" },
  oldprice: { textDecoration: "line-through", color: "#999", fontSize: 13 },
  priceSale: { color: "#dc3545", fontWeight: 700 },
  priceNormal: { color: "#0d6efd", fontWeight: 700 },
  discount: {
    background: "#dc3545",
    color: "#fff",
    padding: "2px 6px",
    borderRadius: 6,
    fontSize: 12,
  },
  button: {
    marginTop: 10,
    padding: "9px 20px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: 8,
    fontWeight: 600,
  },
  divider: {
    height: 6,
    margin: "12px 0 24px",
    borderRadius: 4,
    background:
      "linear-gradient(90deg, #dc3545, #fd7e14, #ffc107, #198754, #0dcaf0, #0d6efd, #6f42c1)",
  },
};
