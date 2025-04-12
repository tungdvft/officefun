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

// Tạo mô tả tĩnh cho fallback
function generateCycleDetails(number, year) {
  const themes = {
    1: `Năm ${year} với số 1 mang năng lượng khởi đầu. Đây là thời điểm bắt đầu dự án mới và tự tin tiến lên.`,
    2: `Năm ${year} với số 2 tập trung vào hợp tác. Hãy xây dựng mối quan hệ và tìm sự cân bằng.`,
    3: `Năm ${year} với số 3 tràn đầy sáng tạo. Hãy thể hiện bản thân và tận hưởng niềm vui.`,
    4: `Năm ${year} với số 4 là xây dựng nền tảng. Làm việc chăm chỉ để đạt sự ổn định.`,
    5: `Năm ${year} với số 5 mang đến thay đổi. Khám phá cơ hội mới và sống năng động.`,
    6: `Năm ${year} với số 6 nhấn mạnh gia đình. Chăm sóc người thân và tạo sự hài hòa.`,
    7: `Năm ${year} với số 7 khuyến khích nội tâm. Suy ngẫm và học hỏi sẽ mang lại giá trị.`,
    8: `Năm ${year} với số 8 là năm thành công. Tận dụng tham vọng để đạt mục tiêu lớn.`,
    9: `Năm ${year} với số 9 đánh dấu hoàn thiện. Chia sẻ kinh nghiệm và chuẩn bị khởi đầu mới.`
  };
  return {
    number,
    description: themes[number] || `Năm ${year} với số cá nhân ${number}.`
  };
}

// Fallback response
function getFallbackResponse(personalYearCycles) {
  const cyclesData = Object.keys(personalYearCycles).length > 0 ? personalYearCycles : {
    2025: 1, 2026: 2, 2027: 3, 2028: 4, 2029: 5, 2030: 6, 2031: 7, 2032: 8, 2033: 9, 2034: 1
  };

  const numerology = {
    cycles: Object.keys(cyclesData).reduce((acc, year) => {
      acc[year] = generateCycleDetails(cyclesData[year], year);
      return acc;
    }, {})
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
      Dựa trên chu kỳ vận số: ${JSON.stringify(personalYearCycles)}
      Trả về JSON hợp lệ với phần "numerology" chứa 1 trường:
      1. "cycles": object chứa chu kỳ 10 năm (từ ${new Date().getFullYear()}), mỗi năm có:
         - "number": số cá nhân (lấy từ chu kỳ đã cho)
         - "description": mô tả ngắn (4-5 câu) dựa trên số cá nhân, ví dụ số 1 là khởi đầu, số 2 là hợp tác, v.v.
      Trả về chuỗi JSON thuần túy, không dùng Markdown!
    `;

    console.log('Sending prompt to Gemini:', prompt);

    // Timeout 5 giây vì prompt rất nhẹ
    // const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), 5000);

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

    // clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Gemini API lỗi: ${response.status}`);
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    console.log('Raw Gemini Response:', rawText);

    rawText = rawText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(rawText);

    if (!parsedData || !parsedData.numerology || !parsedData.numerology.cycles) {
      throw new Error('Gemini API không trả về đầy đủ dữ liệu');
    }

    return parsedData;
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackResponse(personalYearCycles);
  }
});