import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?._id || user?.id;

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  // ✅ Chuẩn hóa ảnh
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
          <h2 style={styles.title}>{product.name}</h2>

          <div style={styles.priceGroup}>
            <span style={styles.price}>
              {product.price.toLocaleString()} đ
            </span>

            {hasDiscount && (
              <>
                <span style={styles.oldPrice}>
                  {product.oldprice.toLocaleString()} đ
                </span>
                <span style={styles.discountBadge}>
                  -{discountPercent}%
                </span>
              </>
            )}
          </div>

          <p>Số lượng còn: {product.quantity ?? 0}</p>

          {/* 🔢 CHỌN SỐ LƯỢNG */}
          <div style={styles.qtyBox}>
            <button
              onClick={() =>
                setQuantity((q) => Math.max(1, q - 1))
              }
            >
              −
            </button>
            <span>{quantity}</span>
            <button
              onClick={() =>
                setQuantity((q) =>
                  Math.min(product.quantity, q + 1)
                )
              }
            >
              +
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
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  container: { maxWidth: 1200, margin: "0 auto", padding: 20 },
  row: { display: "flex", gap: 30, flexWrap: "wrap" },
  leftCol: { flex: 1 },
  rightCol: { flex: 1 },
  mainImage: { width: "100%", borderRadius: 8 },
  thumbnailContainer: { display: "flex", gap: 10, marginTop: 10 },
  thumbnail: { width: 70, height: 70, cursor: "pointer" },
  title: { fontSize: 24 },
  priceGroup: { display: "flex", gap: 10, alignItems: "center" },
  price: { fontSize: 22, color: "#dc3545", fontWeight: "bold" },
  oldPrice: { textDecoration: "line-through" },
  discountBadge: {
    background: "#28a745",
    color: "#fff",
    padding: "2px 6px",
  },
  qtyBox: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    margin: "15px 0",
  },
  button: {
    padding: "10px 20px",
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  },
  loading: { padding: 20 },
  error: { padding: 20, color: "red" },
};
