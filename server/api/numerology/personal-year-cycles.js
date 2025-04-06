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

  // Trả về dữ liệu trực tiếp mà không cần gọi Gemini API
  const numerology = {
    cycles: Object.keys(personalYearCycles).reduce((acc, year) => {
      const number = personalYearCycles[year];
      acc[year] = {
        number,
        description: `Năm ${year} với số cá nhân ${number} mang chủ đề "${PersonalYearNumbers[number].theme}". Đây là thời điểm để bạn ${PersonalYearNumbers[number].focus.join(', ')}. Năng lượng của năm này khuyến khích bạn tập trung vào những mục tiêu quan trọng và tận dụng cơ hội để phát triển bản thân. Hãy chú ý đến những thay đổi xung quanh và điều chỉnh kế hoạch phù hợp.`,
        focus: PersonalYearNumbers[number].focus,
        keywords: PersonalYearNumbers[number].keywords
      };
      return acc;
    }, {})
  };

  return { numerology };
});