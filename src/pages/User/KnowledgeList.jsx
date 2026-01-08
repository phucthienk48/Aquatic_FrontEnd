import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Knowledge() {
  const navigate = useNavigate();

  const [knowledges, setKnowledges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/knowledge"
      );

      if (!res.ok) throw new Error("Không thể tải kiến thức");

      const result = await res.json();

      // xử lý linh hoạt giống Product
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

  return (
    <div style={styles.container}>
      <h2 style={styles.pageTitle}>📚 Kiến thức nuôi cá</h2>

      <div style={styles.grid}>
        {knowledges.map((item) => (
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
              {item.summary.length > 120
                ? item.summary.slice(0, 120) + "..."
                : item.summary}
            </p>

            <button
              style={styles.button}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/knowledge/${item.knowledgeId}`);
              }}
            >
              Xem chi tiết
            </button>
          </div>
        ))}
      </div>
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
    marginBottom: 20,
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
    gap: 20,
  },

  card: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 15,
    cursor: "pointer",
    background: "#fff",
    transition: "0.2s",
  },

  image: {
    width: "100%",
    height: 180,
    objectFit: "cover",
    borderRadius: 8,
    marginBottom: 10,
  },

  title: {
    fontSize: 16,
    marginBottom: 8,
  },

  summary: {
    fontSize: 14,
    color: "#555",
    marginBottom: 12,
    lineHeight: 1.5,
  },

  button: {
    padding: "8px 12px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
