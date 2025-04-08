import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS from '../utils/numerology-meanings.js';
import {
  calculateGenerationNumber,
  calculateBalanceNumber,
  calculateCreativeNumber,
  calculateMaturityNumber,
  calculatePowerNumber,
  calculateSubconsciousSelfNumber,
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculatePersonalYearNumber,
  calculatePersonalMonthNumber,
  calculatePersonalDayNumber,
  calculateAttitudeNumber,
  calculateBirthDayNumber,
  calculateMissionNumber,
  calculateChallengeNumber
} from '../utils/numerology-calculations.js';

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
    generation: calculateGenerationNumber(birthDate),
    balance: calculateBalanceNumber(name),
    creative: calculateCreativeNumber(birthDate, name),
    maturity: calculateMaturityNumber(birthDate, name),
    power: calculatePowerNumber(birthDate, name),
    subconsciousSelf: calculateSubconsciousSelfNumber(name),
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name),
    personality: calculatePersonalityNumber(name),
    personalYear: calculatePersonalYearNumber(birthDate),
    personalMonth: calculatePersonalMonthNumber(birthDate),
    personalDay: calculatePersonalDayNumber(birthDate),
    attitude: calculateAttitudeNumber(birthDate),
    birthDay: calculateBirthDayNumber(birthDate),
    mission: calculateMissionNumber(name),
    challenge: calculateChallengeNumber(birthDate)
  };
  const meanings = {
    lifePath: NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1],
    expression: NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1],
    soulUrge: NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1],
    personality: NUMEROLOGY_MEANINGS.personality[numbers.personality] || NUMEROLOGY_MEANINGS.personality[1],
    personalYear: NUMEROLOGY_MEANINGS.personalYear[numbers.personalYear] || NUMEROLOGY_MEANINGS.personalYear[1]
  };

  const prompt = `Dựa trên thần số học, tạo diễn giải bằng tiếng Việt cho ${name} (sinh ${birthDate}), chỉ tạo tổng quan với tất cả chỉ số:
    - Số Đường đời: ${numbers.lifePath} (${meanings.lifePath.theme})
    - Số Vận mệnh: ${numbers.expression} (${meanings.expression.theme})
    - Số Linh hồn: ${numbers.soulUrge} (mong muốn: ${meanings.soulUrge.desire})
    - Số Nhân cách: ${numbers.personality} (${meanings.personality.theme})
    - Số Thái độ: ${numbers.attitude}
    - Số Ngày sinh: ${numbers.birthDay}
    - Số Năm cá nhân: ${numbers.personalYear} (${meanings.personalYear.theme})
    - Số Tháng cá nhân: ${numbers.personalMonth}
    - Số Ngày cá nhân: ${numbers.personalDay}
    - Số Sứ mệnh: ${numbers.mission}
    - Số Thử thách: ${numbers.challenge}
    - Số Thế hệ: ${numbers.generation}
    - Số Cân bằng: ${numbers.balance}
    - Số Sáng tạo: ${numbers.creative}
    - Số Trưởng thành: ${numbers.maturity}
    - Số Năng lượng: ${numbers.power}
    - Số Tiềm thức: ${numbers.subconsciousSelf}
    Tổng quan phải thực tế, gần gũi như lời phân tích từ một người bạn hiểu biết, chia thành 6 phần riêng biệt (mỗi phần 3-4 câu), tập trung vào tương quan giữa các chỉ số:
    1. Bản chất của bạn: Liên kết Số Đường đời, Số Vận mệnh, Số Linh hồn.
    2. Tương lai gần: Liên kết Số Năm cá nhân, Số Tháng cá nhân, Số Ngày cá nhân.
    3. Thách thức và sức mạnh: Liên kết Số Thử thách, Số Năng lượng, Số Tiềm thức.
    4. Mục tiêu dài hạn: Liên kết Số Sứ mệnh, Số Trưởng thành, Số Thế hệ.
    5. Cách người khác nhìn bạn: Liên kết Số Nhân cách, Số Thái độ, Số Ngày sinh.
    6. Công cụ hỗ trợ: Liên kết Số Cân bằng, Số Sáng tạo.
    Giọng điệu thực tế, dễ hiểu, tránh hình ảnh ẩn dụ bay bổng, dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    core: [phần 1]
    nearFuture: [phần 2]
    challengesAndStrengths: [phần 3]
    longTermGoals: [phần 4]
    perception: [phần 5]
    tools: [phần 6]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho overview:', error.message);
    response = `
core: Số Đường đời ${numbers.lifePath} cho thấy bạn là người sống có mục tiêu, tập trung vào ${meanings.lifePath.theme}, Lan. Số Vận mệnh ${numbers.expression} nói bạn có tài năng ${meanings.expression.theme}, giúp bạn thể hiện bản thân tốt. Số Linh hồn ${numbers.soulUrge} tiết lộ bạn khao khát ${meanings.soulUrge.desire}, điều này định hình cách bạn chọn hướng đi trong cuộc sống.
nearFuture: Số Năm cá nhân ${numbers.personalYear} mang đến cơ hội liên quan đến ${meanings.personalYear.theme}, giúp bạn định hướng rõ hơn. Số Tháng cá nhân ${numbers.personalMonth} gợi ý bạn cần tập trung vào những bước nhỏ để tiến lên. Số Ngày cá nhân ${numbers.personalDay} như một lời nhắc để bạn chú ý đến từng ngày trong hành trình này.
challengesAndStrengths: Số Thử thách ${numbers.challenge} là bài học lớn, nhắc bạn vượt qua những khó khăn để trưởng thành. Số Năng lượng ${numbers.power} là sức mạnh bên trong, giúp bạn đứng vững trước thử thách. Số Tiềm thức ${numbers.subconsciousSelf} cho thấy cách bạn phản ứng tự nhiên, hỗ trợ bạn trong lúc cần thiết.
longTermGoals: Số Sứ mệnh ${numbers.mission} từ tên bạn nói về mục đích lớn, khuyến khích bạn theo đuổi điều ý nghĩa. Số Trưởng thành ${numbers.maturity} định hình hướng đi dài hạn, giúp bạn phát triển bản thân từng bước. Số Thế hệ ${numbers.generation} kết nối bạn với tinh thần của thế hệ mình, tạo nền tảng cho hành trình này.
perception: Số Nhân cách ${numbers.personality} cho thấy mọi người nhìn bạn là người ${meanings.personality.theme}, để lại ấn tượng rõ nét. Số Thái độ ${numbers.attitude} ảnh hưởng cách bạn tiếp cận vấn đề, giữ bạn linh hoạt. Số Ngày sinh ${numbers.birthDay} thêm một phần tính cách tự nhiên vào cách người khác hiểu bạn.
tools: Số Cân bằng ${numbers.balance} là điểm tựa, giúp bạn giữ bình tĩnh khi mọi thứ rối ren. Số Sáng tạo ${numbers.creative} mang đến ý tưởng mới, hỗ trợ bạn giải quyết vấn đề theo cách riêng. Hai con số này như công cụ để bạn tận dụng trong cuộc sống hàng ngày.
    `;
  }

  // Tách response thành các phần
  const lines = response.trim().split('\n');
  const overviewParts = {
    core: '',
    nearFuture: '',
    challengesAndStrengths: '',
    longTermGoals: '',
    perception: '',
    tools: ''
  };

  lines.forEach(line => {
    const [key, value] = line.split(': ');
    if (key && value) {
      overviewParts[key] = value.trim();
    }
  });

  return {
    numbers,
    overview: {
      core: overviewParts.core,
      nearFuture: overviewParts.nearFuture,
      challengesAndStrengths: overviewParts.challengesAndStrengths,
      longTermGoals: overviewParts.longTermGoals,
      perception: overviewParts.perception,
      tools: overviewParts.tools
    }
  };
});