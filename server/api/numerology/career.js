import { defineEventHandler, createError } from 'h3';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';
import dotenv from 'dotenv';
dotenv.config(); // Tải biến môi trường từ .env
// Hàm tính số chủ đạo (Life Path Number)
function getLifePathNumber(birthdate) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthdate)) {
    console.warn('Invalid birthdate format:', birthdate);
    throw new Error('Định dạng ngày sinh không hợp lệ, cần là DD/MM/YYYY hoặc DD-MM-YYYY');
  }
  const normalizedBirthdate = birthdate.replace(/-/g, '/');
  const [day, month, year] = normalizedBirthdate.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) {
    console.warn('Invalid birthdate values:', { day, month, year });
    throw new Error('Ngày sinh không hợp lệ');
  }
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

// Hàm tính số linh hồn (Soul Urge Number)
function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Hàm tính số nhân cách (Personality Number)
function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi;
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Hàm tính số định mệnh (Destiny Number)
function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}
console.log('Loaded GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '[HIDDEN]' : 'Not found');
// Lấy API Key từ biến môi trường
const apiKey = process.env.GEMINI_API_KEY;

// Hàm gọi Gemini API
async function getGeminiCareerGuidance(birthdate, name, currentJob) {
  const startTime = Date.now();
  console.log('Starting getGeminiCareerGuidance at:', new Date().toISOString());
  console.log('API Key status:', apiKey ? '[HIDDEN]' : 'No API Key provided');
  console.log('Input data:', { birthdate, name, currentJob });

  if (!apiKey) {
    throw new Error('Thiếu GEMINI_API_KEY trong cấu hình server');
  }

  // Tính toán các số Thần số học
  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const currentYear = new Date().getFullYear();
  const personalCycle = NumerologyUtils.reduceToSingleDigit(currentYear + parseInt(birthdate.split(/[\/-]/)[0])) || 9;

  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[dominantNumber] || NUMEROLOGY_MEANINGS.lifePath[1];
  const soulData = NUMEROLOGY_MEANINGS.soulUrge[soulNumber] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const personalityData = NUMEROLOGY_MEANINGS.personality[personalityNumber] || NUMEROLOGY_MEANINGS.personality[1];
  const destinyData = NUMEROLOGY_MEANINGS.expression[destinyNumber] || NUMEROLOGY_MEANINGS.expression[1];

  console.log('Numerology data calculated:', {
    dominantNumber,
    soulNumber,
    personalityNumber,
    destinyNumber,
    personalCycle,
    lifePathTheme: lifePathData.theme,
    soulDesire: soulData.desire,
    personalityTheme: personalityData.theme,
    destinyTheme: destinyData.theme
  });

  // Tạo prompt cho Gemini
  const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber} (${lifePathData.theme}), số linh hồn ${soulNumber} (${soulData.desire}), số nhân cách ${personalityNumber} (${personalityData.theme}), số định mệnh ${destinyNumber} (${destinyData.theme}), sinh ngày ${birthdate}, tên ${name}, công việc hiện tại "${currentJob || 'chưa có'}", chu kỳ cá nhân ${personalCycle}. Trả về JSON hợp lệ với các trường sau:
    1. "careerGoals": Phân tích cách số chủ đạo ${dominantNumber} (${lifePathData.theme}) định hình mục tiêu nghề nghiệp, dựa trên ${lifePathData.strengths.join(', ')} (2-3 câu).
    2. "passionAndMotivation": Phân tích số linh hồn ${soulNumber} (${soulData.desire}) thể hiện đam mê và động lực bên trong, dựa trên ${soulData.motivation} và ${soulData.fulfillment} (2-3 câu).
    3. "workStyle": Phân tích số nhân cách ${personalityNumber} (${personalityData.theme}) ảnh hưởng đến phong cách làm việc, dựa trên ${personalityData.strengths.join(', ')} và ${personalityData.workStyle} (2-3 câu).
    4. "longTermPath": Phân tích số định mệnh ${destinyNumber} (${destinyData.theme}) chỉ ra hướng đi sự nghiệp lâu dài, dựa trên ${destinyData.talents.join(', ')} (2-3 câu).
    5. "currentJobAnalysis": Nếu có công việc hiện tại "${currentJob || 'chưa có'}", đánh giá mức độ phù hợp với ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme}, cơ hội phát triển, gợi ý cải thiện hoặc chuyển hướng (3-4 câu); nếu không có, ghi "Hiện tại bạn chưa nhập công việc, định hướng sẽ dựa trên các số Thần số học" (1 câu).
    6. "careerSuggestions": Mảng 3 nghề nghiệp cụ thể từ ${lifePathData.careers.join(', ')} và ${destinyData.careers.join(', ')} (ví dụ: {"job": "lập trình viên", "reason": "...", "opportunities": "...", "trends": "..."}), mỗi nghề phân tích chi tiết: lý do phù hợp với ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme}, cơ hội hiện tại, xu hướng phát triển trong tương lai (bối cảnh 2025).
    7. "practicalAdvice": Lời khuyên thực tế (2-3 câu) dựa trên chu kỳ cá nhân ${personalCycle} (${NUMEROLOGY_MEANINGS.personalYear[personalCycle].theme}) và ${NUMEROLOGY_MEANINGS.personalYear[personalCycle].advice}, kết hợp công việc hiện tại (nếu có), dùng "bạn" thay vì nhắc tên/ngày sinh.
    Đảm bảo câu trả lời tập trung vào định hướng nghề nghiệp, sử dụng ngôn ngữ tự nhiên, dễ hiểu, không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  console.log('Sending request to Gemini API...');

  // Gọi Gemini API
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      timeout: 10000 // Timeout 10 giây
    }
  );

  console.log('Gemini API response status:', response.status, response.statusText);
  console.log('Gemini call took:', `${Date.now() - startTime}ms`);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error details:', errorText);
    throw new Error(`Gemini API failed: ${response.status} - ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  const rawText = data.candidates[0].content.parts[0].text;
  console.log('Raw response from Gemini:', rawText);

  const parsedData = JSON.parse(rawText.replace(/```json|```/g, '').trim());
  if (!parsedData || !parsedData.careerGoals || !parsedData.careerSuggestions) {
    console.error('Invalid Gemini response structure:', parsedData);
    throw new Error('Dữ liệu từ Gemini không đầy đủ hoặc không đúng định dạng');
  }

  console.log('Parsed data from Gemini:', parsedData);
  console.log('Total processing time:', `${Date.now() - startTime}ms`);
  return parsedData;
}

// Xử lý request chính
export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const username = event.node.req.headers['x-username'] || 'guest';
  console.log('Request received from user:', username);

  const body = await readBody(event);
  const { name, birthdate, currentJob } = body || {};
  console.log('Request body:', { name, birthdate, currentJob });

  if (!name || !birthdate) {
    console.error('Validation failed: Missing name or birthdate', { name, birthdate });
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthdate là bắt buộc'
    });
  }

  try {
    const careerGuidance = await getGeminiCareerGuidance(birthdate, name, currentJob);
    console.log('Final response being sent:', careerGuidance);
    console.log('Total handler time:', `${Date.now() - startTime}ms`);
    return careerGuidance;
  } catch (error) {
    console.error('Handler error:', {
      message: error.message,
      stack: error.stack,
      timeElapsed: `${Date.now() - startTime}ms`
    });
    throw createError({
      statusCode: error.message.includes('Gemini API failed') ? 502 : 500,
      statusMessage: `Lỗi xử lý yêu cầu: ${error.message}`
    });
  }
});