import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Lấy thông tin tháng hiện tại
function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return {
    currentMonth: `${month < 10 ? '0' + month : month}/${year}`,
    month,
    year
  };
}

// Tính số tháng cá nhân
function calculatePersonalMonthNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { month, year } = getCurrentDateInfo();
  const sum = birthDay + birthMonth + month + year;
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
    personalMonth: period.number,
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name)
  };

  // Lấy dữ liệu từ NUMEROLOGY_MEANINGS để làm phong phú prompt
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const expressionData = NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1];
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];

  const prompt = `Dựa trên thần số học, phân tích tháng ${dateInfo.currentMonth} cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}, với:
    - Số Tháng cá nhân: ${numbers.personalMonth} (năng lượng chính của tháng này)
    - Số Đường đời: ${numbers.lifePath} (Chủ đề: ${lifePathData.theme}, Mục đích: ${lifePathData.purpose})
    - Số Vận mệnh: ${numbers.expression} (Chủ đề: ${expressionData.theme}, Điểm mạnh: ${expressionData.strengths?.join(', ') || 'không xác định'})
    - Số Linh hồn: ${numbers.soulUrge} (Chủ đề: ${soulUrgeData.theme}, Mong muốn: ${soulUrgeData.desires?.join(', ') || 'không xác định'})
    Trả về CHỈ JSON: { "month": {} }, object chứa:
    - "number": Số tháng cá nhân (${numbers.personalMonth}).
    - "insight": Phân tích sâu (8-10 câu), bắt đầu bằng "${name}", liên kết Số Tháng cá nhân với Số Đường đời và Số Linh hồn, giải thích tại sao tháng này quan trọng trong hành trình dài hạn và ảnh hưởng thế nào đến mục tiêu cá nhân.
    - "focus": Mảng 4 yếu tố cần tập trung trong tháng, kết hợp Số Tháng cá nhân và Số Vận mệnh.
    - "keywords": Mảng 5 từ khóa nổi bật, phản ánh năng lượng tháng.
    - "shouldDo": Mảng 6 câu lời khuyên thực tế để tận dụng tháng này, kết hợp Số Tháng cá nhân với Số Vận mệnh, hỗ trợ ra quyết định.
    - "shouldAvoid": Mảng 5 câu điều cần tránh, dựa trên Số Tháng cá nhân và Số Linh hồn, phân tích rủi ro tiềm ẩn.
    - "energyTips": Mảng 3 câu mẹo cân bằng năng lượng, dựa trên Số Đường đời.
    Giọng điệu tự nhiên, sâu sắc, tập trung vào insight và liên kết logic giữa các số. Chỉ trả JSON thuần túy, không markdown trong JSON!`;

  let periodData;
  try {
    const rawData = await callGeminiApiWithTimeout(prompt, 5000);
    periodData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()).month : rawData.month;
    if (!periodData || !periodData.insight) throw new Error('Dữ liệu từ Gemini không đầy đủ');
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    periodData = generateFallbackData(name, birthDate, period, numbers);
  }
  return periodData;
}

function generateFallbackData(name, birthDate, period, numbers) {
  const { personalMonth, lifePath, expression, soulUrge } = numbers;
  const dateInfo = getCurrentDateInfo();

  const baseResponses = {
    1: {
      insight: `"${name}", tháng ${dateInfo.currentMonth}, số 1 mang đến năng lượng khởi đầu mới, kết hợp với Số Đường đời ${lifePath} – hành trình tìm kiếm mục đích của bạn. Số Linh hồn ${soulUrge} khơi dậy mong muốn tự do trong cảm xúc, khiến tháng này trở thành thời điểm lý tưởng để đặt nền móng cho những thay đổi quan trọng. Đây là giai đoạn quan trọng để bắt đầu các dự án hoặc mục tiêu dài hạn trong cuộc sống. Năng lượng này thúc đẩy bạn hành động độc lập và quyết đoán hơn bao giờ hết. Tháng này có thể là bước ngoặt nếu bạn tận dụng tốt sự tự tin của mình. Tuy nhiên, nó cũng đòi hỏi sự tập trung để tránh bị phân tâm bởi những yếu tố bên ngoài. Đây là cơ hội để bạn định hình lại hướng đi trong hành trình lớn lao của mình. Mỗi bước nhỏ trong tháng này đều là tiền đề cho những thành công sau này.`,
      focus: ['Khởi đầu', 'Tự tin', 'Quyết đoán', 'Tập trung'],
      keywords: ['năng lượng', 'độc lập', 'mục tiêu', 'hành động', 'khởi sự'],
      shouldDo: [
        `Lập kế hoạch chi tiết cho một dự án lớn để bắt đầu ngay đầu tháng.`,
        `Giao tiếp với đồng nghiệp hoặc bạn bè để chia sẻ ý tưởng mới, tận dụng Số Vận mệnh ${expression}.`,
        `Dành một ngày đầu tháng viết ra 5 mục tiêu cụ thể cần đạt được.`,
        `Thử một hoạt động mới như học kỹ năng hoặc tham gia khóa học để khởi động năng lượng.`,
        `Hoàn thành một nhiệm vụ quan trọng trước giữa tháng để tạo đà tích cực.`,
        `Tổng kết cuối tháng để đánh giá tiến độ và điều chỉnh kế hoạch.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn bốc đồng trong các quyết định lớn.`,
        `Tránh trì hoãn việc bắt đầu, vì số 1 cần hành động ngay từ đầu tháng.`,
        `Hạn chế làm việc nhóm nếu không cần thiết để giữ sự độc lập.`,
        `Đừng để cảm xúc tiêu cực làm mất tập trung vào giữa tháng.`,
        `Tránh đa nhiệm quá nhiều, vì tháng này cần sự chú tâm vào từng mục tiêu.`,
      ],
      energyTips: [
        `Thiền 10 phút mỗi sáng để kết nối với Số Đường đời ${lifePath} và định hướng năng lượng.`,
        `Uống nước chanh ấm giữa tháng để duy trì sự tỉnh táo và tích cực.`,
        `Đi dạo ngắn vào cuối tháng để tái tạo tinh thần cho tháng mới.`,
      ]
    },
    2: {
      insight: `"${name}", tháng ${dateInfo.currentMonth}, số 2 mang đến năng lượng hài hòa, kết hợp với Số Đường đời ${lifePath} trong hành trình dài hạn của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn tìm kiếm sự kết nối cảm xúc, khiến tháng này lý tưởng để củng cố các mối quan hệ quan trọng. Đây là thời điểm để bạn điều chỉnh nhịp sống, tạo sự cân bằng giữa công việc và cuộc sống cá nhân. Năng lượng nhẹ nhàng giúp bạn lắng nghe và thấu hiểu tốt hơn, cả bản thân và người khác. Tháng này quan trọng vì nó xây dựng nền tảng cho sự ổn định trong tương lai gần. Một chút kiên nhẫn sẽ mang lại giá trị lớn về lâu dài. Đây là cơ hội để bạn chậm lại và tập trung vào những điều thực sự ý nghĩa. Năng lượng này hỗ trợ bạn tiến gần hơn đến sự hòa hợp trong hành trình của mình.`,
      focus: ['Hài hòa', 'Kết nối', 'Kiên nhẫn', 'Hợp tác'],
      keywords: ['cân bằng', 'quan hệ', 'hiểu biết', 'hòa hợp', 'nhẹ nhàng'],
      shouldDo: [
        `Dành một ngày trong tháng để gặp gỡ bạn bè hoặc gia đình, tận dụng Số Vận mệnh ${expression}.`,
        `Tham gia một dự án nhóm hoặc hoạt động cộng đồng để tăng sự hợp tác.`,
        `Viết nhật ký cảm xúc vào giữa tháng để hiểu rõ bản thân hơn.`,
        `Sắp xếp lại lịch trình để cân bằng giữa công việc và nghỉ ngơi.`,
        `Hỗ trợ một người thân hoặc đồng nghiệp trong một việc lớn để xây dựng kết nối.`,
        `Dành thời gian cuối tháng để đánh giá các mối quan hệ và điều chỉnh cách giao tiếp.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn giữ cảm xúc tiêu cực quá lâu.`,
        `Tránh cố kiểm soát mọi thứ, vì số 2 cần sự linh hoạt và hòa hợp.`,
        `Hạn chế cô lập bản thân, vì tháng này cần sự kết nối với người khác.`,
        `Đừng đưa ra quyết định lớn vào cuối tháng nếu bạn chưa sẵn sàng.`,
        `Tránh xung đột không cần thiết để giữ năng lượng tích cực.`,
      ],
      energyTips: [
        `Thiền 10 phút mỗi sáng để đồng điệu với Số Đường đời ${lifePath}.`,
        `Uống trà hoa cúc giữa tháng để thư giãn và cân bằng cảm xúc.`,
        `Đi bộ ngắn vào cuối tháng để làm mới tinh thần và chuẩn bị cho tháng mới.`,
      ]
    },
    9: {
      insight: `"${name}", tháng ${dateInfo.currentMonth}, số 9 mang đến năng lượng hoàn thiện, kết hợp với Số Đường đời ${lifePath} trong hành trình tìm kiếm ý nghĩa của bạn. Số Linh hồn ${soulUrge} khơi dậy mong muốn sống vì điều lớn lao hơn, khiến tháng này trở thành thời điểm để nhìn lại và buông bỏ những gì không còn phù hợp. Đây là giai đoạn quan trọng để kết thúc một chu kỳ và chuẩn bị cho bước tiếp theo trong cuộc sống. Năng lượng sáng tạo và lòng nhân ái thúc đẩy bạn hành động vì giá trị sâu sắc hơn. Tháng này có thể mang lại cảm giác trọn vẹn nếu bạn biết tận dụng. Nó nhắc bạn rằng mỗi sự kết thúc đều là khởi đầu cho điều mới mẻ. Đây là cơ hội để bạn sống chậm lại và suy ngẫm về hành trình dài hạn của mình. Năng lượng này giúp bạn tiến gần hơn đến mục đích sống lớn lao.`,
      focus: ['Hoàn thiện', 'Sáng tạo', 'Nhân ái', 'Buông bỏ'],
      keywords: ['kết thúc', 'ý nghĩa', 'trắc ẩn', 'sáng tạo', 'phát triển'],
      shouldDo: [
        `Lên kế hoạch hoàn thành một dự án lớn trước cuối tháng, tận dụng Số Vận mệnh ${expression}.`,
        `Dành một ngày trong tháng để hỗ trợ ai đó, như đồng nghiệp hoặc bạn bè.`,
        `Thử một hoạt động sáng tạo như vẽ hoặc viết để giải phóng năng lượng tích cực.`,
        `Xem lại mục tiêu cá nhân và loại bỏ những thứ không còn cần thiết trước cuối tháng.`,
        `Tham gia một hành động vì cộng đồng, như quyên góp hoặc giúp đỡ ai đó.`,
        `Dành thời gian cuối tháng để suy ngẫm và lập kế hoạch cho tháng tới.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn bám víu vào những thứ không còn giá trị.`,
        `Tránh để sự ích kỷ lấn át, vì số 9 hướng đến sự bao dung và chia sẻ.`,
        `Hạn chế trì hoãn việc hoàn thành những gì cần kết thúc trong tháng này.`,
        `Đừng quá nghiêm khắc với bản thân nếu mọi thứ chưa hoàn hảo.`,
        `Tránh lãng phí thời gian vào những việc vô nghĩa giữa tháng.`,
      ],
      energyTips: [
        `Thiền 10 phút mỗi sáng để kết nối với Số Đường đời ${lifePath} và tìm sự tĩnh tại.`,
        `Uống trà xanh giữa tháng để hỗ trợ sự thanh lọc và cân bằng năng lượng.`,
        `Đi dạo ngắn vào cuối tháng để tái tạo tinh thần và sẵn sàng cho tháng mới.`,
      ]
    }
    // Thêm các số 3-8, 11, 22 nếu cần
  };

  const fallback = baseResponses[personalMonth] || baseResponses[1];
  return {
    number: personalMonth,
    insight: fallback.insight,
    focus: fallback.focus,
    keywords: fallback.keywords,
    shouldDo: fallback.shouldDo,
    shouldAvoid: fallback.shouldAvoid,
    energyTips: fallback.energyTips
  };
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.' });
  }

  const dateInfo = getCurrentDateInfo();
  const period = { number: calculatePersonalMonthNumber(birthDate), text: dateInfo.currentMonth };
  const periodData = await getPeriodData(name, birthDate, period);

  return {
    numerology: { name, birthDate, periods: { month: periodData } },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };
});