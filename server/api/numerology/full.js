import { defineEventHandler } from 'h3';
import {
  LifePathNumbers,
  ExpressionNumbers,
  SoulUrgeNumbers,
  PersonalityNumbers,
  PersonalYearNumbers,
  NumerologyUtils
} from '../utils/numerology-meanings';

// Tính số chủ đạo (Life Path Number)
function getLifePathNumber(birthdate) {
  const [day, month, year] = birthdate.split('/').map(Number);
  if (!day || !month || !year) return 9;
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 9;
}

// Tính số linh hồn (Soul Urge Number)
function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Tính số nhân cách (Personality Number)
function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi;
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Tính số định mệnh (Destiny Number)
function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Tính chu kỳ vận số (Personal Year Cycles)
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
  console.log('Calculated Personal Year Cycles:', cycles);
  return cycles;
}

const apiKey = process.env.GEMINI_API_KEY||'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

// Fallback nếu Gemini API thất bại
function getFallbackResponse(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalYearCycles) {
  const cyclesData = Object.keys(personalYearCycles).length > 0 ? personalYearCycles : {
    2025: 1, 2026: 2, 2027: 3, 2028: 4, 2029: 5, 2030: 6, 2031: 7, 2032: 8, 2033: 9, 2034: 1
  };

  const numerology = {
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
    destinyDesc: `Số định mệnh ${destinyNumber} định hình bạn thành "${ExpressionNumbers[destinyNumber].theme}", hướng tới ${ExpressionNumbers[destinyNumber].tip}.`,
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
    age60_plusAdvice: ['Chia sẻ bài học', 'Duy trì kết nối'],
    cycles: Object.keys(cyclesData).reduce((acc, year) => {
      const number = cyclesData[year];
      acc[year] = {
        number,
        description: `Năm ${year} với số cá nhân ${number} mang chủ đề "${PersonalYearNumbers[number].theme}". Đây là thời điểm để bạn ${PersonalYearNumbers[number].focus.join(', ')}.`,
        focus: PersonalYearNumbers[number].focus,
        keywords: PersonalYearNumbers[number].keywords
      };
      return acc;
    }, {})
  };
  return { numerology };
}

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.'
    });
  }

  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const personalYearCycles = getPersonalYearCycles(birthdate);

  console.log('Personal Year Cycles before prompt:', personalYearCycles);

  try {
    const prompt = `
      Dựa trên thần số học với các số sau:
      - Số chủ đạo (Life Path): ${dominantNumber}, chủ đề "${LifePathNumbers[dominantNumber].theme}", mục đích "${LifePathNumbers[dominantNumber].purpose}"
      - Số linh hồn (Soul Urge): ${soulNumber}, khát vọng "${SoulUrgeNumbers[soulNumber].desire}", động lực "${SoulUrgeNumbers[soulNumber].motivation}"
      - Số nhân cách (Personality): ${personalityNumber}, chủ đề "${PersonalityNumbers[personalityNumber].theme}"
      - Số định mệnh (Destiny): ${destinyNumber}, chủ đề "${ExpressionNumbers[destinyNumber].theme}"
      - Thông tin cá nhân: sinh ngày ${birthdate}, tên "${name}", giới tính "${gender}"
      - Chu kỳ vận số (Personal Year Cycles): ${JSON.stringify(personalYearCycles)}, mỗi năm có số cá nhân tương ứng (từ 1-9 hoặc 11, 22), dựa trên Personal Year Numbers (ví dụ: số 1 - chủ đề "${PersonalYearNumbers[1].theme}", tập trung "${PersonalYearNumbers[1].focus.join(', ')}", từ khóa "${PersonalYearNumbers[1].keywords.join(', ')}"; số 2 - chủ đề "${PersonalYearNumbers[2].theme}", v.v.)

      Trả về JSON hợp lệ với phần "numerology" chứa các trường sau:
      1. "lifePath": { "number": ${dominantNumber}, "symbol": "${LifePathNumbers[dominantNumber].symbol}", "description": mô tả chi tiết (8-10 câu), "strengths": mảng 3-5 điểm mạnh, "challenges": mảng 3-5 thử thách, "careers": mảng 3-5 nghề nghiệp, "advice": lời khuyên (3-5 câu) }
      2. "soul": ${soulNumber}, "soulDesc": mô tả ngắn gọn (1-2 câu)
      3. "personality": ${personalityNumber}, "personalityDesc": mô tả ngắn gọn (1-2 câu)
      4. "destiny": ${destinyNumber}, "destinyDesc": mô tả ngắn gọn (1-2 câu)
      5. "age0_10": diễn giải chi tiết (10-15 câu) về 0-10 tuổi dựa trên số linh hồn ${soulNumber}
      6. "age10_20": diễn giải chi tiết (10-15 câu) về 10-20 tuổi dựa trên số linh hồn ${soulNumber} và số chủ đạo ${dominantNumber}
      7. "age20_30": diễn giải chi tiết (10-15 câu) về 20-30 tuổi dựa trên số linh hồn ${soulNumber}, số chủ đạo ${dominantNumber}, số nhân cách ${personalityNumber}
      8. "age30_40": diễn giải chi tiết (10-15 câu) về 30-40 tuổi dựa trên số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}
      9. "age40_50": diễn giải chi tiết (10-15 câu) về 40-50 tuổi dựa trên số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}
      10. "age50_60": diễn giải chi tiết (10-15 câu) về 50-60 tuổi dựa trên số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, số chủ đạo ${dominantNumber}
      11. "age60_plus": diễn giải chi tiết (10-15 câu) về 60+ tuổi dựa trên tất cả số ${dominantNumber}, ${soulNumber}, ${personalityNumber}, ${destinyNumber}
      12. "age0_10Advice": lời khuyên (3-5 câu) cho 0-10 tuổi
      13. "age10_20Advice": lời khuyên (3-5 câu) cho 10-20 tuổi
      14. "age20_30Advice": lời khuyên (3-5 câu) cho 20-30 tuổi
      15. "age30_40Advice": lời khuyên (3-5 câu) cho 30-40 tuổi
      16. "age40_50Advice": lời khuyên (3-5 câu) cho 40-50 tuổi
      17. "age50_60Advice": lời khuyên (3-5 câu) cho 50-60 tuổi
      18. "age60_plusAdvice": lời khuyên (3-5 câu) cho 60+ tuổi
      19. "cycles": object chứa chu kỳ 10 năm (từ ${new Date().getFullYear()}), mỗi năm dựa trên số cá nhân từ chu kỳ vận số đã cho, có: "number": số cá nhân, "description": mô tả (5-7 câu) dựa trên số cá nhân đó (tham khảo PersonalYearNumbers), "focus": mảng 3 yếu tố, "keywords": mảng 5 từ khóa. Đảm bảo trường này không rỗng!

      Trả về chuỗi JSON thuần túy, không dùng Markdown!
    `;

    console.log('Sending prompt to Gemini:', prompt);

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
    let rawText = data.candidates[0].content.parts[0].text;

    console.log('Raw Gemini Response:', rawText);

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.numerology) throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      if (!parsedData.numerology.cycles || Object.keys(parsedData.numerology.cycles).length === 0) {
        console.warn('Gemini returned empty cycles, falling back to calculated data');
        parsedData.numerology.cycles = getFallbackResponse(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalYearCycles).numerology.cycles;
      }
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackResponse(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalYearCycles);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackResponse(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalYearCycles);
  }
});