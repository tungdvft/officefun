import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

// Tính số đường đời (Life Path Number)
function calculateLifePathNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const digits = birthDate.split('/').join('').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

// Tính số vận mệnh (Expression Number)
function calculateExpressionNumber(name) {
  const pythagorean = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = cleanName.split('').reduce((acc, char) => acc + (pythagorean[char] || 0), 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

// Tính số linh hồn (Soul Urge Number)
function calculateSoulUrgeNumber(name) {
  const vowels = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = cleanName.split('').reduce((acc, char) => acc + (vowels[char] || 0), 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

// Tính số ngày cá nhân (Personal Day Number)
function getPersonalDayNumber(birthDate, currentDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate) || !/^\d{2}\/\d{2}\/\d{4}$/.test(currentDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const [currentDay, currentMonth, currentYear] = currentDate.split('/').map(Number);
  let sum = birthDay + birthMonth + currentDay + currentMonth + currentYear;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

export default defineEventHandler(async (event) => {
  const { name, birthDate, currentDate } = await readBody(event);

  if (!name || !birthDate || !currentDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthDate và currentDate là bắt buộc.'
    });
  }

  // Tính các con số
  const numbers = {
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name),
    personalDay: getPersonalDayNumber(birthDate, currentDate)
  };

  const prompt = `Dựa trên thần số học, phân tích ngày ${currentDate} cho "${name}" (sinh ${birthDate}) với:
    - Số Ngày cá nhân: ${numbers.personalDay} (năng lượng chính của ngày hôm nay)
    - Số Đường đời: ${numbers.lifePath} (hành trình dài hạn và mục đích sống)
    - Số Vận mệnh: ${numbers.expression} (tài năng tự nhiên và cách thể hiện bản thân)
    - Số Linh hồn: ${numbers.soulUrge} (mong muốn sâu thẳm trong tâm hồn)
    Trả về JSON hợp lệ với các trường sau:
    1. "number": Số ngày cá nhân (${numbers.personalDay}).
    2. "insight": Phân tích sâu (6-8 câu) về năng lượng ngày này, liên kết Số Ngày cá nhân với Số Đường đời và Số Linh hồn, giải thích tại sao ngày này quan trọng trong hành trình dài hạn và ảnh hưởng thế nào đến mục tiêu cá nhân.
    3. "shouldDo": Lời khuyên thực tế (5 câu) để tận dụng ngày này, kết hợp Số Ngày cá nhân với Số Vận mệnh, đưa ra hành động cụ thể hỗ trợ ra quyết định.
    4. "shouldAvoid": Điều cần tránh (4 câu), dựa trên Số Ngày cá nhân và Số Linh hồn, phân tích rủi ro tiềm ẩn nếu không chú ý.
    5. "lunchSuggestion": Gợi ý món ăn trưa thực tế (3 câu), liên kết Số Ngày cá nhân với Số Đường đời, hỗ trợ năng lượng ngày.
    Giọng điệu tự nhiên, khách quan, tập trung vào insight và liên kết logic giữa các số. Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.number || !data.insight) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return { dailyNumerology: data };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackResponse(name, birthDate, currentDate, numbers);
  }
});

function getFallbackResponse(name, birthDate, currentDate, numbers) {
  const { personalDay, lifePath, expression, soulUrge } = numbers;

  const baseResponses = {
    1: {
      insight: `Hôm nay, số 1 mang đến năng lượng khởi đầu mới cho "${name}", hòa quyện với Số Đường đời ${lifePath} – hành trình tìm kiếm mục đích của bạn. Số Linh hồn ${soulUrge} khơi dậy mong muốn tự do trong cảm xúc, khiến ngày này trở thành bước ngoặt để khẳng định bản thân. Đây là thời điểm quan trọng để bạn đặt nền móng cho những mục tiêu dài hạn. Sự tự tin hôm nay có thể giúp bạn tiến gần hơn đến điều bạn thực sự muốn. Năng lượng này khuyến khích bạn hành động độc lập và quyết đoán. Tuy nhiên, nó cũng đòi hỏi sự tập trung để tránh phân tán. Một ngày đầy tiềm năng nếu bạn biết nắm bắt.`,
      shouldDo: `Số Vận mệnh ${expression} khuyên bạn bắt đầu một dự án cá nhân ngay hôm nay, như lập kế hoạch cho tuần tới. Giao tiếp rõ ràng với ai đó để thể hiện ý tưởng của bạn, có thể là đồng nghiệp hoặc bạn bè. Dành 15 phút viết ra mục tiêu ngắn hạn để định hướng ngày này. Tận dụng sự độc lập để giải quyết một vấn đề nhỏ còn tồn đọng. Hành động nhỏ hôm nay sẽ tạo đà cho thành công lớn hơn.`,
      shouldAvoid: `Số Linh hồn ${soulUrge} cảnh báo bạn tránh quyết định vội vàng khi cảm xúc dâng cao, vì có thể dẫn đến sai lầm. Đừng để sự nóng nảy làm hỏng mối quan hệ, đặc biệt trong ngày số 1. Tránh làm việc nhóm nếu không cần thiết, vì bạn dễ cảm thấy khó chịu. Hạn chế đa nhiệm để giữ năng lượng tập trung vào một mục tiêu duy nhất.`,
      lunchSuggestion: `Với Số Đường đời ${lifePath}, một bữa trưa như gà nướng kèm salad rau xanh rất hợp với ngày số 1. Món ăn nhẹ nhàng này giữ bạn tỉnh táo và hỗ trợ sự tập trung suốt ngày. Thêm một ly nước chanh để tăng cường năng lượng tự nhiên cho những khởi đầu mới.`
    },
    2: {
      insight: `Số 2 hôm nay mang đến sự hài hòa cho "${name}", kết hợp với Số Đường đời ${lifePath} trong hành trình dài hạn của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn tìm kiếm sự kết nối cảm xúc, khiến ngày này lý tưởng để củng cố các mối quan hệ. Đây là cơ hội để điều chỉnh cách bạn tương tác với thế giới xung quanh, đặc biệt trong những khía cạnh quan trọng với mục đích sống của bạn. Năng lượng nhẹ nhàng giúp bạn lắng nghe tốt hơn, cả bản thân và người khác. Ngày này quan trọng vì nó xây dựng nền tảng cho sự ổn định sau này. Một chút kiên nhẫn hôm nay có thể mang lại giá trị lớn về lâu dài.`,
      shouldDo: `Số Vận mệnh ${expression} khuyến khích bạn trò chuyện với ai đó quan trọng, như gửi tin nhắn hỏi thăm một người bạn. Tham gia một cuộc thảo luận nhóm và đóng góp ý kiến để tận dụng khả năng phối hợp. Dành 10 phút ghi chú cảm xúc của bạn để hiểu rõ bản thân hơn. Sắp xếp lại lịch trình cá nhân để tạo sự cân bằng giữa công việc và nghỉ ngơi. Một hành động hỗ trợ đồng nghiệp sẽ tạo hiệu ứng tích cực hôm nay.`,
      shouldAvoid: `Số Linh hồn ${soulUrge} nhắc bạn đừng giữ cảm xúc tiêu cực trong lòng quá lâu, vì nó có thể làm bạn mất cân bằng. Tránh cố gắng kiểm soát mọi thứ, vì số 2 không hợp với sự áp đặt. Hạn chế ở một mình quá lâu để tránh cảm giác cô lập trong ngày này. Đừng đưa ra quyết định lớn nếu bạn chưa cảm thấy sẵn sàng.`,
      lunchSuggestion: `Số Đường đời ${lifePath} kết hợp số 2 gợi ý một tô súp gà rau củ ấm áp cho trưa nay. Món ăn này nhẹ nhàng, bổ dưỡng, giúp bạn duy trì sự thoải mái trong ngày. Thêm một lát bánh mì để cân bằng năng lượng và giữ tinh thần hài hòa.`
    },
    9: {
      insight: `Số 9 hôm nay tạo nên một ngày hoàn thiện cho "${name}", kết hợp với Số Đường đời ${lifePath} trong hành trình tìm kiếm ý nghĩa dài hạn của bạn. Số Linh hồn ${soulUrge} khơi dậy mong muốn sống vì điều lớn lao hơn, khiến ngày này trở thành thời điểm để nhìn lại và buông bỏ. Đây là một bước ngoặt nhỏ nhưng quan trọng, giúp bạn tiến gần hơn đến mục đích sống của mình. Năng lượng sáng tạo và lòng nhân ái hôm nay thúc đẩy bạn hành động vì giá trị sâu sắc. Nếu tận dụng tốt, bạn sẽ cảm thấy nhẹ nhàng và trọn vẹn hơn. Ngày này nhắc bạn rằng mỗi sự kết thúc đều mở ra một khởi đầu mới.`,
      shouldDo: `Số Vận mệnh ${expression} khuyên bạn viết một kế hoạch ngắn hạn để hoàn thành một việc còn dang dở hôm nay. Dành 10 phút hỗ trợ ai đó, như giúp đồng nghiệp hoặc bạn bè, để cảm nhận sự thỏa mãn. Thử một hoạt động sáng tạo như vẽ hoặc viết nhật ký để giải phóng năng lượng tích cực. Xem lại danh sách công việc và loại bỏ những thứ không còn cần thiết. Một hành động vì cộng đồng, dù nhỏ, sẽ củng cố giá trị cá nhân của bạn.`,
      shouldAvoid: `Số Linh hồn ${soulUrge} cảnh báo bạn đừng bám víu vào những thứ không còn phù hợp, vì số 9 khuyến khích sự buông bỏ. Tránh để sự ích kỷ lấn át, vì ngày này hướng đến lòng bao dung. Hạn chế lãng phí thời gian vào những việc vô nghĩa, vì bạn cần tập trung vào điều quan trọng. Đừng quá nghiêm khắc với bản thân nếu mọi thứ chưa hoàn hảo.`,
      lunchSuggestion: `Với Số Đường đời ${lifePath}, một đĩa cơm gạo lứt với cá hồi áp chảo và rau luộc rất hợp ngày số 9. Món ăn này thanh lọc cơ thể, hỗ trợ năng lượng hoàn thiện của bạn. Thêm một cốc trà xanh để tăng cường sự tĩnh tại trong ngày này.`
    }
    // Thêm các số 3-8, 11, 22 nếu cần, với cùng cấu trúc liên kết
  };

  const fallback = baseResponses[personalDay] || baseResponses[1];
  return {
    dailyNumerology: {
      number: personalDay,
      insight: fallback.insight,
      shouldDo: fallback.shouldDo,
      shouldAvoid: fallback.shouldAvoid,
      lunchSuggestion: fallback.lunchSuggestion
    }
  };
}