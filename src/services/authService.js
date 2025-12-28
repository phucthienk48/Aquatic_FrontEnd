import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const login = async (email, password) => {
  const res = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  // lưu để dùng cho demo
  localStorage.setItem("user", JSON.stringify(res.data.user));
  localStorage.setItem("token", res.data.accessToken);

  return res.data;
};
