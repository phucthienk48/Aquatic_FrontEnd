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

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:5000/api/orders";

export default function AdminReport() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [orders, setOrders] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);

  // Chỉ admin
  if (!user || user.role !== "admin") {
    return <Navigate to="/" />;
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const res = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
    setLoading(false);
  };

  /* ============================
     THỐNG KÊ TỔNG
  ============================ */
  const statistics = {
    totalOrders: orders.length,
    completedOrders: 0,
    canceledOrders: 0,
    totalRevenue: 0,
  };

  orders.forEach((o) => {
    if (o.status === "hoàn thành") {
      statistics.completedOrders++;
      statistics.totalRevenue += o.totalPrice;
    }
    if (o.status === "đã hủy") {
      statistics.canceledOrders++;
    }
  });

  /* ============================
     LỌC THEO THÁNG / NĂM
     (CHỈ ĐƠN HOÀN THÀNH)
  ============================ */
  const filteredOrders = orders.filter((o) => {
    if (o.status !== "hoàn thành") return false;
    const d = new Date(o.createdAt);
    const matchYear = d.getFullYear() === Number(year);
    const matchMonth = month ? d.getMonth() + 1 === Number(month) : true;
    return matchYear && matchMonth;
  });

  /* ============================
     THỐNG KÊ THEO SẢN PHẨM
     (ĐỒNG BỘ AdminOrder)
  ============================ */
  let filteredRevenue = 0;
  const revenueByDate = {};
  const productStats = {};

  filteredOrders.forEach((order) => {
    filteredRevenue += order.totalPrice;

    const date = new Date(order.createdAt).toLocaleDateString("vi-VN");
    revenueByDate[date] = (revenueByDate[date] || 0) + order.totalPrice;

    order.items?.forEach((item) => {
      const productId =
        item.product?._id || item.productId || item.name;

      const productName =
        item.product?.name || item.name || "Sản phẩm không tên";

      if (!productStats[productId]) {
        productStats[productId] = {
          name: productName,
          quantity: 0,
          revenue: 0,
        };
      }

      productStats[productId].quantity += item.quantity;
      productStats[productId].revenue += item.price * item.quantity;
    });
  });

  /* ============================
     BIỂU ĐỒ DOANH THU THEO NGÀY
  ============================ */
  const sortedDates = Object.keys(revenueByDate).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const chartData = {
    labels: sortedDates,
    datasets: [
      {
        label: "Doanh thu (VNĐ)",
        data: sortedDates.map((d) => revenueByDate[d]),
        backgroundColor: "#38bdf8",
      },
    ],
  };

  /*  XUẤT EXCEL THEO SẢN PHẨM  */
    const revenueByDay = {};
    const revenueByMonth = {};
    const revenueByYear = {};

    filteredOrders.forEach((order) => {
    const d = new Date(order.createdAt);

    const day = d.toLocaleDateString("vi-VN");
    const month = `${d.getMonth() + 1}/${d.getFullYear()}`;
    const year = d.getFullYear();

    revenueByDay[day] = (revenueByDay[day] || 0) + order.totalPrice;
    revenueByMonth[month] = (revenueByMonth[month] || 0) + order.totalPrice;
    revenueByYear[year] = (revenueByYear[year] || 0) + order.totalPrice;
    });
    const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    /* ===== SHEET 1: THEO SẢN PHẨM ===== */
    const wsProduct = XLSX.utils.json_to_sheet(
        Object.values(productStats).map((p) => ({
        "Tên sản phẩm": p.name,
        "Số lượng bán": p.quantity,
        "Doanh thu": p.revenue,
        }))
    );
    XLSX.utils.book_append_sheet(wb, wsProduct, "TheoSanPham");

    /* ===== SHEET 2: THEO NGÀY ===== */
    const wsDay = XLSX.utils.json_to_sheet(
        Object.entries(revenueByDay).map(([day, revenue]) => ({
        "Ngày": day,
        "Doanh thu": revenue,
        }))
    );
    XLSX.utils.book_append_sheet(wb, wsDay, "TheoNgay");

    /* ===== SHEET 3: THEO THÁNG ===== */
    const wsMonth = XLSX.utils.json_to_sheet(
        Object.entries(revenueByMonth).map(([month, revenue]) => ({
        "Tháng": month,
        "Doanh thu": revenue,
        }))
    );
    XLSX.utils.book_append_sheet(wb, wsMonth, "TheoThang");

    /* ===== SHEET 4: THEO NĂM ===== */
    const wsYear = XLSX.utils.json_to_sheet(
        Object.entries(revenueByYear).map(([year, revenue]) => ({
        "Năm": year,
        "Doanh thu": revenue,
        }))
    );
    XLSX.utils.book_append_sheet(wb, wsYear, "TheoNam");

    /* ===== XUẤT FILE ===== */
    const buffer = XLSX.write(wb, {
        bookType: "xlsx",
        type: "array",
    });

    saveAs(
        new Blob([buffer]),
        "bao-cao-doanh-thu-chi-tiet.xlsx"
    );
    };


  if (loading) return <p>Đang tải báo cáo...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>
        <i className="bi bi-bar-chart-fill me-2"></i>
        BÁO CÁO THỐNG KÊ
      </h2>

      {/* ===== TỔNG QUAN ===== */}
      <div style={styles.statGrid}>
        <StatCard
          icon="bi-receipt"
          title="Tổng đơn"
          value={statistics.totalOrders}
        />
        <StatCard
          icon="bi-cash-stack"
          title="Tổng doanh thu"
          value={statistics.totalRevenue.toLocaleString() + " VNĐ"}
        />
        <StatCard
          icon="bi-check-circle"
          title="Hoàn thành"
          value={statistics.completedOrders}
        />
        <StatCard
          icon="bi-x-circle"
          title="Đã hủy"
          value={statistics.canceledOrders}
        />
      </div>

      {/* ===== BỘ LỌC ===== */}
      <div style={{ margin: "16px 0" }}>
        <select value={month} onChange={(e) => setMonth(e.target.value)}>
          <option value="">-- Tất cả tháng --</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              Tháng {i + 1}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ marginLeft: 12, width: 100 }}
        />

        <button
          onClick={exportExcel}
          style={{ marginLeft: 12 }}
        >
          <i className="bi bi-file-earmark-excel me-1"></i>
          Excel
        </button>
      </div>

      {/* ===== DOANH THU ===== */}
      <h3>
        Tổng doanh thu theo bộ lọc:{" "}
        {filteredRevenue.toLocaleString()} VNĐ
      </h3>

      {/* ===== BIỂU ĐỒ ===== */}
      <div style={{ maxWidth: 800 }}>
        <Bar data={chartData} />
      </div>

      {/* ===== THỐNG KÊ THEO SẢN PHẨM ===== */}
      <h3 style={{ marginTop: 32 }}>
        <i className="bi bi-box-seam me-2"></i>
        Thống kê theo sản phẩm
      </h3>

      <table border="1" cellPadding="10" width="100%">
        <thead>
          <tr>
            <th>STT</th>
            <th>Sản phẩm</th>
            <th>Số lượng bán</th>
            <th>Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(productStats)
            .sort((a, b) => b.revenue - a.revenue)
            .map((p, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>{p.revenue.toLocaleString()} VNĐ</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== CARD ===== */
const StatCard = ({ icon, title, value }) => (
  <div style={styles.statCard}>
    <i className={`bi ${icon}`} style={{ fontSize: 22 }}></i>
    <p style={styles.statTitle}>{title}</p>
    <h3>{value}</h3>
  </div>
);

/* ===== STYLE ===== */
const styles = {
  statGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 16,
    marginBottom: 24,
  },
  statCard: {
    background: "#f8fafc",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    border: "1px solid #e5e7eb",
  },
  statTitle: {
    color: "#64748b",
    marginTop: 6,
  },
};
