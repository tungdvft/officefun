// server/api/numerology/personal-year.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

function getPersonalYearNumber(birthDate, year) {
  const [day, month] = birthDate.split('/').map(Number);
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 9;
}

export default defineEventHandler(async (event) => {
  const { birthDate, year } = await readBody(event);

  if (!birthDate || !year) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: birthDate và year là bắt buộc.',
    });
  }

  const personalYearNumber = getPersonalYearNumber(birthDate, year);

  const prompt = `Dựa trên thần số học, tính số năm cá nhân ${personalYearNumber} từ ngày sinh "${birthDate}" và năm ${year}. Trả về JSON hợp lệ với phần "personalYear" chứa:
    1. "number": số năm cá nhân,
    2. "description": mô tả chi tiết (10-15 câu) về năng lượng, cơ hội và thách thức của số năm cá nhân này trong năm ${year}.
    Không thêm thông tin nào khác ngoài các trường trên. Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.personalYear) throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error);
    return {
      personalYear: {
        number: personalYearNumber,
        description: `Số năm cá nhân ${personalYearNumber} mang năng lượng đặc trưng trong năm ${year}. Đây là một năm để bạn tập trung vào sự phát triển cá nhân và khám phá cơ hội mới. Với số ${personalYearNumber}, bạn có thể gặp nhiều thay đổi tích cực nếu biết tận dụng. Cơ hội nằm ở việc mở rộng tầm nhìn và thử sức với những điều mới mẻ. Tuy nhiên, thách thức có thể đến từ sự thiếu kiên nhẫn hoặc phân tán năng lượng. Hãy lập kế hoạch rõ ràng để đạt được mục tiêu. Năng lượng này khuyến khích sự sáng tạo và linh hoạt. Bạn nên tránh những quyết định vội vàng trong năm nay. Đây cũng là thời điểm tốt để kết nối với những người có cùng chí hướng. Cuối cùng, hãy tin vào trực giác của mình để vượt qua khó khăn.`
      }
    };
  }
});