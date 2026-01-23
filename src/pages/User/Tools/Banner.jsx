import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HomeBanner() {
  const navigate = useNavigate();

  const banners = [
    {
      img: "/data/banner01.jpg",
      title: "Khuyến mãi lớn",
      desc: "Giảm đến 50% hôm nay",
      button: "Mua ngay",
    },
    {
      img: "/data/banner02.jpg",
      title: "Sản phẩm mới",
      desc: "Xu hướng thủy sinh 2026",
      button: "Khám phá",
    },
    {
      img: "/data/banner03.jpg",
      title: "Ưu đãi thành viên",
      desc: "Giá tốt chỉ dành cho bạn",
      button: "Tham gia",
    },
    {
      img: "/data/banner05.jpg",
      title: "Bể thủy sinh cao cấp",
      desc: "Setup chuẩn – nhìn là mê",
      button: "Xem ngay",
    },
    {
      img: "/data/banner06.png",
      title: "Combo tiết kiệm",
      desc: "Mua combo – tiết kiệm hơn",
      button: "Xem combo",
    },
    {
      img: "/data/banner07.png",
      title: "Bán chạy nhất",
      desc: "Top sản phẩm được yêu thích",
      button: "Xem sản phẩm",
    },
  ];

  const [index, setIndex] = useState(0);

  /* ===== AUTO SLIDE ===== */
  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const prev = () =>
    setIndex((prev) => (prev - 1 + banners.length) % banners.length);
  const next = () =>
    setIndex((prev) => (prev + 1) % banners.length);

  return (
    <div style={styles.wrapper}>
      {banners.map((b, i) => (
        <div
          key={i}
          style={{
            ...styles.slide,
            opacity: i === index ? 1 : 0,
            transform:
              i === index ? "scale(1)" : "scale(1.05)",
          }}
        >
          <img src={b.img} alt="" style={styles.image} />

          {/* ===== OVERLAY ===== */}
          <div style={styles.overlay}>
            <span style={styles.badge}>
              <i className="bi bi-lightning-fill me-1"></i>
              HOT DEAL
            </span>

            <h2 style={styles.title}>{b.title}</h2>
            <p style={styles.desc}>{b.desc}</p>

            <button
              style={styles.btn}
              onClick={() => navigate("/product")}
            >
              {b.button}
              <i className="bi bi-arrow-right ms-2"></i>
            </button>
          </div>
        </div>
      ))}

      {/* ===== CONTROLS ===== */}
      <button style={{ ...styles.control, left: 20 }} onClick={prev}>
        <i className="bi bi-chevron-left"></i>
      </button>

      <button style={{ ...styles.control, right: 20 }} onClick={next}>
        <i className="bi bi-chevron-right"></i>
      </button>

      {/* ===== DOTS ===== */}
      <div style={styles.dots}>
        {banners.map((_, i) => (
          <span
            key={i}
            style={{
              ...styles.dot,
              opacity: i === index ? 1 : 0.4,
              width: i === index ? 22 : 10,
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
const styles = {
  wrapper: {
    position: "relative",
    width: "100%",
    height: "420px",
    overflow: "hidden",
  },

  slide: {
    position: "absolute",
    inset: 0,
    transition: "all 0.8s ease",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  overlay: {
    position: "absolute",
    inset: 0,
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.1))",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: "8%",
    color: "#fff",
  },

  badge: {
    display: "inline-block",
    background: "#ff5722",
    padding: "6px 14px",
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    width: "fit-content",
    marginBottom: 12,
  },

  title: {
    fontSize: "clamp(24px, 4vw, 42px)",
    fontWeight: 700,
    marginBottom: 10,
    textShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },

  desc: {
    fontSize: "clamp(14px, 2vw, 18px)",
    marginBottom: 20,
    maxWidth: 420,
  },

  btn: {
    width: "fit-content",
    padding: "12px 26px",
    background: "#ff5722",
    border: "none",
    borderRadius: 30,
    color: "#fff",
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
    boxShadow: "0 6px 18px rgba(0,0,0,0.25)",
  },

  control: {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    width: 44,
    height: 44,
    borderRadius: "50%",
    border: "none",
    background: "rgba(0,0,0,0.45)",
    color: "#fff",
    fontSize: 20,
    cursor: "pointer",
    zIndex: 2,
  },

  dots: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    gap: 8,
    zIndex: 2,
  },

  dot: {
    height: 10,
    background: "#fff",
    borderRadius: 20,
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};
