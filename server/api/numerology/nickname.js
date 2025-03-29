import { defineEventHandler } from 'h3';

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

const apiKey = process.env.GEMINI_API_KEY || '';

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.',
    });
  }

  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const lastName = name.split(' ')[0];

  try {
    const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, sinh ngày ${birthdate}, tên ${name}, giới tính "${gender}". Trả về JSON hợp lệ với phần sau: ` +
      `"answer": Một đoạn văn ngắn (6-8 câu) gợi ý danh xưng quốc tế cho người trưởng thành. Đề xuất 3 danh xưng cụ thể, mỗi tên in đậm bằng **tên**, kèm lý do ngắn gọn (1-2 câu mỗi tên), cách nhau bằng "\\n\\n". ` +
      `Tên phải theo phong cách quốc tế, ngắn gọn, dễ gọi, và giữ đúng họ "${lastName}" từ "${name}". ` +
      `Nếu giới tính là "male", dùng tên nam tính (ví dụ: **David ${lastName}**, **Alex ${lastName}**, **James ${lastName}**); nếu là "female", dùng tên nữ tính (ví dụ: **Emma ${lastName}**, **Sophia ${lastName}**, **Olivia ${lastName}**). ` +
      `Với mỗi tên, thêm thông tin về một người nổi tiếng có cùng tên (ví dụ: "David Beckham - cầu thủ bóng đá nổi tiếng" cho David), đặt trong dấu ngoặc sau lý do. ` +
      `Kết thúc bằng 1-2 câu khuyên dùng "bạn" về cách sử dụng danh xưng (ví dụ: dùng trong công việc, mạng xã hội). Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

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

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.answer) throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender);
  }
});

function getFallbackNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender) {
  let answer = `Dựa trên thần số học, đây là 3 gợi ý danh xưng quốc tế đơn giản cho bạn:\n\n`;
  
  if (gender === 'male') {
    answer += `**David ${lastName}**: Phù hợp với năng lượng mạnh mẽ từ số chủ đạo ${dominantNumber} và hình ảnh quốc tế từ số nhân cách ${personalityNumber}. (David Beckham - cầu thủ bóng đá nổi tiếng)\n\n` +
             `**Alex ${lastName}**: Thể hiện sự năng động từ số linh hồn ${soulNumber}, dễ nhớ và hợp số định mệnh ${destinyNumber}. (Alex Turner - ca sĩ chính ban nhạc Arctic Monkeys)\n\n` +
             `**James ${lastName}**: Gợi sự tinh tế từ số chủ đạo ${dominantNumber}, phong cách quốc tế rõ nét. (James Bond - nhân vật điệp viên hư cấu nổi tiếng)\n\n`;
  } else {
    answer += `**Emma ${lastName}**: Phù hợp với sự thanh lịch từ số linh hồn ${soulNumber} và hình ảnh quốc tế từ số nhân cách ${personalityNumber}. (Emma Watson - diễn viên nổi tiếng từ Harry Potter)\n\n` +
             `**Sophia ${lastName}**: Thể hiện sự tinh tế từ số chủ đạo ${dominantNumber}, dễ nhớ và hợp số định mệnh ${destinyNumber}. (Sophia Loren - nữ diễn viên huyền thoại người Ý)\n\n` +
             `**Olivia ${lastName}**: Gợi sự năng động từ số linh hồn ${soulNumber}, phong cách quốc tế nổi bật. (Olivia Rodrigo - ca sĩ kiêm nhạc sĩ trẻ nổi tiếng)\n\n`;
  }

  answer += `Bạn có thể dùng danh xưng này trong công việc hoặc mạng xã hội để tạo ấn tượng. Chọn tên phù hợp với phong cách cá nhân của bạn.`;
  return { answer };
}