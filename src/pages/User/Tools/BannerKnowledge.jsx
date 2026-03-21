import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BannerKnowledge() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình để hỗ trợ Responsive
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchKnowledge();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/knowledge");
      const data = await res.json();
      const arr = Array.isArray(data) ? data : data.data || data.knowledges || [];
      setList(arr.slice(0, 4));
    } catch (err) {
      console.error("Lỗi tải kiến thức:", err);
    }
  };

  if (!list.length) return null;

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth < 1024;

  return (
    <section style={styles.section}>
      <div style={styles.headerRow}>
        <h2 style={styles.heading}>
          <i className="bi bi-lightbulb-fill" style={{ color: "#ffc107", marginRight: 10 }}></i>
          Kiến thức nuôi cá chuyên sâu
        </h2>
        {!isMobile && (
          <span style={styles.subTitle} onClick={() => navigate("/knowledge")}>
            Xem tất cả <i className="bi bi-chevron-right"></i>
          </span>
        )}
      </div>

      <div style={{ 
        ...styles.wrapper, 
        gridTemplateColumns: isTablet ? "1fr" : "2fr 1.2fr" 
      }}>
        {/* BÀI VIẾT CHÍNH (VIDEO) */}
        <div
          style={styles.mainCard}
          onClick={() => navigate(`/knowledge/${list[0].knowledgeId}`)}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
        >
          <div style={styles.videoBadge}>Nổi bật</div>
          <video
            src="/data/poster1.mp4"
            autoPlay
            muted
            loop
            style={styles.mainVideo}
          />
          <div style={styles.mainOverlay}>
            <h3 style={styles.mainTitle}>{list[0].title}</h3>
            <p style={styles.mainSummary}>{list[0].summary}</p>
            <div style={styles.readMoreMain}>
              Đọc ngay <i className="bi bi-arrow-right-short"></i>
            </div>
          </div>
        </div>

        {/* CÁC BÀI VIẾT PHỤ */}
        <div style={styles.sideList}>
          {list.slice(1).map((item) => (
            <div
              key={item.knowledgeId}
              style={styles.sideCard}
              onClick={() => navigate(`/knowledge/${item.knowledgeId}`)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
                e.currentTarget.style.transform = "translateX(5px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#fff";
                e.currentTarget.style.transform = "translateX(0)";
              }}
            >
              <img
                src={item.img || "https://via.placeholder.com/120x80"}
                alt={item.title}
                style={styles.sideImg}
              />
              <div style={styles.sideContent}>
                <h4 style={styles.sideTitle}>{item.title}</h4>
                <p style={styles.sideSummary}>
                  {item.summary.length > 70
                    ? item.summary.slice(0, 70) + "..."
                    : item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isMobile && (
        <div style={styles.mobileMoreWrap}>
          <button style={styles.moreBtn} onClick={() => navigate("/knowledge")}>
            Xem tất cả bài viết
          </button>
        </div>
      )}
    </section>
  );
}

const styles = {
  section: {
    padding: "60px 20px",
    maxWidth: 1200,
    margin: "0 auto",
    fontFamily: "'Inter', sans-serif",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 30,
  },
  heading: {
    fontSize: "28px",
    fontWeight: 800,
    margin: 0,
    color: "#1a1a1a",
    display: "flex",
    alignItems: "center",
  },
  subTitle: {
    color: "#007bff",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: "15px",
  },
  wrapper: {
    display: "grid",
    gap: 30,
  },
  mainCard: {
    position: "relative",
    borderRadius: 24,
    overflow: "hidden",
    cursor: "pointer",
    height: 420,
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
  videoBadge: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 2,
    background: "rgba(220, 53, 69, 0.9)",
    color: "#fff",
    padding: "5px 15px",
    borderRadius: 50,
    fontSize: "12px",
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  mainVideo: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  mainOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: "40px 30px",
    background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  mainTitle: {
    fontSize: "24px",
    fontWeight: 700,
    margin: 0,
    lineHeight: 1.3,
  },
  mainSummary: {
    fontSize: "15px",
    opacity: 0.85,
    margin: 0,
    maxWidth: "90%",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },
  readMoreMain: {
    marginTop: 10,
    fontWeight: 600,
    color: "#ffc107",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
  },
  sideList: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
  },
  sideCard: {
    display: "flex",
    gap: 15,
    background: "#fff",
    borderRadius: 18,
    padding: 12,
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    transition: "all 0.3s ease",
    border: "1px solid #f0f0f0",
  },
  sideImg: {
    width: 110,
    height: 90,
    objectFit: "cover",
    borderRadius: 14,
  },
  sideContent: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: 5,
  },
  sideTitle: {
    fontSize: "16px",
    fontWeight: 700,
    margin: 0,
    color: "#333",
    lineHeight: 1.2,
  },
  sideSummary: {
    fontSize: "13px",
    color: "#666",
    margin: 0,
  },
  mobileMoreWrap: {
    textAlign: "center",
    marginTop: 30,
  },
  moreBtn: {
    padding: "12px 30px",
    borderRadius: 50,
    border: "2px solid #007bff",
    background: "transparent",
    color: "#007bff",
    fontWeight: 700,
    cursor: "pointer",
    transition: "0.3s",
  },
};