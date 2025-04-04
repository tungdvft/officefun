import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getLifePathNumber(birthdate) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthdate)) return 9;
  const normalizedBirthdate = birthdate.replace(/-/g, '/');
  const [day, month, year] = normalizedBirthdate.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) return 9;
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
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

  const lifePath1Data = NUMEROLOGY_MEANINGS.lifePath[person1LifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const soul1Data = NUMEROLOGY_MEANINGS.soulUrge[person1Soul] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const destiny1Data = NUMEROLOGY_MEANINGS.destiny?.[person1Destiny] || NUMEROLOGY_MEANINGS.destiny?.[1] || { theme: "Không xác định", strengths: ["Không xác định"] };
  const lifePath2Data = NUMEROLOGY_MEANINGS.lifePath[person2LifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const soul2Data = NUMEROLOGY_MEANINGS.soulUrge[person2Soul] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const destiny2Data = NUMEROLOGY_MEANINGS.destiny?.[person2Destiny] || NUMEROLOGY_MEANINGS.destiny?.[1] || { theme: "Không xác định", strengths: ["Không xác định"] };

  console.log('Numerology data:', { 
    person1: { lifePath: person1LifePath, soul: person1Soul, destiny: person1Destiny, lifePath1Data, soul1Data, destiny1Data }, 
    person2: { lifePath: person2LifePath, soul: person2Soul, destiny: person2Destiny, lifePath2Data, soul2Data, destiny2Data } 
  });

  const typeText = relationshipType === 'lover' ? 'người yêu' : relationshipType === 'spouse' ? 'vợ chồng' : relationshipType === 'friend' ? 'bạn bè' : 'đối tác';
  const prompt = `Dựa trên thần số học với thông tin: 
    - Người 1 (tên "${person1Name}", sinh ${person1Birthdate}, số chủ đạo ${person1LifePath} - ${lifePath1Data.theme || 'Không xác định'}, số linh hồn ${person1Soul} - ${soul1Data.theme || 'Không xác định'}, số định mệnh ${person1Destiny} - ${destiny1Data.theme || 'Không xác định'})
    - Người 2 (tên "${person2Name}", sinh ${person2Birthdate}, số chủ đạo ${person2LifePath} - ${lifePath2Data.theme || 'Không xác định'}, số linh hồn ${person2Soul} - ${soul2Data.theme || 'Không xác định'}, số định mệnh ${person2Destiny} - ${destiny2Data.theme || 'Không xác định'})
    Kiểm tra mức độ hợp nhau trong mối quan hệ "${typeText}". Trả về JSON hợp lệ với các trường sau:
    1. "overview": Tổng quan (4-5 câu) so sánh trực tiếp năng lượng (${lifePath1Data.theme || 'Không xác định'} vs ${lifePath2Data.theme || 'Không xác định'}), cảm xúc (${soul1Data.theme || 'Không xác định'} vs ${soul2Data.theme || 'Không xác định'}), mục tiêu (${destiny1Data.theme || 'Không xác định'} vs ${destiny2Data.theme || 'Không xác định'}) của hai người.
    2. "strengths": Điểm mạnh (3-4 câu) so sánh trực tiếp sự tương đồng hoặc bổ trợ giữa hai người dựa trên các con số.
    3. "weaknesses": Điểm yếu (3-4 câu) so sánh trực tiếp các khác biệt tiềm ẩn giữa hai người.
    4. "potential": Tiềm năng (3-4 câu) so sánh trực tiếp khả năng phát triển của hai người trong "${typeText}".
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
    return getFallbackResponse(
      person1Name, person1LifePath, person1Soul, person1Destiny, lifePath1Data, soul1Data, destiny1Data,
      person2Name, person2LifePath, person2Soul, person2Destiny, lifePath2Data, soul2Data, destiny2Data,
      relationshipType
    );
  }
});

function getFallbackResponse(person1Name, person1LifePath, person1Soul, person1Destiny, lifePath1Data, soul1Data, destiny1Data, 
                            person2Name, person2LifePath, person2Soul, person2Destiny, lifePath2Data, soul2Data, destiny2Data, relationshipType) {
  const typeText = relationshipType === 'lover' ? 'người yêu' : relationshipType === 'spouse' ? 'vợ chồng' : relationshipType === 'friend' ? 'bạn bè' : 'đối tác';
  const lifePathDiff = Math.abs(person1LifePath - person2LifePath);
  const soulDiff = Math.abs(person1Soul - person2Soul);
  const destinyDiff = Math.abs(person1Destiny - person2Destiny);
  const compatibilityScore = Math.max(4, 10 - Math.floor((lifePathDiff + soulDiff + destinyDiff) / 3));

  const overview = `"${person1Name}" mang số chủ đạo ${person1LifePath} (${(lifePath1Data.theme || 'Không xác định').toLowerCase()}), thể hiện năng lượng ${(lifePath1Data.strengths?.[0] || 'sáng tạo').toLowerCase()}, trong khi "${person2Name}" với số ${person2LifePath} (${(lifePath2Data.theme || 'Không xác định').toLowerCase()}) lại nổi bật với ${(lifePath2Data.strengths?.[0] || 'ổn định').toLowerCase()}. Về cảm xúc, số linh hồn ${person1Soul} (${(soul1Data.theme || 'Không xác định').toLowerCase()}) của "${person1Name}" hướng đến ${(soul1Data.desires?.[0] || 'sự khám phá').toLowerCase()}, còn "${person2Name}" với số ${person2Soul} (${(soul2Data.theme || 'Không xác định').toLowerCase()}) nghiêng về ${(soul2Data.desires?.[0] || 'sự ổn định').toLowerCase()}. Số định mệnh ${person1Destiny} (${(destiny1Data.theme || 'Không xác định').toLowerCase()}) của "${person1Name}" tập trung vào ${(destiny1Data.strengths?.[0] || 'tham vọng').toLowerCase()}, trong khi "${person2Name}" với số ${person2Destiny} (${(destiny2Data.theme || 'Không xác định').toLowerCase()}) hướng tới ${(destiny2Data.strengths?.[0] || 'sự bền vững').toLowerCase()}. Sự kết hợp này tạo nên một mối quan hệ ${typeText} đầy màu sắc và tiềm năng.`;

  const strengths = `"${person1Name}" và "${person2Name}" có sự tương đồng qua số chủ đạo ${person1LifePath} (${(lifePath1Data.theme || 'Không xác định').toLowerCase()}) và ${person2LifePath} (${(lifePath2Data.theme || 'Không xác định').toLowerCase()}), giúp cả hai dễ dàng hiểu nhau ở ${(lifePath1Data.strengths?.[1] || 'mục tiêu lớn').toLowerCase()}. Số linh hồn ${person1Soul} (${(soul1Data.theme || 'Không xác định').toLowerCase()}) của "${person1Name}" bổ trợ cho số ${person2Soul} (${(soul2Data.theme || 'Không xác định').toLowerCase()}) của "${person2Name}", tạo sự cân bằng giữa ${(soul1Data.desires?.[0] || 'sự khám phá').toLowerCase()} và ${(soul2Data.desires?.[0] || 'sự ổn định').toLowerCase()}. Số định mệnh ${person1Destiny} và ${person2Destiny} mang đến sự hỗ trợ qua ${(destiny1Data.strengths?.[0] || 'tham vọng').toLowerCase()} của "${person1Name}" và ${(destiny2Data.strengths?.[0] || 'sự bền vững').toLowerCase()} của "${person2Name}".`;

  const weaknesses = `"${person1Name}" với số linh hồn ${person1Soul} (${(soul1Data.theme || 'Không xác định').toLowerCase()}) có xu hướng ${(soul1Data.challenges?.[0] || 'giữ cảm xúc').toLowerCase()}, trong khi "${person2Name}" với số ${person2Soul} (${(soul2Data.theme || 'Không xác định').toLowerCase()}) lại ${(soul2Data.challenges?.[0] || 'hướng nội').toLowerCase()}, dễ gây khoảng cách trong giao tiếp. Số định mệnh ${person1Destiny} (${(destiny1Data.theme || 'Không xác định').toLowerCase()}) của "${person1Name}" tập trung vào ${(destiny1Data.strengths?.[0] || 'tham vọng').toLowerCase()}, còn "${person2Name}" với số ${person2Destiny} (${(destiny2Data.theme || 'Không xác định').toLowerCase()}) hướng tới ${(destiny2Data.strengths?.[0] || 'sự bền vững').toLowerCase()}, có thể khác biệt về ưu tiên. Những điểm này cần được chú ý để tránh bất đồng.`;

  const potential = `Trong vai trò ${typeText}, "${person1Name}" với số chủ đạo ${person1LifePath} (${(lifePath1Data.theme || 'Không xác định').toLowerCase()}) và "${person2Name}" với số ${person2LifePath} (${(lifePath2Data.theme || 'Không xác định').toLowerCase()}) có thể cùng phát triển qua ${(lifePath1Data.strengths?.[0] || 'sáng tạo').toLowerCase()} và ${(lifePath2Data.strengths?.[0] || 'ổn định').toLowerCase()}. Số linh hồn ${person1Soul} và ${person2Soul} tạo cơ hội bổ sung giữa ${(soul1Data.desires?.[0] || 'sự khám phá').toLowerCase()} của "${person1Name}" và ${(soul2Data.desires?.[0] || 'sự ổn định').toLowerCase()} của "${person2Name}". Số định mệnh ${person1Destiny} và ${person2Destiny} cho thấy tiềm năng lớn nếu kết hợp ${(destiny1Data.strengths?.[0] || 'tham vọng').toLowerCase()} và ${(destiny2Data.strengths?.[0] || 'sự bền vững').toLowerCase()}.`;

  const challenges = `"${person1Name}" với số linh hồn ${person1Soul} (${(soul1Data.theme || 'Không xác định').toLowerCase()}) và "${person2Name}" với số ${person2Soul} (${(soul2Data.theme || 'Không xác định').toLowerCase()}) khác nhau ở ${(soul1Data.challenges?.[0] || 'giữ cảm xúc').toLowerCase()} và ${(soul2Data.challenges?.[0] || 'hướng nội').toLowerCase()}, cần chú ý để tránh hiểu lầm. Số định mệnh ${person1Destiny} (${(destiny1Data.theme || 'Không xác định').toLowerCase()}) và ${person2Destiny} (${(destiny2Data.theme || 'Không xác định').toLowerCase()}) có thể không đồng bộ giữa ${(destiny1Data.strengths?.[0] || 'tham vọng').toLowerCase()} của "${person1Name}" và ${(destiny2Data.strengths?.[0] || 'sự bền vững').toLowerCase()} của "${person2Name}". Thách thức nằm ở việc tìm điểm chung trong mục tiêu dài hạn.`;

  const compatibility = `Mức độ hợp nhau: ${compatibilityScore}/10. Sự tương thích này dựa trên mức độ đồng điệu giữa ${(lifePath1Data.theme || 'Không xác định').toLowerCase()} và ${(lifePath2Data.theme || 'Không xác định').toLowerCase()}, cùng khả năng bổ trợ từ ${(soul1Data.theme || 'Không xác định').toLowerCase()} và ${(soul2Data.theme || 'Không xác định').toLowerCase()}.`;

  const advice = `Để mối quan hệ ${typeText} giữa "${person1Name}" và "${person2Name}" phát triển, việc chia sẻ suy nghĩ về ${(soul1Data.desires?.[0] || 'sự khám phá').toLowerCase()} và ${(soul2Data.desires?.[0] || 'sự ổn định').toLowerCase()} sẽ mang lại sự gần gũi. Các hoạt động như ${typeText === 'lover' ? 'cùng khám phá điều mới' : typeText === 'spouse' ? 'xây dựng kế hoạch chung' : typeText === 'friend' ? 'trò chuyện sâu sắc' : 'hợp tác trong công việc'} có thể tăng thêm sự kết nối. Sự thấu hiểu sẽ tự nhiên hình thành khi cả hai trân trọng ${(lifePath1Data.strengths?.[0] || 'sáng tạo').toLowerCase()} và ${(lifePath2Data.strengths?.[0] || 'ổn định').toLowerCase()}. Một chút linh hoạt sẽ giúp mọi thứ hài hòa hơn.`;

  return { overview, strengths, weaknesses, potential, challenges, compatibility, advice };
}