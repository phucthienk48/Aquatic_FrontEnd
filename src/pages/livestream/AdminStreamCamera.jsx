import { useEffect, useRef, useState } from "react";
import axios from "axios";
import socket from "../../socket/socket";

const CAMERA_API = "http://localhost:5000/api/camera";

export default function AdminStreamCamera({ livestreamId }) {

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const [isRecording, setIsRecording] = useState(false);

  // ======================
  // INIT
  // ======================
  useEffect(() => {

    if (!livestreamId) return;

    socket.emit("joinRoom", livestreamId);

    initCamera();

    socket.on("livestreamEnded", handleLivestreamEnded);

    return () => {

      socket.emit("leaveRoom", livestreamId);

      socket.off("livestreamEnded", handleLivestreamEnded);

      stopRecordingLocal();
      stopCamera();

    };

  }, [livestreamId]);



  // ======================
  // HANDLE LIVESTREAM END
  // ======================
  const handleLivestreamEnded = (data) => {

    if (data.livestreamId === livestreamId) {

      stopRecordingLocal();

    }

  };



  // ======================
  // INIT CAMERA
  // ======================
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



  // ======================
  // STOP CAMERA DEVICE
  // ======================
  const stopCamera = () => {

    if (!streamRef.current) return;

    streamRef.current.getTracks().forEach(track => track.stop());

    streamRef.current = null;

  };



  // ======================
  // START LIVESTREAM
  // ======================
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

      // cập nhật trạng thái camera
      await axios.post(`${CAMERA_API}/start-camera`, {
        livestreamId
      });

      socket.emit("startLivestream", livestreamId);

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType
      });

      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = async (event) => {

        if (event.data && event.data.size > 0) {

          const buffer = await event.data.arrayBuffer();

          socket.emit("streamVideo", {
            livestreamId,
            chunk: buffer
          });

        }

      };

      // gửi chunk mỗi 1s
      mediaRecorder.start(1000);

      setIsRecording(true);

    } catch (err) {

      console.error("start livestream error:", err);

    }

  };



  // ======================
  // STOP LOCAL RECORD
  // ======================
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



  // ======================
  // STOP LIVESTREAM
  // ======================
  const stopRecording = async () => {

    try {

      await axios.post(`${CAMERA_API}/stop-camera`, {
        livestreamId
      });

      socket.emit("endLivestream", livestreamId);

      stopRecordingLocal();

    } catch (err) {

      console.error("stop camera error:", err);

    }

  };



  return (

    <div>

      <h2>Admin Livestream Camera</h2>

      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        style={{
          width: "100%",
          maxWidth: "600px",
          borderRadius: "10px",
          background: "#000"
        }}
      />

      <div style={{ marginTop: "10px" }}>

        {!isRecording && (

          <button onClick={startLivestream}>
            Bắt đầu camera livestream
          </button>

        )}

        {isRecording && (

          <button onClick={stopRecording}>
            Dừng camera livestream
          </button>

        )}

      </div>

    </div>

  );

}