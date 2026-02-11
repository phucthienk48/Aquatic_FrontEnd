import { useEffect, useState } from "react";
import axios from "axios";
import  socket  from "../../socket/socket";

const API_URL =
  "http://localhost:5000/api/commentlive/livestream";

export default function LiveCommentList({ livestreamId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);

  /* LOAD COMMENT CŨ */
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/${livestreamId}`
      );
      setComments(res.data);
    } catch (err) {
      console.error("Không load được comment");
    } finally {
      setLoading(false);
    }
  };

  /*  SOCKET + LOAD DATA */
  useEffect(() => {
    if (!livestreamId) return;

    // Load comment cũ
    fetchComments();

    // Join room
    socket.emit("joinRoom", livestreamId);

    // Nhận comment realtime
    socket.on("newComment", (comment) => {
      setComments((prev) => [...prev, comment]);
    });

    return () => {
      socket.off("newComment");
    };
  }, [livestreamId]);

  return (
    <div
      className="live-comment-box"
      style={{
        border: "1px solid #ddd",
        borderRadius: 8,
        padding: 10,
        height: "100%",
      }}
    >
      <h5 className="d-flex align-items-center gap-2">
        <i className="bi bi-chat-dots-fill text-primary"></i>
        Bình luận
      </h5>


      {!livestreamId && (
        <p className="text-muted">
          Vui lòng chọn phòng livestream
        </p>
      )}

      {loading && (
        <p className="text-muted">Đang tải bình luận...</p>
      )}

      <div
        className="comment-list"
        style={{
          maxHeight: 350,
          overflowY: "auto",
        }}
      >
        {comments.length === 0 && !loading && (
          <p className="text-muted">
            Chưa có bình luận nào
          </p>
        )}

        {comments.map((c) => (
          <div
            key={c._id}
            className="d-flex gap-2 mb-3"
          >
            <img
              src={
                c.user?.avatar ||
                "/avatars/default.png"
              }
              alt=""
              width={36}
              height={36}
              style={{ borderRadius: "50%" }}
            />

            <div
              style={{
                background: "#f5f5f5",
                padding: "6px 10px",
                borderRadius: 8,
                width: "100%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <strong>{c.user?.username}</strong>
                <small className="text-muted">
                  {new Date(
                    c.createdAt
                  ).toLocaleTimeString("vi-VN")}
                </small>
              </div>

              <div>{c.content}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
