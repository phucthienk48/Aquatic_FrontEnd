import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 6; // Tăng lên 6 để grid nhìn đầy đặn hơn trên desktop

export default function Knowledge() {
  const navigate = useNavigate();
  const [knowledges, setKnowledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchKnowledge();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/knowledge");
      if (!res.ok) throw new Error("Không thể tải kiến thức");
      const result = await res.json();
      const list = Array.isArray(result) ? result : result.data || result.knowledges || [];
      setKnowledges(list);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth <= 1024;

  /* PAGINATION LOGIC */
  const totalPages = Math.ceil(knowledges.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItems = knowledges.slice(startIndex, startIndex + PAGE_SIZE);

  if (loading) return <div style={styles.center}>⏳ Đang tải kiến thức thủy sinh...</div>;
  if (error) return <div style={styles.center}><p style={{color: 'red'}}>{error}</p></div>;

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <header style={styles.header}>
        <h2 style={styles.pageTitle}>CẨM NANG THỦY SINH</h2>
        <div style={styles.underline}></div>
        <p style={styles.pageSubTitle}>Chia sẻ bí quyết từ các chuyên gia hàng đầu của Phúc Long Aquatic</p>
      </header>

      {/* HERO SECTION - Responsive Grid */}
      <div style={{ 
        ...styles.hero, 
        gridTemplateColumns: isMobile || isTablet ? "1fr" : "1.8fr 1fr" 
      }}>
        <div style={styles.heroVideoWrapper}>
          <video src="/data/poster1.mp4" autoPlay muted loop style={styles.heroVideo} />
          <div style={styles.videoBadge}>VIDEO NỔI BẬT</div>
        </div>

        <div style={styles.heroContent}>
          <h3 style={styles.heroTitle}>Kỹ thuật setup bể thủy sinh chuẩn Nature Style</h3>
          <p style={styles.heroText}>
            Khám phá quy trình từng bước để tạo ra một hệ sinh thái thu nhỏ ngay trong ngôi nhà của bạn. 
            Từ việc chọn layout, xử lý lũa đá đến tối ưu hệ vi sinh.
          </p>
          <button
            style={styles.heroButton}
            onClick={() => knowledges.length > 0 && navigate(`/knowledge/${knowledges[0].knowledgeId}`)}
          >
            KHÁM PHÁ NGAY <i className="bi bi-arrow-right-short"></i>
          </button>
        </div>
      </div>

      {/* ARTICLES GRID */}
      <div style={{ 
        ...styles.grid, 
        gridTemplateColumns: isMobile ? "1fr" : (isTablet ? "repeat(2, 1fr)" : "repeat(3, 1fr)") 
      }}>
        {currentItems.map((item) => (
          <div
            key={item.knowledgeId}
            style={styles.card}
            onClick={() => navigate(`/knowledge/${item.knowledgeId}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-10px)";
              e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.12)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            <div style={styles.imageWrapper}>
              <img src={item.img || "https://via.placeholder.com/400x250"} alt={item.title} style={styles.cardImage} />
            </div>
            <div style={styles.cardBody}>
              <span style={styles.categoryBadge}>Kiến thức</span>
              <h4 style={styles.cardTitle}>{item.title}</h4>
              <p style={styles.cardSummary}>
                {item.summary?.length > 90 ? item.summary.slice(0, 90) + "..." : item.summary}
              </p>
              <div style={styles.cardFooter}>
                <span style={styles.readMoreLink}>Chi tiết bài viết</span>
                <i className="bi bi-plus-circle"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODERN PAGINATION */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            style={styles.navBtn}
            disabled={currentPage === 1}
            onClick={() => {setCurrentPage(p => p - 1); window.scrollTo(0, 300);}}
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => {setCurrentPage(i + 1); window.scrollTo(0, 300);}}
              style={currentPage === i + 1 ? styles.pageActive : styles.pageBtn}
            >
              {i + 1}
            </button>
          ))}

          <button
            style={styles.navBtn}
            disabled={currentPage === totalPages}
            onClick={() => {setCurrentPage(p => p + 1); window.scrollTo(0, 300);}}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "40px 20px",
    maxWidth: "1250px",
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "300px",
    fontSize: "18px",
  },

  header: {
    textAlign: "center",
    marginBottom: "50px",
  },

  pageTitle: {
    fontSize: "32px",
    fontWeight: "900",
    color: "#1a1a1a",
    margin: 0,
    letterSpacing: "1px",
  },

  underline: {
    width: "60px",
    height: "4px",
    background: "#2a9d8f",
    margin: "15px auto",
  },

  pageSubTitle: {
    color: "#666",
    fontSize: "16px",
  },

  hero: {
    display: "grid",
    gap: "0",
    marginBottom: "60px",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
  },

  heroVideoWrapper: {
    position: "relative",
    height: "400px",
  },

  heroVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  videoBadge: {
    position: "absolute",
    top: "20px",
    left: "20px",
    background: "rgba(0,0,0,0.6)",
    color: "#fff",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    backdropFilter: "blur(5px)",
  },

  heroContent: {
    background: "#f8f9fa",
    padding: "40px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    borderLeft: "5px solid #2a9d8f",
  },

  heroTitle: {
    fontSize: "26px",
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: "20px",
    lineHeight: "1.4",
  },

  heroText: {
    fontSize: "16px",
    color: "#4a4a4a",
    lineHeight: "1.8",
    marginBottom: "25px",
  },

  heroButton: {
    alignSelf: "flex-start",
    padding: "12px 30px",
    borderRadius: "30px",
    border: "none",
    background: "#1d3557",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
    transition: "0.3s",
  },

  grid: {
    display: "grid",
    gap: "30px",
  },

  card: {
    background: "#fff",
    borderRadius: "18px",
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    transition: "all 0.4s ease",
    border: "1px solid #f0f0f0",
  },

  imageWrapper: {
    width: "100%",
    height: "200px",
    overflow: "hidden",
  },

  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    transition: "0.5s",
  },

  cardBody: {
    padding: "20px",
  },

  categoryBadge: {
    fontSize: "11px",
    fontWeight: "800",
    color: "#2a9d8f",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "10px",
    display: "block",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: "12px",
    height: "44px",
    overflow: "hidden",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
  },

  cardSummary: {
    fontSize: "14px",
    color: "#666",
    lineHeight: "1.6",
    marginBottom: "20px",
  },

  cardFooter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderTop: "1px solid #f0f0f0",
    paddingTop: "15px",
  },

  readMoreLink: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#1d3557",
  },

  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
    marginTop: "60px",
  },

  pageBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "1px solid #ddd",
    background: "#fff",
    fontWeight: "600",
    cursor: "pointer",
    transition: "0.3s",
  },

  pageActive: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "#1d3557",
    color: "#fff",
    fontWeight: "700",
    cursor: "pointer",
  },

  navBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    border: "none",
    background: "#f0f0f0",
    cursor: "pointer",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
};