import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function KnowledgeDetail() {
  const { id } = useParams();

  const [knowledge, setKnowledge] = useState(null);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getImageSrc = (img) => {
    if (!img) return "/data/placeholder.jpg";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return img;
    return `/${img}`;
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [detailRes, listRes] = await Promise.all([
        fetch(`http://localhost:5000/api/knowledge/${id}`),
        fetch(`http://localhost:5000/api/knowledge`)
      ]);

      if (!detailRes.ok || !listRes.ok)
        throw new Error("Không thể tải dữ liệu");

      const detailData = await detailRes.json();
      const listData = await listRes.json();

      setKnowledge(detailData.data || detailData.knowledge || detailData);

      const arr = Array.isArray(listData)
        ? listData
        : listData.data || listData.knowledges || [];

      setList(arr.filter((k) => k.knowledgeId !== id));
    } catch (err) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: 60 }}>⏳ Đang tải...</p>;

  if (error)
    return (
      <p style={{ textAlign: "center", color: "red", marginTop: 60 }}>
        {error}
      </p>
    );

  if (!knowledge) return null;

  return (
    <div style={styles.container}>
      <div style={styles.layout}>
        {/* MAIN CONTENT */}
        <div style={styles.main}>
          <Link to="/knowledge" style={styles.back}>
            <i className="bi bi-arrow-left-circle"></i> Quay lại danh sách
          </Link>

          <h1 style={styles.title}>
            <i className="bi bi-journal-richtext"></i> {knowledge.title}
          </h1>

          <img
            src={getImageSrc(knowledge.img)}
            alt={knowledge.title}
            style={styles.image}
          />

          {/* SUMMARY */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <i className="bi bi-bookmark-star-fill"></i> Tóm tắt
            </h3>
            <p style={styles.text}>{knowledge.summary}</p>
          </section>

          {/* CONTENT */}
          <section style={styles.section}>
            <h3 style={styles.sectionTitle}>
              <i className="bi bi-list-check"></i> Nội dung chi tiết
            </h3>

            {knowledge.instructions.map((item, index) => (
              <div key={index} style={styles.instructionBlock}>
                <h4 style={styles.heading}>
                  <i className="bi bi-droplet-half"></i>
                  {index + 1}. {item.heading}
                </h4>

                {item.image && (
                  <img
                    src={getImageSrc(item.image)}
                    alt={item.heading}
                    style={styles.stepImage}
                  />
                )}

                <p style={styles.instructionText}>{item.content}</p>
              </div>
            ))}
          </section>
        </div>

        {/* SIDEBAR */}
        <aside style={styles.sidebar}>
          <h4 style={styles.sidebarTitle}>
            <i className="bi bi-newspaper"></i> Bài viết khác
          </h4>

          {list.slice(0, 6).map((item) => (
            <Link
              key={item.knowledgeId}
              to={`/knowledge/${item.knowledgeId}`}
              style={styles.sidebarItem}
            >
              <img
                src={getImageSrc(item.img)}
                alt={item.title}
                style={styles.sidebarImage}
              />
              <div>
                <p style={styles.sidebarText}>{item.title}</p>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
const styles = {
  container: {
    background: "#f5f7fa",
    padding: "32px 0",
  },

  layout: {
    maxWidth: 1200,
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "3fr 1fr",
    gap: 32,
    padding: "0 20px",
  },

  main: {
    background: "#fff",
    padding: 28,
    borderRadius: 16,
  },

  sidebar: {
    background: "#fff",
    padding: 20,
    borderRadius: 16,
    height: "fit-content",
    position: "sticky",
    top: 20,
  },

  back: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 16,
    textDecoration: "none",
    color: "#0d6efd",
    fontWeight: 500,
  },

  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 20,
    color: "#1f3b4d",
  },

  image: {
    width: "100%",
    maxHeight: 420,
    objectFit: "cover",
    borderRadius: 14,
    marginBottom: 28,
  },

  section: {
    marginBottom: 36,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: 600,
    marginBottom: 14,
    color: "#0d6efd",
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  text: {
    fontSize: 16,
    lineHeight: 1.8,
    color: "#444",
  },

  instructionBlock: {
    padding: 20,
    borderRadius: 14,
    background: "#f9fafb",
    marginBottom: 20,
  },

  heading: {
    fontSize: 17,
    fontWeight: 600,
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  stepImage: {
    width: "100%",
    borderRadius: 12,
    margin: "12px 0",
  },

  instructionText: {
    lineHeight: 1.9,
    color: "#333",
  },

  sidebarTitle: {
    fontSize: 18,
    fontWeight: 600,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  sidebarItem: {
    display: "flex",
    gap: 12,
    marginBottom: 14,
    textDecoration: "none",
    color: "#222",
  },

  sidebarImage: {
    width: 64,
    height: 64,
    objectFit: "cover",
    borderRadius: 8,
    flexShrink: 0,
  },

  sidebarText: {
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 500,
  },
};
