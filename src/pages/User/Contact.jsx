import { useEffect, useState } from "react";

export default function Contact() {
  const [shop, setShop] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchShop();
  }, []);

  const fetchShop = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/shop");
      const data = await res.json();
      setShop(data[0] || null);
    } catch (err) {
      console.error("Không lấy được thông tin shop");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();

      setSuccess("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch {
      setError("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>
        <i className="bi bi-telephone-fill me-2"></i>
        Liên hệ {shop?.shopName || "Shop"}
      </h1>

      <div className="row g-4">
        {/*  FORM  */}
        <div className="col-md-6">
          <form style={styles.formCard} onSubmit={handleSubmit}>
            <h4 style={styles.formTitle}>
              <i className="bi bi-chat-dots-fill me-2"></i>
              Gửi tin nhắn
            </h4>

            {success && (
              <div className="alert alert-success">
                <i className="bi bi-check-circle me-2"></i>
                {success}
              </div>
            )}

            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {error}
              </div>
            )}

            <div style={styles.formGroup}>
              <label style={styles.label}>Họ và tên</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Nhập họ và tên"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Số điện thoại</label>
              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="09xx xxx xxx"
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Nội dung</label>
              <textarea
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="Nhập nội dung bạn muốn liên hệ..."
                style={styles.textarea}
                required
              />
            </div>

            <button style={styles.button} disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Đang gửi...
                </>
              ) : (
                <>
                  <i className="bi bi-send-fill me-2"></i>
                  Gửi liên hệ
                </>
              )}
            </button>
          </form>
        </div>

        {/*  SHOP INFO  */}
        <div className="col-md-6">
          <div style={styles.infoCard}>
            {/* LOGO */}
            <div style={styles.logoWrap}>
              <img
                src={shop?.logo || "https://via.placeholder.com/120"}
                alt="Shop Logo"
                style={styles.logo}
              />
            </div>

            <h4 style={styles.shopName}>
              <i className="bi bi-shop me-2"></i>
              {shop?.shopName || "Aquatic Shop"}
            </h4>

            {/* OWNER */}
            {shop?.ownerName && (
              <p style={styles.owner}>
                <i className="bi bi-person-badge-fill me-2"></i>
                <strong>Chủ shop:</strong> {shop.ownerName}
              </p>
            )}

            <p>
              {shop?.description ||
                "Chuyên cá cảnh – thủy sinh – vật tư hồ cá"}
            </p>

            <p>
              <i className="bi bi-geo-alt-fill me-2"></i>
              <strong>Địa chỉ:</strong> {shop?.address || "Đang cập nhật"}
            </p>

            <p>
              <i className="bi bi-envelope-fill me-2"></i>
              <strong>Email:</strong> {shop?.email || "Đang cập nhật"}
            </p>

            <p>
              <i className="bi bi-telephone-fill me-2"></i>
              <strong>Hotline:</strong> {shop?.phone || "Đang cập nhật"}
            </p>

            {shop?.workingTime && (
              <p>
                <i className="bi bi-clock-fill me-2"></i>
                <strong>Giờ làm việc:</strong> {shop.workingTime}
              </p>
            )}

            {shop?.facebook && (
              <a
                href={shop.facebook}
                target="_blank"
                rel="noreferrer"
                className="btn btn-outline-primary mt-3"
              >
                <i className="bi bi-facebook me-2"></i>
                Fanpage Facebook
              </a>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

/*  STYLES  */
const styles = {
  page: { maxWidth: 1100, margin: "40px auto", padding: 16 },
  title: { textAlign: "center", marginBottom: 40, fontWeight: 700 },
  formCard: {
    background: "#fff",
    padding: 28,
    borderRadius: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  },
  formTitle: { marginBottom: 20, fontWeight: 600, color: "#0d6efd" },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 14,
    borderRadius: 10,
    border: "1px solid #ddd",
  },
  textarea: {
    width: "100%",
    padding: 12,
    borderRadius: 10,
    border: "1px solid #ddd",
    marginBottom: 14,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    border: "none",
    background: "#0d6efd",
    color: "#fff",
    fontWeight: 600,
  },
  infoCard: {
    background: "#f8f9fa",
    padding: 28,
    borderRadius: 16,
    height: "100%",
  },
  shopName: { fontWeight: 700, color: "#0d6efd" },
  logoWrap: {
  display: "flex",
  justifyContent: "center",
  marginBottom: 16,
},

logo: {
  width: 120,
  height: 120,
  borderRadius: "50%",
  objectFit: "cover",
  border: "4px solid #e5e7eb",
  background: "#fff",
},

owner: {
  marginBottom: 10,
  color: "#374151",
  fontWeight: 500,
},

};
