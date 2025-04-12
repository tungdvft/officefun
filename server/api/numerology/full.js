import { defineEventHandler } from 'h3';
import { PersonalYearNumbers, NumerologyUtils } from '../utils/numerology-meanings';

// Tính số cá nhân cho chu kỳ vận số
function getPersonalYearCycles(birthdate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) {
    console.error('Invalid birthdate format:', birthdate);
    return {};
  }
  const [day, month] = birthdate.split('/').map(Number);
  const currentYear = new Date().getFullYear();
  const cycles = {};

  for (let i = 0; i < 10; i++) {
    const targetYear = currentYear + i;
    const sum = day + month + targetYear;
    const personalYearNumber = NumerologyUtils.reduceToSingleDigit(sum) || 1;
    cycles[targetYear] = personalYearNumber;
  }
  return cycles;
}

// Fallback response chỉ chứa cycles và focusAreas
function getFallbackResponse(personalYearCycles) {
  const cyclesData = Object.keys(personalYearCycles).length > 0 ? personalYearCycles : {
    2025: 1, 2026: 2, 2027: 3, 2028: 4, 2029: 5, 2030: 6, 2031: 7, 2032: 8, 2033: 9, 2034: 1
  };

  const numerology = {
    cycles: Object.keys(cyclesData).reduce((acc, year) => {
      const number = cyclesData[year];
      acc[year] = {
        number,
        description: `Năm ${year} với số cá nhân ${number} mang chủ đề "${PersonalYearNumbers[number].theme}". Đây là thời điểm để bạn ${PersonalYearNumbers[number].focus.join(', ')}.`,
        focus: PersonalYearNumbers[number].focus,
        keywords: PersonalYearNumbers[number].keywords
      };
      return acc;
    }, {}),
    focusAreas: Object.keys(cyclesData).map(year => ({
      year,
      focus: PersonalYearNumbers[cyclesData[year]].focus[0],
      keyword: PersonalYearNumbers[cyclesData[year]].keywords[0]
    }))
  };
  return { numerology };
}

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.'
    });
  }

  const personalYearCycles = getPersonalYearCycles(birthdate);

  try {
    const prompt = `
      Dựa trên thần số học với chu kỳ vận số (Personal Year Cycles): ${JSON.stringify(personalYearCycles)}
      - Thông tin cá nhân: sinh ngày ${birthdate}, tên "${name}", giới tính "${gender}"

      Trả về JSON hợp lệ với phần "numerology" chứa 1 trường:
      1. "cycles": object chứa chu kỳ 10 năm (từ ${new Date().getFullYear()}), mỗi năm có:
         - "number": số cá nhân (lấy từ chu kỳ đã cho),
         - "description": mô tả chi tiết (5-7 câu) dựa trên số cá nhân, ví dụ số 1 tập trung khởi đầu, sáng tạo; số 2 là hợp tác, cân bằng, v.v.
         - "focus": mảng 3 yếu tố chính của năm
         - "keywords": mảng 5 từ khóa liên quan

      Trả về chuỗi JSON thuần túy, không dùng Markdown!
    `;

    console.log('Sending prompt to Gemini:', prompt);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API lỗi: ${response.status}`);
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    console.log('Raw Gemini Response:', rawText);

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.numerology || !parsedData.numerology.cycles) {
        throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      }

      // Thêm focusAreas từ cycles
      parsedData.numerology.focusAreas = Object.keys(parsedData.numerology.cycles).map(year => ({
        year,
        focus: parsedData.numerology.cycles[year].focus[0],
        keyword: parsedData.numerology.cycles[year].keywords[0]
      }));

      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackResponse(personalYearCycles);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackResponse(personalYearCycles);
  }
});