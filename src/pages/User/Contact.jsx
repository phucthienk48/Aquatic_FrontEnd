// src/pages/user/Contact.jsx
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact data:", form);
    alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm.");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="contact-page">
      <h1 className="mb-4">📞 Liên hệ với Aquatic Shop</h1>

      <div className="row">
        {/* FORM */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
            <div className="mb-3">
              <label className="form-label">Họ và tên</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                type="email"
                className="form-control"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Nội dung liên hệ</label>
              <textarea
                className="form-control"
                rows="4"
                name="message"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button className="btn btn-primary w-100">
              Gửi liên hệ
            </button>
          </form>
        </div>

        {/* INFO */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5>🏪 Aquatic Shop</h5>
            <p>Chuyên cá cảnh – thuốc thủy sinh – vật tư hồ cá</p>

            <p>📍 Địa chỉ: Cần Thơ, Việt Nam</p>
            <p>📧 Email: aquaticshop@gmail.com</p>
            <p>📱 Hotline / Zalo: 0909 000 000</p>

            <hr />

            <p>
              💬 Hoặc sử dụng <strong>Chatbot tư vấn</strong> ở góc màn hình để
              hỏi nhanh về:
            </p>
            <ul>
              <li>Chăm sóc cá</li>
              <li>Phòng bệnh</li>
              <li>Vận chuyển & bảo hành</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
