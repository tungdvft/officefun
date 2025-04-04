import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import { getCurrentDateInfo, calculateNumber, calculatePersonalYear, getPersonalYearMeaning } from '../utils/numerologyUtils';

// Timeout configuration
const GEMINI_TIMEOUT = 10000; // 10 seconds
const FALLBACK_RESPONSE_TIMEOUT = 3000; // 3 seconds

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  
  try {
    const { name, birthDate } = await readBody(event);

    // Validate input
    if (!name || !birthDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
      });
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng định dạng DD/MM/YYYY.'
      });
    }

    // Calculate basic numerology data
    const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
    const currentYearNum = parseInt(currentYear);
    
    const periods = {
      day: { number: calculateNumber(birthDate, 'day'), text: `ngày ${currentDate}` },
      week: { number: calculateNumber(birthDate, 'week'), text: `tuần ${currentWeek}` },
      month: { number: calculateNumber(birthDate, 'month'), text: `tháng ${currentMonth}` },
      year: { number: calculateNumber(birthDate, 'year'), text: `năm ${currentYear}` }
    };

    // Calculate 10-year cycles
    const cycles = {};
    for (let i = 0; i < 10; i++) {
      const targetYear = currentYearNum + i;
      const personalYearNumber = calculatePersonalYear(birthDate, targetYear);
      cycles[targetYear] = {
        number: personalYearNumber,
        description: getPersonalYearMeaning(personalYearNumber)
      };
    }

    // Prepare Gemini prompt
    const randomSeed = Math.floor(Math.random() * 10000);
    const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    
    const prompt = `Dựa trên thần số học, phân tích cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}:
      1. Ngày ${currentDate} (số ${periods.day.number})
      2. Tuần ${currentWeek} (số ${periods.week.number})
      3. Tháng ${currentMonth} (số ${periods.month.number})
      4. Năm ${currentYear} (số ${periods.year.number})
      Trả về JSON: { "day": {}, "week": {}, "month": {}, "year": {} }, mỗi object chứa:
      - "number": Số cá nhân.
      - "description": Diễn giải (5-6 câu), bắt đầu bằng "${name}", giọng điệu tự nhiên như trò chuyện.
      - "shouldDo": 4-5 câu gợi ý việc làm, thoải mái như lời khuyên bạn bè.
      - "shouldAvoid": 3-4 câu về việc tránh, nhẹ nhàng.
      - "lunchSuggestion": Chỉ cho "day" (2-3 câu), món ăn trưa ngẫu nhiên dựa trên seed ${randomSeed} và số ${periods.day.number}, không lặp "bún chả Hà Nội".
      Giọng tự nhiên, chỉ trả JSON!`;

    console.log('[Numerology API] Processing request for:', name, birthDate);
    
    // Call Gemini API with timeout
    let geminiResponse;
    try {
      geminiResponse = await Promise.race([
        callGeminiApi(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API timeout')), GEMINI_TIMEOUT)
        )
      ]);
    } catch (geminiError) {
      console.error('[Numerology API] Gemini API error:', geminiError.message);
      throw new Error('Không thể kết nối với dịch vụ phân tích. Vui lòng thử lại sau.');
    }

    // Validate Gemini response
    if (!geminiResponse || 
        !geminiResponse.day || 
        !geminiResponse.week || 
        !geminiResponse.month || 
        !geminiResponse.year) {
      throw new Error('Dữ liệu phân tích không đầy đủ');
    }

    // Prepare response
    const response = {
      numerology: {
        periods: geminiResponse,
        cycles
      },
      meta: {
        processedIn: Date.now() - startTime,
        timestamp
      }
    };

    console.log(`[Numerology API] Successfully processed request in ${response.meta.processedIn}ms`);
    return response;

  } catch (error) {
    console.error('[Numerology API] Error:', error.message);
    
    // Fallback response with timeout protection
    try {
      const fallbackResponse = await Promise.race([
        getFallbackResponse(name, birthDate),
        new Promise((resolve) => 
          setTimeout(() => resolve(getBasicFallback(name, birthDate)), FALLBACK_RESPONSE_TIMEOUT)
        )
      ]);
      
      return fallbackResponse;
    } catch (fallbackError) {
      console.error('[Numerology API] Fallback failed:', fallbackError.message);
      throw createError({
        statusCode: 500,
        statusMessage: 'Lỗi hệ thống. Vui lòng thử lại sau.'
      });
    }
  }
});

// Optimized fallback response generator
function getFallbackResponse(name, birthDate) {
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
  
  const periods = {
    day: { number: calculateNumber(birthDate, 'day'), text: `hôm nay (${currentDate})` },
    week: { number: calculateNumber(birthDate, 'week'), text: `tuần này (${currentWeek})` },
    month: { number: calculateNumber(birthDate, 'month'), text: `tháng này (${currentMonth})` },
    year: { number: calculateNumber(birthDate, 'year'), text: `năm này (${currentYear})` }
  };

  // Lunch suggestions pool
  const lunchOptions = [
    `Hôm nay, một tô phở bò tái với rau thơm hợp với năng lượng số ${periods.day.number} lắm đấy. Món này nhẹ mà đủ chất để tiếp tục ngày dài.`,
    `Một đĩa cơm tấm sườn nướng với trứng ốp la nghe hấp dẫn phết cho trưa nay, hợp với số ${periods.day.number}. Hương vị đậm đà này khá đồng điệu với vibe của bạn.`,
    `Hôm nay thử bánh xèo giòn rụm với nước mắm chua ngọt đi, hợp năng lượng số ${periods.day.number} luôn. Món này vui miệng, ăn là thấy tươi mới ngay.`,
    `Một bát bún riêu cua kèm rau sống là lựa chọn ngon lành cho trưa nay với số ${periods.day.number}. Thanh mát, dễ chịu, đúng kiểu cân bằng ngày dài.`,
  ];
  
  const randomLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];

  // Calculate 10-year cycles for fallback
  const cycles = {};
  const currentYearNum = parseInt(currentYear);
  for (let i = 0; i < 10; i++) {
    const targetYear = currentYearNum + i;
    const personalYearNumber = calculatePersonalYear(birthDate, targetYear);
    cycles[targetYear] = {
      number: personalYearNumber,
      description: getPersonalYearMeaning(personalYearNumber)
    };
  }

  return {
    numerology: {
      periods: {
        day: generatePeriodResponse(name, periods.day, 'day', randomLunch),
        week: generatePeriodResponse(name, periods.week, 'week'),
        month: generatePeriodResponse(name, periods.month, 'month'),
        year: generatePeriodResponse(name, periods.year, 'year')
      },
      cycles
    },
    isFallback: true
  };
}

// Helper function to generate period responses
function generatePeriodResponse(name, period, type, lunchSuggestion = null) {
  const templates = {
    day: {
      description: `${name} hôm nay mang năng lượng của số ${period.number}, một ngày cần sự cân bằng giữa công việc và cảm xúc.`,
      shouldDo: [
        'Dành thời gian cho những việc cần sự tập trung cao độ',
        'Lắng nghe trực giác của bản thân',
        'Ghi chú lại những ý tưởng mới'
      ],
      shouldAvoid: [
        'Đưa ra quyết định vội vàng',
        'Bỏ qua các chi tiết nhỏ'
      ]
    },
    week: {
      description: `${name} trong ${period.text} sẽ trải nghiệm năng lượng số ${period.number}, một tuần với nhiều cơ hội mới.`,
      shouldDo: [
        'Tập trung vào các mục tiêu dài hạn',
        'Kết nối với những người có cùng chí hướng',
        'Thử nghiệm các phương pháp làm việc mới'
      ],
      shouldAvoid: [
        'Chần chừ các quyết định quan trọng',
        'Làm việc quá sức mà không nghỉ ngơi'
      ]
    },
    month: {
      description: `Tháng này với số ${period.number}, ${name} sẽ có cơ hội phát triển bản thân và sự nghiệp.`,
      shouldDo: [
        'Đầu tư vào kiến thức và kỹ năng mới',
        'Xây dựng các mối quan hệ chất lượng',
        'Lập kế hoạch tài chính rõ ràng'
      ],
      shouldAvoid: [
        'Tiêu xài không kiểm soát',
        'Bỏ qua các dấu hiệu sức khỏe'
      ]
    },
    year: {
      description: `Năm ${period.text} mang đến cho ${name} năng lượng số ${period.number}, một năm của sự phát triển và trưởng thành.`,
      shouldDo: [
        'Đặt ra các mục tiêu cụ thể và đo lường được',
        'Chăm sóc sức khỏe tinh thần',
        'Mở rộng mạng lưới quan hệ'
      ],
      shouldAvoid: [
        'Ôm đồm quá nhiều việc cùng lúc',
        'Bỏ qua các cơ hội học hỏi mới'
      ]
    }
  };

  const template = templates[type];
  return {
    number: period.number,
    description: template.description,
    shouldDo: template.shouldDo.join(' '),
    shouldAvoid: template.shouldAvoid.join(' '),
    ...(lunchSuggestion && { lunchSuggestion })
  };
}

// Minimal fallback when everything fails
function getBasicFallback(name, birthDate) {
  return {
    numerology: {
      periods: {
        day: { number: 1, description: `Hệ thống đang bận. ${name} hãy thử lại sau nhé.` },
        week: { number: 1, description: `Hệ thống đang bận. ${name} hãy thử lại sau nhé.` },
        month: { number: 1, description: `Hệ thống đang bận. ${name} hãy thử lại sau nhé.` },
        year: { number: 1, description: `Hệ thống đang bận. ${name} hãy thử lại sau nhé.` }
      },
      cycles: {}
    },
    isFallback: true
  };
}