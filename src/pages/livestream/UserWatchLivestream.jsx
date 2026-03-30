import { useEffect, useRef, useState } from "react"; // Thêm useState
import axios from "axios";
import socket from "../../socket/socket";

const CAMERA_API = "http://localhost:5000/api/camera";

export default function UserWatchLivestream({ livestreamId }) {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const queueRef = useRef([]);
  const isPlayerReady = useRef(false);
  const isFirstJump = useRef(true);

  // --- NEW STATES ---
  const [viewerCount, setViewerCount] = useState(1);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    if (!livestreamId) return;

    initPlayer();

    // Lắng nghe số người xem (Server cần emit sự kiện này)
    socket.on("updateViewerCount", (count) => {
      setViewerCount(count);
    });

    return () => {
      socket.emit("leaveRoom", livestreamId);
      socket.off("receiveVideo");
      socket.off("livestreamEnded");
      socket.off("updateViewerCount"); // Clean up
      cleanup();
    };
  }, [livestreamId]);

  const initPlayer = () => {
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    videoRef.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", async () => {
      const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9,opus"');
      sourceBuffer.mode = "segments";
      sourceBufferRef.current = sourceBuffer;

      sourceBuffer.addEventListener("updateend", () => {
        jumpToLive();
        flushQueue();
      });

      isPlayerReady.current = true;

      socket.emit("joinRoom", livestreamId);
      socket.on("receiveVideo", handleReceiveVideo);
      socket.on("livestreamEnded", handleLivestreamEnded);

      await loadLatestChunks();
    });
  };

  const jumpToLive = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0) {
      const lastIndex = video.buffered.length - 1;
      const end = video.buffered.end(lastIndex);
      if (isFirstJump.current || (end - video.currentTime > 5)) {
        video.currentTime = end - 0.1;
        isFirstJump.current = false;
      }
    }
  };

  const loadLatestChunks = async () => {
    try {
      const res = await axios.get(`${CAMERA_API}/chunks/${livestreamId}`);
      const chunks = res.data || [];
      if (chunks.length === 0) return;

      const firstChunk = chunks[chunks.length - 1];
      const latestChunks = chunks.slice(0, 2);
      const chunksToLoad = [firstChunk];
      
      latestChunks.reverse().forEach((c) => {
        if (c.url !== firstChunk.url) chunksToLoad.push(c);
      });

      for (const chunk of chunksToLoad) {
        if (!chunk.url) continue;
        const response = await fetch(`http://localhost:5000${chunk.url}`);
        const buffer = await response.arrayBuffer();
        queueRef.current.push(new Uint8Array(buffer));
      }
      flushQueue();
    } catch (err) {
      console.error("load latest chunks error:", err);
    }
  };

  const handleReceiveVideo = (chunk) => {
    if (isEnded) return; // Không nhận thêm nếu đã kết thúc
    const data = new Uint8Array(chunk);
    queueRef.current.push(data);
    flushQueue();
  };

  const flushQueue = () => {
    const sourceBuffer = sourceBufferRef.current;
    if (!sourceBuffer || sourceBuffer.updating || queueRef.current.length === 0) return;
    try {
      const chunk = queueRef.current.shift();
      sourceBuffer.appendBuffer(chunk);
    } catch (err) {
      if (err.name === 'QuotaExceededError') {
         sourceBuffer.remove(0, videoRef.current.currentTime - 10);
      }
    }
  };

  const handleLivestreamEnded = () => {
    console.log("livestream ended signal received");
    setIsEnded(true); // Hiển thị thông báo dừng
  };

  const cleanup = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
    }
    queueRef.current = [];
    sourceBufferRef.current = null;
    mediaSourceRef.current = null;
    isPlayerReady.current = false;
  };

  return (
    <div style={styles.container}>
      {/* 1. HIỂN THỊ SỐ NGƯỜI XEM Ở GÓC PHẢI */}
      <div style={styles.viewerBadge}>
        <i className="bi bi-eye-fill" style={{ marginRight: '5px' }}></i>
        {viewerCount}
      </div>

      {/* 2. THÔNG BÁO DỪNG LIVESTREAM (OVERLAY) */}
      {isEnded && (
        <div style={styles.endedOverlay}>
          <div className="text-center">
            <i className="bi bi-broadcast-pin fs-1 text-white mb-2"></i>
            <h5 className="text-white fw-bold">Buổi livestream đã kết thúc</h5>
            <p className="text-white-50 small">Cảm ơn bạn đã theo dõi!</p>
          </div>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls
        className="livestream-video"
        style={styles.video}
      />
    </div>
  );
}

// --- STYLES ---
const styles = {
  container: {
    position: "relative", // Quan trọng để các con dùng absolute
    width: "100%",
    maxWidth: "700px",
    margin: "0 auto",
    borderRadius: "12px",
    overflow: "hidden",
    backgroundColor: "#000",
    boxShadow: "0 10px 30px rgba(0,0,0,0.5)"
  },
  video: {
    width: "100%",
    display: "block",
    aspectRatio: "16/9", // Giữ khung hình ổn định
    objectFit: "contain",
  },
  viewerBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    color: "#fff",
    padding: "4px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    fontWeight: "600",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    border: "1px solid rgba(255,255,255,0.2)"
  },
  endedOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    zIndex: 20,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backdropFilter: "blur(8px)",
    transition: "all 0.5s ease"
  }
};