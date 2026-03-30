import { useEffect, useState } from "react";
import axios from "axios";
import socket from "../../socket/socket";
import LiveCommentList from "../livestream/LiveCommentList";
import LiveCommentWrite from "../livestream/LiveCommentWrite";
import UserProductPage from "../livestream/UserLivestreamProduct";
import UserWatchLivestream from "../livestream/UserWatchLivestream";

const API = "http://localhost:5000/api/livestream";

export default function LiveRoom() {
  const [room, setRoom] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(null);

  useEffect(() => {
    fetchLiveRoom();

    const handleStart = async ({ livestreamId }) => {
      const res = await axios.get(`${API}/${livestreamId}`);
      setRoom(res.data);
      socket.emit("joinRoom", livestreamId);
    };

    const handleEnd = ({ livestreamId }) => {
      socket.emit("leaveRoom", livestreamId);
      setRoom((prev) =>
        prev && prev._id === livestreamId ? { ...prev, status: "ended" } : prev
      );
    };

    const handleAutoOrder = (data) => {
      setOrderSuccess(data);
      setTimeout(() => setOrderSuccess(null), 8000);
    };

    socket.on("livestreamStarted", handleStart);
    socket.on("livestreamEnded", handleEnd);
    socket.on("autoOrderSuccess", handleAutoOrder);

    return () => {
      socket.off("livestreamStarted", handleStart);
      socket.off("livestreamEnded", handleEnd);
      socket.off("autoOrderSuccess", handleAutoOrder);
    };
  }, []);

  const fetchLiveRoom = async () => {
    try {
      const res = await axios.get(API);
      const liveRoom = res.data.find((r) => r.status === "live") || res.data[0];
      if (liveRoom) {
        setRoom(liveRoom);
        socket.emit("joinRoom", liveRoom._id);
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (!room) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100 text-muted">
        <div className="spinner-grow text-primary mb-3" role="status"></div>
        <p className="fw-medium">Hiện tại chưa có phiên livestream nào...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 bg-light min-vh-100">
      <style>{animations}</style>
      <div className="container">
        <div className="row g-4">
          {/* CỘT TRÁI: VIDEO & SẢN PHẨM */}
          <div className="col-lg-8">
            {/* Header Room */}
            <div className="card border-0 shadow-sm mb-3 rounded-4 overflow-hidden">
              <div className="card-body d-flex align-items-center p-3">
                <div className="position-relative">
                  <img
                    src={room.thumbnail || "https://via.placeholder.com/150"}
                    alt="thumb"
                    className="rounded-3 object-fit-cover shadow-sm"
                    style={{ width: "80px", height: "55px" }}
                  />
                  {room.status === "live" && (
                    <span className="position-absolute top-0 start-0 translate-middle badge rounded-pill bg-danger border border-light" 
                          style={{ fontSize: '0.6rem', animation: 'pulse-red 2s infinite' }}>
                      LIVE
                    </span>
                  )}
                </div>
                <div className="ms-3 flex-grow-1">
                  <h5 className="mb-0 fw-bold text-dark">{room.title}</h5>
                  <p className="text-muted small mb-0 text-truncate" style={{ maxWidth: '400px' }}>
                    {room.description || "Chào mừng bạn đến với phiên live!"}
                  </p>
                </div>
                <div>
                    <span className={`badge rounded-pill px-3 py-2 ${room.status === 'live' ? 'bg-danger-subtle text-danger' : 'bg-secondary-subtle text-secondary'}`}>
                       {room.status === 'live' ? '● Đang phát trực tiếp' : 'Phiên live đã kết thúc'}
                    </span>
                </div>
              </div>
            </div>

            {/* Khung Video */}
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-black mb-4" style={{ minHeight: "450px" }}>
              <div className="position-relative w-100 h-100 d-flex align-items-center justify-content-center">
                {room.status === "live" ? (
                  <UserWatchLivestream livestreamId={room._id} />
                ) : room.videoUrl ? (
                  <video
                    src={`http://localhost:5000${room.videoUrl}`}
                    controls
                    className="w-100"
                    style={{ maxHeight: "500px" }}
                  />
                ) : (
                  <div className="text-center text-white-50 p-5">
                    <i className="bi bi-camera-video-off fs-1 mb-2"></i>
                    <p>Livestream chưa bắt đầu hoặc đã kết thúc</p>
                  </div>
                )}
              </div>
            </div>

            {/* Danh sách sản phẩm */}
            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-header bg-white border-0 pt-4 px-4">
                <h5 className="fw-bold mb-0">
                  <i className="bi bi-bag-heart-fill text-danger me-2"></i>
                  Sản phẩm trong live
                </h5>
              </div>
              <div className="card-body p-4">
                <UserProductPage livestreamId={room._id} />
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: CHAT BOX */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm rounded-4 h-100 d-flex flex-column" style={{ maxHeight: "85vh" }}>
              <div className="card-header bg-white border-bottom py-3 px-4">
                <div className="d-flex justify-content-between align-items-center">
                    <strong className="fs-5">Bình luận</strong>
                    <span className="badge bg-light text-dark border">
                        <i className="bi bi-people-fill me-1"></i> Trực tuyến
                    </span>
                </div>
              </div>

              <div className="card-body overflow-auto p-3" id="chat-container">
                <LiveCommentList livestreamId={room._id} />
              </div>

              {room.status === "live" && (
                <div className="card-footer bg-white border-0 p-3">
                  <LiveCommentWrite livestreamId={room._id} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL CHỐT ĐƠN THÀNH CÔNG */}
      {orderSuccess && (
        <div style={styles.overlay}>
          <div style={styles.modal} className="order-success-pop">
            <div className="success-checkmark">
              <div className="check-icon">
                <span className="icon-line line-tip"></span>
                <span className="icon-line line-long"></span>
                <div className="icon-circle"></div>
                <div className="icon-fix"></div>
              </div>
            </div>
            <h3 className="fw-bold mt-3 text-dark">Chốt đơn thành công!</h3>
            <p className="text-muted">Đơn hàng của bạn đã được hệ thống ghi nhận tự động.</p>
            <div className="bg-light p-3 rounded-3 mb-4">
                <span className="d-block text-muted small">Tổng thanh toán:</span>
                <h4 className="text-danger fw-bold mb-0">
                  {orderSuccess.totalPrice.toLocaleString()} VNĐ
                </h4>
            </div>
            <button className="btn btn-primary w-100 py-2 rounded-3 fw-bold shadow-sm" onClick={() => setOrderSuccess(null)}>
              XÁC NHẬN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// CSS Animations
const animations = `
  @keyframes pulse-red {
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(220, 53, 69, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(220, 53, 69, 0); }
  }

  @keyframes fadeScale {
    from { opacity: 0; transform: scale(0.9); }
    to { opacity: 1; transform: scale(1); }
  }

  .order-success-pop {
    animation: fadeScale 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* Custom Scrollbar */
  #chat-container::-webkit-scrollbar { width: 4px; }
  #chat-container::-webkit-scrollbar-track { background: transparent; }
  #chat-container::-webkit-scrollbar-thumb { background: #ddd; border-radius: 10px; }
`;

const styles = {
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10000,
  },
  modal: {
    background: "#ffffff",
    padding: "40px",
    borderRadius: "24px",
    textAlign: "center",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
  },
};