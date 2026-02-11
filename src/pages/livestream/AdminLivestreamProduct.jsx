import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket/socket";

const PRODUCT_API = "http://localhost:5000/api/product";
const LIVE_PRODUCT_API = "http://localhost:5000/api/productlive";

export default function AdminLivestreamProduct({ livestreamId }) {
  const [products, setProducts] = useState([]);
  const [liveProducts, setLiveProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showProducts, setShowProducts] = useState(false);

  /*  LOAD DATA  */

  useEffect(() => {
    if (!livestreamId) return;
    loadAllData();
    socket.emit("joinRoom", livestreamId);
  }, [livestreamId]);

  const loadAllData = async () => {
    setLoading(true);
    await Promise.all([fetchProducts(), fetchLiveProducts()]);
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCT_API);

      const productList = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.data)
        ? res.data.data
        : [];

      setProducts(productList);
    } catch (err) {
      console.error("Lỗi load products:", err);
      setProducts([]);
    }
  };

  const fetchLiveProducts = async () => {
    try {
      const res = await axios.get(
        `${LIVE_PRODUCT_API}/${livestreamId}`
      );

      setLiveProducts(
        Array.isArray(res.data?.products)
          ? res.data.products
          : []
      );
    } catch (err) {
      console.error("Lỗi load live products:", err);
      setLiveProducts([]);
    }
  };

  /*  ACTION  */

    const addToLivestream = async (productId) => {
    await axios.post(
        `${LIVE_PRODUCT_API}/${livestreamId}`,
        { productId }
    );

    socket.emit("updateLiveProduct", {
        livestreamId,
        action: "add",
        productId,
    });

    fetchLiveProducts();
    };

    const removeFromLivestream = async (productId) => {
    await axios.delete(
        `${LIVE_PRODUCT_API}/${livestreamId}/${productId}`
    );

    socket.emit("updateLiveProduct", {
        livestreamId,
        action: "remove",
        productId,
    });

    fetchLiveProducts();
    };

    const pinProduct = async (productId) => {
    await axios.put(
        `${LIVE_PRODUCT_API}/${livestreamId}/pin/${productId}`
    );

    socket.emit("updateLiveProduct", {
        livestreamId,
        action: "pin",
        productId,
    });

    fetchLiveProducts();
    };


  /*  CLOUDINARY IMAGE  */

  const getImageUrl = (images) => {
    if (!images || images.length === 0)
      return "https://via.placeholder.com/80";

    const img = images[0];

    // Nếu là Cloudinary (đã full URL)
    if (img.startsWith("http")) return img;

    // fallback nếu backend vẫn trả path cũ
    return `http://localhost:5000${img}`;
  };


  return (
    <div className="p-3 bg-white rounded border">
      <h4 className="mb-3">
        <i className="bi bi-broadcast me-2 text-danger"></i>
        Quản lý sản phẩm Livestream
      </h4>

      {loading && <p>Đang tải dữ liệu...</p>}

      {/*  DANH SÁCH ĐANG LIVE */}
      <h5 className="mb-3">
        <i className="bi bi-camera-video me-2"></i>
        Sản phẩm đang live
      </h5>

      {liveProducts.length === 0 && (
        <p className="text-muted">Chưa có sản phẩm</p>
      )}

      {liveProducts.map((item) => (
        <div
          key={item._id}
          className="d-flex align-items-center gap-3 p-2 mb-2 bg-light rounded"
        >
          <img
            src={getImageUrl(item.product?.images)}
            alt=""
            width="70"
            height="70"
            style={{ objectFit: "cover", borderRadius: 6 }}
          />

          <div className="flex-grow-1">
            <strong>{item.product?.name}</strong>

            <div>
              <span className="text-danger fw-bold me-2">
                {Number(
                  item.product?.price || 0
                ).toLocaleString()}
                 VNĐ
              </span>

              {item.product?.oldprice && (
                <span className="text-muted text-decoration-line-through">
                  {Number(
                    item.product.oldprice
                  ).toLocaleString()}
                   VNĐ
                </span>
              )}
            </div>
          </div>

            <button
            className={`btn btn-sm ${
                item.isPinned
                ? "btn-danger"
                : "btn-outline-secondary"
            }`}
            onClick={() =>
                pinProduct(item.product?._id)
            }
            >
            <i className="bi bi-pin-angle-fill me-1"></i>
            {item.isPinned ? "Bỏ ghim" : "Ghim"}
            </button>


          <button
            className="btn btn-sm btn-outline-dark"
            onClick={() =>
              removeFromLivestream(
                item.product?._id
              )
            }
          >
            <i className="bi bi-x-lg"></i> Xóa
          </button>
        </div>
      ))}

      <hr />

      {/*  TOGGLE DANH SÁCH GỐC */}

      <button
        className="btn btn-primary mb-3"
        onClick={() =>
          setShowProducts(!showProducts)
        }
      >
        <i class="bi bi-plus-square"></i>
        {showProducts
          ? " Danh sách sản phẩm"
          : " Thêm sản phẩm"}
      </button>

      {showProducts && (
        <div>
          {products.length === 0 && (
            <p>Không có sản phẩm</p>
          )}

          {products.map((p) => (
            <div
              key={p._id}
              className="d-flex justify-content-between border-bottom py-2"
            >
              <span>{p.name}</span>

              <button
                className="btn btn-sm btn-success"
                onClick={() =>
                  addToLivestream(p._id)
                }
              >
                <i className="bi bi-plus-lg"></i> Thêm 
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: 15,
    background: "#fff",
    borderRadius: 8,
    border: "1px solid #ddd",
  },
  card: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: 10,
    marginBottom: 8,
    background: "#f5f5f5",
    borderRadius: 6,
  },
  image: {
    width: 70,
    height: 70,
    objectFit: "cover",
    borderRadius: 6,
  },
  price: {
    color: "red",
    fontWeight: "bold",
    marginRight: 10,
  },
  oldPrice: {
    textDecoration: "line-through",
    color: "#888",
  },
  btn: {
    border: "none",
    padding: "6px 8px",
    borderRadius: 4,
    cursor: "pointer",
  },
  listItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "6px 0",
    borderBottom: "1px dashed #ddd",
  },
  addBtn: {
    background: "#0d6efd",
    color: "#fff",
    border: "none",
    padding: "4px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
