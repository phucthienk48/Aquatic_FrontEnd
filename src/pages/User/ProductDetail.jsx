import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/product/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");

        const result = await res.json();
        setProduct(result.data);
      } catch (err) {
        setError(err.message || "Lỗi tải sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p style={styles.loading}>⏳ Đang tải sản phẩm...</p>;
  if (error) return <p style={styles.error}>❌ {error}</p>;
  if (!product) return <p style={styles.error}>❌ Không có dữ liệu sản phẩm</p>;

  const hasDiscount = product.oldprice && product.oldprice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.oldprice - product.price) / product.oldprice) * 100)
    : 0;

  return (
    <div style={styles.container}>
      <div style={styles.row}>
        <div style={styles.leftCol}>
          <img
            src={product.images?.[0] || "https://via.placeholder.com/450"}
            alt={product.name}
            style={styles.mainImage}
          />

          {product.images?.length > 1 && (
            <div style={styles.thumbnailContainer}>
              {product.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt=""
                  style={styles.thumbnail}
                />
              ))}
            </div>
          )}
        </div>

        <div style={styles.rightCol}>
          <h2 style={styles.title}>{product.name}</h2>

          <p style={styles.subTitle}>
            Loại: <strong>{product.type}</strong>
            {product.species && <> | Loài: <strong>{product.species}</strong></>}
          </p>

          <div style={styles.priceGroup}>
            <span style={styles.price}>{product.price.toLocaleString()} đ</span>

            {hasDiscount && (
              <>
                <span style={styles.oldPrice}>
                  {product.oldprice.toLocaleString()} đ
                </span>
                <span style={styles.discountBadge}>-{discountPercent}%</span>
              </>
            )}
          </div>

          <p>
            Trạng thái:{" "}
            {product.status === "available" ? (
              <span style={styles.inStock}>✔ Còn hàng</span>
            ) : (
              <span style={styles.outOfStock}>✖ Hết hàng</span>
            )}
          </p>

          <p>Số lượng còn: {product.quantity ?? 0}</p>

          <button
            style={styles.button}
            disabled={product.status !== "available"}
          >
            🛒 Thêm vào giỏ hàng
          </button>
        </div>
      </div>

      <div style={styles.detailSection}>
        <h4>📄 Mô tả sản phẩm</h4>
        <p>{product.description || "Đang cập nhật"}</p>

        <h4>📌 Hướng dẫn sử dụng / chăm sóc</h4>
        <p>{product.instruction || "Đang cập nhật"}</p>

        <h4>📦 Bảo quản</h4>
        <p>{product.storage || "Đang cập nhật"}</p>

        <h4>⚠️ Lưu ý</h4>
        <p style={styles.warning}>{product.warning || "Không có cảnh báo"}</p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "90%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "20px 0",
    fontFamily: "Arial, sans-serif",
  },
  row: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
  },
  leftCol: {
    flex: "1 1 45%",
  },
  rightCol: {
    flex: "1 1 45%",
  },
  mainImage: {
    width: "100%",
    borderRadius: 8,
    marginBottom: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    objectFit: "cover",
  },
  thumbnailContainer: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  thumbnail: {
    width: 70,
    height: 70,
    objectFit: "cover",
    border: "1px solid #ccc",
    borderRadius: 4,
    cursor: "pointer",
  },
  title: {
    fontSize: "24px",
    marginBottom: 10,
  },
  subTitle: {
    color: "#555",
    marginBottom: 10,
  },
  priceGroup: {
    marginBottom: 12,
    display: "flex",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  price: {
    fontSize: "22px",
    color: "#dc3545",
    fontWeight: "bold",
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#888",
    fontSize: "16px",
  },
  discountBadge: {
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: "14px",
    padding: "2px 6px",
    borderRadius: "4px",
  },
  inStock: {
    color: "green",
    fontWeight: "bold",
  },
  outOfStock: {
    color: "red",
    fontWeight: "bold",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#0d6efd",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    marginTop: 15,
    cursor: "pointer",
  },
  detailSection: {
    marginTop: 40,
  },
  warning: {
    color: "red",
    fontWeight: "bold",
  },
  loading: {
    padding: 20,
  },
  error: {
    padding: 20,
    color: "red",
  },
};
