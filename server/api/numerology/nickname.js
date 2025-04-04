import { defineEventHandler, createError } from 'h3';
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
  const personalityData = NUMEROLOGY_MEANINGS.personality[personalityNumber] || NUMEROLOGY_MEANINGS.personality[1];
  const destinyData = NUMEROLOGY_MEANINGS.expression[destinyNumber] || NUMEROLOGY_MEANINGS.expression[1];

  console.log('Numerology data:', { 
    dominantNumber, soulNumber, personalityNumber, destinyNumber,
    lifePathData, soulData, personalityData, destinyData 
  });

  const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber} (${lifePathData.theme}), số linh hồn ${soulNumber} (${soulData.desire}), số nhân cách ${personalityNumber} (${personalityData.theme}), số định mệnh ${destinyNumber} (${destinyData.theme}), sinh ngày ${birthdate}, giới tính "${gender}"${startLetter ? `, yêu cầu tên bắt đầu bằng chữ "${startLetter}"` : ''}. Trả về JSON hợp lệ với phần "numerology" chứa:
    1. "lifePath": Số ${dominantNumber}, "lifePathDesc": Mô tả ngắn (1-2 câu) về ${lifePathData.theme} dựa trên ${lifePathData.strengths.join(', ')}.
    2. "soul": Số ${soulNumber}, "soulDesc": Mô tả ngắn (1-2 câu) về ${soulData.desire} dựa trên ${soulData.motivation}.
    3. "personality": Số ${personalityNumber}, "personalityDesc": Mô tả ngắn (1-2 câu) về ${personalityData.theme} dựa trên ${personalityData.workStyle}.
    4. "destiny": Số ${destinyNumber}, "destinyDesc": Mô tả ngắn (1-2 câu) về ${destinyData.theme} dựa trên ${destinyData.talents.join(', ')}.
    5. "suggestions": Mảng 3 danh xưng quốc tế, mỗi danh xưng có:
       - "name": Tên định dạng "Tên tiếng Anh + ${lastName}" (không dùng tên đầy đủ tiếng Việt),
       - "soul": Số linh hồn của tên,
       - "destiny": Số định mệnh của tên,
       - "desc": Lý do ngắn (1-2 câu) dựa trên ${lifePathData.theme}, ${soulData.desire}, ${personalityData.theme}, ${destinyData.theme},
       - "famous": Một người nổi tiếng cùng tên (ví dụ: "David Beckham - cầu thủ bóng đá nổi tiếng").
       Tên phải ngắn gọn, dễ gọi, phong cách quốc tế; nếu "male" thì nam tính, nếu "female" thì nữ tính${startLetter ? `, bắt đầu bằng "${startLetter}"` : ''}. Đảm bảo 3 tên khác nhau.
    6. "advice": Lời khuyên ngắn (1-2 câu) cho "bạn" về cách dùng danh xưng.
    Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

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
      if (!parsedData || !parsedData.numerology || !parsedData.numerology.suggestions) {
        throw new Error('Gemini API không trả về dữ liệu đầy đủ');
      }
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

  const numerology = {
    lifePath: dominantNumber,
    lifePathDesc: `${lifePathData.theme} (${dominantNumber}) mang năng lượng ${lifePathData.strengths[0].toLowerCase()} và ${lifePathData.strengths[1].toLowerCase()} để định hướng danh xưng.`,
    soul: soulNumber,
    soulDesc: `${soulData.desire} (${soulNumber}) thể hiện khát vọng ${soulData.motivation.toLowerCase()} của bạn.`,
    personality: personalityNumber,
    personalityDesc: `${personalityData.theme} (${personalityNumber}) cho thấy phong cách ${personalityData.workStyle.toLowerCase()} trong danh xưng.`,
    destiny: destinyNumber,
    destinyDesc: `${destinyData.theme} (${destinyNumber}) định hình tương lai với ${destinyData.talents[0].toLowerCase()} và ${destinyData.talents[1].toLowerCase()}.`,
    suggestions: [
      {
        name: `${name1.name} ${lastName}`,
        soul: getSoulNumber(name1.name),
        destiny: getDestinyNumber(`${name1.name} ${lastName}`),
        desc: `Tên này phù hợp với ${lifePathData.theme.toLowerCase()} từ số chủ đạo ${dominantNumber}, thể hiện ${lifePathData.strengths[0].toLowerCase()}.`,
        famous: name1.famous
      },
      {
        name: `${name2.name} ${lastName}`,
        soul: getSoulNumber(name2.name),
        destiny: getDestinyNumber(`${name2.name} ${lastName}`),
        desc: `Tên này phản ánh ${soulData.desire.toLowerCase()} của số linh hồn ${soulNumber}, nổi bật với ${soulData.motivation.toLowerCase()}.`,
        famous: name2.famous
      },
      {
        name: `${name3.name} ${lastName}`,
        soul: getSoulNumber(name3.name),
        destiny: getDestinyNumber(`${name3.name} ${lastName}`),
        desc: `Tên này kết nối với ${personalityData.theme.toLowerCase()} từ số nhân cách ${personalityNumber}, phù hợp với ${personalityData.workStyle.toLowerCase()}.`,
        famous: name3.famous
      }
    ],
    advice: `Bạn nên chọn danh xưng phù hợp với phong cách cá nhân và mục tiêu nghề nghiệp để tạo dấu ấn riêng!`
  };

  return { numerology };
}