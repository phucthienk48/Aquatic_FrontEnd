import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchProduct({ isMobile }) {
  const [keyword, setKeyword] = useState("");
  const [products, setProducts] = useState([]);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const boxRef = useRef(null);

  /* FETCH SEARCH */
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
          `http://localhost:5000/api/product/search?keyword=${encodeURIComponent(keyword)}`
        );
        const data = await res.json();
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

  /* CLICK OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) {
        setShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* HANDLERS */
  const handleSearchAll = () => {
    if (!keyword.trim()) return;
    navigate(`/product?keyword=${keyword}`);
    setShow(false);
    setKeyword("");
  };

  const handleSelectProduct = (id) => {
    navigate(`/product/${id}`);
    setShow(false);
    setKeyword("");
  };

  return (
    <div style={styles.searchWrapper} ref={boxRef}>
      {/* SEARCH INPUT BOX */}
      <div style={{
        ...styles.searchBox,
        width: isMobile ? "100%" : "400px",
        borderColor: show ? "#008080" : "#eee"
      }}>
        <input
          style={styles.searchInput}
          placeholder="Bạn đang tìm loài cá nào?..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => keyword && setShow(true)}
          onKeyDown={(e) => e.key === "Enter" && handleSearchAll()}
        />
        <button style={styles.searchBtn} onClick={handleSearchAll}>
          {loading ? (
            <div className="spinner-border spinner-border-sm text-success"></div>
          ) : (
            <i className="bi bi-search"></i>
          )}
        </button>
      </div>

      {/* RESULT DROPDOWN */}
      {show && (
        <div style={{
          ...styles.resultDropdown,
          width: isMobile ? "calc(100vw - 24px)" : "550px",
          left: isMobile ? "50%" : "0",
          transform: isMobile ? "translateX(-50%)" : "none",
        }}>
          {/* HEADER */}
          <div style={styles.header}>
            <i className="bi bi-water" style={{marginRight: 8, color: '#008080'}}></i>
            Kết quả tìm kiếm cho: <span style={styles.keywordHighlight}>"{keyword}"</span>
          </div>

          {/* LIST */}
          <div style={styles.list}>
            {!loading && products.length === 0 && (
              <div style={styles.empty}>
                <i className="bi bi-search-heart" style={{fontSize: 24, display: 'block', marginBottom: 8}}></i>
                Rất tiếc, chưa tìm thấy sản phẩm này...
              </div>
            )}

            {products.map((item) => (
              <div
                key={item._id}
                style={styles.item}
                onClick={() => handleSelectProduct(item._id)}
                className="search-item-hover"
              >
                <img
                  src={item.images?.[0] || "https://via.placeholder.com/60"}
                  alt={item.name}
                  style={styles.image}
                />

                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={styles.name}>{item.name}</div>
                  <div style={styles.priceBox}>
                    <span style={styles.price}>{item.price?.toLocaleString()} VNĐ</span>
                    {item.oldprice && (
                      <span style={styles.oldprice}>{item.oldprice.toLocaleString()} VNĐ</span>
                    )}
                  </div>
                </div>
                <i className="bi bi-chevron-right" style={styles.arrowIcon}></i>
              </div>
            ))}
          </div>

          {/* FOOTER */}
          {products.length > 0 && (
            <div style={styles.footer} onClick={handleSearchAll}>
              Xem tất cả <strong>{products.length}</strong> sản phẩm thủy sinh
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  searchWrapper: {
    position: "relative",
    zIndex: 1001,
  },
  searchBox: {
    display: "flex",
    alignItems: "center",
    background: "#f8f9fa",
    borderRadius: "12px",
    border: "2px solid #eee",
    overflow: "hidden",
    transition: "all 0.3s ease",
    boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
  },
  searchInput: {
    flex: 1,
    padding: "10px 16px",
    border: "none",
    outline: "none",
    fontSize: "14px",
    background: "transparent",
    color: "#333",
  },
  searchBtn: {
    padding: "0 16px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: "#008080",
    fontSize: "18px",
  },
  resultDropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    background: "rgba(255, 255, 255, 0.98)",
    borderRadius: "16px",
    overflow: "hidden",
    boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
    border: "1px solid rgba(0, 128, 128, 0.1)",
    backdropFilter: "blur(10px)",
  },
  header: {
    padding: "12px 16px",
    fontSize: "13px",
    color: "#666",
    borderBottom: "1px solid #f0f0f0",
    background: "#fcfdfd",
  },
  keywordHighlight: {
    color: "#008080",
    fontWeight: "bold",
  },
  list: {
    maxHeight: "400px",
    overflowY: "auto",
  },
  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 16px",
    cursor: "pointer",
    borderBottom: "1px solid #f8f8f8",
    transition: "background 0.2s",
    position: "relative",
  },
  image: {
    width: "50px",
    height: "50px",
    borderRadius: "8px",
    objectFit: "cover",
    border: "1px solid #eee",
  },
  name: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
  priceBox: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  price: {
    color: "red", 
    fontWeight: "700",
    fontSize: "14px",
  },
  oldprice: {
    fontSize: "12px",
    textDecoration: "line-through",
    color: "#999",
  },
  arrowIcon: {
    color: "#ccc",
    fontSize: "12px",
  },
  footer: {
    padding: "12px",
    textAlign: "center",
    fontSize: "13px",
    color: "#fff",
    background: "linear-gradient(90deg, #008080, #004d4d)",
    cursor: "pointer",
    fontWeight: "500",
  },
  empty: {
    padding: "30px",
    textAlign: "center",
    color: "#999",
    fontSize: "14px",
  },
};