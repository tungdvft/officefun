import { defineEventHandler, createError } from 'h3';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getLifePathNumber(birthdate) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthdate)) return 9;
  const normalizedBirthdate = birthdate.replace(/-/g, '/');
  const [day, month, year] = normalizedBirthdate.split('/').map(Number);
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

const apiKey = process.env.GEMINI_API_KEY || '';

async function getGeminiCareerGuidance(birthdate, name, currentJob) {
  console.log('API Key being used:', apiKey ? '[HIDDEN]' : 'No API Key provided');
  console.log('Input data:', { birthdate, name, currentJob });

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
    dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle,
    lifePathData: lifePathData.theme, soulData: soulData.desire, personalityData: personalityData.theme, destinyData: destinyData.theme 
  });

  const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber} (${lifePathData.theme}), số linh hồn ${soulNumber} (${soulData.desire}), số nhân cách ${personalityNumber} (${personalityData.theme}), số định mệnh ${destinyNumber} (${destinyData.theme}), sinh ngày ${birthdate}, tên ${name}, công việc hiện tại "${currentJob || 'chưa có'}", chu kỳ cá nhân ${personalCycle}. Trả về JSON hợp lệ với các trường sau:
    1. "careerGoals": Phân tích cách số chủ đạo ${dominantNumber} (${lifePathData.theme}) định hình mục tiêu nghề nghiệp, dựa trên ${lifePathData.strengths.join(', ')} (2-3 câu).
    2. "passionAndMotivation": Phân tích số linh hồn ${soulNumber} (${soulData.desire}) thể hiện đam mê và động lực bên trong, dựa trên ${soulData.motivation} và ${soulData.fulfillment} (2-3 câu).
    3. "workStyle": Phân tích số nhân cách ${personalityNumber} (${personalityData.theme}) ảnh hưởng đến phong cách làm việc, dựa trên ${personalityData.strengths.join(', ')} và ${personalityData.workStyle} (2-3 câu).
    4. "longTermPath": Phân tích số định mệnh ${destinyNumber} (${destinyData.theme}) chỉ ra hướng đi sự nghiệp lâu dài, dựa trên ${destinyData.talents.join(', ')} (2-3 câu).
    5. "currentJobAnalysis": Nếu có công việc hiện tại "${currentJob || 'chưa có'}", đánh giá mức độ phù hợp với ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme}, cơ hội phát triển, gợi ý cải thiện hoặc chuyển hướng (3-4 câu); nếu không có, ghi "Hiện tại bạn chưa nhập công việc, định hướng sẽ dựa trên các số Thần số học" (1 câu).
    6. "careerSuggestions": Mảng 3 nghề nghiệp cụ thể từ ${lifePathData.careers.join(', ')} và ${destinyData.careers.join(', ')} (ví dụ: {"job": "lập trình viên", "reason": "...", "opportunities": "...", "trends": "..."}), mỗi nghề phân tích chi tiết: lý do phù hợp với ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme}, cơ hội hiện tại, xu hướng phát triển trong tương lai (bối cảnh 2025).
    7. "practicalAdvice": Lời khuyên thực tế (2-3 câu) dựa trên chu kỳ cá nhân ${personalCycle} (${NUMEROLOGY_MEANINGS.personalYear[personalCycle].theme}) và ${NUMEROLOGY_MEANINGS.personalYear[personalCycle].advice}, kết hợp công việc hiện tại (nếu có), dùng "bạn" thay vì nhắc tên/ngày sinh.
    Đảm bảo câu trả lời tập trung vào định hướng nghề nghiệp, sử dụng ngôn ngữ tự nhiên, dễ hiểu, không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  console.log('Sending prompt to Gemini API...');

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    console.log('Gemini API response status:', response.status, response.statusText);

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    console.log('Raw response from Gemini:', rawText);

    rawText = rawText.replace(/```json|```/g, '').trim();
    const parsedData = JSON.parse(rawText);

    if (!parsedData || !parsedData.careerGoals || !parsedData.careerSuggestions) {
      throw new Error('Gemini API returned incomplete data');
    }

    console.log('Parsed data from Gemini:', parsedData);
    return parsedData;
  } catch (error) {
    console.error('Error calling Gemini API:', {
      message: error.message,
      stack: error.stack,
      responseStatus: error.response?.status,
      responseText: error.response?.statusText
    });
    console.log('Falling back to default guidance...');
    return getFallbackCareerGuidance(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, currentJob, lifePathData, soulData, personalityData, destinyData);
  }
}

function getFallbackCareerGuidance(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, currentJob, lifePathData, soulData, personalityData, destinyData) {
  const fallbackData = {
    careerGoals: `Số chủ đạo ${dominantNumber} (${lifePathData.theme.toLowerCase()}) định hình mục tiêu nghề nghiệp của bạn qua ${lifePathData.strengths[0].toLowerCase()} và ${lifePathData.strengths[1].toLowerCase()}. Bạn hướng đến các vai trò tận dụng ${lifePathData.strengths[2].toLowerCase()} để tạo giá trị lâu dài.`,
    passionAndMotivation: `Số linh hồn ${soulNumber} (${soulData.desire.toLowerCase()}) thể hiện đam mê bên trong bạn là ${soulData.motivation.toLowerCase()}. Bạn sẽ tìm thấy sự thỏa mãn trong ${soulData.fulfillment.toLowerCase()}.`,
    workStyle: `Số nhân cách ${personalityNumber} (${personalityData.theme.toLowerCase()}) cho thấy bạn làm việc với ${personalityData.strengths[0].toLowerCase()} và ${personalityData.strengths[1].toLowerCase()}. ${personalityData.workStyle.toLowerCase()}.`,
    longTermPath: `Số định mệnh ${destinyNumber} (${destinyData.theme.toLowerCase()}) chỉ ra con đường dài hạn dựa trên ${destinyData.talents[0].toLowerCase()} và ${destinyData.talents[1].toLowerCase()}. Bạn có tiềm năng phát triển trong lĩnh vực cần ${destinyData.talents[2].toLowerCase()}.`,
    currentJobAnalysis: currentJob ? 
      `Công việc "${currentJob}" phù hợp với ${lifePathData.theme.toLowerCase()} nếu tận dụng ${lifePathData.strengths[0].toLowerCase()}, với ${soulData.desire.toLowerCase()} nếu đáp ứng ${soulData.fulfillment.toLowerCase()}. Nó cần hỗ trợ ${personalityData.workStyle.toLowerCase()} và ${destinyData.talents[0].toLowerCase()} để phát triển. Bạn có thể cải thiện bằng cách học kỹ năng liên quan hoặc chuyển hướng nếu thiếu sự phù hợp.` : 
      `Hiện tại bạn chưa nhập công việc, định hướng sẽ dựa trên các số Thần số học.`,
    careerSuggestions: [
      {
        job: lifePathData.careers[0],
        reason: `Phù hợp với ${lifePathData.theme.toLowerCase()} nhờ ${lifePathData.strengths[0].toLowerCase()} và ${soulData.desire.toLowerCase()} qua ${soulData.fulfillment.toLowerCase()}.`,
        opportunities: `Ngành này đang phát triển mạnh trong bối cảnh 2025 với nhu cầu cao về ${lifePathData.strengths[1].toLowerCase()}.`,
        trends: `Xu hướng ${destinyData.talents[0].toLowerCase()} sẽ dẫn dắt tương lai ngành này.`
      },
      {
        job: destinyData.careers[0],
        reason: `${destinyData.theme.toLowerCase()} hỗ trợ ${destinyData.talents[0].toLowerCase()}, kết hợp ${personalityData.theme.toLowerCase()} với ${personalityData.workStyle.toLowerCase()}.`,
        opportunities: `Cơ hội lớn trong năm 2025 nhờ xu hướng công nghệ và ${destinyData.talents[1].toLowerCase()}.`,
        trends: `Ngành này sẽ cần ${lifePathData.strengths[0].toLowerCase()} trong tương lai gần.`
      },
      {
        job: lifePathData.careers[1],
        reason: `Hài hòa với ${lifePathData.theme.toLowerCase()} qua ${lifePathData.strengths[2].toLowerCase()} và ${soulData.desire.toLowerCase()} nhờ ${soulData.motivation.toLowerCase()}.`,
        opportunities: `Nhu cầu tăng cao vào 2025 với trọng tâm là ${personalityData.strengths[0].toLowerCase()}.`,
        trends: `Xu hướng phát triển dựa trên ${destinyData.talents[2].toLowerCase()}.`
      }
    ],
    practicalAdvice: `Chu kỳ cá nhân ${personalCycle} (${NUMEROLOGY_MEANINGS.personalYear[personalCycle].theme.toLowerCase()}) khuyến khích bạn ${NUMEROLOGY_MEANINGS.personalYear[personalCycle].advice.toLowerCase()}. ${currentJob ? `Với "${currentJob}", hãy tận dụng cơ hội hiện tại hoặc tìm hướng mới nếu cần.` : 'Hãy bắt đầu với những bước nhỏ để khám phá khả năng của bạn.'}`
  };
  console.log('Fallback data generated:', fallbackData);
  return fallbackData;
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  console.log('Request received from user:', username);

  const { name, birthdate, currentJob } = await readBody(event);
  console.log('Request body:', { name, birthdate, currentJob });

  if (!name || !birthdate) {
    console.error('Validation failed: Missing name or birthdate');
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthdate là bắt buộc.'
    });
  }

  const careerGuidance = await getGeminiCareerGuidance(birthdate, name, currentJob);
  console.log('Final response being sent:', careerGuidance);
  return careerGuidance;
});