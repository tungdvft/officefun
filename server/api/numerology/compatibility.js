// server/api/numerology/compatibility.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

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

function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

export default defineEventHandler(async (event) => {
  const { person1Name, person1Birthdate, person2Name, person2Birthdate, relationshipType } = await readBody(event);

  if (!person1Name || !person1Birthdate || !person2Name || !person2Birthdate || !relationshipType) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: person1Name, person1Birthdate, person2Name, person2Birthdate, relationshipType là bắt buộc.'
    });
  }

  const person1LifePath = getLifePathNumber(person1Birthdate);
  const person1Soul = getSoulNumber(person1Name);
  const person1Destiny = getDestinyNumber(person1Name);
  const person2LifePath = getLifePathNumber(person2Birthdate);
  const person2Soul = getSoulNumber(person2Name);
  const person2Destiny = getDestinyNumber(person2Name);

  const prompt = `Dựa trên thần số học với thông tin: Người 1 (tên "${person1Name}", sinh ${person1Birthdate}, số chủ đạo ${person1LifePath}, số linh hồn ${person1Soul}, số định mệnh ${person1Destiny}) và Người 2 (tên "${person2Name}", sinh ${person2Birthdate}, số chủ đạo ${person2LifePath}, số linh hồn ${person2Soul}, số định mệnh ${person2Destiny}). Kiểm tra mức độ hợp nhau trong mối quan hệ "${relationshipType === 'lover' ? 'người yêu' : relationshipType === 'spouse' ? 'vợ chồng' : relationshipType === 'friend' ? 'bạn bè' : 'đối tác'}". Trả về JSON hợp lệ với các trường sau:
    1. "overview": Tổng quan (4-5 câu) so sánh trực tiếp năng lượng, cảm xúc, mục tiêu của hai người dựa trên các con số.
    2. "strengths": Điểm mạnh (3-4 câu) so sánh trực tiếp sự tương đồng hoặc bổ trợ giữa hai người.
    3. "weaknesses": Điểm yếu (3-4 câu) so sánh trực tiếp các khác biệt tiềm ẩn giữa hai người.
    4. "potential": Tiềm năng (3-4 câu) so sánh trực tiếp khả năng phát triển của hai người trong "${relationshipType}".
    5. "challenges": Thách thức (3-4 câu) so sánh trực tiếp các khó khăn giữa hai người cần chú ý.
    6. "compatibility": Mức độ hợp nhau trên thang điểm 10 (ví dụ: "Mức độ hợp nhau: 8/10"), kèm 1-2 câu giải thích.
    7. "advice": Gợi ý tự nhiên (4-5 câu) để phát triển mối quan hệ, tránh dùng "nên" hoặc giọng chủ quan.
    Giọng điệu tự nhiên, khách quan, nhấn mạnh so sánh trực tiếp giữa hai người, tránh "tôi đánh giá" hoặc "họ nên". Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.overview || !data.compatibility) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackResponse(person1Name, person1LifePath, person1Soul, person1Destiny, person2Name, person2LifePath, person2Soul, person2Destiny, relationshipType);
  }
});

function getFallbackResponse(person1Name, person1LifePath, person1Soul, person1Destiny, person2Name, person2LifePath, person2Soul, person2Destiny, relationshipType) {
  const typeText = relationshipType === 'lover' ? 'người yêu' : relationshipType === 'spouse' ? 'vợ chồng' : relationshipType === 'friend' ? 'bạn bè' : 'đối tác';
  const lifePathDiff = Math.abs(person1LifePath - person2LifePath);
  const soulDiff = Math.abs(person1Soul - person2Soul);
  const destinyDiff = Math.abs(person1Destiny - person2Destiny);
  const compatibilityScore = Math.max(4, 10 - Math.floor((lifePathDiff + soulDiff + destinyDiff) / 3));

  const overview = `"${person1Name}" mang số chủ đạo ${person1LifePath}, thể hiện năng lượng ${person1LifePath > 5 ? 'sáng tạo và linh hoạt' : 'ổn định và thực tế'}, trong khi "${person2Name}" cũng có số chủ đạo ${person2LifePath}, cho thấy sự tương đồng về cách tiếp cận cuộc sống. Về cảm xúc, số linh hồn ${person1Soul} của "${person1Name}" hướng đến ${person1Soul < 5 ? 'sự ổn định nội tại' : 'sự khám phá'}, còn số linh hồn ${person2Soul} của "${person2Name}" lại nghiêng về ${person2Soul < 5 ? 'sự hướng nội' : 'sự độc lập'}. Số định mệnh ${person1Destiny} của "${person1Name}" tập trung vào ${person1Destiny < 5 ? 'sự thực dụng' : 'tham vọng lớn'}, trong khi "${person2Name}" với số ${person2Destiny} hướng tới ${person2Destiny < 5 ? 'sự bền vững' : 'phát triển sâu sắc'}. Sự kết hợp này tạo ra một mối quan hệ ${typeText} vừa đồng điệu vừa có những khác biệt cần dung hòa.`;

  const strengths = `"${person1Name}" và "${person2Name}" có sự tương đồng lớn ở số chủ đạo ${person1LifePath} và ${person2LifePath}, giúp cả hai dễ dàng tìm thấy điểm chung trong cách sống và mục tiêu lớn. Số linh hồn ${person1Soul} của "${person1Name}" bổ trợ cho số ${person2Soul} của "${person2Name}" ở chỗ một bên mang chiều sâu cảm xúc, bên còn lại mang tính độc lập. Số định mệnh ${person1Destiny} của "${person1Name}" và ${person2Destiny} của "${person2Name}" tạo nên sự cân bằng giữa tầm nhìn dài hạn và thực tế. Sự hỗ trợ lẫn nhau này là nền tảng vững chắc cho mối quan hệ ${typeText}.`;

  const weaknesses = `"${person1Name}" với số linh hồn ${person1Soul} có xu hướng ${person1Soul < 5 ? 'giữ cảm xúc trong lòng' : 'thể hiện rõ ràng'}, trong khi "${person2Name}" với số ${person2Soul} lại ${person2Soul < 5 ? 'hướng nội hơn' : 'quyết đoán hơn'}, dễ dẫn đến sự khác biệt trong giao tiếp cảm xúc. Số định mệnh ${person1Destiny} của "${person1Name}" thiên về ${person1Destiny < 5 ? 'sự ổn định' : 'tầm nhìn lớn'}, còn "${person2Name}" với số ${person2Destiny} tập trung vào ${person2Destiny < 5 ? 'sự thực tế' : 'sự phát triển sâu'}, có thể gây ra bất đồng về ưu tiên. Dù số chủ đạo ${person1LifePath} và ${person2LifePath} tương đồng, nhịp sống đôi lúc vẫn không hoàn toàn đồng bộ. Những khác biệt này cần được chú ý để tránh hiểu lầm.`;

  const potential = `Trong vai trò ${typeText}, "${person1Name}" với số chủ đạo ${person1LifePath} và "${person2Name}" với số ${person2LifePath} có thể cùng nhau xây dựng một mối quan hệ bền vững nhờ sự đồng điệu về năng lượng. Số linh hồn ${person1Soul} của "${person1Name}" và ${person2Soul} của "${person2Name}" mang đến cơ hội bổ sung lẫn nhau, tạo nên sự phong phú trong cảm xúc. Số định mệnh ${person1Destiny} và ${person2Destiny} cho phép "${person1Name}" và "${person2Name}" hỗ trợ nhau trong việc đạt được mục tiêu dài hạn. Tiềm năng này rất lớn nếu cả hai biết tận dụng sự khác biệt để phát triển.`;

  const challenges = `"${person1Name}" với số linh hồn ${person1Soul} và "${person2Name}" với số ${person2Soul} có cách thể hiện cảm xúc khác nhau, dễ gây ra khoảng cách nếu không được giải quyết. Số định mệnh ${person1Destiny} của "${person1Name}" và ${person2Destiny} của "${person2Name}" phản ánh mục tiêu sống không hoàn toàn trùng khớp, đòi hỏi sự thỏa hiệp. Dù số chủ đạo ${person1LifePath} và ${person2LifePath} giống nhau, "${person1Name}" và "${person2Name}" vẫn cần điều chỉnh để đồng điệu trong những chi tiết nhỏ. Thách thức nằm ở việc dung hòa những khác biệt này trong mối quan hệ ${typeText}.`;

  const compatibility = `Mức độ hợp nhau: ${compatibilityScore}/10. Sự tương thích này phản ánh một mối quan hệ ${compatibilityScore >= 8 ? 'rất hài hòa với tiềm năng lớn' : compatibilityScore >= 6 ? 'ổn định và đầy triển vọng với chút điều chỉnh' : 'có thể phát triển khi vượt qua khác biệt'}.`;

  const advice = `Để mối quan hệ ${typeText} giữa "${person1Name}" và "${person2Name}" tiến xa, việc trò chuyện cởi mở về cảm xúc và mong muốn là điều rất tự nhiên. Các hoạt động chung như ${typeText === 'lover' ? 'du lịch cùng nhau' : typeText === 'spouse' ? 'xây dựng kế hoạch gia đình' : typeText === 'friend' ? 'chia sẻ sở thích' : 'lập kế hoạch công việc'} có thể tăng thêm sự gần gũi. Sự thấu hiểu sẽ dần hình thành khi cả hai trân trọng những điểm mạnh và yếu của nhau. Một chút linh hoạt trong cách tiếp cận sẽ giúp mọi thứ cân bằng hơn.`;

  return { overview, strengths, weaknesses, potential, challenges, compatibility, advice };
}