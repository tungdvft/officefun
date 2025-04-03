// server/api/numerology/brand.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

// Hàm tính số (giữ nguyên)
function getLifePathNumber(date) {
  const [day, month, year] = date.split('/').map(Number);
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
  const { industry, date, ownerName, extraRequest, gender } = await readBody(event);

  if (!industry || !date || !ownerName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: industry, date và ownerName là bắt buộc.',
    });
  }

  const lifePathNumber = getLifePathNumber(date);
  const soulNumber = getSoulNumber(ownerName);
  const destinyNumber = getDestinyNumber(ownerName);

  const prompt = `Dựa trên thần số học với số chủ đạo ${lifePathNumber} (từ ngày ${date}), số linh hồn ${soulNumber} và số định mệnh ${destinyNumber} (từ tên chủ "${ownerName}"), ngành nghề "${industry}", yêu cầu bổ sung "${extraRequest || 'Không có'}", giới tính "${gender}". Trả về JSON hợp lệ với phần "numerology" chứa các trường sau:
    1. "lifePath": số chủ đạo, "lifePathDesc": mô tả ngắn gọn (1-2 câu).
    2. "soul": số linh hồn của chủ, "soulDesc": mô tả ngắn gọn (1-2 câu).
    3. "destiny": số định mệnh của chủ, "destinyDesc": mô tả ngắn gọn (1-2 câu).
    4. "generalAnalysis": Phân tích tổng quan (10-15 câu) về năng lượng của các con số (lifePath, soul, destiny) kết hợp với ngành nghề và yêu cầu bổ sung, tập trung vào tiềm năng và thách thức của thương hiệu.
    5. "suggestions": Mảng 3-5 gợi ý tên thương hiệu, mỗi gợi ý có các trường: 
       - "name" (tên phù hợp ngành nghề và yêu cầu bổ sung),
       - "soul" (số linh hồn của tên),
       - "destiny" (số định mệnh của tên),
       - "desc" (mô tả ngắn 2-3 câu về ý nghĩa tên),
       - "logoSuggestion" (mô tả logo chi tiết 1-2 câu: hình dạng cụ thể, màu sắc phù hợp với số học và ngành nghề, phong cách nổi bật, ví dụ: "Logo hình tam giác vàng kim với chữ cái đầu cách điệu trên nền gradient tím, phong cách sang trọng"). 
       Tên phải hài hòa với năng lượng của chủ và phù hợp với ngành "${industry}".
    6. "brandAdvice": Lời khuyên (3-5 câu) để phát triển thương hiệu dựa trên các con số và ngành nghề.
    Không thêm thông tin nào khác ngoài các trường trên. Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.numerology) throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error);
    return getFallbackResponse(lifePathNumber, soulNumber, destinyNumber, industry, extraRequest);
  }
});

function getFallbackResponse(lifePathNumber, soulNumber, destinyNumber, industry, extraRequest) {
  const numerology = {
    lifePath: lifePathNumber,
    lifePathDesc: `Mang năng lượng của số ${lifePathNumber}, định hình hướng đi của thương hiệu.`,
    soul: soulNumber,
    soulDesc: `Thể hiện khát vọng bên trong của chủ với số ${soulNumber}.`,
    destiny: destinyNumber,
    destinyDesc: `Hướng tới số phận được định sẵn với số ${destinyNumber}.`,
    generalAnalysis: `Với số chủ đạo ${lifePathNumber}, số linh hồn ${soulNumber} và số định mệnh ${destinyNumber} từ tên chủ, cùng ngành nghề "${industry}", thương hiệu của bạn mang năng lượng mạnh mẽ và đầy tiềm năng. Số ${lifePathNumber} thúc đẩy sự lý tưởng và sáng tạo, phù hợp với ngành "${industry}". Số linh hồn ${soulNumber} cho thấy khát vọng cá nhân của chủ, ảnh hưởng đến tầm nhìn thương hiệu. Số định mệnh ${destinyNumber} định hình khả năng đạt được thành công lớn nếu bạn kiên trì. Yêu cầu bổ sung "${extraRequest || 'Không có'}" được cân nhắc để tạo ra tên phù hợp. Đây là cơ hội để xây dựng một thương hiệu độc đáo, phản ánh cả năng lượng của bạn và ngành nghề. Thách thức nằm ở việc cân bằng giữa cảm hứng cá nhân và nhu cầu thị trường. Năng lượng tổng thể hỗ trợ các chiến lược dài hạn và sáng tạo. Bạn có thể gặp khó khăn ban đầu trong việc định vị, nhưng tiềm năng phát triển là rất lớn. Cuối cùng, sự kết hợp này mang lại sức mạnh để thương hiệu của bạn nổi bật trong "${industry}".`,
    suggestions: [
      {
        name: extraRequest?.includes('hot') ? 'HotTrend' : 'NovaPeak',
        soul: 3,
        destiny: 7,
        desc: `Tên này mang năng lượng sáng tạo (số linh hồn 3) và sự sâu sắc (số định mệnh 7), phù hợp với ngành "${industry}" và hài hòa với năng lượng của chủ.`,
        logoSuggestion: `Logo hình tròn màu cam rực rỡ với số 3 cách điệu ở giữa, kết hợp đường sóng nhỏ màu tím xung quanh, phong cách hiện đại và năng động.`
      },
      {
        name: extraRequest?.includes('hot') ? 'HotVibe' : 'LuxeCore',
        soul: 5,
        destiny: 9,
        desc: `Tên này kết hợp sự tự do (số linh hồn 5) và lý tưởng (số định mệnh 9), lý tưởng cho một thương hiệu năng động trong "${industry}".`,
        logoSuggestion: `Logo hình lục giác gradient đỏ-cam, chữ cái đầu lớn màu trắng với ngôi sao nhỏ phía trên, phong cách táo bạo và nổi bật.`
      },
      {
        name: extraRequest?.includes('hot') ? 'HotEdge' : 'PrimeZap',
        soul: 1,
        destiny: 4,
        desc: `Tên này thể hiện sự tiên phong (số linh hồn 1) và sự ổn định (số định mệnh 4), phù hợp với một thương hiệu bền vững trong "${industry}".`,
        logoSuggestion: `Logo hình tam giác vàng kim sắc nét, viền đen mảnh, chữ cái đầu cách điệu trên nền trắng với hiệu ứng ánh sáng, phong cách tối giản sang trọng.`
      }
    ],
    brandAdvice: `Hãy chọn một tên phản ánh cả năng lượng cá nhân của bạn và đặc điểm của ngành "${industry}". Tập trung vào marketing để làm nổi bật giá trị độc đáo. Kết hợp sự sáng tạo của số ${lifePathNumber} với chiến lược thực tế để phát triển bền vững. Logo nên nhấn mạnh phong cách phù hợp với ngành để tăng nhận diện thương hiệu.`
  };
  return { numerology };
}