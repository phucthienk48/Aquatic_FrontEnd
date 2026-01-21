import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");
const ROOM_ID = "live-1";

export default function AdminLive() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const peersRef = useRef({}); // socketId → peer

  const [viewerCount, setViewerCount] = useState(0);
  const [isLive, setIsLive] = useState(false);

  /* ================= START CAMERA ================= */
  const startCamera = async () => {
    streamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    videoRef.current.srcObject = streamRef.current;
  };

  /* ================= GO LIVE ================= */
  const goLive = () => {
    socket.emit("start-live", ROOM_ID);
    setIsLive(true);
  };

  /* ================= STOP LIVE ================= */
  const stopLive = () => {
    Object.values(peersRef.current).forEach((p) => p.close());
    peersRef.current = {};

    streamRef.current?.getTracks().forEach((t) => t.stop());
    socket.emit("stop-live", ROOM_ID);
    setIsLive(false);
  };

  /* ================= SOCKET ================= */
  useEffect(() => {
    socket.emit("join-live", ROOM_ID);

    socket.on("viewer-count", setViewerCount);

    socket.on("client-ready", async (clientId) => {
      if (!streamRef.current) return;

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peersRef.current[clientId] = peer;

      streamRef.current.getTracks().forEach((track) =>
        peer.addTrack(track, streamRef.current)
      );

      peer.onicecandidate = (e) => {
        if (e.candidate) {
          socket.emit("webrtc-ice", {
            to: clientId,
            candidate: e.candidate,
          });
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("webrtc-offer", {
        to: clientId,
        offer,
      });
    });

    socket.on("webrtc-answer", async (answer) => {
      const peer = Object.values(peersRef.current).find(
        (p) => p.signalingState === "have-local-offer"
      );
      if (peer) await peer.setRemoteDescription(answer);
    });

    socket.on("webrtc-ice", async (candidate) => {
      Object.values(peersRef.current).forEach((peer) => {
        peer.addIceCandidate(candidate).catch(() => {});
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <div>
      <h2>🎥 Admin Live</h2>
      <p>👥 {viewerCount}</p>

      <video ref={videoRef} autoPlay muted playsInline width={500} />

      <div>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={goLive} disabled={isLive}>Go Live</button>
        <button onClick={stopLive}>Stop</button>
      </div>
    </div>
  );
}
