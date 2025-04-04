import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Tính số đường đời
function calculateLifePathNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  const digits = birthDate.split('/').join('').split('').map(Number);
  return NumerologyUtils.reduceToSingleDigit(digits.reduce((a, b) => a + b, 0)) || 1;
}

// Tính số tên (Expression Number)
function calculateExpressionNumber(name) {
  const pythagorean = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName.split('').reduce((acc, char) => acc + (pythagorean[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Tính số linh hồn (Soul Urge Number)
function calculateSoulUrgeNumber(name) {
  const vowels = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const cleanName = name.toLowerCase().replace(/[^a-z]/g, '');
  const sum = cleanName.split('').reduce((acc, char) => acc + (vowels[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Tính số năm cá nhân
function calculatePersonalYearNumber(birthDate, year = 2025) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  return NumerologyUtils.calculatePersonalYear(birthDate, year) || 1;
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

  // Lấy dữ liệu từ numerology-meanings.js với fallback
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const expressionData = NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1];
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const personalYearData = NUMEROLOGY_MEANINGS.personalYear[numbers.personalYear] || NUMEROLOGY_MEANINGS.personalYear[1];

  // Kiểm tra và log dữ liệu
  console.log('NUMEROLOGY_MEANINGS data:', {
    lifePath: lifePathData,
    expression: expressionData,
    soulUrge: soulUrgeData,
    personalYear: personalYearData
  });

  const prompt = `Dựa trên thần số học, tạo bản đồ thành công cho "${name}" với ngày sinh ${birthDate} và các con số:
    - Số Đường đời: ${numbers.lifePath} (${lifePathData.theme}, Tập trung: ${(lifePathData.strengths || []).join(', ') || 'Không xác định'})
    - Số Tên: ${numbers.expression} (${expressionData.theme}, Điểm mạnh: ${(expressionData.strengths || []).join(', ') || 'Không xác định'})
    - Số Linh hồn: ${numbers.soulUrge} (${soulUrgeData.theme}, Mong muốn: ${(soulUrgeData.desires || []).join(', ') || 'Không xác định'})
    - Số Cá nhân năm 2025: ${numbers.personalYear} (${personalYearData.theme}, Chủ đề: ${(personalYearData.focus || []).join(', ') || 'Không xác định'})
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
    Giọng điệu tự nhiên, khách quan, dùng "bạn" trong diễn giải, chỉ nhắc tên "${name}" ở câu đầu mỗi phần "goal", "strengths", "notes", "strategy". Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    console.log('Sending prompt to Gemini:', prompt);
    const rawData = await callGeminiApi(prompt);
    console.log('Raw Gemini Response:', rawData);

    let data;
    if (typeof rawData === 'string') {
      try {
        data = JSON.parse(rawData);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError.message);
        const jsonMatch = rawData.match(/\{[\s\S]*\}/);
        if (jsonMatch) data = JSON.parse(jsonMatch[0]);
        else throw new Error('Gemini API không trả về JSON hợp lệ');
      }
    } else if (typeof rawData === 'object' && rawData !== null) {
      data = rawData;
    } else {
      throw new Error('Gemini API không trả về JSON hợp lệ');
    }

    if (!data.lifePathNumber || !data.milestones) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return { successMap: data };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackResponse(name, birthDate, numbers);
  }
});

function getFallbackResponse(name, birthDate, numbers) {
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const expressionData = NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1];
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const personalYearData = NUMEROLOGY_MEANINGS.personalYear[numbers.personalYear] || NUMEROLOGY_MEANINGS.personalYear[1];

  return {
    successMap: {
      lifePathNumber: numbers.lifePath,
      expressionNumber: numbers.expression,
      soulUrgeNumber: numbers.soulUrge,
      personalYearNumber: numbers.personalYear,
      goal: `"${name}" với Số Đường đời ${numbers.lifePath} mang năng lượng ${lifePathData.theme.toLowerCase()}. Mục tiêu lớn của bạn là ${lifePathData.purpose.toLowerCase()}. Đây là hành trình phát triển bản thân qua ${(lifePathData.strengths || [])[0]?.toLowerCase() || 'không xác định'} và sự kiên trì. Hãy tận dụng ${(lifePathData.strengths || [])[1]?.toLowerCase() || 'không xác định'} để đạt được điều bạn hướng tới.`,
      strengths: `"${name}" sở hữu Số Tên ${numbers.expression}, thể hiện ${expressionData.theme.toLowerCase()}. Bạn nổi bật với ${(expressionData.strengths || [])[0]?.toLowerCase() || 'không xác định'} và khả năng ${(expressionData.strengths || [])[1]?.toLowerCase() || 'không xác định'}. Đây là nền tảng để bạn tạo dấu ấn trong công việc và cuộc sống. Hãy phát huy chúng một cách tự nhiên.`,
      notes: `"${name}" có Số Linh hồn ${numbers.soulUrge}, phản ánh khát vọng ${soulUrgeData.theme.toLowerCase()}. Bạn cần lưu ý tránh ${(soulUrgeData.challenges || [])[0]?.toLowerCase() || 'không xác định'} quá mức, vì điều này có thể làm bạn mất cân bằng. Hãy tìm cách nuôi dưỡng ${(soulUrgeData.desires || [])[0]?.toLowerCase() || 'không xác định'} để giữ tinh thần thoải mái.`,
      strategy: `"${name}" trong năm 2025 với Số Cá nhân ${numbers.personalYear} cần tập trung vào ${personalYearData.theme.toLowerCase()}. Đây là thời điểm để bạn ${(personalYearData.focus || [])[0]?.toLowerCase() || 'không xác định'} và phát triển ${(personalYearData.focus || [])[1]?.toLowerCase() || 'không xác định'}. Hãy tận dụng năng lượng này để xây dựng nền tảng vững chắc. Kiên nhẫn và hành động đúng lúc sẽ giúp bạn đạt được thành công.`,
      milestones: {
        shortTerm: `Dựa trên Số Linh hồn ${numbers.soulUrge}, bạn nên bắt đầu bằng cách nuôi dưỡng ${(soulUrgeData.desires || [])[0]?.toLowerCase() || 'không xác định'}. Hãy thử thay đổi nhỏ trong cuộc sống hàng ngày để cảm nhận sự khác biệt. Điều này giúp bạn tiến gần hơn đến mong muốn sâu thẳm của mình.`,
        mediumTerm: `Với Số Tên ${numbers.expression}, bạn có thể phát huy ${(expressionData.strengths || [])[0]?.toLowerCase() || 'không xác định'} để đạt được bước tiến. Tập trung vào một dự án nhỏ sử dụng ${(expressionData.strengths || [])[1]?.toLowerCase() || 'không xác định'} của mình. Đây là nền tảng cho những thành công lớn hơn sau này.`,
        longTerm: `Số Đường đời ${numbers.lifePath} hướng bạn đến ${lifePathData.purpose.toLowerCase()}. Hãy đặt mục tiêu dài hạn liên quan đến ${(lifePathData.strengths || [])[0]?.toLowerCase() || 'không xác định'} để khẳng định giá trị bản thân. Đây là cột mốc quan trọng trong hành trình của bạn.`,
        currentYear: `Năm 2025 với Số Cá nhân ${numbers.personalYear}, bạn cần ${(personalYearData.focus || [])[0]?.toLowerCase() || 'không xác định'} để đạt được kết quả rõ ràng. Tập trung vào ${(personalYearData.focus || [])[1]?.toLowerCase() || 'không xác định'} sẽ tạo đà cho tương lai. Đây là thời điểm quan trọng để bạn hành động và tổ chức lại mọi thứ.`
      }
    }
  };
}