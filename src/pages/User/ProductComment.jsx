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

  if (loading) return <p>⏳ Đang tải bình luận...</p>;

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Đánh giá sản phẩm</h3>

      {comments.length === 0 && (
        <p style={styles.empty}>Chưa có đánh giá nào.</p>
      )}

      {comments.map((c) => (
        <div key={c._id} style={styles.commentBox}>
          <div style={styles.header}>
            <img
              src="/avatar.png"
              alt=""
              style={styles.avatar}
            />

            <div>
              <div style={styles.name}>
                {c.user?.username || "Người dùng"}
              </div>

              <div style={styles.meta}>
                <span style={styles.rating}>
                  {"⭐".repeat(c.rating || 0)}
                </span>
                <span style={styles.time}>
                  {new Date(c.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <p style={styles.content}>{c.content}</p>

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
  container: { marginTop: 40 },
  title: { fontSize: 18, marginBottom: 15 },
  empty: { color: "#777" },
  commentBox: {
    borderBottom: "1px solid #eee",
    padding: "16px 0",
  },
  header: {
    display: "flex",
    gap: 12,
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: "50%",
    objectFit: "cover",
  },
  name: {
    fontWeight: 600,
    fontSize: 14,
  },
  meta: {
    display: "flex",
    gap: 8,
    alignItems: "center",
  },
  rating: { color: "#fbc02d", fontSize: 13 },
  time: { fontSize: 12, color: "#999" },
  content: {
    marginLeft: 52,
    marginTop: 8,
    fontSize: 14,
  },
  images: {
    marginLeft: 52,
    marginTop: 8,
    display: "flex",
    gap: 8,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 4,
    objectFit: "cover",
  },
};
