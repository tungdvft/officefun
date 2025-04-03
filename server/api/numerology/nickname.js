import { defineEventHandler, createError } from 'h3';

// Hằng số
const MASTER_NUMBERS = [11, 22];
const LETTER_VALUES = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8
};
const VOWEL_VALUES = { a: 1, e: 5, i: 9, o: 6, u: 3 };

// Helper function để tính số từ chuỗi
function calculateNumber(value, isMasterNumber = true) {
  let sum = value;
  while (sum > 9 && (!isMasterNumber || !MASTER_NUMBERS.includes(sum))) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return sum || (isMasterNumber ? (value === 0 ? 9 : value) : 1);
}

// Các hàm tính toán số
function getLifePathNumber(birthdate) {
  const [day, month, year] = birthdate.split(/[\/-]/).map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year)) return 9;
  
  const dayNum = calculateNumber(day);
  const monthNum = calculateNumber(month);
  const yearNum = calculateNumber(year);
  
  return calculateNumber(dayNum + monthNum + yearNum);
}

function getSoulNumber(name) {
  const vowels = name.toLowerCase().match(/[aeiou]/g) || [];
  const sum = vowels.reduce((acc, vowel) => acc + (VOWEL_VALUES[vowel] || 0), 0);
  return calculateNumber(sum);
}

function getPersonalityNumber(name) {
  const consonants = name.toLowerCase().replace(/[aeiou\s]/g, '');
  const sum = [...consonants].reduce((acc, char) => acc + (LETTER_VALUES[char] || 0), 0);
  return calculateNumber(sum);
}

function getDestinyNumber(name) {
  const letters = name.toLowerCase().replace(/\s/g, '');
  const sum = [...letters].reduce((acc, char) => acc + (LETTER_VALUES[char] || 0), 0);
  return calculateNumber(sum);
}

// Validate input
function validateInput(name, birthdate, gender) {
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

  if (!['male', 'female'].includes(gender.toLowerCase())) {
    throw createError({
      statusCode: 400,
      message: 'Giới tính phải là "male" hoặc "female".',
    });
  }
}

// Tạo prompt cho Gemini
function createGeminiPrompt(params) {
  const { 
    dominantNumber, 
    soulNumber, 
    personalityNumber, 
    destinyNumber, 
    birthdate, 
    gender, 
    startLetter, 
    lastName 
  } = params;

  return {
    instructions: `Bạn là chuyên gia thần số học và đặt tên quốc tế. Hãy đề xuất 3 tên tiếng Anh phù hợp dựa trên thông tin sau:`,
    requirements: [
      `Số chủ đạo: ${dominantNumber}`,
      `Số linh hồn: ${soulNumber}`,
      `Số nhân cách: ${personalityNumber}`,
      `Số định mệnh: ${destinyNumber}`,
      `Ngày sinh: ${birthdate}`,
      `Giới tính: ${gender}`,
      startLetter ? `Tên bắt đầu bằng chữ: ${startLetter.toUpperCase()}` : null,
      `Họ: ${lastName}`
    ].filter(Boolean).join('\n- '),
    outputFormat: `Trả về JSON với cấu trúc:
{
  "analysis": "Phân tích ngắn về tính cách dựa trên các con số",
  "suggestions": [
    {
      "name": "Tên đầy đủ",
      "meaning": "Ý nghĩa tên phù hợp với các con số",
      "personalityTraits": ["Tính cách", "Nổi bật"],
      "famousExample": "Người nổi tiếng cùng tên"
    }
  ],
  "usageTips": "Lời khuyên sử dụng tên"
}`,
    additionalRules: [
      'Mỗi tên phải khác biệt và có lý do riêng',
      'Tên phải phù hợp giới tính',
      startLetter ? `Tất cả tên phải bắt đầu bằng "${startLetter.toUpperCase()}"` : null,
      'Định dạng: "Tên + Họ" (ví dụ: David Nguyen)',
      'Không bao gồm tên tiếng Việt',
      'Giữ nội dung chuyên nghiệp và tích cực'
    ].filter(Boolean).join('\n- ')
  };
}

// Fallback name generator
function generateFallbackNames(params) {
  const { gender, lastName, startLetter, numbers } = params;
  const { dominantNumber, soulNumber, personalityNumber, destinyNumber } = numbers;
  
  // Danh sách tên được phân loại theo ý nghĩa số học
  const nameDatabase = {
    male: {
      1: ['Alexander', 'Max', 'Victor'],
      2: ['Noah', 'Ethan', 'Lucas'],
      3: ['Leo', 'Julian', 'Felix'],
      4: ['Henry', 'George', 'Charles'],
      5: ['Jack', 'Oliver', 'Daniel'],
      6: ['William', 'Benjamin', 'Samuel'],
      7: ['Gabriel', 'Theodore', 'Nathaniel'],
      8: ['James', 'David', 'Michael'],
      9: ['Arthur', 'Sebastian', 'Christopher'],
      11: ['Theo', 'Elijah', 'Matthew'],
      22: ['Anthony', 'Dominic', 'Nicholas']
    },
    female: {
      1: ['Amelia', 'Ava', 'Scarlett'],
      2: ['Sophia', 'Isabella', 'Mia'],
      3: ['Charlotte', 'Lily', 'Chloe'],
      4: ['Emily', 'Grace', 'Hannah'],
      5: ['Emma', 'Olivia', 'Sophie'],
      6: ['Ella', 'Zoe', 'Ruby'],
      7: ['Harper', 'Aurora', 'Violet'],
      8: ['Abigail', 'Elizabeth', 'Victoria'],
      9: ['Eleanor', 'Penelope', 'Stella'],
      11: ['Madison', 'Savannah', 'Brianna'],
      22: ['Gabriella', 'Alexandra', 'Isabelle']
    }
  };

  // Lọc tên phù hợp
  let suggestions = [];
  const numberPriorities = [dominantNumber, soulNumber, personalityNumber, destinyNumber];
  
  for (const num of numberPriorities) {
    const availableNames = nameDatabase[gender][num] || [];
    for (const name of availableNames) {
      if ((!startLetter || name.startsWith(startLetter.toUpperCase())) &&
          !suggestions.some(s => s.name === name) && suggestions.length < 3) {
        suggestions.push({
          name: `${name} ${lastName}`,
          meaning: getMeaningForNumber(num),
          personalityTraits: getTraitsForNumber(num),
          famousExample: getFamousExample(name, gender)
        });
      }
    }
    if (suggestions.length >= 3) break;
  }

  // Nếu không đủ, lấy thêm từ các số khác
  if (suggestions.length < 3) {
    const allNames = Object.values(nameDatabase[gender]).flat();
    for (const name of allNames) {
      if ((!startLetter || name.startsWith(startLetter.toUpperCase())) && 
          !suggestions.some(s => s.name.includes(name))) {
        const randomNum = Math.floor(Math.random() * 9) + 1;
        suggestions.push({
          name: `${name} ${lastName}`,
          meaning: getMeaningForNumber(randomNum),
          personalityTraits: getTraitsForNumber(randomNum),
          famousExample: getFamousExample(name, gender)
        });
        if (suggestions.length >= 3) break;
      }
    }
  }

  return {
    analysis: `Phân tích số học: Bạn có số chủ đạo ${dominantNumber} (lãnh đạo), linh hồn ${soulNumber} (cảm xúc), nhân cách ${personalityNumber} (ấn tượng), định mệnh ${destinyNumber} (sứ mệnh).`,
    suggestions,
    usageTips: "Dùng các tên này trong môi trường quốc tế, hồ sơ xin việc hoặc tài khoản mạng xã hội. Chọn tên bạn cảm thấy phù hợp nhất với cá tính của mình."
  };
}

// Helper functions
function getMeaningForNumber(num) {
  const meanings = {
    1: 'Sáng tạo, độc lập',
    2: 'Nhạy cảm, hòa hợp',
    3: 'Truyền cảm, xã giao',
    4: 'Thực tế, tổ chức',
    5: 'Tự do, phiêu lưu',
    6: 'Trách nhiệm, quan tâm',
    7: 'Phân tích, trí tuệ',
    8: 'Tham vọng, thành công',
    9: 'Nhân đạo, rộng lượng',
    11: 'Tâm linh, truyền cảm hứng',
    22: 'Xây dựng, kiến trúc sư'
  };
  return meanings[num] || 'Năng động, cân bằng';
}

function getTraitsForNumber(num) {
  const traits = {
    1: ['Lãnh đạo', 'Độc lập'],
    2: ['Nhạy cảm', 'Hợp tác'],
    3: ['Sáng tạo', 'Giao tiếp'],
    4: ['Thực tế', 'Kỷ luật'],
    5: ['Năng động', 'Thích nghi'],
    6: ['Chăm sóc', 'Trách nhiệm'],
    7: ['Phân tích', 'Khôn ngoan'],
    8: ['Tham vọng', 'Thực tế'],
    9: ['Nhân ái', 'Rộng lượng'],
    11: ['Trực giác', 'Tâm linh'],
    22: ['Tầm nhìn', 'Xây dựng']
  };
  return traits[num] || ['Năng động', 'Cân bằng'];
}

function getFamousExample(name, gender) {
  const examples = {
    male: {
      David: 'David Beckham - cầu thủ bóng đá',
      Michael: 'Michael Jordan - vận động viên bóng rổ',
      John: 'John Lennon - nhạc sĩ The Beatles'
    },
    female: {
      Emma: 'Emma Watson - diễn viên Harry Potter',
      Sophia: 'Sophia Loren - diễn viên huyền thoại',
      Olivia: 'Olivia Newton-John - ca sĩ, diễn viên'
    }
  };
  return examples[gender]?.[name] || `${name} - tên phổ biến trong giới nghệ sĩ quốc tế`;
}

// Main API handler
export default defineEventHandler(async (event) => {
  const { name, birthdate, gender, startLetter } = await readBody(event);
  
  // Validate input
  validateInput(name, birthdate, gender);
  
  // Process names
  const lastName = name.trim().split(/\s+/)[0];
  const normalizedGender = gender.toLowerCase();
  const normalizedStartLetter = startLetter?.toUpperCase();
  
  // Calculate numbers
  const numbers = {
    dominantNumber: getLifePathNumber(birthdate),
    soulNumber: getSoulNumber(name),
    personalityNumber: getPersonalityNumber(name),
    destinyNumber: getDestinyNumber(name)
  };
  
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('API key not configured');
    
    const prompt = createGeminiPrompt({
      ...numbers,
      birthdate,
      gender: normalizedGender,
      startLetter: normalizedStartLetter,
      lastName
    });
    
    const fullPrompt = `${prompt.instructions}\n\nYêu cầu:\n- ${prompt.requirements}\n\nĐịnh dạng đầu ra:\n${prompt.outputFormat}\n\nQuy tắc bổ sung:\n- ${prompt.additionalRules}`;
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: fullPrompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1000
          }
        })
      }
    );
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', response.status, errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data = await response.json();
    const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    try {
      const cleanedText = rawText.replace(/```json|```/g, '').trim();
      const result = JSON.parse(cleanedText);
      
      // Validate Gemini response
      if (!result?.suggestions || !Array.isArray(result.suggestions)) {
        throw new Error('Invalid response format from Gemini');
      }
      
      return {
        success: true,
        data: {
          ...numbers,
          lastName,
          ...result
        }
      };
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      // Fallback to our own generator
      const fallbackResult = generateFallbackNames({
        gender: normalizedGender,
        lastName,
        startLetter: normalizedStartLetter,
        numbers
      });
      
      return {
        success: true,
        data: {
          ...numbers,
          lastName,
          ...fallbackResult,
          isFallback: true
        }
      };
    }
  } catch (error) {
    console.error('API error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
      data: {
        input: { name, birthdate, gender, startLetter },
        numbers: numbers
      }
    });
  }
});