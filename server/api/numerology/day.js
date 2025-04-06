import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();
  return {
    currentDate: `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    day,
    month,
    year
  };
}

function calculateNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { day, month, year } = getCurrentDateInfo();
  const sum = birthDay + birthMonth + day + month + year;
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

async function callGeminiApiWithTimeout(prompt, timeoutMs = 5000) {
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

async function getPeriodData(name, birthDate, period) {
  const dateInfo = getCurrentDateInfo();
  const randomSeed = Math.floor(Math.random() * 10000);
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });

  const prompt = `Dựa trên thần số học, phân tích cho "${name}" (sinh ${birthDate}) tại ${timestamp}, random seed ${randomSeed}:
    Ngày ${dateInfo.currentDate} (số ${period.number})
    Trả về CHỈ JSON: { "day": {} }, object chứa:
    - "number": Số cá nhân.
    - "theme": Chủ đề chính (ví dụ: "Khởi đầu").
    - "description": Diễn giải (8-10 câu), bắt đầu bằng "${name}", giọng tự nhiên, sâu sắc.
    - "focus": Mảng 4 yếu tố cần tập trung.
    - "keywords": Mảng 5 từ khóa nổi bật.
    - "shouldDo": Mảng 6 câu gợi ý việc nên làm.
    - "shouldAvoid": Mảng 5 câu việc nên tránh.
    - "energyTips": Mảng 3 câu mẹo cân bằng năng lượng.
    - "lunchSuggestion": Mảng 4 câu gợi ý món ăn trưa dựa trên số ${period.number}.`;

  let periodData;
  try {
    const rawData = await callGeminiApiWithTimeout(prompt, 5000);
    periodData = typeof rawData === 'string' ? JSON.parse(rawData.replace(/```json|```/g, '').trim()).day : rawData.day;
    if (!periodData) throw new Error('Dữ liệu từ Gemini không đầy đủ');
  } catch (error) {
    periodData = generateFallbackData(name, birthDate, period);
  }
  return periodData;
}

function generateFallbackData(name, birthDate, period) {
  const number = period.number in NUMEROLOGY_MEANINGS.personalYear ? period.number : 1;
  const meaning = NUMEROLOGY_MEANINGS.personalYear[number];
  return {
    number,
    theme: meaning.theme,
    description: `"${name}", ngày ${period.text} mang năng lượng số ${number}, đại diện cho ${meaning.theme.toLowerCase()}. Đây là một ngày để bạn chú trọng vào những thay đổi nhỏ nhưng ý nghĩa trong cuộc sống thường nhật. Năng lượng này khuyến khích sự linh hoạt và sáng tạo trong mọi hành động. Hãy lắng nghe trực giác để đưa ra quyết định đúng lúc trong ngày. Những cơ hội bất ngờ có thể xuất hiện nếu bạn giữ tinh thần cởi mở. Mỗi bước nhỏ hôm nay đều là nền tảng cho tương lai. Đừng ngại thử điều mới, dù chỉ là thay đổi thói quen. Một ngày đầy cảm hứng đang chờ bạn khám phá!`,
    focus: ['Tập trung', 'Sáng tạo', 'Linh hoạt', 'Trực giác'],
    keywords: ['năng lượng', 'thay đổi', 'cơ hội', 'sáng tạo', 'phát triển'],
    shouldDo: [
      `Lập kế hoạch ngắn cho ngày để tận dụng năng lượng.`,
      `Thử một việc mới như vẽ hoặc viết để kích thích sáng tạo.`,
      `Dành 10 phút đi bộ để hít thở không khí trong lành.`,
      `Gửi tin nhắn hỏi thăm bạn bè để kết nối.`,
      `Hoàn thành một nhiệm vụ nhỏ còn dang dở.`,
      `Nghe nhạc yêu thích để nạp năng lượng tích cực.`
    ],
    shouldAvoid: [
      `Tránh trì hoãn công việc quan trọng hôm nay.`,
      `Hạn chế tranh cãi để giữ hòa khí trong ngày.`,
      `Đừng làm việc quá sức, hãy giữ sức khỏe.`,
      `Tránh lướt mạng xã hội quá lâu, dễ mất tập trung.`,
      `Hạn chế ăn đồ chiên rán để cơ thể nhẹ nhàng.`
    ],
    energyTips: [
      `Hít thở sâu 5 phút sáng nay để khởi động năng lượng.`,
      `Uống nước chanh ấm giữa ngày để duy trì sự tỉnh táo.`,
      `Thắp nến tối nay để thư giãn và cân bằng tâm trí.`
    ],
    lunchSuggestion: [
      `Thử cơm gà xối mỡ nóng hổi, hợp với số ${number}.`,
      `Một tô mì bò kho đậm đà với bánh mì giòn rất đáng thử.`,
      `Salad cá hồi sốt chanh dây để cân bằng năng lượng.`,
      `Bún bò Huế cay nồng thêm rau thơm để làm ngày thêm thú vị.`
    ]
  };
}

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.' });
  }

  const dateInfo = getCurrentDateInfo();
  const period = { number: calculateNumber(birthDate), text: dateInfo.currentDate };
  const periodData = await getPeriodData(name, birthDate, period);

  return {
    numerology: { name, birthDate, periods: { day: periodData } },
    meta: {
      processedIn: `${Date.now() - startTime}ms`,
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }),
      source: 'xai-grok'
    }
  };
});