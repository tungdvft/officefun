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

  const prompt = `Dựa trên thần số học, tạo bản đồ thành công với ngày sinh ${birthDate} và các con số:
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
    - "milestones": Object chứa các cột mốc:
      - "shortTerm": Cột mốc ngắn hạn dựa trên Số Linh hồn (3-4 câu).
      - "mediumTerm": Cột mốc trung hạn dựa trên Số Tên (3-4 câu).
      - "longTerm": Cột mốc dài hạn dựa trên Số Đường đời (3-4 câu).
      - "currentYear": Cột mốc năm 2025 dựa trên Số Cá nhân (3-4 câu).
    Giọng điệu tự nhiên, khách quan, dùng "bạn" thay vì tên cụ thể trong diễn giải, chỉ nhắc tên "${name}" ở câu đầu mỗi phần "goal", "strengths", "notes", "strategy". Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.lifePathNumber || !data.milestones) {
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
      goal: `Với Số Đường đời ${numbers.lifePath}, "${name}" hướng đến một cuộc sống giàu tri thức và sự hiểu biết sâu sắc. Đây là con đường tập trung vào nghiên cứu, phân tích và khám phá ý nghĩa cuộc đời. Mục tiêu lớn của bạn là đạt được sự độc lập trong tư duy và đóng góp giá trị cho cộng đồng. Một hành trình đòi hỏi bạn kiên nhẫn và chú trọng vào chiều sâu thay vì bề nổi.`,
      strengths: `Số Tên ${numbers.expression} cho thấy "${name}" sở hữu trực giác mạnh mẽ và khả năng sáng tạo vượt trội. Bạn dễ dàng truyền cảm hứng và dẫn dắt người khác qua những ý tưởng độc đáo. Điểm mạnh của bạn nằm ở khả năng nhìn nhận vấn đề từ nhiều góc độ khác nhau.`,
      notes: `Số Linh hồn ${numbers.soulUrge} tiết lộ mong muốn sâu thẳm của "${name}" là tự do và trải nghiệm mới. Bạn cần lưu ý tránh cảm giác bị gò bó hoặc rơi vào thói quen lặp lại quá lâu. Tìm kiếm sự linh hoạt sẽ giúp bạn giữ được tinh thần tươi mới.`,
      strategy: `Năm 2025 với Số Cá nhân ${numbers.personalYear} là thời điểm để "${name}" tập trung vào sức mạnh và thành tựu. Đây là lúc bạn tổ chức lại cuộc sống và đặt mục tiêu lớn để theo đuổi. Quản lý tài chính hiệu quả và xây dựng nền tảng vững chắc sẽ mang lại kết quả lâu dài cho bạn. Tận dụng năng lượng này để tiến xa trong những kế hoạch quan trọng.`,
      milestones: {
        shortTerm: `Dựa trên Số Linh hồn ${numbers.soulUrge}, bước đầu tiên của bạn là tìm kiếm sự tự do trong suy nghĩ và hành động. Hãy thử thay đổi nhỏ trong thói quen hàng ngày để cảm nhận sự mới mẻ. Điều này giúp bạn khơi dậy động lực ban đầu.`,
        mediumTerm: `Với Số Tên ${numbers.expression}, bạn có thể xây dựng nền tảng bằng cách phát huy khả năng sáng tạo. Tập trung vào một dự án nhỏ sử dụng điểm mạnh của mình để tạo dấu ấn. Đây là bước chuẩn bị cho những thành công lớn hơn.`,
        longTerm: `Số Đường đời ${numbers.lifePath} định hướng bạn đến việc hoàn thiện tri thức và tư duy độc lập. Hãy đặt mục tiêu dài hạn như hoàn thành một nghiên cứu hoặc đóng góp cho cộng đồng. Đây là cột mốc khẳng định giá trị của bạn.`,
        currentYear: `Năm 2025 với Số Cá nhân ${numbers.personalYear}, bạn cần lập kế hoạch chi tiết cho một mục tiêu lớn trong năm. Tập trung vào tổ chức và quản lý nguồn lực để đạt kết quả rõ ràng. Đây là cột mốc quan trọng để tạo đà cho tương lai.`
      }
    }
  };
}