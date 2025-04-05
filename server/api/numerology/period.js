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

// Tính số đường đời
function calculateLifePath(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const digits = birthDate.split('/').join('').split('').map(Number);
  return NumerologyUtils.reduceToSingleDigit(digits.reduce((a, b) => a + b, 0)) || 1;
}

// Tính chu kỳ đường đời (Life Path Cycles)
function calculateLifePathCycles(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return { formation: 1, peak: 1, completion: 1 };
  const [day, month, year] = birthDate.split('/').map(Number);
  const currentYear = getCurrentDateInfo().year;
  const age = currentYear - year;

  const formationCycle = NumerologyUtils.reduceToSingleDigit(day); // Chu kỳ hình thành (dựa trên ngày sinh)
  const peakCycle = NumerologyUtils.reduceToSingleDigit(month);   // Chu kỳ đỉnh cao (dựa trên tháng sinh)
  const completionCycle = NumerologyUtils.reduceToSingleDigit(year); // Chu kỳ hoàn thiện (dựa trên năm sinh)

  return {
    formation: {
      number: formationCycle,
      startAge: 0,
      endAge: 36 - calculateLifePath(birthDate),
      description: `Chu kỳ Hình thành (0 - ${36 - calculateLifePath(birthDate)} tuổi): Đây là giai đoạn bạn xây dựng nền tảng cuộc sống, khám phá bản thân và học hỏi từ trải nghiệm.`
    },
    peak: {
      number: peakCycle,
      startAge: 36 - calculateLifePath(birthDate) + 1,
      endAge: (36 - calculateLifePath(birthDate)) + 9,
      description: `Chu kỳ Đỉnh cao (${36 - calculateLifePath(birthDate) + 1} - ${(36 - calculateLifePath(birthDate)) + 9} tuổi): Đây là thời kỳ bạn đạt được thành tựu lớn nhất, tận dụng tối đa năng lượng và kinh nghiệm tích lũy.`
    },
    completion: {
      number: completionCycle,
      startAge: (36 - calculateLifePath(birthDate)) + 10,
      endAge: null,
      description: `Chu kỳ Hoàn thiện (${(36 - calculateLifePath(birthDate)) + 10} tuổi trở đi): Đây là giai đoạn bạn hoàn thiện bản thân, chia sẻ kinh nghiệm và sống một cuộc đời ý nghĩa hơn.`
    }
  };
}

// Tính nhóm tính cách theo phần trăm (Personality Traits)
function calculatePersonalityTraits(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return { creativity: 25, practicality: 25, sensitivity: 25, leadership: 25 };
  const digits = birthDate.split('/').join('').split('').map(Number);
  const totalSum = digits.reduce((a, b) => a + b, 0);

  const creativity = Math.round((digits.filter(d => [3, 6, 9].includes(d)).length / digits.length) * 100); // Sáng tạo
  const practicality = Math.round((digits.filter(d => [2, 4, 8].includes(d)).length / digits.length) * 100); // Thực tế
  const sensitivity = Math.round((digits.filter(d => [2, 5, 7].includes(d)).length / digits.length) * 100); // Nhạy cảm
  const leadership = Math.round((digits.filter(d => [1, 5, 8].includes(d)).length / digits.length) * 100); // Lãnh đạo

  const total = creativity + practicality + sensitivity + leadership;
  return {
    creativity: total ? Math.round((creativity / total) * 100) : 25,
    practicality: total ? Math.round((practicality / total) * 100) : 25,
    sensitivity: total ? Math.round((sensitivity / total) * 100) : 25,
    leadership: total ? Math.round((leadership / total) * 100) : 25
  };
}

// Tạo dữ liệu chu kỳ từ Gemini hoặc fallback
async function getPeriodData(name, birthDate, periods) {
  const dateInfo = getCurrentDateInfo();
  const randomSeed = Math.floor(Math.random() * 10000);
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

  const prompt = `Dựa trên thần số học, phân tích chi tiết cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}:
    1. Ngày ${dateInfo.currentDate} (số ${periods.day.number}, ${dateInfo.dayOfWeek <= 3 ? 'đầu tuần' : dateInfo.dayOfWeek <= 5 ? 'giữa tuần' : 'cuối tuần'})
    2. Tuần ${dateInfo.currentWeek} (số ${periods.week.number})
    3. Tháng ${dateInfo.currentMonth} (số ${periods.month.number}, ${dateInfo.day <= 10 ? 'đầu tháng' : dateInfo.day <= 20 ? 'giữa tháng' : 'cuối tháng'})
    4. Năm ${dateInfo.currentYear} (số ${periods.year.number})
    Trả về CHỈ JSON (không thêm text thừa): { "day": {}, "week": {}, "month": {}, "year": {} }, mỗi object chứa:
    - "number": Số cá nhân.
    - "theme": Chủ đề chính (ví dụ: "Khởi đầu", "Sáng tạo").
    - "description": Diễn giải chi tiết (8-10 câu), bắt đầu bằng "${name}", giọng tự nhiên, sâu sắc, phù hợp chu kỳ (ngày: tức thời, tuần: ngắn hạn, tháng: trung hạn, năm: dài hạn).
    - "focus": Mảng 3 yếu tố cần tập trung.
    - "keywords": Mảng 5 từ khóa nổi bật.
    - "shouldDo": 5-6 câu gợi ý việc nên làm, cụ thể theo thời điểm (ngày: đầu/giữa/cuối tuần; tháng: đầu/giữa/cuối tháng), dựa trên số cá nhân, thực tế và chi tiết.
    - "shouldAvoid": 4-5 câu việc nên tránh, cụ thể theo thời điểm, dựa trên số cá nhân, mang tính định hướng.
    - "lunchSuggestion": Chỉ cho "day" (3-4 câu), món ăn trưa chi tiết dựa trên seed ${randomSeed} và số ${periods.day.number}, không lặp "bún chả Hà Nội".`;

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
    `Hôm nay, một tô phở bò tái lăn với rau thơm và chút tương ớt sẽ tiếp thêm năng lượng cho số ${periods.day.number}. Một bữa trưa nhẹ nhàng nhưng đầy đủ chất để bạn tiếp tục ngày mới!`,
    `Một đĩa cơm tấm sườn nướng, trứng ốp la và dưa leo là lựa chọn tuyệt vời cho trưa nay, hợp với số ${periods.day.number}. Thêm một ly trà đá để cân bằng nhé!`,
    `Thử bánh xèo giòn rụm với nước mắm chua ngọt, rau sống tươi ngon, rất hợp với năng lượng số ${periods.day.number}. Một bữa trưa đậm chất Việt Nam để làm mới tinh thần!`,
    `Một bát bún riêu cua nóng hổi, thêm rau muống và mắm tôm vừa miệng sẽ làm trưa nay thêm ngon, phù hợp số ${periods.day.number}. Thưởng thức chậm rãi để cảm nhận nhé!`
  ];
  const randomLunch = lunchOptions[Math.floor(Math.random() * lunchOptions.length)];

  const generatePeriodData = (periodKey, periodData) => {
    const validNumber = NUMEROLOGY_MEANINGS.personalYear[periodData.number] ? periodData.number : 1;
    const meaning = NUMEROLOGY_MEANINGS.personalYear[validNumber] || NUMEROLOGY_MEANINGS.personalYear[1];

    let shouldDo, shouldAvoid, description;

    switch (periodKey) {
      case 'day':
        description = `"${name}" ngày ${periodData.text} mang năng lượng số ${validNumber}, ${meaning.theme.toLowerCase()}. Đây là một ngày để bạn tập trung vào những thay đổi nhỏ nhưng ý nghĩa trong cuộc sống thường nhật. Năng lượng này khuyến khích bạn hành động linh hoạt, đón nhận cơ hội bất ngờ. Mỗi quyết định hôm nay đều có thể ảnh hưởng đến hướng đi sắp tới. Hãy lắng nghe trực giác, đồng thời giữ tinh thần cởi mở để thích nghi với hoàn cảnh. Nếu bạn tận dụng tốt, đây sẽ là một ngày đầy cảm hứng và hiệu quả. Đừng ngại thử điều mới mẻ, dù chỉ là một thay đổi nhỏ trong thói quen. Năng lượng ${meaning.theme.toLowerCase()} đang ở bên bạn hôm nay!`;
        if (isStartOfWeek) {
          shouldDo = `Hôm nay là đầu tuần, hãy bắt đầu bằng cách viết ra 3 mục tiêu cụ thể cho ngày này để định hướng rõ ràng. Thử gọi điện hoặc nhắn tin cho một người bạn để chia sẻ ý tưởng mới, rất hợp với năng lượng ${meaning.theme.toLowerCase()}. Dành 10 phút buổi trưa ngồi thiền hoặc nghe nhạc yêu thích để nạp lại tinh thần. Nếu có thể, đi bộ ngắn sau giờ làm để hít thở không khí trong lành. Một ngày khởi đầu tốt sẽ tạo đà cho cả tuần!`;
          shouldAvoid = `Đừng để những email tồn đọng từ tuần trước làm bạn phân tâm ngay từ đầu ngày. Tránh bắt đầu ngày bằng việc lướt mạng xã hội quá lâu, dễ làm mất động lực. Hạn chế uống cà phê quá nhiều sáng sớm, thay bằng trà xanh để giữ tỉnh táo nhẹ nhàng. Đừng tự tạo áp lực quá lớn ngay hôm nay nhé!`;
        } else if (isMidWeek) {
          shouldDo = `Giữa tuần rồi, hãy hoàn thành một email quan trọng hoặc công việc nhỏ còn dang dở để cảm thấy nhẹ nhõm. Thử vẽ một bức doodle hoặc viết vài dòng suy nghĩ trong giờ nghỉ, phù hợp với ${meaning.theme.toLowerCase()}. Tối nay, xem một video ngắn về chủ đề bạn quan tâm để thư giãn. Đừng quên uống đủ nước và đứng dậy vận động vài phút giữa giờ làm. Một ngày cân bằng sẽ giúp bạn duy trì năng lượng!`;
          shouldAvoid = `Tránh nhận thêm deadline gấp vào giữa tuần, dễ làm bạn căng thẳng không cần thiết. Đừng để những cuộc trò chuyện phiếm kéo dài làm mất thời gian quý báu. Hạn chế ăn đồ chiên rán quá nhiều hôm nay, chọn món nhẹ để giữ sức khỏe. Đừng để bản thân kiệt sức giữa chừng nhé!`;
        } else if (isEndOfWeek) {
          shouldDo = `Cuối tuần đến, hãy dành 30 phút để sắp xếp lại lịch tuần sau, chuẩn bị tinh thần thật tốt. Thử ra ngoài uống cà phê với bạn bè hoặc đi dạo để đổi gió, hợp với ${meaning.theme.toLowerCase()}. Tối nay, xem một bộ phim nhẹ nhàng hoặc đọc vài trang sách yêu thích. Kết thúc ngày bằng một cốc trà ấm để thư giãn hoàn toàn. Một ngày cuối tuần trọn vẹn sẽ giúp bạn tái tạo năng lượng!`;
          shouldAvoid = `Đừng mang việc về nhà vào cuối tuần, hãy để đầu óc được nghỉ ngơi. Tránh mua sắm online chỉ vì buồn chán, dễ tiêu tiền không kiểm soát. Hạn chế ngủ nướng quá lâu, giữ nhịp sinh học ổn định để tuần sau khởi đầu tốt. Đừng để những suy nghĩ tiêu cực làm mờ đi ngày thư giãn này!`;
        }
        break;

      case 'week':
        description = `"${name}" tuần ${periodData.text} mang năng lượng số ${validNumber}, ${meaning.theme.toLowerCase()}. Đây là một tuần để bạn tập trung vào việc điều chỉnh nhịp sống và tận dụng những cơ hội ngắn hạn. Năng lượng này mang đến sự linh hoạt, thúc đẩy bạn hành động nhanh chóng nhưng vẫn cần sự cân nhắc. Mỗi bước đi trong tuần này đều góp phần xây dựng nền tảng cho tương lai gần. Hãy chú ý đến các mối quan hệ xung quanh, vì chúng có thể mang lại hỗ trợ bất ngờ. Nếu bạn biết cách tận dụng, đây sẽ là một tuần hiệu quả và đáng nhớ. Đừng ngần ngại thử những ý tưởng mới, vì ${meaning.theme.toLowerCase()} đang dẫn dắt bạn!`;
        shouldDo = `Tuần này, hãy thử viết một kế hoạch ngắn hoặc ghi chú về mục tiêu cá nhân để định hình hướng đi. Dành một buổi tối đi ăn cùng đồng nghiệp hoặc gia đình, tạo kết nối mới, hợp với ${meaning.theme.toLowerCase()}. Thử tập yoga hoặc chạy bộ ít nhất 2 lần để giữ cơ thể khỏe mạnh. Gửi một email cảm ơn ai đó đã giúp bạn gần đây để lan tỏa năng lượng tích cực. Một tuần trôi chảy sẽ mang lại nhiều cảm hứng!`;
        shouldAvoid = `Đừng để những cuộc họp không cần thiết làm gián đoạn lịch trình tuần này, hãy ưu tiên thời gian cho việc quan trọng. Tránh trì hoãn công việc đến cuối tuần, dễ gây áp lực không đáng có. Hạn chế xem tin tức tiêu cực quá nhiều, giữ tinh thần lạc quan để tập trung tốt hơn. Đừng quên dành thời gian nghỉ ngơi giữa tuần nhé!`;
        break;

      case 'month':
        description = `"${name}" tháng ${periodData.text} mang năng lượng số ${validNumber}, ${meaning.theme.toLowerCase()}. Đây là một tháng để bạn nhìn lại những gì đã làm và định hướng cho những mục tiêu lớn hơn. Năng lượng này khuyến khích bạn tập trung vào sự phát triển cá nhân, đồng thời cân bằng giữa công việc và cuộc sống. Mỗi hành động trong tháng này đều có thể tạo ra ảnh hưởng lâu dài nếu bạn kiên nhẫn. Hãy chú ý đến những dấu hiệu nhỏ từ xung quanh, vì chúng có thể là gợi ý quan trọng. Nếu tận dụng tốt, đây sẽ là một tháng đầy ý nghĩa và thành tựu. ${meaning.theme.toLowerCase()} đang mở ra cơ hội để bạn tỏa sáng!`;
        if (isStartOfMonth) {
          shouldDo = `Đầu tháng là lúc lý tưởng để lập kế hoạch tài chính, thử tiết kiệm 10% thu nhập để chuẩn bị cho tương lai. Tham gia một buổi hội thảo online hoặc đọc một cuốn sách mới, phù hợp với ${meaning.theme.toLowerCase()}. Dành một ngày cuối tuần để dọn dẹp tủ quần áo, tạo không gian sống mới mẻ. Ghi lại 3 mục tiêu cụ thể để theo dõi trong tháng này. Một khởi đầu tốt sẽ mang lại động lực lớn!`;
          shouldAvoid = `Đừng vội vàng mua đồ lớn ngay đầu tháng, hãy cân nhắc kỹ để tránh lãng phí. Tránh để những lo lắng không rõ ràng làm bạn mất ngủ, cứ thư giãn và lên kế hoạch từ từ. Hạn chế cam kết với dự án mới mà chưa chuẩn bị kỹ, giữ năng lượng cho những việc ưu tiên. Đừng để áp lực tài chính làm mờ đi sự hào hứng ban đầu!`;
        } else if (isMidMonth) {
          shouldDo = `Giữa tháng rồi, hãy kiểm tra lại ngân sách và điều chỉnh chi tiêu nếu cần thiết. Thử học một công thức nấu ăn mới vào cuối tuần, hợp với ${meaning.theme.toLowerCase()}. Gọi điện hỏi thăm một người thân để kết nối lại tình cảm, mang lại năng lượng tích cực. Dành một buổi tối để viết nhật ký, nhìn lại những gì đã làm được. Một tháng cân bằng sẽ giúp bạn tiến xa hơn!`;
          shouldAvoid = `Tránh để công việc dồn lại làm bạn căng thẳng giữa tháng này, hãy xử lý từng bước. Đừng quá khắt khe với bản thân nếu chưa đạt hết mục tiêu, cứ từ từ điều chỉnh. Hạn chế ăn ngoài liên tục, tự nấu một bữa sẽ tiết kiệm và tốt hơn cho sức khỏe. Đừng để những chuyện nhỏ làm mất tập trung nhé!`;
        } else if (isEndOfMonth) {
          shouldDo = `Cuối tháng, hãy dành một buổi chiều để tổng kết chi tiêu và rút kinh nghiệm cho tháng sau. Thử đi dạo công viên hoặc xem một buổi biểu diễn để thư giãn, hợp với ${meaning.theme.toLowerCase()}. Lên danh sách 3 việc cần làm cho tháng tới để chuẩn bị tốt. Tặng bản thân một món quà nhỏ như một cuốn sách hay một bữa ăn ngon để tự thưởng. Một tháng kết thúc trọn vẹn sẽ mang lại niềm vui!`;
          shouldAvoid = `Đừng để hóa đơn cuối tháng làm bạn hoảng loạn, cứ xử lý từng bước một cách bình tĩnh. Tránh tranh cãi với đồng nghiệp hoặc gia đình vào thời điểm này, giữ hòa khí quan trọng hơn. Hạn chế thức khuya liên tục, cơ thể cần nghỉ ngơi để tái tạo năng lượng. Đừng để cảm giác tiếc nuối làm mờ đi những thành tựu đã đạt được!`;
        }
        break;

      case 'year':
        description = `"${name}" năm ${periodData.text} mang năng lượng số ${validNumber}, ${meaning.theme.toLowerCase()}. Đây là một năm để bạn đặt nền móng cho những mục tiêu dài hạn và khám phá tiềm năng sâu bên trong. Năng lượng này mang đến cơ hội lớn, nhưng cũng đòi hỏi sự kiên trì và tầm nhìn rõ ràng. Mỗi quyết định trong năm nay đều có thể định hình tương lai của bạn trong thập kỷ tới. Hãy chú ý đến những mối quan hệ quan trọng, vì chúng sẽ hỗ trợ bạn trên hành trình này. Nếu bạn tận dụng tốt, đây sẽ là một năm mang tính bước ngoặt, đầy thành tựu và sự phát triển. ${meaning.theme.toLowerCase()} đang dẫn dắt bạn đến những chân trời mới, hãy mạnh dạn bước đi!`;
        shouldDo = `Năm nay, hãy thử đăng ký một khóa học online như lập trình, thiết kế hoặc ngoại ngữ để nâng cao kỹ năng. Lên kế hoạch đi du lịch ít nhất một lần, dù chỉ là chuyến ngắn ngày, hợp với ${meaning.theme.toLowerCase()}. Mỗi quý, dành một ngày để đánh giá lại mục tiêu cá nhân và điều chỉnh nếu cần. Tìm một người bạn đồng hành hoặc cố vấn để cùng nhau phát triển. Một năm đầy ý nghĩa đang chờ bạn chinh phục!`;
        shouldAvoid = `Đừng để những thất bại nhỏ đầu năm làm bạn chùn bước, hãy xem đó là bài học để trưởng thành. Tránh đầu tư tài chính mạo hiểm mà không nghiên cứu kỹ, cẩn thận với những quyết định lớn. Hạn chế giữ mãi những mối quan hệ không còn tích cực, hãy ưu tiên cho những người thực sự quan trọng. Đừng quên dành thời gian nghỉ ngơi giữa các kế hoạch lớn để giữ sức khỏe và tinh thần!`;
        break;
    }

    return {
      number: validNumber,
      theme: meaning.theme,
      description,
      focus: meaning.focus,
      keywords: [...meaning.keywords, 'năng lượng', 'phát triển'],
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
      description: `Năm ${targetYear} mang năng lượng số ${personalYearNumber}: ${meaning.theme.toLowerCase()}. Đây là một năm để bạn ${meaning.focus[0].toLowerCase()} và phát triển ${meaning.focus[1].toLowerCase()}. Năng lượng này sẽ hỗ trợ bạn trong việc định hình tương lai, nhưng đòi hỏi sự kiên nhẫn và tập trung. Hãy tận dụng cơ hội để xây dựng những nền tảng lâu dài. Một năm đầy tiềm năng nếu bạn biết cách nắm bắt!`,
      focus: meaning.focus,
      keywords: meaning.keywords
    };
  }

  // Tính số đường đời
  const lifePathNumber = calculateLifePath(birthDate);
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[lifePathNumber] || NUMEROLOGY_MEANINGS.lifePath[1];

  // Tính chu kỳ đường đời
  const lifePathCycles = calculateLifePathCycles(birthDate);

  // Tính nhóm tính cách
  const personalityTraits = calculatePersonalityTraits(birthDate);

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
        description: `Số đường đời ${lifePathNumber} cho thấy bạn là ${lifePathData.theme.toLowerCase()}. ${lifePathData.purpose}. Đây là con đường định mệnh dẫn dắt bạn qua những thử thách và cơ hội trong cuộc sống. Năng lượng này phản ánh bản chất sâu xa nhất của bạn, định hình cách bạn nhìn nhận thế giới và tương tác với mọi người xung quanh. Hãy tận dụng nó để khám phá tiềm năng thực sự của mình!`,
        strengths: lifePathData.strengths,
        challenges: lifePathData.challenges,
        careers: lifePathData.careers,
        advice: lifePathData.advice
      },
      lifePathCycles,
      personalityTraits,
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