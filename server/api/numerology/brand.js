import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Hàm tính số
function getLifePathNumber(date) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(date)) return 9;
  const normalizedDate = date.replace(/-/g, '/');
  const [day, month, year] = normalizedDate.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) return 9;
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
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
  const { industry, date, ownerName, extraRequest, gender } = await readBody(event);

  if (!industry || !date || !ownerName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: industry, date và ownerName là bắt buộc.',
    });
  }

  const lifePathNumber = getLifePathNumber(date);
  const soulNumber = getSoulNumber(ownerName);
  const personalityNumber = getPersonalityNumber(ownerName);
  const destinyNumber = getDestinyNumber(ownerName);

  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[lifePathNumber] || NUMEROLOGY_MEANINGS.lifePath[1];
  const soulData = NUMEROLOGY_MEANINGS.soulUrge[soulNumber] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const personalityData = NUMEROLOGY_MEANINGS.personality[personalityNumber] || NUMEROLOGY_MEANINGS.personality[1];
  const destinyData = NUMEROLOGY_MEANINGS.expression[destinyNumber] || NUMEROLOGY_MEANINGS.expression[1];

  console.log('Numerology data:', { 
    lifePathNumber, soulNumber, personalityNumber, destinyNumber,
    lifePathData, soulData, personalityData, destinyData 
  });

  const prompt = `Dựa trên thần số học với số chủ đạo ${lifePathNumber} (${lifePathData.theme}), số linh hồn ${soulNumber} (${soulData.desire}), số nhân cách ${personalityNumber} (${personalityData.theme}), số định mệnh ${destinyNumber} (${destinyData.theme}), ngày thành lập "${date}", tên chủ "${ownerName}", ngành nghề "${industry}", yêu cầu bổ sung "${extraRequest || 'Không có'}", giới tính "${gender || 'Không xác định'}". Trả về JSON hợp lệ với phần "numerology" chứa các trường sau:
    1. "lifePath": Số chủ đạo ${lifePathNumber}, "lifePathDesc": Mô tả ngắn gọn ý nghĩa (${lifePathData.theme}, dựa trên ${lifePathData.strengths.join(', ')}) trong 1-2 câu.
    2. "soul": Số linh hồn ${soulNumber}, "soulDesc": Mô tả ngắn gọn (${soulData.desire}, dựa trên ${soulData.motivation}) trong 1-2 câu.
    3. "personality": Số nhân cách ${personalityNumber}, "personalityDesc": Mô tả ngắn gọn (${personalityData.theme}, dựa trên ${personalityData.workStyle}) trong 1-2 câu.
    4. "destiny": Số định mệnh ${destinyNumber}, "destinyDesc": Mô tả ngắn gọn (${destinyData.theme}, dựa trên ${destinyData.talents.join(', ')}) trong 1-2 câu.
    5. "generalAnalysis": Phân tích tổng quan (10-15 câu) về năng lượng của ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme} kết hợp với ngành "${industry}" và yêu cầu "${extraRequest || 'Không có'}", tập trung vào tiềm năng, thách thức, và cách các số ảnh hưởng đến thương hiệu.
    6. "suggestions": Mảng 3-5 gợi ý tên thương hiệu, mỗi gợi ý có:
       - "name": Tên phù hợp với ngành "${industry}" và yêu cầu "${extraRequest || 'Không có'}",
       - "soul": Số linh hồn của tên (tính từ nguyên âm),
       - "destiny": Số định mệnh của tên (tính từ toàn bộ chữ cái),
       - "desc": Mô tả ngắn (2-3 câu) về ý nghĩa tên, liên kết với ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme},
       - "logoSuggestion": Mô tả logo chi tiết (1-2 câu: hình dạng, màu sắc phù hợp với số học và ngành, phong cách, ví dụ: "Logo hình tam giác vàng kim với chữ cái đầu cách điệu trên nền gradient tím, phong cách sang trọng").
       Tên phải hài hòa với năng lượng của chủ và ngành "${industry}".
    7. "brandAdvice": Lời khuyên (3-5 câu) để phát triển thương hiệu dựa trên ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme} và ngành "${industry}".
    Không thêm thông tin ngoài các trường trên. Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.numerology) throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error);
    return getFallbackResponse(lifePathNumber, soulNumber, personalityNumber, destinyNumber, industry, extraRequest, gender, lifePathData, soulData, personalityData, destinyData);
  }
});

function getFallbackResponse(lifePathNumber, soulNumber, personalityNumber, destinyNumber, industry, extraRequest, gender, lifePathData, soulData, personalityData, destinyData) {
  const numerology = {
    lifePath: lifePathNumber,
    lifePathDesc: `${lifePathData.theme} (${lifePathNumber}) mang năng lượng ${lifePathData.strengths[0].toLowerCase()} và ${lifePathData.strengths[1].toLowerCase()} để định hướng thương hiệu.`,
    soul: soulNumber,
    soulDesc: `${soulData.desire} (${soulNumber}) thể hiện khát vọng ${soulData.motivation.toLowerCase()} của chủ thương hiệu.`,
    personality: personalityNumber,
    personalityDesc: `${personalityData.theme} (${personalityNumber}) cho thấy phong cách ${personalityData.workStyle.toLowerCase()} trong cách vận hành.`,
    destiny: destinyNumber,
    destinyDesc: `${destinyData.theme} (${destinyNumber}) định hình tương lai với ${destinyData.talents[0].toLowerCase()} và ${destinyData.talents[1].toLowerCase()}.`,
    generalAnalysis: `Số chủ đạo ${lifePathNumber} (${lifePathData.theme.toLowerCase()}) mang lại năng lượng ${lifePathData.strengths[0].toLowerCase()} và ${lifePathData.strengths[1].toLowerCase()}, rất phù hợp để xây dựng thương hiệu trong ngành "${industry}". Số linh hồn ${soulNumber} (${soulData.desire.toLowerCase()}) phản ánh khát vọng ${soulData.motivation.toLowerCase()}, định hình tầm nhìn thương hiệu. Số nhân cách ${personalityNumber} (${personalityData.theme.toLowerCase()}) ảnh hưởng qua phong cách ${personalityData.workStyle.toLowerCase()}, tạo sự khác biệt trong cách tiếp cận khách hàng. Số định mệnh ${destinyNumber} (${destinyData.theme.toLowerCase()}) hỗ trợ ${destinyData.talents[0].toLowerCase()} và ${destinyData.talents[1].toLowerCase()}, giúp thương hiệu phát triển bền vững. Yêu cầu bổ sung "${extraRequest || 'Không có'}" được cân nhắc để tăng tính độc đáo. Thương hiệu này có tiềm năng lớn nếu tận dụng ${lifePathData.strengths[2].toLowerCase()} trong chiến lược. Thách thức là cân bằng giữa ${soulData.desire.toLowerCase()} cá nhân và nhu cầu thị trường. Năng lượng tổng thể khuyến khích sự sáng tạo và thực tế. Ngành "${industry}" sẽ hưởng lợi từ sự kết hợp này nếu định vị đúng. Cuối cùng, thương hiệu có thể nổi bật nhờ ${personalityData.strengths[0].toLowerCase()} và ${destinyData.talents[2].toLowerCase()}.`,
    suggestions: [
      {
        name: extraRequest?.includes('hot') ? 'HotTrend' : `${industry.slice(0, 3)}Peak`,
        soul: getSoulNumber(extraRequest?.includes('hot') ? 'HotTrend' : `${industry.slice(0, 3)}Peak`),
        destiny: getDestinyNumber(extraRequest?.includes('hot') ? 'HotTrend' : `${industry.slice(0, 3)}Peak`),
        desc: `Tên này kết hợp ${lifePathData.theme.toLowerCase()} với ${lifePathData.strengths[0].toLowerCase()} và ${soulData.desire.toLowerCase()} qua ${soulData.fulfillment.toLowerCase()}, phù hợp với ngành "${industry}". Nó mang năng lượng sáng tạo và thực tế.`,
        logoSuggestion: `Logo hình tròn màu cam rực với chữ cái đầu cách điệu, viền gradient tím, phong cách hiện đại và năng động.`
      },
      {
        name: extraRequest?.includes('hot') ? 'HotVibe' : `${industry.slice(0, 3)}Core`,
        soul: getSoulNumber(extraRequest?.includes('hot') ? 'HotVibe' : `${industry.slice(0, 3)}Core`),
        destiny: getDestinyNumber(extraRequest?.includes('hot') ? 'HotVibe' : `${industry.slice(0, 3)}Core`),
        desc: `Tên này phản ánh ${personalityData.theme.toLowerCase()} với ${personalityData.workStyle.toLowerCase()} và ${destinyData.theme.toLowerCase()} qua ${destinyData.talents[0].toLowerCase()}, lý tưởng cho "${industry}". Nó tạo cảm giác mạnh mẽ và bền vững.`,
        logoSuggestion: `Logo hình lục giác gradient đỏ-xanh, chữ cái đầu lớn màu trắng với ngôi sao nhỏ phía trên, phong cách táo bạo.`
      },
      {
        name: extraRequest?.includes('hot') ? 'HotEdge' : `${industry.slice(0, 3)}Zap`,
        soul: getSoulNumber(extraRequest?.includes('hot') ? 'HotEdge' : `${industry.slice(0, 3)}Zap`),
        destiny: getDestinyNumber(extraRequest?.includes('hot') ? 'HotEdge' : `${industry.slice(0, 3)}Zap`),
        desc: `Tên này hài hòa với ${lifePathData.theme.toLowerCase()} nhờ ${lifePathData.strengths[2].toLowerCase()} và ${soulData.desire.toLowerCase()} với ${soulData.motivation.toLowerCase()}, phù hợp với ngành "${industry}". Nó thể hiện sự tiên phong.`,
        logoSuggestion: `Logo hình tam giác vàng kim sắc nét, viền đen mảnh, chữ cái đầu nổi trên nền trắng, phong cách tối giản sang trọng.`
      }
    ],
    brandAdvice: `Hãy chọn tên thương hiệu tận dụng ${lifePathData.strengths[0].toLowerCase()} của ${lifePathData.theme.toLowerCase()} và ${soulData.desire.toLowerCase()} để tạo dấu ấn trong "${industry}". Kết hợp ${personalityData.workStyle.toLowerCase()} trong vận hành để tăng hiệu quả. Phát triển logo và chiến lược marketing dựa trên ${destinyData.talents[0].toLowerCase()} để đảm bảo sự bền vững.`
  };
  return { numerology };
}