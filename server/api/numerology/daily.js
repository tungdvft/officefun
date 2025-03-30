// server/api/numerology/daily.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

function getPersonalDayNumber(birthDate, currentDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate) || !/^\d{2}\/\d{2}\/\d{4}$/.test(currentDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const [currentDay, currentMonth, currentYear] = currentDate.split('/').map(Number);
  let sum = birthDay + birthMonth + currentDay + currentMonth + currentYear;
  while (sum > 9) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

export default defineEventHandler(async (event) => {
  const { birthDate, currentDate } = await readBody(event);

  if (!birthDate || !currentDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: birthDate và currentDate là bắt buộc.'
    });
  }

  const personalDayNumber = getPersonalDayNumber(birthDate, currentDate);

  const prompt = `Dựa trên thần số học, phân tích số ngày cá nhân ${personalDayNumber} cho ngày ${currentDate} với ngày sinh ${birthDate}. Trả về JSON hợp lệ với các trường sau:
    1. "number": Số ngày cá nhân (ví dụ: ${personalDayNumber}).
    2. "description": Diễn giải chung (5-6 câu) về năng lượng của ngày này.
    3. "shouldDo": Những việc nên làm hôm nay (4-5 câu), phù hợp với năng lượng số.
    4. "shouldAvoid": Những việc nên tránh hôm nay (3-4 câu), không hợp với năng lượng số.
    5. "lunchSuggestion": Gợi ý món ăn trưa thực tế (2-3 câu), phù hợp với năng lượng số, không hài hước.
    Giọng điệu tự nhiên, khách quan, tránh "nên" quá cứng nhắc. Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.number || !data.description) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return { dailyNumerology: data };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackResponse(personalDayNumber, birthDate, currentDate);
  }
});

function getFallbackResponse(personalDayNumber, birthDate, currentDate) {
  const descriptions = {
    1: {
      description: `Ngày hôm nay mang năng lượng của số 1, tập trung vào sự độc lập và khởi đầu mới. Đây là ngày mà bạn cảm thấy tràn đầy động lực để bắt đầu một điều gì đó quan trọng. Sự tự tin và quyết đoán sẽ dẫn dắt bạn qua các thử thách. Mọi thứ dường như rõ ràng hơn, giúp bạn dễ dàng đặt mục tiêu. Tận dụng năng lượng này để khẳng định bản thân trong công việc hoặc cuộc sống cá nhân. Một ngày đầy triển vọng nếu bạn biết nắm bắt cơ hội.`,
      shouldDo: `Hôm nay là thời điểm tuyệt vời để bắt đầu một dự án mới hoặc đưa ra quyết định quan trọng. Tập trung vào những việc đòi hỏi sự độc lập và sáng tạo sẽ mang lại kết quả tốt. Giao tiếp rõ ràng với người khác để thể hiện ý tưởng của bạn. Tự tin bước ra khỏi vùng an toàn cũng là cách để phát triển bản thân trong ngày này.`,
      shouldAvoid: `Đừng để bản thân bị cuốn vào những tranh cãi không cần thiết, vì năng lượng số 1 dễ khiến bạn nóng nảy. Tránh làm việc nhóm nếu không thực sự cần thiết, vì bạn có thể cảm thấy khó chịu khi phải phụ thuộc người khác. Hạn chế trì hoãn, vì ngày này không hợp với sự do dự.`,
      lunchSuggestion: `Một bữa trưa nhẹ nhàng nhưng giàu năng lượng như gà nướng với salad rau xanh sẽ phù hợp với ngày này. Món ăn đơn giản, dễ tiêu hóa giúp bạn duy trì sự tập trung và tỉnh táo suốt cả ngày.`
    },
    2: {
      description: `Số 2 mang đến năng lượng của sự hợp tác và cảm xúc trong ngày hôm nay. Đây là ngày để bạn chú ý đến các mối quan hệ và lắng nghe trực giác của mình. Sự nhạy bén trong giao tiếp sẽ giúp bạn xây dựng sự kết nối sâu sắc hơn với người khác. Một bầu không khí yên bình và hài hòa bao quanh bạn. Ngày này khuyến khích sự kiên nhẫn và khả năng thích nghi với hoàn cảnh.`,
      shouldDo: `Hãy dành thời gian để trò chuyện hoặc hỗ trợ người thân, bạn bè, đồng nghiệp. Làm việc nhóm hoặc tham gia các hoạt động đòi hỏi sự phối hợp sẽ rất hiệu quả hôm nay. Lắng nghe cảm xúc của bản thân và người khác để giải quyết mọi thứ một cách nhẹ nhàng. Tìm kiếm sự cân bằng trong công việc và cuộc sống cũng là điều phù hợp.`,
      shouldAvoid: `Tránh đưa ra quyết định vội vàng hoặc cố gắng kiểm soát mọi thứ, vì năng lượng số 2 không ủng hộ sự độc đoán. Đừng giữ cảm xúc tiêu cực trong lòng quá lâu, vì điều đó có thể làm bạn mất cân bằng. Hạn chế ở một mình quá nhiều, vì ngày này cần sự tương tác.`,
      lunchSuggestion: `Một bát súp gà ấm áp với rau củ sẽ là lựa chọn lý tưởng cho trưa nay. Món ăn này vừa nhẹ nhàng, vừa bổ dưỡng, giúp bạn cảm thấy thoải mái và hài hòa với năng lượng ngày số 2.`
    },
    // Thêm các số 3-9 tương tự, mình sẽ viết ví dụ cho số 9 (dựa trên yêu cầu trước của bạn)
    9: {
      description: `Ngày hôm nay chịu ảnh hưởng của số 9, mang năng lượng của sự hoàn thiện và lòng nhân ái. Đây là thời điểm bạn cảm thấy muốn kết nối với những giá trị lớn lao hơn, vượt ra khỏi cái tôi cá nhân. Sự sáng tạo và cảm hứng dâng cao, thúc đẩy bạn nghĩ về những điều ý nghĩa trong cuộc sống. Một ngày phù hợp để nhìn lại và buông bỏ những gì không còn cần thiết. Năng lượng này cũng khơi dậy lòng trắc ẩn và mong muốn giúp đỡ người khác.`,
      shouldDo: `Hãy dành thời gian tham gia các hoạt động sáng tạo như viết lách, vẽ tranh hoặc suy ngẫm về mục tiêu dài hạn. Giúp đỡ ai đó hoặc tham gia công việc thiện nguyện sẽ mang lại cảm giác thỏa mãn. Nhìn lại những việc đã làm và hoàn thành những dự án còn dang dở là cách tận dụng tốt ngày này. Tâm trạng cởi mở sẽ giúp bạn kết nối sâu sắc hơn với xung quanh.`,
      shouldAvoid: `Đừng quá tập trung vào những chi tiết nhỏ nhặt hoặc cố chấp giữ lại những thứ không còn giá trị, vì số 9 khuyến khích sự buông bỏ. Tránh sự ích kỷ hoặc nóng giận, vì năng lượng ngày này hướng đến sự bao dung. Hạn chế lãng phí thời gian vào những việc vô nghĩa, vì bạn cần giữ sự tập trung cho điều quan trọng.`,
      lunchSuggestion: `Một đĩa cơm gạo lứt với cá hồi áp chảo và rau luộc sẽ rất phù hợp hôm nay. Món ăn giàu dinh dưỡng này hỗ trợ sự thanh lọc cơ thể và tinh thần, đồng điệu với năng lượng hoàn thiện của số 9.`
    }
  };

  const fallback = descriptions[personalDayNumber] || descriptions[1];
  return {
    dailyNumerology: {
      number: personalDayNumber,
      description: fallback.description,
      shouldDo: fallback.shouldDo,
      shouldAvoid: fallback.shouldAvoid,
      lunchSuggestion: fallback.lunchSuggestion
    }
  };
}