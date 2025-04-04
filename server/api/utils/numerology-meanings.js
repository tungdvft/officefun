// utils/numerology-meanings.js
const NUMEROLOGY_MEANINGS = {
  // ================ Ý NGHĨA SỐ ĐƯỜNG ĐỜI ================
  lifePath: {
    1: {
      theme: "Người lãnh đạo",
      symbol: "♈",
      strengths: ["Độc lập", "Sáng tạo", "Quyết đoán"],
      challenges: ["Cứng đầu", "Thiếu kiên nhẫn", "Độc đoán"],
      careers: ["Doanh nhân", "Quản lý", "Nhà sáng chế"],
      advice: "Học cách lắng nghe và hợp tác với người khác",
      purpose: "Khởi xướng những ý tưởng mới và dẫn dắt người khác"
    },
    2: {
      theme: "Người hòa giải", 
      symbol: "♉",
      strengths: ["Nhạy cảm", "Hợp tác", "Kiên nhẫn"],
      challenges: ["Thiếu quyết đoán", "Dễ bị tổn thương", "Phụ thuộc"],
      careers: ["Nhà ngoại giao", "Tư vấn", "Giáo viên"],
      advice: "Phát triển sự tự tin và khả năng đặt ranh giới",
      purpose: "Mang mọi người lại gần nhau và tạo sự hòa hợp"
    },
    3: {
      theme: "Người sáng tạo",
      symbol: "♊",
      strengths: ["Truyền cảm hứng", "Giao tiếp", "Lạc quan"],
      challenges: ["Thiếu tập trung", "Lãng phí tài năng", "Nông nổi"],
      careers: ["Nghệ sĩ", "Nhà văn", "Diễn giả"],
      advice: "Rèn luyện tính kỷ luật trong sáng tạo",
      purpose: "Truyền tải ý tưởng và cảm hứng thông qua nghệ thuật"
    },
    4: {
      theme: "Người xây dựng",
      symbol: "♋",
      strengths: ["Thực tế", "Đáng tin cậy", "Kỷ luật"],
      challenges: ["Cứng nhắc", "Bảo thủ", "Thiếu linh hoạt"],
      careers: ["Kỹ sư", "Kiến trúc sư", "Kế toán"],
      advice: "Học cách thích nghi với sự thay đổi",
      purpose: "Tạo dựng nền tảng vững chắc cho xã hội"
    },
    5: {
      theme: "Nhà thám hiểm",
      symbol: "♌",
      strengths: ["Linh hoạt", "Thích phiêu lưu", "Tiến bộ"],
      challenges: ["Bồn chồn", "Thiếu cam kết", "Nghiện ngập"],
      careers: ["Du lịch", "Phóng viên", "Kinh doanh"],
      advice: "Phát triển tính kiên định và trách nhiệm",
      purpose: "Trải nghiệm và khám phá thế giới đa dạng"
    },
    6: {
      theme: "Người nuôi dưỡng",
      symbol: "♍",
      strengths: ["Trách nhiệm", "Chăm sóc", "Cân bằng"],
      challenges: ["Can thiệp quá mức", "Hy sinh bản thân", "Kiểm soát"],
      careers: ["Y tế", "Giáo dục", "Tư vấn"],
      advice: "Học cách chăm sóc bản thân trước khi giúp đỡ người khác",
      purpose: "Chữa lành và nuôi dưỡng cộng đồng"
    },
    7: {
      theme: "Nhà hiền triết",
      symbol: "♎",
      strengths: ["Trí tuệ", "Trực giác", "Chiều sâu"],
      challenges: ["Xa cách", "Hoài nghi", "Lập dị"],
      careers: ["Nhà khoa học", "Nhà nghiên cứu", "Triết gia"],
      advice: "Kết nối nhiều hơn với thế giới thực tế",
      purpose: "Khám phá chân lý và truyền đạt tri thức"
    },
    8: {
      theme: "Nhà quản lý",
      symbol: "♏",
      strengths: ["Tổ chức", "Tham vọng", "Hiệu quả"],
      challenges: ["Thao túng", "Vật chất", "Lạm dụng quyền lực"],
      careers: ["Giám đốc", "Ngân hàng", "Luật sư"],
      advice: "Cân bằng giữa vật chất và tinh thần",
      purpose: "Tạo ra của cải và quản lý nguồn lực hiệu quả"
    },
    9: {
      theme: "Nhà nhân đạo",
      symbol: "♐",
      strengths: ["Rộng lượng", "Sáng suốt", "Lý tưởng"],
      challenges: ["Mơ mộng", "Bi quan", "Hy sinh quá mức"],
      careers: ["Từ thiện", "Nghệ thuật", "Hoạt động xã hội"],
      advice: "Thực tế hóa các lý tưởng cao đẹp",
      purpose: "Phục vụ nhân loại và cống hiến vì cộng đồng"
    },
    11: {
      theme: "Bậc thầy tâm linh",
      symbol: "⚡",
      strengths: ["Truyền cảm hứng", "Nhạy cảm", "Tầm nhìn"],
      challenges: ["Căng thẳng", "Nhạy cảm quá mức", "Khó thực tế"],
      careers: ["Nhà tâm linh", "Cố vấn", "Nghệ sĩ"],
      advice: "Chăm sóc sức khỏe tinh thần và thể chất",
      purpose: "Khai sáng và nâng cao nhận thức cộng đồng"
    },
    22: {
      theme: "Kiến trúc sư vĩ đại",
      symbol: "🏛️",
      strengths: ["Thực tế hóa", "Xây dựng", "Tầm nhìn lớn"],
      challenges: ["Áp lực", "Cầu toàn", "Quá tải"],
      careers: ["Kiến trúc sư", "Nhà quy hoạch", "Lãnh đạo"],
      advice: "Học cách ủy quyền và chia nhỏ mục tiêu",
      purpose: "Hiện thực hóa những ý tưởng vĩ đại phục vụ nhân loại"
    },
    33: {
      theme: "Bậc thầy giáo dục",
      symbol: "🎓",
      strengths: ["Yêu thương", "Sáng tạo", "Truyền cảm hứng"],
      challenges: ["Quá lý tưởng", "Kiệt sức", "Khó thực tế"],
      careers: ["Giáo viên", "Nhà trị liệu", "Nhà hoạt động xã hội"],
      advice: "Cân bằng giữa cho đi và nhận lại",
      purpose: "Nâng đỡ và giáo dục thế hệ tương lai"
    }
  },

  // ================ Ý NGHĨA SỐ TÊN ================
  expression: {
    1: {
      theme: "Người tiên phong",
      talents: ["Lãnh đạo", "Đổi mới", "Độc lập"],
      careers: ["CEO", "Nhà phát minh", "Giám đốc sáng tạo"],
      tip: "Phát huy khả năng ra quyết định và chịu trách nhiệm"
    },
    2: {
      theme: "Nhà ngoại giao",
      talents: ["Hợp tác", "Nhạy cảm", "Hòa giải"],
      careers: ["Nhân sự", "Tư vấn", "Nhà tâm lý"],
      tip: "Rèn luyện sự tự tin trong giao tiếp"
    },
    3: {
      theme: "Người truyền cảm hứng",
      talents: ["Giao tiếp", "Nghệ thuật", "Sáng tạo"],
      careers: ["Nhà văn", "Diễn giả", "Nghệ sĩ"],
      tip: "Tập trung năng lượng vào một lĩnh vực chuyên sâu"
    },
    4: {
      theme: "Người tổ chức",
      talents: ["Thực tế", "Chi tiết", "Kỷ luật"],
      careers: ["Kỹ sư", "Quản lý dự án", "Kế toán"],
      tip: "Học cách linh hoạt trong các tình huống mới"
    },
    5: {
      theme: "Nhà thích nghi",
      talents: ["Linh hoạt", "Tò mò", "Phiêu lưu"],
      careers: ["Du lịch", "Báo chí", "Kinh doanh"],
      tip: "Phát triển tính cam kết và kiên định"
    },
    6: {
      theme: "Người chăm sóc",
      talents: ["Nuôi dưỡng", "Trách nhiệm", "Cân bằng"],
      careers: ["Bác sĩ", "Giáo viên", "Thiết kế nội thất"],
      tip: "Đặt ranh giới lành mạnh trong các mối quan hệ"
    },
    7: {
      theme: "Nhà phân tích",
      talents: ["Nghiên cứu", "Trực giác", "Chiều sâu"],
      careers: ["Nhà khoa học", "Phân tích dữ liệu", "Triết gia"],
      tip: "Kết nối nhiều hơn với thế giới thực tế"
    },
    8: {
      theme: "Nhà điều hành",
      talents: ["Quản lý", "Tài chính", "Tổ chức"],
      careers: ["Giám đốc điều hành", "Ngân hàng", "Đầu tư"],
      tip: "Cân bằng giữa vật chất và tinh thần"
    },
    9: {
      theme: "Nhà nhân văn",
      talents: ["Rộng lượng", "Thấu hiểu", "Sáng suốt"],
      careers: ["Từ thiện", "Tâm lý học", "Nghệ thuật"],
      tip: "Học cách nhận sự giúp đỡ từ người khác"
    },
    11: {
      theme: "Người truyền cảm hứng",
      talents: ["Tầm nhìn", "Nhạy cảm", "Sáng tạo"],
      careers: ["Nhà tâm linh", "Nghệ sĩ", "Cố vấn"],
      tip: "Chăm sóc sức khỏe tinh thần thường xuyên"
    },
    22: {
      theme: "Kiến trúc sư",
      talents: ["Xây dựng", "Hiện thực hóa", "Quy mô lớn"],
      careers: ["Kiến trúc sư", "Nhà quy hoạch", "Lãnh đạo"],
      tip: "Chia nhỏ mục tiêu lớn thành các bước thực tế"
    },
    33: {
      theme: "Người chữa lành",
      talents: ["Yêu thương", "Sáng tạo", "Giáo dục"],
      careers: ["Bác sĩ tâm lý", "Giáo viên", "Nhà trị liệu"],
      tip: "Tìm sự cân bằng giữa cho đi và nhận lại"
    }
  },

  // ================ Ý NGHĨA SỐ LINH HỒN ================
  soulUrge: {
    1: {
      desire: "Tự khẳng định",
      motivation: "Được công nhận là người độc lập và có năng lực",
      fulfillment: "Vị trí lãnh đạo, dự án cá nhân, sự tự chủ"
    },
    2: {
      desire: "Yêu thương",
      motivation: "Được kết nối sâu sắc và hòa hợp với người khác",
      fulfillment: "Mối quan hệ thân thiết, môi trường hòa thuận"
    },
    3: {
      desire: "Tự biểu đạt",
      motivation: "Được thể hiện tài năng và sự sáng tạo",
      fulfillment: "Hoạt động nghệ thuật, giao tiếp, sân khấu"
    },
    4: {
      desire: "Ổn định",
      motivation: "Được an toàn và có trật tự trong cuộc sống",
      fulfillment: "Gia đình vững chắc, sự nghiệp ổn định"
    },
    5: {
      desire: "Tự do",
      motivation: "Được trải nghiệm và khám phá thế giới",
      fulfillment: "Du lịch, học hỏi điều mới, không bị gò bó"
    },
    6: {
      desire: "Cống hiến",
      motivation: "Được chăm sóc và phục vụ người khác",
      fulfillment: "Gia đình, công việc giúp đỡ cộng đồng"
    },
    7: {
      desire: "Hiểu biết",
      motivation: "Được khám phá chân lý và ý nghĩa sâu xa",
      fulfillment: "Nghiên cứu, thiền định, hoạt động tâm linh"
    },
    8: {
      desire: "Thành tựu",
      motivation: "Được công nhận thành công và quyền lực",
      fulfillment: "Vị trí cao, tài chính vững mạnh, ảnh hưởng xã hội"
    },
    9: {
      desire: "Hoàn thiện",
      motivation: "Được cống hiến cho nhân loại và lý tưởng cao cả",
      fulfillment: "Hoạt động nhân đạo, nghệ thuật vị nhân sinh"
    },
    11: {
      desire: "Khai sáng",
      motivation: "Được truyền cảm hứng và thức tỉnh tâm linh",
      fulfillment: "Hướng dẫn người khác, sáng tạo nghệ thuật tâm linh"
    },
    22: {
      desire: "Kiến tạo",
      motivation: "Được xây dựng di sản lâu dài cho nhân loại",
      fulfillment: "Dự án quy mô lớn, đóng góp bền vững cho xã hội"
    },
    33: {
      desire: "Nâng đỡ",
      motivation: "Được yêu thương và giáo dục thế hệ tương lai",
      fulfillment: "Công việc chữa lành, giảng dạy, từ thiện"
    }
  },
  personality: {
    1: {
      theme: "Người tự tin",
      strengths: ["Giao tiếp", "Quyết đoán", "Năng động"],
      challenges: ["Kiêu ngạo", "Thống trị", "Thiếu tinh tế"],
      workStyle: "Thích dẫn dắt và làm việc độc lập"
    },
    2: {
      theme: "Người nhạy cảm",
      strengths: ["Hỗ trợ", "Thấu hiểu", "Hợp tác"],
      challenges: ["Nhút nhát", "Dễ bị tổn thương", "Thiếu quyết đoán"],
      workStyle: "Thích làm việc nhóm và hỗ trợ người khác"
    },
    3: {
      theme: "Người biểu cảm",
      strengths: ["Sáng tạo", "Vui vẻ", "Truyền cảm hứng"],
      challenges: ["Lãng phí năng lượng", "Thiếu tập trung", "Tự cao"],
      workStyle: "Thích môi trường năng động và sáng tạo"
    },
    4: {
      theme: "Người thực tế",
      strengths: ["Kỷ luật", "Tổ chức", "Đáng tin cậy"],
      challenges: ["Cứng nhắc", "Bảo thủ", "Thiếu linh hoạt"],
      workStyle: "Thích quy trình rõ ràng và ổn định"
    },
    5: {
      theme: "Người linh hoạt",
      strengths: ["Thích nghi", "Tò mò", "Nhanh nhẹn"],
      challenges: ["Bồn chồn", "Thiếu kiên nhẫn", "Không cam kết"],
      workStyle: "Thích thay đổi và thử thách mới"
    },
    6: {
      theme: "Người trách nhiệm",
      strengths: ["Chăm sóc", "Hòa nhã", "Cân bằng"],
      challenges: ["Kiểm soát", "Hy sinh quá mức", "Lo lắng"],
      workStyle: "Thích môi trường hài hòa và hỗ trợ lẫn nhau"
    },
    7: {
      theme: "Người nội tâm",
      strengths: ["Phân tích", "Trực giác", "Sâu sắc"],
      challenges: ["Xa cách", "Bí ẩn", "Cô lập"],
      workStyle: "Thích làm việc độc lập và nghiên cứu"
    },
    8: {
      theme: "Người quyền lực",
      strengths: ["Tổ chức", "Tham vọng", "Hiệu quả"],
      challenges: ["Áp đảo", "Vật chất", "Cạnh tranh"],
      workStyle: "Thích quản lý và đạt mục tiêu lớn"
    },
    9: {
      theme: "Người lý tưởng",
      strengths: ["Thấu hiểu", "Rộng lượng", "Nhân ái"],
      challenges: ["Mơ mộng", "Dễ thất vọng", "Quá nhạy cảm"],
      workStyle: "Thích làm việc vì mục tiêu cao cả"
    },
    11: {
      theme: "Người nhạy bén",
      strengths: ["Truyền cảm hứng", "Nhạy cảm", "Sáng tạo"],
      challenges: ["Căng thẳng", "Nhạy cảm quá mức", "Thiếu thực tế"],
      workStyle: "Thích môi trường tâm linh và sáng tạo"
    },
    22: {
      theme: "Người thực hiện",
      strengths: ["Thực tế hóa", "Tầm nhìn lớn", "Kỷ luật"],
      challenges: ["Áp lực", "Cầu toàn", "Quá tải"],
      workStyle: "Thích các dự án lớn và có cấu trúc"
    }
  },
  // ================ Ý NGHĨA NĂM CÁ NHÂN ================
  personalYear: {
    1: {
      theme: "Khởi đầu",
      focus: ["Bắt đầu mới", "Độc lập", "Ý tưởng mới"],
      advice: "Dũng cảm bước ra khỏi vùng an toàn",
      keywords: ["Mới mẻ", "Hành động", "Tiên phong"]
    },
    2: {
      theme: "Kiên nhẫn",
      focus: ["Hợp tác", "Nhạy cảm", "Xây dựng mối quan hệ"],
      advice: "Tập trung vào chất lượng thay vì số lượng",
      keywords: ["Hợp tác", "Nhẫn nại", "Cân bằng"]
    },
    3: {
      theme: "Sáng tạo",
      focus: ["Tự biểu đạt", "Giao tiếp", "Xã hội"],
      advice: "Channelling creativity into productive outlets",
      keywords: ["Vui vẻ", "Sáng tạo", "Giao tiếp"]
    },
    4: {
      theme: "Ổn định",
      focus: ["Làm việc", "Tổ chức", "Nền tảng"],
      advice: "Xây dựng hệ thống và quy trình bền vững",
      keywords: ["Kỷ luật", "Ổn định", "Thực tế"]
    },
    5: {
      theme: "Thay đổi",
      focus: ["Tự do", "Phiêu lưu", "Thích nghi"],
      advice: "Đón nhận thay đổi với tâm thế cởi mở",
      keywords: ["Biến động", "Linh hoạt", "Khám phá"]
    },
    6: {
      theme: "Trách nhiệm",
      focus: ["Gia đình", "Chăm sóc", "Cân bằng"],
      advice: "Chăm sóc bản thân trước khi giúp đỡ người khác",
      keywords: ["Yêu thương", "Gia đình", "Hài hòa"]
    },
    7: {
      theme: "Suy ngẫm",
      focus: ["Nội tâm", "Học hỏi", "Tâm linh"],
      advice: "Dành thời gian cho tự phản ánh và phát triển nội tâm",
      keywords: ["Phân tích", "Chiêm nghiệm", "Trí tuệ"]
    },
    8: {
      theme: "Thành tựu",
      focus: ["Quyền lực", "Tài chính", "Thành công"],
      advice: "Cân bằng giữa vật chất và tinh thần",
      keywords: ["Thành công", "Quyền lực", "Phát triển"]
    },
    9: {
      theme: "Hoàn tất",
      focus: ["Buông bỏ", "Nhân đạo", "Chuyển tiếp"],
      advice: "Kết thúc chu kỳ cũ để chuẩn bị cho điều mới",
      keywords: ["Kết thúc", "Tổng kết", "Cho đi"]
    },
    11: {
      theme: "Tầm nhìn",
      focus: ["Tâm linh", "Truyền cảm hứng", "Sứ mệnh"],
      advice: "Tin tưởng vào trực giác và tầm nhìn của bạn",
      keywords: ["Tâm linh", "Nhạy cảm", "Truyền cảm hứng"]
    },
    22: {
      theme: "Xây dựng",
      focus: ["Quy mô lớn", "Di sản", "Hiện thực hóa"],
      advice: "Tập trung vào dự án có tác động lâu dài",
      keywords: ["Kiến tạo", "Quy mô", "Di sản"]
    },
    33: {
      theme: "Phụng sự",
      focus: ["Tình yêu", "Giáo dục", "Chữa lành"],
      advice: "Sử dụng năng lượng yêu thương để phục vụ",
      keywords: ["Yêu thương", "Cho đi", "Nâng đỡ"]
    }
  },

  // ================ CÔNG CỤ PHÂN TÍCH ================
  analyzers: {
    /**
     * Phân tích tiềm năng nghề nghiệp
     */
    careerAnalysis: (lifePath, expression) => {
      const careers = [
        ...(NUMEROLOGY_MEANINGS.lifePath[lifePath]?.careers || []),
        ...(NUMEROLOGY_MEANINGS.expression[expression]?.careers || [])
      ];
      
      const uniqueCareers = [...new Set(careers)];
      
      return {
        idealRoles: uniqueCareers.slice(0, 5),
        workStyle: `${NUMEROLOGY_MEANINGS.lifePath[lifePath]?.strengths[0]} + ${NUMEROLOGY_MEANINGS.expression[expression]?.talents[0]}`,
        growthArea: NUMEROLOGY_MEANINGS.lifePath[lifePath]?.challenges[0]
      };
    },

    /**
     * Phân tích mối quan hệ
     */
    relationshipAnalysis: (lifePathA, lifePathB) => {
      const compatibility = {
        best: NUMEROLOGY_MEANINGS.lifePath[lifePathA]?.bestWith || [],
        challenges: NUMEROLOGY_MEANINGS.lifePath[lifePathA]?.challengesWith || []
      };
      
      return {
        compatibilityLevel: compatibility.best.includes(lifePathB) 
          ? 'high' 
          : compatibility.challenges.includes(lifePathB) 
            ? 'low' 
            : 'medium',
        strengths: `${NUMEROLOGY_MEANINGS.lifePath[lifePathA]?.strengths[0]} + ${NUMEROLOGY_MEANINGS.lifePath[lifePathB]?.strengths[0]}`,
        advice: compatibility.challenges.includes(lifePathB)
          ? 'Tôn trọng sự khác biệt và tìm điểm chung'
          : 'Phát huy điểm mạnh chung để hỗ trợ lẫn nhau'
      };
    },

    /**
     * Phân tích năm cá nhân
     */
    yearAnalysis: (personalYear) => {
      return {
        theme: NUMEROLOGY_MEANINGS.personalYear[personalYear]?.theme,
        focusAreas: NUMEROLOGY_MEANINGS.personalYear[personalYear]?.focus,
        opportunities: NUMEROLOGY_MEANINGS.personalYear[personalYear]?.keywords
      };
    }
  },

  // ================ TIỆN ÍCH ================
  utils: {
    /**
     * Tính năm cá nhân
     */
    calculatePersonalYear: (birthDate, targetYear) => {
      const [day, month] = birthDate.split('/').map(Number);
      const yearDigits = targetYear.toString().split('').map(Number);
      const yearSum = yearDigits.reduce((a, b) => a + b, 0);
      
      let sum = day + month + yearSum;
      while (sum > 9 && ![11, 22, 33].includes(sum)) {
        sum = sum.toString().split('').reduce((a, b) => a + +b, 0);
      }
      
      return sum;
    },

    /**
     * Chuyển tên thành số
     */
    nameToNumbers: (name) => {
      const letterMap = {
        a:1, b:2, c:3, d:4, e:5, f:6, g:7, h:8, i:9,
        j:1, k:2, l:3, m:4, n:5, o:6, p:7, q:8, r:9,
        s:1, t:2, u:3, v:4, w:5, x:6, y:7, z:8
      };
      
      return name.toLowerCase().split('')
        .map(char => letterMap[char] || 0)
        .filter(num => num > 0);
    },

    /**
     * Tính số ngày sinh
     */
    calculateBirthDayNumber: (birthDate) => {
      const day = parseInt(birthDate.split('/')[0]);
      return reduceToSingleDigit(day);
    },

    /**
     * Tính số tháng sinh
     */
    calculateBirthMonthNumber: (birthDate) => {
      const month = parseInt(birthDate.split('/')[1]);
      return reduceToSingleDigit(month);
    }
  }
};

// Hàm hỗ trợ
function reduceToSingleDigit(num) {
  let result = num;
  while (result > 9 && ![11, 22, 33].includes(result)) {
    result = result.toString().split('').reduce((a, b) => a + +b, 0);
  }
  return result;
}

// ================ EXPORT ================
export const LifePathNumbers = NUMEROLOGY_MEANINGS.lifePath;
export const ExpressionNumbers = NUMEROLOGY_MEANINGS.expression;
export const SoulUrgeNumbers = NUMEROLOGY_MEANINGS.soulUrge;
export const PersonalYearNumbers = NUMEROLOGY_MEANINGS.personalYear;
export const PersonalityNumbers = NUMEROLOGY_MEANINGS.personality; // Thêm export cho Personality
export const NumerologyAnalyzers = NUMEROLOGY_MEANINGS.analyzers;
export const NumerologyUtils = {
  reduceToSingleDigit,
  calculatePersonalYear: function(birthDate, targetYear) {
    const [day, month] = birthDate.split('/').map(Number);
    let sum = day + month + targetYear;
    return reduceToSingleDigit(sum);
  },
  calculateBirthDayNumber: function(birthDate) {
    const day = parseInt(birthDate.split('/')[0]);
    return reduceToSingleDigit(day);
  }
};

export default NUMEROLOGY_MEANINGS;