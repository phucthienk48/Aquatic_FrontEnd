import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket/socket";

import LiveCommentList from "../livestream/LiveCommentList";
import LiveCommentWrite from "../livestream/LiveCommentWrite";
import UserProductPage from "../livestream/UserLivestreamProduct";

const API = "http://localhost:5000/api/livestream";

export default function LiveRoom() {
  const [room, setRoom] = useState(null);

  useEffect(() => {
    fetchLiveRoom();

    socket.on("livestreamStarted", handleStart);
    socket.on("livestreamEnded", handleEnd);

    return () => {
      socket.off("livestreamStarted", handleStart);
      socket.off("livestreamEnded", handleEnd);
    };
  }, []);

  const fetchLiveRoom = async () => {
    try {
      const res = await axios.get(API);
      const liveRoom =
        res.data.find((r) => r.status === "live") || res.data[0];

      if (liveRoom) {
        setRoom(liveRoom);
        socket.emit("joinRoom", liveRoom._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleStart = async ({ livestreamId }) => {
    const res = await axios.get(`${API}/${livestreamId}`);
    setRoom(res.data);
    socket.emit("joinRoom", livestreamId);
  };

  const handleEnd = ({ livestreamId }) => {
    setRoom((prev) =>
      prev && prev._id === livestreamId
        ? { ...prev, status: "ended" }
        : prev
    );
  };

  if (!room) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-broadcast fs-1"></i>
        <p>Chưa có livestream</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <div className="row g-3">

        <div className="col-lg-8">

          {/* HEADER */}
          <div className="card shadow-sm border-0 mb-2">
            <div className="card-body d-flex align-items-center gap-3 py-2">
              {room.thumbnail && (
                <img
                  src={room.thumbnail}
                  alt=""
                  style={styles.thumbMini}
                />
              )}

              <div className="d-flex justify-content-between align-items-center w-100">
                <div className="flex-grow-1 me-3">
                  <h6 className="mb-1 fw-bold">{room.title}</h6>
                  {room.description && (
                    <p className="text-muted mb-0 small">
                      {room.description}
                    </p>
                  )}
                </div>

                <span
                  className={`badge px-3 py-2 ${
                    room.status === "live"
                      ? "bg-danger"
                      : "bg-secondary"
                  }`}
                >
                  {room.status === "live"
                    ? "🔴 Đang LIVE"
                    : "⏹ Đã kết thúc"}
                </span>
              </div>
            </div>
          </div>

          {/* VIDEO */}
          <div className="card shadow-sm border-0 mb-3">
            <div className="card-body" style={styles.videoBox}>
              <i className="bi bi-camera-video fs-1 text-muted"></i>
              <p className="text-muted mt-2">
                {room.status === "live"
                  ? "Livestream đang phát trực tiếp..."
                  : "Livestream đã kết thúc"}
              </p>
            </div>
          </div>
            <div>
              <div >
              </div>

            <div className="card-body">
              <UserProductPage livestreamId={room._id} />
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-white py-2">
              <strong className="d-flex align-items-center gap-2">
                <i className="bi bi-chat-dots-fill text-primary"></i>
                Bình luận
              </strong>
            </div>

            <div className="card-body" style={styles.commentList}>
              <LiveCommentList livestreamId={room._id} />
            </div>

            {room.status === "live" && (
              <div className="card-footer bg-white">
                <LiveCommentWrite livestreamId={room._id} />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

const styles = {
  thumbMini: {
    width: 100,
    height: 70,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid #ddd",
  },
  videoBox: {
    height: 420,
    background: "#f8f9fa",
    borderRadius: 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  commentList: {
    maxHeight: "70vh",
    overflowY: "auto",
  },
};
