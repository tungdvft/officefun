import { defineEventHandler } from 'h3';
import {
  LifePathNumbers,
  SoulUrgeNumbers,
  PersonalityNumbers,
  ExpressionNumbers,
  NumerologyUtils
} from '../utils/numerology-meanings';

function getLifePathNumber(birthdate) {
  const [day, month, year] = birthdate.split('/').map(Number);
  if (!day || !month || !year) return 9;
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 9;
}

function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi;
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

export default defineEventHandler(async (event) => {
  const { name, birthdate } = await readBody(event);

  if (!name || !birthdate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthdate là bắt buộc.'
    });
  }

  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);

  const apiKey = process.env.GEMINI_API_KEY;

  const prompt = `
    Dựa trên thần số học với các số sau:
    - Số chủ đạo (Life Path): ${dominantNumber}, chủ đề "${LifePathNumbers[dominantNumber].theme}", mục đích "${LifePathNumbers[dominantNumber].purpose}"
    - Số linh hồn (Soul Urge): ${soulNumber}, khát vọng "${SoulUrgeNumbers[soulNumber].desire}", động lực "${SoulUrgeNumbers[soulNumber].motivation}"
    - Số nhân cách (Personality): ${personalityNumber}, chủ đề "${PersonalityNumbers[personalityNumber].theme}"
    - Số định mệnh (Destiny): ${destinyNumber}, chủ đề "${ExpressionNumbers[destinyNumber].theme}"
    Trả về JSON hợp lệ với phần "numerology" chứa:
    - "lifePath": { "number": ${dominantNumber}, "symbol": "${LifePathNumbers[dominantNumber].symbol}", "description": mô tả chi tiết (8-10 câu), "strengths": mảng 3-5 điểm mạnh, "challenges": mảng 3-5 thử thách, "careers": mảng 3-5 nghề nghiệp, "advice": lời khuyên (3-5 câu) }
    - "soul": ${soulNumber}, "soulDesc": mô tả ngắn gọn (1-2 câu)
    - "personality": ${personalityNumber}, "personalityDesc": mô tả ngắn gọn (1-2 câu)
    - "destiny": ${destinyNumber}, "destinyDesc": mô tả ngắn gọn (1-2 câu)
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
    return JSON.parse(rawText);
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return {
      numerology: {
        lifePath: {
          number: dominantNumber,
          symbol: LifePathNumbers[dominantNumber].symbol,
          description: LifePathNumbers[dominantNumber].description || `Với số chủ đạo ${dominantNumber}, bạn mang năng lượng của ${LifePathNumbers[dominantNumber].theme}. Đây là hành trình tìm kiếm sự cân bằng và phát triển bản thân qua ${LifePathNumbers[dominantNumber].purpose}.`,
          strengths: LifePathNumbers[dominantNumber].strengths,
          challenges: LifePathNumbers[dominantNumber].challenges,
          careers: LifePathNumbers[dominantNumber].careers,
          advice: LifePathNumbers[dominantNumber].advice
        },
        soul: soulNumber,
        soulDesc: `Số linh hồn ${soulNumber} thể hiện khát vọng ${SoulUrgeNumbers[soulNumber].desire}, thúc đẩy bạn ${SoulUrgeNumbers[soulNumber].motivation}.`,
        personality: personalityNumber,
        personalityDesc: `Số nhân cách ${personalityNumber} cho thấy bạn là "${PersonalityNumbers[personalityNumber].theme}", với ${PersonalityNumbers[personalityNumber].strengths[0]}.`,
        destiny: destinyNumber,
        destinyDesc: `Số định mệnh ${destinyNumber} định hình bạn thành "${ExpressionNumbers[destinyNumber].theme}", hướng tới ${ExpressionNumbers[destinyNumber].tip}.`
      }
    };
  }
});