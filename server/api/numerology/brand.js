// server/api/numerology/brand.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

// Hàm chuẩn hóa văn bản
function normalizeText(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Bỏ dấu
    .replace(/đ/g, 'd').replace(/[^a-z0-9]/g, ''); // Chuẩn hóa tiếng Việt
}

// Hàm tính toán số học tổng quát
function calculateNumerologyNumber(value, isMasterNumber = true) {
  try {
    let sum = 0;
    
    if (typeof value === 'string') {
      sum = value.split('').reduce((acc, char) => {
        const num = parseInt(char);
        return acc + (isNaN(num) ? 0 : num);
      }, 0);
    } else if (typeof value === 'number') {
      sum = value;
    }

    if (isMasterNumber) {
      while (sum > 9 && ![11, 22].includes(sum)) {
        sum = sum.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
      }
    }
    
    return sum || (isMasterNumber ? 9 : 1);
  } catch (error) {
    console.error('Lỗi tính số học:', error);
    return isMasterNumber ? 9 : 1;
  }
}

// Hàm tính số đường đời
function getLifePathNumber(date) {
  const [day, month, year] = date.split('/').map(Number);
  if (isNaN(day)) return calculateNumerologyNumber(date);
  return calculateNumerologyNumber(day + month + year);
}

// Hàm tính số linh hồn
function getSoulNumber(name) {
  const vowels = /[aeiou]/i;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const cleanName = normalizeText(name);
  
  const sum = cleanName.split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  
  return calculateNumerologyNumber(sum, true);
}

// Hàm tính số định mệnh
function getDestinyNumber(name) {
  const letterValues = { 
    a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
    j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
    s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 
  };
  
  const cleanName = normalizeText(name);
  const sum = cleanName.split('').reduce((acc, char) => {
    return acc + (letterValues[char] || 0);
  }, 0);
  
  return calculateNumerologyNumber(sum, true);
}

// Tạo prompt cho Gemini API
function createBrandNumerologyPrompt(data) {
  const { industry, date, ownerName, extraRequest, gender } = data;
  
  return `Bạn là chuyên gia số học và đặt tên thương hiệu. Hãy phân tích theo yêu cầu sau:

**Thông tin đầu vào:**
- Ngành: ${industry}
- Ngày sinh chủ: ${date}
- Tên chủ: ${ownerName}
- Giới tính: ${gender}
- Yêu cầu đặc biệt: ${extraRequest || 'Không có'}

**Yêu cầu output (JSON):**
{
  "numerology": {
    "analysis": {
      "lifePath": { "number": X, "meaning": "..." },
      "soul": { "number": X, "meaning": "..." },
      "destiny": { "number": X, "meaning": "..." }
    },
    "combinedAnalysis": "...",
    "nameSuggestions": [
      {
        "name": "...",
        "soulNumber": X,
        "destinyNumber": X,
        "meaning": "...",
        "logoDescription": "...",
        "suitableColors": ["...", "..."]
      }
    ],
    "brandAdvice": ["...", "..."]
  }
}

**Lưu ý:**
1. Chỉ trả về JSON hợp lệ, không có markdown
2. Tên thương hiệu nên phù hợp với ngành ${industry}
3. Màu sắc logo nên hài hòa với năng lượng số học`;
}

// Fallback response
function getFallbackResponse(lifePath, soul, destiny, industry, extraRequest) {
  const defaultNames = {
    tech: ['TechNova', 'CodeSphere', 'ByteForge'],
    fashion: ['Glamora', 'ChicVibe', 'StyleHaven'],
    food: ['SavoryBites', 'GustoFare', 'Epicurean'],
    general: ['PrimeVantage', 'EliteCore', 'NexusPeak']
  };
  
  const names = defaultNames[industry.toLowerCase()] || defaultNames.general;
  
  return {
    numerology: {
      analysis: {
        lifePath: { number: lifePath, meaning: `Con số đường đời ${lifePath} mang năng lượng mạnh mẽ` },
        soul: { number: soul, meaning: `Số linh hồn ${soul} thể hiện khát vọng sâu sắc` },
        destiny: { number: destiny, meaning: `Số định mệnh ${destiny} chỉ ra hướng phát triển` }
      },
      combinedAnalysis: `Phân tích tổng hợp cho thấy sự kết hợp của số ${lifePath}, ${soul} và ${destiny} tạo nên năng lượng đặc biệt phù hợp với ngành ${industry}`,
      nameSuggestions: names.map(name => ({
        name: extraRequest ? `${extraRequest}${name}` : name,
        soulNumber: calculateNumerologyNumber(name, true),
        destinyNumber: calculateNumerologyNumber(name, false),
        meaning: `Tên này phù hợp với ngành ${industry} và mang năng lượng tích cực`,
        logoDescription: `Logo nên sử dụng màu sắc tương ứng với số ${lifePath}`,
        suitableColors: ['#3366cc', '#00cc99']
      })),
      brandAdvice: [
        `Tập trung vào điểm mạnh của số ${lifePath}`,
        `Kết hợp yếu tố của số ${soul} vào chiến lược`,
        `Phát triển theo hướng số ${destiny} chỉ ra`
      ]
    },
    meta: {
      isFallback: true,
      timestamp: new Date().toISOString()
    }
  };
}

// Main API handler
export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    
    // Validate input
    if (!body.industry || !body.date || !body.ownerName) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc',
        data: {
          requiredFields: ['industry', 'date', 'ownerName'],
          received: Object.keys(body)
        }
      });
    }

    // Calculate numerology numbers
    const numerologyData = {
      lifePath: getLifePathNumber(body.date),
      soul: getSoulNumber(body.ownerName),
      destiny: getDestinyNumber(body.ownerName),
      industry: body.industry,
      ownerName: body.ownerName,
      extraRequest: body.extraRequest || '',
      gender: body.gender || 'unspecified'
    };

    // Create prompt and call API
    const prompt = createBrandNumerologyPrompt(numerologyData);
    const response = await callGeminiApi(prompt);
    
    // Validate response
    if (!response?.numerology) {
      console.error('Invalid Gemini response:', response);
      return getFallbackResponse(
        numerologyData.lifePath,
        numerologyData.soul,
        numerologyData.destiny,
        numerologyData.industry,
        numerologyData.extraRequest
      );
    }

    // Add meta data
    response.meta = {
      calculatedNumbers: {
        lifePath: numerologyData.lifePath,
        soul: numerologyData.soul,
        destiny: numerologyData.destiny
      },
      timestamp: new Date().toISOString()
    };

    return response;
    
  } catch (error) {
    console.error('API Error:', error);
    
    if (error.statusCode) {
      throw error;
    }
    
    return getFallbackResponse(
      getLifePathNumber(body?.date || '1/1/2000'),
      getSoulNumber(body?.ownerName || 'unknown'),
      getDestinyNumber(body?.ownerName || 'unknown'),
      body?.industry || 'general',
      body?.extraRequest
    );
  }
});