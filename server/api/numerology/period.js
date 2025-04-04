import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay() || 7;
  startOfWeek.setDate(day - (dayOfWeek - 1));
  const startDay = startOfWeek.getDate();
  const startMonth = startOfWeek.getMonth() + 1;

  return {
    currentDate: `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentWeek: `Tuần từ ${startDay < 10 ? '0' + startDay : startDay}/${startMonth < 10 ? '0' + startMonth : startMonth}/${year} - ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentMonth: `${month < 10 ? '0' + month : month}/${year}`,
    currentYear: `${year}`
  };
}

function calculateNumber(birthDate, period) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();

  let sum;
  if (period === 'day') {
    const [day, month, year] = currentDate.split('/').map(Number);
    sum = birthDay + birthMonth + day + month + year;
  } else if (period === 'week') {
    const [startDay] = currentWeek.split(' - ')[0].split('/').map(Number);
    sum = birthDay + birthMonth + startDay + 3 + 2025;
  } else if (period === 'month') {
    const [month, year] = currentMonth.split('/').map(Number);
    sum = birthDay + birthMonth + month + year;
  } else if (period === 'year') {
    sum = birthDay + birthMonth + parseInt(currentYear);
  }

  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

function calculatePersonalYear(birthDate, targetYear) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  let sum = birthDay + birthMonth + targetYear;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

function getPersonalYearMeaning(number) {
  const meanings = {
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
  return meanings[number] || 'Không xác định';
}

export default defineEventHandler(async (event) => {
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
    });
  }

  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
  const periods = {
    day: { number: calculateNumber(birthDate, 'day'), text: `ngày ${currentDate}` },
    week: { number: calculateNumber(birthDate, 'week'), text: `tuần ${currentWeek}` },
    month: { number: calculateNumber(birthDate, 'month'), text: `tháng ${currentMonth}` },
    year: { number: calculateNumber(birthDate, 'year'), text: `năm ${currentYear}` }
  };

  // Tính chu kỳ vận số cho 10 năm (2025-2034)
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

  try {
    console.log('Sending prompt to Gemini:', prompt);
    const data = await callGeminiApi(prompt);
    console.log('Parsed Gemini Response:', JSON.stringify(data, null, 2));
    if (!data || !data.day || !data.week || !data.month || !data.year) {
      throw new Error('Gemini API không trả về cấu trúc dữ liệu đầy đủ');
    }
    return {
      numerology: {
        periods: data, // Dữ liệu ngày/tuần/tháng/năm từ Gemini
        cycles: cycles // Chu kỳ vận số 10 năm
      }
    };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return {
      numerology: {
        periods: getFallbackResponse(name, birthDate).numerology,
        cycles: cycles // Vẫn trả chu kỳ vận số dù Gemini lỗi
      }
    };
  }
});

function getFallbackResponse(name, birthDate) {
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();
  const periods = {
    day: { number: calculateNumber(birthDate, 'day'), text: `hôm nay (${currentDate})` },
    week: { number: calculateNumber(birthDate, 'week'), text: `tuần này (${currentWeek})` },
    month: { number: calculateNumber(birthDate, 'month'), text: `tháng này (${currentMonth})` },
    year: { number: calculateNumber(birthDate, 'year'), text: `năm này (${currentYear})` }
  };

  const lunchOptions = [
    `Hôm nay, một tô phở bò tái với rau thơm hợp với năng lượng số ${periods.day.number} lắm đấy. Món này nhẹ mà đủ chất để tiếp tục ngày dài.`,
    `Một đĩa cơm tấm sườn nướng với trứng ốp la nghe hấp dẫn phết cho trưa nay, hợp với số ${periods.day.number}. Hương vị đậm đà này khá đồng điệu với vibe của bạn.`,
    `Hôm nay thử bánh xèo giòn rụm với nước mắm chua ngọt đi, hợp năng lượng số ${periods.day.number} luôn. Món này vui miệng, ăn là thấy tươi mới ngay.`,
    `Một bát bún riêu cua kèm rau sống là lựa chọn ngon lành cho trưa nay với số ${periods.day.number}. Thanh mát, dễ chịu, đúng kiểu cân bằng ngày dài.`,
  ];
  const randomLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];

  return {
    numerology: {
      day: {
        number: periods.day.number,
        description: `"${name}" hôm nay mang năng lượng của số ${periods.day.number}, cảm giác như một ngày đầy trách nhiệm nhưng cũng cần chút thư giãn. Có thể bạn sẽ gặp vài tình huống cần sự khéo léo, kiểu như làm hòa hay giữ mọi thứ ổn thỏa. Quan hệ với mọi người quanh bạn sẽ khá quan trọng. Ngày này hợp để chăm chút cho gia đình hoặc bản thân một chút. Ai đó thân thiết có thể sẽ cho bạn một cú hích tinh thần đấy.`,
        shouldDo: `Hôm nay, dành thời gian với gia đình hay bạn bè thân thiết chắc chắn vui lắm. Xử lý mọi việc nhẹ nhàng, khéo léo một chút là mọi thứ sẽ ổn. Lắng nghe mọi người, tìm cách dung hòa cũng là ý hay. Nghỉ ngơi chút cho đỡ căng thẳng nữa nhé.`,
        shouldAvoid: `Đừng sa vào mấy cuộc cãi nhau căng thẳng hay quyết định gì vội vàng hôm nay, dễ mệt lắm. Tránh xa mấy người tiêu cực, không đáng để tâm trạng bị kéo xuống. Hạn chế vung tay quá trán, giữ ví tiền ổn một chút nhé.`,
        lunchSuggestion: randomLunch
      },
      week: {
        number: periods.week.number,
        description: `"${name}" trong ${periods.week.text} sẽ thấy năng lượng số ${periods.week.number} khá rõ. Đây là tuần để tập trung sắp xếp mọi thứ, làm việc gì cũng cần chút quyết tâm. Tham vọng của bạn sẽ nổi lên, dễ đạt được mấy mục tiêu lớn. Quản lý tiền bạc hay xây dựng kế hoạch dài hơi cũng hợp lắm. Tận dụng tốt thì tuần này bạn sẽ tiến xa đấy.`,
        shouldDo: `Tập trung vào mấy việc cần sắp xếp hay lên kế hoạch, tuần này hợp lắm. Quản lý thời gian, tiền bạc khéo một chút là sẽ thấy hiệu quả ngay. Đặt mục tiêu rõ ràng rồi làm tới luôn, đừng chần chừ. Tìm cách làm việc mượt hơn cũng đáng thử đấy.`,
        shouldAvoid: `Đừng để mấy chi tiết nhỏ bị bỏ qua, tuần này cần sự cẩn thận. Hạn chế tiêu xài bốc đồng hay làm gì quá cảm tính, dễ mất cân bằng. Cũng đừng để áp lực làm bạn cáu bẩn với người khác nhé.`
      },
      month: {
        number: periods.month.number,
        description: `"${name}" trong ${periods.month.text} sẽ cảm nhận năng lượng số ${periods.month.number}, kiểu như một khởi đầu đầy hứng khởi. Đây là lúc bạn thấy động lực dâng trào, muốn làm gì đó mới mẻ. Sự tự tin và quyết đoán sẽ giúp bạn đặt mục tiêu rõ ràng. Giai đoạn này hợp để bước lên và thể hiện bản thân. Cơ hội sẽ đến nếu bạn chủ động một chút đấy.`,
        shouldDo: `Làm mấy việc cần sự độc lập hay sáng tạo sẽ rất hợp tháng này. Bắt đầu dự án mới hay đưa ra quyết định lớn cũng là thời điểm tốt. Nói ý tưởng của mình rõ ràng, mọi người sẽ ủng hộ thôi. Thử bước ra khỏi vùng an toàn xem sao, thú vị lắm đấy.`,
        shouldAvoid: `Đừng để mấy cuộc cãi vã nhỏ làm bạn mất hứng, tháng này dễ nóng tính chút. Hạn chế dựa vào người khác quá nhiều, tự mình làm sẽ thoải mái hơn. Đừng chần chừ, cơ hội không đợi đâu nhé.`
      },
      year: {
        number: periods.year.number,
        description: `"${name}" trong ${periods.year.text} sẽ thấy năng lượng số ${periods.year.number} dẫn dắt. Đây là giai đoạn để tập trung vào những thành tựu lớn, kiểu như đặt dấu ấn cá nhân vậy. Sự tổ chức và thực tế sẽ giúp bạn xây dựng nền tảng vững vàng. Năm này hợp để nhắm tới mấy mục tiêu dài hạn. Kiên trì một chút, bạn sẽ thấy kết quả đáng giá đấy.`,
        shouldDo: `Tập trung vào mấy dự án lớn, cần sự tổ chức là hợp nhất trong năm nay. Quản lý tiền bạc, thời gian khéo léo sẽ giúp bạn đi xa. Đặt mục tiêu to rồi làm tới, đừng ngại. Làm gì để bản thân tốt hơn cũng đáng đầu tư đấy.`,
        shouldAvoid: `Đừng bỏ qua mấy chi tiết nhỏ, năm này cần sự chính xác. Hạn chế làm gì bốc đồng hay tiêu xài không kiểm soát, dễ rối lắm. Đừng để áp lực làm bạn mất kiên nhẫn với mấy thứ chậm rãi nhé.`
      }
    }
  };
}