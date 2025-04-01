import { defineEventHandler, createError } from 'h3';

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
  const lastName = name.split(' ')[0]; // Lấy họ (từ đầu tiên)

  try {
    const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, sinh ngày ${birthdate}, tên ${name}, giới tính "${gender}". Trả về JSON hợp lệ với phần sau: ` +
      `"answer": Một đoạn văn ngắn (6-8 câu) gợi ý danh xưng quốc tế cho người trưởng thành. Đề xuất 3 danh xưng cụ thể, mỗi tên in đậm bằng **tên**, kèm lý do ngắn gọn (1-2 câu mỗi tên), cách nhau bằng "\\n\\n". ` +
      `Tên phải theo phong cách quốc tế, ngắn gọn, dễ gọi, định dạng "Tên biệt danh + Họ" với họ là "${lastName}" từ "${name}". ` +
      `Nếu giới tính là "male", dùng tên nam tính; nếu là "female", dùng tên nữ tính. ` +
      `Với mỗi tên, thêm thông tin về một người nổi tiếng có cùng tên (ví dụ: "David Beckham - cầu thủ bóng đá nổi tiếng" cho David), đặt trong dấu ngoặc sau lý do. ` +
      `Kết thúc bằng 1-2 câu khuyên dùng "bạn" về cách sử dụng danh xưng. Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

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

    if (!response.ok) {
      console.error('Gemini API lỗi:', response.status, await response.text());
      throw new Error(`Gemini API lỗi: ${response.status}`);
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.answer) throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getDynamicNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getDynamicNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender);
  }
});

function getDynamicNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender) {
  const maleNames = [
    { name: 'Ethan', reason: 'Thể hiện sự mạnh mẽ và thông minh', famous: 'Ethan Hawke - diễn viên nổi tiếng' },
    { name: 'Liam', reason: 'Gợi sự năng động và sáng tạo', famous: 'Liam Hemsworth - diễn viên người Úc' },
    { name: 'Noah', reason: 'Phù hợp với sự tinh tế và bình yên', famous: 'Noah Centineo - diễn viên trẻ nổi tiếng' },
    { name: 'Mason', reason: 'Tượng trưng cho sự vững chắc', famous: 'Mason Mount - cầu thủ bóng đá Anh' },
  ];
  
  const femaleNames = [
    { name: 'Ava', reason: 'Thể hiện sự thanh lịch và quyến rũ', famous: 'Ava Gardner - nữ diễn viên huyền thoại' },
    { name: 'Luna', reason: 'Gợi sự bí ẩn và sáng tạo', famous: 'Luna Lovegood - nhân vật trong Harry Potter' },
    { name: 'Zoe', reason: 'Phù hợp với sự năng động và tươi mới', famous: 'Zoe Saldana - diễn viên nổi tiếng' },
    { name: 'Mia', reason: 'Ngắn gọn, dễ nhớ và hiện đại', famous: 'Mia Hamm - cầu thủ bóng đá nữ nổi tiếng' },
  ];

  const nameList = gender === 'male' ? maleNames : femaleNames;
  
  // Chọn tên dựa trên các số
  const name1 = nameList[dominantNumber % nameList.length];
  const name2 = nameList[soulNumber % nameList.length];
  const name3 = nameList[personalityNumber % nameList.length];

  let answer = `Dựa trên thần số học với các con số chủ đạo ${dominantNumber}, linh hồn ${soulNumber}, nhân cách ${personalityNumber}, và định mệnh ${destinyNumber}, đây là 3 gợi ý danh xưng quốc tế cho bạn:\n\n` +
    `**${name1.name} ${lastName}**: ${name1.reason}, rất hợp với năng lượng từ số chủ đạo ${dominantNumber}. (${name1.famous})\n\n` +
    `**${name2.name} ${lastName}**: ${name2.reason}, phản ánh sự sâu sắc từ số linh hồn ${soulNumber}. (${name2.famous})\n\n` +
    `**${name3.name} ${lastName}**: ${name3.reason}, nổi bật với số nhân cách ${personalityNumber}. (${name3.famous})\n\n` +
    `Bạn có thể dùng các danh xưng này trong công việc hoặc mạng xã hội để tạo dấu ấn riêng. Hãy chọn cái phù hợp nhất với phong cách của bạn!`;

  return { answer };
}