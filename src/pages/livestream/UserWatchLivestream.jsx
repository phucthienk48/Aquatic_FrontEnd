import { useEffect, useRef } from "react";
import socket from "../../socket/socket";

export default function UserWatchLivestream({ livestreamId }) {

  const videoRef = useRef(null);
  const mediaSourceRef = useRef(null);
  const sourceBufferRef = useRef(null);
  const queueRef = useRef([]);

  useEffect(() => {

    socket.emit("joinRoom", livestreamId);

    const mediaSource = new MediaSource();
    mediaSourceRef.current = mediaSource;

    videoRef.current.src = URL.createObjectURL(mediaSource);

    mediaSource.addEventListener("sourceopen", () => {

      const sourceBuffer = mediaSource.addSourceBuffer(
        'video/webm; codecs="vp9,opus"'
      );

      sourceBufferRef.current = sourceBuffer;

      sourceBuffer.addEventListener("updateend", () => {

        if (
          queueRef.current.length > 0 &&
          !sourceBuffer.updating
        ) {
          sourceBuffer.appendBuffer(queueRef.current.shift());
        }

      });

    });

    socket.on("receiveVideo", (chunk) => {

      const data = new Uint8Array(chunk);

      if (!sourceBufferRef.current) {
        queueRef.current.push(data);
        return;
      }

      if (!sourceBufferRef.current.updating) {
        sourceBufferRef.current.appendBuffer(data);
      } else {
        queueRef.current.push(data);
      }

    });

    socket.on("livestreamEnded", () => {
      console.log("livestream ended");
    });

    return () => {

      socket.emit("leaveRoom", livestreamId);

      socket.off("receiveVideo");
      socket.off("livestreamEnded");

    };

  }, [livestreamId]);

  return (
    <div>

      <h2>livestream</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        controls
        playsInline
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "10px"
        }}
      />

    </div>
  );
}