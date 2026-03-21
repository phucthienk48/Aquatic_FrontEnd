import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function KnowledgeDetail() {
  const { id } = useParams();
  const [knowledge, setKnowledge] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [width, setWidth] = useState(window.innerWidth);

  // Theo dõi kích thước màn hình
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    fetchData();
    return () => window.removeEventListener("resize", handleResize);
  }, [id]);

  const fetchData = async () => {
    try {
      const [detailRes, listRes] = await Promise.all([
        fetch(`http://localhost:5000/api/knowledge/${id}`),
        fetch(`http://localhost:5000/api/knowledge`)
      ]);

      if (!detailRes.ok || !listRes.ok) throw new Error("Không thể tải dữ liệu");

      const detailData = await detailRes.json();
      const listData = await listRes.json();

      setKnowledge(detailData.data || detailData.knowledge || detailData);
      const arr = Array.isArray(listData) ? listData : listData.data || listData.knowledges || [];
      setList(arr.filter((k) => k.knowledgeId !== id));
      window.scrollTo(0, 0); // Cuộn lên đầu trang khi đổi bài viết
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const getImageSrc = (img) => {
    if (!img) return "/data/placeholder.jpg";
    if (img.startsWith("http") || img.startsWith("/")) return img;
    return `/${img}`;
  };

  if (loading) return <div style={styles.center}>⏳ Đang tải nội dung...</div>;
  if (error) return <div style={styles.center}><p style={{color: 'red'}}>{error}</p></div>;
  if (!knowledge) return null;

  const isMobile = width < 992; // Điểm ngắt cho Tablet/Mobile

  return (
    <div style={styles.container}>
      <div style={{ ...styles.layout, gridTemplateColumns: isMobile ? "1fr" : "2.5fr 1fr" }}>
        
        {/* MAIN CONTENT */}
        <article style={styles.main}>
          <Link to="/knowledge" style={styles.backBtn}>
            <i className="bi bi-arrow-left"></i> Quay lại cẩm nang
          </Link>

          <header style={styles.header}>
            <span style={styles.category}>CẨM NANG THỦY SINH</span>
            <h1 style={styles.title}>{knowledge.title}</h1>
            <div style={styles.meta}>
              <span><i className="bi bi-calendar3"></i> Cập nhật: {new Date().toLocaleDateString('vi-VN')}</span>
              <span><i className="bi bi-person"></i> Bởi: Thiên Phúc AquaWorld</span>
            </div>
          </header>

          <img src={getImageSrc(knowledge.img)} alt={knowledge.title} style={styles.mainImage} />

          {/* TÓM TẮT */}
          <div style={styles.summaryBox}>
            <p style={styles.summaryText}><strong>Tóm tắt:</strong> {knowledge.summary}</p>
          </div>

          {/* NỘI DUNG CHI TIẾT */}
          <div style={styles.contentBody}>
            <h3 style={styles.sectionHeading}>Hướng dẫn chi tiết</h3>
            {knowledge.instructions?.map((item, index) => (
              <div key={index} style={styles.stepBlock}>
                <div style={styles.stepHeader}>
                  <span style={styles.stepNumber}>{index + 1}</span>
                  <h4 style={styles.stepTitle}>{item.heading}</h4>
                </div>
                
                {item.image && (
                  <img src={getImageSrc(item.image)} alt={item.heading} style={styles.stepImg} />
                )}
                
                <p style={styles.stepDescription}>{item.content}</p>
              </div>
            ))}
          </div>
        </article>

        {/* SIDEBAR (Bài viết liên quan) */}
        <aside style={isMobile ? styles.mobileSidebar : styles.sidebar}>
          <h4 style={styles.sidebarTitle}>BÀI VIẾT LIÊN QUAN</h4>
          <div style={styles.sidebarList}>
            {list.slice(0, 5).map((item) => (
              <Link key={item.knowledgeId} to={`/knowledge/${item.knowledgeId}`} style={styles.sideItem}>
                <img src={getImageSrc(item.img)} alt={item.title} style={styles.sideImg} />
                <div style={styles.sideInfo}>
                  <p style={styles.sideTitle}>{item.title}</p>
                  <span style={styles.sideDate}>Xem chi tiết <i className="bi bi-chevron-right"></i></span>
                </div>
              </Link>
            ))}
          </div>

          {/* Banner quảng cáo nhỏ hoặc box hỗ trợ */}
          <div style={styles.supportBox}>
            <h5>Cần hỗ trợ tư vấn?</h5>
            <p>Liên hệ ngay đội ngũ chuyên gia Thiên Phúc AquaWorld.</p>
            <button style={styles.supportBtn}>Hotline: 0397.960.604</button>
          </div>
        </aside>

      </div>
    </div>
  );
}

const styles = {
  container: {
    background: "#f8f9fa",
    padding: "40px 0",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "300px",
  },

  layout: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gap: 30,
    padding: "0 20px",
  },

  main: {
    background: "#fff",
    padding: "35px",
    borderRadius: "20px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
  },

  backBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    color: "#666",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "25px",
    transition: "0.2s",
  },

  header: {
    marginBottom: "30px",
  },

  category: {
    color: "#2a9d8f",
    fontWeight: "800",
    fontSize: "12px",
    letterSpacing: "1px",
  },

  title: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#1d3557",
    margin: "10px 0 15px",
    lineHeight: "1.3",
  },

  meta: {
    display: "flex",
    gap: "20px",
    color: "#888",
    fontSize: "13px",
  },

  mainImage: {
    width: "100%",
    maxHeight: "500px",
    objectFit: "cover",
    borderRadius: "15px",
    marginBottom: "30px",
  },

  summaryBox: {
    background: "#f1f8f7",
    padding: "20px",
    borderRadius: "12px",
    borderLeft: "5px solid #2a9d8f",
    marginBottom: "35px",
  },

  summaryText: {
    margin: 0,
    fontSize: "16px",
    lineHeight: "1.7",
    color: "#444",
  },

  sectionHeading: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#1d3557",
    marginBottom: "25px",
    borderBottom: "2px solid #eee",
    paddingBottom: "10px",
  },

  stepBlock: {
    marginBottom: "40px",
  },

  stepHeader: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "15px",
  },

  stepNumber: {
    width: "32px",
    height: "32px",
    background: "#1d3557",
    color: "#fff",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "bold",
    fontSize: "14px",
    flexShrink: 0,
  },

  stepTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "700",
    color: "#333",
  },

  stepImg: {
    width: "100%",
    borderRadius: "12px",
    margin: "15px 0",
    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
  },

  stepDescription: {
    fontSize: "16px",
    lineHeight: "1.8",
    color: "#4a4a4a",
  },

  sidebar: {
    position: "sticky",
    top: "100px",
    height: "fit-content",
  },

  mobileSidebar: {
    marginTop: "30px",
  },

  sidebarTitle: {
    fontSize: "16px",
    fontWeight: "800",
    color: "#1d3557",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },

  sidebarList: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
  },

  sideItem: {
    display: "flex",
    gap: "12px",
    textDecoration: "none",
    color: "inherit",
    transition: "0.3s",
  },

  sideImg: {
    width: "85px",
    height: "70px",
    borderRadius: "10px",
    objectFit: "cover",
    flexShrink: 0,
  },

  sideInfo: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  sideTitle: {
    fontSize: "14px",
    fontWeight: "700",
    margin: "0 0 5px",
    lineHeight: "1.4",
    color: "#333",
  },

  sideDate: {
    fontSize: "12px",
    color: "#2a9d8f",
    fontWeight: "600",
  },

  supportBox: {
    background: "#1d3557",
    color: "#fff",
    padding: "25px",
    borderRadius: "15px",
    marginTop: "30px",
    textAlign: "center",
  },

  supportBtn: {
    width: "100%",
    marginTop: "15px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#2a9d8f",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
  },
};