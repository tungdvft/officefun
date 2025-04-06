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
    - "description": Diễn giải chi tiết (10-12 câu), bắt đầu bằng "${name}", giọng tự nhiên, sâu sắc, phù hợp chu kỳ (ngày: tức thời, tuần: ngắn hạn, tháng: trung hạn, năm: dài hạn).
    - "focus": Mảng 4 yếu tố cần tập trung.
    - "keywords": Mảng 6 từ khóa nổi bật.
    - "shouldDo": Mảng 6-8 câu gợi ý việc nên làm (mỗi câu là một phần tử), cụ thể theo thời điểm (ngày: đầu/giữa/cuối tuần; tháng: đầu/giữa/cuối tháng), dựa trên số cá nhân, thực tế và chi tiết.
    - "shouldAvoid": Mảng 5-6 câu việc nên tránh (mỗi câu là một phần tử), cụ thể theo thời điểm, dựa trên số cá nhân, mang tính định hướng.
    - "energyTips": Mảng 3-4 câu mẹo cân bằng năng lượng, phù hợp với số cá nhân và chu kỳ.
    - "lunchSuggestion": Chỉ cho "day", mảng 4-5 câu gợi ý món ăn trưa chi tiết dựa trên seed ${randomSeed} và số ${periods.day.number}, không lặp "bún chả Hà Nội".`;

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
    `Thưởng thức một suất cơm gà xối mỡ thơm ngon, nóng hổi, hợp với năng lượng số ${periods.day.number}.`,
    `Một tô mì bò kho đậm đà với bánh mì giòn rụm là lựa chọn tuyệt vời cho trưa nay, phù hợp với số ${periods.day.number}.`,
    `Nếu muốn nhẹ nhàng, thử salad cá hồi tươi mát với sốt chanh dây để cân bằng năng lượng số ${periods.day.number}.`,
    `Một bát bún bò Huế cay nồng, thêm rau thơm và chanh sẽ làm trưa nay thêm thú vị, hợp với số ${periods.day.number}.`
  ];

  const generatePeriodData = (periodKey, periodData) => {
    const validNumber = NUMEROLOGY_MEANINGS.personalYear[periodData.number] ? periodData.number : 1;
    const meaning = NUMEROLOGY_MEANINGS.personalYear[validNumber] || NUMEROLOGY_MEANINGS.personalYear[1];

    let shouldDo, shouldAvoid, description, energyTips;

    switch (periodKey) {
      case 'day':
        description = `"${name}", ngày ${periodData.text} mang năng lượng số ${validNumber}, biểu trưng cho ${meaning.theme.toLowerCase()}. Đây là một ngày để bạn tập trung vào những thay đổi nhỏ nhưng có ý nghĩa trong cuộc sống thường nhật. Năng lượng này khuyến khích bạn hành động linh hoạt, đón nhận những cơ hội bất ngờ xuất hiện. Mỗi quyết định hôm nay đều có thể là bước ngoặt nhỏ dẫn bạn đến những điều lớn lao hơn. Hãy chú ý đến cảm xúc và trực giác của mình, vì chúng sẽ dẫn dắt bạn trong những tình huống không rõ ràng. Nếu bạn tận dụng tốt, ngày này sẽ tràn đầy cảm hứng và hiệu quả. Đừng ngại thử những điều mới mẻ, dù chỉ là một thay đổi nhỏ trong thói quen hàng ngày. Năng lượng ${meaning.theme.toLowerCase()} đang hỗ trợ bạn mạnh mẽ hôm nay. Hãy giữ tinh thần cởi mở và sẵn sàng thích nghi với mọi hoàn cảnh. Một ngày trọn vẹn đang chờ bạn khám phá!`;
        energyTips = [
          `Dành 10 phút buổi sáng hít thở sâu để khởi động năng lượng số ${validNumber}.`,
          `Uống một ly nước chanh ấm giữa ngày để giữ cơ thể nhẹ nhàng và tỉnh táo.`,
          `Tối nay, thắp một ngọn nến nhỏ để thư giãn và cân bằng tâm trí.`
        ];
        if (isStartOfWeek) {
          shouldDo = [
            `Buổi sáng: Lập kế hoạch chi tiết cho ngày hôm nay để bắt đầu tuần mới hiệu quả.`,
            `Giữa ngày: Gửi một tin nhắn hỏi thăm đồng nghiệp hoặc bạn bè để tạo kết nối.`,
            `Cuối ngày: Dành 15 phút xem lại tiến độ công việc và ghi chú cho ngày mai.`,
            `Thử đi bộ ngắn sau giờ làm để hít thở không khí trong lành, hợp với số ${validNumber}.`,
            `Dành thời gian thử một món ăn mới vào bữa tối để làm phong phú ngày này.`,
            `Nghe một bản nhạc yêu thích trước khi ngủ để nạp lại năng lượng tích cực.`,
          ];
          shouldAvoid = [
            `Tránh trì hoãn việc lập kế hoạch, vì đầu tuần cần sự rõ ràng để định hướng.`,
            `Không nên tranh cãi với người khác vào sáng sớm, giữ hòa khí để ngày suôn sẻ.`,
            `Hạn chế lướt mạng xã hội quá lâu, dễ làm mất tập trung vào mục tiêu.`,
            `Đừng tự tạo áp lực quá lớn ngay từ đầu tuần, hãy tiến hành từng bước nhỏ.`,
            `Tránh ăn quá nhiều đồ chiên rán, chọn món nhẹ để giữ sức khỏe tốt.`
          ];
        } else if (isMidWeek) {
          shouldDo = [
            `Buổi sáng: Hoàn thành một nhiệm vụ nhỏ còn dang dở để cảm thấy nhẹ nhõm.`,
            `Giữa ngày: Thử vẽ một bức doodle hoặc viết vài dòng suy nghĩ để thư giãn.`,
            `Cuối ngày: Xem một video ngắn về chủ đề bạn quan tâm để lấy cảm hứng.`,
            `Dành 10 phút đi dạo giữa giờ nghỉ trưa để tái tạo năng lượng số ${validNumber}.`,
            `Gọi điện hỏi thăm một người thân để kết nối tình cảm, rất hợp với ngày này.`,
            `Tối nay, thử tập vài động tác yoga nhẹ để giữ cơ thể khỏe mạnh.`,
          ];
          shouldAvoid = [
            `Tránh nhận thêm công việc gấp vào giữa tuần, dễ gây căng thẳng không cần thiết.`,
            `Không nên để những cuộc trò chuyện phiếm kéo dài, giữ thời gian cho việc quan trọng.`,
            `Hạn chế uống cà phê quá nhiều, thay bằng trà thảo mộc để giữ tỉnh táo nhẹ nhàng.`,
            `Đừng bỏ qua giờ nghỉ trưa, cơ thể cần thời gian để phục hồi giữa tuần.`,
            `Tránh để cảm xúc tiêu cực chi phối, hãy tập trung vào những điều tích cực.`
          ];
        } else if (isEndOfWeek) {
          shouldDo = [
            `Buổi sáng: Sắp xếp lại bàn làm việc để chuẩn bị cho tuần sau thật gọn gàng.`,
            `Giữa ngày: Ra ngoài uống cà phê với bạn bè để đổi gió, hợp với số ${validNumber}.`,
            `Cuối ngày: Xem một bộ phim nhẹ nhàng hoặc đọc sách để thư giãn hoàn toàn.`,
            `Thử nấu một món ăn yêu thích vào bữa tối để tự thưởng cho bản thân.`,
            `Dành 20 phút đi dạo tối để tận hưởng không khí cuối tuần thoải mái.`,
            `Viết ra 3 điều bạn hài lòng trong ngày để kết thúc tuần một cách tích cực.`,
          ];
          shouldAvoid = [
            `Tránh mang công việc về nhà vào cuối tuần, hãy để đầu óc được nghỉ ngơi.`,
            `Không nên mua sắm online chỉ vì buồn chán, dễ tiêu tiền không kiểm soát.`,
            `Hạn chế thức khuya xem phim, giữ nhịp sinh học ổn định cho tuần mới.`,
            `Đừng để những suy nghĩ tiêu cực làm mờ đi ngày thư giãn này.`,
            `Tránh ăn quá nhiều đồ ngọt tối nay, chọn món nhẹ để cơ thể dễ chịu.`
          ];
        }
        break;

      case 'week':
        description = `"${name}", tuần ${periodData.text} mang năng lượng số ${validNumber}, đại diện cho ${meaning.theme.toLowerCase()}. Đây là tuần để bạn tập trung vào việc điều chỉnh nhịp sống và tận dụng những cơ hội ngắn hạn. Năng lượng này thúc đẩy bạn hành động nhanh chóng nhưng vẫn cần sự cân nhắc kỹ lưỡng. Mỗi bước đi trong tuần này đều góp phần xây dựng nền tảng cho những tuần tiếp theo. Hãy chú ý đến các mối quan hệ xung quanh, vì chúng có thể mang lại sự hỗ trợ bất ngờ. Nếu bạn biết cách tận dụng, đây sẽ là một tuần hiệu quả và đáng nhớ. Năng lượng ${meaning.theme.toLowerCase()} khuyến khích bạn thử những ý tưởng mới và không ngại thay đổi. Sự linh hoạt sẽ là chìa khóa để bạn vượt qua những thử thách nhỏ. Hãy giữ tinh thần lạc quan và tập trung vào những điều quan trọng nhất. Một tuần đầy tiềm năng đang chờ bạn khai phá!`;
        shouldDo = [
          `Lập danh sách 5 mục tiêu nhỏ cho tuần này và theo dõi tiến độ mỗi ngày.`,
          `Dành một buổi tối đi ăn cùng gia đình hoặc bạn bè để tăng cường kết nối.`,
          `Thử tập thể dục ít nhất 3 lần trong tuần để giữ cơ thể khỏe mạnh, hợp với số ${validNumber}.`,
          `Gửi một email cảm ơn ai đó đã giúp bạn gần đây để lan tỏa năng lượng tích cực.`,
          `Dành 30 phút cuối tuần để tổng kết và lên kế hoạch cho tuần tới.`,
          `Thử học một kỹ năng mới như nấu ăn hoặc vẽ để làm phong phú tuần này.`,
        ];
        shouldAvoid = [
          `Tránh để những cuộc họp không cần thiết làm gián đoạn lịch trình tuần này.`,
          `Không nên trì hoãn công việc đến cuối tuần, dễ gây áp lực không đáng có.`,
          `Hạn chế xem tin tức tiêu cực quá nhiều, giữ tinh thần lạc quan để tập trung tốt hơn.`,
          `Đừng quên nghỉ ngơi giữa tuần, tránh làm việc quá sức mà không nghỉ.`,
          `Tránh đưa ra quyết định lớn mà chưa suy nghĩ kỹ, hãy dành thời gian cân nhắc.`,
        ];
        energyTips = [
          `Bắt đầu tuần bằng một bài thiền ngắn để định hướng năng lượng số ${validNumber}.`,
          `Giữa tuần, uống trà hoa cúc để thư giãn và giảm căng thẳng.`,
          `Cuối tuần, đi dạo ngoài trời để tái tạo năng lượng và chuẩn bị cho tuần mới.`,
        ];
        break;

      case 'month':
        description = `"${name}", tháng ${periodData.text} mang năng lượng số ${validNumber}, biểu trưng cho ${meaning.theme.toLowerCase()}. Đây là một tháng để bạn nhìn lại những gì đã làm và định hướng cho những mục tiêu lớn hơn trong tương lai. Năng lượng này khuyến khích bạn tập trung vào sự phát triển cá nhân, đồng thời cân bằng giữa công việc và cuộc sống cá nhân. Mỗi hành động trong tháng này đều có thể tạo ra ảnh hưởng lâu dài nếu bạn kiên nhẫn và quyết tâm. Hãy chú ý đến những dấu hiệu nhỏ từ xung quanh, vì chúng có thể là gợi ý quan trọng cho hướng đi của bạn. Nếu tận dụng tốt, đây sẽ là một tháng đầy ý nghĩa và thành tựu. Năng lượng ${meaning.theme.toLowerCase()} đang mở ra cơ hội để bạn tỏa sáng theo cách riêng. Đừng ngại đặt câu hỏi cho bản thân về những gì thực sự quan trọng. Sự kiên trì và tập trung sẽ giúp bạn đạt được những bước tiến lớn. Một tháng đáng nhớ đang chờ bạn!`;
        energyTips = [
          `Dành 15 phút mỗi sáng để viết nhật ký, giúp bạn kết nối với năng lượng số ${validNumber}.`,
          `Giữa tháng, thử thay đổi không gian sống bằng cách dọn dẹp để làm mới năng lượng.`,
          `Cuối tháng, ngồi thiền hoặc nghe nhạc nhẹ để tổng kết và tái tạo tinh thần.`,
        ];
        if (isStartOfMonth) {
          shouldDo = [
            `Đầu tháng, lập kế hoạch tài chính chi tiết để kiểm soát chi tiêu hiệu quả.`,
            `Tham gia một buổi hội thảo hoặc đọc sách mới để khởi đầu tháng đầy cảm hứng.`,
            `Dành một ngày cuối tuần dọn dẹp nhà cửa, tạo không gian sống tích cực.`,
            `Ghi lại 4 mục tiêu cụ thể cho tháng này và đặt nhắc nhở để theo dõi.`,
            `Thử một món ăn mới vào cuối tuần để làm phong phú trải nghiệm, hợp với số ${validNumber}.`,
            `Gửi một tin nhắn động viên ai đó để lan tỏa năng lượng tích cực.`,
          ];
          shouldAvoid = [
            `Tránh mua sắm đồ lớn ngay đầu tháng, hãy cân nhắc kỹ để tránh lãng phí.`,
            `Không nên để lo lắng mơ hồ làm mất ngủ, cứ thư giãn và lên kế hoạch từ từ.`,
            `Hạn chế cam kết với dự án mới mà chưa chuẩn bị kỹ, ưu tiên việc hiện tại.`,
            `Đừng để áp lực tài chính làm mờ đi sự hào hứng đầu tháng, hãy bình tĩnh xử lý.`,
            `Tránh làm việc quá sức ngay từ đầu, giữ sức khỏe cho cả tháng dài.`,
          ];
        } else if (isMidMonth) {
          shouldDo = [
            `Kiểm tra lại ngân sách tháng này và điều chỉnh chi tiêu nếu cần thiết.`,
            `Thử học một công thức nấu ăn mới vào cuối tuần để thư giãn, hợp với số ${validNumber}.`,
            `Gọi điện hỏi thăm một người thân để kết nối lại tình cảm, mang lại năng lượng tích cực.`,
            `Dành một buổi tối viết nhật ký, nhìn lại những gì đã làm được trong nửa tháng.`,
            `Tham gia một hoạt động ngoài trời như chạy bộ để tái tạo năng lượng giữa tháng.`,
            `Lên kế hoạch cho nửa tháng còn lại để đảm bảo mọi thứ đi đúng hướng.`,
          ];
          shouldAvoid = [
            `Tránh để công việc dồn lại làm bạn căng thẳng giữa tháng này, xử lý từng bước.`,
            `Không nên quá khắt khe với bản thân nếu chưa đạt hết mục tiêu, cứ từ từ điều chỉnh.`,
            `Hạn chế ăn ngoài liên tục, tự nấu một bữa để tiết kiệm và tốt cho sức khỏe.`,
            `Đừng để những chuyện nhỏ nhặt làm mất tập trung vào mục tiêu lớn.`,
            `Tránh thức khuya quá nhiều, giữ sức khỏe để duy trì năng lượng ổn định.`,
          ];
        } else if (isEndOfMonth) {
          shouldDo = [
            `Dành một buổi chiều tổng kết chi tiêu tháng này và rút kinh nghiệm cho tháng sau.`,
            `Thử đi dạo công viên hoặc xem một buổi biểu diễn để thư giãn, hợp với số ${validNumber}.`,
            `Lên danh sách 4 việc cần làm cho tháng tới để chuẩn bị tinh thần tốt.`,
            `Tự thưởng cho bản thân một món quà nhỏ như sách hoặc bữa ăn ngon để khích lệ.`,
            `Gửi lời cảm ơn ai đó đã đồng hành cùng bạn trong tháng này để kết thúc tích cực.`,
            `Dành thời gian thiền hoặc viết ra 3 điều bạn biết ơn trong tháng vừa qua.`,
          ];
          shouldAvoid = [
            `Tránh hoảng loạn với hóa đơn cuối tháng, xử lý từng bước một cách bình tĩnh.`,
            `Không nên tranh cãi với người khác vào thời điểm này, giữ hòa khí quan trọng hơn.`,
            `Hạn chế thức khuya liên tục, cơ thể cần nghỉ ngơi để tái tạo năng lượng.`,
            `Đừng để cảm giác tiếc nuối làm mờ đi những thành tựu đã đạt được trong tháng.`,
            `Tránh chi tiêu quá mức vào những ngày cuối, hãy ưu tiên tiết kiệm.`,
          ];
        }
        break;

      case 'year':
        description = `"${name}", năm ${periodData.text} mang năng lượng số ${validNumber}, đại diện cho ${meaning.theme.toLowerCase()}. Đây là một năm để bạn đặt nền móng cho những mục tiêu dài hạn và khám phá tiềm năng sâu bên trong. Năng lượng này mang đến cơ hội lớn, nhưng cũng đòi hỏi sự kiên trì và tầm nhìn rõ ràng. Mỗi quyết định trong năm nay đều có thể định hình tương lai của bạn trong nhiều năm tới. Hãy chú ý đến những mối quan hệ quan trọng, vì chúng sẽ là nguồn hỗ trợ quý giá trên hành trình này. Nếu bạn tận dụng tốt, đây sẽ là một năm mang tính bước ngoặt, đầy thành tựu và phát triển. Năng lượng ${meaning.theme.toLowerCase()} đang dẫn dắt bạn đến những chân trời mới, hãy mạnh dạn bước đi. Sự kiên định và sáng tạo sẽ là chìa khóa để bạn vượt qua mọi thử thách. Hãy tin vào khả năng của mình và không ngừng tìm kiếm cơ hội. Một năm đầy ý nghĩa đang chờ bạn chinh phục!`;
        shouldDo = [
          `Đầu năm, lập kế hoạch chi tiết cho 3 mục tiêu lớn bạn muốn đạt được trong năm này.`,
          `Đăng ký một khóa học mới (như ngoại ngữ, kỹ năng mềm) để nâng cao bản thân.`,
          `Dành ít nhất một kỳ nghỉ ngắn trong năm để tái tạo năng lượng, hợp với số ${validNumber}.`,
          `Mỗi quý, dành một ngày đánh giá lại tiến độ và điều chỉnh mục tiêu nếu cần.`,
          `Thử tham gia một dự án cộng đồng hoặc thiện nguyện để lan tỏa năng lượng tích cực.`,
          `Cuối năm, viết một lá thư cho chính mình để tổng kết và đặt mục tiêu cho năm sau.`,
        ];
        shouldAvoid = [
          `Tránh để những thất bại nhỏ đầu năm làm bạn chùn bước, xem đó là bài học để trưởng thành.`,
          `Không nên đầu tư tài chính mạo hiểm mà không nghiên cứu kỹ, hãy cẩn thận với tiền bạc.`,
          `Hạn chế giữ mãi những mối quan hệ không còn tích cực, ưu tiên người thực sự quan trọng.`,
          `Đừng quên nghỉ ngơi giữa các kế hoạch lớn, tránh kiệt sức giữa chừng.`,
          `Tránh trì hoãn các quyết định quan trọng, hãy hành động khi thời cơ đến.`,
        ];
        energyTips = [
          `Mỗi tháng, dành một buổi tối thiền định để kết nối với năng lượng số ${validNumber}.`,
          `Giữa năm, thay đổi không gian làm việc để làm mới tinh thần và sáng tạo.`,
          `Cuối năm, đi dạo biển hoặc rừng để tái tạo năng lượng và chuẩn bị cho năm mới.`,
        ];
        break;
    }

    return {
      number: validNumber,
      theme: meaning.theme,
      description,
      focus: [...meaning.focus, 'Tự tin'], // Thêm yếu tố tập trung
      keywords: [...meaning.keywords, 'năng lượng', 'phát triển'], // Thêm từ khóa
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

  // Lấy dữ liệu chu kỳ
  const periodsData = await getPeriodData(name, birthDate, periods);

  const response = {
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

  console.log('Final response being sent:', response);
  return response;
});