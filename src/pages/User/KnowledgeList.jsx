import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const PAGE_SIZE = 4;

export default function Knowledge() {
  const navigate = useNavigate();
  const [knowledges, setKnowledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/knowledge");
      if (!res.ok) throw new Error("Không thể tải kiến thức");

      const result = await res.json();
      const list = Array.isArray(result)
        ? result
        : result.data || result.knowledges || [];

      setKnowledges(list);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p style={{ padding: 20 }}>⏳ Đang tải...</p>;
  if (error) return <p style={{ color: "red", padding: 20 }}>{error}</p>;

  /* PAGINATION */
  const totalPages = Math.ceil(knowledges.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentItems = knowledges.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  return (
    <div style={styles.container}>
      {/* TITLE */}
      <h2 style={styles.pageTitle}>Bí quyết nuôi cá cảnh thành công</h2>

      {/* HERO – POSTER GIỚI THIỆU (GIỮ NGUYÊN) */}
      <div style={styles.hero}>
        {/* <img
          src="./public/data/banner06.png"
          alt="Cá cảnh"
          style={styles.heroImage}
        /> */}
        <video
          src="/data/poster1.mp4"
          autoPlay
          muted
          loop
          style={styles.heroImage}
        />


        <div style={styles.heroContent}>
          <h3 style={styles.heroTitle}>
            Phúc Long Aquatic – Kiến thức chuẩn cho người chơi cá cảnh
          </h3>
          <p style={styles.heroText}>
            Tổng hợp kiến thức nuôi cá cảnh và thủy sinh: từ cách chọn cá,
            setup bể, chăm sóc hằng ngày đến xử lý bệnh và tối ưu môi
            trường nước cho từng dòng cá.
          </p>
          <button
            style={styles.heroButton}
            onClick={() =>
              knowledges.length > 0 &&
              navigate(`/knowledge/${knowledges[0].knowledgeId}`)
            }
          >
            Bắt đầu với ...
          </button>

        </div>
      </div>

      {/* LIST */}
      <div style={styles.grid}>
        {currentItems.map((item) => (
          <div
            key={item.knowledgeId}
            style={styles.card}
            onClick={() =>
              navigate(`/knowledge/${item.knowledgeId}`)
            }
          >
            <img
              src={item.img || "https://via.placeholder.com/300x200"}
              alt={item.title}
              style={styles.image}
            />

            <h4 style={styles.title}>{item.title}</h4>

            <p style={styles.summary}>
              {item.summary?.length > 100
                ? item.summary.slice(0, 100) + "..."
                : item.summary}
            </p>

            <span style={styles.readMore}>Đọc tiếp →</span>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            « Trước
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={
                currentPage === i + 1
                  ? styles.pageActive
                  : styles.pageBtn
              }
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Sau »
          </button>
        </div>
      )}
    </div>
  );
}


const styles = {
  container: {
    padding: 20,
    maxWidth: 1200,
    margin: "0 auto",
  },

  pageTitle: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 20,
  },

  /* HERO */
  hero: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 24,
    marginBottom: 40,
  },

  heroImage: {
    width: "100%",
    height: 320,
    objectFit: "cover",
    borderRadius: 12,
  },

  heroContent: {
    background: "#eefaf3",
    borderRadius: 16,
    padding: 24,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  heroTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 12,
    color: "#1f3b4d",
  },

  heroText: {
    fontSize: 15,
    lineHeight: 1.6,
    color: "#444",
    marginBottom: 20,
  },

  heroButton: {
    alignSelf: "flex-start",
    padding: "10px 20px",
    borderRadius: 20,
    border: "1px solid #dc3545",
    background: "#fff",
    color: "#dc3545",
    cursor: "pointer",
    fontWeight: 600,
  },

  /* GRID */
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "0.2s",
  },

  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
  },

  title: {
    fontSize: 16,
    fontWeight: 600,
    padding: "10px 12px 0",
  },

  summary: {
    fontSize: 14,
    color: "#555",
    padding: "8px 12px",
    lineHeight: 1.5,
  },

readMore: {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  margin: "8px 12px 14px",
  padding: "6px 14px",
  borderRadius: 20,
  border: "1px solid #dc3545",
  color: "#dc3545",
  fontWeight: 600,
  fontSize: 14,
  width: "fit-content",
  cursor: "pointer",
  transition: "all 0.2s ease",
},

  pagination: {
  display: "flex",
  justifyContent: "center",
  gap: 8,
  marginTop: 30,
},

pageBtn: {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  cursor: "pointer",
},

pageActive: {
  padding: "6px 12px",
  borderRadius: 8,
  border: "1px solid #dc3545",
  background: "#dc3545",
  color: "#fff",
  cursor: "pointer",
},

};
