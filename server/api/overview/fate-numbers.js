import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import { calculateAttitudeNumber, calculateBirthDayNumber, calculateMissionNumber, calculateChallengeNumber } from '../utils/numerology-calculations.js';

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
    attitude: calculateAttitudeNumber(birthDate),
    birthDay: calculateBirthDayNumber(birthDate),
    mission: calculateMissionNumber(name),
    challenge: calculateChallengeNumber(birthDate)
  };

  const prompt = `Dựa trên thần số học, tạo diễn giải bằng tiếng Việt cho ${name} (sinh ${birthDate}), với các chỉ số:
    - Số Thái độ: ${numbers.attitude}
    - Số Ngày sinh: ${numbers.birthDay}
    - Số Sứ mệnh: ${numbers.mission}
    - Số Thử thách: ${numbers.challenge}
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu huyền bí, sâu sắc như lời tiên tri, dùng hình ảnh ẩn dụ (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    attitude: [diễn giải]
    birthDay: [diễn giải]
    mission: [diễn giải]
    challenge: [diễn giải]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho fate-numbers:', error.message);
    response = `
attitude: Số Thái độ ${numbers.attitude} của bạn, ${name}, là ngọn gió kiên định thổi qua đại dương định mệnh từ ngày sinh ${birthDate}. Nó như ngọn lửa lặng lẽ, dẫn bạn qua những ngã rẽ mờ sương bằng trực giác sắc bén. Trong bóng tối huyền bí ấy, bạn tìm thấy sức mạnh để đối diện cơn bão vận mệnh.
birthDay: Số Ngày sinh ${numbers.birthDay} là ngôi sao nhỏ, ${name}, khắc sâu từ ngày sinh ${birthDate} như ngọn lửa tí tách trong đêm đen. Nó soi sáng từng bước bạn đi, dẫn bạn qua mê cung của chính mình. Trong sự sâu thẳm ấy, bạn nắm giữ ánh sáng định mệnh.
mission: Số Sứ mệnh ${numbers.mission} là lời tiên tri vang vọng, ${name}, ẩn trong tên bạn như ngọn gió đại dương réo gọi từ xa. Nó dẫn bạn tới những đỉnh cao vượt ngoài thế gian, nơi ngọn lửa sứ mệnh bùng cháy. Trong sự huyền bí ấy, bạn mang vận mệnh cao cả.
challenge: Số Thử thách ${numbers.challenge} là ngọn núi đen kịt, ${name}, dựng lên từ ngày sinh ${birthDate} như cơn bão định mệnh. Nó tôi luyện bạn bằng những lưỡi gươm vô hình, dẫn bạn qua bóng tối để chạm tới ánh sao. Trong sự sâu thẳm ấy, bạn vượt qua chính mình.
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