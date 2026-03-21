import { useEffect, useState } from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_URL = "http://localhost:5000/api/orders";

export default function AdminReport() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  if (!user || user.role !== "admin") return <Navigate to="/" />;

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  // Tính toán thống kê tổng quát
  const stats = orders.reduce((acc, o) => {
    acc.total++;
    if (o.status === "hoàn thành") {
      acc.completed++;
      acc.revenue += o.totalPrice;
    } else if (o.status === "đã hủy") {
      acc.canceled++;
    }
    return acc;
  }, { total: 0, completed: 0, canceled: 0, revenue: 0 });

  // Lọc dữ liệu theo thời gian
  const filteredOrders = orders.filter((o) => {
    if (o.status !== "hoàn thành") return false;
    const d = new Date(o.createdAt);
    return d.getFullYear() === Number(year) && (month ? d.getMonth() + 1 === Number(month) : true);
  });

  // Thống kê chi tiết theo bộ lọc
  let filteredRevenue = 0;
  const revenueByDate = {};
  const productStats = {};

  filteredOrders.forEach((order) => {
    filteredRevenue += order.totalPrice;
    const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
    revenueByDate[date] = (revenueByDate[date] || 0) + order.totalPrice;

    order.items?.forEach((item) => {
      const pId = item.product?._id || item.productId || item.name;
      if (!productStats[pId]) productStats[pId] = { name: item.name, quantity: 0, revenue: 0 };
      productStats[pId].quantity += item.quantity;
      productStats[pId].revenue += item.price * item.quantity;
    });
  });

  const chartData = {
    labels: Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b)),
    datasets: [{
      label: "Doanh thu (VNĐ)",
      data: Object.keys(revenueByDate).sort((a, b) => new Date(a) - new Date(b)).map(d => revenueByDate[d]),
      backgroundColor: "rgba(10, 147, 150, 0.7)",
      borderColor: "#0a9396",
      borderWidth: 1,
      borderRadius: 8,
    }],
  };

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(Object.values(productStats).map(p => ({
      "Tên sản phẩm": p.name, "Số lượng bán": p.quantity, "Doanh thu": p.revenue
    })));
    XLSX.utils.book_append_sheet(wb, ws, "Doanh Thu");
    const buffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buffer]), `bao-cao-${month || 'nam'}-${year}.xlsx`);
  };

  if (loading) return <div style={styles.center}><div className="spinner-border text-primary"></div></div>;

  return (
    <div style={styles.container}>
      {/* HEADER SECTION */}
      <div style={styles.header}>
        <div>
          <h2 style={styles.pageTitle}><i className="bi bi-graph-up-arrow me-2"></i> BÁO CÁO THỐNG KÊ</h2>
          <p style={{ color: "#666", margin: 0 }}>Theo dõi sức khỏe kinh doanh của cửa hàng thủy sinh</p>
        </div>
        <button onClick={exportExcel} style={styles.excelBtn}>
          <i className="bi bi-file-earmark-spreadsheet me-2"></i> Xuất Báo Cáo Excel
        </button>
      </div>

      {/* STATS GRID */}
      <div style={styles.statGrid}>
        <StatCard title="Tổng Đơn Hàng" value={stats.total} icon="bi-bag-check" color="#005f73" />
        <StatCard title="Doanh Thu Tổng" value={stats.revenue.toLocaleString() + "đ"} icon="bi-cash-coin" color="#0a9396" />
        <StatCard title="Hoàn Thành" value={stats.completed} icon="bi-check2-circle" color="#27ae60" />
        <StatCard title="Đơn Hủy" value={stats.canceled} icon="bi-trash3" color="#ae2012" />
      </div>

      {/* FILTER & CHART SECTION */}
      <div style={styles.mainContent}>
        <div style={styles.chartCard}>
          <div style={styles.filterBar}>
            <h5 style={{ margin: 0, fontWeight: 700 }}><i className="bi bi-calendar3 me-2"></i>Biểu đồ doanh thu</h5>
            <div style={{ display: 'flex', gap: 10 }}>
              <select style={styles.select} value={month} onChange={(e) => setMonth(e.target.value)}>
                <option value="">Tất cả tháng</option>
                {[...Array(12)].map((_, i) => <option key={i} value={i+1}>Tháng {i+1}</option>)}
              </select>
              <input type="number" style={styles.inputYear} value={year} onChange={(e) => setYear(e.target.value)} />
            </div>
          </div>
          <div style={{ height: 350 }}>
            <Bar data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
          <div style={styles.filteredRevenue}>
            Tổng doanh thu kỳ này: <span>{filteredRevenue.toLocaleString()} VNĐ</span>
          </div>
        </div>

        {/* TOP PRODUCTS TABLE */}
        <div style={styles.tableCard}>
          <h5 style={styles.cardTitle}><i className="bi bi-trophy me-2"></i>Sản phẩm bán chạy nhất</h5>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Mặt hàng</th>
                  <th className="text-center">Số lượng</th>
                  <th className="text-end">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                {Object.values(productStats)
                  .sort((a, b) => b.revenue - a.revenue)
                  .map((p, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 500 }}>{p.name}</td>
                      <td className="text-center">{p.quantity}</td>
                      <td className="text-end" style={{ color: "#d90429", fontWeight: 600 }}>
                        {p.revenue.toLocaleString()}đ
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* COMPONENT CON STAT CARD */
function StatCard({ title, value, icon, color }) {
  return (
    <div style={styles.card}>
      <div style={{ ...styles.iconCircle, backgroundColor: color + "20", color: color }}>
        <i className={`bi ${icon}`}></i>
      </div>
      <div>
        <div style={styles.cardLabel}>{title}</div>
        <div style={{ ...styles.cardValue, color: color }}>{value}</div>
      </div>
    </div>
  );
}

/* STYLE SYSTEM */
const styles = {
  container: {
    padding: "30px",
    background: "linear-gradient(135deg, #eef2f7, #f8fafc)",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
  },

  /* HEADER */
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "25px",
    flexWrap: "wrap",
    gap: "10px",
  },

  pageTitle: {
    fontWeight: 800,
    color: "#001219",
    fontSize: "24px",
    letterSpacing: "0.5px",
  },

  excelBtn: {
    background: "linear-gradient(135deg, #0a9396, #005f73)",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "12px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "0.3s",
  },

  /* GRID STATS */
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "18px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.06)",
    transition: "0.3s",
  },

  iconCircle: {
    width: "55px",
    height: "55px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "26px",
  },

  cardLabel: {
    fontSize: "13px",
    color: "#888",
    fontWeight: 500,
  },

  cardValue: {
    fontSize: "1.4rem",
    fontWeight: 800,
  },

  /* MAIN LAYOUT */
  mainContent: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr",
    gap: "25px",
  },

  chartCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "22px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.06)",
  },

  filterBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
    gap: "10px",
  },

  select: {
    padding: "8px 12px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    outline: "none",
    background: "#f9fafb",
    cursor: "pointer",
  },

  inputYear: {
    width: "90px",
    padding: "8px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    textAlign: "center",
    background: "#f9fafb",
  },

  filteredRevenue: {
    marginTop: "20px",
    paddingTop: "15px",
    borderTop: "1px dashed #ddd",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#0a9396",
  },

  /* TABLE */
  tableCard: {
    background: "#fff",
    padding: "25px",
    borderRadius: "22px",
    boxShadow: "0 6px 25px rgba(0,0,0,0.06)",
  },

  cardTitle: {
    fontWeight: 700,
    marginBottom: "15px",
    color: "#001219",
    fontSize: "16px",
  },

  tableWrapper: {
    maxHeight: "400px",
    overflowY: "auto",
    borderRadius: "10px",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },

  thead: {
    position: "sticky",
    top: 0,
    backgroundColor: "#f1f5f9",
    zIndex: 1,
  },

  th: {
    padding: "10px",
    fontSize: "13px",
    textAlign: "left",
    color: "#555",
  },

  td: {
    padding: "10px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
  },
};