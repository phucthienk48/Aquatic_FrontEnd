import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const ROOM_ID = "live-1";

export default function ClientLive() {
  const videoRef = useRef(null);
  const peerRef = useRef(null);

  const [viewerCount, setViewerCount] = useState(0);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    socket.emit("join-live", ROOM_ID);
    socket.emit("client-ready", { roomId: ROOM_ID });

    peerRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    peerRef.current.ontrack = (e) => {
      videoRef.current.srcObject = e.streams[0];
    };

    peerRef.current.onicecandidate = (e) => {
      if (e.candidate) {
        socket.emit("webrtc-ice", {
          to: socket.id,
          candidate: e.candidate,
        });
      }
    };

    socket.on("webrtc-offer", async (offer) => {
      await peerRef.current.setRemoteDescription(offer);
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      socket.emit("webrtc-answer", {
        to: socket.id,
        answer,
      });
    });

    socket.on("viewer-count", setViewerCount);
    socket.on("live-status", setIsLive);

    return () => {
      peerRef.current?.close();
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <h2>📺 Livestream</h2>
      <p>👥 {viewerCount}</p>

      {!isLive && <p style={{ color: "red" }}>🔴 Chưa live</p>}

      <video ref={videoRef} autoPlay playsInline controls width={400} />
    </div>
  );
}
