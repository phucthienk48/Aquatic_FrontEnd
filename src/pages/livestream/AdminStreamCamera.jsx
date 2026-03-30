import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../socket/socket";

const CAMERA_API = "http://localhost:5000/api/camera";

export default function AdminStreamCamera({ livestreamId }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);
  const [viewerCount, setViewerCount] = useState(1); // <-- Thêm state số người xem

  useEffect(() => {
    if (!livestreamId) return;

    socket.emit("joinRoom", livestreamId);

    const setupCamera = async () => {
      await initCamera();
      try {
        const res = await axios.get(`${CAMERA_API}/status/${livestreamId}`);
        if (res.data.success && res.data.isCameraOn) {
          startLivestream();
        }
      } catch (err) {
        console.error("Fetch camera status error:", err);
      }
    };

    setupCamera();

    // Lắng nghe sự kiện cập nhật số người xem
    socket.on("updateViewerCount", (count) => {
      setViewerCount(count);
    });

    socket.on("livestreamEnded", handleLivestreamEnded);

    return () => {
      socket.emit("leaveRoom", livestreamId);
      socket.off("livestreamEnded", handleLivestreamEnded);
      socket.off("updateViewerCount"); // Clean up socket
      stopRecordingLocal();
      stopCamera();
    };
  }, [livestreamId]);

  const handleLivestreamEnded = (data) => {
    if (data.livestreamId === livestreamId) {
      stopRecordingLocal();
    }
  };

  const initCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("camera error:", err);
      alert("Không thể truy cập camera");
    }
  };

  const stopCamera = () => {
    if (!streamRef.current) return;
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  const startLivestream = async () => {
    const stream = streamRef.current;
    if (!stream) {
      alert("Camera chưa sẵn sàng");
      return;
    }
    if (isRecording) return;

    const mimeType = "video/webm; codecs=vp9,opus";
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      alert("Browser không hỗ trợ codec");
      return;
    }

    try {
      await axios.post(`${CAMERA_API}/start-camera`, { livestreamId });
      socket.emit("startLivestream", livestreamId);

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {
        if (event.data && event.data.size > 0) {
          const buffer = await event.data.arrayBuffer();
          socket.emit("streamVideo", { livestreamId, chunk: buffer });
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
    } catch (err) {
      console.error("start livestream error:", err);
    }
  };

  const stopRecordingLocal = () => {
    if (!mediaRecorderRef.current) return;
    try {
      mediaRecorderRef.current.stop();
    } catch (err) {
      console.error("stop recorder error:", err);
    }
    mediaRecorderRef.current = null;
    setIsRecording(false);
  };

  const stopRecording = async () => {
    try {
      await axios.post(`${CAMERA_API}/stop-camera`, { livestreamId });
      socket.emit("endLivestream", livestreamId);
      stopRecordingLocal();
    } catch (err) {
      console.error("stop camera error:", err);
    }
  };

  return (
    <div className="card border-0 shadow-sm p-3 rounded-4 bg-white">
      <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
        <i className="bi bi-camera-reels-fill text-primary"></i>
        Bảng điều khiển Livestream
      </h5>

      {/* KHUNG VIDEO VỚI OVERLAY MẮT XEM */}
      <div className="position-relative overflow-hidden rounded-3 shadow-sm" style={{ background: "#000" }}>
        
        {/* Badge Mắt xem góc phải trên */}
        <div 
          className="position-absolute top-0 end-0 m-3 d-flex align-items-center gap-2 px-2 py-1 rounded-2 shadow-sm"
          style={{ 
            backgroundColor: "rgba(0, 0, 0, 0.6)", 
            color: "#fff", 
            zIndex: 10,
            backdropFilter: "blur(4px)",
            fontSize: "0.9rem"
          }}
        >
          <i className="bi bi-eye-fill text-danger"></i>
          <span className="fw-bold">{viewerCount}</span>
        </div>

        {/* Badge Trạng thái LIVE góc trái trên */}
        {isRecording && (
          <div className="position-absolute top-0 start-0 m-3" style={{ zIndex: 10 }}>
            <span className="badge bg-danger d-flex align-items-center gap-1 px-2 py-1 text-uppercase fw-bold" style={{ fontSize: '0.7rem' }}>
              <span className="spinner-grow spinner-grow-sm" style={{ width: '8px', height: '8px' }}></span>
              Trực tiếp
            </span>
          </div>
        )}

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            display: "block",
            maxHeight: "450px",
            objectFit: "cover"
          }}
        />
      </div>

      <div className="mt-3 d-grid">
        {!isRecording ? (
          <button 
            className="btn btn-primary btn-lg fw-bold d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 shadow"
            onClick={startLivestream}
          >
            <i className="bi bi-broadcast"></i>
            BẮT ĐẦU PHÁT TRỰC TIẾP
          </button>
        ) : (
          <button 
            className="btn btn-danger btn-lg fw-bold d-flex align-items-center justify-content-center gap-2 py-3 rounded-3 shadow"
            onClick={stopRecording}
          >
            <i className="bi bi-stop-circle-fill"></i>
            DỪNG LIVESTREAM
          </button>
        )}
      </div>

      <div className="mt-2 text-center">
         <small className="text-muted">
           {isRecording ? "Hệ thống đang gửi dữ liệu lên máy chủ..." : "Sẵn sàng để bắt đầu phiên live."}
         </small>
      </div>
    </div>
  );
}