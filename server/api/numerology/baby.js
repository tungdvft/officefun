// server/api/numerology-baby.js
import { defineEventHandler } from 'h3';
import { callGeminiApi } from '../utils/commonApi'; // Import hàm common

// Các hàm tính số (giữ nguyên, không thay đổi)
function getLifePathNumber(birthdate) {
  const [day, month, year] = birthdate.split('/').map(Number);
  if (!day || !month || !year) return 9;
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

// Cập nhật getGeminiBabyName với babyBirthdate
async function getGeminiBabyName(motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest) {
  const motherLifePath = getLifePathNumber(motherBirthdate);
  const motherSoul = getSoulNumber(motherName);
  const motherPersonality = getPersonalityNumber(motherName);
  const motherDestiny = getDestinyNumber(motherName);
  const fatherLifePath = getLifePathNumber(fatherBirthdate);
  const fatherSoul = getSoulNumber(fatherName);
  const fatherPersonality = getPersonalityNumber(fatherName);
  const fatherDestiny = getDestinyNumber(fatherName);
  const babyLifePath = babyBirthdate ? getLifePathNumber(babyBirthdate) : null; // Thêm số chủ đạo của bé
  const currentYear = new Date().getFullYear();
  const motherCycle = (currentYear + parseInt(motherBirthdate.split('/')[0])) % 9 || 9;

  const prompt = `Dựa trên thần số học với thông tin mẹ: số chủ đạo ${motherLifePath}, số linh hồn ${motherSoul}, số nhân cách ${motherPersonality}, số định mệnh ${motherDestiny}, chu kỳ cá nhân ${motherCycle}, sinh ngày ${motherBirthdate}, tên ${motherName}; và bố: số chủ đạo ${fatherLifePath}, số linh hồn ${fatherSoul}, số nhân cách ${fatherPersonality}, số định mệnh ${fatherDestiny}, sinh ngày ${fatherBirthdate}, tên ${fatherName}; ${babyBirthdate ? `bé sinh ngày ${babyBirthdate}, số chủ đạo ${babyLifePath}` : 'bé chưa có ngày sinh'}; giới tính con: ${gender}; tháng sinh con: ${babyBirthMonth || 'chưa xác định'}; yêu cầu thêm: "${additionalRequest}". Trả về JSON hợp lệ với phần sau:
    1. "answer": Một đoạn văn dài (12-15 câu) đề xuất tên con dựa trên thần số học, giới tính ${gender}, tháng sinh ${babyBirthMonth || 'chưa xác định'}, và yêu cầu thêm "${additionalRequest}". Phân tích số chủ đạo ${motherLifePath} của mẹ (tầm nhìn, năng lượng chính) và ${fatherLifePath} của bố (mục tiêu, định hướng)${babyBirthdate ? `, kết hợp số chủ đạo ${babyLifePath} của bé (năng lượng cá nhân)` : ''}, kết hợp số linh hồn ${motherSoul} (đam mê mẹ) và ${fatherSoul} (đam mê bố) để tìm giá trị cốt lõi cho tên con. Xem xét số nhân cách ${motherPersonality} của mẹ (hình ảnh bên ngoài) và ${fatherPersonality} của bố (phong cách) để tạo tên dễ nhớ, gần gũi. Sử dụng số định mệnh ${motherDestiny} của mẹ (đường dài) và ${fatherDestiny} của bố (sứ mệnh) để đảm bảo tên mang ý nghĩa phát triển bền vững. Chu kỳ cá nhân ${motherCycle} của mẹ gợi ý năng lượng hiện tại ảnh hưởng đến tên. Nếu có ngày sinh bé ${babyBirthdate || 'chưa có'}, kết hợp số chủ đạo ${babyLifePath || 'không có'} của bé để tạo sự hài hòa giữa bố mẹ và con; nếu không, chỉ dùng số của bố mẹ. Nếu tháng sinh ${babyBirthMonth} được cung cấp, kết hợp năng lượng tháng (ví dụ: tháng 1 - khởi đầu, tháng 3 - sáng tạo, tháng 7 - nội tâm, tháng 9 - nhân ái) vào ý nghĩa tên; nếu không, bỏ qua yếu tố này. Đề xuất 3 tên con cụ thể dựa trên giới tính ${gender}, tháng sinh, và yêu cầu thêm "${additionalRequest}" (nếu có, ví dụ: tên có chữ Minh, theo họ mẹ, kết hợp họ), định dạng mỗi tên in đậm (ví dụ: **Đỗ Minh Khang**) theo sau là giải thích chi tiết lý do mỗi tên phù hợp dựa trên sự cân bằng hoặc bổ trợ các số của bố mẹ ${babyBirthdate ? 'và bé' : ''} và tháng sinh (kết nối số với ý nghĩa tên, 2-3 câu mỗi tên), mỗi tên và giải thích cách nhau bằng ký tự xuống dòng "\\n\\n". Tên phải bắt đầu bằng họ của bố (mặc định), hoặc họ mẹ nếu yêu cầu "theo họ mẹ", hoặc ghép họ bố mẹ nếu yêu cầu "kết hợp họ" (ví dụ: Đỗ Phan). Nếu "${additionalRequest}" rỗng, chọn tên mặc định bắt đầu bằng họ bố, phù hợp giới tính và tháng sinh (nếu có). Tên phải ngắn gọn, phổ biến ở Việt Nam, phù hợp với giới tính và yêu cầu. Kết thúc bằng 2-3 lời khuyên thực tế (dùng "bạn" thay vì nhắc tên/ngày sinh, như cân nhắc ý nghĩa phong thủy, hỏi ý kiến gia đình, chọn tên theo mùa sinh) để chọn tên cuối cùng, cách phần tên bằng "\\n\\n". Đảm bảo câu trả lời không có mở đầu thừa thãi, tập trung trực tiếp vào việc đặt tên con, sử dụng ngôn ngữ tự nhiên, dễ hiểu, và định dạng tên in đậm bằng **tên**.
    Đảm bảo JSON hợp lệ, không markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error);
    return getFallbackBabyName(motherLifePath, motherSoul, motherPersonality, motherDestiny, motherCycle, fatherLifePath, fatherSoul, fatherPersonality, fatherDestiny, babyLifePath, gender, babyBirthMonth, additionalRequest);
  }
}

// Cập nhật getFallbackBabyName với babyLifePath
function getFallbackBabyName(motherLifePath, motherSoul, motherPersonality, motherDestiny, motherCycle, fatherLifePath, fatherSoul, fatherPersonality, fatherDestiny, babyLifePath, gender, babyBirthMonth, additionalRequest) {
  const motherLastName = motherName.split(' ')[0];
  const fatherLastName = fatherName.split(' ')[0];
  const combinedLastName = `${fatherLastName} ${motherLastName}`;

  let answer = `Dựa trên phân tích thần số học của bố mẹ${babyLifePath ? ' và bé' : ''}, việc đặt tên cho con cần cân bằng giữa tầm nhìn của mẹ (số chủ đạo ${motherLifePath}) và mục tiêu của bố (số chủ đạo ${fatherLifePath})${babyLifePath ? `, kết hợp năng lượng cá nhân của bé (số chủ đạo ${babyLifePath})` : ''}, đồng thời thể hiện đam mê cá nhân của cả hai (số linh hồn ${motherSoul} và ${fatherSoul}). Hình ảnh bên ngoài của mẹ (số nhân cách ${motherPersonality}) và phong cách của bố (số nhân cách ${fatherPersonality}) gợi ý một cái tên dễ gần, dễ nhớ. Đường dài của mẹ (số định mệnh ${motherDestiny}) và sứ mệnh của bố (số định mệnh ${fatherDestiny}) cần được phản ánh trong ý nghĩa phát triển bền vững của tên. Chu kỳ cá nhân ${motherCycle} của mẹ cho thấy năng lượng hiện tại ảnh hưởng đến tên. Tháng sinh của con là ${babyBirthMonth || 'chưa xác định'}, ảnh hưởng đến năng lượng của tên (nếu có).${babyLifePath ? ` Số chủ đạo ${babyLifePath} của bé được kết hợp để tạo sự hài hòa gia đình.` : ''}`;

  if (gender === 'male') {
    answer += ` Với giới tính bé trai, tháng sinh ${babyBirthMonth || 'chưa xác định'}, và yêu cầu "${additionalRequest || 'không có'}", tôi đề xuất ba cái tên sau:\n\n` +
      `**${fatherLastName} Gia Bảo**: "Gia" phản ánh số định mệnh ${motherDestiny} (gia đình), "Bảo" mang ý nghĩa quý giá từ số linh hồn ${motherSoul}${babyLifePath ? `, hợp với số ${babyLifePath} của bé` : ''}, phù hợp với tháng ${babyBirthMonth || 3}.\n\n` +
      `**${fatherLastName} Minh Khang**: "Minh" từ số chủ đạo ${motherLifePath} (trí tuệ), "Khang" thể hiện sự an khang từ số định mệnh ${fatherDestiny}${babyLifePath ? `, bổ trợ số ${babyLifePath} của bé` : ''}, phù hợp với tháng ${babyBirthMonth || 7}.\n\n` +
      `**${fatherLastName} Đức Anh**: "Đức" từ số linh hồn ${fatherSoul} (vị tha), "Anh" mang ý nghĩa thông minh từ số chủ đạo ${motherLifePath}${babyLifePath ? `, cân bằng với số ${babyLifePath}` : ''}, phù hợp với tháng ${babyBirthMonth || 9}.\n\n`;
  } else if (gender === 'female') {
    answer += ` Với giới tính bé gái, tháng sinh ${babyBirthMonth || 'chưa xác định'}, và yêu cầu "${additionalRequest || 'không có'}", tôi đề xuất ba cái tên sau:\n\n` +
      `**${fatherLastName} Minh Anh**: "Minh" từ số chủ đạo ${motherLifePath} (tầm nhìn), "Anh" mang vẻ đẹp từ số linh hồn ${fatherSoul}${babyLifePath ? `, hợp với số ${babyLifePath} của bé` : ''}, phù hợp với tháng ${babyBirthMonth || 1}.\n\n` +
      `**${fatherLastName} Bảo Ngọc**: "Bảo" từ số linh hồn ${motherSoul} (đam mê), "Ngọc" thể hiện sự tinh tế từ số nhân cách ${fatherPersonality}${babyLifePath ? `, bổ trợ số ${babyLifePath}` : ''}, phù hợp với tháng ${babyBirthMonth || 3}.\n\n` +
      `**${fatherLastName} Gia Linh**: "Gia" từ số định mệnh ${motherDestiny} (gia đình), "Linh" mang sự linh hoạt từ số định mệnh ${fatherDestiny}${babyLifePath ? `, cân bằng với số ${babyLifePath}` : ''}, phù hợp với tháng ${babyBirthMonth || 5}.\n\n`;
  } else {
    answer += ` Với giới tính trung tính, tháng sinh ${babyBirthMonth || 'chưa xác định'}, và yêu cầu "${additionalRequest || 'không có'}", tôi đề xuất ba cái tên sau:\n\n` +
      `**${fatherLastName} Minh Hân**: "Minh" từ số chủ đạo ${motherLifePath} (trí tuệ), "Hân" mang niềm vui từ số định mệnh ${motherDestiny}${babyLifePath ? `, hợp với số ${babyLifePath} của bé` : ''}, phù hợp với tháng ${babyBirthMonth || 7}.\n\n` +
      `**${fatherLastName} Gia Bảo**: "Gia" từ số định mệnh ${motherDestiny} (gia đình), "Bảo" từ số linh hồn ${motherSoul}${babyLifePath ? `, bổ trợ số ${babyLifePath}` : ''}, phù hợp với tháng ${babyBirthMonth || 3}.\n\n` +
      `**${fatherLastName} Đức Anh**: "Đức" từ số linh hồn ${fatherSoul} (vị tha), "Anh" từ số chủ đạo ${motherLifePath}${babyLifePath ? `, cân bằng với số ${babyLifePath}` : ''}, phù hợp với tháng ${babyBirthMonth || 9}.\n\n`;
  }

  answer += `\n\nBạn nên cân nhắc thêm ý nghĩa phong thủy của tên để đảm bảo sự may mắn. Hãy hỏi ý kiến gia đình để chọn tên phù hợp nhất. Nếu có ngày sinh bé, hãy chọn tên hài hòa với cả năng lượng của bé và bố mẹ.`;

  return { answer };
}

// Cập nhật handler để nhận babyBirthdate
export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  const { motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest } = await readBody(event);

  if (!motherName || !motherBirthdate || !fatherName || !fatherBirthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: motherName, motherBirthdate, fatherName, fatherBirthdate, và gender là bắt buộc.',
    });
  }

  const babyName = await getGeminiBabyName(motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest);
  return babyName;
});