import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';
import dotenv from 'dotenv';
dotenv.config(); // Tải biến môi trường từ .env
// Tính số đường đời
function calculateLifePathNumber(birthDate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn(`Invalid birthDate format: ${birthDate}, defaulting to 1`);
    return 1;
  }
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
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    console.warn(`Invalid birthDate format: ${birthDate}, defaulting to 1`);
    return 1;
  }
  return NumerologyUtils.calculatePersonalYear(birthDate, year) || 1;
}

// Hàm nối mảng thành chuỗi
function joinSentences(sentences) {
  return Array.isArray(sentences) ? sentences.join(' ') : sentences || '';
}

// Hàm fallback
function getFallbackResponse(name, birthDate, numbers) {
  try {
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
        goal: `"${name}" với Số Đường đời ${numbers.lifePath} mang năng lượng ${lifePathData.theme.toLowerCase()}. Mục tiêu lớn của bạn là ${lifePathData.purpose.toLowerCase()}. Hãy tận dụng ${(lifePathData.strengths || [])[0]?.toLowerCase() || 'không xác định'} để tiến tới thành công.`,
        strengths: `"${name}" sở hữu Số Tên ${numbers.expression}, thể hiện ${expressionData.theme.toLowerCase()}. Bạn nổi bật với ${(expressionData.strengths || [])[0]?.toLowerCase() || 'không xác định'} và ${(expressionData.strengths || [])[1]?.toLowerCase() || 'không xác định'}.`,
        notes: `"${name}" có Số Linh hồn ${numbers.soulUrge}, phản ánh ${soulUrgeData.theme.toLowerCase()}. Bạn cần chú ý tránh ${(soulUrgeData.challenges || [])[0]?.toLowerCase() || 'không xác định'} để duy trì sự cân bằng.`,
        strategy: `"${name}" trong năm 2025 với Số Cá nhân ${numbers.personalYear} cần tập trung vào ${personalYearData.theme.toLowerCase()}. Hãy ${(personalYearData.focus || [])[0]?.toLowerCase() || 'không xác định'} để tận dụng cơ hội trong năm nay.`,
        milestones: {
          shortTerm: `Dựa trên Số Linh hồn ${numbers.soulUrge}, bạn nên nuôi dưỡng ${(soulUrgeData.desires || [])[0]?.toLowerCase() || 'không xác định'}. Điều này giúp bạn tiến gần hơn đến mong muốn của mình.`,
          mediumTerm: `Với Số Tên ${numbers.expression}, bạn có thể phát huy ${(expressionData.strengths || [])[0]?.toLowerCase() || 'không xác định'} để đạt bước tiến trong vài năm tới.`,
          longTerm: `Số Đường đời ${numbers.lifePath} hướng bạn đến ${lifePathData.purpose.toLowerCase()}. Tập trung vào ${(lifePathData.strengths || [])[0]?.toLowerCase() || 'không xác định'} để thành công lâu dài.`,
          currentYear: `Năm 2025 với Số Cá nhân ${numbers.personalYear}, bạn nên ${(personalYearData.focus || [])[0]?.toLowerCase() || 'không xác định'} để xây dựng nền tảng vững chắc.`
        }
      }
    };
  } catch (error) {
    console.error('Fallback error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Không thể tạo dữ liệu dự phòng'
    });
  }
}

// API handler chính
export default defineEventHandler(async (event) => {
  let body;
  try {
    body = await readBody(event);
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body'
    });
  }

  const { name, birthDate } = body;

  if (!name || !birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
    });
  }

  // Tính các con số thần số học
  const numbers = {
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name),
    personalYear: calculatePersonalYearNumber(birthDate, 2025)
  };

  console.log('Calculated numbers:', numbers);

  // Lấy dữ liệu từ NUMEROLOGY_MEANINGS
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const expressionData = NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1];
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const personalYearData = NUMEROLOGY_MEANINGS.personalYear[numbers.personalYear] || NUMEROLOGY_MEANINGS.personalYear[1];

  // Prompt yêu cầu trả về chuỗi
  const prompt = `Dựa trên thần số học, tạo bản đồ thành công cho "${name}" với:
    - Số Đường đời: ${numbers.lifePath} (${lifePathData.theme})
    - Số Tên: ${numbers.expression} (${expressionData.theme})
    - Số Linh hồn: ${numbers.soulUrge} (${soulUrgeData.theme})
    - Số Cá nhân 2025: ${numbers.personalYear} (${personalYearData.theme})
    Trả về JSON với các trường là chuỗi (nối các câu bằng dấu cách):
    - "lifePathNumber", "expressionNumber", "soulUrgeNumber", "personalYearNumber" (số)
    - "goal" (3 câu về Số Đường đời)
    - "strengths" (2 câu, chỉ dựa trên Số Tên)
    - "notes" (2 câu về Số Linh hồn)
    - "strategy" (3 câu về Số Cá nhân 2025)
    - "milestones": {
      "shortTerm" (2 câu về Số Linh hồn),
      "mediumTerm" (2 câu về Số Tên),
      "longTerm" (2 câu về Số Đường đời),
      "currentYear" (2 câu về Số Cá nhân 2025)
    }
    Giọng điệu tự nhiên, dùng "bạn", chỉ nhắc "${name}" ở câu đầu mỗi phần "goal", "strengths", "notes", "strategy".`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      console.warn('Gemini API request timed out after 8000ms');
    }, 8000);

    console.log('Sending prompt to Gemini:', prompt);
    const rawData = await callGeminiApi(prompt, { signal: controller.signal });
    clearTimeout(timeoutId);

    console.log('Raw Gemini response:', rawData);

    let data;
    if (typeof rawData === 'string') {
      try {
        data = JSON.parse(rawData);
      } catch (parseError) {
        console.error('Failed to parse Gemini response:', parseError.message, 'Raw:', rawData);
        const jsonMatch = rawData.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          data = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('Gemini response không phải JSON hợp lệ');
        }
      }
    } else if (typeof rawData === 'object' && rawData !== null) {
      data = rawData;
    } else {
      throw new Error('Gemini response không hợp lệ: ' + typeof rawData);
    }

    // Chuẩn hóa dữ liệu thành chuỗi
    const successMap = {
      lifePathNumber: data.lifePathNumber,
      expressionNumber: data.expressionNumber,
      soulUrgeNumber: data.soulUrgeNumber,
      personalYearNumber: data.personalYearNumber,
      goal: joinSentences(data.goal),
      strengths: joinSentences(data.strengths),
      notes: joinSentences(data.notes),
      strategy: joinSentences(data.strategy),
      milestones: {
        shortTerm: joinSentences(data.milestones.shortTerm),
        mediumTerm: joinSentences(data.milestones.mediumTerm),
        longTerm: joinSentences(data.milestones.longTerm),
        currentYear: joinSentences(data.milestones.currentYear)
      }
    };

    if (!successMap.lifePathNumber || !successMap.milestones.shortTerm) {
      console.warn('Gemini response thiếu dữ liệu, switching to fallback');
      return getFallbackResponse(name, birthDate, numbers);
    }

    console.log('Final successMap:', successMap);
    return { successMap };
  } catch (error) {
    console.error('Error calling Gemini API:', error.message, error.stack);
    if (error.name === 'AbortError') {
      console.log('Request aborted due to timeout, using fallback');
    }
    return getFallbackResponse(name, birthDate, numbers);
  }
});