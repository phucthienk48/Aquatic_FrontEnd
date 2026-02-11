import { useEffect, useState } from "react";
import axios from "axios";
import  socket  from "../../socket/socket";

const LIVE_API =
  "http://localhost:5000/api/livestream";

export default function LiveCommentPage({
  onSelectLivestream,
}) {
  const [livestreams, setLivestreams] = useState([]);
  const [livestreamId, setLivestreamId] = useState("");
  const [content, setContent] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  /* LOAD PHÒNG ĐANG LIVE */
  useEffect(() => {
    axios.get(LIVE_API).then((res) => {
      setLivestreams(res.data);

      if (res.data.length > 0) {
        setLivestreamId(res.data[0]._id);
        onSelectLivestream(res.data[0]._id);
      }
    });
  }, [onSelectLivestream]);

  /* GỬI COMMENT SOCKET*/
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    socket.emit("sendComment", {
      livestreamId,
      userId: user.id,
      content,
    });

    setContent("");
    setMessage("");
  };

  if (!user)
    return (
      <p className="text-danger">
        Đăng nhập để Viết bình luận Livestream
      </p>
    );

  return (
    <div style={{ maxWidth: 500 }}>
      <h3 className="d-flex align-items-center gap-2">
      <i className="bi bi-chat-dots-fill text-primary"></i> 
      Viết bình luận Livestream</h3>

      {/* USER INFO */}
      <div
        style={{
          display: "flex",
          gap: 10,
          marginBottom: 15,
          alignItems: "center",
        }}
      >
        <img
          src={user.avatar || "/avatars/default.png"}
          alt=""
          width={40}
          height={40}
          style={{ borderRadius: "50%" }}
        />
        <strong>{user.username}</strong>
      </div>

      {/* CHỌN PHÒNG LIVE */}
      {livestreams.length === 0 ? (
        <p className="text-muted">
          Hiện không có phòng livestream nào
        </p>
      ) : (
        <select
          className="form-select mb-3"
          value={livestreamId}
          onChange={(e) => {
            setLivestreamId(e.target.value);
            onSelectLivestream(e.target.value);
          }}
        >
          {livestreams.map((live) => (
            <option key={live._id} value={live._id}>
              {live.title || "Livestream"}
            </option>
          ))}
        </select>
      )}

      {/* FORM COMMENT */}
      <form onSubmit={handleSubmit}>
        <textarea
          className="form-control mb-2"
          rows={3}
          placeholder="Nhập bình luận..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button
          className="btn btn-primary w-100"
          disabled={!livestreamId}
        >
          Gửi bình luận
        </button>
      </form>

      {message && (
        <p className="mt-2 text-center">{message}</p>
      )}
    </div>
  );
}
