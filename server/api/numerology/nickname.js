import { defineEventHandler, createError } from 'h3';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

function getLifePathNumber(birthdate) {
  const normalizedBirthdate = birthdate.replace(/-/g, '/');
  const [day, month, year] = normalizedBirthdate.split('/').map(Number);
  if (!day || !month || !year) return 9;
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 9;
}

function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi;
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

const apiKey = process.env.GEMINI_API_KEY || '';

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender, startLetter } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      message: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.',
    });
  }

  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthdate)) {
    throw createError({
      statusCode: 400,
      message: 'Ngày sinh phải có định dạng dd/mm/yyyy hoặc dd-mm-yyyy (ví dụ: 15/03/1995 hoặc 15-03-1995).',
    });
  }

  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const lastName = name.split(' ')[0];

  const lifePathData = NUMEROLOGY_MEANINGS.lifePath[dominantNumber] || NUMEROLOGY_MEANINGS.lifePath[1];
  const soulData = NUMEROLOGY_MEANINGS.soulUrge[soulNumber] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const personalityData = NUMEROLOGY_MEANINGS.personality?.[personalityNumber] || NUMEROLOGY_MEANINGS.personality?.[1] || { theme: "Không xác định", strengths: [] };
  const destinyData = NUMEROLOGY_MEANINGS.destiny?.[destinyNumber] || NUMEROLOGY_MEANINGS.destiny?.[1] || { theme: "Không xác định", strengths: [] };

  console.log('Numerology data:', { lifePathData, soulData, personalityData, destinyData });

  const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber} (${lifePathData.theme}), số linh hồn ${soulNumber} (${soulData.theme}), số nhân cách ${personalityNumber} (${personalityData.theme}), số định mệnh ${destinyNumber} (${destinyData.theme}), sinh ngày ${birthdate}, giới tính "${gender}"${startLetter ? `, yêu cầu tên bắt đầu bằng chữ "${startLetter}"` : ''}. Trả về JSON hợp lệ với phần sau: ` +
    `"answer": Một đoạn văn ngắn (6-8 câu) gợi ý danh xưng quốc tế cho người trưởng thành. Đề xuất 3 danh xưng cụ thể, mỗi tên in đậm bằng **tên**, kèm lý do ngắn gọn (1-2 câu mỗi tên) dựa trên ý nghĩa từ các số thần số học (${lifePathData.theme}, ${soulData.theme}, ${personalityData.theme}, ${destinyData.theme}), cách nhau bằng "\\n\\n". ` +
    `Tên phải theo phong cách quốc tế, ngắn gọn, dễ gọi, định dạng "Tên tiếng Anh + Họ" với họ là "${lastName}", không bao gồm tên đầy đủ tiếng Việt trong toàn bộ nội dung. ` +
    `Nếu giới tính là "male", dùng tên nam tính; nếu là "female", dùng tên nữ tính. ` +
    `${startLetter ? `Tất cả tên phải bắt đầu bằng chữ "${startLetter}". ` : ''}Đảm bảo 3 tên khác nhau. Với mỗi tên, thêm thông tin về một người nổi tiếng có cùng tên (ví dụ: "David Beckham - cầu thủ bóng đá nổi tiếng" cho David), đặt trong dấu ngoặc sau lý do. ` +
    `Kết thúc bằng 1-2 câu khuyên dùng "bạn" về cách sử dụng danh xưng. Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

  try {
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
      throw createError({
        statusCode: 500,
        message: `Gemini API lỗi: ${response.status}`,
      });
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
      return getDynamicNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender, startLetter, lifePathData, soulData, personalityData, destinyData);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getDynamicNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender, startLetter, lifePathData, soulData, personalityData, destinyData);
  }
});

function getDynamicNickname(dominantNumber, soulNumber, personalityNumber, destinyNumber, lastName, gender, startLetter, lifePathData, soulData, personalityData, destinyData) {
  const maleNames = [
    { name: 'Ethan', famous: 'Ethan Hawke - diễn viên nổi tiếng' },
    { name: 'Liam', famous: 'Liam Hemsworth - diễn viên người Úc' },
    { name: 'Noah', famous: 'Noah Centineo - diễn viên trẻ nổi tiếng' },
    { name: 'Mason', famous: 'Mason Mount - cầu thủ bóng đá Anh' },
    { name: 'James', famous: 'James Bond - nhân vật điệp viên nổi tiếng' },
    { name: 'Lucas', famous: 'Lucasfilm - công ty của George Lucas' },
    { name: 'Henry', famous: 'Henry Cavill - diễn viên nổi tiếng' },
    { name: 'Hugo', famous: 'Hugo Chávez - chính trị gia nổi tiếng' },
    { name: 'Hector', famous: 'Hector Bellerin - cầu thủ bóng đá' }
  ];

  const femaleNames = [
    { name: 'Ava', famous: 'Ava Gardner - nữ diễn viên huyền thoại' },
    { name: 'Luna', famous: 'Luna Lovegood - nhân vật trong Harry Potter' },
    { name: 'Zoe', famous: 'Zoe Saldana - diễn viên nổi tiếng' },
    { name: 'Mia', famous: 'Mia Hamm - cầu thủ bóng đá nữ nổi tiếng' },
    { name: 'Emma', famous: 'Emma Watson - diễn viên và nhà hoạt động' },
    { name: 'Sophie', famous: 'Sophie Turner - diễn viên nổi tiếng' },
    { name: 'Hannah', famous: 'Hannah Arendt - triết gia nổi tiếng' },
    { name: 'Hazel', famous: 'Hazel Grace - nhân vật trong The Fault in Our Stars' },
    { name: 'Heidi', famous: 'Heidi Klum - siêu mẫu nổi tiếng' }
  ];

  let nameList = gender === 'male' ? maleNames : femaleNames;

  if (startLetter) {
    nameList = nameList.filter(n => n.name.toUpperCase().startsWith(startLetter.toUpperCase()));
    if (nameList.length < 3) {
      throw createError({
        statusCode: 400,
        message: `Không đủ tên bắt đầu bằng "${startLetter}" trong danh sách. Vui lòng thử chữ cái khác!`,
      });
    }
  }

  const shuffleAndPick = (array, count) => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const selectedNames = shuffleAndPick(nameList, 3);
  const [name1, name2, name3] = selectedNames;

  const answer = `Dựa trên thần số học với các con số chủ đạo ${dominantNumber}, linh hồn ${soulNumber}, nhân cách ${personalityNumber}, và định mệnh ${destinyNumber}, đây là 3 gợi ý danh xưng quốc tế cho bạn${startLetter ? ` (bắt đầu bằng "${startLetter}")` : ''}:\n\n` +
    `**${name1.name} ${lastName}**: Tên này phù hợp với năng lượng ${lifePathData.theme.toLowerCase()} từ số chủ đạo ${dominantNumber}, thể hiện ${(lifePathData.strengths || [])[0]?.toLowerCase() || 'sự mạnh mẽ'}. (${name1.famous})\n\n` +
    `**${name2.name} ${lastName}**: Tên này phản ánh ${soulData.theme.toLowerCase()} của số linh hồn ${soulNumber}, nổi bật với ${(soulData.desires || [])[0]?.toLowerCase() || 'sự sáng tạo'}. (${name2.famous})\n\n` +
    `**${name3.name} ${lastName}**: Tên này kết nối với ${personalityData.theme.toLowerCase()} từ số nhân cách ${personalityNumber}, phù hợp với ${(personalityData.strengths || [])[0]?.toLowerCase() || 'sự tinh tế'}. (${name3.famous})\n\n` +
    `Bạn có thể dùng các danh xưng này trong công việc hoặc mạng xã hội để tạo dấu ấn riêng. Hãy chọn cái phù hợp nhất với phong cách của bạn!`;

  return { answer };
}