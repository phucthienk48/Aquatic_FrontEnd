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

  /*  FETCH  */
  const fetchShop = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/shop");
      const data = await res.json();
      if (data[0]) {
        setShop(data[0]);
        setFormData(data[0]);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu:", error);
    }
  };

  useEffect(() => {
    fetchShop();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  /*  UPLOAD  */
  const uploadImage = async (file) => {
    if (!file) return "";
    const fd = new FormData();
    fd.append("image", file);

    setUploading(true);
    try {
      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      setUploading(false);
      return data.url;
    } catch (e) {
      setUploading(false);
      return "";
    }
  };

  /*  SAVE  */
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

  /*  EMPTY  */
  if (!shop && !editing) {
    return (
      <div className="container py-5 text-center" style={styles.aquariumBg}>
        <div className="p-5 shadow rounded-4 bg-white bg-opacity-75">
          <i className="bi bi-water display-1 text-info animate-bounce"></i>
          <h2 className="mt-3 fw-bold text-primary">Bể cá của bạn đang trống</h2>
          <p className="text-muted">Hãy thiết lập thông tin để bắt đầu kinh doanh cá cảnh nhé!</p>
          <button className="btn btn-lg btn-primary rounded-pill px-4 shadow" onClick={() => setEditing(true)}>
            <i className="bi bi-plus-circle me-2"></i>
            Tạo cửa hàng thủy sinh
          </button>
        </div>
      </div>
    );
  }

  /*  EDITING FORM  */
  if (editing) {
    return (
      <div className="container py-4">
        <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
          <div className="card-header border-0 py-3" style={styles.gradientHeader}>
            <h5 className="mb-0 text-white fw-bold">
              <i className="bi bi-droplet-fill me-2"></i>
              {shop ? "Cập Nhật Hồ Cá" : "Thiết Lập Shop Mới"}
            </h5>
          </div>

          <div className="card-body p-4 bg-light">
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary">Tên cửa hàng cá</label>
                <input className="form-control form-control-lg border-2 rounded-3" name="shopName" value={formData.shopName} onChange={handleChange} placeholder="Ví dụ: Thủy Sinh Xanh" />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary">Chủ sở hữu</label>
                <input className="form-control form-control-lg border-2 rounded-3" name="ownerName" value={formData.ownerName} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary">Số điện thoại</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-2"><i className="bi bi-telephone text-info"></i></span>
                  <input className="form-control border-2" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary">Email liên hệ</label>
                <div className="input-group">
                  <span className="input-group-text bg-white border-2"><i className="bi bi-envelope text-info"></i></span>
                  <input className="form-control border-2" name="email" value={formData.email} onChange={handleChange} />
                </div>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary">Giờ mở cửa (Hồ hoạt động)</label>
                <input className="form-control border-2" name="workingTime" placeholder="8:00 - 21:00" value={formData.workingTime} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary text-primary">
                  <i className="bi bi-facebook me-1"></i> Link Fanpage
                </label>
                <input className="form-control border-2" name="facebook" value={formData.facebook} onChange={handleChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw-bold text-secondary">Địa chỉ shop</label>
                <input className="form-control border-2" name="address" value={formData.address} onChange={handleChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw-bold text-secondary">Mô tả về shop cá của bạn</label>
                <textarea className="form-control border-2" rows="3" name="description" value={formData.description} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary">Logo cửa hàng</label>
                <input type="file" className="form-control border-2" onChange={(e) => setLogoFile(e.target.files[0])} />
                {formData.logo && <img src={formData.logo} style={styles.previewLogo} className="mt-2 border shadow-sm" />}
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold text-secondary">Banner nền (Phong cảnh hồ cá)</label>
                <input type="file" className="form-control border-2" onChange={(e) => setBannerFile(e.target.files[0])} />
                {formData.banner && <img src={formData.banner} style={styles.previewBanner} className="mt-2 shadow-sm" />}
              </div>

              {uploading && (
                <div className="col-12 text-center text-primary fw-bold">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Đang thả cá vào hồ (Đang upload)...
                </div>
              )}
            </div>
          </div>

          <div className="card-footer bg-white border-0 text-end py-3">
            <button className="btn btn-secondary rounded-pill me-2 px-4" onClick={() => setEditing(false)}>Hủy</button>
            <button className="btn btn-primary rounded-pill px-4 shadow" onClick={handleSave}>
              <i className="bi bi-save2-fill me-2"></i>Lưu thông tin
            </button>
          </div>
        </div>
      </div>
    );
  }

  /*  DISPLAY MODE  */
  return (
    <div className="bg-light pb-5 min-vh-100">
      {/* Banner Section */}
      <div 
        style={{ 
          ...styles.banner, 
          backgroundImage: shop.banner ? `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.5)), url(${shop.banner})` : 'linear-gradient(45deg, #0077b6, #00b4d8)' 
        }}
      >
        <div className="container position-relative h-100">
           {/* Nút chỉnh sửa lơ lửng trên banner */}
           <button 
            className="btn btn-light btn-sm rounded-pill position-absolute top-0 end-0 mt-3 shadow" 
            onClick={() => setEditing(true)}
          >
            <i className="bi bi-pencil-fill me-1"></i> Thay đổi thông tin
          </button>
        </div>
      </div>

      <div className="container">
        <div className="card shadow border-0 rounded-4" style={{ marginTop: "-100px" }}>
          <div className="card-body p-4 p-md-5">
            <div className="text-center position-relative">
              {shop.logo && <img src={shop.logo} style={styles.mainLogo} className="border-4 border-white shadow" />}
              <h1 className="fw-bold text-dark mb-2 mt-2">{shop.shopName}</h1>
              <div style={styles.waterDivider}></div>
              <p className="lead text-muted mx-auto" style={{ maxWidth: '700px' }}>{shop.description}</p>
            </div>

            <div className="row mt-5 g-4">
              <div className="col-md-4">
                <div className="p-4 rounded-4 h-100 shadow-sm" style={styles.infoBox}>
                  <h6 className="text-uppercase text-primary fw-bold mb-3">Thông tin liên hệ</h6>
                  <p className="mb-2 d-flex align-items-start">
                    <i className="bi bi-person-circle me-3 text-info fs-5"></i>
                    <span><strong>Chủ:</strong> {shop.ownerName}</span>
                  </p>
                  <p className="mb-2 d-flex align-items-start">
                    <i className="bi bi-telephone-fill me-3 text-info fs-5"></i>
                    <span><strong>Hotline:</strong> {shop.phone}</span>
                  </p>
                  <p className="mb-0 d-flex align-items-start text-break">
                    <i className="bi bi-envelope-fill me-3 text-info fs-5"></i>
                    <span>{shop.email}</span>
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-4 rounded-4 h-100 shadow-sm" style={styles.infoBox}>
                  <h6 className="text-uppercase text-primary fw-bold mb-3">Thời gian & Địa chỉ</h6>
                  <p className="mb-2 d-flex align-items-start">
                    <i className="bi bi-geo-alt-fill me-3 text-danger fs-5"></i>
                    <span>{shop.address}</span>
                  </p>
                  <p className="mb-0 d-flex align-items-start">
                    <i className="bi bi-clock-fill me-3 text-warning fs-5"></i>
                    <span>{shop.workingTime || "Chưa cập nhật"}</span>
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="p-4 rounded-4 h-100 shadow-sm d-flex flex-column justify-content-center align-items-center text-center" style={styles.infoBoxSocial}>
                  <h6 className="text-uppercase text-primary fw-bold mb-3 w-100">Kết nối cộng đồng</h6>
                  {shop.facebook ? (
                    <a href={shop.facebook} target="_blank" rel="noreferrer" className="text-decoration-none d-block w-100">
                       <div className="btn btn-primary rounded-pill w-100 py-2">
                         <i className="bi bi-facebook me-2"></i> Theo dõi Fanpage
                       </div>
                    </a>
                  ) : (
                    <p className="text-muted small italic">Chưa liên kết mạng xã hội</p>
                  )}
                  {/* <div className="mt-3 d-flex gap-2 text-info fs-3">
                     <i className="bi bi-water"></i>
                     <i className="bi bi-tsunami"></i>
                     <i className="bi bi-brightness-high"></i>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/*  THEMED STYLES  */
const styles = {
  aquariumBg: {
    backgroundColor: "#e0f2f1",
    backgroundImage: "radial-gradient(circle at 50% 50%, #e0f7fa 0%, #b2ebf2 100%)",
    minHeight: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "20px"
  },
  gradientHeader: {
    background: "linear-gradient(90deg, #0077b6 0%, #00b4d8 100%)",
  },
  banner: {
    height: "350px",
    backgroundPosition: "center",
    backgroundSize: "cover",
    position: "relative",
  },
  mainLogo: {
    width: "160px",
    height: "160px",
    borderRadius: "50%",
    objectFit: "cover",
    backgroundColor: "#fff",
    padding: "5px",
  },
  waterDivider: {
    width: "60px",
    height: "4px",
    backgroundColor: "#00b4d8",
    margin: "15px auto",
    borderRadius: "2px",
  },
  infoBox: {
    backgroundColor: "#ffffff",
    borderLeft: "5px solid #00b4d8",
  },
  infoBoxSocial: {
    backgroundColor: "#f0f9ff",
    border: "1px dashed #00b4d8",
  },
  previewLogo: {
    width: "80px",
    height: "80px",
    borderRadius: "12px",
    objectFit: "cover",
  },
  previewBanner: {
    width: "100%",
    maxHeight: "120px",
    objectFit: "cover",
    borderRadius: "12px",
  },
};