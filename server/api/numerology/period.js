import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

// Utility functions
const padZero = (num) => num < 10 ? `0${num}` : num.toString();

function getCurrentDateInfo() {
  try {
    const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
    const day = today.getDate();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();

    const startOfWeek = new Date(today);
    const dayOfWeek = today.getDay() || 7;
    startOfWeek.setDate(day - (dayOfWeek - 1));
    
    return {
      currentDate: `${padZero(day)}/${padZero(month)}/${year}`,
      currentWeek: `Tuần từ ${padZero(startOfWeek.getDate())}/${padZero(startOfWeek.getMonth() + 1)}/${year} - ${padZero(day)}/${padZero(month)}/${year}`,
      currentMonth: `${padZero(month)}/${year}`,
      currentYear: year.toString()
    };
  } catch (error) {
    console.error('Error getting current date info:', error);
    const fallbackDate = new Date();
    return {
      currentDate: '01/01/2025',
      currentWeek: 'Tuần từ 01/01/2025 - 07/01/2025',
      currentMonth: '01/2025',
      currentYear: '2025'
    };
  }
}

function validateBirthDate(birthDate) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate);
}

function reduceToSingleDigit(num) {
  if (num === 11 || num === 22) return num; // Master numbers
  
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return num || 1;
}

function calculateNumber(birthDate, period) {
  if (!validateBirthDate(birthDate)) return 1;
  
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();

  let sum = 0;
  
  switch (period) {
    case 'day':
      const [day, month, year] = currentDate.split('/').map(Number);
      sum = birthDay + birthMonth + day + month + year;
      break;
    case 'week':
      const [startDay] = currentWeek.split(' - ')[0].split('/').map(Number);
      sum = birthDay + birthMonth + startDay + 3 + 2025; // 3 là số cố định từ code gốc
      break;
    case 'month':
      const [mon, yr] = currentMonth.split('/').map(Number);
      sum = birthDay + birthMonth + mon + yr;
      break;
    case 'year':
      sum = birthDay + birthMonth + parseInt(currentYear);
      break;
    default:
      return 1;
  }

  return reduceToSingleDigit(sum);
}

function calculatePersonalYear(birthDate, targetYear) {
  if (!validateBirthDate(birthDate)) return 1;
  
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  let sum = birthDay + birthMonth + targetYear;
  
  return reduceToSingleDigit(sum);
}

const PERSONAL_YEAR_MEANINGS = {
  1: 'Khởi đầu mới, thời điểm để hành động và độc lập.',
  2: 'Hợp tác, tập trung vào cảm xúc và kiên nhẫn.',
  3: 'Sáng tạo, giao tiếp, mang lại niềm vui và năng lượng.',
  4: 'Xây dựng nền tảng, ổn định, cần sự chăm chỉ.',
  5: 'Thay đổi, tự do, thích hợp cho phiêu lưu.',
  6: 'Trách nhiệm, yêu thương, chú trọng gia đình.',
  7: 'Tìm hiểu, nội tâm, thời gian cho tâm linh.',
  8: 'Thành công, quyền lực, cơ hội về tài chính.',
  9: 'Kết thúc chu kỳ, nhân đạo, thời điểm buông bỏ.',
  11: 'Trực giác mạnh, truyền cảm hứng cho bản thân và người khác.',
  22: 'Xây dựng lớn, biến ước mơ lớn thành hiện thực.'
};

function getPersonalYearMeaning(number) {
  return PERSONAL_YEAR_MEANINGS[number] || 'Không xác định';
}

function generateLunchSuggestion(dayNumber, seed) {
  const options = [
    `Hôm nay, một tô phở bò tái với rau thơm hợp với năng lượng số ${dayNumber} lắm đấy. Món này nhẹ mà đủ chất để tiếp tục ngày dài.`,
    `Một đĩa cơm tấm sườn nướng với trứng ốp la nghe hấp dẫn phết cho trưa nay, hợp với số ${dayNumber}. Hương vị đậm đà này khá đồng điệu với vibe của bạn.`,
    `Hôm nay thử bánh xèo giòn rụm với nước mắm chua ngọt đi, hợp năng lượng số ${dayNumber} luôn. Món này vui miệng, ăn là thấy tươi mới ngay.`,
    `Một bát bún riêu cua kèm rau sống là lựa chọn ngon lành cho trưa nay với số ${dayNumber}. Thanh mát, dễ chịu, đúng kiểu cân bằng ngày dài.`,
    `Bữa trưa với cơm gà xối mỡ sẽ mang lại năng lượng tích cực cho ngày số ${dayNumber}. Giòn giòn, thơm thơm, vừa no lại vừa ngon.`,
    `Hôm nay thử món bánh mì chảo kiểu Pháp nhé, hợp với năng lượng số ${dayNumber} lắm. Nhâm nhi cùng ly cà phê thì không gì bằng.`
  ];
  
  // Sử dụng seed để tạo số ngẫu nhiên ổn định
  const randomIndex = Math.floor((seed % 100) * 0.01 * options.length);
  return options[randomIndex] || options[0];
}

function getFallbackResponse(name, birthDate) {
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
  const dayNumber = calculateNumber(birthDate, 'day');
  const weekNumber = calculateNumber(birthDate, 'week');
  const monthNumber = calculateNumber(birthDate, 'month');
  const yearNumber = calculateNumber(birthDate, 'year');
  
  const randomSeed = Math.floor(Math.random() * 10000);
  
  return {
    numerology: {
      day: {
        number: dayNumber,
        description: `${name} hôm nay mang năng lượng của số ${dayNumber}, cảm giác như một ngày đầy trách nhiệm nhưng cũng cần chút thư giãn. Có thể bạn sẽ gặp vài tình huống cần sự khéo léo.`,
        shouldDo: `Hôm nay, dành thời gian với gia đình hay bạn bè thân thiết chắc chắn vui lắm. Xử lý mọi việc nhẹ nhàng, khéo léo một chút là mọi thứ sẽ ổn.`,
        shouldAvoid: `Đừng sa vào mấy cuộc cãi nhau căng thẳng hay quyết định gì vội vàng hôm nay, dễ mệt lắm.`,
        lunchSuggestion: generateLunchSuggestion(dayNumber, randomSeed)
      },
      week: {
        number: weekNumber,
        description: `${name} trong ${currentWeek} sẽ thấy năng lượng số ${weekNumber} khá rõ. Đây là tuần để tập trung sắp xếp mọi thứ, làm việc gì cũng cần chút quyết tâm.`,
        shouldDo: `Tập trung vào mấy việc cần sắp xếp hay lên kế hoạch, tuần này hợp lắm. Quản lý thời gian, tiền bạc khéo một chút là sẽ thấy hiệu quả ngay.`,
        shouldAvoid: `Đừng để mấy chi tiết nhỏ bị bỏ qua, tuần này cần sự cẩn thận. Hạn chế tiêu xài bốc đồng.`
      },
      month: {
        number: monthNumber,
        description: `${name} trong ${currentMonth} sẽ cảm nhận năng lượng số ${monthNumber}, kiểu như một khởi đầu đầy hứng khởi. Đây là lúc bạn thấy động lực dâng trào.`,
        shouldDo: `Làm mấy việc cần sự độc lập hay sáng tạo sẽ rất hợp tháng này. Bắt đầu dự án mới hay đưa ra quyết định lớn cũng là thời điểm tốt.`,
        shouldAvoid: `Đừng để mấy cuộc cãi vã nhỏ làm bạn mất hứng, tháng này dễ nóng tính chút. Hạn chế dựa vào người khác quá nhiều.`
      },
      year: {
        number: yearNumber,
        description: `${name} trong năm ${currentYear} sẽ thấy năng lượng số ${yearNumber} dẫn dắt. Đây là giai đoạn để tập trung vào những thành tựu lớn.`,
        shouldDo: `Tập trung vào mấy dự án lớn, cần sự tổ chức là hợp nhất trong năm nay. Quản lý tiền bạc, thời gian khéo léo sẽ giúp bạn đi xa.`,
        shouldAvoid: `Đừng bỏ qua mấy chi tiết nhỏ, năm này cần sự chính xác. Hạn chế làm gì bốc đồng hay tiêu xài không kiểm soát.`
      }
    }
  };
}

export default defineEventHandler(async (event) => {
  try {
    const startTime = Date.now();
    const { name, birthDate } = await readBody(event);

    if (!name || !birthDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
      });
    }

    // Validate birthDate format
    if (!validateBirthDate(birthDate)) {
      console.warn(`Invalid birthDate format: ${birthDate}`);
    }

    const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
    const currentYearNum = parseInt(currentYear);
    
    // Tính toán các con số trước khi gọi API
    const periods = {
      day: { number: calculateNumber(birthDate, 'day'), text: `ngày ${currentDate}` },
      week: { number: calculateNumber(birthDate, 'week'), text: `tuần ${currentWeek}` },
      month: { number: calculateNumber(birthDate, 'month'), text: `tháng ${currentMonth}` },
      year: { number: calculateNumber(birthDate, 'year'), text: `năm ${currentYear}` }
    };

    // Tính chu kỳ vận số cho 10 năm
    const cycles = {};
    for (let i = 0; i < 10; i++) {
      const targetYear = currentYearNum + i;
      const personalYearNumber = calculatePersonalYear(birthDate, targetYear);
      cycles[targetYear] = {
        number: personalYearNumber,
        description: getPersonalYearMeaning(personalYearNumber)
      };
    }

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

    console.log('Sending prompt to Gemini:', prompt);
    
    let geminiResponse;
    try {
      geminiResponse = await callGeminiApi(prompt);
      console.log('Received response from Gemini:', JSON.stringify(geminiResponse, null, 2));
      
      if (!geminiResponse || typeof geminiResponse !== 'object') {
        throw new Error('Invalid response format from Gemini');
      }
      
      // Validate response structure
      const requiredPeriods = ['day', 'week', 'month', 'year'];
      const isValidResponse = requiredPeriods.every(period => 
        geminiResponse[period] && 
        typeof geminiResponse[period] === 'object' &&
        'number' in geminiResponse[period] &&
        'description' in geminiResponse[period]
      );
      
      if (!isValidResponse) {
        throw new Error('Gemini response missing required fields');
      }
    } catch (geminiError) {
      console.error('Error calling Gemini API:', geminiError);
      geminiResponse = getFallbackResponse(name, birthDate).numerology;
    }

    const responseTime = Date.now() - startTime;
    console.log(`API processed in ${responseTime}ms`);
    
    return {
      numerology: {
        periods: geminiResponse,
        cycles
      },
      meta: {
        processedIn: `${responseTime}ms`,
        timestamp
      }
    };
    
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof Error && error.message.includes('Thiếu thông tin')) {
      throw createError({
        statusCode: 400,
        statusMessage: error.message
      });
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Đã xảy ra lỗi khi xử lý yêu cầu. Vui lòng thử lại sau.'
    });
  }
});