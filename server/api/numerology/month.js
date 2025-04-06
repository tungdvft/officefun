import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

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

function calculateNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { month, year } = getCurrentDateInfo();
  const sum = birthDay + birthMonth + month + year;
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
    Tháng ${dateInfo.currentMonth} (số ${period.number})
    Trả về CHỈ JSON: { "month": {} }, object chứa:
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
    periodData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()).month : rawData.month;
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
    description: `"${name}", tháng ${period.text} mang năng lượng số ${number}, đại diện cho ${meaning.theme.toLowerCase()}. Đây là tháng để bạn nhìn lại những gì đã làm được. Năng lượng này khuyến khích sự phát triển cá nhân và kiên nhẫn. Mỗi hành động trong tháng đều có thể tạo ảnh hưởng lâu dài. Hãy chú ý đến những dấu hiệu nhỏ từ xung quanh bạn. Nếu tận dụng tốt, đây sẽ là tháng đầy ý nghĩa và thành tựu. Sự tập trung sẽ giúp bạn đạt bước tiến lớn. Một tháng đáng nhớ đang chờ bạn khám phá!`,
    focus: ['Phát triển', 'Kiên nhẫn', 'Tập trung', 'Định hướng'],
    keywords: ['năng lượng', 'phát triển', 'thành tựu', 'kiên trì', 'cơ hội'],
    shouldDo: [
      `Lập kế hoạch chi tiết cho tháng này.`,
      `Thử học một kỹ năng mới để nâng cao bản thân.`,
      `Dành một ngày cuối tuần dọn dẹp nhà cửa.`,
      `Ghi lại 3 mục tiêu cụ thể để theo dõi.`,
      `Kiểm tra tài chính giữa tháng để điều chỉnh.`,
      `Tổng kết thành tựu cuối tháng để rút kinh nghiệm.`
    ],
    shouldAvoid: [
      `Tránh chi tiêu quá mức đầu tháng.`,
      `Hạn chế để cảm xúc tiêu cực chi phối.`,
      `Đừng trì hoãn các quyết định quan trọng.`,
      `Tránh làm việc quá sức mà không nghỉ ngơi.`,
      `Hạn chế tranh cãi không cần thiết.`
    ],
    energyTips: [
      `Viết nhật ký mỗi sáng để kết nối năng lượng.`,
      `Dọn dẹp không gian sống giữa tháng để làm mới.`,
      `Thiền 10 phút cuối tháng để tái tạo tinh thần.`
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
  const period = { number: calculateNumber(birthDate), text: dateInfo.currentMonth };
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