import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Lấy thông tin ngày hiện tại theo múi giờ Việt Nam
function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  const dayOfWeek = today.getDay() || 7; // Sunday = 0 -> 7

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

// Tính số đường đời
function calculateLifePath(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const digits = birthDate.split('/').join('').split('').map(Number);
  return NumerologyUtils.reduceToSingleDigit(digits.reduce((a, b) => a + b, 0)) || 1;
}

// Tạo dữ liệu chu kỳ từ Gemini hoặc fallback
async function getPeriodData(name, birthDate, periods) {
  const dateInfo = getCurrentDateInfo();
  const randomSeed = Math.floor(Math.random() * 10000);
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

  // Prompt đã sửa lỗi period -> periods[periodKey]
  const prompt = `Dựa trên thần số học, phân tích cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}:
    1. Ngày ${dateInfo.currentDate} (số ${periods.day.number}, ${dateInfo.dayOfWeek <= 3 ? 'đầu tuần' : dateInfo.dayOfWeek <= 5 ? 'giữa tuần' : 'cuối tuần'})
    2. Tuần ${dateInfo.currentWeek} (số ${periods.week.number})
    3. Tháng ${dateInfo.currentMonth} (số ${periods.month.number}, ${dateInfo.day <= 10 ? 'đầu tháng' : dateInfo.day <= 20 ? 'giữa tháng' : 'cuối tháng'})
    4. Năm ${dateInfo.currentYear} (số ${periods.year.number})
    Trả về CHỈ JSON (không thêm text thừa): { "day": {}, "week": {}, "month": {}, "year": {} }, mỗi object chứa:
    - "number": Số cá nhân.
    - "theme": Chủ đề chính (ví dụ: "Khởi đầu", "Sáng tạo").
    - "description": Diễn giải (5-6 câu), bắt đầu bằng "${name}", giọng tự nhiên, phù hợp chu kỳ (ngày ngắn hạn, năm dài hạn).
    - "focus": Mảng 3 yếu tố cần tập trung.
    - "keywords": Mảng 3 từ khóa.
    - "shouldDo": 4-5 câu gợi ý việc nên làm, cụ thể theo thời điểm (ngày: đầu/giữa/cuối tuần; tháng: đầu/giữa/cuối tháng; tuần/năm: kế hoạch chung), dựa trên số cá nhân tương ứng, thoải mái.
    - "shouldAvoid": 3-4 câu việc nên tránh, cụ thể theo thời điểm, dựa trên số cá nhân tương ứng, nhẹ nhàng.
    - "lunchSuggestion": Chỉ cho "day" (2-3 câu), món ăn trưa ngẫu nhiên dựa trên seed ${randomSeed} và số ${periods.day.number}, không lặp "bún chả Hà Nội".`;

  let periodsData;
  try {
    console.log('Sending prompt to Gemini:', prompt);
    const startTime = Date.now();
    const rawData = await callGeminiApi(prompt);
    console.log('Raw Gemini Response:', rawData);
    console.log('Gemini call took:', `${Date.now() - startTime}ms`);

    if (typeof rawData === 'string') {
      periodsData = JSON.parse(rawData.replace(/```json|```/g, '').trim());
    } else if (typeof rawData === 'object' && rawData !== null) {
      periodsData = rawData;
    } else {
      throw new Error('Gemini API không trả về dữ liệu hợp lệ');
    }

    if (!periodsData.day || !periodsData.week || !periodsData.month || !periodsData.year) {
      throw new Error('Gemini API không trả về cấu trúc dữ liệu đầy đủ');
    }
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    periodsData = generateFallbackPeriods(name, birthDate, periods);
  }

  return periodsData;
}

// Tạo dữ liệu fallback cải tiến
function generateFallbackPeriods(name, birthDate, periods) {
  const dateInfo = getCurrentDateInfo();
  const isStartOfWeek = dateInfo.dayOfWeek <= 3;
  const isMidWeek = dateInfo.dayOfWeek >= 4 && dateInfo.dayOfWeek <= 5;
  const isEndOfWeek = dateInfo.dayOfWeek >= 6 || dateInfo.dayOfWeek === 1;
  const isStartOfMonth = dateInfo.day <= 10;
  const isMidMonth = dateInfo.day > 10 && dateInfo.day <= 20;
  const isEndOfMonth = dateInfo.day > 20;

  const lunchOptions = [
    `Hôm nay, một tô phở bò tái với rau thơm sẽ tiếp thêm năng lượng cho số ${periods.day.number}.`,
    `Một đĩa cơm tấm sườn nướng với trứng ốp la là lựa chọn tuyệt vời cho trưa nay, hợp với số ${periods.day.number}.`,
    `Thử bánh xèo giòn rụm với nước mắm chua ngọt đi, rất hợp với năng lượng số ${periods.day.number}.`,
    `Một bát bún riêu cua kèm rau sống sẽ làm trưa nay thêm ngon, phù hợp số ${periods.day.number}.`
  ];
  const randomLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];

  const generatePeriodData = (periodKey, periodData) => {
    const validNumber = NUMEROLOGY_MEANINGS.personalYear[periodData.number] ? periodData.number : 1;
    const meaning = NUMEROLOGY_MEANINGS.personalYear[validNumber] || NUMEROLOGY_MEANINGS.personalYear[1];

    let shouldDo, shouldAvoid;

    switch (periodKey) {
      case 'day':
        if (isStartOfWeek) {
          shouldDo = `Hôm nay là đầu tuần, hãy bắt đầu bằng cách viết ra 3 việc cần làm trong ngày để định hướng rõ ràng. Thử gọi điện cho một người bạn để chia sẻ ý tưởng mới, hợp với năng lượng ${meaning.theme.toLowerCase()}. Dành 10 phút buổi trưa để nghe một bài nhạc yêu thích, nạp lại tinh thần. Nếu có thể, đi bộ ngắn sau giờ làm để thư giãn.`;
          shouldAvoid = `Đừng để những email tồn đọng từ tuần trước làm bạn phân tâm hôm nay. Tránh bắt đầu ngày bằng việc lướt mạng xã hội quá lâu, dễ mất động lực. Hạn chế uống cà phê quá nhiều ngay sáng sớm, thay bằng trà nhẹ nhé.`;
        } else if (isMidWeek) {
          shouldDo = `Giữa tuần rồi, hãy hoàn thành một email quan trọng hoặc tin nhắn còn dang dở để cảm thấy nhẹ nhõm. Thử vẽ một bức doodle nhỏ trong giờ nghỉ, phù hợp với ${meaning.theme.toLowerCase()}. Tối nay, xem một video ngắn về chủ đề bạn thích để thư giãn. Đừng quên uống đủ nước trong ngày nhé!`;
          shouldAvoid = `Tránh nhận thêm deadline gấp vào giữa tuần, dễ làm bạn căng thẳng. Đừng để những cuộc trò chuyện phiếm kéo dài làm mất thời gian. Hạn chế ăn đồ chiên rán quá nhiều hôm nay, giữ sức khỏe tốt hơn.`;
        } else if (isEndOfWeek) {
          shouldDo = `Cuối tuần đến, hãy dành 30 phút để sắp xếp lại lịch tuần sau, chuẩn bị tinh thần tốt. Thử ra ngoài uống cà phê với bạn bè để đổi gió, hợp với ${meaning.theme.toLowerCase()}. Tối nay, xem một bộ phim nhẹ nhàng hoặc đọc vài trang sách. Kết thúc ngày bằng một cốc trà ấm nhé!`;
          shouldAvoid = `Đừng mang việc về nhà vào cuối tuần, hãy để đầu óc nghỉ ngơi. Tránh mua sắm online chỉ vì buồn chán, dễ tiêu quá tay. Hạn chế ngủ nướng quá lâu, giữ nhịp sinh học ổn định nhé.`;
        }
        break;

      case 'week':
        shouldDo = `Tuần này, hãy thử viết một bài blog ngắn hoặc ghi chú về mục tiêu cá nhân để định hình ý tưởng. Dành một buổi tối đi ăn cùng đồng nghiệp hoặc gia đình, tạo kết nối mới, hợp với ${meaning.theme.toLowerCase()}. Thử tập yoga hoặc chạy bộ ít nhất 2 lần để giữ năng lượng. Gửi một email cảm ơn ai đó đã giúp bạn gần đây nhé!`;
        shouldAvoid = `Đừng để những cuộc họp không cần thiết làm gián đoạn lịch trình tuần này. Tránh trì hoãn việc quan trọng đến cuối tuần, dễ gây áp lực. Hạn chế xem tin tức tiêu cực quá nhiều, giữ tinh thần lạc quan nhé.`;
        break;

      case 'month':
        if (isStartOfMonth) {
          shouldDo = `Đầu tháng là lúc lý tưởng để lập kế hoạch tài chính, thử tiết kiệm 10% thu nhập nhé. Tham gia một buổi hội thảo online để học hỏi điều mới, phù hợp với ${meaning.theme.toLowerCase()}. Dành một ngày cuối tuần để dọn dẹp tủ quần áo, tạo không gian mới. Ghi lại 3 mục tiêu nhỏ để theo dõi trong tháng này!`;
          shouldAvoid = `Đừng vội vàng mua đồ lớn ngay đầu tháng, hãy cân nhắc kỹ trước. Tránh để những lo lắng không rõ ràng làm bạn mất ngủ, cứ thư giãn đã. Hạn chế cam kết với dự án mới mà chưa chuẩn bị kỹ nhé.`;
        } else if (isMidMonth) {
          shouldDo = `Giữa tháng rồi, hãy kiểm tra lại ngân sách và điều chỉnh nếu cần. Thử học một công thức nấu ăn mới vào cuối tuần, hợp với ${meaning.theme.toLowerCase()}. Gọi điện hỏi thăm một người thân để kết nối lại tình cảm. Dành một buổi tối để viết nhật ký, nhìn lại nửa tháng qua nhé!`;
          shouldAvoid = `Tránh để công việc dồn lại làm bạn căng thẳng giữa tháng này. Đừng quá khắt khe với bản thân nếu chưa đạt hết mục tiêu, cứ từ từ. Hạn chế ăn ngoài liên tục, tự nấu sẽ tiết kiệm hơn đấy.`;
        } else if (isEndOfMonth) {
          shouldDo = `Cuối tháng, hãy dành một buổi chiều để tổng kết chi tiêu và rút kinh nghiệm. Thử đi dạo công viên hoặc xem một buổi biểu diễn để thư giãn, hợp với ${meaning.theme.toLowerCase()}. Lên danh sách 3 việc cần làm cho tháng sau. Tặng bản thân một món quà nhỏ để tự thưởng nhé!`;
          shouldAvoid = `Đừng để hóa đơn cuối tháng làm bạn hoảng loạn, cứ xử lý từng bước. Tránh tranh cãi với đồng nghiệp vào thời điểm này, giữ hòa khí. Hạn chế thức khuya liên tục, cơ thể cần nghỉ ngơi đấy.`;
        }
        break;

      case 'year':
        shouldDo = `Năm nay, hãy thử đăng ký một khóa học online như lập trình hoặc thiết kế để nâng cao kỹ năng. Lên kế hoạch đi du lịch ít nhất một lần, dù chỉ là chuyến ngắn ngày, hợp với ${meaning.theme.toLowerCase()}. Mỗi quý, dành một ngày để đánh giá lại mục tiêu cá nhân. Tìm một người bạn đồng hành để cùng nhau phát triển nhé!`;
        shouldAvoid = `Đừng để những thất bại nhỏ đầu năm làm bạn chùn bước, hãy xem đó là cơ hội học hỏi. Tránh đầu tư tài chính mạo hiểm mà không nghiên cứu kỹ. Hạn chế giữ mãi những mối quan hệ không còn tích cực với bạn. Đừng quên dành thời gian nghỉ ngơi giữa các kế hoạch lớn nhé.`;
        break;
    }

    return {
      number: validNumber,
      theme: meaning.theme,
      description: `"${name}" ${periodData.text} mang năng lượng số ${validNumber}, ${meaning.theme.toLowerCase()}. Đây là thời điểm để bạn đón nhận những thay đổi nhỏ và tận dụng cơ hội xung quanh. Năng lượng này sẽ hỗ trợ bạn nếu bạn hành động đúng lúc. Hãy lắng nghe bản thân và để mọi thứ diễn ra một cách tự nhiên. Một bước nhỏ hôm nay có thể dẫn bạn đến những điều lớn hơn đấy!`,
      focus: meaning.focus,
      keywords: meaning.keywords,
      shouldDo,
      shouldAvoid
    };
  };

  return {
    day: { ...generatePeriodData('day', periods.day), lunchSuggestion: randomLunch },
    week: generatePeriodData('week', periods.week),
    month: generatePeriodData('month', periods.month),
    year: generatePeriodData('year', periods.year)
  };
}

// API handler chính
export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  console.log('Request received at:', new Date().toISOString());

  const { name, birthDate } = await readBody(event);
  console.log('Request body:', { name, birthDate });

  if (!name || !birthDate) {
    console.error('Validation failed: Missing name or birthDate');
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
      description: `Năm ${targetYear} mang năng lượng số ${personalYearNumber}: ${meaning.theme.toLowerCase()}. Đây là thời điểm để bạn ${meaning.focus[0].toLowerCase()} và phát triển ${meaning.focus[1].toLowerCase()}. Hãy tận dụng năm này để tiến gần hơn đến mục tiêu dài hạn của mình.`,
      focus: meaning.focus,
      keywords: meaning.keywords
    };
  }

  // Tính số đường đời
  const lifePathNumber = calculateLifePath(birthDate);
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[lifePathNumber] || NUMEROLOGY_MEANINGS.lifePath[1];

  // Lấy dữ liệu chu kỳ
  const periodsData = await getPeriodData(name, birthDate, periods);

  const response = {
    numerology: {
      name,
      birthDate,
      lifePathNumber: {
        number: lifePathNumber,
        theme: lifePathData.theme,
        symbol: lifePathData.symbol,
        description: `Số đường đời ${lifePathNumber} cho thấy bạn là ${lifePathData.theme.toLowerCase()}. ${lifePathData.purpose}. Đây là con đường dẫn dắt bạn qua những thử thách và cơ hội trong đời.`,
        strengths: lifePathData.strengths,
        challenges: lifePathData.challenges,
        careers: lifePathData.careers,
        advice: lifePathData.advice
      },
      periods: periodsData,
      cycles
    },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };

  console.log('Final response being sent:', response);
  return response;
});