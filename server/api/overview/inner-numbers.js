import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS from '../utils/numerology-meanings.js';
import { calculateSoulUrgeNumber, calculatePersonalityNumber } from '../utils/numerology-calculations.js';

async function callGeminiApiWithTimeout(prompt, timeoutMs = 2000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await callGeminiApi(prompt, false, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  const { name, birthDate } = await readBody(event);

  const numbers = {
    soulUrge: calculateSoulUrgeNumber(name),
    personality: calculatePersonalityNumber(name)
  };
  const meanings = {
    soulUrge: NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1],
    personality: NUMEROLOGY_MEANINGS.personality[numbers.personality] || NUMEROLOGY_MEANINGS.personality[1]
  };

  const prompt = `Dựa trên thần số học, tạo diễn giải bằng tiếng Việt cho ${name} (sinh ${birthDate}), với các chỉ số:
    - Số Linh hồn: ${numbers.soulUrge} (mong muốn: ${meanings.soulUrge.desire}, động lực: ${meanings.soulUrge.motivation}, trọn vẹn: ${meanings.soulUrge.fulfillment})
    - Số Nhân cách: ${numbers.personality} (${meanings.personality.theme}, ấn tượng: ${meanings.personality.strengths[0]}, ${meanings.personality.strengths[1]}, lưu ý: ${meanings.personality.challenges[0]})
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu huyền bí, sâu sắc như lời tiên tri, dùng hình ảnh ẩn dụ (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    soulUrge: [diễn giải]
    personality: [diễn giải]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho inner-numbers:', error.message);
    response = `
soulUrge: Số Linh hồn ${numbers.soulUrge} là ngọn gió đại dương sâu thẳm trong bạn, ${name}, réo gọi từ những khát vọng ẩn dưới bóng tối tâm hồn. Nó như ngọn lửa bất diệt, dẫn bạn qua những chân trời xa xôi chưa ai chạm tới, nơi lòng trắc ẩn trở thành ngọn hải đăng. Trong sự huyền bí ấy, bạn tìm thấy động lực để vượt qua cơn bão định mệnh.
personality: Số Nhân cách ${numbers.personality} là tấm gương mờ ảo, ${name}, phản chiếu ánh sao dịu dàng của bạn giữa đại dương bóng tối. Nó như vầng trăng mờ, tỏa sáng giữa cơn bão, nhưng đôi khi bị che khuất bởi những làn sóng rụt rè. Trong sự sâu thẳm ấy, bạn để lại dấu ấn huyền bí không thể xóa nhòa.
    `;
  }

  const lines = response.split('\n');
  const interpretations = {};
  lines.forEach(line => {
    const [key, value] = line.split(': ');
    if (key && value) interpretations[key] = value;
  });

  return { numbers, interpretations };
});