import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Lấy thông tin ngày hiện tại theo múi giờ Việt Nam
function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  // Tính ngày đầu tuần (thứ Hai)
  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay() || 7; // Sunday = 0 -> 7
  startOfWeek.setDate(day - (dayOfWeek - 1));
  const startDay = startOfWeek.getDate();
  const startMonth = startOfWeek.getMonth() + 1;
  const startYear = startOfWeek.getFullYear();

  return {
    currentDate: `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentWeek: `Tuần từ ${startDay < 10 ? '0' + startDay : startDay}/${startMonth < 10 ? '0' + startMonth : startMonth}/${startYear} - ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentMonth: `${month < 10 ? '0' + month : month}/${year}`,
    currentYear: `${year}`,
    day: day,
    month: month,
    year: year,
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
    case 'day':
      sum = birthDay + birthMonth + day + month + year;
      break;
    case 'week':
      // Dùng ngày đầu tuần (thứ Hai) để tính số tuần
      sum = birthDay + birthMonth + startWeekDay + startWeekMonth + startWeekYear;
      break;
    case 'month':
      sum = birthDay + birthMonth + month + year;
      break;
    case 'year':
      sum = birthDay + birthMonth + year;
      break;
    default:
      return 1;
  }

  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Tính số đường đời
function calculateLifePath(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const digits = birthDate.split('/').join('').split('').map(Number);
  return NumerologyUtils.reduceToSingleDigit(digits.reduce((a, b) => a + b, 0)) || 1;
}

export default defineEventHandler(async (event) => {
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
    });
  }

  const dateInfo = getCurrentDateInfo();
  const periods = {
    day: { number: calculateNumber(birthDate, 'day'), text: `ngày ${dateInfo.currentDate}` },
    week: { number: calculateNumber(birthDate, 'week'), text: `tuần ${dateInfo.currentWeek}` },
    month: { number: calculateNumber(birthDate, 'month'), text: `tháng ${dateInfo.currentMonth}` },
    year: { number: calculateNumber(birthDate, 'year'), text: `năm ${dateInfo.currentYear}` }
  };

  // Tính chu kỳ vận số 10 năm
  const cycles = {};
  const currentYearNum = parseInt(dateInfo.currentYear);
  for (let i = 0; i < 10; i++) {
    const targetYear = currentYearNum + i;
    const personalYearNumber = NumerologyUtils.calculatePersonalYear(birthDate, targetYear);
    const meaning = NUMEROLOGY_MEANINGS.personalYear[personalYearNumber] || NUMEROLOGY_MEANINGS.personalYear[1];
    cycles[targetYear] = {
      number: personalYearNumber,
      theme: meaning.theme,
      description: `Năm ${targetYear} mang năng lượng số ${personalYearNumber}: ${meaning.theme.toLowerCase()}. Đây là thời điểm để bạn ${meaning.focus[0].toLowerCase()} và phát triển ${meaning.focus[1].toLowerCase()}.`,
      focus: meaning.focus,
      keywords: meaning.keywords
    };
  }

  // Tính số đường đời
  const lifePathNumber = calculateLifePath(birthDate);
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[lifePathNumber] || NUMEROLOGY_MEANINGS.lifePath[1];

  // Prompt cho Gemini
  const randomSeed = Math.floor(Math.random() * 10000);
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
  const prompt = `Dựa trên thần số học, phân tích cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}:
    1. Ngày ${dateInfo.currentDate} (số ${periods.day.number})
    2. Tuần ${dateInfo.currentWeek} (số ${periods.week.number})
    3. Tháng ${dateInfo.currentMonth} (số ${periods.month.number})
    4. Năm ${dateInfo.currentYear} (số ${periods.year.number})
    Trả về CHỈ JSON (không thêm text thừa): { "day": {}, "week": {}, "month": {}, "year": {} }, mỗi object chứa:
    - "number": Số cá nhân.
    - "theme": Chủ đề chính (ví dụ: "Khởi đầu", "Sáng tạo").
    - "description": Diễn giải (5-6 câu), bắt đầu bằng "${name}", giọng tự nhiên.
    - "focus": Mảng 3 yếu tố cần tập trung.
    - "keywords": Mảng 3 từ khóa.
    - "shouldDo": 4-5 câu gợi ý việc làm, thoải mái.
    - "shouldAvoid": 3-4 câu về việc tránh, nhẹ nhàng.
    - "lunchSuggestion": Chỉ cho "day" (2-3 câu), món ăn trưa ngẫu nhiên dựa trên seed ${randomSeed} và số ${periods.day.number}, không lặp "bún chả Hà Nội".`;

  let periodsData;
  try {
    console.log('Sending prompt to Gemini:', prompt);
    const rawData = await callGeminiApi(prompt);
    console.log('Raw Gemini Response:', rawData);

    if (typeof rawData === 'string') {
      try {
        periodsData = JSON.parse(rawData);
      } catch (parseError) {
        console.error('Failed to parse Gemini response as JSON:', parseError.message);
        const jsonMatch = rawData.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          periodsData = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Gemini API không trả về JSON hợp lệ');
        }
      }
    } else if (typeof rawData === 'object' && rawData !== null) {
      periodsData = rawData;
    } else {
      throw new Error('Gemini API không trả về JSON hợp lệ');
    }

    if (!periodsData.day || !periodsData.week || !periodsData.month || !periodsData.year) {
      throw new Error('Gemini API không trả về cấu trúc dữ liệu đầy đủ');
    }
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    periodsData = getFallbackResponse(name, birthDate, periods).numerology;
  }

  return {
    numerology: {
      name,
      birthDate,
      lifePathNumber: {
        number: lifePathNumber,
        theme: lifePathData.theme,
        symbol: lifePathData.symbol,
        description: `Số đường đời ${lifePathNumber} cho thấy bạn là ${lifePathData.theme.toLowerCase()}. ${lifePathData.purpose}.`,
        strengths: lifePathData.strengths,
        challenges: lifePathData.challenges,
        careers: lifePathData.careers,
        advice: lifePathData.advice
      },
      periods: periodsData,
      cycles
    },
    meta: {
      processedIn: `${Date.now() - event.node.req.startTime}ms`,
      timestamp: timestamp,
      source: 'xai-grok'
    }
  };
});

// Fallback response
function getFallbackResponse(name, birthDate, periods) {
  const lunchOptions = [
    `Hôm nay, một tô phở bò tái với rau thơm hợp với năng lượng số ${periods.day.number} lắm đấy.`,
    `Một đĩa cơm tấm sườn nướng với trứng ốp la nghe hấp dẫn phết cho trưa nay, hợp với số ${periods.day.number}.`,
    `Hôm nay thử bánh xèo giòn rụm với nước mắm chua ngọt đi, hợp năng lượng số ${periods.day.number} luôn.`,
    `Một bát bún riêu cua kèm rau sống là lựa chọn ngon lành cho trưa nay với số ${periods.day.number}.`
  ];
  const randomLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];

  const generatePeriodData = (periodKey, periodData) => {
    const validNumber = NUMEROLOGY_MEANINGS.personalYear[periodData.number] ? periodData.number : 1;
    const meaning = NUMEROLOGY_MEANINGS.personalYear[validNumber] || NUMEROLOGY_MEANINGS.personalYear[1];

    return {
      number: validNumber,
      theme: meaning.theme,
      description: `"${name}" ${periodData.text} mang năng lượng số ${validNumber}, ${meaning.theme.toLowerCase()}. Đây là thời điểm để bạn ${meaning.focus[0].toLowerCase()} và tận dụng ${meaning.focus[1].toLowerCase()}. Năng lượng này sẽ giúp bạn tiến gần hơn đến mục tiêu nếu bạn biết cách điều chỉnh. Một chút thay đổi nhỏ có thể tạo hiệu ứng lớn đấy. Hãy tin vào trực giác và để mọi thứ diễn ra tự nhiên nhé.`,
      focus: meaning.focus,
      keywords: meaning.keywords,
      shouldDo: `Hãy thử ${meaning.focus[0].toLowerCase()} một chút trong ${periodData.text}, sẽ rất hợp vibe. Tập trung vào ${meaning.focus[1].toLowerCase()}, bạn sẽ thấy mọi thứ dần rõ ràng hơn. Làm gì đó mới mẻ liên quan đến ${meaning.keywords[0].toLowerCase()} cũng đáng thử. Đừng ngại bước ra ngoài và tận hưởng nhé!`,
      shouldAvoid: `Tránh để bản thân bị cuốn vào sự ${meaning.keywords[1].toLowerCase()} quá mức, dễ mất cân bằng. Đừng quá ép buộc mọi thứ, cứ thư giãn một chút. Hạn chế những suy nghĩ tiêu cực, chúng không giúp gì đâu.`
    };
  };

  return {
    numerology: {
      day: {
        ...generatePeriodData('day', periods.day),
        lunchSuggestion: randomLunch
      },
      week: generatePeriodData('week', periods.week),
      month: generatePeriodData('month', periods.month),
      year: generatePeriodData('year', periods.year)
    }
  };
}