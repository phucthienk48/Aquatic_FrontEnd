import { useEffect, useState } from "react";

export default function WriteComment({ userId, productId, orderId }) {
  const [comment, setComment] = useState(null);

  const [content, setContent] = useState("");
  const [rating, setRating] = useState(5);

  const [images, setImages] = useState([]);       // ảnh đã lưu
  const [imageFiles, setImageFiles] = useState([]); // ảnh mới chọn

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  /* ================= LOAD COMMENT ================= */
useEffect(() => {
    setLoading(true);
    }, [userId, productId, orderId]);

    useEffect(() => {
    if (!userId || !productId || !orderId) return;

    const fetchMyComment = async () => {
        try {
        const res = await fetch(
            `http://localhost:5000/api/comment/my?user=${userId}&product=${productId}&order=${orderId}`
        );
        const data = await res.json();

        if (data?._id) {
            setComment(data);
            setContent(data.content || "");
            setRating(data.rating || 5);
            setImages(data.images || []);
        } else {
            setComment(null);
            setContent("");
            setRating(5);
            setImages([]);
        }
        } catch (err) {
        console.error(err);
        } finally {
        setLoading(false);
        }
    };

    fetchMyComment();
    }, [userId, productId, orderId]);


  /* ================= UPLOAD IMAGE ================= */
  const uploadImage = async (file) => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("image", file);

    setUploading(true);
    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: fd,
    });
    const data = await res.json();
    setUploading(false);
    return data.url;
  };

  /* ================= REMOVE IMAGE ================= */
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    if (!content.trim()) return alert("Vui lòng nhập nội dung");

    setSaving(true);

    try {
      /* upload ảnh mới */
      let finalImages = [...images];
      for (const file of imageFiles) {
        const url = await uploadImage(file);
        if (url) finalImages.push(url);
      }

      const url = comment
        ? `http://localhost:5000/api/comment/${comment._id}`
        : `http://localhost:5000/api/comment`;

      const method = comment ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: userId,
          product: productId,
          order: orderId,
          content,
          rating,
          images: finalImages,
        }),
      });

      const data = await res.json();
      if (!res.ok) return alert(data.message || "Lỗi gửi đánh giá");

      /* 🔥 update state để hiển thị form sửa */
      setComment(data);
      setImages(data.images || []);
      setImageFiles([]);

      alert(comment ? "Cập nhật đánh giá thành công" : "Đánh giá thành công");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi gửi đánh giá");
    } finally {
      setSaving(false);
    }
  };

if (loading) return <p>⏳ Đang tải đánh giá...</p>;

    return (
    <div style={styles.card}>
        <div style={styles.header}>
        <i className={`bi ${comment ? "bi-pencil-square" : "bi-star-fill"}`} />
        <span>
            {comment ? "Sửa đánh giá của bạn" : "Đánh giá sản phẩm"}
        </span>
        </div>

        {/* ===== RATING ===== */}
        <div style={styles.rating}>
        {[1, 2, 3, 4, 5].map((star) => (
            <i
            key={star}
            className={`bi ${
                star <= rating ? "bi-star-fill" : "bi-star"
            }`}
            style={{
                ...styles.star,
                color: star <= rating ? "#fadb14" : "#ccc",
            }}
            onClick={() => setRating(star)}
            />
        ))}
        <span style={styles.ratingText}>{rating}/5</span>
        </div>

        {/* ===== CONTENT ===== */}
        <textarea
        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={styles.textarea}
        />

        {/* ===== UPLOAD IMAGE ===== */}
        <label style={styles.uploadBtn}>
        <i className="bi bi-camera" /> Thêm ảnh
        <input
            type="file"
            multiple
            accept="image/*"
            hidden
            onChange={(e) => setImageFiles([...e.target.files])}
        />
        </label>

        {uploading && (
        <p style={styles.uploading}>
            <i className="bi bi-cloud-upload" /> Đang upload ảnh...
        </p>
        )}

        {/* ===== IMAGE PREVIEW ===== */}
        <div style={styles.previewWrap}>
        {images.map((img, index) => (
            <div key={index} style={styles.imgBox}>
            <img src={img} style={styles.preview} />
            <button
                style={styles.removeBtn}
                onClick={() => removeImage(index)}
            >
                <i className="bi bi-x" />
            </button>
            </div>
        ))}
        </div>

        {/* ===== SUBMIT ===== */}
        <button
        onClick={handleSubmit}
        disabled={saving}
        style={styles.submitBtn}
        >
        {saving ? (
            <>
            <i className="bi bi-arrow-repeat" /> Đang gửi...
            </>
        ) : comment ? (
            <>
            <i className="bi bi-check-circle" /> Cập nhật đánh giá
            </>
        ) : (
            <>
            <i className="bi bi-send" /> Gửi đánh giá
            </>
        )}
        </button>
    </div>
    );

}

/* ================= STYLE ================= */
const styles = {
  card: {
    marginTop: 12,
    padding: 14,
    borderRadius: 10,
    border: "1px solid #eee",
    background: "#fff",
  },

  header: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontWeight: 600,
    marginBottom: 8,
  },

  rating: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },

  star: {
    fontSize: 22,
    cursor: "pointer",
  },

  ratingText: {
    marginLeft: 6,
    fontSize: 14,
    color: "#555",
  },

  textarea: {
    width: "100%",
    minHeight: 70,
    padding: 8,
    borderRadius: 6,
    border: "1px solid #ddd",
    resize: "vertical",
  },

  uploadBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    padding: "6px 10px",
    border: "1px dashed #aaa",
    borderRadius: 6,
    cursor: "pointer",
    fontSize: 14,
    color: "#555",
  },

  uploading: {
    fontSize: 13,
    color: "#1890ff",
    marginTop: 4,
  },

  previewWrap: {
    display: "flex",
    gap: 8,
    marginTop: 8,
    flexWrap: "wrap",
  },

  imgBox: {
    position: "relative",
  },

  preview: {
    width: 80,
    height: 80,
    objectFit: "cover",
    borderRadius: 6,
    border: "1px solid #ddd",
  },

  removeBtn: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "#ff4d4f",
    border: "none",
    color: "#fff",
    cursor: "pointer",
  },

  submitBtn: {
    marginTop: 10,
    width: "100%",
    padding: 8,
    borderRadius: 6,
    border: "none",
    background: "#1677ff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 500,
  },
};

