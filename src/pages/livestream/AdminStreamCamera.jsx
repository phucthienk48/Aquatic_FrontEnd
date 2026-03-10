import { useEffect, useRef, useState } from "react";
import socket from "../../socket/socket";

export default function AdminStreamCamera({ livestreamId }) {

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);

  useEffect(() => {

    startCamera();

    socket.on("endLivestream", (data) => {
      if (data.livestreamId === livestreamId) {
        stopRecording();
      }
    });

    return () => {
      socket.off("endLivestream");
      stopCamera();
    };

  }, []);

  // bật camera
  const startCamera = async () => {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

    } catch (err) {
      console.error("camera error:", err);
    }

  };

  // tắt camera
  const stopCamera = () => {

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

  };

  // bắt đầu livestream
  const startLivestream = () => {

    const stream = streamRef.current;

    const mimeType = "video/webm; codecs=vp9,opus";

    if (!MediaRecorder.isTypeSupported(mimeType)) {
      alert("browser không hỗ trợ codec này");
      return;
    }

    socket.emit("startLivestream", livestreamId);

    const mediaRecorder = new MediaRecorder(stream, {
      mimeType
    });

    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.ondataavailable = async (event) => {

      if (event.data.size > 0) {

        const buffer = await event.data.arrayBuffer();

        socket.emit("streamVideo", {
          livestreamId,
          chunk: buffer
        });

      }

    };

    // gửi video mỗi 300ms
    mediaRecorder.start(300);

    setIsRecording(true);

  };

  // dừng livestream
  const stopRecording = () => {

    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }

    socket.emit("endLivestream", livestreamId);

    setIsRecording(false);

  };

  return (
    <div>

      <h2>admin livestream camera</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          maxWidth: "500px",
          borderRadius: "10px"
        }}
      />

      <div style={{ marginTop: "10px" }}>

        {!isRecording && (
          <button onClick={startLivestream}>
            bắt đầu livestream
          </button>
        )}

        {isRecording && (
          <button onClick={stopRecording}>
            dừng livestream
          </button>
        )}

      </div>

    </div>
  );
}