import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket/socket";
import { useNavigate } from "react-router-dom";

const LIVE_PRODUCT_API = "http://localhost:5000/api/productlive";

export default function UserLivestreamProduct({ livestreamId }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user.id;
  const navigate = useNavigate();

  useEffect(() => {
    if (!livestreamId) return;

    socket.emit("joinRoom", livestreamId);

    fetchLiveProducts();

    socket.on("updateLiveProducts", handleUpdate);

    return () => {
      socket.off("updateLiveProducts", handleUpdate);
    };
  }, [livestreamId]);

  const handleUpdate = ({ livestreamId: id }) => {
    if (id === livestreamId) {
      fetchLiveProducts();
    }
  };

  const handleGoToDetail = (productId) => {
    navigate(`/product/${productId}`);
  };

  const handleAddToCart = async (product) => {
    if (!userId) return alert("Vui lòng đăng nhập");

    const image =
      product.images?.[0]?.replace(/^\/+/, "") ||
      "data/placeholder.jpg";

    try {
      const res = await fetch(
        "http://localhost:5000/api/cart/add",
        {
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
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("✅ Đã thêm vào giỏ hàng");
    } catch (err) {
      alert(err.message || "Lỗi thêm giỏ hàng");
    }
  };


  const fetchLiveProducts = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${LIVE_PRODUCT_API}/${livestreamId}`
      );

      const list = Array.isArray(res.data?.products)
        ? res.data.products
        : [];

      // chỉ lấy sản phẩm đã ghim
      const pinned = list.filter((p) => p.isPinned);

      setProducts(pinned);
    } catch (err) {
      console.error("Lỗi load user live products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };


  const getImageUrl = (images) => {
    if (!images || images.length === 0)
      return "https://via.placeholder.com/100";

    const img = images[0];

    if (img.startsWith("http")) return img;

    return `http://localhost:5000${img}`;
  };

  /*  RENDER  */

  if (loading) {
    return <p className="text-muted">Đang tải sản phẩm...</p>;
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-muted py-3">
        <i className="bi bi-pin-angle fs-4"></i>
        <p className="mb-0">Chưa có sản phẩm được ghim</p>
      </div>
    );
  }
  return (
    <div style={styles.wrapper}>
      {products.map((item) => (
      <div
        key={item._id}
        style={styles.item}
        onClick={() => handleGoToDetail(item.product?._id)}
      >
        {/* IMAGE WRAPPER */}
        <div style={styles.imageWrapper}>
          <img
            src={getImageUrl(item.product?.images)}
            alt=""
            style={styles.image}
          />

          <div style={styles.badge}>
            <i className="bi bi-pin-angle-fill"></i>
            GHIM
          </div>
        </div>

        {/* INFO */}
        <div style={styles.info}>
          <div style={styles.name}>
            {item.product?.name}
          </div>

          <div>
            <span style={styles.price}>
              {Number(item.product?.price || 0).toLocaleString()} VNĐ
            </span>

            {item.product?.oldprice && (
              <span style={styles.oldPrice}>
                {Number(item.product.oldprice).toLocaleString()} VNĐ
              </span>
            )}
          </div>
        </div>

        {/* BUY BUTTON */}
        <button
          style={styles.buyBtn}
          onClick={(e) => {
            e.stopPropagation(); // ngăn không cho chuyển trang
            handleAddToCart(item.product);
          }}
        >
          <i className="bi bi-cart-plus"></i>
          Chọn Mua
        </button>
      </div>

      ))}
    </div>  
  );
}
const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    background: "#ffffff",
    padding: 10,
    borderRadius: 10,
    border: "2px solid #ff7a00",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    background: "#ffffff",
    padding: "8px 10px",
    borderRadius: 10,
    border: "1.5px solid #ff7a00",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  imageWrapper: {
    position: "relative",
    width: 80,
    height: 80,
    flexShrink: 0,
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: 6,
  },

  badge: {
    position: "absolute",
    top: 2,
    left: 2,
    background: "#ff7a00",
    color: "#fff",
    fontSize: 9,
    padding: "2px 5px",
    borderRadius: 4,
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: 3,
  },

  info: {
    flex: 1,
    color: "#000000",
  },

  name: {
    fontSize: 14,
    fontWeight: 600,
    color: "#000",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    marginBottom: 4,
  },

  price: {
    color: "#ff4d4f",
    fontWeight: "bold",
    fontSize: 14,
    marginRight: 8,
  },

  oldPrice: {
    color: "#777",
    fontSize: 12,
    textDecoration: "line-through",
  },

  buyBtn: {
    background: "linear-gradient(135deg, #ff7a18, #ff4d4f)",
    border: "none",
    color: "#fff",
    padding: "6px 14px",
    minWidth: 80,
    height: 32,
    borderRadius: 20,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    boxShadow: "0 2px 6px rgba(255,77,79,0.3)",
    transition: "all 0.2s ease",
  },

};
