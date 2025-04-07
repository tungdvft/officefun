import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Lấy thông tin ngày hiện tại
function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return {
    currentDate: `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    day,
    month,
    year
  };
}

// Tính số ngày cá nhân
function calculatePersonalDayNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { day, month, year } = getCurrentDateInfo();
  const sum = birthDay + birthMonth + day + month + year;
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Tính số đường đời
function calculateLifePathNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const digits = birthDate.split('/').join('').split('').map(Number);
  let sum = digits.reduce((a, b) => a + b, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

// Tính số vận mệnh
function calculateExpressionNumber(name) {
  const pythagorean = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = cleanName.split('').reduce((acc, char) => acc + (pythagorean[char] || 0), 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

// Tính số linh hồn
function calculateSoulUrgeNumber(name) {
  const vowels = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = cleanName.split('').reduce((acc, char) => acc + (vowels[char] || 0), 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

async function callGeminiApiWithTimeout(prompt, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await callGeminiApi(prompt, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

async function getPeriodData(name, birthDate, period) {
  const dateInfo = getCurrentDateInfo();
  const randomSeed = Math.floor(Math.random() * 10000);
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Tính các con số bổ sung
  const numbers = {
    personalDay: period.number,
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name)
  };

  // Lấy dữ liệu từ NUMEROLOGY_MEANINGS để làm phong phú prompt
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const expressionData = NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1];
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];

  const prompt = `Dựa trên thần số học, phân tích ngày ${dateInfo.currentDate} cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}, với:
    - Số Ngày cá nhân: ${numbers.personalDay} (năng lượng chính hôm nay)
    - Số Đường đời: ${numbers.lifePath} (Chủ đề: ${lifePathData.theme}, Mục đích: ${lifePathData.purpose})
    - Số Vận mệnh: ${numbers.expression} (Chủ đề: ${expressionData.theme}, Điểm mạnh: ${expressionData.strengths?.join(', ') || 'không xác định'})
    - Số Linh hồn: ${numbers.soulUrge} (Mong muốn: ${soulUrgeData.desire}, Động lực: ${soulUrgeData.motivation}, Thành tựu: ${soulUrgeData.fulfillment})
    Trả về CHỈ JSON: { "day": {} }, object chứa:
    - "number": Số ngày cá nhân (${numbers.personalDay}).
    - "insight": Phân tích sâu (8-10 câu), bắt đầu bằng "${name}", liên kết Số Ngày cá nhân với Số Đường đời và Số Linh hồn, giải thích tại sao ngày này quan trọng trong hành trình dài hạn và ảnh hưởng thế nào đến mục tiêu cá nhân.
    - "focus": Mảng 4 yếu tố cần tập trung hôm nay, kết hợp Số Ngày cá nhân và Số Vận mệnh.
    - "keywords": Mảng 5 từ khóa nổi bật, phản ánh năng lượng ngày.
    - "shouldDo": Mảng 6 câu lời khuyên thực tế để tận dụng ngày này, kết hợp Số Ngày cá nhân với Số Vận mệnh, hỗ trợ ra quyết định.
    - "shouldAvoid": Mảng 5 câu điều cần tránh, dựa trên Số Ngày cá nhân và Số Linh hồn, phân tích rủi ro tiềm ẩn.
    - "energyTips": Mảng 3 câu mẹo cân bằng năng lượng, dựa trên Số Đường đời và Số Linh hồn.
    - "lunchSuggestion": Mảng 4 câu gợi ý món ăn trưa thực tế, liên kết Số Ngày cá nhân với Số Đường đời và Số Linh hồn.
    Giọng điệu tự nhiên, sâu sắc, tập trung vào insight và liên kết logic giữa các số. Chỉ trả JSON thuần túy, không markdown trong JSON!`;

  let periodData;
  try {
    const rawData = await callGeminiApiWithTimeout(prompt, 5000);
    periodData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()).day : rawData.day;
    if (!periodData || !periodData.insight) throw new Error('Dữ liệu từ Gemini không đầy đủ');
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    periodData = generateFallbackData(name, birthDate, period, numbers);
  }
  return periodData;
}

function generateFallbackData(name, birthDate, period, numbers) {
  const { personalDay, lifePath, expression, soulUrge } = numbers;
  const dateInfo = getCurrentDateInfo();
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];

  const baseResponses = {
    1: {
      insight: `"${name}", hôm nay ${dateInfo.currentDate}, số 1 mang đến năng lượng khởi đầu mới, kết hợp với Số Đường đời ${lifePath} – hành trình ${lifePathData.purpose.toLowerCase()} của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn "${soulUrgeData.desire.toLowerCase()}", với động lực "${soulUrgeData.motivation.toLowerCase()}". Ngày này là cơ hội để bạn bắt đầu một điều gì đó quan trọng, đặc biệt liên quan đến ${soulUrgeData.fulfillment.toLowerCase()}. Năng lượng hôm nay khuyến khích sự độc lập và quyết đoán, giúp bạn tiến gần hơn đến mục tiêu dài hạn. Đây là thời điểm để bạn tự tin bước ra khỏi vùng an toàn. Tuy nhiên, nó đòi hỏi sự tập trung để tránh phân tâm. Một ngày đầy tiềm năng nếu bạn hành động dứt khoát. Năng lượng này là bước nhỏ nhưng quan trọng trong hành trình lớn lao của bạn.`,
      focus: ['Khởi đầu', 'Tự tin', 'Quyết đoán', 'Tập trung'],
      keywords: ['năng lượng', 'độc lập', 'mục tiêu', 'hành động', 'khởi sự'],
      shouldDo: [
        `Lập kế hoạch chi tiết cho một nhiệm vụ nhỏ và bắt đầu ngay sáng nay.`,
        `Tận dụng Số Vận mệnh ${expression} để chia sẻ ý tưởng với ai đó, như đồng nghiệp hoặc bạn bè.`,
        `Dành 10 phút viết ra mục tiêu cụ thể cho ngày hôm nay.`,
        `Thử một hành động liên quan đến ${soulUrgeData.fulfillment.toLowerCase()} để kích thích năng lượng.`,
        `Hoàn thành một việc còn dang dở trước chiều để tạo động lực.`,
        `Đánh giá lại tiến độ cá nhân vào cuối ngày để cảm nhận sự tiến bộ.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn quá chú trọng "${soulUrgeData.desire.toLowerCase()}" mà hành động vội vàng.`,
        `Tránh trì hoãn, vì số 1 cần hành động ngay lập tức hôm nay.`,
        `Hạn chế phụ thuộc vào người khác để giữ sự độc lập.`,
        `Đừng để cảm xúc tiêu cực làm mất tập trung giữa ngày.`,
        `Tránh đa nhiệm quá nhiều, vì ngày này cần sự chú tâm vào một việc.`,
      ],
      energyTips: [
        `Hít thở sâu 5 phút sáng nay để kết nối với Số Đường đời ${lifePath} và ${soulUrgeData.desire.toLowerCase()}.`,
        `Uống một ly nước chanh ấm giữa ngày để duy trì sự tỉnh táo.`,
        `Dành vài phút tối nay ngồi yên để tái tạo năng lượng sau ngày bận rộn.`,
      ],
      lunchSuggestion: [
        `Với Số Đường đời ${lifePath} và Số Linh hồn ${soulUrge}, một phần gà nướng với salad rau xanh rất hợp ngày số 1.`,
        `Món ăn nhẹ nhàng này giúp bạn giữ năng lượng tích cực và tập trung.`,
        `Thêm một ly nước ép cam để hỗ trợ ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Đây là lựa chọn lý tưởng để đồng hành cùng sự khởi đầu mạnh mẽ hôm nay.`,
      ]
    },
    2: {
      insight: `"${name}", hôm nay ${dateInfo.currentDate}, số 2 mang đến năng lượng hài hòa, kết hợp với Số Đường đời ${lifePath} – hành trình ${lifePathData.purpose.toLowerCase()} của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn "${soulUrgeData.desire.toLowerCase()}", với động lực "${soulUrgeData.motivation.toLowerCase()}". Ngày này lý tưởng để củng cố các mối quan hệ hoặc tìm sự cân bằng trong ${soulUrgeData.fulfillment.toLowerCase()}. Năng lượng nhẹ nhàng giúp bạn lắng nghe và thấu hiểu sâu sắc hơn, cả bản thân và người khác. Đây là thời điểm để điều chỉnh nhịp sống, tạo sự ổn định cho hành trình dài hạn. Một chút kiên nhẫn hôm nay sẽ mang lại giá trị lớn về sau. Ngày này là cơ hội để bạn xây dựng sự kết nối ý nghĩa. Năng lượng này giúp bạn tiến gần hơn đến sự hòa hợp trong cuộc sống.`,
      focus: ['Hài hòa', 'Kết nối', 'Kiên nhẫn', 'Hợp tác'],
      keywords: ['cân bằng', 'quan hệ', 'hiểu biết', 'hòa hợp', 'nhẹ nhàng'],
      shouldDo: [
        `Gửi một tin nhắn hỏi thăm ai đó quan trọng để tăng kết nối cá nhân.`,
        `Tham gia một cuộc trò chuyện nhóm và đóng góp ý kiến, tận dụng Số Vận mệnh ${expression}.`,
        `Dành 10 phút ghi lại cảm xúc để hiểu rõ bản thân hơn hôm nay.`,
        `Sắp xếp lại lịch trình để cân bằng giữa công việc và ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Hỗ trợ ai đó trong một việc nhỏ để xây dựng sự hòa hợp.`,
        `Tìm một khoảnh khắc yên tĩnh tối nay để suy ngẫm về ngày.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn quá chú trọng "${soulUrgeData.desire.toLowerCase()}" mà mất cân bằng.`,
        `Tránh cố kiểm soát mọi thứ, vì số 2 cần sự linh hoạt hôm nay.`,
        `Hạn chế cô lập bản thân để tránh cảm giác lạc lõng trong ngày này.`,
        `Đừng đưa ra quyết định lớn nếu bạn chưa cảm thấy sẵn sàng.`,
        `Tránh xung đột không cần thiết để giữ năng lượng hòa hợp.`,
      ],
      energyTips: [
        `Hít thở sâu 5 phút sáng nay để đồng điệu với Số Đường đời ${lifePath} và ${soulUrgeData.desire.toLowerCase()}.`,
        `Uống một cốc nước ấm với mật ong giữa ngày để giữ sự nhẹ nhàng.`,
        `Dành vài phút tối nay thả lỏng để cân bằng lại tâm trí.`,
      ],
      lunchSuggestion: [
        `Với Số Đường đời ${lifePath} và Số Linh hồn ${soulUrge}, một tô súp rau củ với gà là lựa chọn tuyệt vời cho ngày số 2.`,
        `Món ăn này nhẹ nhàng, bổ dưỡng, hỗ trợ sự cân bằng và kết nối hôm nay.`,
        `Thêm một lát bánh mì để duy trì năng lượng cho ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Đây là bữa trưa lý tưởng để đồng điệu với năng lượng hài hòa của ngày.`,
      ]
    },
    9: {
      insight: `"${name}", hôm nay ${dateInfo.currentDate}, số 9 mang đến năng lượng hoàn thiện, kết hợp với Số Đường đời ${lifePath} – hành trình ${lifePathData.purpose.toLowerCase()} của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn "${soulUrgeData.desire.toLowerCase()}", với động lực "${soulUrgeData.motivation.toLowerCase()}". Ngày này là thời điểm để nhìn lại và buông bỏ, đặc biệt trong ${soulUrgeData.fulfillment.toLowerCase()}. Năng lượng sáng tạo và lòng nhân ái thúc đẩy bạn hành động vì điều ý nghĩa hơn. Đây là một bước nhỏ nhưng quan trọng để kết thúc một giai đoạn và mở ra điều mới mẻ. Ngày này mang lại cảm giác trọn vẹn nếu bạn tận dụng tốt cơ hội trưởng thành. Một ngày để sống chậm lại và suy ngẫm về hành trình của mình. Năng lượng này nhắc bạn rằng mỗi kết thúc đều là khởi đầu mới.`,
      focus: ['Hoàn thiện', 'Sáng tạo', 'Nhân ái', 'Buông bỏ'],
      keywords: ['kết thúc', 'ý nghĩa', 'trắc ẩn', 'sáng tạo', 'trưởng thành'],
      shouldDo: [
        `Lên kế hoạch hoàn thành một việc nhỏ còn dang dở trước cuối ngày hôm nay.`,
        `Dành 10 phút hỗ trợ ai đó, tận dụng Số Vận mệnh ${expression} để chia sẻ kinh nghiệm.`,
        `Thử một hoạt động liên quan đến ${soulUrgeData.fulfillment.toLowerCase()} để giải phóng năng lượng.`,
        `Xem lại danh sách công việc và loại bỏ thứ không còn cần thiết.`,
        `Thực hiện một hành động nhỏ vì cộng đồng, như nhặt rác hoặc giúp ai đó.`,
        `Suy ngẫm 5 phút tối nay về những gì bạn đã đạt được trong ngày.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn bám víu vào "${soulUrgeData.desire.toLowerCase()}" mà không buông bỏ.`,
        `Tránh để sự ích kỷ lấn át, vì số 9 hướng đến lòng bao dung hôm nay.`,
        `Hạn chế lãng phí thời gian vào việc vô nghĩa, vì ngày này cần sự tập trung.`,
        `Đừng quá khắt khe với bản thân nếu mọi thứ chưa hoàn hảo.`,
        `Tránh trì hoãn việc kết thúc những gì cần hoàn thành trong ngày.`,
      ],
      energyTips: [
        `Hít thở sâu 5 phút sáng nay để kết nối với Số Đường đời ${lifePath} và ${soulUrgeData.desire.toLowerCase()}.`,
        `Uống một cốc trà xanh giữa ngày để hỗ trợ sự thanh lọc và tĩnh tại.`,
        `Dành vài phút tối nay ngồi yên để tái tạo năng lượng sau ngày ý nghĩa.`,
      ],
      lunchSuggestion: [
        `Với Số Đường đời ${lifePath} và Số Linh hồn ${soulUrge}, một phần cơm gạo lứt với cá hồi và rau luộc rất hợp ngày số 9.`,
        `Món ăn này thanh lọc cơ thể, hỗ trợ năng lượng hoàn thiện và sáng tạo hôm nay.`,
        `Thêm một cốc trà xanh để tăng cường sự tĩnh tại cho ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Đây là bữa trưa lý tưởng để đồng điệu với sự sâu sắc của ngày.`,
      ]
    }
    // Thêm các số 3-8, 11, 22 nếu cần
  };

  const fallback = baseResponses[personalDay] || baseResponses[1];
  return {
    number: personalDay,
    insight: fallback.insight,
    focus: fallback.focus,
    keywords: fallback.keywords,
    shouldDo: fallback.shouldDo,
    shouldAvoid: fallback.shouldAvoid,
    energyTips: fallback.energyTips,
    lunchSuggestion: fallback.lunchSuggestion
  };
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.' });
  }

  const dateInfo = getCurrentDateInfo();
  const period = { number: calculatePersonalDayNumber(birthDate), text: dateInfo.currentDate };
  const periodData = await getPeriodData(name, birthDate, period);

  return {
    numerology: { name, birthDate, periods: { day: periodData } },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };
});