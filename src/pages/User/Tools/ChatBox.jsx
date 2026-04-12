import { useState, useEffect, useRef } from "react";
import axios from "axios";

// Các câu hỏi gợi ý hiển thị sẵn
const FAQ_DATA = [
  {
    id: 1,
    question: "Cá nào dễ nuôi cho người mới?",
    answer:
      "Nếu bạn mới bắt đầu nuôi cá, mình gợi ý các dòng cá khỏe, dễ chăm sóc như: Cá Bảy Màu, Cá Sọc Ngựa, Cá Betta, Cá Neon. Chúng thích nghi tốt với nhiều loại bể và thức ăn sẵn.",
  },
  {
    id: 2,
    question: "Cách xử lý nước đục trong bể cá?",
    answer:
      "Nước đục thường do hệ vi sinh chưa ổn định hoặc thức ăn thừa. Bạn nên thay khoảng 30% nước định kỳ, sử dụng lọc và bổ sung vi sinh để cân bằng bể.",

  },
  {
    id: 3,
    question: "Shop giao hàng thế nào?",
    answer:
      "Shop giao hàng hỏa tốc trong nội thành (1-2h) và ship toàn quốc qua các đơn vị vận chuyển uy tín. Bạn có thể chọn hình thức giao nhanh hoặc giao tiết kiệm khi đặt hàng.",

  },
  {
    id: 4,
    question: "Địa chỉ shop ở đâu?",
    answer:
      "Shop có cửa hàng tại: 124/7 đường 3 tháng 2, Xuân Khánh, Ninh Kiều , Cần Thơ. Bạn có thể ghé trực tiếp để xem cá và phụ kiện hoặc đặt online để shop giao tận nơi.",
 
  },
  {
    id: 5,
    question: "Cá ăn gì?",
    answer:
      "Tùy loại cá, bạn có thể cho ăn: thức ăn viên, đông lạnh, tươi sống hoặc các loại thức ăn chuyên dụng. Mỗi ngày chỉ cho ăn 1-2 lần với lượng vừa đủ để tránh dư thừa làm nước bẩn.",
  },
  {
    id: 6,
    question: "Cách chăm cây thủy sinh dễ trồng?",
    answer:
      "Các loại cây thủy sinh dễ trồng gồm: Rong Java, Cây Ngọc Ngân, Cây Bèo Nhật. Chỉ cần ánh sáng vừa phải, thay nước định kỳ và bón thêm phân vi sinh là cây phát triển tốt.",
  },
];

// Các câu hỏi mặc định (hidden questions)
const DEFAULT_QUESTIONS = [
  { question: "hi", answer: "Shop rất vui được hỗ trợ bạn" },
  { question: "hello", answer: "Shop rất vui được hỗ trợ bạn " },
  { question: "xin chào", answer: "Shop rất vui được hỗ trợ bạn " },
  { question: "chào", answer: "Shop rất vui được hỗ trợ bạn " },
  { question: "alo", answer: "Shop rất vui được hỗ trợ bạn " },
  { question: "hey", answer: "Shop rất vui được hỗ trợ bạn " },
  { question: "cá khỏe không?", answer: "Cá ở shop luôn khỏe mạnh và được kiểm tra trước khi bán " },
  { question: "shop mở mấy giờ?", answer: "Shop mở cửa từ 8h sáng đến 8h tối tất cả các ngày trong tuần " },
  { question: "có hỗ trợ tư vấn không?", answer: "Tất nhiên rồi, shop luôn sẵn sàng tư vấn bạn về cá và phụ kiện thủy sinh " },
  { question: "giao hàng nhanh không?", answer: "Shop có giao hàng hỏa tốc trong nội thành 1-2h và ship toàn quốc " },
  { question: "có giao hàng toàn quốc không?", answer: "Có, shop giao hàng toàn quốc qua các đơn vị vận chuyển uy tín " },
  { question: "thanh toán bằng gì?", answer: "Bạn có thể thanh toán qua COD, chuyển khoản, hoặc ví điện tử " },
  { question: "cá bảy màu giá bao nhiêu?", answer: "Cá Bảy Màu hiện có giá từ 10.000đ – 15.000đ/con tùy size " },
  { question: "cá neon giá bao nhiêu?", answer: "Cá Neon hiện có giá khoảng 12.000đ/con " },
  { question: "cách chăm cá betta?", answer: "Cá Betta cần bể nhỏ 5-10l, nước 24-28°C, thay nước 30% mỗi tuần và cho ăn 1-2 lần/ngày." },
  { question: "cách thay nước bể cá?", answer: "Nên thay 20-30% nước mỗi tuần, khử Clo trước khi thêm nước mới 💧" },
  { question: "cá bệnh phải làm sao?", answer: "Khi cá có dấu hiệu bệnh, hãy cách ly và sử dụng thuốc chuyên dụng theo hướng dẫn 🩺" },
  { question: "bể cá cần phụ kiện gì?", answer: "Một bể cơ bản cần: lọc, sưởi (nếu cá nhiệt đới), đá nền, cây thủy sinh, máy sủi oxy." },
  { question: "làm sao để bể cá luôn sạch?", answer: "Thay nước định kỳ, kiểm tra lọc, loại bỏ thức ăn thừa và cân bằng vi sinh thường xuyên." },
  { question: "shop có cây thủy sinh không?", answer: "Có, shop có nhiều loại cây thủy sinh dễ trồng và trang trí bể " },
  { question: "cá ăn gì?", answer: "Tùy loại cá, thức ăn viên, đông lạnh hoặc tươi sống, cho ăn 1-2 lần/ngày." },
  { question: "cá ăn mấy lần 1 ngày?", answer: "Nên cho cá ăn 1-2 lần/ngày, lượng vừa đủ để tránh dư thừa." },
  { question: "cây thủy sinh dễ trồng?", answer: "Các loại dễ trồng: Rong Java, Cây Ngọc Ngân, Cây Bèo Nhật. Ánh sáng vừa phải, thay nước định kỳ." },
  { question: "lọc bể cá loại nào tốt?", answer: "Shop có nhiều loại lọc mini và lọc ngoài, phù hợp bể từ 5-50l." },
  { question: "nước bể cá đục?", answer: "Do thức ăn thừa hoặc vi sinh chưa ổn định. Nên thay 30% nước và bổ sung vi sinh." },
  { question: "có dịch vụ setup bể cá không?", answer: "Có, shop hỗ trợ setup bể cá theo yêu cầu và tư vấn chọn cá, cây thủy sinh." },
  { question: "shop có bán phụ kiện không?", answer: "Có, gồm lọc, máy sưởi, đá nền, trang trí bể, thức ăn cá, thuốc, etc." },
  { question: "ship bao lâu?", answer: "Nội thành 1-2h, ngoại thành 1-3 ngày tùy vị trí." },
  { question: "shop có đổi trả không?", answer: "Shop hỗ trợ đổi trả nếu sản phẩm bị hư hỏng trong quá trình vận chuyển." },
  { question: "shop có bảo hành cá không?", answer: "Cá được đảm bảo khỏe khi giao, nếu gặp sự cố hãy liên hệ shop để được hỗ trợ." },
  { question: "nhiệt độ nước bao nhiêu?", answer: "Cá nhiệt đới: 24-28°C; cá nhiệt đới lạnh: 18-22°C." },
  { question: "độ pH nước bao nhiêu?", answer: "pH lý tưởng: 6.5-7.5 tùy loại cá " },
  { question: "cá sống chung được không?", answer: "Một số loại cá có thể sống chung, tránh nuôi cá hung dữ chung bể 🐠" },
  { question: "cá betta nuôi chung được không?", answer: "Cá Betta đực nên nuôi riêng; Betta cái và các loại cá hiền có thể chung bể." },
  { question: "cách nhân giống cá?", answer: "Tùy loài, Betta có thể nhân giống bể riêng, cung cấp thức ăn sống và điều kiện nước phù hợp." },
  { question: "bể cá bao nhiêu lít là đủ?", answer: "Tối thiểu 5-10l cho cá nhỏ, 20-50l cho cá lớn hoặc bể chung." },
  { question: "cá betta sống được bao lâu?", answer: "Cá Betta thường sống 2-3 năm, nếu chăm sóc tốt có thể lâu hơn." },
  { question: "cá neon sống được bao lâu?", answer: "Cá Neon sống khoảng 5 năm trong điều kiện tốt." },
  { question: "cá bảy màu sống được bao lâu?", answer: "Cá Bảy Màu sống 1-2 năm, tuổi thọ tùy điều kiện nuôi." },
  { question: "có bán cá cảnh quý hiếm không?", answer: "Có, shop có một số loại cá cảnh độc lạ, liên hệ trực tiếp để biết chi tiết." },
  { question: "shop có nhận order online không?", answer: "Có, bạn có thể đặt online và shop sẽ giao tận nơi." },
  { question: "thời gian trả lời tư vấn?", answer: "Shop trả lời nhanh trong vòng vài phút đến 1 giờ." },
  { question: "có khuyến mãi không?", answer: "Shop thường xuyên có ưu đãi cho khách hàng thân thiết và các combo sản phẩm." },
  { question: "cách chăm cá vàng?", answer: "Cá vàng cần bể rộng 20-30l, nước 20-24°C, thay nước 1-2 lần/tuần." },
  { question: "cá cảnh ăn thức ăn đông lạnh?", answer: "Được, nhưng chỉ nên cho ăn 1-2 lần/tuần, kết hợp thức ăn viên." },
  { question: "cây thủy sinh cần ánh sáng?", answer: "Ánh sáng vừa phải, 8-10 giờ/ngày, tránh nắng trực tiếp." },
  { question: "shop có bán thức ăn cá không?", answer: "Có, nhiều loại thức ăn viên, đông lạnh và tươi sống " },
  { question: "cá có bị bệnh không?", answer: "Cá khỏe khi giao, nhưng nếu bệnh hãy liên hệ shop để được tư vấn thuốc." },
  { question: "cách tẩy rong rêu trong bể?", answer: "Dùng dụng cụ cạo rêu và kiểm soát ánh sáng, bổ sung vi sinh cân bằng bể." },
  { question: "shop có tư vấn online không?", answer: "Có, bạn có thể hỏi trực tiếp qua chatbot hoặc hotline của shop." },
  { question: "shop có hỗ trợ setup cây thủy sinh?", answer: "Có, shop tư vấn chọn cây và setup bể để cây phát triển tốt " },
  { question: "cá cảnh cần oxy không?", answer: "Cần, nên có máy sủi hoặc lọc tạo oxy để cá hít thở tốt " },
  { question: "nước bể cá bao lâu thay một lần?", answer: "Thay 20-30% mỗi tuần, kiểm tra vi sinh định kỳ." },
  { question: "shop có nhận tư vấn chọn bể không?", answer: "Có, shop hướng dẫn chọn bể phù hợp với số lượng và loại cá bạn muốn nuôi." },
  { question: "có bán combo cá + phụ kiện không?", answer: "Có, shop có nhiều combo tiết kiệm cho người mới bắt đầu." },
  { question: "có các loại cá nào?", answer: "Shop có nhiều loại cá như Bảy Màu, Neon, Betta, Alpha, Cá Vàng, và một số cá cảnh quý hiếm." },
  { question: "có các loại thuốc nào?", answer: "Shop cung cấp thuốc chữa bệnh, vitamin, vi sinh cho bể cá, thuốc trị nấm, ký sinh trùng, đều có sẵn." },
  { question: "có dụng cụ nào?", answer: "Có các dụng cụ: lọc nước, máy sưởi, máy sủi oxy, lưới, chổi dọn bể, đá nền và trang trí bể." },
  { question: "giá cá betta bao nhiêu?", answer: "Cá Betta hiện có giá từ 50.000đ – 150.000đ tùy loại và kích thước." },
  { question: "giá cá alpha bao nhiêu?", answer: "Cá Alpha giá khoảng 200.000đ – 500.000đ/con tùy size và độ hiếm." },
  { question: "hướng dẫn tạo tài khoản?", answer: "Bạn vào trang đăng ký, nhập email, mật khẩu, sau đó xác nhận qua email để kích hoạt tài khoản." },
  { question: "cách đặt hàng online?", answer: "Bạn chọn sản phẩm, thêm vào giỏ hàng, điền thông tin giao hàng và chọn hình thức thanh toán." },
  { question: "shop có bán combo không?", answer: "Có, shop có nhiều combo cá + phụ kiện giúp tiết kiệm chi phí." },
  { question: "cách chăm cá neon?", answer: "Cá Neon cần bể 10-20l, nước 24-26°C, ánh sáng vừa phải và cho ăn 1-2 lần/ngày." },
  { question: "cách chăm cá bảy màu?", answer: "Cá Bảy Màu dễ nuôi, bể 5-10l, thay nước 30% mỗi tuần và cho ăn thức ăn viên." },
  { question: "cá betta sống được bao lâu?", answer: "Cá Betta sống 2-3 năm nếu chăm sóc tốt." },
  { question: "cá alpha sống được bao lâu?", answer: "Cá Alpha thường sống 3-5 năm, tùy điều kiện chăm sóc." },
  { question: "shop có hỗ trợ tư vấn online không?", answer: "Có, bạn có thể hỏi trực tiếp qua chatbot hoặc hotline của shop." },
  { question: "nước bể cá bao lâu thay một lần?", answer: "Nên thay 20-30% nước mỗi tuần để bể luôn sạch." },
  { question: "có cây thủy sinh dễ trồng không?", answer: "Có, shop có Rong Java, Cây Ngọc Ngân, Cây Bèo Nhật và hướng dẫn cách trồng." },
  { question: "cá bệnh phải làm sao?", answer: "Cách ly cá bệnh và dùng thuốc chuyên dụng theo hướng dẫn. Nếu cần, shop tư vấn trực tiếp." },
  { question: "shop giao hàng nhanh không?", answer: "Trong nội thành 1-2h, ngoại thành 1-3 ngày tùy vị trí." },
  { question: "shop có hỗ trợ đổi trả không?", answer: "Có, nếu sản phẩm hư hỏng trong quá trình vận chuyển, shop sẽ hỗ trợ đổi trả." },
  { question: "cá ăn gì?", answer: "Tùy loại cá: thức ăn viên, đông lạnh hoặc tươi sống, cho ăn 1-2 lần/ngày." },
  { question: "shop mở mấy giờ?", answer: "Shop mở cửa từ 8h sáng đến 8h tối tất cả các ngày trong tuần." },
  { question: "shop có cửa hàng không?", answer: "Có, shop có cửa hàng tại 124/7 đường 3 tháng 2, Ninh Kiều, Cần Thơ." },
  { question: "cách chăm cây thủy sinh?", answer: "Cây thủy sinh cần ánh sáng vừa phải, thay nước định kỳ và bón thêm phân vi sinh." },
  { question: "shop có bán đá nền không?", answer: "Có, shop cung cấp đá nền, sỏi trang trí, và phụ kiện khác cho bể cá." },
  { question: "cá bảy màu sống chung được không?", answer: "Có, cá Bảy Màu hiền, có thể nuôi chung với cá Neon hoặc cá hiền khác." },
  { question: "cá alpha sống chung được không?", answer: "Cá Alpha hung dữ, nên nuôi riêng hoặc theo bể lớn với cá tương thích." },
  { question: "cá betta sống chung được không?", answer: "Cá Betta đực nên nuôi riêng, Betta cái và các cá hiền khác có thể chung bể." },
  { question: "có loại cá nào cho người mới?", answer: "Người mới nên nuôi cá dễ chăm như: Cá Bảy Màu, Cá Neon, Cá Betta, Cá Vàng." },
  { question: "cách nuôi cá alpha?", answer: "Cá Alpha cần bể rộng 30-50l, nước 24-26°C, ánh sáng vừa phải, nuôi 1-2 con/bể hoặc nuôi riêng. Cho ăn thức ăn viên và đông lạnh 1-2 lần/ngày." },
  { question: "cách nuôi cá betta?", answer: "Cá Betta đực nuôi riêng trong bể 5-10l, Betta cái có thể nuôi nhóm nhỏ. Nước 24-28°C, thay 20-30% nước mỗi tuần, cho ăn 1-2 lần/ngày." },
  { question: "cách tạo tài khoản?", answer: "Bạn vào trang đăng ký, nhập email, mật khẩu và xác nhận email để kích hoạt tài khoản." },
  { question: "hướng dẫn tạo tài khoản", answer: "Bạn vào trang đăng ký, điền đầy đủ thông tin, xác nhận email và đăng nhập để sử dụng." },
  { question: "cách đăng ký tài khoản?", answer: "Truy cập trang đăng ký, điền email và mật khẩu, sau đó kích hoạt tài khoản qua email." },
  { question: "làm sao để tạo tài khoản?", answer: "Vào trang đăng ký, nhập email và mật khẩu, nhấn đăng ký và kiểm tra email để kích hoạt." },
  { question: "cách lập tài khoản?", answer: "Điền thông tin email, mật khẩu trên trang đăng ký và xác nhận email để hoàn tất." }
];

function checkDefaultQuestion(text) {
  if (!text) return null;
  const lowerText = text.toLowerCase().trim();

  const found = DEFAULT_QUESTIONS.find(
    (item) => item.question.toLowerCase() === lowerText
  );

  if (found) return found.answer; // trả về câu trả lời tương ứng
  return null; 
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      role: "bot",
      text:
        "Xin chào! 👋 Tôi là trợ lý ảo Cá Cảnh AI. Bạn cần tìm sản phẩm hay kiến thức nuôi cá ạ?",
      isFirst: true,
    },
  ]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Scroll xuống khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chat, loading, isOpen]);

  // Xử lý khi click FAQ
  const handleQuickReply = (faq) => {
    setChat((prev) => [...prev, { role: "user", text: faq.question }]);
    setLoading(true);
    setTimeout(() => {
      setChat((prev) => [
        ...prev,
        { role: "bot", text: faq.answer, products: faq.products },
      ]);
      setLoading(false);
    }, 600);
  };

  // Hàm gửi tin nhắn
  const sendMessage = async () => {
    if (!message.trim()) return;

    const userQuery = message.trim();
    setChat((prev) => [...prev, { role: "user", text: userQuery }]);
    setMessage("");

    // Kiểm tra câu hỏi mặc định
    const defaultReply = checkDefaultQuestion(userQuery);
    if (defaultReply) {
      setChat((prev) => [...prev, { role: "bot", text: defaultReply }]);
      return;
    }

    setLoading(true);

    try {
      // Gọi API Chat của backend
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: userQuery,
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      const replyText = res.data.reply;

      if (replyText) {
        setChat((prev) => [
          ...prev,
          { role: "bot", text: replyText },
        ]);
      } else {
        setChat((prev) => [
          ...prev,
          { role: "bot", text: "Xin lỗi, tôi chưa nhận được câu trả lời từ AI." },
        ]);
      }
    } catch (err) {
      console.error("Lỗi kết nối API:", err);
      setChat((prev) => [
        ...prev,
        {
          role: "bot",
          text:
            "Kết nối máy chủ thất bại. Bạn vui lòng thử lại sau nhé! 🌊",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.widgetWrapper}>
      {isOpen && (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={styles.statusDot}></div>
              <div>
                <div style={{ fontWeight: "600", fontSize: "14px" }}>Cá Cảnh AI</div>
                <div style={{ fontSize: "11px", opacity: 0.8 }}>Online</div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
              ✕
            </button>
          </div>

          <div style={styles.chatBox} ref={scrollRef}>
            {chat.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageRow,
                  justifyContent:
                    msg.role === "user" ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.bubble,
                    ...(msg.role === "user" ? styles.userBubble : styles.botBubble),
                  }}
                >
                  <div style={{ whiteSpace: "pre-wrap" }}>{msg.text}</div>

                  {/* Gợi ý FAQ */}
                  {msg.isFirst && (
                    <div style={styles.suggestionContainer}>
                      {FAQ_DATA.map((faq) => (
                        <button
                          key={faq.id}
                          onClick={() => handleQuickReply(faq)}
                          style={styles.suggestionBtn}
                        >
                          {faq.question}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sản phẩm gợi ý */}
                  {msg.products && msg.products.length > 0 && (
                    <div style={styles.productList}>
                      <div
                        style={{
                          fontSize: "11px",
                          marginBottom: "5px",
                          fontWeight: "bold",
                        }}
                      >
                        Sản phẩm gợi ý:
                      </div>
                      {msg.products.map((p, idx) => (
                        <div key={idx} style={styles.productCard}>
                          <span style={{ fontSize: "18px" }}>🛒</span>
                          <div style={{ flex: 1 }}>
                            <div style={styles.pName}>{p.name}</div>
                            <div style={styles.pPrice}>
                              {Number(p.price).toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div style={styles.loader}>Đang tìm kiếm dữ liệu...</div>
            )}
          </div>

          <div style={styles.inputArea}>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Nhập tên cá hoặc câu hỏi..."
              style={styles.input}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} style={styles.sendButton}>
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        style={styles.launcher}
        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        onClick={() => setIsOpen(!isOpen)}
      >
        <i
          className={`bi ${isOpen ? "bi-x-lg" : "bi-chat-dots-fill"}`}
          style={styles.icon}
        ></i>
        <span style={styles.label}>Chat AI</span>
      </button>
    </div>
  );
}


const styles = {
  widgetWrapper: { position: "fixed", bottom: "20px", right: "20px", zIndex: 1000, fontFamily: "Arial, sans-serif" },
  launcher: { width: "60px", height: "60px", borderRadius: "50%", backgroundColor: "#0084ff", color: "white", border: "none", cursor: "pointer", fontSize: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" },
  chatWindow: { position: "absolute", bottom: "80px", right: "0", width: "350px", height: "520px", backgroundColor: "white", borderRadius: "15px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)", display: "flex", flexDirection: "column", overflow: "hidden" },
  header: { backgroundColor: "#0084ff", color: "white", padding: "15px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  statusDot: { width: "8px", height: "8px", backgroundColor: "#4ade80", borderRadius: "50%" },
  closeBtn: { background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px" },
  chatBox: { flex: 1, padding: "15px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#f8f9fa" },
  messageRow: { display: "flex", width: "100%" },
  bubble: { padding: "10px 14px", borderRadius: "18px", fontSize: "14px", maxWidth: "85%", lineHeight: "1.4" },
  userBubble: { backgroundColor: "#0084ff", color: "white", borderBottomRightRadius: "4px" },
  botBubble: { backgroundColor: "#e4e6eb", color: "#050505", borderBottomLeftRadius: "4px" },
  suggestionContainer: { display: "flex", flexWrap: "wrap", gap: "8px", marginTop: "12px" },
  suggestionBtn: { backgroundColor: "white", border: "1px solid #0084ff", color: "#0084ff", padding: "6px 12px", borderRadius: "15px", fontSize: "12px", cursor: "pointer" },
  productList: { marginTop: "10px", display: "flex", flexDirection: "column", gap: "5px" },
  productCard: { backgroundColor: "white", padding: "8px", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", border: "1px solid #eee" },
  pName: { fontSize: "12px", fontWeight: "bold" },
  pPrice: { fontSize: "11px", color: "#e11d48" },
  inputArea: { padding: "10px", borderTop: "1px solid #eee", display: "flex", gap: "5px" },
  input: { flex: 1, border: "1px solid #ddd", borderRadius: "20px", padding: "8px 15px", outline: "none" },
  sendButton: { border: "none", background: "none", color: "#0084ff", fontSize: "20px", cursor: "pointer" },
  loader: { fontSize: "12px", color: "#888", fontStyle: "italic", marginLeft: "15px" },
  launcher: {
  width: "75px",
  height: "75px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #0064d2, #00a6ff)",
  color: "#fff",
  border: "none",
  cursor: "pointer",
  boxShadow: "0 8px 20px rgba(0,0,0,0.25)",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: "2px",
  transition: "all 0.3s ease",
},

icon: {
  fontSize: "22px",
},

label: {
  fontSize: "11px",
  fontWeight: "500",
},
};