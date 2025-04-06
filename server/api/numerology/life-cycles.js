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

  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

  const prompt = `
    Dựa trên thần số học với các số sau:
    - Số chủ đạo (Life Path): ${dominantNumber}, chủ đề "${LifePathNumbers[dominantNumber].theme}", mục đích "${LifePathNumbers[dominantNumber].purpose}"
    - Số linh hồn (Soul Urge): ${soulNumber}, khát vọng "${SoulUrgeNumbers[soulNumber].desire}", động lực "${SoulUrgeNumbers[soulNumber].motivation}"
    - Số nhân cách (Personality): ${personalityNumber}, chủ đề "${PersonalityNumbers[personalityNumber].theme}"
    - Số định mệnh (Destiny): ${destinyNumber}, chủ đề "${ExpressionNumbers[destinyNumber].theme}"
    Trả về JSON hợp lệ với phần "numerology" chứa:
    - "age0_10": diễn giải chi tiết (10-15 câu) về 0-10 tuổi dựa trên số linh hồn ${soulNumber}
    - "age10_20": diễn giải chi tiết (10-15 câu) về 10-20 tuổi dựa trên số linh hồn ${soulNumber} và số chủ đạo ${dominantNumber}
    - "age20_30": diễn giải chi tiết (10-15 câu) về 20-30 tuổi dựa trên số linh hồn ${soulNumber}, số chủ đạo ${dominantNumber}, số nhân cách ${personalityNumber}
    - "age30_40": diễn giải chi tiết (10-15 câu) về 30-40 tuổi dựa trên số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}
    - "age40_50": diễn giải chi tiết (10-15 câu) về 40-50 tuổi dựa trên số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}
    - "age50_60": diễn giải chi tiết (10-15 câu) về 50-60 tuổi dựa trên số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, số chủ đạo ${dominantNumber}
    - "age60_plus": diễn giải chi tiết (10-15 câu) về 60+ tuổi dựa trên tất cả số ${dominantNumber}, ${soulNumber}, ${personalityNumber}, ${destinyNumber}
    - "age0_10Advice": lời khuyên (3-5 câu) cho 0-10 tuổi
    - "age10_20Advice": lời khuyên (3-5 câu) cho 10-20 tuổi
    - "age20_30Advice": lời khuyên (3-5 câu) cho 20-30 tuổi
    - "age30_40Advice": lời khuyên (3-5 câu) cho 30-40 tuổi
    - "age40_50Advice": lời khuyên (3-5 câu) cho 40-50 tuổi
    - "age50_60Advice": lời khuyên (3-5 câu) cho 50-60 tuổi
    - "age60_plusAdvice": lời khuyên (3-5 câu) cho 60+ tuổi
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
        age0_10: `Từ 0-10 tuổi, với số linh hồn ${soulNumber}, bạn bắt đầu cảm nhận thế giới qua ${SoulUrgeNumbers[soulNumber].motivation}. Đây là giai đoạn hình thành tính cách với sự tò mò và nhạy cảm bẩm sinh.`,
        age10_20: `Từ 10-20 tuổi, với số linh hồn ${soulNumber} và số chủ đạo ${dominantNumber}, bạn khám phá bản thân mạnh mẽ hơn.`,
        age20_30: `Từ 20-30 tuổi, với số linh hồn ${soulNumber}, số chủ đạo ${dominantNumber} và số nhân cách ${personalityNumber}, bạn định hình sự nghiệp.`,
        age30_40: `Từ 30-40 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn khẳng định bản thân.`,
        age40_50: `Từ 40-50 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn củng cố thành tựu.`,
        age50_60: `Từ 50-60 tuổi, với số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber} và số chủ đạo ${dominantNumber}, bạn tổng hợp kinh nghiệm.`,
        age60_plus: `Từ 60+ tuổi, với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn tổng kết cuộc đời.`,
        age0_10Advice: ['Khuyến khích sự tò mò', 'Tạo môi trường an toàn'],
        age10_20Advice: ['Tập trung học tập', 'Khuyến khích giao tiếp'],
        age20_30Advice: ['Đặt mục tiêu sự nghiệp', 'Tận dụng sáng tạo'],
        age30_40Advice: ['Xây dựng sự nghiệp', 'Tận dụng kinh nghiệm'],
        age40_50Advice: ['Duy trì thành tựu', 'Chăm sóc sức khỏe'],
        age50_60Advice: ['Chia sẻ kinh nghiệm', 'Tập trung sức khỏe'],
        age60_plusAdvice: ['Chia sẻ bài học', 'Duy trì kết nối']
      }
    };
  }
});