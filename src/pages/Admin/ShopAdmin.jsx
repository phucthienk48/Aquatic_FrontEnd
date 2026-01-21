import { useEffect, useState } from "react";

export default function AdminShop() {
  const [shop, setShop] = useState(null);
  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    shopName: "",
    ownerName: "",
    description: "",
    address: "",
    phone: "",
    email: "",
    workingTime: "",
    facebook: "",
    logo: "",
    banner: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH ================= */
  const fetchShop = async () => {
    const res = await fetch("http://localhost:5000/api/shop");
    const data = await res.json();
    if (data[0]) {
      setShop(data[0]);
      setFormData(data[0]);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /* ================= UPLOAD ================= */
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

  /* ================= SAVE ================= */
  const handleSave = async () => {
    let logo = formData.logo;
    let banner = formData.banner;

    if (logoFile) logo = await uploadImage(logoFile);
    if (bannerFile) banner = await uploadImage(bannerFile);

    const payload = { ...formData, logo, banner };

    const url = shop
      ? `http://localhost:5000/api/shop/${shop._id}`
      : "http://localhost:5000/api/shop";

    await fetch(url, {
      method: shop ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditing(false);
    fetchShop();
  };

  /* ================= EMPTY ================= */
  if (!shop && !editing) {
    return (
      <div className="container py-5 text-center">
        <i className="bi bi-shop display-1 text-secondary"></i>
        <h4 className="mt-3">Chưa có thông tin shop</h4>
        <button className="btn btn-primary mt-3" onClick={() => setEditing(true)}>
          <i className="bi bi-plus-circle me-2"></i>
          Tạo thông tin shop
        </button>
      </div>
    );
  }

  /* ================= FORM ================= */
  if (editing) {
    return (
      <div className="container py-4">
        <div className="card shadow-lg border-0">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">
              <i className="bi bi-pencil-square me-2"></i>
              {shop ? "Chỉnh sửa thông tin shop" : "Tạo thông tin shop"}
            </h5>
          </div>

          <div className="card-body row g-3">
            <div className="col-md-6">
              <label className="form-label">Tên shop</label>
              <input className="form-control" name="shopName" value={formData.shopName} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Chủ shop</label>
              <input className="form-control" name="ownerName" value={formData.ownerName} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Số điện thoại</label>
              <input className="form-control" name="phone" value={formData.phone} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <input className="form-control" name="email" value={formData.email} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">Giờ làm việc</label>
              <input className="form-control" name="workingTime" value={formData.workingTime} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <i className="bi bi-facebook me-1 text-primary"></i> Facebook
              </label>
              <input
                className="form-control"
                name="facebook"
                placeholder="https://facebook.com/tenfanpage"
                value={formData.facebook}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Địa chỉ</label>
              <input className="form-control" name="address" value={formData.address} onChange={handleChange} />
            </div>

            <div className="col-12">
              <label className="form-label">Mô tả</label>
              <textarea className="form-control" rows="3" name="description" value={formData.description} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <i className="bi bi-image me-1"></i> Logo
              </label>
              <input type="file" className="form-control" onChange={(e) => setLogoFile(e.target.files[0])} />
              {formData.logo && <img src={formData.logo} style={styles.previewLogo} />}
            </div>

            <div className="col-md-6">
              <label className="form-label">
                <i className="bi bi-card-image me-1"></i> Banner
              </label>
              <input type="file" className="form-control" onChange={(e) => setBannerFile(e.target.files[0])} />
              {formData.banner && <img src={formData.banner} style={styles.previewBanner} />}
            </div>

            {uploading && (
              <div className="col-12 text-center text-warning">
                <i className="bi bi-cloud-upload me-2"></i>Đang upload ảnh...
              </div>
            )}
          </div>

          <div className="card-footer text-end">
            <button className="btn btn-success me-2" onClick={handleSave}>
              <i className="bi bi-save me-1"></i>Lưu
            </button>
            <button className="btn btn-secondary" onClick={() => setEditing(false)}>
              <i className="bi bi-x-circle me-1"></i>Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ================= DISPLAY ================= */
  return (
    <div>
      {shop.banner && (
        <div style={{ height: 300, background: `url(${shop.banner}) center/cover` }} />
      )}

      <div className="container">
        <div className="card shadow-lg border-0 text-center" style={{ marginTop: -80 }}>
          <div className="card-body">
            {shop.logo && <img src={shop.logo} style={styles.logo} />}

            <h2 className="fw-bold">{shop.shopName}</h2>
            <p className="text-muted">{shop.description}</p>

            <div className="row text-start mt-4">
              <div className="col-md-6">
                <p><i className="bi bi-person-circle me-2"></i>{shop.ownerName}</p>
                <p><i className="bi bi-geo-alt-fill me-2"></i>{shop.address}</p>
                <p><i className="bi bi-clock-fill me-2"></i>{shop.workingTime}</p>
              </div>

              <div className="col-md-6">
                <p><i className="bi bi-telephone-fill me-2"></i>{shop.phone}</p>
                <p><i className="bi bi-envelope-fill me-2"></i>{shop.email}</p>

                {shop.facebook && (
                  <p>
                    <i className="bi bi-facebook me-2 text-primary"></i>
                    <a href={shop.facebook} target="_blank" rel="noreferrer">
                      Fanpage Facebook
                    </a>
                  </p>
                )}
              </div>
            </div>

            <button className="btn btn-outline-primary mt-3" onClick={() => setEditing(true)}>
              <i className="bi bi-pencil-square me-1"></i>Chỉnh sửa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= STYLES ================= */
const styles = {
  logo: {
    width: 130,
    height: 130,
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    marginBottom: 16,
  },
  previewLogo: {
    width: 90,
    height: 90,
    borderRadius: "50%",
    objectFit: "cover",
    marginTop: 8,
  },
  previewBanner: {
    width: "100%",
    maxHeight: 160,
    objectFit: "cover",
    borderRadius: 8,
    marginTop: 8,
  },
};
