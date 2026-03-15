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
  const [cartSuccess, setCartSuccess] = useState(null);

  const [suggestProducts, setSuggestProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [currentSlide, setCurrentSlide] = useState(0);

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

useEffect(() => {
  if (!product?.species) return;

  const fetchSuggestProducts = async () => {
    try {

      const res = await fetch(
        "http://localhost:5000/api/product"
      );

      const result = await res.json();
      const products = result.data || result;

      const filtered = products
        .filter(
          (p) =>
            p.species === product.species &&
            p._id !== product._id
        )
        .slice(0, 4); // chỉ hiển thị 4 sản phẩm

      setSuggestProducts(filtered);

    } catch (err) {
      console.error("Lỗi lấy sản phẩm gợi ý", err);
    }
  };

  fetchSuggestProducts();
}, [product]);

  useEffect(() => {

  const fetchRatings = async () => {

    const ratingData = {};

    for (const p of suggestProducts) {

      try {

        const res = await fetch(
          `http://localhost:5000/api/comment/product/${p._id}`
        );

        const data = await res.json();

        const count = data.length;

        const avg =
          count > 0
            ? data.reduce((s, c) => s + (c.rating || 0), 0) / count
            : 0;

        ratingData[p._id] = {
          avg,
          count
        };

      } catch (err) {
        console.error(err);
      }

    }

    setRatings(ratingData);

  };

  if (suggestProducts.length > 0) {
    fetchRatings();
  }

}, [suggestProducts]);

// useEffect(() => {

//   if (suggestProducts.length <= 4) return;

//   const interval = setInterval(() => {

//     setCurrentSlide((prev) =>
//       prev + 4 >= suggestProducts.length ? 0 : prev + 1
//     );

//   }, 3000);

//   return () => clearInterval(interval);

// }, [suggestProducts]);

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
      setCartSuccess({
        type: "error",
        message: "Vui lòng đăng nhập",
      });

      setTimeout(() => {
        setCartSuccess(null);
      }, 2500);

      return;
    }

    // Chuẩn hóa ảnh
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
          quantity,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // ✅ Popup thành công
      setCartSuccess({
        type: "success",
        message: "Đã thêm vào giỏ hàng",
        productName: product.name,
      });

      setTimeout(() => {
        setCartSuccess(null);
      }, 2500);

    } catch (err) {
      setCartSuccess({
        type: "error",
        message: err.message || "Lỗi thêm giỏ hàng",
      });

      setTimeout(() => {
        setCartSuccess(null);
      }, 2500);
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
          {/* <span>Chủng loại:</span>
          <strong>{product.species}</strong> */}
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
            <span style={{ ...styles.price, fontSize: "30px"}}>
              {product.price.toLocaleString()} VNĐ
            </span>

            {hasDiscount && (
              <>
                <span style={{...styles.oldPrice, fontSize: "22px"}}>
                  {product.oldprice.toLocaleString()} VNĐ
                </span>
                <span style={{...styles.discountBadge, fontSize: "16px"}}>
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
                  Math.min(product.quantity, 99 ,q + 1)
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
      {/* ===== SẢN PHẨM GỢI Ý ===== */}
      <div style={styles.suggestSlider}>
        <div
          style={{
            ...styles.sliderTrack,
            transform: `translateX(-${currentSlide * 300}px)`
          }}
        >
        {suggestProducts
          .slice(currentSlide, currentSlide + 4)
          .map((p) => {

          const hasDiscount = p.oldprice && p.oldprice > p.price;

          const discountPercent = hasDiscount
            ? Math.round(((p.oldprice - p.price) / p.oldprice) * 100)
            : 0;

          return (
            <div
              key={p._id}
              style={styles.card}
              onMouseEnter={(e)=>{
                e.currentTarget.style.transform="translateY(-8px)";
                e.currentTarget.style.boxShadow="0 15px 30px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e)=>{
                e.currentTarget.style.transform="translateY(0)";
                e.currentTarget.style.boxShadow="0 5px 15px rgba(0,0,0,0.08)";
              }}
            >

              <img
                src={getImageSrc(p.images?.[0])}
                alt={p.name}
                style={styles.cardImage}
                onClick={() => navigate(`/product/${p._id}`)}
              />

              <div style={styles.cardBody}>

                <div style={styles.cardName}>
                  {p.name}
                </div>

                {/*  Rating */}
                <div style={styles.ratingRow}>
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi ${
                        i < Math.round(ratings[p._id]?.avg || 0)
                          ? "bi-star-fill"
                          : "bi-star"
                      }`}
                      style={styles.star}
                    />
                  ))}
                    <span style={styles.ratingText}>
                      {(ratings[p._id]?.avg || 0).toFixed(1)} ({ratings[p._id]?.count || 0})
                    </span>
                </div>

                {/* PRICE */}
                <div style={styles.priceRow}>

                  {hasDiscount && (
                    <span style={styles.oldPrice}>
                      {p.oldprice.toLocaleString()} VNĐ
                    </span>
                  )}

                  <span style={styles.price}>
                    {p.price.toLocaleString()} VNĐ
                  </span>

                  {hasDiscount && (
                    <span style={styles.discount}>
                      -{discountPercent}%
                    </span>
                  )}

                </div>

                <button
                  style={styles.buyBtn}
                  disabled={product.status !== "available"}
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus"></i>{" "}
                  Chọn mua
                </button>

              </div>

            </div>
          );
        })}
      </div>
    </div>
      <ProductComment productId={id} />
      {cartSuccess && (
      <div style={styles.overlay}>
        <div style={styles.popup}>
          
          <div
            style={{
              ...styles.iconCircle,
              background:
                cartSuccess.type === "success"
                  ? "rgba(25,118,210,0.12)"
                  : "rgba(220,53,69,0.12)",
              color:
                cartSuccess.type === "success"
                  ? "#1976d2"
                  : "#dc3545"
            }}
          >
            <i
              className={`bi ${
                cartSuccess.type === "success"
                  ? "bi-cart-check-fill"
                  : "bi-exclamation-circle-fill"
              }`}
            ></i>
          </div>

          <h5
            style={{
              ...styles.title,
              color:
                cartSuccess.type === "success"
                  ? "#1976d2"
                  : "#dc3545"
            }}
          >
            {cartSuccess.message}
          </h5>

          {cartSuccess.productName && (
            <p style={styles.productName}>
              {cartSuccess.productName}
            </p>
          )}

          <div
            style={{
              ...styles.progressBar,
              background:
                cartSuccess.type === "success"
                  ? "#1976d2"
                  : "#dc3545"
            }}
          />
        </div>
      </div>
    )}
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

  leftCol: {
    flex: "1 1 420px",
  },
  
  title: {
    fontSize: "30px",
    fontWeight: "700",
    lineHeight: "1.3",
    marginBottom: "14px",
    background: "linear-gradient(90deg, #0072ff, #00c6ff )",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    textShadow: "0 2px 6px rgba(0,0,0,0.15)",
    letterSpacing: "0.3px"
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
    gap: "12px",
    margin: "18px 0",
    padding: "12px 16px",
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    background: "#fafafa"
  },

  price: {
    fontSize: "35px",
    fontWeight: "700",
    color: "#ee4d2d"
  },

  oldPrice: {
    fontSize: "15px",
    textDecoration: "line-through",
    color: "#9ca3af"
  },

  discountBadge: {
    background: "#ee4d2d",
    color: "#fff",
    padding: "3px 8px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600"
  },
  

qtyBox: {
  display: "flex",
  alignItems: "center",
  border: "1px solid #ddd",
  borderRadius: "6px",
  overflow: "hidden",
  width: "120px",
  marginBottom: "18px"
},

qtyBtn: {
  width: "40px",
  height: "40px",
  border: "none",
  background: "#f8f9fa",
  cursor: "pointer",
  fontSize: "16px"
},

qtyValue: {
  flex: 1,
  textAlign: "center",
  fontWeight: "600",
  fontSize: "16px"
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
  display: "flex",          
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
  width: "fit-content",    
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
  overlay: {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.25)",
  backdropFilter: "blur(5px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

popup: {
  width: "360px",
  padding: "30px 25px 38px",
  borderRadius: "18px",
  background: "#ffffff",
  textAlign: "center",
  boxShadow: "0 20px 60px rgba(25,118,210,0.25)",
  position: "relative",
  animation: "fadeScaleIn 0.25s ease"
},

iconCircle: {
  width: "75px",
  height: "75px",
  borderRadius: "50%",
  margin: "0 auto 15px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "34px",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)"
},



productName: {
  fontSize: 14,
  color: "#555",
  marginBottom: 10
},

progressBar: {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: "4px",
  width: "100%",
  animation: "progressShrink 2.5s linear",
  borderRadius: "0 0 18px 18px"
},
/* ===== SUGGEST PRODUCT ===== */

suggestSlider: {
  overflow: "hidden",
  width: "100%",
  marginTop: 40
},

card: {
  width: 280,
  background: "#f7f7f7",
  borderRadius: 16,
  padding: 10,
  boxShadow: "0 5px 15px rgba(0,0,0,0.08)"
},

cardImage: {
  width: "100%",
  height: 200,
  objectFit: "cover",
  borderRadius: 12,
  cursor: "pointer"
},

cardBody: {
  padding: "10px 6px"
},

cardName: {
  fontSize: 18,
  fontWeight: 600,
  textAlign: "center",
  marginBottom: 6
},

ratingRow: {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: 4,
  marginBottom: 6
},

star: {
  color: "#f4b400",
  fontSize: 14
},

ratingText: {
  marginLeft: 6,
  fontSize: 14,
  color: "#555"
},

priceRow: {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  marginBottom: 10
},

oldPrice: {
  textDecoration: "line-through",
  color: "#888",
  fontSize: 14
},

price: {
  color: "#e53935",
  fontSize: 15,
  fontWeight: 700
},

discount: {
  background: "#e53935",
  color: "#fff",
  fontSize: 13,
  padding: "2px 6px",
  borderRadius: 6
},

buyBtn: {
  width: "100%",
  background: "#1e6ee6",
  color: "#fff",
  border: "none",
  padding: "10px 0",
  borderRadius: 10,
  fontSize: 16,
  fontWeight: 600,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 6
},
sliderTrack: {
  display: "flex",
  gap: 20,
  transition: "transform 0.6s ease"
},
};

