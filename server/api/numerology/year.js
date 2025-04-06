import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const year = today.getFullYear();
  return { currentYear: `${year}`, year };
}

function calculateNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { year } = getCurrentDateInfo();
  const sum = birthDay + birthMonth + year;
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
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

  const prompt = `Dựa trên thần số học, phân tích cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}:
    Năm ${dateInfo.currentYear} (số ${period.number})
    Trả về CHỈ JSON: { "year": {} }, object chứa:
    - "number": Số cá nhân.
    - "theme": Chủ đề chính (ví dụ: "Khởi đầu").
    - "description": Diễn giải (8-10 câu), bắt đầu bằng "${name}", giọng tự nhiên, sâu sắc.
    - "focus": Mảng 4 yếu tố cần tập trung.
    - "keywords": Mảng 5 từ khóa nổi bật.
    - "shouldDo": Mảng 6 câu gợi ý việc nên làm.
    - "shouldAvoid": Mảng 5 câu việc nên tránh.
    - "energyTips": Mảng 3 câu mẹo cân bằng năng lượng.`;

  let periodData;
  try {
    const rawData = await callGeminiApiWithTimeout(prompt, 5000);
    periodData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()).year : rawData.year;
    if (!periodData) throw new Error('Dữ liệu từ Gemini không đầy đủ');
  } catch (error) {
    periodData = generateFallbackData(name, birthDate, period);
  }
  return periodData;
}

function generateFallbackData(name, birthDate, period) {
  const number = period.number in NUMEROLOGY_MEANINGS.personalYear ? period.number : 1;
  const meaning = NUMEROLOGY_MEANINGS.personalYear[number];
  return {
    number,
    theme: meaning.theme,
    description: `"${name}", năm ${period.text} mang năng lượng số ${number}, biểu trưng cho ${meaning.theme.toLowerCase()}. Đây là năm để bạn đặt nền móng cho những mục tiêu dài hạn. Năng lượng này mang đến cơ hội lớn nhưng đòi hỏi tầm nhìn rõ ràng. Mỗi quyết định trong năm đều có thể định hình tương lai. Hãy chú ý đến các mối quan hệ quan trọng, chúng sẽ hỗ trợ bạn. Nếu tận dụng tốt, đây sẽ là năm đầy thành tựu và phát triển. Sự kiên định và sáng tạo là chìa khóa thành công. Một năm đáng nhớ đang chờ bạn chinh phục!`,
    focus: ['Kiên định', 'Sáng tạo', 'Tầm nhìn', 'Kết nối'],
    keywords: ['năng lượng', 'phát triển', 'cơ hội', 'thành tựu', 'kiên trì'],
    shouldDo: [
      `Đặt 3 mục tiêu lớn cho năm nay.`,
      `Đăng ký một khóa học để nâng cao bản thân.`,
      `Dành ít nhất một kỳ nghỉ ngắn để tái tạo năng lượng.`,
      `Đánh giá tiến độ mỗi quý để điều chỉnh kế hoạch.`,
      `Tham gia một dự án cộng đồng để lan tỏa tích cực.`,
      `Viết thư tổng kết cho bản thân cuối năm.`
    ],
    shouldAvoid: [
      `Tránh đầu tư mạo hiểm mà không nghiên cứu kỹ.`,
      `Hạn chế giữ mối quan hệ tiêu cực quá lâu.`,
      `Đừng quên nghỉ ngơi giữa các kế hoạch lớn.`,
      `Tránh trì hoãn quyết định quan trọng.`,
      `Hạn chế để thất bại nhỏ làm bạn chùn bước.`
    ],
    energyTips: [
      `Thiền định mỗi tháng để duy trì năng lượng.`,
      `Thay đổi không gian làm việc giữa năm để làm mới.`,
      `Đi dạo ngoài trời cuối năm để tái tạo tinh thần.`
    ]
  };
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.' });
  }

  const dateInfo = getCurrentDateInfo();
  const period = { number: calculateNumber(birthDate), text: dateInfo.currentYear };
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