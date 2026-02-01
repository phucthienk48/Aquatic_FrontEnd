// import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth";

// export const login = async (email, password) => {
//   const res = await axios.post(`${API_URL}/login`, {
//     email,
//     password,
//   });

//   // lưu để dùng cho demo
//   localStorage.setItem("user", JSON.stringify(res.data.user));
//   localStorage.setItem("token", res.data.accessToken);

//   return res.data;
// };

export const login = async (email, password) => {
  console.log("LOGIN FUNCTION ĐÃ CHẠY");
  const res = await axios.post(`${API_URL}/login`, {
    email,
    password,
  });

  const user = res.data.user;

  localStorage.setItem(
    "user",
    JSON.stringify({
      id: result.user._id || result.user.id,
      username: result.user.username,
      email: result.user.email,
      role: result.user.role,
      avatar: result.user.avatar || "",
      phone: result.user.phone || "",
      address: result.user.address || "",
      password: result.user.password, // giữ nguyên nếu backend trả
    })
  );


  localStorage.setItem("token", res.data.accessToken);

  return res.data;
};
