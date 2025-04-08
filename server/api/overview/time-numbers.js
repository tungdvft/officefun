import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS from '../utils/numerology-meanings.js';
import { calculatePersonalYearNumber, calculatePersonalMonthNumber, calculatePersonalDayNumber } from '../utils/numerology-calculations.js';

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
    personalYear: calculatePersonalYearNumber(birthDate),
    personalMonth: calculatePersonalMonthNumber(birthDate),
    personalDay: calculatePersonalDayNumber(birthDate)
  };
  const meanings = {
    personalYear: NUMEROLOGY_MEANINGS.personalYear[numbers.personalYear] || NUMEROLOGY_MEANINGS.personalYear[1]
  };

  const prompt = `Dựa trên thần số học, tạo diễn giải bằng tiếng Việt cho ${name} (sinh ${birthDate}), với các chỉ số:
    - Số Năm cá nhân: ${numbers.personalYear} (${meanings.personalYear.theme}, tập trung: ${meanings.personalYear.focus[0]}, ${meanings.personalYear.focus[1]}, lời khuyên: ${meanings.personalYear.advice})
    - Số Tháng cá nhân: ${numbers.personalMonth}
    - Số Ngày cá nhân: ${numbers.personalDay}
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu thực tế, gần gũi như lời khuyên từ một người bạn, không dùng hình ảnh ẩn dụ bay bổng (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    personalYear: [diễn giải]
    personalMonth: [diễn giải]
    personalDay: [diễn giải]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho time-numbers:', error.message);
    response = `
personalYear: Số Năm cá nhân ${numbers.personalYear} của bạn, ${name}, được tính từ ngày sinh ${birthDate}, mang đến cơ hội liên quan đến ${meanings.personalYear.theme}. Bạn nên tập trung vào ${meanings.personalYear.focus[0]} và ${meanings.personalYear.focus[1]} để tận dụng tốt giai đoạn này. Lời khuyên là ${meanings.personalYear.advice}, hãy áp dụng để đạt được kết quả tốt nhất. Nó như một hướng dẫn để bạn định hướng hành động của mình.
personalMonth: Số Tháng cá nhân ${numbers.personalMonth} của bạn, ${name}, cho thấy những gì bạn cần chú ý trong khoảng thời gian ngắn sắp tới. Nó như một gợi ý nhỏ, giúp bạn điều chỉnh kế hoạch và hành động hàng ngày. Bạn có thể dựa vào con số này để làm mọi thứ hiệu quả hơn. Đây là cách để bạn giữ mọi việc đi đúng hướng.
personalDay: Số Ngày cá nhân ${numbers.personalDay} của bạn, ${name}, là một chỉ dẫn nhỏ cho từng ngày trong cuộc sống. Nó thể hiện cách bạn nên tiếp cận những việc xảy ra xung quanh mình. Bạn có thể dùng nó để quyết định khi nào cần tập trung hoặc nghỉ ngơi. Đây là một công cụ đơn giản để bạn sống tốt hơn mỗi ngày.
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