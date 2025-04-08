import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS from '../utils/numerology-meanings.js';
import { calculateLifePathNumber, calculateExpressionNumber } from '../utils/numerology-calculations.js';

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
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name)
  };
  const meanings = {
    lifePath: NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1],
    expression: NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1]
  };

  const prompt = `Dựa trên thần số học, tạo diễn giải bằng tiếng Việt cho ${name} (sinh ${birthDate}), với các chỉ số:
    - Số Đường đời: ${numbers.lifePath} (${meanings.lifePath.theme}, điểm mạnh: ${meanings.lifePath.strengths[0]}, ${meanings.lifePath.strengths[1]}, thách thức: ${meanings.lifePath.challenges[0]})
    - Số Vận mệnh: ${numbers.expression} (${meanings.expression.theme}, tài năng: ${meanings.expression.talents[0]}, ${meanings.expression.talents[1]}, lời khuyên: ${meanings.expression.tip})
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu thực tế, gần gũi như lời khuyên từ một người bạn, không dùng hình ảnh ẩn dụ bay bổng (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    lifePath: [diễn giải]
    expression: [diễn giải]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho core-numbers:', error.message);
    response = `
lifePath: Số Đường đời ${numbers.lifePath} của bạn, ${name}, được tính từ ngày sinh ${birthDate}, cho thấy bạn là người sống với mục tiêu rõ ràng theo hướng ${meanings.lifePath.theme}. Bạn có điểm mạnh là ${meanings.lifePath.strengths[0]} và ${meanings.lifePath.strengths[1]}, giúp bạn tự tin trong cuộc sống. Nhưng đôi khi bạn sẽ gặp thách thức là ${meanings.lifePath.challenges[0]}, nên hãy chú ý cân bằng để vượt qua. Nó như một kim chỉ nam để bạn hiểu rõ mình hơn.
expression: Số Vận mệnh ${numbers.expression} của bạn, ${name}, xuất phát từ tên bạn, thể hiện khả năng ${meanings.expression.theme} mà bạn mang trong mình. Bạn có tài năng ${meanings.expression.talents[0]} và ${meanings.expression.talents[1]}, là lợi thế để bạn phát triển. Lời khuyên là ${meanings.expression.tip}, hãy áp dụng để tận dụng tối đa khả năng của mình. Đây là cách bạn có thể để lại dấu ấn trong cuộc sống.
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