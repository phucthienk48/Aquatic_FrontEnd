import { useEffect, useRef } from "react";
import axios from "axios";
import socket from "../../socket/socket";

const CAMERA_API = "http://localhost:5000/api/camera";

export default function UserWatchLivestream({ livestreamId }) {
  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const queueRef = useRef([]);
  const isPlayerReady = useRef(false);
  const isFirstJump = useRef(true); // Để nhảy tới đoạn mới nhất ở lần đầu tiên

  useEffect(() => {
    if (!livestreamId) return;

    initPlayer();

    return () => {
      socket.emit("leaveRoom", livestreamId);
      socket.off("receiveVideo");
      socket.off("livestreamEnded");
      cleanup();
    };
  }, [livestreamId]);

  const initPlayer = () => {
    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;
    videoRef.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", async () => {
      // Lưu ý: codecs phải khớp chính xác với luồng gửi từ server
      const sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp9,opus"');
      sourceBuffer.mode = "segments";
      sourceBufferRef.current = sourceBuffer;

      sourceBuffer.addEventListener("updateend", () => {
        // Sau khi append xong, kiểm tra để nhảy đến live nếu cần
        jumpToLive();
        flushQueue();
      });

      isPlayerReady.current = true;

      // 1. Join room ngay để nhận dữ liệu realtime nhanh nhất
      socket.emit("joinRoom", livestreamId);
      socket.on("receiveVideo", handleReceiveVideo);
      socket.on("livestreamEnded", handleLivestreamEnded);

      // 2. Tải các chunk cũ nhất một cách hạn chế
      await loadLatestChunks();
    });
  };

  // Hàm tự động nhảy đến giây cuối cùng của buffer (Live point)
  const jumpToLive = () => {
    const video = videoRef.current;
    if (video && video.buffered.length > 0) {
      const lastIndex = video.buffered.length - 1;
      const end = video.buffered.end(lastIndex);
      
      // Nếu là lần đầu load hoặc player bị trễ quá xa (ví dụ > 5s)
      if (isFirstJump.current || (end - video.currentTime > 5)) {
        video.currentTime = end - 0.1; // Nhảy đến gần cuối buffer
        isFirstJump.current = false;
      }
    }
  };

  const loadLatestChunks = async () => {
    try {
      const res = await axios.get(`${CAMERA_API}/chunks/${livestreamId}`);
      const chunks = res.data || [];
      if (chunks.length === 0) return;

      // Do mảng API trả về đã được đảo ngược (mới nhất nằm trên cùng), Header sẽ nằm ở vị trí CHÓT mảng!
      const firstChunk = chunks[chunks.length - 1];
      
      // LẤY 2 CHUNK CẬP NHẬT MỚI NHẤT (nằm ở vị trí 0 và 1)
      const latestChunks = chunks.slice(0, 2);

      const chunksToLoad = [firstChunk];
      
      // Mặc dù lấy các chunk mới nhất, ta bắt buộc phải đảo ngược (reverse) về thứ tự thời gian tuyến tính thì video webm mới phát được
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
      console.error("append error:", err);
      // Nếu buffer đầy, có thể cần xóa bớt dữ liệu cũ
      if (err.name === 'QuotaExceededError') {
         sourceBuffer.remove(0, videoRef.current.currentTime - 10);
      }
    }
  };

  const handleLivestreamEnded = () => {
    console.log("livestream ended");
  };

  const cleanup = () => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.removeAttribute('src');
      videoRef.current.load();
    }
    queueRef.current = [];
    sourceBufferRef.current = null;
    mediaSourceRef.current = null;
    isPlayerReady.current = false;
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        controls
        className="livestream-video"
        style={{
          width: "100%",
          maxWidth: "700px",
          borderRadius: "10px",
          background: "#000",
          boxShadow: "0 4px 15px rgba(0,0,0,0.3)"
        }}
      />
    </div>
  );
}