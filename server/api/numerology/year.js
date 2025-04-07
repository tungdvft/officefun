import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Lấy thông tin năm hiện tại
function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const year = today.getFullYear();
  return { currentYear: `${year}`, year };
}

// Tính số năm cá nhân
function calculatePersonalYearNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { year } = getCurrentDateInfo();
  const sum = birthDay + birthMonth + year;
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
    personalYear: period.number,
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name)
  };

  // Lấy dữ liệu từ NUMEROLOGY_MEANINGS để làm phong phú prompt
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const expressionData = NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1];
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];

  const prompt = `Dựa trên thần số học, phân tích năm ${dateInfo.currentYear} cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}, với:
    - Số Năm cá nhân: ${numbers.personalYear} (năng lượng chính của năm này)
    - Số Đường đời: ${numbers.lifePath} (Chủ đề: ${lifePathData.theme}, Mục đích: ${lifePathData.purpose})
    - Số Vận mệnh: ${numbers.expression} (Chủ đề: ${expressionData.theme}, Điểm mạnh: ${expressionData.strengths?.join(', ') || 'không xác định'})
    - Số Linh hồn: ${numbers.soulUrge} (Mong muốn: ${soulUrgeData.desire}, Động lực: ${soulUrgeData.motivation}, Thành tựu: ${soulUrgeData.fulfillment})
    Trả về CHỈ JSON: { "year": {} }, object chứa:
    - "number": Số năm cá nhân (${numbers.personalYear}).
    - "insight": Phân tích sâu (8-10 câu), bắt đầu bằng "${name}", liên kết Số Năm cá nhân với Số Đường đời và Số Linh hồn, giải thích tại sao năm này quan trọng trong hành trình dài hạn và ảnh hưởng thế nào đến mục tiêu cá nhân.
    - "focus": Mảng 4 yếu tố cần tập trung trong năm, kết hợp Số Năm cá nhân và Số Vận mệnh.
    - "keywords": Mảng 5 từ khóa nổi bật, phản ánh năng lượng năm.
    - "shouldDo": Mảng 6 câu lời khuyên thực tế để tận dụng năm này, kết hợp Số Năm cá nhân với Số Vận mệnh, hỗ trợ ra quyết định.
    - "shouldAvoid": Mảng 5 câu điều cần tránh, dựa trên Số Năm cá nhân và Số Linh hồn, phân tích rủi ro tiềm ẩn.
    - "energyTips": Mảng 3 câu mẹo cân bằng năng lượng, dựa trên Số Đường đời và Số Linh hồn.
    Giọng điệu tự nhiên, sâu sắc, tập trung vào insight và liên kết logic giữa các số. Chỉ trả JSON thuần túy, không markdown trong JSON!`;

  let periodData;
  try {
    const rawData = await callGeminiApiWithTimeout(prompt, 5000);
    periodData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()).year : rawData.year;
    if (!periodData || !periodData.insight) throw new Error('Dữ liệu từ Gemini không đầy đủ');
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    periodData = generateFallbackData(name, birthDate, period, numbers);
  }
  return periodData;
}

function generateFallbackData(name, birthDate, period, numbers) {
  const { personalYear, lifePath, expression, soulUrge } = numbers;
  const dateInfo = getCurrentDateInfo();
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];

  const baseResponses = {
    1: {
      insight: `"${name}", năm ${dateInfo.currentYear}, số 1 mang đến năng lượng khởi đầu mới, kết hợp với Số Đường đời ${lifePath} – hành trình tìm kiếm mục đích của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn "${soulUrgeData.desire.toLowerCase()}", hướng tới "${soulUrgeData.motivation.toLowerCase()}". Năm này là thời điểm lý tưởng để đặt nền móng cho những thay đổi lớn, đặc biệt liên quan đến ${soulUrgeData.fulfillment.toLowerCase()}. Năng lượng này thúc đẩy bạn hành động độc lập và quyết đoán hơn bao giờ hết. Đây có thể là bước ngoặt nếu bạn tận dụng sự tự tin để tiến lên. Tuy nhiên, nó đòi hỏi tầm nhìn rõ ràng để tránh phân tâm. Năm này là cơ hội để bạn định hình lại tương lai trong hành trình dài hạn. Mỗi bước nhỏ đều là nền tảng cho thành công lớn sau này.`,
      focus: ['Khởi đầu', 'Tự tin', 'Tầm nhìn', 'Quyết đoán'],
      keywords: ['năng lượng', 'độc lập', 'mục tiêu', 'hành động', 'khởi sự'],
      shouldDo: [
        `Đặt 5 mục tiêu lớn cho năm nay và bắt đầu thực hiện ngay từ tháng đầu.`,
        `Tận dụng Số Vận mệnh ${expression} để chia sẻ ý tưởng mới với cộng đồng hoặc đồng nghiệp.`,
        `Dành một ngày đầu năm viết kế hoạch chi tiết cho các dự án cá nhân.`,
        `Thử một hoạt động liên quan đến ${soulUrgeData.fulfillment.toLowerCase()} để kích thích năng lượng.`,
        `Đánh giá tiến độ mỗi quý và điều chỉnh kế hoạch nếu cần.`,
        `Viết thư tổng kết cuối năm để nhìn lại hành trình và chuẩn bị cho chu kỳ mới.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn quá chú trọng "${soulUrgeData.desire.toLowerCase()}" mà bỏ qua thực tế.`,
        `Tránh trì hoãn việc bắt đầu các dự án lớn, vì số 1 cần hành động ngay từ đầu năm.`,
        `Hạn chế phụ thuộc quá nhiều vào người khác để giữ sự độc lập.`,
        `Đừng để cảm xúc tiêu cực làm mất tập trung giữa năm.`,
        `Tránh đa nhiệm quá nhiều, vì năm này cần sự chú tâm vào từng mục tiêu.`,
      ],
      energyTips: [
        `Thiền 15 phút mỗi sáng đầu tháng để kết nối với Số Đường đời ${lifePath} và ${soulUrgeData.desire.toLowerCase()}.`,
        `Thay đổi không gian sống giữa năm để làm mới tinh thần và hỗ trợ ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Đi dạo dài hoặc du lịch ngắn vào cuối năm để tái tạo năng lượng.`,
      ]
    },
    2: {
      insight: `"${name}", năm ${dateInfo.currentYear}, số 2 mang đến năng lượng hài hòa, kết hợp với Số Đường đời ${lifePath} trong hành trình dài hạn của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn "${soulUrgeData.desire.toLowerCase()}", với động lực "${soulUrgeData.motivation.toLowerCase()}". Năm này lý tưởng để xây dựng và củng cố các mối quan hệ quan trọng, đặc biệt trong ${soulUrgeData.fulfillment.toLowerCase()}. Năng lượng nhẹ nhàng giúp bạn lắng nghe và thấu hiểu sâu sắc hơn, cả nội tâm và người khác. Đây là thời điểm để điều chỉnh nhịp sống, tạo sự cân bằng giữa các khía cạnh cuộc sống. Năm này quan trọng vì nó đặt nền tảng cho sự ổn định lâu dài. Kiên nhẫn sẽ mang lại giá trị lớn, giúp bạn tiến gần hơn đến sự bình yên trong hành trình của mình.`,
      focus: ['Hài hòa', 'Kết nối', 'Kiên nhẫn', 'Hợp tác'],
      keywords: ['cân bằng', 'quan hệ', 'hiểu biết', 'hòa hợp', 'ổn định'],
      shouldDo: [
        `Dành ít nhất một ngày mỗi tháng để gặp gỡ bạn bè hoặc gia đình, tận dụng Số Vận mệnh ${expression}.`,
        `Tham gia một dự án nhóm hoặc hoạt động cộng đồng để tăng sự hợp tác.`,
        `Viết nhật ký cảm xúc mỗi quý để hiểu rõ bản thân hơn.`,
        `Sắp xếp lại cuộc sống để cân bằng giữa công việc và ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Hỗ trợ một người thân hoặc đồng nghiệp trong một dự án lớn để xây dựng kết nối.`,
        `Tổng kết cuối năm để đánh giá các mối quan hệ và điều chỉnh cách giao tiếp.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn quá chú trọng "${soulUrgeData.desire.toLowerCase()}" mà bỏ qua cân bằng.`,
        `Tránh cố kiểm soát mọi thứ, vì số 2 cần sự linh hoạt và hòa hợp.`,
        `Hạn chế cô lập bản thân, vì năm này cần sự kết nối với người khác.`,
        `Đừng đưa ra quyết định lớn khi chưa sẵn sàng, đặc biệt vào giữa năm.`,
        `Tránh xung đột không cần thiết để giữ năng lượng tích cực.`,
      ],
      energyTips: [
        `Thiền 15 phút mỗi sáng đầu tháng để đồng điệu với Số Đường đời ${lifePath} và ${soulUrgeData.desire.toLowerCase()}.`,
        `Uống trà thư giãn giữa năm để cân bằng cảm xúc và hỗ trợ ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Đi bộ hoặc nghỉ ngơi ngoài trời vào cuối năm để làm mới tinh thần.`,
      ]
    },
    9: {
      insight: `"${name}", năm ${dateInfo.currentYear}, số 9 mang đến năng lượng hoàn thiện, kết hợp với Số Đường đời ${lifePath} trong hành trình tìm kiếm ý nghĩa của bạn. Số Linh hồn ${soulUrge} thôi thúc bạn "${soulUrgeData.desire.toLowerCase()}", với động lực "${soulUrgeData.motivation.toLowerCase()}". Năm này là thời điểm để nhìn lại và buông bỏ những gì không còn phù hợp, đặc biệt trong ${soulUrgeData.fulfillment.toLowerCase()}. Năng lượng sáng tạo và lòng nhân ái thúc đẩy bạn hành động vì giá trị sâu sắc hơn. Đây là giai đoạn quan trọng để kết thúc một chu kỳ lớn và chuẩn bị cho bước tiếp theo. Năm này mang lại cảm giác trọn vẹn nếu bạn tận dụng cơ hội trưởng thành. Mỗi sự kết thúc đều mở ra một khởi đầu mới, giúp bạn tiến gần hơn đến mục đích sống cao cả.`,
      focus: ['Hoàn thiện', 'Sáng tạo', 'Nhân ái', 'Buông bỏ'],
      keywords: ['kết thúc', 'ý nghĩa', 'trắc ẩn', 'sáng tạo', 'trưởng thành'],
      shouldDo: [
        `Lên kế hoạch hoàn thành một dự án lớn trước cuối năm, tận dụng Số Vận mệnh ${expression}.`,
        `Dành một tháng trong năm để hỗ trợ cộng đồng, như tham gia từ thiện hoặc giúp đỡ ai đó.`,
        `Thử một hoạt động liên quan đến ${soulUrgeData.fulfillment.toLowerCase()} để giải phóng năng lượng.`,
        `Xem lại mục tiêu cá nhân và loại bỏ những thứ không còn phù hợp trước quý cuối.`,
        `Tham gia một khóa học nâng cao để chuẩn bị cho chu kỳ mới.`,
        `Viết thư tổng kết cuối năm để suy ngẫm và lập kế hoạch cho năm tới.`,
      ],
      shouldAvoid: [
        `Đừng để Số Linh hồn ${soulUrge} khiến bạn quá tập trung "${soulUrgeData.desire.toLowerCase()}" mà bỏ qua việc buông bỏ.`,
        `Tránh để sự ích kỷ lấn át, vì số 9 hướng đến sự bao dung và chia sẻ.`,
        `Hạn chế trì hoãn việc kết thúc những gì cần hoàn thành trong năm này.`,
        `Đừng quá khắt khe với bản thân nếu mọi thứ chưa hoàn hảo.`,
        `Tránh lãng phí thời gian vào những việc vô nghĩa giữa năm.`,
      ],
      energyTips: [
        `Thiền 15 phút mỗi sáng đầu tháng để kết nối với Số Đường đời ${lifePath} và ${soulUrgeData.desire.toLowerCase()}.`,
        `Thay đổi không gian sống giữa năm để thanh lọc năng lượng và hỗ trợ ${soulUrgeData.fulfillment.toLowerCase()}.`,
        `Đi du lịch ngắn hoặc nghỉ ngơi ngoài trời vào cuối năm để tái tạo tinh thần.`,
      ]
    }
    // Thêm các số 3-8, 11, 22 nếu cần
  };

  const fallback = baseResponses[personalYear] || baseResponses[1];
  return {
    number: personalYear,
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
  const period = { number: calculatePersonalYearNumber(birthDate), text: dateInfo.currentYear };
  const periodData = await getPeriodData(name, birthDate, period);

  return {
    numerology: { name, birthDate, periods: { year: periodData } },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };
});