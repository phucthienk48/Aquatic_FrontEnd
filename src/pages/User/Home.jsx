
import ListProductHome from "../User/components/ListProductHome"
import Hello from "./Hello"
import Banner from "./Tools/Banner"
import BannerKnowledge from "./Tools/BannerKnowledge";
import BannerNewProducts from "../User/components/BannerNewProducts";

function App() {
  return (
    <>
      {/* <Header /> */}
      <main style={{ minHeight: "70vh", padding: "20px" }}>
        <Banner />
        {/* <BannerNewProducts /> */}
        <ListProductHome />
        <BannerKnowledge />

        
       
      </main>
      
    </>
  );
}

export default App;
