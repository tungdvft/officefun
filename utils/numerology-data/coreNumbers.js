const coreNumbers = {
  1: {
    theme: "Người tiên phong",
    symbol: "♈",
    element: "Lửa",
    strengths: ["Độc lập", "Sáng tạo", "Lãnh đạo", "Quyết đoán"],
    weaknesses: ["Ích kỷ", "Nóng nảy", "Thiếu kiên nhẫn", "Cô độc"],
    careers: ["Doanh nhân", "Nhà sáng tạo", "Lãnh đạo", "Nhà phát minh"],
    advice: "Học cách hợp tác và lắng nghe người khác",
    purpose: "Khởi đầu và dẫn dắt những điều mới mẻ",
    love: "Cần sự tự do nhưng cũng phải học cách gắn kết",
    health: "Dễ gặp vấn đề về đầu và năng lượng dư thừa"
  },
  2: {
    theme: "Người hòa giải",
    symbol: "♉",
    element: "Nước",
    strengths: ["Nhạy cảm", "Hợp tác", "Dịu dàng", "Trực giác"],
    weaknesses: ["Do dự", "Dễ bị tổn thương", "Phụ thuộc", "Nhút nhát"],
    careers: ["Nhà ngoại giao", "Tư vấn viên", "Giáo viên", "Nhân viên xã hội"],
    advice: "Tự tin vào bản thân và đặt ranh giới rõ ràng",
    purpose: "Mang lại hòa bình và sự cân bằng",
    love: "Rất lãng mạn nhưng cần tránh phụ thuộc quá mức",
    health: "Dễ bị ảnh hưởng bởi căng thẳng tinh thần"
  },
  3: {
    theme: "Người nghệ sĩ",
    symbol: "♊",
    element: "Khí",
    strengths: ["Vui vẻ", "Sáng tạo", "Giao tiếp", "Lạc quan"],
    weaknesses: ["Hời hợt", "Thiếu tập trung", "Tự cao", "Bốc đồng"],
    careers: ["Nghệ sĩ", "Nhà văn", "Diễn viên", "Marketing"],
    advice: "Học cách kiên trì và đi sâu vào một lĩnh vực",
    purpose: "Lan tỏa niềm vui và cảm hứng",
    love: "Thích sự vui vẻ nhưng cần sự chân thành",
    health: "Cẩn thận với hệ hô hấp và căng thẳng thần kinh"
  },
  4: {
    theme: "Người xây dựng",
    symbol: "♋",
    element: "Đất",
    strengths: ["Thực tế", "Chăm chỉ", "Ổn định", "Kỷ luật"],
    weaknesses: ["Cứng nhắc", "Bảo thủ", "Nhàm chán", "Lo lắng"],
    careers: ["Kỹ sư", "Kế toán", "Kiến trúc sư", "Quản lý"],
    advice: "Thoải mái hơn và đón nhận sự thay đổi",
    purpose: "Tạo nền tảng vững chắc cho cuộc sống",
    love: "Trung thành nhưng cần linh hoạt hơn",
    health: "Dễ gặp vấn đề về xương khớp và tiêu hóa"
  },
  5: {
    theme: "Người phiêu lưu",
    symbol: "♌",
    element: "Lửa",
    strengths: ["Tự do", "Linh hoạt", "Tò mò", "Năng động"],
    weaknesses: ["Bốc đồng", "Thiếu trách nhiệm", "Bồn chồn", "Hấp tấp"],
    careers: ["Du lịch", "Nhà báo", "Kinh doanh", "Khám phá"],
    advice: "Học cách cam kết và hoàn thành mục tiêu",
    purpose: "Trải nghiệm và thúc đẩy sự thay đổi",
    love: "Thích sự mới mẻ nhưng cần sự ổn định",
    health: "Dễ bị kiệt sức hoặc tai nạn nhỏ"
  },
  6: {
    theme: "Người chăm sóc",
    symbol: "♍",
    element: "Đất",
    strengths: ["Trách nhiệm", "Yêu thương", "Hỗ trợ", "Trung thành"],
    weaknesses: ["Kiểm soát", "Hy sinh quá mức", "Cầu toàn", "Lo âu"],
    careers: ["Y tá", "Giáo viên", "Tư vấn", "Nhà trị liệu"],
    advice: "Học cách yêu bản thân ngang với yêu người khác",
    purpose: "Xây dựng gia đình và cộng đồng",
    love: "Rất tận tâm nhưng cần không gian riêng",
    health: "Dễ gặp vấn đề về tim và hệ tiêu hóa"
  },
  7: {
    theme: "Người triết gia",
    symbol: "♎",
    element: "Nước",
    strengths: ["Phân tích", "Trực giác", "Tri thức", "Sâu sắc"],
    weaknesses: ["Hoài nghi", "Xa cách", "Tiêu cực", "Lập dị"],
    careers: ["Nhà khoa học", "Triết gia", "Nhà nghiên cứu", "Phân tích"],
    advice: "Học cách kết nối với mọi người và thế giới bên ngoài",
    purpose: "Khám phá chân lý và truyền bá tri thức",
    love: "Cần mở lòng và chia sẻ cảm xúc nhiều hơn",
    health: "Nhạy cảm với hệ thần kinh và mất ngủ"
  },
  8: {
    theme: "Người quyền lực",
    symbol: "♏",
    element: "Lửa",
    strengths: ["Tham vọng", "Tổ chức", "Thực tế", "Lãnh đạo"],
    weaknesses: ["Thao túng", "Ham vật chất", "Cứng rắn", "Độc đoán"],
    careers: ["Giám đốc", "Luật sư", "Ngân hàng", "Bất động sản"],
    advice: "Học cách sử dụng quyền lực vì lợi ích chung",
    purpose: "Tạo dựng sự thịnh vượng và cân bằng vật chất",
    love: "Cần cân bằng giữa sự nghiệp và tình cảm",
    health: "Dễ gặp vấn đề về huyết áp và căng thẳng"
  },
  9: {
    theme: "Người nhân đạo",
    symbol: "♐",
    element: "Khí",
    strengths: ["Bao dung", "Lý tưởng", "Nhân ái", "Truyền cảm hứng"],
    weaknesses: ["Mơ mộng", "Thiếu thực tế", "Dễ bị lợi dụng", "Tự cao"],
    careers: ["Nhà từ thiện", "Nhà hoạt động xã hội", "Nghệ sĩ", "Giáo viên"],
    advice: "Học cách cân bằng giữa lý tưởng và thực tế",
    purpose: "Phục vụ nhân loại và lan tỏa tình yêu",
    love: "Rất lý tưởng hóa nhưng cần thực tế hơn",
    health: "Dễ bị ảnh hưởng bởi cảm xúc và năng lượng"
  }
};

module.exports = coreNumbers;