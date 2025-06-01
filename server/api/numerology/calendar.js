import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Tính số chủ đạo
function getLifePathNumber(date) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) return 9;
  const [day, month, year] = date.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) return 9;
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

// Tính số năm cá nhân
function getPersonalYearNumber(birthDate, calendarYear) {
  const [day, month] = birthDate.split('/').map(Number);
  return NumerologyUtils.reduceToSingleDigit(day + month + calendarYear) || 1;
}

// Tính số tháng cá nhân
function getPersonalMonthNumber(personalYearNumber, month) {
  return NumerologyUtils.reduceToSingleDigit(personalYearNumber + month) || 1;
}

// Tính số năng lượng ngày
function getDailyEnergyNumber(personalMonthNumber, day) {
  return NumerologyUtils.reduceToSingleDigit(personalMonthNumber + day) || 1;
}

// Tạo danh sách ngày trong năm
function getDaysInYear(year) {
  const days = [];
  for (let month = 1; month <= 12; month++) {
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
      const date = `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
      days.push(date);
    }
  }
  return days;
}

export default defineEventHandler(async (event) => {
  const { date, year, ownerName = 'Người dùng' } = await readBody(event);

  // Xác thực đầu vào
  if (!date || !year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: date và year là bắt buộc.',
    });
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ngày phải có định dạng DD/MM/YYYY.',
    });
  }

  const calendarYear = Number(year);
  if (isNaN(calendarYear) || calendarYear < 1900 || calendarYear > 2100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Năm phải từ 1900 đến 2100.',
    });
  }

  const lifePathNumber = getLifePathNumber(date);
  const personalYearNumber = getPersonalYearNumber(date, calendarYear);
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[lifePathNumber] || NUMEROLOGY_MEANINGS.lifePath[1];
  const personalYearData = NUMEROLOGY_MEANINGS.personalYear[personalYearNumber] || NUMEROLOGY_MEANINGS.personalYear[1];

  const prompt = `Dựa trên thần số học với số chủ đạo ${lifePathNumber} (${lifePathData.theme}), ngày sinh "${date}", tên "${ownerName}", và năm lịch ${calendarYear}. Trả về JSON hợp lệ với phần "numerology" chứa các trường sau:
    1. "yearly": 
       - "personalYear": Số năm cá nhân ${personalYearNumber},
       - "yearlyDesc": Mô tả ngắn gọn (3-5 câu) về năng lượng của ${personalYearData.theme}, tiềm năng và lời khuyên cho năm ${calendarYear} bằng tiếng Việt.
    2. "monthly": Mảng 12 phần tử (tháng 1-12), mỗi phần tử có:
       - "month": Số tháng (1-12),
       - "personalMonth": Số tháng cá nhân,
       - "monthDesc": Mô tả ngắn (2-3 câu) về năng lượng tháng, dựa trên số năm cá nhân ${personalYearNumber} và số chủ đạo ${lifePathNumber}, bằng tiếng Việt.
    3. "daily": Mảng các ngày trong năm ${calendarYear}, mỗi ngày có:
       - "date": Ngày dạng "DD/MM/YYYY",
       - "dailyEnergy": Số năng lượng ngày,
       - "dailyDesc": Mô tả ngắn (1-2 câu) về năng lượng ngày, liên kết với số tháng cá nhân và số chủ đạo ${lifePathNumber}, bằng tiếng Việt.
    Không thêm thông tin ngoài các trường trên. Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.numerology || !data.numerology.yearly || !data.numerology.monthly || !data.numerology.daily) {
      throw new Error('Gemini API không trả về dữ liệu hợp lệ');
    }
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error);
    return getFallbackResponse(lifePathNumber, personalYearNumber, date, calendarYear, ownerName, lifePathData, personalYearData);
  }
});

function getFallbackResponse(lifePathNumber, personalYearNumber, birthDate, calendarYear, ownerName, lifePathData, personalYearData) {
  // Tạo dữ liệu tháng
  const monthly = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    const personalMonthNumber = getPersonalMonthNumber(personalYearNumber, month);
    const monthData = NUMEROLOGY_MEANINGS.personalMonth[personalMonthNumber] || NUMEROLOGY_MEANINGS.personalMonth[1];
    return {
      month,
      personalMonth: personalMonthNumber,
      monthDesc: `Tháng ${month}/${calendarYear} mang số ${personalMonthNumber}, tập trung vào ${monthData.focus.toLowerCase()}. Hãy tận dụng ${lifePathData.theme.toLowerCase()} để đạt hiệu quả.`,
    };
  });

  // Tạo dữ liệu ngày
  const daily = getDaysInYear(calendarYear).map(date => {
    const [day, month] = date.split('/').map(Number);
    const personalMonthNumber = getPersonalMonthNumber(personalYearNumber, month);
    const dailyEnergy = getDailyEnergyNumber(personalMonthNumber, day);
    const dailyData = NUMEROLOGY_MEANINGS.dailyEnergy[dailyEnergy] || NUMEROLOGY_MEANINGS.dailyEnergy[1];
    return {
      date,
      dailyEnergy,
      dailyDesc: `Ngày ${date} mang năng lượng số ${dailyEnergy}, khuyến khích ${dailyData.energy.toLowerCase()}.`,
    };
  });

  return {
    numerology: {
      yearly: {
        personalYear: personalYearNumber,
        yearlyDesc: `Năm ${calendarYear} là năm số ${personalYearNumber}, mang năng lượng ${personalYearData.theme.toLowerCase()}. Đây là thời điểm để ${personalYearData.focus.toLowerCase()}. Hãy tận dụng ${lifePathData.theme.toLowerCase()} để phát triển.`,
      },
      monthly,
      daily,
    },
  };
}