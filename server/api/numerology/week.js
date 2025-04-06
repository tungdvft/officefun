import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const dayOfWeek = today.getDay() || 7;
  const startOfWeek = new Date(today);
  const startDayOffset = dayOfWeek - 1;
  startOfWeek.setDate(day - startDayOffset);
  const startDay = startOfWeek.getDate();
  const startMonth = startOfWeek.getMonth() + 1;
  const startYear = startOfWeek.getFullYear();
  return {
    currentWeek: `Tuần từ ${startDay < 10 ? '0' + startDay : startDay}/${startMonth < 10 ? '0' + startMonth : startMonth}/${startYear} - ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    startWeekDay: startDay,
    startWeekMonth: startMonth,
    startWeekYear: startYear
  };
}

function calculateNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { startWeekDay, startWeekMonth, startWeekYear } = getCurrentDateInfo();
  const sum = birthDay + birthMonth + startWeekDay + startWeekMonth + startWeekYear;
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
    Tuần ${dateInfo.currentWeek} (số ${period.number})
    Trả về CHỈ JSON: { "week": {} }, object chứa:
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
    periodData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()).week : rawData.week;
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
    description: `"${name}", tuần ${period.text} mang năng lượng số ${number}, biểu trưng cho ${meaning.theme.toLowerCase()}. Đây là tuần để bạn tập trung vào việc điều chỉnh nhịp sống của mình. Năng lượng này khuyến khích hành động nhanh nhưng vẫn cần cân nhắc kỹ lưỡng. Những cơ hội ngắn hạn sẽ xuất hiện nếu bạn biết nắm bắt. Hãy chú ý đến các mối quan hệ, chúng có thể hỗ trợ bạn. Mỗi bước đi trong tuần này đều góp phần vào tương lai gần. Sự linh hoạt là chìa khóa để vượt qua thử thách. Một tuần đầy tiềm năng đang chờ bạn khai phá!`,
    focus: ['Tập trung', 'Linh hoạt', 'Kết nối', 'Hành động'],
    keywords: ['năng lượng', 'cơ hội', 'thay đổi', 'phát triển', 'kết nối'],
    shouldDo: [
      `Lên danh sách 3 mục tiêu nhỏ cho tuần này.`,
      `Dành một buổi tối đi ăn cùng bạn bè hoặc gia đình.`,
      `Tập thể dục ít nhất 2 lần để giữ sức khỏe.`,
      `Gửi email cảm ơn ai đó đã giúp bạn gần đây.`,
      `Thử học một kỹ năng mới như nấu ăn.`,
      `Tổng kết tiến độ cuối tuần để chuẩn bị cho tuần sau.`
    ],
    shouldAvoid: [
      `Tránh để công việc dồn đến cuối tuần.`,
      `Hạn chế xem tin tức tiêu cực quá nhiều.`,
      `Đừng quên nghỉ ngơi giữa tuần để tránh kiệt sức.`,
      `Tránh đưa ra quyết định vội vàng mà chưa suy nghĩ.`,
      `Hạn chế tranh cãi không cần thiết với người khác.`
    ],
    energyTips: [
      `Thiền ngắn 5 phút đầu tuần để định hướng năng lượng.`,
      `Uống trà hoa cúc giữa tuần để thư giãn.`,
      `Đi dạo cuối tuần để tái tạo tinh thần.`
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
  const period = { number: calculateNumber(birthDate), text: dateInfo.currentWeek };
  const periodData = await getPeriodData(name, birthDate, period);

  return {
    numerology: { name, birthDate, periods: { week: periodData } },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };
});