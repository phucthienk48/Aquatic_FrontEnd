// import Header from "../../components/Header";
// import Footer from "../../components/Footer";
import Product from "./Product"
import Hello from "./Hello"
import Banner from "./Tools/Banner"
import BannerKnowledge from "./Tools/BannerKnowledge";

function App() {
  return (
    <>
      {/* <Header /> */}
      <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Banner />
        <Product />
        <BannerKnowledge />
        {/* <Hello /> */}
      </main>
      {/* <Footer /> */}
    </>
  );
}

export default App;
