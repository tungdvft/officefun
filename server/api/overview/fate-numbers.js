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
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu thực tế, gần gũi như lời khuyên từ một người bạn, không dùng hình ảnh ẩn dụ bay bổng (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
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
attitude: Số Thái độ ${numbers.attitude} của bạn, ${name}, được tính từ ngày sinh ${birthDate}, cho thấy cách bạn tiếp cận mọi việc trong cuộc sống. Nó như một phần tính cách tự nhiên, giúp bạn đưa ra quyết định dựa trên trực giác và kinh nghiệm. Bạn có thể dựa vào điều này để xử lý những tình huống khó khăn một cách linh hoạt. Đây là thứ giúp bạn giữ sự cân bằng trong các lựa chọn của mình.
birthDay: Số Ngày sinh ${numbers.birthDay} của bạn, ${name}, xuất phát từ ngày sinh ${birthDate}, là một phần quan trọng trong con người bạn. Nó thể hiện cách bạn thể hiện bản thân qua những việc nhỏ nhặt hàng ngày. Bạn có thể dùng nó để hiểu rõ hơn về điểm mạnh tự nhiên của mình. Nó như một gợi ý để bạn sống đúng với bản chất.
mission: Số Sứ mệnh ${numbers.mission} của bạn, ${name}, được lấy từ tên bạn, nói về mục tiêu lớn mà bạn hướng tới. Nó cho thấy bạn có khả năng tạo ảnh hưởng hoặc để lại dấu ấn trong cuộc sống. Hãy nghĩ về nó như một lời nhắc để bạn tập trung vào điều thật sự quan trọng với mình. Đây là hướng đi để bạn phát triển lâu dài.
challenge: Số Thử thách ${numbers.challenge} của bạn, ${name}, dựa trên ngày sinh ${birthDate}, là bài học lớn mà bạn cần vượt qua. Nó chỉ ra những khó khăn có thể khiến bạn chậm lại, nhưng cũng giúp bạn trưởng thành hơn. Bạn nên chú ý đến điều này để tìm cách đối mặt và vượt qua. Nó như một thử nghiệm để bạn khám phá sức mạnh của chính mình.
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