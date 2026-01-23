import { useEffect, useState } from "react";

export default function ProductComment({ productId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!productId) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/comment/product/${productId}`
        );
        const data = await res.json();
        setComments(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [productId]);
const getAvatarColor = (name = "") => {
  const colors = [
    "#f56a00",
    "#7265e6",
    "#ffbf00",
    "#00a2ae",
    "#87d068",
    "#108ee9",
    "#eb2f96",
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
};

const getInitial = (name = "") => {
  return name.trim().charAt(0).toUpperCase() || "?";
};

  if (loading)
    return <p style={{ marginTop: 20 }}>⏳ Đang tải đánh giá...</p>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>
        <i className="bi bi-chat-left-text" /> Đánh giá sản phẩm
      </h3>

      {comments.length === 0 && (
        <p style={styles.empty}>
          <i className="bi bi-info-circle" /> Chưa có đánh giá nào
        </p>
      )}

      {comments.map((c) => (
        <div key={c._id} style={styles.card}>
          {/* ===== HEADER ===== */}
          <div style={styles.header}>
            <div
              style={{
                ...styles.avatar,
                backgroundColor: getAvatarColor(c.user?.username),
              }}
            >
              {getInitial(c.user?.username)}
            </div>

            <div>
              <div style={styles.name}>
                {c.user?.username || "Người dùng"}
              </div>

              <div style={styles.meta}>
                {/* ===== STAR ===== */}
                <div>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <i
                      key={i}
                      className={`bi ${
                        i <= (c.rating || 0)
                          ? "bi-star-fill"
                          : "bi-star"
                      }`}
                      style={styles.star}
                    />
                  ))}
                </div>

                <span style={styles.time}>
                  <i className="bi bi-clock" />{" "}
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* ===== CONTENT ===== */}
          <p style={styles.content}>{c.content}</p>

          {/* ===== IMAGES ===== */}
          {c.images?.length > 0 && (
            <div style={styles.images}>
              {c.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt=""
                  style={styles.image}
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

}

const styles = {
  container: {
    marginTop: 40,
  },

  title: {
    fontSize: 18,
    marginBottom: 16,
    display: "flex",
    alignItems: "center",
    gap: 8,
  },

  empty: {
    color: "#777",
    fontStyle: "italic",
  },

  card: {
    padding: "16px 0",
    borderBottom: "1px solid #eee",
  },

  header: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: "50%",
    objectFit: "cover",
    border: "1px solid #ddd",
  },

  name: {
    fontWeight: 600,
    fontSize: 14,
  },

  meta: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    marginTop: 2,
  },

  star: {
    color: "#fadb14",
    fontSize: 14,
    marginRight: 2,
  },

  time: {
    fontSize: 12,
    color: "#999",
  },

  content: {
    marginLeft: 54,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 1.5,
  },

  images: {
    marginLeft: 54,
    marginTop: 8,
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 6,
    objectFit: "cover",
    border: "1px solid #ddd",
    cursor: "pointer",
    transition: "transform 0.2s",
  },
  avatar: {
  width: 42,
  height: 42,
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 600,
  color: "#fff",
  fontSize: 16,
  userSelect: "none",
},

};

