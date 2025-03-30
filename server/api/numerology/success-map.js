// server/api/numerology/success-map.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

function calculateLifePathNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth, birthYear] = birthDate.split('/').map(Number);
  let sum = birthDay + birthMonth + birthYear;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

function calculateExpressionNumber(name) {
  const pythagorean = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = cleanName.split('').reduce((acc, char) => acc + (pythagorean[char] || 0), 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

function calculateSoulUrgeNumber(name) {
  const vowels = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  let sum = cleanName.split('').reduce((acc, char) => acc + (vowels[char] || 0), 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

function calculatePersonalYearNumber(birthDate, year = 2025) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  let sum = birthDay + birthMonth + year;
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || 1;
}

export default defineEventHandler(async (event) => {
  const { name, birthDate } = await readBody(event);

  if (!name || !birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
    });
  }

  const numbers = {
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name),
    personalYear: calculatePersonalYearNumber(birthDate, 2025)
  };

  const prompt = `Dựa trên thần số học, tạo bản đồ thành công cho "${name}" với ngày sinh ${birthDate}, dựa trên các con số:
    - Số Đường đời: ${numbers.lifePath}
    - Số Tên: ${numbers.expression}
    - Số Linh hồn: ${numbers.soulUrge}
    - Số Cá nhân năm 2025: ${numbers.personalYear}
    Trả về JSON hợp lệ với các trường:
    - "lifePathNumber": Số Đường đời.
    - "expressionNumber": Số Tên.
    - "soulUrgeNumber": Số Linh hồn.
    - "personalYearNumber": Số Cá nhân năm 2025.
    - "goal": Mục tiêu lớn dựa trên Số Đường đời (4-5 câu).
    - "strengths": Điểm mạnh dựa trên Số Tên (3-4 câu).
    - "notes": Điểm cần lưu ý dựa trên Số Linh hồn (3-4 câu).
    - "strategy": Chiến lược năm 2025 dựa trên Số Cá nhân (4-5 câu).
    Giọng điệu tự nhiên, khách quan, nhắc tên "${name}" ở câu đầu mỗi phần. Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.lifePathNumber || !data.goal) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return { successMap: data };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackResponse(name, birthDate);
  }
});

function getFallbackResponse(name, birthDate) {
  const numbers = {
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name),
    personalYear: calculatePersonalYearNumber(birthDate, 2025)
  };

  return {
    successMap: {
      lifePathNumber: numbers.lifePath,
      expressionNumber: numbers.expression,
      soulUrgeNumber: numbers.soulUrge,
      personalYearNumber: numbers.personalYear,
      goal: `Với Số Đường đời ${numbers.lifePath}, "${name}" hướng đến một cuộc sống giàu tri thức và sự hiểu biết sâu sắc. Đây là con đường tập trung vào nghiên cứu, phân tích và khám phá ý nghĩa cuộc đời. Mục tiêu lớn là đạt được sự độc lập trong tư duy và đóng góp giá trị cho cộng đồng. Một hành trình đòi hỏi sự kiên nhẫn và tập trung vào chiều sâu thay vì bề nổi.`,
      strengths: `Số Tên ${numbers.expression} cho thấy "${name}" sở hữu trực giác mạnh mẽ và khả năng sáng tạo vượt trội. Điều này giúp dễ dàng truyền cảm hứng và dẫn dắt người khác. Tài năng nằm ở việc nhìn nhận vấn đề từ nhiều góc độ và đưa ra giải pháp độc đáo.`,
      notes: `Số Linh hồn ${numbers.soulUrge} tiết lộ mong muốn sâu thẳm của "${name}" là tự do và trải nghiệm mới. Cần lưu ý tránh cảm giác bị gò bó hoặc rơi vào thói quen lặp lại quá lâu. Tìm kiếm sự linh hoạt trong công việc và cuộc sống sẽ giữ cho tinh thần luôn tươi mới.`,
      strategy: `Năm 2025 với Số Cá nhân ${numbers.personalYear} là thời điểm để "${name}" tập trung vào sức mạnh và thành tựu. Đây là lúc tổ chức lại cuộc sống, đặt mục tiêu lớn và hành động quyết liệt để đạt được chúng. Quản lý tài chính hiệu quả và xây dựng nền tảng vững chắc sẽ mang lại kết quả lâu dài. Tận dụng năng lượng này để tiến xa trong các kế hoạch quan trọng.`
    }
  };
}