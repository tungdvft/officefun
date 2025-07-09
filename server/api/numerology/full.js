import { defineEventHandler } from 'h3';
import { PersonalYearNumbers, NumerologyUtils } from '../utils/numerology-meanings';

// Tính số cá nhân cho chu kỳ vận số
function getPersonalYearCycles(birthdate) {
  // Validate và tách ngày tháng năm
  const [day, month, birthYear] = birthdate.split('/').map(Number);
  
  // Kiểm tra ngày hợp lệ
  const dateObj = new Date(birthYear, month-1, day);
  if (dateObj.getDate() !== day || dateObj.getMonth()+1 !== month) {
    throw new Error('Ngày sinh không hợp lệ');
  }

  // Xác định năm bắt đầu (nếu chưa qua sinh nhật trong năm hiện tại thì trừ 1)
  const now = new Date();
  let startYear = now.getFullYear();
  if (now.getMonth() < month-1 || (now.getMonth() === month-1 && now.getDate() < day)) {
    startYear--;
  }

  // Tính toán 10 năm
  const cycles = {};
  for (let i = 0; i < 10; i++) {
    const year = startYear + i;
    let sum = day + month + year;
    
    // Xử lý Master Numbers
    if (sum === 11 || sum === 22 || sum === 33) {
      cycles[year] = sum;
    } else {
      cycles[year] = NumerologyUtils.reduceToSingleDigit(sum);
    }
  }
  
  return cycles;
}

// Định nghĩa mức năng lượng cho từng số cá nhân (thang 1-10)
function getEnergyLevel(number) {
  const energyLevels = {
    1: 5, // Khởi đầu: năng lượng trung bình, bắt đầu chu kỳ
    2: 4, // Hợp tác: năng lượng nhẹ, tập trung quan hệ
    3: 6, // Sáng tạo: năng lượng tăng, biểu đạt bản thân
    4: 3, // Nền tảng: năng lượng ổn định, làm việc bền bỉ
    5: 8, // Thay đổi: năng lượng cao, biến động lớn
    6: 4, // Gia đình: năng lượng hài hòa, tập trung chăm sóc
    7: 2, // Nội tâm: năng lượng thấp, suy ngẫm
    8: 7, // Thành công: năng lượng mạnh, hướng tới mục tiêu
    9: 3, // Hoàn thiện: năng lượng giảm, chuẩn bị chu kỳ mới
  };
  return energyLevels[number] || 5; // Mặc định 5 nếu không xác định
}

// Tạo mô tả tĩnh và energyLevel cho fallback
function generateCycleDetails(number, year) {
  const themes = {
    1: `Năm ${year} với số 1 mang năng lượng khởi đầu. Đây là thời điểm bắt đầu dự án mới và tự tin tiến lên. Hãy đặt mục tiêu rõ ràng và hành động quyết đoán. Năng lượng này khuyến khích sự độc lập và sáng tạo.`,
    2: `Năm ${year} với số 2 tập trung vào hợp tác. Hãy xây dựng mối quan hệ và tìm sự cân bằng. Kiên nhẫn và lắng nghe sẽ mang lại kết quả tốt. Đây là năm để phát triển sự đồng cảm.`,
    3: `Năm ${year} với số 3 tràn đầy sáng tạo. Hãy thể hiện bản thân và tận hưởng niềm vui. Năng lượng này thúc đẩy nghệ thuật và giao tiếp. Tận dụng để khám phá đam mê.`,
    4: `Năm ${year} với số 4 là xây dựng nền tảng. Làm việc chăm chỉ để đạt sự ổn định. Kỷ luật và tổ chức là chìa khóa. Đây là thời điểm củng cố tương lai.`,
    5: `Năm ${year} với số 5 mang đến thay đổi. Khám phá cơ hội mới và sống năng động. Sự linh hoạt sẽ giúp bạn thích nghi. Hãy đón nhận những bất ngờ.`,
    6: `Năm ${year} với số 6 nhấn mạnh gia đình. Chăm sóc người thân và tạo sự hài hòa. Trách nhiệm và yêu thương là trọng tâm. Đây là năm để xây dựng tổ ấm.`,
    7: `Năm ${year} với số 7 khuyến khích nội tâm. Suy ngẫm và học hỏi sẽ mang lại giá trị. Hãy dành thời gian cho bản thân. Tâm linh và tri thức được ưu tiên.`,
    8: `Năm ${year} với số 8 là năm thành công. Tận dụng tham vọng để đạt mục tiêu lớn. Quyết tâm và chiến lược sẽ dẫn bạn đi xa. Đây là thời điểm tỏa sáng.`,
    9: `Năm ${year} với số 9 đánh dấu hoàn thiện. Chia sẻ kinh nghiệm và chuẩn bị khởi đầu mới. Buông bỏ những gì không cần thiết. Năng lượng này dẫn bạn đến sự chuyển đổi.`,
  };
  return {
    number,
    description: themes[number] || `Năm ${year} với số cá nhân ${number}.`,
    energyLevel: getEnergyLevel(number),
  };
}

// Fallback response
function getFallbackResponse(personalYearCycles) {
  const cyclesData = Object.keys(personalYearCycles).length > 0 ? personalYearCycles : {
    2025: 1, 2026: 2, 2027: 3, 2028: 4, 2029: 5, 2030: 6, 2031: 7, 2032: 8, 2033: 9, 2034: 1,
  };

  const numerology = {
    cycles: Object.keys(cyclesData).reduce((acc, year) => {
      acc[year] = generateCycleDetails(cyclesData[year], year);
      return acc;
    }, {}),
  };
  return { numerology };
}

const apiKey = process.env.GEMINI_API_KEY;

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.',
    });
  }

  const personalYearCycles = getPersonalYearCycles(birthdate);

  try {
    const prompt = `
      Dựa trên chu kỳ vận số: ${JSON.stringify(personalYearCycles)}
      Trả về JSON hợp lệ với phần "numerology" chứa 1 trường:
      1. "cycles": object chứa chu kỳ 10 năm (từ ${new Date().getFullYear()}), mỗi năm có:
         - "number": số cá nhân (lấy từ chu kỳ đã cho)
         - "description": mô tả ngắn (4-5 câu) dựa trên số cá nhân, ví dụ số 1 là khởi đầu, số 2 là hợp tác, v.v.
         - "energyLevel": số nguyên từ 1-10, biểu thị cường độ năng lượng của năm (số 5 cao nhất với thay đổi lớn, số 7 thấp nhất với nội tâm, số 9 thấp để hoàn thiện, v.v.)
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
    const parsedData = JSON.parse(rawText);

    if (!parsedData || !parsedData.numerology || !parsedData.numerology.cycles) {
      throw new Error('Gemini API không trả về đầy đủ dữ liệu');
    }

    return parsedData;
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackResponse(personalYearCycles);
  }
});