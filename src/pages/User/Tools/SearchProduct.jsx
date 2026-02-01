import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchProduct({ isMobile }) {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const boxRef = useRef(null);

  /* ================= FETCH SEARCH ================= */
  useEffect(() => {
    if (!keyword.trim()) {
      setProducts([]);
      setShow(false);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:5000/api/product/search?keyword=${encodeURIComponent(
            keyword
          )}`
        );

        const data = await res.json(); // backend trả mảng

        setProducts(data || []);
        setShow(true);
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delay);
  }, [keyword]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= HANDLERS ================= */
  const handleSearchAll = () => {
    if (!keyword.trim()) return;
    navigate(`/product?keyword=${keyword}`);
    setShow(false);
  };

  const handleSelectProduct = (id) => {
    navigate(`/product/${id}`);
    setShow(false);
  };

  /* ================= RENDER ================= */
  return (
    <>
      {/* SEARCH BOX */}
      <div
        style={{
          ...styles.searchBox,
          width: isMobile ? "100%" : "380px",
        }}
      >
        <input
          style={styles.searchInput}
          placeholder="Tìm kiếm sản phẩm..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => keyword && setShow(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchAll()}
        />
        <button style={styles.searchBtn} onClick={handleSearchAll}>
          <i className="bi bi-search"></i>
        </button>
      </div>

      {/* OVERLAY RESULT */}
      {show && (
        <div style={styles.overlay}>
          <div style={styles.resultBox} ref={boxRef}>
            {/* HEADER */}
            <div style={styles.header}>
              Kết quả cho:{" "}
              <span style={{ color: "#ee4d2d" }}>{keyword}</span>
            </div>

            {/* BODY */}
            <div style={styles.list}>
              {loading && (
                <div style={styles.loading}>Đang tìm kiếm...</div>
              )}

              {!loading && products.length === 0 && (
                <div style={styles.empty}>
                  Không tìm thấy sản phẩm phù hợp
                </div>
              )}

              {products.map((item) => (
                <div
                  key={item._id}
                  style={styles.item}
                  onClick={() => handleSelectProduct(item._id)}
                >
                  <img
                    src={
                      item.images?.[0] ||
                      "https://via.placeholder.com/60"
                    }
                    alt={item.name}
                    style={styles.image}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={styles.name}>{item.name}</div>

                    <div style={styles.priceBox}>
                      <span style={styles.price}>
                        {item.price?.toLocaleString()}đ
                      </span>
                      {item.oldprice && (
                        <span style={styles.oldprice}>
                          {item.oldprice.toLocaleString()}đ
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            {products.length > 0 && (
              <div style={styles.footer} onClick={handleSearchAll}>
                Xem tất cả kết quả cho{" "}
                <span style={{ color: "#ee4d2d" }}>{keyword}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ================= STYLES (Shopee-like) ================= */
const styles = {
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#fff",
    borderRadius: 24,
    border: "1px solid #ddd",
    overflow: "hidden",
  },

  searchInput: {
    flex: 1,
    padding: "10px 14px",
    border: "none",
    outline: "none",
    fontSize: 14,
  },

  searchBtn: {
    padding: "0 14px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#555",
  },

  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.4)",
    zIndex: 999,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    paddingTop: 110,
  },

  resultBox: {
    width: 680,
    maxWidth: "95%",
    background: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    boxShadow: "0 8px 30px rgba(0,0,0,0.15)",
  },

  header: {
    padding: 12,
    fontWeight: 600,
    borderBottom: "1px solid #eee",
  },

  list: {
    maxHeight: "55vh",
    overflowY: "auto",
  },

  item: {
    display: "flex",
    gap: 12,
    padding: 12,
    cursor: "pointer",
    borderBottom: "1px solid #f2f2f2",
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    objectFit: "cover",
  },

  name: {
    fontSize: 14,
    lineHeight: "18px",
    marginBottom: 6,
    fontWeight: 500,
  },

  priceBox: {
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  price: {
    color: "#ee4d2d",
    fontWeight: 600,
  },

  oldprice: {
    fontSize: 13,
    textDecoration: "line-through",
    color: "#999",
  },

  footer: {
    padding: 12,
    textAlign: "center",
    fontWeight: 500,
    cursor: "pointer",
    background: "#fafafa",
  },

  loading: {
    padding: 16,
    textAlign: "center",
    color: "#666",
  },

  empty: {
    padding: 20,
    textAlign: "center",
    color: "#999",
  },
};
