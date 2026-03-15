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

  // =====================
  // INIT PLAYER
  // =====================
  useEffect(() => {

    if (!livestreamId) return;

    initPlayer();

    return () => {

      socket.emit("leaveRoom", livestreamId);

      socket.off("receiveVideo", handleReceiveVideo);
      socket.off("livestreamEnded", handleLivestreamEnded);

      cleanup();

    };

  }, [livestreamId]);



  // =====================
  // INIT MEDIA SOURCE
  // =====================
  const initPlayer = () => {

    const mediaSource = new MediaSource();

    mediaSourceRef.current = mediaSource;

    const video = videoRef.current;

    video.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", async () => {

      const sourceBuffer = mediaSource.addSourceBuffer(
        'video/webm; codecs="vp9,opus"'
      );

      sourceBuffer.mode = "segments";

      sourceBufferRef.current = sourceBuffer;

      sourceBuffer.addEventListener("updateend", flushQueue);

      isPlayerReady.current = true;

      // 1️⃣ load chunk gần realtime trước
      await loadLatestChunks();

      // 2️⃣ sau đó mới join socket
      socket.emit("joinRoom", livestreamId);

      socket.on("receiveVideo", handleReceiveVideo);
      socket.on("livestreamEnded", handleLivestreamEnded);

    });

  };



  // =====================
  // LOAD CHUNK GẦN NHẤT
  // =====================
  const loadLatestChunks = async () => {

    try {

      const res = await axios.get(
        `${CAMERA_API}/chunks/${livestreamId}`
      );

      const chunks = res.data || [];

      if (chunks.length === 0) return;

      const latestChunks = chunks.slice(-10);

      for (const chunk of latestChunks) {

        const response = await fetch(
          `http://localhost:5000${chunk.url}`
        );

        const buffer = await response.arrayBuffer();

        queueRef.current.push(new Uint8Array(buffer));

      }

      flushQueue();

    } catch (err) {

      console.error("load latest chunks error:", err);

    }

  };



  // =====================
  // SOCKET RECEIVE VIDEO
  // =====================
  const handleReceiveVideo = (chunk) => {

    const data = new Uint8Array(chunk);

    queueRef.current.push(data);

    flushQueue();

  };



  // =====================
  // FLUSH QUEUE
  // =====================
  const flushQueue = () => {

    const sourceBuffer = sourceBufferRef.current;

    if (!sourceBuffer) return;

    if (sourceBuffer.updating) return;

    if (queueRef.current.length === 0) return;

    try {

      const chunk = queueRef.current.shift();

      sourceBuffer.appendBuffer(chunk);

    } catch (err) {

      console.error("append error:", err);

    }

  };



  // =====================
  // HANDLE LIVESTREAM END
  // =====================
  const handleLivestreamEnded = () => {

    console.log("livestream ended");

  };



  // =====================
  // CLEANUP
  // =====================
  const cleanup = () => {

    if (videoRef.current) {

      videoRef.current.pause();

      videoRef.current.src = "";

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
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "10px",
          background: "#000"
        }}
      />

    </div>

  );

}