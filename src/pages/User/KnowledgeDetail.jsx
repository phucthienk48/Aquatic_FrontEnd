import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function KnowledgeDetail() {
  const { id } = useParams();

  const [knowledge, setKnowledge] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Chuẩn hóa đường dẫn ảnh từ public/data
  const getImageSrc = (img) => {
    if (!img) return "/data/placeholder.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return `/${img}`;
  };

  useEffect(() => {
    fetchKnowledgeDetail();
  }, [id]);

  const fetchKnowledgeDetail = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/knowledge/${id}`);
      if (!res.ok) throw new Error("Không thể tải chi tiết kiến thức");

      const result = await res.json();
      const data = result.data || result.knowledge || result;

      setKnowledge(data);
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 40 }}>⏳ Đang tải...</p>;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 40 }}>
        {error}
      </p>
    );

  if (!knowledge) return null;

  return (
    <div style={styles.container}>
      <Link to="/knowledge" style={styles.back}>
        ← Quay lại danh sách
      </Link>

      <h1 style={styles.title}>{knowledge.title}</h1>

      {/* COVER IMAGE */}
      <img
        src={getImageSrc(knowledge.img)}
        alt={knowledge.title}
        style={styles.image}
        onError={(e) => (e.target.src = "/data/placeholder.jpg")}
      />

      {/* SUMMARY */}
      <section style={styles.section}>
        <h3>📌 Tóm tắt</h3>
        <p style={styles.text}>{knowledge.summary}</p>
      </section>

      {/* INSTRUCTIONS */}
      <section style={styles.section}>
        <h3>📖 Hướng dẫn chi tiết</h3>

        {Array.isArray(knowledge.instructions) &&
        knowledge.instructions.length > 0 ? (
          knowledge.instructions.map((item, index) => (
            <div key={index} style={styles.instructionBlock}>
              <h4 style={styles.heading}>
                {index + 1}. {item.heading}
              </h4>

              {item.image && (
                <img
                  src={getImageSrc(item.image)}
                  alt={item.heading}
                  style={styles.stepImage}
                  onError={(e) =>
                    (e.target.src = "/data/placeholder.jpg")
                  }
                />
              )}

              <p style={styles.instructionText}>{item.content}</p>
            </div>
          ))
        ) : (
          <p style={{ fontStyle: "italic", color: "#666" }}>
            Chưa có nội dung hướng dẫn.
          </p>
        )}
      </section>
    </div>
  );
}
const styles = {
  container: {
    maxWidth: 900,
    margin: "0 auto",
    padding: 24,
  },

  back: {
    display: "inline-block",
    marginBottom: 20,
    textDecoration: "none",
    color: "#007bff",
  },

  title: {
    marginBottom: 16,
  },

  image: {
    width: "60%",
    borderRadius: 12,
    margin: "20px 0",
    objectFit: "cover",
  },

  section: {
    marginBottom: 32,
  },

  text: {
    lineHeight: 1.7,
    color: "#444",
  },

  instructionBlock: {
    marginBottom: 28,
    paddingBottom: 20,
    borderBottom: "1px solid #eee",
  },

  heading: {
    marginBottom: 10,
    color: "#222",
  },

  stepImage: {
    width: "60%",
    maxHeight: 400,
    objectFit: "cover",
    borderRadius: 10,
    margin: "12px 0",
  },

  instructionText: {
    lineHeight: 1.8,
    color: "#333",
    whiteSpace: "pre-line",
  },
};
