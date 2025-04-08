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
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu thực tế, gần gũi như lời khuyên từ một người bạn, không dùng hình ảnh ẩn dụ bay bổng (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    soulUrge: [diễn giải]
    personality: [diễn giải]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho inner-numbers:', error.message);
    response = `
soulUrge: Số Linh hồn ${numbers.soulUrge} của bạn, ${name}, được tính từ tên bạn, cho thấy bạn khao khát ${meanings.soulUrge.desire} trong cuộc sống. Điều thúc đẩy bạn là ${meanings.soulUrge.motivation}, và bạn sẽ cảm thấy trọn vẹn khi đạt được ${meanings.soulUrge.fulfillment}. Nó như một phần sâu kín trong bạn, định hướng những gì bạn thật sự muốn. Hãy lắng nghe điều này để hiểu rõ hơn về bản thân mình.
personality: Số Nhân cách ${numbers.personality} của bạn, ${name}, cũng dựa trên tên bạn, thể hiện cách mọi người nhìn bạn qua ${meanings.personality.theme}. Bạn để lại ấn tượng với ${meanings.personality.strengths[0]} và ${meanings.personality.strengths[1]}, là điểm mạnh trong giao tiếp xã hội. Nhưng bạn nên chú ý đến ${meanings.personality.challenges[0]}, để tránh những hiểu lầm không đáng có. Đây là cách bạn xây dựng hình ảnh của mình với người khác.
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