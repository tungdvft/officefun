import { defineEventHandler, createError } from 'h3';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';
import dotenv from 'dotenv';
dotenv.config();

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

const apiKey = process.env.GEMINI_API_KEY ;

// Hàm gọi Gemini API
async function getGeminiCareerGuidance(birthdate, name, currentJob, numSuggestions = 3, previousJobs = []) {
  const startTime = Date.now();
  console.log('Starting getGeminiCareerGuidance at:', new Date().toISOString());
  console.log('Input data:', { birthdate, name, currentJob, numSuggestions, previousJobs });

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
    personalCycle
  });

  // Tạo danh sách nghề nghiệp đã đề xuất trước đó
  const previousJobsList = previousJobs.length > 0 ? previousJobs.join(', ') : 'không có';

  // Tạo prompt cho Gemini
  const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, sinh ngày ${birthdate}, tên ${name}, công việc hiện tại "${currentJob || 'chưa có'}", chu kỳ cá nhân ${personalCycle}. Trả về JSON hợp lệ với các trường:
    1. "careerGoals": Phân tích mục tiêu nghề nghiệp (2-3 câu).
    2. "passionAndMotivation": Phân tích đam mê và động lực (2-3 câu).
    3. "workStyle": Phân tích phong cách làm việc (2-3 câu).
    4. "longTermPath": Phân tích hướng đi sự nghiệp dài hạn (2-3 câu).
    5. "currentJobAnalysis": Đánh giá công việc hiện tại (3-4 câu nếu có, 1 câu nếu không).
    6. "careerSuggestions": Mảng CHÍNH XÁC ${numSuggestions} nghề nghiệp KHÁC với [${previousJobsList}] (mỗi nghề có: {"job": "...", "reason": "...", "opportunities": "...", "trends": "..."}).
    7. "practicalAdvice": Lời khuyên thực tế (2-3 câu).
    Trả về JSON thuần túy, không dùng Markdown, đảm bảo đúng ${numSuggestions} nghề không trùng lặp.`;

  console.log('Sending request to Gemini API...');

  // Gọi Gemini API
  let response;
  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
        timeout: 15000
      }
    );
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(`Lỗi khi gọi Gemini API: ${error.message}`);
  }

  console.log('Gemini API response status:', response.status);

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Gemini API error:', errorText);
    throw new Error(`Gemini API failed: ${response.status} - ${errorText}`);
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    console.error('JSON parse error:', error);
    throw new Error('Không thể phân tích phản hồi từ Gemini');
  }

  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!rawText) {
    console.error('Invalid Gemini response:', data);
    throw new Error('Phản hồi từ Gemini không hợp lệ');
  }

  let parsedData;
  try {
    parsedData = JSON.parse(rawText.replace(/```json|```/g, '').trim());
  } catch (error) {
    console.error('JSON parse error:', rawText);
    throw new Error('Dữ liệu JSON từ Gemini không hợp lệ');
  }

  if (!parsedData.careerSuggestions || parsedData.careerSuggestions.length !== numSuggestions) {
    console.error('Incorrect number of suggestions:', parsedData.careerSuggestions?.length || 0);
    throw new Error(`Yêu cầu ${numSuggestions} nghề, nhận được ${parsedData.careerSuggestions?.length || 0}`);
  }

  console.log('Parsed data:', parsedData);
  console.log('Processing time:', `${Date.now() - startTime}ms`);
  return parsedData;
}

// Xử lý request chính
export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  const username = event.node.req.headers['x-username'] || 'guest';
  console.log('Request from user:', username);

  const body = await readBody(event);
  const { name, birthdate, currentJob, numSuggestions = 3, previousJobs = [] } = body || {};
  console.log('Request body:', { name, birthdate, currentJob, numSuggestions, previousJobs });

  if (!name || !birthdate) {
    console.error('Missing name or birthdate');
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthdate là bắt buộc'
    });
  }

  if (numSuggestions > 12 || numSuggestions % 3 !== 0) {
    console.error('Invalid numSuggestions:', numSuggestions);
    throw createError({
      statusCode: 400,
      statusMessage: 'Số lượng nghề nghiệp phải là bội số của 3 và không vượt quá 12'
    });
  }

  try {
    const careerGuidance = await getGeminiCareerGuidance(birthdate, name, currentJob, numSuggestions, previousJobs);
    console.log('Response sent:', careerGuidance);
    console.log('Handler time:', `${Date.now() - startTime}ms`);
    return careerGuidance;
  } catch (error) {
    console.error('Handler error:', error.message);
    throw createError({
      statusCode: error.message.includes('Gemini API failed') ? 502 : 500,
      statusMessage: `Lỗi xử lý yêu cầu: ${error.message}`
    });
  }
});