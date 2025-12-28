export default function Hello() {
  return (
    <div style={styles.container}>
      <h1>Hello React 👋</h1>
      <p>Nếu bạn thấy trang này thì React đang hoạt động bình thường.</p>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "70vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "20px",
  },
};
