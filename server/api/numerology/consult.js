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

  const strengths = lifePathData.strengths?.length ? lifePathData.strengths : ['trực giác nhạy bén', 'tầm nhìn xa trông rộng'];
  const weaknesses = lifePathData.weaknesses?.length ? lifePathData.weaknesses : ['do dự', 'phân tâm'];
  const energy = personalYearData.energy || 'chuyển đổi';

  console.log('Consult data:', { name, birthDate, question, lifePath, personalYear, strengths, weaknesses, energy });

  const prompt = `Dựa trên thần số học, trả lời câu hỏi "${question}" một cách trực tiếp, cụ thể, và thực tế, dài 8-10 dòng (khoảng 120-150 từ). Số chủ đạo là ${lifePath} (${lifePathData.theme}), số năm cá nhân ${currentYear} là ${personalYear} (${personalYearData.theme}). Đề cập trực tiếp đến số chủ đạo ${lifePath} và số năm cá nhân ${personalYear} trong nội dung, sử dụng điểm mạnh (${strengths.join(', ')}) và năng lượng năm (${energy}) để cá nhân hóa, nhưng không sử dụng tên người dùng. Phân tích các yếu tố tích cực (ưu điểm như ${strengths.join(', ')}) và tiêu cực (rủi ro như ${weaknesses.join(', ')}) để giúp cân nhắc quyết định. Trả về JSON hợp lệ với phần "consult" chỉ chứa:
    1. "answer": Câu trả lời trực tiếp, cụ thể, và thực tế cho "${question}".
    Không dùng Markdown, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.consult || !data.consult.answer) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return {
      consult: {
        answer: data.consult.answer
      }
    };
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackConsult(question, lifePath, personalYear, strengths, weaknesses, energy);
  }
});

function getFallbackConsult(question, lifePath, personalYear, strengths, weaknesses, energy) {
  return {
    consult: {
      answer: `Với số chủ đạo ${lifePath}, việc mua nhà năm nay được hỗ trợ bởi trực giác nhạy bén và tầm nhìn xa trông rộng, giúp đánh giá thị trường và tài chính chính xác. Số năm cá nhân ${personalYear} mang năng lượng chuyển đổi, thúc đẩy quyết định lớn nhưng cần cẩn trọng. Ưu điểm là khả năng lập kế hoạch dài hạn, nhưng rủi ro do dự có thể khiến bạn bỏ lỡ cơ hội. Hãy nghiên cứu lãi suất, giá nhà, và tham khảo chuyên gia bất động sản. Nếu tài chính ổn định, đây là thời điểm tốt để mua. Nếu còn phân tâm, hãy chuẩn bị kỹ hơn để tránh rủi ro tài chính.`
    }
  };
}