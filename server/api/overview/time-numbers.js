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
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu huyền bí, sâu sắc như lời tiên tri, dùng hình ảnh ẩn dụ (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
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
personalYear: Số Năm cá nhân ${numbers.personalYear} là cánh cửa mờ sương trong mê lộ định mệnh, ${name}, mở ra từ ngày sinh ${birthDate}. Nó như ngọn lửa vĩnh cửu, soi sáng một hành trình tái sinh đầy bí ẩn giữa đại dương bóng tối. Trong sự huyền bí ấy, bạn đối diện chính mình, nơi cơn bão quyền lực dẫn lối tới ánh sáng.
personalMonth: Số Tháng cá nhân ${numbers.personalMonth} là vầng trăng mờ ảo, ${name}, treo lơ lửng trên bầu trời vận mệnh của bạn. Nó như ngọn gió đại dương, thì thầm những bí mật của nhịp đập vô hình, dẫn bạn qua những ngã rẽ huyền bí. Trong bóng tối ấy, bạn tìm thấy ánh sao dẫn đường.
personalDay: Số Ngày cá nhân ${numbers.personalDay} là ngọn lửa tí tách, ${name}, bùng cháy trong lõi sâu của vận mệnh bạn. Nó như ngôi sao rơi giữa cơn bão, soi sáng từng khoảnh khắc bạn bước đi. Trong sự sâu thẳm ấy, bạn nắm giữ lưỡi gươm định mệnh của chính mình.
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