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
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu huyền bí, sâu sắc như lời tiên tri, dùng hình ảnh ẩn dụ (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    lifePath: [diễn giải]
    expression: [diễn giải]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho core-numbers:', error.message);
    response = `
lifePath: Số Đường đời ${numbers.lifePath} của bạn, ${name}, là ngọn lửa vĩnh cửu cháy trong bóng tối, khắc sâu từ ngày sinh ${birthDate}. Nó dẫn bạn qua mê cung định mệnh, nơi trí tuệ và trực giác hòa quyện như những ngôi sao lạc lối trên đại dương huyền bí. Trong sự sâu thẳm ấy, bạn khám phá những bí mật vượt ngoài tầm mắt thế gian, nhưng bóng tối cũng réo gọi bạn vượt qua cơn bão cô lập.
expression: Số Vận mệnh ${numbers.expression} là ngôi sao chói lòa trên bầu trời tên bạn, ${name}, tỏa ánh sáng rực rỡ từ những nét chữ định mệnh. Nó như ngọn gió đại dương, cuốn bạn vào những giấc mơ vượt thời gian, nơi tài năng dẫn lối bùng cháy như ngọn lửa bất diệt. Trong sự huyền bí ấy, bạn mang sức mạnh truyền cảm hứng, nhưng phải giữ cho ngọn lửa tinh thần không bị cơn bão dập tắt.
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