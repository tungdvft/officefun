import { defineEventHandler, createError } from 'h3';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Hàm tính Số Đường Đời (Life Path Number)
function getLifePathNumber(birthdate) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthdate)) return 9;
  const normalizedBirthdate = birthdate.replace(/-/g, '/');
  const [day, month, year] = normalizedBirthdate.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) return 9;
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

// Hàm tính Số Linh Hồn (Soul Urge Number)
function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Hàm tính Số Định Mệnh (Destiny Number)
function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

// Hàm tính Số Ngày (Day Number)
function getDayNumber(date) {
  const [day, month, year] = date.split('/').map(Number);
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

// Hàm kiểm tra tương hợp
function getCompatibilityScore(lifePath1, lifePath2, soul1, soul2, destiny1, destiny2, dayNumber) {
  const compatiblePairs = {
    1: [1, 5, 7], 2: [2, 4, 8], 3: [3, 6, 9], 4: [2, 4, 8], 5: [1, 5, 7],
    6: [3, 6, 9], 7: [1, 5, 7], 8: [2, 4, 8], 9: [3, 6, 9],
    11: [1, 5, 7, 11], 22: [2, 4, 8, 22], 33: [3, 6, 9, 33]
  };

  console.log('Compatibility inputs:', { lifePath1, lifePath2, soul1, soul2, destiny1, destiny2, dayNumber });

  let score = 0;
  const numbers = [lifePath1, lifePath2, soul1, soul2, destiny1, destiny2];

  numbers.forEach(num => {
    if (compatiblePairs[num] && compatiblePairs[num].includes(dayNumber)) {
      score += 1;
    }
  });

  if (numbers.filter(n => n === dayNumber).length >= 3) score += 2;

  // Chuyển điểm thành thang 10 (tối đa 8 điểm từ logic trên)
  return Math.min(Math.round((score / 8) * 10), 10);
}

// Hàm tạo danh sách ngày
function generateDateRange(startDate, endDate) {
  const dates = [];
  const start = new Date(startDate.split('/').reverse().join('-'));
  const end = new Date(endDate.split('/').reverse().join('-'));
  if (start > end) throw createError({ statusCode: 400, message: 'startDate phải nhỏ hơn endDate.' });

  let currentDate = new Date(start);
  while (currentDate <= end) {
    const formattedDate = `${String(currentDate.getDate()).padStart(2, '0')}/${String(currentDate.getMonth() + 1).padStart(2, '0')}/${currentDate.getFullYear()}`;
    dates.push(formattedDate);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}

const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

export default defineEventHandler(async (event) => {
  const { brideBirthdate, groomBirthdate, brideName, groomName, startDate, endDate } = await readBody(event);

  // Validate input
  if (!brideBirthdate || !groomBirthdate || !brideName || !groomName || !startDate || !endDate) {
    throw createError({ statusCode: 400, message: 'Thiếu thông tin: brideBirthdate, groomBirthdate, brideName, groomName, startDate và endDate là bắt buộc.' });
  }

  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(brideBirthdate) || !/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(groomBirthdate)) {
    throw createError({ statusCode: 400, message: 'Ngày sinh phải có định dạng dd/mm/yyyy hoặc dd-mm-yyyy.' });
  }

  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(startDate) || !/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(endDate)) {
    throw createError({ statusCode: 400, message: 'startDate và endDate phải có định dạng dd/mm/yyyy hoặc dd-mm-yyyy.' });
  }

  // Tính các số
  const brideLifePath = getLifePathNumber(brideBirthdate);
  const groomLifePath = getLifePathNumber(groomBirthdate);
  const brideSoul = getSoulNumber(brideName);
  const groomSoul = getSoulNumber(groomName);
  const brideDestiny = getDestinyNumber(brideName);
  const groomDestiny = getDestinyNumber(groomName);

  const dateRange = generateDateRange(startDate.replace(/-/g, '/'), endDate.replace(/-/g, '/'));
  const dateScores = dateRange.map(date => {
    const dayNumber = getDayNumber(date);
    const score = getCompatibilityScore(brideLifePath, groomLifePath, brideSoul, groomSoul, brideDestiny, groomDestiny, dayNumber);
    return { date, dayNumber, score };
  });
  const topDates = dateScores.sort((a, b) => b.score - a.score).slice(0, 5);

  const prompt = `Dựa trên thần số học với:
    - Số đường đời cô dâu ${brideLifePath} (${NUMEROLOGY_MEANINGS.lifePath[brideLifePath]?.theme || 'Không xác định'}),
    - Số đường đời chú rể ${groomLifePath} (${NUMEROLOGY_MEANINGS.lifePath[groomLifePath]?.theme || 'Không xác định'}),
    - Số linh hồn cô dâu ${brideSoul} (${NUMEROLOGY_MEANINGS.soulUrge[brideSoul]?.desire || 'Không xác định'}),
    - Số linh hồn chú rể ${groomSoul} (${NUMEROLOGY_MEANINGS.soulUrge[groomSoul]?.desire || 'Không xác định'}),
    - Số định mệnh cô dâu ${brideDestiny} (${NUMEROLOGY_MEANINGS.expression[brideDestiny]?.theme || 'Không xác định'}),
    - Số định mệnh chú rể ${groomDestiny} (${NUMEROLOGY_MEANINGS.expression[groomDestiny]?.theme || 'Không xác định'}),
    và 5 ngày cưới tiềm năng: ${topDates.map(d => `${d.date} (số ${d.dayNumber})`).join(', ')}. 
    Trả về JSON hợp lệ với phần "numerology" chứa:
    1. "bride": { "lifePath": ${brideLifePath}, "soul": ${brideSoul}, "destiny": ${brideDestiny} },
    2. "groom": { "lifePath": ${groomLifePath}, "soul": ${groomSoul}, "destiny": ${groomDestiny} },
    3. "suggestions": Mảng 5 đối tượng, mỗi đối tượng có:
       - "date": Chuỗi ngày (ví dụ: "03/06/2025"),
       - "dayNumber": Số của ngày,
       - "desc": Mô tả chi tiết (2-3 câu) về lý do ngày này phù hợp, giải thích cụ thể cách số của ngày tương hợp với các số của cô dâu và chú rể, sử dụng dữ liệu từ NUMEROLOGY_MEANINGS,
       - "compatibilityScore": Điểm phù hợp trên thang 10 (số nguyên từ 1-10).
    4. "advice": Lời khuyên ngắn (1-2 câu) về cách chọn ngày cưới.
    Trả về chuỗi JSON thuần túy, không dùng Markdown, không thêm ký tự thừa!`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API lỗi:', response.status, errorText);
      throw new Error(`Gemini API thất bại: ${response.status}`);
    }

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text.trim();

    // Làm sạch dữ liệu thô để loại bỏ Markdown hoặc ký tự thừa
    rawText = rawText.replace(/```json|```/g, '').trim();
    console.log('Gemini cleaned response:', rawText);

    // Parse JSON với kiểm tra lỗi
    let parsedData;
    try {
      parsedData = JSON.parse(rawText);
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError.message, 'Raw text:', rawText);
      throw new Error('Dữ liệu từ Gemini không phải JSON hợp lệ');
    }

    if (!parsedData.numerology || !parsedData.numerology.suggestions) {
      console.error('Dữ liệu Gemini thiếu trường cần thiết:', parsedData);
      throw new Error('Gemini không trả về dữ liệu đầy đủ');
    }

    return parsedData;
  } catch (error) {
    console.error('Lỗi xử lý Gemini:', error.message);
    // Fallback với mô tả chi tiết hơn
    return {
      numerology: {
        bride: { lifePath: brideLifePath, soul: brideSoul, destiny: brideDestiny },
        groom: { lifePath: groomLifePath, soul: groomSoul, destiny: groomDestiny },
        suggestions: topDates.map(({ date, dayNumber, score }) => {
          const dayTheme = NUMEROLOGY_MEANINGS.lifePath[dayNumber]?.theme || 'Không xác định';
          let desc = `Ngày ${date} có số ${dayNumber} (${dayTheme}), phù hợp với năng lượng của cả hai bạn. `;
          if (score >= 4) {
            desc += `Số này hài hòa với ${NUMEROLOGY_MEANINGS.lifePath[brideLifePath]?.theme || 'đường đời'} của cô dâu và ${NUMEROLOGY_MEANINGS.lifePath[groomLifePath]?.theme || 'đường đời'} của chú rể, tạo nên sự ổn định lâu dài.`;
          } else if (score >= 2) {
            desc += `Số này hỗ trợ tốt cho ${NUMEROLOGY_MEANINGS.soulUrge[brideSoul]?.desire || 'linh hồn'} của cô dâu và ${NUMEROLOGY_MEANINGS.soulUrge[groomSoul]?.desire || 'linh hồn'} của chú rể, mang lại cảm giác cân bằng.`;
          } else {
            desc += `Số này mang lại năng lượng hài hòa, phù hợp cho một khởi đầu mới mẻ.`;
          }
          return {
            date,
            dayNumber,
            desc,
            compatibilityScore: score
          };
        }),
        advice: `Chọn ngày có điểm phù hợp cao nhất để đảm bảo năng lượng hài hòa và hạnh phúc lâu dài cho cuộc hôn nhân!`
      }
    };
  }
});