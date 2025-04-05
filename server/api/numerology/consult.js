import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getLifePathNumber(birthDate) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthDate)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ngày sinh phải có định dạng dd/mm/yyyy hoặc dd-mm-yyyy.',
    });
  }
  const [day, month, year] = birthDate.replace(/-/g, '/').split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ngày sinh không hợp lệ.',
    });
  }
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

function getPersonalYear(birthDate, currentYear) {
  const [day, month] = birthDate.replace(/-/g, '/').split('/').map(Number);
  return NumerologyUtils.reduceToSingleDigit(day + month + currentYear) || 9;
}

export default defineEventHandler(async (event) => {
  const { name, birthDate, question } = await readBody(event);

  if (!name || !birthDate || !question) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthDate, và question là bắt buộc.',
    });
  }

  const lifePath = getLifePathNumber(birthDate);
  const currentYear = new Date().getFullYear();
  const personalYear = getPersonalYear(birthDate, currentYear);
  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[lifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const personalYearData = NUMEROLOGY_MEANINGS.personalYear[personalYear] || NUMEROLOGY_MEANINGS.personalYear[1];

  // Kiểm tra dữ liệu để tránh lỗi undefined
  const strengths = lifePathData.strengths?.length ? lifePathData.strengths : ['chưa xác định'];
  const weaknesses = lifePathData.weaknesses?.length ? lifePathData.weaknesses : ['chưa xác định'];
  const energy = personalYearData.energy || 'chưa xác định';

  console.log('Consult data:', { name, birthDate, question, lifePath, personalYear, strengths, weaknesses, energy });

  const prompt = `Dựa trên thần số học, trả lời câu hỏi "${question}" cho ${name} (ngày sinh: ${birthDate}). Số chủ đạo là ${lifePath} (${lifePathData.theme}), số năm cá nhân ${currentYear} là ${personalYear} (${personalYearData.theme}). Trả về JSON hợp lệ với phần "consult" chứa:
    1. "lifePath": ${lifePath},
    2. "lifePathDesc": Mô tả ngắn (2-3 câu) về ${lifePathData.theme} dựa trên điểm mạnh (${strengths.join(', ')}) và điểm yếu (${weaknesses.join(', ')}),
    3. "personalYear": ${personalYear},
    4. "personalYearDesc": Mô tả ngắn (2-3 câu) về ${personalYearData.theme} dựa trên năng lượng (${energy}),
    5. "analysis": Phân tích ngắn (3-4 câu) về ảnh hưởng của số chủ đạo ${lifePath} (${lifePathData.theme}) và số năm cá nhân ${personalYear} (${personalYearData.theme}) đến "${question}",
    6. "opportunities": Cơ hội (3-4 câu) mà ${name} có thể tận dụng trong năm ${currentYear} liên quan đến "${question}",
    7. "challenges": Thách thức (3-4 câu) cần lưu ý khi thực hiện "${question}",
    8. "advice": Lời khuyên cụ thể (4-5 câu) để hành động trong năm ${currentYear}.
    Không dùng Markdown, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.consult || !data.consult.analysis) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return {
      consult: {
        lifePath: data.consult.lifePath,
        lifePathDesc: data.consult.lifePathDesc,
        personalYear: data.consult.personalYear,
        personalYearDesc: data.consult.personalYearDesc,
        analysis: data.consult.analysis,
        opportunities: data.consult.opportunities,
        challenges: data.consult.challenges,
        advice: data.consult.advice
      }
    };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackConsult(name, birthDate, question, lifePath, personalYear, lifePathData, personalYearData, currentYear, strengths, weaknesses, energy);
  }
});

function getFallbackConsult(name, birthDate, question, lifePath, personalYear, lifePathData, personalYearData, currentYear, strengths, weaknesses, energy) {
  return {
    consult: {
      lifePath,
      lifePathDesc: `${lifePathData.theme} (${lifePath}) mang năng lượng ${strengths[0].toLowerCase()} và ${strengths[1]?.toLowerCase() || 'khả năng tiềm ẩn'}, nhưng cần chú ý ${weaknesses[0].toLowerCase()}.`,
      personalYear,
      personalYearDesc: `Năm cá nhân ${personalYear} (${personalYearData.theme}) mang năng lượng ${energy.toLowerCase()}, hỗ trợ bạn trong các hoạt động liên quan.`,
      analysis: `Với câu hỏi "${question}" của ${name}, số chủ đạo ${lifePath} (${lifePathData.theme}) kết hợp số năm cá nhân ${personalYear} (${personalYearData.theme}) cho thấy đây là giai đoạn quan trọng. Năng lượng ${strengths[0].toLowerCase()} sẽ ảnh hưởng lớn đến quyết định của bạn. Năm ${currentYear} mang ${energy.toLowerCase()}, phù hợp để cân nhắc hành động.`,
      opportunities: `Bạn có cơ hội tận dụng ${strengths[0].toLowerCase()} để tiến bộ trong năm nay. Năng lượng ${energy.toLowerCase()} của năm ${personalYear} hỗ trợ bạn đạt được mục tiêu nếu bạn kiên trì. Đây là thời điểm tốt để phát triển bản thân.`,
      challenges: `Thách thức nằm ở ${weaknesses[0].toLowerCase()}, có thể khiến bạn chần chừ. Nếu không quản lý tốt thời gian, bạn dễ bị phân tâm. Hãy chú ý cân bằng giữa mong muốn và thực tế.`,
      advice: `Hãy lập kế hoạch rõ ràng để tận dụng ${energy.toLowerCase()} của năm ${currentYear}. Tận dụng ${strengths[0].toLowerCase()} để vượt qua khó khăn. Bắt đầu bằng những bước nhỏ và tìm sự hỗ trợ nếu cần. Đây là thời điểm để hành động nếu bạn thấy sẵn sàng. Tin vào trực giác của mình!`
    }
  };
}