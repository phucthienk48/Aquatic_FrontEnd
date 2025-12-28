export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <h1>👑 Trang quản trị ADMIN</h1>
      <p>Xin chào: {user?.username}</p>
      <p>Vai trò: {user?.role}</p>
    </div>
  );
}
