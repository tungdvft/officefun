// server/api/numerology-baby.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

// Hàm tính toán (giữ nguyên)
function getLifePathNumber(birthdate) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthdate)) return 9;
  const [day, month, year] = birthdate.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) return 9;
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 9;
}

function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi;
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

// Hàm gọi Gemini
async function getBabyName(motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest) {
  const motherLifePath = getLifePathNumber(motherBirthdate);
  const motherSoul = getSoulNumber(motherName);
  const motherPersonality = getPersonalityNumber(motherName);
  const motherDestiny = getDestinyNumber(motherName);
  const fatherLifePath = getLifePathNumber(fatherBirthdate);
  const fatherSoul = getSoulNumber(fatherName);
  const fatherPersonality = getPersonalityNumber(fatherName);
  const fatherDestiny = getDestinyNumber(fatherName);
  const babyLifePath = babyBirthdate ? getLifePathNumber(babyBirthdate) : null;
  const currentYear = new Date().getFullYear();
  const motherCycle = (currentYear + parseInt(motherBirthdate.split('/')[0])) % 9 || 9;

  const prompt = `Dựa trên thần số học với thông tin mẹ: số chủ đạo ${motherLifePath}, số linh hồn ${motherSoul}, số nhân cách ${motherPersonality}, số định mệnh ${motherDestiny}, chu kỳ cá nhân ${motherCycle}, sinh ngày ${motherBirthdate}, tên ${motherName}; và bố: số chủ đạo ${fatherLifePath}, số linh hồn ${fatherSoul}, số nhân cách ${fatherPersonality}, số định mệnh ${fatherDestiny}, sinh ngày ${fatherBirthdate}, tên ${fatherName}; ${babyBirthdate ? `bé sinh ngày ${babyBirthdate}, số chủ đạo ${babyLifePath}` : 'bé chưa có ngày sinh'}; giới tính con: ${gender}; tháng sinh con: ${babyBirthMonth || 'chưa xác định'}; yêu cầu thêm: "${additionalRequest || 'không có'}". Trả về JSON hợp lệ với:
    1. "analysis": Phân tích dài (12-15 câu) đề xuất tên con dựa trên giới tính ${gender}, tháng sinh ${babyBirthMonth || 'chưa xác định'}, và yêu cầu thêm "${additionalRequest}". Phân tích số chủ đạo ${motherLifePath} của mẹ (tầm nhìn, năng lượng chính) và ${fatherLifePath} của bố (mục tiêu, định hướng)${babyBirthdate ? `, kết hợp số chủ đạo ${babyLifePath} của bé (năng lượng cá nhân)` : ''}, kết hợp số linh hồn ${motherSoul} (đam mê mẹ) và ${fatherSoul} (đam mê bố) để tìm giá trị cốt lõi cho tên con. Xem xét số nhân cách ${motherPersonality} của mẹ (hình ảnh bên ngoài) và ${fatherPersonality} của bố (phong cách) để tạo tên dễ nhớ, gần gũi. Sử dụng số định mệnh ${motherDestiny} của mẹ (đường dài) và ${fatherDestiny} của bố (sứ mệnh) để đảm bảo tên mang ý nghĩa phát triển bền vững. Chu kỳ cá nhân ${motherCycle} của mẹ gợi ý năng lượng hiện tại ảnh hưởng đến tên. Nếu có ngày sinh bé, kết hợp số chủ đạo ${babyLifePath || 'không có'} để tạo sự hài hòa; nếu không, chỉ dùng số của bố mẹ. Nếu tháng sinh ${babyBirthMonth} được cung cấp, kết hợp năng lượng tháng (ví dụ: tháng 1 - khởi đầu, tháng 3 - sáng tạo).
    2. "names": Mảng 3 tên (họ mặc định từ bố, hoặc theo yêu cầu), mỗi tên có: "name" (in đậm bằng **), "meaning" (giải thích chi tiết 2-3 câu dựa trên số của bố mẹ${babyBirthdate ? ' và bé' : ''}).
    3. "tips": 2-3 lời khuyên ngắn để chọn tên.
    Chỉ trả về JSON thuần túy, không markdown trong JSON trừ tên in đậm!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.analysis || !data.names) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackBabyName({
      motherName, fatherName, motherLifePath, motherSoul, motherPersonality, motherDestiny, motherCycle,
      fatherLifePath, fatherSoul, fatherPersonality, fatherDestiny, babyLifePath, babyBirthdate, // Thêm babyBirthdate vào params
      gender, babyBirthMonth, additionalRequest
    });
  }
}

// Hàm fallback
function getFallbackBabyName(params) {
  const {
    motherName, fatherName, motherLifePath, motherSoul, motherPersonality, motherDestiny, motherCycle,
    fatherLifePath, fatherSoul, fatherPersonality, fatherDestiny, babyLifePath, babyBirthdate, // Lấy từ params
    gender, babyBirthMonth, additionalRequest
  } = params;

  const fatherLastName = fatherName.split(' ')[0];
  const motherLastName = motherName.split(' ')[0];
  const lastName = additionalRequest?.includes('theo họ mẹ') ? motherLastName : fatherLastName;

  const analysis = `Dựa trên thần số học, việc đặt tên con cần cân bằng giữa số chủ đạo ${motherLifePath} của mẹ và ${fatherLifePath} của bố${babyLifePath ? `, kết hợp số chủ đạo ${babyLifePath} của bé` : ''}. Số ${motherLifePath} của mẹ thể hiện tầm nhìn sâu sắc và năng lượng hướng nội, định hình một cái tên mang chiều sâu. Số ${fatherLifePath} của bố mang định hướng rõ ràng, gợi ý tên cần có ý nghĩa mạnh mẽ và mục tiêu lâu dài. Số linh hồn ${motherSoul} của mẹ phản ánh đam mê bên trong, kết hợp với số linh hồn ${fatherSoul} của bố để tạo ra giá trị cốt lõi cho tên con. Số nhân cách ${motherPersonality} của mẹ cho thấy hình ảnh bên ngoài gần gũi, trong khi số ${fatherPersonality} của bố mang phong cách độc đáo, giúp tên dễ nhớ và ấn tượng. Số định mệnh ${motherDestiny} của mẹ hướng tới sự phát triển bền vững, kết hợp với số ${fatherDestiny} của bố thể hiện sứ mệnh lớn lao, đảm bảo tên mang ý nghĩa sâu sắc. Chu kỳ cá nhân ${motherCycle} của mẹ cho thấy năng lượng hiện tại ảnh hưởng đến việc chọn tên. ${params.babyBirthdate ? `Số chủ đạo ${babyLifePath} của bé (sinh ngày ${params.babyBirthdate}) được cân nhắc để tạo sự hài hòa giữa bố mẹ và con.` : 'Do chưa có ngày sinh bé, tên dựa chủ yếu vào số của bố mẹ.'} Tháng sinh ${babyBirthMonth || 'chưa xác định'} được xem xét để thêm năng lượng phù hợp, ví dụ tháng 3 mang tính sáng tạo, tháng 7 mang tính nội tâm. Yêu cầu "${additionalRequest || 'không có'}" được tích hợp để cá nhân hóa tên. Tên được chọn phù hợp với giới tính ${gender}, kết hợp các yếu tố số học để tạo sự cân bằng và ý nghĩa. Đây là cơ hội để bạn chọn một cái tên vừa đẹp vừa mang năng lượng tích cực cho con.`;

  const names = gender === 'male' ? [
    {
      name: `**${lastName} Gia Bảo**`,
      meaning: `"Gia" xuất phát từ số định mệnh ${motherDestiny}, tượng trưng cho sự gắn kết gia đình, trong khi "Bảo" liên kết với số linh hồn ${motherSoul}, mang ý nghĩa quý giá và được bảo vệ${babyLifePath ? `, đồng thời bổ trợ số ${babyLifePath} của bé để tăng sự hài hòa` : ''}. Tên này mang lại cảm giác ấm áp và bền vững.`
    },
    {
      name: `**${lastName} Minh Khang**`,
      meaning: `"Minh" lấy cảm hứng từ số chủ đạo ${motherLifePath}, biểu thị trí tuệ và tầm nhìn, còn "Khang" kết nối với số định mệnh ${fatherDestiny}, tượng trưng cho sự khỏe mạnh và thịnh vượng${babyLifePath ? `, cân bằng tốt với số ${babyLifePath} của bé` : ''}. Tên này phù hợp với một bé trai năng động.`
    },
    {
      name: `**${lastName} Đức Anh**`,
      meaning: `"Đức" dựa trên số linh hồn ${fatherSoul}, thể hiện sự vị tha và phẩm chất tốt, "Anh" liên kết với số chủ đạo ${motherLifePath}, mang ý nghĩa thông minh và nổi bật${babyLifePath ? `, tạo sự kết nối với số ${babyLifePath} của bé` : ''}. Tên này gợi lên hình ảnh một cậu bé mạnh mẽ và nhân hậu.`
    }
  ] : gender === 'female' ? [
    {
      name: `**${lastName} Minh Anh**`,
      meaning: `"Minh" từ số chủ đạo ${motherLifePath}, tượng trưng cho sự sáng suốt và thông minh, "Anh" kết hợp với số linh hồn ${fatherSoul}, mang vẻ đẹp tinh tế và nổi bật${babyLifePath ? `, phù hợp với số ${babyLifePath} của bé` : ''}. Tên này nhẹ nhàng và dễ nhớ.`
    },
    {
      name: `**${lastName} Bảo Ngọc**`,
      meaning: `"Bảo" từ số linh hồn ${motherSoul}, biểu thị sự quý giá, "Ngọc" liên kết với số nhân cách ${fatherPersonality}, thể hiện sự tinh tế và thanh lịch${babyLifePath ? `, bổ trợ số ${babyLifePath} của bé` : ''}. Tên này mang năng lượng sang trọng và nữ tính.`
    },
    {
      name: `**${lastName} Gia Linh**`,
      meaning: `"Gia" từ số định mệnh ${motherDestiny}, tượng trưng cho sự gắn kết gia đình, "Linh" dựa trên số định mệnh ${fatherDestiny}, mang ý nghĩa linh hoạt và thông minh${babyLifePath ? `, hài hòa với số ${babyLifePath}` : ''}. Tên này vừa dịu dàng vừa mạnh mẽ.`
    }
  ] : [
    {
      name: `**${lastName} Minh Hân**`,
      meaning: `"Minh" từ số chủ đạo ${motherLifePath}, thể hiện trí tuệ và sáng suốt, "Hân" dựa trên số định mệnh ${motherDestiny}, mang ý nghĩa niềm vui và hạnh phúc${babyLifePath ? `, phù hợp với số ${babyLifePath} của bé` : ''}. Tên này trung tính và tràn đầy năng lượng tích cực.`
    },
    {
      name: `**${lastName} Gia Bảo**`,
      meaning: `"Gia" từ số định mệnh ${motherDestiny}, biểu thị sự gắn kết gia đình, "Bảo" liên kết với số linh hồn ${motherSoul}, mang ý nghĩa bảo vệ và quý giá${babyLifePath ? `, bổ trợ số ${babyLifePath} của bé` : ''}. Tên này phù hợp cho cả hai giới và mang cảm giác ấm áp.`
    },
    {
      name: `**${lastName} Đức Anh**`,
      meaning: `"Đức" từ số linh hồn ${fatherSoul}, tượng trưng cho phẩm chất tốt và vị tha, "Anh" dựa trên số chủ đạo ${motherLifePath}, thể hiện sự thông minh và nổi bật${babyLifePath ? `, cân bằng với số ${babyLifePath}` : ''}. Tên này mang phong cách trung tính và ý nghĩa sâu sắc.`
    }
  ];

  const tips = [
    'Cân nhắc ý nghĩa phong thủy để tăng thêm may mắn và năng lượng tích cực cho bé.',
    'Tham khảo ý kiến gia đình để chọn tên phù hợp với truyền thống và mong muốn chung.',
    'Nếu có ngày sinh bé, chọn tên hài hòa với cả năng lượng của bé và bố mẹ.'
  ];

  return { analysis, names, tips };
}

// Event handler
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest } = body;

    if (!motherName || !motherBirthdate || !fatherName || !fatherBirthdate || !gender) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc: motherName, motherBirthdate, fatherName, fatherBirthdate, gender.'
      });
    }

    const result = await getBabyName(motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest);
    return result;
  } catch (error) {
    console.error('API error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi server: ' + error.message
    });
  }
});