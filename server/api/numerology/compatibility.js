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

  const prompt = `Dựa trên thần số học với thông tin: Người 1 (tên "${person1Name}", sinh ${person1Birthdate}, số chủ đạo ${person1LifePath}, số linh hồn ${person1Soul}, số định mệnh ${person1Destiny}) và Người 2 (tên "${person2Name}", sinh ${person2Birthdate}, số chủ đạo ${person2LifePath}, số linh hồn ${person2Soul}, số định mệnh ${person2Destiny}). Kiểm tra mức độ hợp nhau trong mối quan hệ "${relationshipType === 'lover' ? 'người yêu' : relationshipType === 'friend' ? 'bạn bè' : 'đối tác'}". Trả về JSON hợp lệ với:
    1. "answer": Chuỗi văn bản phân tích dài (10-12 câu) về mức độ hợp nhau dựa trên số chủ đạo (Life Path), số linh hồn (Soul), và số định mệnh (Destiny) của hai người. Tập trung vào điểm mạnh, điểm yếu, và tiềm năng trong mối quan hệ "${relationshipType}". Đưa ra phần trăm hợp nhau (0-100%) dựa trên sự tương thích của các con số. Kết thúc bằng lời khuyên ngắn (2-3 câu) để cải thiện mối quan hệ.
    Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.answer) {
      throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    }
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackResponse(person1Name, person1LifePath, person1Soul, person1Destiny, person2Name, person2LifePath, person2Soul, person2Destiny, relationshipType);
  }
});

function getFallbackResponse(person1Name, person1LifePath, person1Soul, person1Destiny, person2Name, person2LifePath, person2Soul, person2Destiny, relationshipType) {
  const compatibilityScore = Math.min(
    90,
    50 + Math.abs(person1LifePath - person2LifePath) * 5 + Math.abs(person1Soul - person2Soul) * 3 + Math.abs(person1Destiny - person2Destiny) * 2
  );

  const typeText = relationshipType === 'lover' ? 'người yêu' : relationshipType === 'friend' ? 'bạn bè' : 'đối tác';
  const answer = `Dựa trên thần số học, mức độ hợp nhau giữa "${person1Name}" (số chủ đạo ${person1LifePath}, số linh hồn ${person1Soul}, số định mệnh ${person1Destiny}) và "${person2Name}" (số chủ đạo ${person2LifePath}, số linh hồn ${person2Soul}, số định mệnh ${person2Destiny}) trong mối quan hệ ${typeText} được phân tích như sau. Số chủ đạo ${person1LifePath} của "${person1Name}" mang năng lượng ${person1LifePath > 5 ? 'sáng tạo' : 'ổn định'}, trong khi số ${person2LifePath} của "${person2Name}" thể hiện ${person2LifePath > 5 ? 'động lực' : 'kiên nhẫn'}, tạo nên sự bổ trợ trong ${typeText === 'người yêu' ? 'tình cảm' : typeText === 'bạn bè' ? 'giao tiếp' : 'công việc'}. Số linh hồn ${person1Soul} và ${person2Soul} cho thấy đam mê bên trong của hai người, với mức độ tương thích ${Math.abs(person1Soul - person2Soul) < 3 ? 'cao' : 'trung bình'}, ảnh hưởng đến sự thấu hiểu lẫn nhau. Số định mệnh ${person1Destiny} và ${person2Destiny} định hướng mục tiêu dài hạn, với sự khác biệt ${Math.abs(person1Destiny - person2Destiny) < 3 ? 'nhỏ' : 'đáng kể'}, có thể là điểm mạnh hoặc thách thức. Điểm mạnh của mối quan hệ này là ${typeText === 'người yêu' ? 'sự gắn kết tình cảm' : typeText === 'bạn bè' ? 'sự hỗ trợ lẫn nhau' : 'khả năng phối hợp'}. Điểm yếu có thể nằm ở ${Math.abs(person1LifePath - person2LifePath) > 3 ? 'tốc độ khác nhau' : 'sự khác biệt nhỏ trong quan điểm'}. T潜 năng phát triển mối quan hệ phụ thuộc vào cách hai người tận dụng năng lượng của mình. Mức độ hợp nhau ước tính đạt ${compatibilityScore}%. Để cải thiện mối quan hệ ${typeText}, hãy chú ý giao tiếp cởi mở và tôn trọng sự khác biệt của nhau.`;

  return { answer };
}