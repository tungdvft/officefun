import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Lấy thông tin ngày hiện tại theo múi giờ Việt Nam
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
    currentDate: `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentWeek: `Tuần từ ${startDay < 10 ? '0' + startDay : startDay}/${startMonth < 10 ? '0' + startMonth : startMonth}/${startYear} - ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentMonth: `${month < 10 ? '0' + month : month}/${year}`,
    currentYear: `${year}`,
    day,
    month,
    year,
    dayOfWeek,
    startWeekDay: startDay,
    startWeekMonth: startMonth,
    startWeekYear: startYear
  };
}

// Tính số cá nhân cho các chu kỳ
function calculateNumber(birthDate, period) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { day, month, year, startWeekDay, startWeekMonth, startWeekYear } = getCurrentDateInfo();

  let sum;
  switch (period) {
    case 'day': sum = birthDay + birthMonth + day + month + year; break;
    case 'week': sum = birthDay + birthMonth + startWeekDay + startWeekMonth + startWeekYear; break;
    case 'month': sum = birthDay + birthMonth + month + year; break;
    case 'year': sum = birthDay + birthMonth + year; break;
    default: return 1;
  }
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Gọi Gemini API với timeout
async function callGeminiApiWithTimeout(prompt, timeoutMs = 4000) {
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

// Tạo dữ liệu chu kỳ từ Gemini hoặc fallback
async function getPeriodData(name, birthDate, periods) {
  const dateInfo = getCurrentDateInfo();
  const randomSeed = Math.floor(Math.random() * 10000);
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

  const prompt = `Dựa trên thần số học, phân tích cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}:
    1. Ngày ${dateInfo.currentDate} (số ${periods.day.number})
    2. Tuần ${dateInfo.currentWeek} (số ${periods.week.number})
    3. Tháng ${dateInfo.currentMonth} (số ${periods.month.number})
    4. Năm ${dateInfo.currentYear} (số ${periods.year.number})
    Trả về CHỈ JSON: { "day": {}, "week": {}, "month": {}, "year": {} }, mỗi object chứa:
    - "number": Số cá nhân.
    - "theme": Chủ đề chính (ví dụ: "Khởi đầu").
    - "description": Diễn giải (4-5 câu), bắt đầu bằng "${name}", giọng tự nhiên, phù hợp chu kỳ.
    - "focus": Mảng 3 yếu tố cần tập trung.
    - "keywords": Mảng 3 từ khóa nổi bật.
    - "shouldDo": Mảng 3 câu gợi ý việc nên làm, cụ thể theo chu kỳ.
    - "shouldAvoid": Mảng 3 câu việc nên tránh, cụ thể theo chu kỳ.
    - "energyTips": Mảng 2 câu mẹo cân bằng năng lượng.
    - "lunchSuggestion": Chỉ cho "day", mảng 2 câu gợi ý món ăn trưa dựa trên số ${periods.day.number}.`;

  let periodsData;
  try {
    const rawData = await callGeminiApiWithTimeout(prompt, 4000);
    periodsData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()) : rawData;

    if (!periodsData.day || !periodsData.week || !periodsData.month || !periodsData.year) {
      throw new Error('Dữ liệu từ Gemini không đầy đủ');
    }
  } catch (error) {
    periodsData = generateFallbackPeriods(name, birthDate, periods);
  }

  return periodsData;
}

// Tạo dữ liệu fallback tối ưu
function generateFallbackPeriods(name, birthDate, periods) {
  const dateInfo = getCurrentDateInfo();
  const lunchOptions = [
    `Thử cơm gà xối mỡ nóng hổi, hợp với số ${periods.day.number}.`,
    `Salad cá hồi sốt chanh dây để cân bằng năng lượng hôm nay.`
  ];

  const generatePeriodData = (periodKey, periodData) => {
    const number = periodData.number in NUMEROLOGY_MEANINGS.personalYear ? periodData.number : 1;
    const meaning = NUMEROLOGY_MEANINGS.personalYear[number];

    let description, shouldDo, shouldAvoid, energyTips;
    switch (periodKey) {
      case 'day':
        description = `"${name}", ngày ${periodData.text} mang năng lượng số ${number}, đại diện cho ${meaning.theme.toLowerCase()}. Đây là ngày để bạn tập trung vào thay đổi nhỏ. Năng lượng này khuyến khích sự linh hoạt. Một ngày đầy tiềm năng đang chờ bạn!`;
        shouldDo = [
          `Lập kế hoạch ngắn cho ngày để tận dụng năng lượng.`,
          `Thử một việc mới nhỏ để kích thích sáng tạo.`,
          `Dành 10 phút nghỉ ngơi để tái tạo sức lực.`
        ];
        shouldAvoid = [
          `Tránh trì hoãn công việc quan trọng hôm nay.`,
          `Hạn chế tranh cãi để giữ hòa khí.`,
          `Đừng làm việc quá sức, giữ sức khỏe.`
        ];
        energyTips = [
          `Hít thở sâu 5 phút để khởi động ngày mới.`,
          `Uống nước chanh ấm để duy trì năng lượng.`
        ];
        break;
      case 'week':
        description = `"${name}", tuần ${periodData.text} mang năng lượng số ${number}, biểu trưng cho ${meaning.theme.toLowerCase()}. Đây là tuần để bạn tận dụng cơ hội ngắn hạn. Năng lượng này thúc đẩy hành động nhanh. Một tuần hiệu quả đang chờ bạn!`;
        shouldDo = [
          `Lên danh sách 3 mục tiêu nhỏ cho tuần.`,
          `Dành thời gian kết nối với bạn bè.`,
          `Tập thể dục nhẹ để giữ sức khỏe.`
        ];
        shouldAvoid = [
          `Tránh để công việc dồn đến cuối tuần.`,
          `Hạn chế xem tin tức tiêu cực quá nhiều.`,
          `Đừng quên nghỉ ngơi giữa tuần.`
        ];
        energyTips = [
          `Thiền ngắn đầu tuần để định hướng năng lượng.`,
          `Đi dạo cuối tuần để tái tạo tinh thần.`
        ];
        break;
      case 'month':
        description = `"${name}", tháng ${periodData.text} mang năng lượng số ${number}, đại diện cho ${meaning.theme.toLowerCase()}. Đây là tháng để bạn định hướng mục tiêu lớn. Năng lượng này khuyến khích phát triển cá nhân. Một tháng ý nghĩa đang chờ bạn!`;
        shouldDo = [
          `Lập kế hoạch chi tiết cho tháng này.`,
          `Thử học một kỹ năng mới để phát triển.`,
          `Dành thời gian tổng kết cuối tháng.`
        ];
        shouldAvoid = [
          `Tránh chi tiêu quá mức đầu tháng.`,
          `Hạn chế để cảm xúc tiêu cực chi phối.`,
          `Đừng trì hoãn các quyết định quan trọng.`
        ];
        energyTips = [
          `Viết nhật ký mỗi sáng để kết nối năng lượng.`,
          `Dọn dẹp không gian sống giữa tháng.`
        ];
        break;
      case 'year':
        description = `"${name}", năm ${periodData.text} mang năng lượng số ${number}, biểu trưng cho ${meaning.theme.toLowerCase()}. Đây là năm để đặt nền móng tương lai. Năng lượng này mang đến cơ hội lớn. Một năm đáng nhớ đang chờ bạn!`;
        shouldDo = [
          `Đặt 3 mục tiêu lớn cho năm nay.`,
          `Tham gia một khóa học để nâng cao bản thân.`,
          `Tổng kết thành tựu cuối năm.`
        ];
        shouldAvoid = [
          `Tránh đầu tư mạo hiểm mà không cân nhắc.`,
          `Hạn chế giữ mối quan hệ tiêu cực.`,
          `Đừng quên nghỉ ngơi giữa các kế hoạch.`
        ];
        energyTips = [
          `Thiền định mỗi tháng để duy trì năng lượng.`,
          `Đi dạo ngoài trời cuối năm để tái tạo.`
        ];
        break;
    }

    return {
      number,
      theme: meaning.theme,
      description,
      focus: meaning.focus.slice(0, 3),
      keywords: meaning.keywords.slice(0, 3),
      shouldDo,
      shouldAvoid,
      energyTips,
      ...(periodKey === 'day' ? { lunchSuggestion: lunchOptions } : {})
    };
  };

  return {
    day: generatePeriodData('day', periods.day),
    week: generatePeriodData('week', periods.week),
    month: generatePeriodData('month', periods.month),
    year: generatePeriodData('year', periods.year)
  };
}

// API handler chính
export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
    });
  }

  const dateInfo = getCurrentDateInfo();
  const periods = {
    day: { number: calculateNumber(birthDate, 'day'), text: dateInfo.currentDate },
    week: { number: calculateNumber(birthDate, 'week'), text: dateInfo.currentWeek },
    month: { number: calculateNumber(birthDate, 'month'), text: dateInfo.currentMonth },
    year: { number: calculateNumber(birthDate, 'year'), text: dateInfo.currentYear }
  };

  const periodsData = await getPeriodData(name, birthDate, periods);

  return {
    numerology: {
      name,
      birthDate,
      periods: periodsData
    },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };
});