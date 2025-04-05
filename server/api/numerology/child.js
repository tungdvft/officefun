import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getLifePathNumber(birthDate) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthDate)) throw createError({ statusCode: 400, statusMessage: 'Ngày sinh không hợp lệ.' });
  const [day, month, year] = birthDate.replace(/-/g, '/').split('/').map(Number);
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

function getSoulUrgeNumber(name) {
  const vowels = 'aeiouáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ';
  const valueMap = { a: 1, e: 5, i: 9, o: 6, u: 3, á: 1, à: 1, ả: 1, ã: 1, ạ: 1, é: 5, è: 5, ẻ: 5, ẽ: 5, ẹ: 5, í: 9, ì: 9, ỉ: 9, ĩ: 9, ị: 9, ó: 6, ò: 6, ỏ: 6, õ: 6, ọ: 6, ú: 3, ù: 3, ủ: 3, ũ: 3, ụ: 3, ý: 7, ỳ: 7, ỷ: 7, ỹ: 7, ỵ: 7 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => vowels.includes(char) ? acc + (valueMap[char] || 0) : acc, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 9;
}

function getPersonalityNumber(name) {
  const vowels = 'aeiouáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ';
  const valueMap = { b: 2, c: 3, d: 4, đ: 4, g: 7, h: 8, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, x: 6 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => !vowels.includes(char) && /[a-zđ]/.test(char) ? acc + (valueMap[char] || 0) : acc, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 9;
}

function getDestinyNumber(name) {
  const valueMap = { a: 1, b: 2, c: 3, d: 4, e: 5, g: 7, h: 8, i: 9, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, x: 6, y: 7, đ: 4, á: 1, à: 1, ả: 1, ã: 1, ạ: 1, é: 5, è: 5, ẻ: 5, ẽ: 5, ẹ: 5, í: 9, ì: 9, ỉ: 9, ĩ: 9, ị: 9, ó: 6, ò: 6, ỏ: 6, õ: 6, ọ: 6, ú: 3, ù: 3, ủ: 3, ũ: 3, ụ: 3, ý: 7, ỳ: 7, ỷ: 7, ỹ: 7, ỵ: 7 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (valueMap[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 9;
}

function getPersonalYear(birthDate, year) {
  const [day, month] = birthDate.replace(/-/g, '/').split('/').map(Number);
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

export default defineEventHandler(async (event) => {
  const { childName, birthDate } = await readBody(event);
  if (!childName || !birthDate) throw createError({ statusCode: 400, statusMessage: 'Thiếu thông tin.' });

  const lifePath = getLifePathNumber(birthDate);
  const soulUrge = getSoulUrgeNumber(childName);
  const personality = getPersonalityNumber(childName);
  const destiny = getDestinyNumber(childName);
  const currentYear = new Date().getFullYear();
  const personalYear = getPersonalYear(birthDate, currentYear);

  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const soulUrgeData = NUMEROLOGY_MEANINGS.soulUrge[soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const personalityData = NUMEROLOGY_MEANINGS.personality[personality] || NUMEROLOGY_MEANINGS.personality[1];
  const destinyData = NUMEROLOGY_MEANINGS.expression[destiny] || NUMEROLOGY_MEANINGS.expression[1]; // Dùng expression cho Destiny
  const personalYearData = NUMEROLOGY_MEANINGS.personalYear[personalYear] || NUMEROLOGY_MEANINGS.personalYear[1];

  const tenYearMap = Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    const py = getPersonalYear(birthDate, year);
    return { year, personalYear: py, theme: NUMEROLOGY_MEANINGS.personalYear[py].theme };
  });

  const prompt = `Dựa trên thần số học và dữ liệu từ file numerology-meanings.js, phân tích bé ${childName} (ngày sinh: ${birthDate}). 
    - Số Đường đời: ${lifePath} (${lifePathData.theme}, điểm mạnh: ${lifePathData.strengths.join(', ')}, điểm yếu: ${lifePathData.challenges.join(', ')}),
    - Số Linh hồn: ${soulUrge} (${soulUrgeData.desire}),
    - Số Nhân cách: ${personality} (${personalityData.theme}),
    - Số Sứ mệnh: ${destiny} (${destinyData.theme}),
    - Năm cá nhân ${currentYear}: ${personalYear} (${personalYearData.theme}).
    Trả về JSON với "childAnalysis":
    1. "numbers": { lifePath: {number, symbol, theme, strengths, challenges}, soulUrge: {number, symbol, desire, motivation}, personality: {number, symbol, theme, strengths}, destiny: {number, symbol, theme, talents} },
    2. "personalYear": { number, theme, focus, keywords },
    3. "personalityTraits": Mô tả tính cách bé (4-5 câu),
    4. "potential": Tiềm năng bé (4-5 câu),
    5. "challenges": Thử thách bé có thể gặp (4-5 câu),
    6. "shortTerm": Lời khuyên ngắn hạn cho tháng hiện tại (3-4 câu),
    7. "mediumTerm": Lời khuyên trung hạn cho năm ${currentYear} (4-5 câu),
    8. "longTerm": Lời khuyên dài hạn (5-6 câu),
    9. "tenYearMap": Mảng 10 năm tới, mỗi năm có {year, personalYear, theme, advice (2-3 câu)}.
    Symbol lấy từ numerology-meanings.js, nếu không có thì dùng emoji đơn giản như "🌟". Không dùng Markdown, chỉ trả JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.childAnalysis) throw new Error('Gemini API lỗi');
    return { childAnalysis: { ...data.childAnalysis, tenYearMap } }; // Gộp tenYearMap từ tính toán
  } catch (error) {
    console.error('Lỗi:', error.message);
    return getFallbackAnalysis(childName, birthDate, lifePath, soulUrge, personality, destiny, personalYear, lifePathData, soulUrgeData, personalityData, destinyData, personalYearData, tenYearMap, currentYear);
  }
});

function getFallbackAnalysis(childName, birthDate, lifePath, soulUrge, personality, destiny, personalYear, lifePathData, soulUrgeData, personalityData, destinyData, personalYearData, tenYearMap, currentYear) {
  const currentMonth = new Date().toLocaleString('vi', { month: 'long' });
  return {
    childAnalysis: {
      numbers: {
        lifePath: { 
          number: lifePath, 
          symbol: lifePathData.symbol || '🌟', 
          theme: lifePathData.theme, 
          strengths: lifePathData.strengths.join(', '), // Đảm bảo là chuỗi
          challenges: lifePathData.challenges.join(', ') // Đảm bảo là chuỗi
        },
        soulUrge: { 
          number: soulUrge, 
          symbol: '❤️', 
          desire: soulUrgeData.desire, 
          motivation: soulUrgeData.motivation 
        },
        personality: { 
          number: personality, 
          symbol: personalityData.symbol || '🌀', 
          theme: personalityData.theme, 
          strengths: personalityData.strengths.join(', ') // Đảm bảo là chuỗi
        },
        destiny: { 
          number: destiny, 
          symbol: destinyData.symbol || '⚡', 
          theme: destinyData.theme, 
          talents: destinyData.talents.join(', ') // Đảm bảo là chuỗi
        }
      },
      personalYear: { 
        number: personalYear, 
        theme: personalYearData.theme, 
        focus: personalYearData.focus.join(', '), 
        keywords: personalYearData.keywords.join(', ') 
      },
      personalityTraits: `Bé ${childName} mang năng lượng ${lifePathData.theme} (${lifePath}) với ${lifePathData.strengths[0].toLowerCase()}. Số linh hồn ${soulUrge} cho thấy bé khao khát ${soulUrgeData.desire.toLowerCase()}. Số nhân cách ${personality} thể hiện bé ${personalityData.strengths[0].toLowerCase()} trong giao tiếp. Số sứ mệnh ${destiny} định hướng bé thành ${destinyData.theme.toLowerCase()}.`,
      potential: `Bé có tiềm năng lớn với ${lifePathData.strengths[1].toLowerCase()} từ số đường đời. Số linh hồn ${soulUrge} hỗ trợ bé phát triển ${soulUrgeData.desire.toLowerCase()}. Bé có thể tỏa sáng trong ${destinyData.careers[0].toLowerCase()} nếu được hướng dẫn đúng. Tính ${personalityData.strengths[1].toLowerCase()} sẽ giúp bé nổi bật.`,
      challenges: `Thách thức lớn nhất của bé là ${lifePathData.challenges[0].toLowerCase()} từ số đường đời. Bé có thể gặp khó khăn với ${soulUrgeData.desire.toLowerCase()} nếu không được hỗ trợ. Số nhân cách ${personality} khiến bé dễ ${personalityData.challenges[0].toLowerCase()}. Hãy chú ý để bé không bị áp lực.`,
      shortTerm: `Trong tháng ${currentMonth}, khuyến khích bé tham gia hoạt động ${personalYearData.focus[0].toLowerCase()}. Hãy tạo môi trường vui vẻ để bé phát triển. Điều này giúp bé tự tin hơn.`,
      mediumTerm: `Trong năm ${currentYear}, tập trung vào ${lifePathData.strengths[0].toLowerCase()} của bé qua các hoạt động phù hợp. Năng lượng ${personalYearData.theme.toLowerCase()} hỗ trợ bé học hỏi. Hãy kiên nhẫn và đồng hành cùng bé. Đừng ép buộc quá mức để tránh căng thẳng.`,
      longTerm: `Về lâu dài, ${lifePathData.theme} (${lifePath}) cho thấy bé có tiềm năng lớn với ${lifePathData.strengths[0].toLowerCase()}. Hãy hướng bé theo ${destinyData.careers[0].toLowerCase()}. Chú ý khắc phục ${lifePathData.challenges[0].toLowerCase()} bằng cách dạy bé quản lý cảm xúc. Điều này giúp bé trưởng thành toàn diện. Kiên trì là chìa khóa.`,
      tenYearMap: tenYearMap.map(item => ({
        year: item.year,
        personalYear: item.personalYear,
        theme: item.theme,
        advice: `Trong năm ${item.year}, năng lượng ${item.theme.toLowerCase()} sẽ chi phối bé. Hãy khuyến khích bé ${NUMEROLOGY_MEANINGS.personalYear[item.personalYear].focus[0].toLowerCase()}. Điều này giúp bé phát triển tốt hơn.`
      }))
    }
  };
}