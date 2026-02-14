import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductComment from "./ProductComment";


export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [ratingAvg, setRatingAvg] = useState(0);
  const [ratingCount, setRatingCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchRating = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/comment/product/${id}`
        );
        const data = await res.json();

        const count = data.length;
        const avg =
          count > 0
            ? data.reduce((sum, c) => sum + (c.rating || 0), 0) /
              count
            : 0;

        setRatingCount(count);
        setRatingAvg(avg);
      } catch (err) {
        console.error("Lỗi lấy đánh giá", err);
      }
    };

    fetchRating();
  }, [id]);

  const renderStars = (avg = 0) => {
  const full = Math.floor(avg);
  const half = avg % 1 >= 0.5;

  return (
    <>
      {[...Array(5)].map((_, i) => {
        if (i < full)
          return (
            <i
              key={i}
              className="bi bi-star-fill text-warning"
            />
          );
        if (i === full && half)
          return (
            <i
              key={i}
              className="bi bi-star-half text-warning"
            />
          );
        return (
          <i
            key={i}
            className="bi bi-star text-warning"
          />
        );
      })}
    </>
  );
};

  // Chuẩn hóa ảnh
  const getImageSrc = (img) => {
    if (!img) return "/data/placeholder.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return `/${img}`;
  };

  // Lấy chi tiết sản phẩm
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:5000/api/product/${id}`
        );
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");

        const result = await res.json();
        const data = result.data || result;

        setProduct(data);
        setMainImage(data.images?.[0] || "");
      } catch (err) {
        setError(err.message || "Lỗi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

const handleAddToCart = async () => {
  if (!userId) {
    alert("Vui lòng đăng nhập");
    return;
  }

  //  Chuẩn hóa ảnh
  const image =
    product.images?.[0]
      ?.replace(/^\/+/, "") || "data/placeholder.jpg";

  try {
    const res = await fetch("http://localhost:5000/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId,
        productId: product._id,
        name: product.name,
        price: product.price,
        image, // ← CHUẨN
        quantity,
      }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    alert("✅ Đã thêm vào giỏ hàng");
  } catch (err) {
    alert(err.message || "Lỗi thêm giỏ hàng");
  }
};



  // ==== UI STATE ====
  if (loading)
    return <p style={styles.loading}>⏳ Đang tải sản phẩm...</p>;

  if (error)
    return <p style={styles.error}>{error}</p>;

  if (!product)
    return <p style={styles.error}>Không có dữ liệu sản phẩm</p>;

  const hasDiscount =
    product.oldprice && product.oldprice > product.price;

  const discountPercent = hasDiscount
    ? Math.round(
        ((product.oldprice - product.price) /
          product.oldprice) *
          100
      )
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        {/* LEFT */}
        <div style={styles.leftCol}>
          <img
            src={getImageSrc(mainImage)}
            alt={product.name}
            style={styles.mainImage}
            onError={(e) =>
              (e.target.src = "/data/placeholder.jpg")
            }
          />

          {product.images?.length > 1 && (
            <div style={styles.thumbnailContainer}>
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={getImageSrc(img)}
                  alt=""
                  style={{
                    ...styles.thumbnail,
                    border:
                      img === mainImage
                        ? "2px solid #0d6efd"
                        : "1px solid #ccc",
                  }}
                  onClick={() => setMainImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* RIGHT */}
        <div style={styles.rightCol}>

          <h2 className="mb-3 fw-bold" style={styles.title}>
            {product.name}
          </h2>

          <div style={styles.infoRow}>
          <span>Chủng loại:</span>
          <strong>{product.species}</strong>
        </div>

          {/* ===== DESCRIPTION ===== */}
          {product.description && (
            <div style={styles.section}>
              <h3>Mô tả sản phẩm</h3>
              <p>{product.description}</p>
            </div>
          )}

          {/* ===== RATING ===== */}
          <div style={styles.ratingBox}>
            {renderStars(ratingAvg)}
            <span style={styles.ratingText}>
              {ratingAvg.toFixed(1)} ({ratingCount} đánh giá)
            </span>
          </div>


          <div style={styles.priceGroup}>
            <span style={styles.price}>
              {product.price.toLocaleString()} VNĐ
            </span>

            {hasDiscount && (
              <>
                <span style={styles.oldPrice}>
                  {product.oldprice.toLocaleString()} VNĐ
                </span>
                <span style={styles.discountBadge}>
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          {/* <p>Số lượng còn: {product.quantity ?? 0}</p> */}

          <div style={styles.qtyBox}>
            <button
              className="btn btn-outline-secondary"
              style={styles.qtyBtn}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <i className="bi bi-dash-lg"></i>
            </button>

            <span style={styles.qtyValue}>{quantity}</span>

            <button
              className="btn btn-outline-secondary"
              style={styles.qtyBtn}
              onClick={() =>
                setQuantity((q) =>
                  Math.min(product.quantity, q + 1)
                )
              }
            >
              <i className="bi bi-plus-lg"></i>
            </button>
          </div>


          <button
            style={styles.button}
            disabled={product.status !== "available"}
            onClick={handleAddToCart}
          >
            <i className="bi bi-cart-plus"></i>{" "}
            Thêm vào giỏ hàng
          </button>
            <button
              type="button"
              style={styles.backBtn}
              onClick={() => navigate("/product")}
            >
              <i className="bi bi-arrow-left"></i>
              <span>Quay lại sản phẩm</span>
            </button>
        </div>
        
      </div>

      {/* ===== INSTRUCTION ===== */}
      {product.instruction && (
        <div style={styles.section}>
          <h3>Hướng dẫn chăm sóc</h3>
          <p>{product.instruction}</p>
        </div>
      )}

      <ProductComment productId={id} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "30px auto",
    padding: "0 16px",
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    color: "#212529",
  },

  row: {
    display: "flex",
    gap: "40px",
    flexWrap: "wrap",
  },

  /* ===== LEFT ===== */
  leftCol: {
    flex: "1 1 420px",
  },
  title: {
    fontSize: "30px",
    lineHeight: "1.3",
    fontWeight: "700",
    background: "linear-gradient(90deg, #fd7e14, #ff922b)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 6px rgba(253, 126, 20, 0.25)",
  },


  mainImage: {
    width: "100%",
    height: "440px",
    objectFit: "cover",
    borderRadius: "16px",
    border: "1px solid #e5e5e5",
    boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
  },

  thumbnailContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "14px",
    flexWrap: "wrap",
  },

  thumbnail: {
    width: "72px",
    height: "72px",
    objectFit: "cover",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s",
  },

  /* ===== RIGHT ===== */
  rightCol: {
    flex: "1 1 500px",
  },

  infoRow: {
    display: "flex",
    gap: "6px",
    color: "#6c757d",
    marginBottom: "12px",
    fontSize: "15px",
  },

  section: {
    marginTop: "24px",
    paddingTop: "14px",
    borderTop: "1px solid #eee",
  },

  sectionTitle: {
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "8px",
  },

  ratingBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    margin: "12px 0",
    fontSize: "16px",
  },

  ratingText: {
    color: "#6c757d",
    fontSize: "14px",
  },

  /* ===== PRICE ===== */
  priceGroup: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    margin: "18px 0",
  },

  price: {
    fontSize: "30px",
    fontWeight: "700",
    color: "#dc3545",
  },

  oldPrice: {
    fontSize: "16px",
    textDecoration: "line-through",
    color: "#adb5bd",
  },

  discountBadge: {
    background: "#dc3545",
    color: "#fff",
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },

  /* ===== QUANTITY ===== */
  qtyBox: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "18px",
    border: "1px solid #dee2e6",
    borderRadius: "12px",
    padding: "6px 12px",
    width: "fit-content",
  },

  qtyBtn: {
    width: "40px",
    height: "40px",
    padding: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  qtyValue: {
    minWidth: "36px",
    textAlign: "center",
    fontSize: "16px",
    fontWeight: "600",
  },

  /* ===== BUTTONS ===== */
  button: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "#0d6efd",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: "12px",
    border: "none",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    marginRight: "12px",
  },

backBtn: {
  display: "flex",          // ← xuống hàng
  alignItems: "center",
  gap: "8px",
  background: "#f8f9fa",
  color: "#343a40",
  padding: "10px 18px",
  borderRadius: "12px",
  border: "1px solid #dee2e6",
  fontSize: "14px",
  fontWeight: "500",
  cursor: "pointer",
  marginTop: "16px",
  width: "fit-content",     // không kéo full hàng
  transition: "all 0.2s ease",
},


  /* ===== STATE ===== */
  loading: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
  },

  error: {
    textAlign: "center",
    padding: "50px",
    fontSize: "18px",
    color: "#dc3545",
  },
};

