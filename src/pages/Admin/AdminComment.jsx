import { useEffect, useState } from "react";

export default function AdminComment() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ===== FETCH ALL COMMENTS ===== */
  const fetchComments = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/comment");
      const data = await res.json();
      setComments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  /* ===== DELETE COMMENT ===== */
  const handleDelete = async (id) => {
    if (!window.confirm("Xóa bình luận này?")) return;

    await fetch(`http://localhost:5000/api/comment/${id}`, {
      method: "DELETE",
    });

    setComments(comments.filter((c) => c._id !== id));
  };

  useEffect(() => {
    fetchComments();
  }, []);

  if (loading) return <p>Đang tải bình luận...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Quản lý bình luận</h2>

      <table style={styles.table}>
        <thead>
          <tr>
            <th>User</th>
            <th>Sản phẩm</th>
            <th>Sao</th>
            <th>Nội dung</th>
            <th>Hình ảnh</th>
            <th>Thời gian</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {comments.map((c) => (
            <tr key={c._id}>
              <td>
                <strong>{c.user?.name}</strong>
                <br />
                <small>{c.user?.email}</small>
              </td>

              <td>
                <strong>{c.product?.name}</strong>
                <br />
                <small>{c.product?.price?.toLocaleString()} đ</small>
              </td>

              <td>
                {"⭐".repeat(c.rating)}
              </td>

              <td>{c.content}</td>

              <td>
                {c.images?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt=""
                    style={styles.image}
                  />
                ))}
              </td>

              <td>
                {new Date(c.createdAt).toLocaleString()}
              </td>

              <td>
                <button
                  onClick={() => handleDelete(c._id)}
                  style={styles.deleteBtn}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== STYLE ===== */
const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  image: {
    width: 50,
    height: 50,
    objectFit: "cover",
    marginRight: 4,
    borderRadius: 4,
  },
  deleteBtn: {
    background: "#e74c3c",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: 4,
    cursor: "pointer",
  },
};
