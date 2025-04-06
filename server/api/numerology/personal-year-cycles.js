import { defineEventHandler } from 'h3';
import { PersonalYearNumbers, NumerologyUtils } from '../utils/numerology-meanings';

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

export default defineEventHandler(async (event) => {
  const { birthdate } = await readBody(event);

  if (!birthdate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: birthdate là bắt buộc.'
    });
  }

  const personalYearCycles = getPersonalYearCycles(birthdate);
  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

  const prompt = `
    Dựa trên chu kỳ vận số (Personal Year Cycles): ${JSON.stringify(personalYearCycles)}, mỗi năm có số cá nhân tương ứng (từ 1-9 hoặc 11, 22), dựa trên Personal Year Numbers (ví dụ: số 1 - chủ đề "${PersonalYearNumbers[1].theme}", tập trung "${PersonalYearNumbers[1].focus.join(', ')}", từ khóa "${PersonalYearNumbers[1].keywords.join(', ')}"; số 2 - chủ đề "${PersonalYearNumbers[2].theme}", v.v.)
    Trả về JSON hợp lệ với phần "numerology" chứa:
    - "cycles": object chứa chu kỳ 10 năm (từ ${new Date().getFullYear()}), mỗi năm có: "number": số cá nhân, "description": mô tả (5-7 câu) dựa trên số cá nhân đó (tham khảo PersonalYearNumbers), "focus": mảng 3 yếu tố, "keywords": mảng 5 từ khóa. Đảm bảo trường này không rỗng!
    Trả về chuỗi JSON thuần túy, không dùng Markdown!
  `;

  try {
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
    const rawText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(rawText);
    if (!parsedData.numerology.cycles || Object.keys(parsedData.numerology.cycles).length === 0) {
      throw new Error('Gemini returned empty cycles');
    }
    return parsedData;
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return {
      numerology: {
        cycles: Object.keys(personalYearCycles).reduce((acc, year) => {
          const number = personalYearCycles[year];
          acc[year] = {
            number,
            description: `Năm ${year} với số cá nhân ${number} mang chủ đề "${PersonalYearNumbers[number].theme}". Đây là thời điểm để bạn ${PersonalYearNumbers[number].focus.join(', ')}.`,
            focus: PersonalYearNumbers[number].focus,
            keywords: PersonalYearNumbers[number].keywords
          };
          return acc;
        }, {})
      }
    };
  }
});