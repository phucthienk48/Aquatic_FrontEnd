import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewProductBanner() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [ratings, setRatings] = useState({});
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);

  const perSlide = 4;

  useEffect(() => {
    fetchNewestProducts();
  }, []);

  /* auto slide */
  useEffect(() => {

    if (products.length === 0) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 9000);

    return () => clearInterval(timer);

  }, [products, index]);

  const nextSlide = () => {
    const maxIndex = Math.ceil(products.length / perSlide) - 1;

    setIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    const maxIndex = Math.ceil(products.length / perSlide) - 1;

    setIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const fetchNewestProducts = async () => {
    try {

      const res = await fetch("http://localhost:5000/api/product");
      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : data.products || data.data || [];

      const newest = [...list]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 12);

      setProducts(newest);

      const ratingMap = {};

      for (const p of newest) {
        ratingMap[p._id] = await fetchRating(p._id);
      }

      setRatings(ratingMap);

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRating = async (productId) => {
    try {

      const res = await fetch(
        `http://localhost:5000/api/comment/product/${productId}`
      );

      const comments = await res.json();

      if (!Array.isArray(comments) || comments.length === 0) {
        return { avg: 0, count: 0 };
      }

      const total = comments.reduce(
        (sum, c) => sum + (c.rating || 0),
        0
      );

      return {
        avg: total / comments.length,
        count: comments.length,
      };

    } catch {
      return { avg: 0, count: 0 };
    }
  };

  const renderStars = (avg = 0) => {
    const full = Math.floor(avg);
    const half = avg - full >= 0.5;

    return [...Array(5)].map((_, i) => {
      if (i < full)
        return <i key={i} className="bi bi-star-fill text-warning"></i>;
      if (i === full && half)
        return <i key={i} className="bi bi-star-half text-warning"></i>;
      return <i key={i} className="bi bi-star text-warning"></i>;
    });
  };

  if (loading) return null;

  const slides = [];

  for (let i = 0; i < products.length; i += perSlide) {
    slides.push(products.slice(i, i + perSlide));
  }

  return (
    <div style={styles.container}>

      <div style={styles.title}>
         Sản phẩm mới nhất
      </div>

      <div style={styles.slider}>

        <button style={styles.arrowLeft} onClick={prevSlide}>
          ❮
        </button>

        <div
          style={{
            ...styles.track,
            transform: `translateX(-${index * 100}%)`,
          }}
        >
          {slides.map((group, i) => (
            <div key={i} style={styles.slide}>
              {group.map((item) => {

                const r = ratings[item._id] || { avg: 0 };

                return (
                  <div
                    key={item._id}
                    style={styles.card}
                    onClick={() => navigate(`/product/${item._id}`)}
                  >

                    <img
                      src={
                        item.images?.[0] ||
                        "https://via.placeholder.com/200"
                      }
                      alt={item.name}
                      style={styles.image}
                    />

                    <div style={styles.name}>
                      {item.name}
                    </div>

                    <div style={styles.rating}>
                      {renderStars(r.avg)}
                    </div>

                    <div style={styles.price}>
                      {item.price?.toLocaleString()} VNĐ
                    </div>

                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <button style={styles.arrowRight} onClick={nextSlide}>
          ❯
        </button>

      </div>

      <div style={styles.dots}>
        {slides.map((_, i) => (
          <div
            key={i}
            style={{
              ...styles.dot,
              background: i === index ? "#ff5722" : "#ccc",
            }}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>

    </div>
  );
}

const styles = {

  container: {
    marginBottom: 50,
  },

  title: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 15,
    color: "#ff5722",
  },

  slider: {
    position: "relative",
    overflow: "hidden",
  },

  track: {
    display: "flex",
    transition: "transform 0.5s ease",
  },

  slide: {
    minWidth: "100%",
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 20,
  },

  card: {
    background: "#fff",
    borderRadius: 12,
    padding: 12,
    textAlign: "center",
    boxShadow: "0 4px 12px rgba(0,0,0,.08)",
    cursor: "pointer",
    transition: "0.3s",
  },

  image: {
    width: "100%",
    height: 160,
    objectFit: "cover",
    borderRadius: 8,
  },

  name: {
    fontWeight: 600,
    marginTop: 8,
    fontSize: 14,
  },

  rating: {
    display: "flex",
    justifyContent: "center",
    gap: 2,
    marginTop: 4,
  },

  price: {
    color: "#e53935",
    fontWeight: 700,
    marginTop: 6,
  },

  arrowLeft: {
    position: "absolute",
    top: "40%",
    left: -10,
    zIndex: 2,
    fontSize: 30,
    background: "white",
    border: "none",
    cursor: "pointer",
  },

  arrowRight: {
    position: "absolute",
    top: "40%",
    right: -10,
    zIndex: 2,
    fontSize: 30,
    background: "white",
    border: "none",
    cursor: "pointer",
  },

  dots: {
    display: "flex",
    justifyContent: "center",
    marginTop: 15,
    gap: 8,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    cursor: "pointer",
  },

};