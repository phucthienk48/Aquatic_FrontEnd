// src/pages/user/FishKnowledge.jsx
import { useState } from "react";

const knowledgeData = [
  {
    id: 1,
    title: "Cách chăm sóc cá Betta đúng cách",
    fishType: "Betta",
    level: "Cơ bản",
    content:
      "Cá Betta cần nước sạch, nhiệt độ 26–28°C, thay nước 2–3 lần/tuần và tránh nuôi chung với cá hung dữ.",
  },
  {
    id: 2,
    title: "Phòng bệnh nấm cho cá cảnh",
    fishType: "Tất cả",
    level: "Trung bình",
    content:
      "Bệnh nấm thường xuất hiện khi nước bẩn. Cần thay nước định kỳ và sử dụng thuốc chuyên dụng.",
  },
  {
    id: 3,
    title: "Thiết lập hồ cá thủy sinh",
    fishType: "Thủy sinh",
    level: "Nâng cao",
    content:
      "Hồ thủy sinh cần hệ thống lọc, đèn, nền và CO2 phù hợp để duy trì hệ sinh thái ổn định.",
  },
];

export default function FishKnowledge() {
  const [filter, setFilter] = useState("Tất cả");

  const filteredData =
    filter === "Tất cả"
      ? knowledgeData
      : knowledgeData.filter((item) => item.fishType === filter);

  return (
    <div className="knowledge-page">
      <h1 className="mb-4">📘 Kiến thức nuôi cá</h1>

      {/* FILTER */}
      <div className="mb-3">
        <select
          className="form-select w-25"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>Tất cả</option>
          <option>Betta</option>
          <option>Thủy sinh</option>
        </select>
      </div>

      {/* LIST */}
      <div className="row">
        {filteredData.map((item) => (
          <div key={item.id} className="col-md-4 mb-4">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <h5 className="card-title">{item.title}</h5>
                <span className="badge bg-info me-2">{item.fishType}</span>
                <span className="badge bg-secondary">{item.level}</span>
                <p className="card-text mt-3">{item.content}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
