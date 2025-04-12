import { defineEventHandler } from 'h3';
import { PersonalYearNumbers, NumerologyUtils } from '../utils/numerology-meanings';

// Tính số cá nhân cho chu kỳ vận số
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

// Tạo focus và keywords từ số cá nhân
function generateCycleDetails(number, year) {
  const themes = {
    1: 'Năm %s với số cá nhân 1 mang chủ đề khởi đầu mới. Đây là thời điểm để bạn bắt đầu các dự án mới, khám phá ý tưởng sáng tạo và khẳng định sự độc lập. Hãy tận dụng năng lượng này để đặt nền móng cho tương lai. Niềm tin vào bản thân sẽ là chìa khóa dẫn bạn đến thành công. Số 1 khuyến khích bạn hành động mạnh mẽ và quyết đoán.',
    2: 'Năm %s với số cá nhân 2 tập trung vào hợp tác và cân bằng. Bạn sẽ tìm thấy giá trị trong các mối quan hệ và sự kiên nhẫn. Đây là thời gian để lắng nghe trực giác và xây dựng sự hài hòa. Làm việc nhóm sẽ mang lại kết quả tích cực. Số 2 nhắc bạn chú trọng đến sự hỗ trợ lẫn nhau.',
    3: 'Năm %s với số cá nhân 3 là năm của sáng tạo và giao tiếp. Bạn sẽ cảm thấy tràn đầy cảm hứng để thể hiện bản thân qua nghệ thuật hoặc các hoạt động xã hội. Hãy tận hưởng niềm vui và sự năng động. Kết nối với mọi người sẽ mở ra nhiều cơ hội. Số 3 khuyến khích bạn sống tích cực và cởi mở.',
    4: 'Năm %s với số cá nhân 4 tập trung vào xây dựng nền tảng vững chắc. Đây là thời điểm để bạn làm việc chăm chỉ, tổ chức cuộc sống và đảm bảo sự ổn định. Kỷ luật sẽ mang lại kết quả lâu dài. Hãy kiên trì với mục tiêu của mình. Số 4 nhắc bạn tập trung vào thực tế và hiệu quả.',
    5: 'Năm %s với số cá nhân 5 mang năng lượng thay đổi và tự do. Bạn sẽ cảm thấy thôi thúc khám phá những điều mới mẻ và chấp nhận rủi ro. Đây là thời gian để linh hoạt và trải nghiệm sự đa dạng. Hãy đón nhận cơ hội bất ngờ. Số 5 khuyến khích bạn sống năng động và cởi mở.',
    6: 'Năm %s với số cá nhân 6 xoay quanh trách nhiệm và gia đình. Bạn sẽ tập trung vào việc chăm sóc người thân yêu và xây dựng sự hài hòa. Đây là thời điểm để đảm nhận vai trò lãnh đạo trong cộng đồng. Tình yêu và sự hỗ trợ sẽ là trọng tâm. Số 6 nhắc bạn chú trọng đến sự cân bằng.',
    7: 'Năm %s với số cá nhân 7 khuyến khích tìm kiếm sự thật và nội tâm. Đây là thời gian để bạn suy ngẫm, học hỏi và phát triển trực giác. Hãy dành thời gian cho bản thân để khám phá tri thức hoặc tâm linh. Sự tĩnh lặng sẽ mang lại câu trả lời. Số 7 khuyên bạn lắng nghe tiếng nói bên trong.',
    8: 'Năm %s với số cá nhân 8 là năm của thành công và quyền lực. Bạn sẽ có cơ hội đạt được mục tiêu lớn và quản lý tài chính hiệu quả. Hãy tận dụng tham vọng để khẳng định vị thế. Sự tự tin sẽ dẫn bạn đến thành công. Số 8 nhắc bạn tổ chức và hành động quyết đoán.',
    9: 'Năm %s với số cá nhân 9 đánh dấu sự hoàn thiện và vị tha. Đây là thời gian để bạn chia sẻ kinh nghiệm, kết thúc một chu kỳ và chuẩn bị cho khởi đầu mới. Hãy sống với tinh thần nhân đạo. Sự cho đi sẽ mang lại ý nghĩa sâu sắc. Số 9 khuyến khích bạn nhìn lại và tiến lên.'
  };
  return {
    number,
    description: themes[number] ? themes[number].replace('%s', year) : `Năm ${year} với số cá nhân ${number}.`,
    focus: PersonalYearNumbers[number].focus.slice(0, 3),
    keywords: PersonalYearNumbers[number].keywords.slice(0, 5)
  };
}

// Fallback response
function getFallbackResponse(personalYearCycles) {
  const cyclesData = Object.keys(personalYearCycles).length > 0 ? personalYearCycles : {
    2025: 1, 2026: 2, 2027: 3, 2028: 4, 2029: 5, 2030: 6, 2031: 7, 2032: 8, 2033: 9, 2034: 1
  };

  const numerology = {
    cycles: Object.keys(cyclesData).reduce((acc, year) => {
      acc[year] = generateCycleDetails(cyclesData[year], year);
      return acc;
    }, {}),
    focusAreas: Object.keys(cyclesData).map(year => ({
      year,
      focus: PersonalYearNumbers[cyclesData[year]].focus[0],
      keyword: PersonalYearNumbers[cyclesData[year]].keywords[0]
    }))
  };
  return { numerology };
}

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.'
    });
  }

  const personalYearCycles = getPersonalYearCycles(birthdate);

  try {
    const prompt = `
      Dựa trên chu kỳ vận số: ${JSON.stringify(personalYearCycles)}
      - Thông tin: sinh ngày ${birthdate}, tên "${name}", giới tính "${gender}"

      Trả về JSON hợp lệ với phần "numerology" chứa 1 trường:
      1. "cycles": object chứa chu kỳ 10 năm (từ ${new Date().getFullYear()}), mỗi năm có:
         - "number": số cá nhân (lấy từ chu kỳ đã cho)
         - "description": mô tả chi tiết (4-6 câu) dựa trên số cá nhân, ví dụ số 1 là khởi đầu, số 2 là hợp tác, v.v.

      Trả về chuỗi JSON thuần túy, không dùng Markdown!
    `;

    console.log('Sending prompt to Gemini:', prompt);

    // Timeout 6 giây để đảm bảo tổng thời gian dưới 7 giây
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`Gemini API lỗi: ${response.status}`);
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    console.log('Raw Gemini Response:', rawText);

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.numerology || !parsedData.numerology.cycles) {
        throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      }

      // Bổ sung focus và keywords từ PersonalYearNumbers
      const cycles = Object.keys(parsedData.numerology.cycles).reduce((acc, year) => {
        const number = parsedData.numerology.cycles[year].number;
        acc[year] = {
          ...parsedData.numerology.cycles[year],
          focus: PersonalYearNumbers[number].focus.slice(0, 3),
          keywords: PersonalYearNumbers[number].keywords.slice(0, 5)
        };
        return acc;
      }, {});

      // Thêm focusAreas
      parsedData.numerology = {
        cycles,
        focusAreas: Object.keys(cycles).map(year => ({
          year,
          focus: cycles[year].focus[0],
          keyword: cycles[year].keywords[0]
        }))
      };

      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackResponse(personalYearCycles);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackResponse(personalYearCycles);
  }
});