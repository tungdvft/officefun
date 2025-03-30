// server/api/numerology/period.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

function getCurrentDateInfo() {
  const today = new Date('2025-03-30'); // Ngày hiện tại theo hệ thống
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  // Tính ngày bắt đầu tuần (thứ Hai)
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay() || 7; // Chủ nhật = 0 -> 7
  startOfWeek.setDate(day - (dayOfWeek - 1));
  const startDay = startOfWeek.getDate();
  const startMonth = startOfWeek.getMonth() + 1;

  return {
    currentDate: `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentWeek: `Tuần từ ${startDay < 10 ? '0' + startDay : startDay}/${startMonth < 10 ? '0' + startMonth : startMonth}/${year} - ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentMonth: `${month < 10 ? '0' + month : month}/${year}`,
    currentYear: `${year}`
  };
}

function calculateNumber(birthDate, period) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();

  let sum;
  if (period === 'day') {
    const [day, month, year] = currentDate.split('/').map(Number);
    sum = birthDay + birthMonth + day + month + year;
  } else if (period === 'week') {
    const [startDay] = currentWeek.split(' - ')[0].split('/').map(Number);
    sum = birthDay + birthMonth + startDay + 3 + 2025;
  } else if (period === 'month') {
    const [month, year] = currentMonth.split('/').map(Number);
    sum = birthDay + birthMonth + month + year;
  } else if (period === 'year') {
    sum = birthDay + birthMonth + parseInt(currentYear);
  }

  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

export default defineEventHandler(async (event) => {
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
    });
  }

  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
  const periods = {
    day: { number: calculateNumber(birthDate, 'day'), text: `ngày ${currentDate}` },
    week: { number: calculateNumber(birthDate, 'week'), text: `tuần ${currentWeek}` },
    month: { number: calculateNumber(birthDate, 'month'), text: `tháng ${currentMonth}` },
    year: { number: calculateNumber(birthDate, 'year'), text: `năm ${currentYear}` }
  };

  const prompt = `Dựa trên thần số học, phân tích cho "${name}" với ngày sinh ${birthDate} cho các khoảng thời gian sau: 
    1. Ngày ${currentDate} (số ${periods.day.number})
    2. Tuần ${currentWeek} (số ${periods.week.number})
    3. Tháng ${currentMonth} (số ${periods.month.number})
    4. Năm ${currentYear} (số ${periods.year.number})
    Trả về JSON hợp lệ với cấu trúc: { "day": {}, "week": {}, "month": {}, "year": {} }, mỗi object chứa:
    - "number": Số cá nhân.
    - "description": Diễn giải chung (5-6 câu) về năng lượng của khoảng thời gian, nhắc tên "${name}" ở câu đầu.
    - "shouldDo": Những việc nên làm (4-5 câu), phù hợp với năng lượng số.
    - "shouldAvoid": Những việc nên tránh (3-4 câu), không hợp với năng lượng số.
    - "lunchSuggestion": Chỉ thêm cho "day" (2-3 câu), gợi ý món ăn trưa thực tế.
    Giọng điệu tự nhiên, khách quan, tránh "nên" quá cứng nhắc. Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.day || !data.week || !data.month || !data.year) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return { numerology: data };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackResponse(name, birthDate);
  }
});

function getFallbackResponse(name, birthDate) {
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
  const periods = {
    day: { number: calculateNumber(birthDate, 'day'), text: `hôm nay (${currentDate})` },
    week: { number: calculateNumber(birthDate, 'week'), text: `tuần này (${currentWeek})` },
    month: { number: calculateNumber(birthDate, 'month'), text: `tháng này (${currentMonth})` },
    year: { number: calculateNumber(birthDate, 'year'), text: `năm này (${currentYear})` }
  };

  return {
    numerology: {
      day: {
        number: periods.day.number,
        description: `Số ${periods.day.number} mang đến năng lượng đặc trưng cho ${periods.day.text} của "${name}". Đây là thời điểm tràn đầy sức sống, thôi thúc khám phá những điều mới mẻ. Sự linh hoạt và tò mò dẫn dắt qua những trải nghiệm bất ngờ. Một ngày lý tưởng để thoát khỏi sự nhàm chán và đón nhận sự đa dạng. Năng lượng này khuyến khích tìm kiếm sự phong phú trong cuộc sống.`,
        shouldDo: `Thử sức với những hoạt động mới hoặc khám phá nơi chưa từng đến sẽ rất thú vị hôm nay. Giao tiếp với những người khác biệt có thể mang lại cảm hứng. Giải quyết vấn đề một cách sáng tạo cũng là cách tận dụng tốt năng lượng này. Ra ngoài và vận động nhiều hơn sẽ giúp cảm thấy tràn đầy sức sống.`,
        shouldAvoid: `Đừng bám vào thói quen cũ hoặc ở yên một chỗ quá lâu hôm nay, vì năng lượng này không hợp với sự cứng nhắc. Tránh cam kết dài hạn nếu chưa chắc chắn, vì tâm trạng có thể thay đổi. Hạn chế phân tâm quá mức để tránh mất tập trung.`,
        lunchSuggestion: periods.day.number === 1 ? `Một bữa trưa với gà nướng và salad rau xanh sẽ phù hợp với năng lượng ngày hiện tại. Món ăn nhẹ nhàng, giàu protein này giúp duy trì sự tập trung và tỉnh táo suốt cả ngày.` 
          : periods.day.number === 5 ? `Một phần bánh mì kẹp thịt bò nướng và rau tươi là lựa chọn lý tưởng cho trưa nay. Món ăn nhanh gọn này đồng điệu với năng lượng linh hoạt hôm nay.` 
          : `Cơm gạo lứt với cá hồi áp chảo và rau luộc sẽ là bữa trưa tuyệt vời hôm nay. Món ăn giàu dinh dưỡng này hỗ trợ sự thanh lọc cơ thể và tinh thần.`
      },
      week: {
        number: periods.week.number,
        description: `Số ${periods.week.number} mang đến năng lượng đặc trưng cho ${periods.week.text} của "${name}". Đây là giai đoạn tập trung vào hiệu quả và tổ chức, thúc đẩy hành động với sự quyết tâm. Sự tham vọng nổi bật, giúp dễ dàng đạt được mục tiêu lớn. Một tuần phù hợp để quản lý tài chính hoặc xây dựng nền tảng vững chắc. Năng lượng này tạo điều kiện để tiến xa nếu biết tận dụng.`,
        shouldDo: `Tập trung vào công việc đòi hỏi sự tổ chức và lập kế hoạch sẽ mang lại kết quả tốt trong tuần này. Quản lý thời gian và tài chính một cách hiệu quả là cách tận dụng năng lượng này. Đặt mục tiêu cụ thể và hành động quyết liệt để đạt được chúng. Tìm cách cải thiện hiệu suất trong mọi lĩnh vực tham gia.`,
        shouldAvoid: `Tránh lơ là hoặc bỏ qua các chi tiết quan trọng trong tuần này, vì năng lượng này đòi hỏi sự chính xác. Hạn chế tiêu xài phung phí hoặc hành động bốc đồng, vì điều đó có thể làm mất cân bằng. Đừng để áp lực làm mất kiên nhẫn với người khác.`
      },
      month: {
        number: periods.month.number,
        description: `Số ${periods.month.number} mang đến năng lượng của sự khởi đầu và độc lập cho ${periods.month.text} của "${name}". Đây là thời điểm tràn đầy động lực để bắt đầu những điều mới mẻ. Sự tự tin và quyết đoán nổi bật, giúp dễ dàng đặt mục tiêu. Một giai đoạn khuyến khích sự chủ động và khẳng định bản thân. Năng lượng này tạo cơ hội để tỏa sáng nếu biết nắm bắt.`,
        shouldDo: `Tập trung vào những việc đòi hỏi sự độc lập và sáng tạo sẽ mang lại kết quả tốt trong tháng này. Bắt đầu một dự án mới hoặc đưa ra quyết định quan trọng là lựa chọn phù hợp. Giao tiếp rõ ràng để thể hiện ý tưởng cũng rất hiệu quả. Tận dụng thời gian này để bước ra khỏi vùng an toàn và thử sức với điều mới.`,
        shouldAvoid: `Tránh tham gia vào những tranh cãi không cần thiết trong tháng này, vì năng lượng này dễ làm nóng nảy. Hạn chế phụ thuộc quá nhiều vào người khác, vì điều đó có thể gây khó chịu. Đừng trì hoãn, vì giai đoạn này không hợp với sự do dự.`
      },
      year: {
        number: periods.year.number,
        description: `Số ${periods.year.number} mang đến năng lượng đặc trưng cho ${periods.year.text} của "${name}". Đây là giai đoạn tập trung vào sức mạnh và thành tựu, thúc đẩy hành động với tham vọng lớn. Sự tổ chức và thực tế giúp xây dựng nền tảng vững chắc. Một năm phù hợp để đạt được những mục tiêu dài hạn. Năng lượng này khuyến khích sự kiên trì và quyết tâm.`,
        shouldDo: `Tập trung vào các dự án dài hạn đòi hỏi sự tổ chức sẽ mang lại kết quả tốt trong năm này. Quản lý tài chính và thời gian hiệu quả là cách tận dụng năng lượng này. Đặt mục tiêu lớn và theo đuổi chúng với sự quyết liệt. Tìm cách cải thiện bản thân trong các lĩnh vực quan trọng.`,
        shouldAvoid: `Tránh bỏ qua các chi tiết quan trọng trong năm này, vì năng lượng này đòi hỏi sự chính xác. Hạn chế hành động bốc đồng hoặc tiêu xài không kiểm soát, vì điều đó có thể gây mất cân bằng. Đừng để áp lực làm mất kiên nhẫn với những tiến trình chậm.`
      }
    }
  };
}