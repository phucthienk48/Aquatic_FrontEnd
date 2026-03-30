import { useState, useEffect } from "react";

import LiveCommentWrite from "../livestream/LiveCommentWrite";
import LiveCommentList from "../livestream/LiveCommentList";
import AdminLivestreamPage from "../livestream/AdminLivestreamPage";
import AdminLivestreamProduct from "../livestream/AdminLivestreamProduct";
import AdminStreamCamera from "../livestream/AdminStreamCamera";

export default function LiveCommentContainer() {
  const [livestreamId, setLivestreamId] = useState(null);

  useEffect(() => {
    console.log("LivestreamId:", livestreamId);
  }, [livestreamId]);

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "3fr 2fr",
        gap: 20,
        padding: 20,
        background: "linear-gradient(135deg, #e0f7fa, #e8f5e9)",
        minHeight: "100vh",
      }}
    >
      {/* LEFT */}
      <div>
        <div style={cardStyle}>
          <AdminLivestreamPage
            livestreamId={livestreamId}
            onSelectLivestream={setLivestreamId}
          />
        </div>

        {livestreamId && (
          <div style={{ marginTop: 20 }}>
            <div style={cardStyle}>
              <AdminStreamCamera livestreamId={livestreamId} />
            </div>

            <div style={{ ...cardStyle, marginTop: 20 }}>
              <AdminLivestreamProduct livestreamId={livestreamId} />
            </div>
          </div>
        )}
      </div>

      {/* RIGHT */}
      <div style={cardStyle}>
        <h3 style={titleStyle}>
          <i className="bi bi-chat-dots-fill" style={{ marginRight: 8 }}></i>
          Bình luận livestream
        </h3>

        {/* LIST */}
        {livestreamId ? (
          <div
            style={{
              height: 400,
              overflowY: "auto",
              padding: 10,
              background: "#ffffffcc",
              borderRadius: 12,
              marginBottom: 10,
            }}
          >
            <LiveCommentList livestreamId={livestreamId} />
          </div>
        ) : (
          <p style={{ color: "#888" }}>Chọn livestream để xem bình luận</p>
        )}

        {/* WRITE - ĐƯA XUỐNG DƯỚI */}
        <div
          style={{
            marginTop: 10,
            padding: 10,
            background: "#e0f2f1",
            borderRadius: 12,
          }}
        >
          <LiveCommentWrite onSelectLivestream={setLivestreamId} />
        </div>
      </div>
    </div>
  );
}

/* 🎨 STYLE */
const cardStyle = {
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(10px)",
  borderRadius: 20,
  padding: 15,
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

const titleStyle = {
  marginBottom: 10,
  color: "#00796b",
};