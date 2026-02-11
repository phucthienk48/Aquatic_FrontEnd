import { useState, useEffect } from "react";

import LiveCommentWrite from "../livestream/LiveCommentWrite";
import LiveCommentList from "../livestream/LiveCommentList";
import AdminLivestreamPage from "../livestream/AdminLivestreamPage";
import AdminLivestreamProduct from "../livestream/AdminLivestreamProduct";

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
      }}
    >
      <div>
        <AdminLivestreamPage
          livestreamId={livestreamId}
          onSelectLivestream={setLivestreamId}
        />

        {livestreamId && (
          <div style={{ marginTop: 20 }}>
            <AdminLivestreamProduct
              livestreamId={livestreamId}
            />
          </div>
        )}
      </div>
      <div>
        <LiveCommentWrite
          onSelectLivestream={setLivestreamId}
        />

        {livestreamId && (
          <LiveCommentList
            livestreamId={livestreamId}
          />
        )}
      </div>
    </div>
  );
}
