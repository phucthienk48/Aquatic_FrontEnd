import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function BannerKnowledge() {
  const navigate = useNavigate();
  const [list, setList] = useState([]);

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/knowledge");
      const data = await res.json();

      const arr = Array.isArray(data)
        ? data
        : data.data || data.knowledges || [];

      setList(arr.slice(0, 4));
    } catch (err) {
      console.error("Lỗi tải kiến thức:", err);
    }
  };

  if (!list.length) return null;

  return (
    <section style={styles.section}>
      <h2 style={styles.heading}>
        <i className="bi bi-lightbulb"></i> Kiến thức nuôi cá
      </h2>

      <div style={styles.wrapper}>
        {/* MAIN */}
        <div
          style={styles.main}
          onClick={() =>
            navigate(`/knowledge/${list[0].knowledgeId}`)
          }
        >
          {/* <img
            src={list[0].img || "/data/banner07.png"}
            alt={list[0].title}
            style={styles.mainImage}
          /> */}
          <video
              src="/data/poster1.mp4"
              autoPlay
              muted
              loop
              style={styles.mainImage}
            />


          <div style={styles.mainContent}>
            <h3>{list[0].title}</h3>
            <p>{list[0].summary}</p>
            <span style={styles.readMore}>Xem chi tiết →</span>
          </div>
        </div>

        {/* SIDE */}
        <div style={styles.side}>
          {list.slice(1).map((item) => (
            <div
              key={item.knowledgeId}
              style={styles.sideItem}
              onClick={() =>
                navigate(`/knowledge/${item.knowledgeId}`)
              }
            >
              <img
                src={item.img || "https://via.placeholder.com/120x80"}
                alt={item.title}
                style={styles.sideImg}
              />
              <div>
                <h4>{item.title}</h4>
                <p>
                  {item.summary.length > 80
                    ? item.summary.slice(0, 80) + "..."
                    : item.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.moreWrap}>
        <button
          style={styles.moreBtn}
          onClick={() => navigate("/knowledge")}
        >
          Xem tất cả bài viết
        </button>
      </div>
    </section>
  );
}

const styles = {
  section: {
    padding: "40px 20px",
    maxWidth: 1200,
    margin: "0 auto",
  },
  heading: {
    fontSize: 26,
    fontWeight: 700,
    marginBottom: 24,
  },
  wrapper: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: 24,
  },
  main: {
    position: "relative",
    borderRadius: 14,
    overflow: "hidden",
    cursor: "pointer",
  },
  mainImage: {
    width: "100%",
    height: 320,
    objectFit: "cover",
  },
  mainContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    background:
      "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
    color: "#fff",
  },
  readMore: {
    fontWeight: 600,
    color: "#ffd966",
  },
  side: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  sideItem: {
    display: "flex",
    gap: 12,
    background: "#fff",
    borderRadius: 10,
    padding: 10,
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  },
  sideImg: {
    width: 90,
    height: 70,
    objectFit: "cover",
    borderRadius: 8,
  },
  moreWrap: {
    textAlign: "center",
    marginTop: 30,
  },
  moreBtn: {
    padding: "10px 26px",
    borderRadius: 20,
    border: "1px solid #dc3545",
    background: "#fff",
    color: "#dc3545",
    fontWeight: 600,
    cursor: "pointer",
  },
};
