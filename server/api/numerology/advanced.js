import { defineEventHandler } from 'h3';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Hàm mở database
async function getDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

// Hàm tính Số chủ đạo (Life Path Number)
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

// Hàm tính Số linh hồn (Soul Urge)
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

// Hàm tính Số nhân cách (Personality)
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

// Hàm tính Số định mệnh (Destiny)
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

// Hàm caching và gọi Gemini
async function getCachedNumerology(username, birthdate, dominantNumber, soulNumber, personalityNumber, destinyNumber) {
  const db = await getDb();

  // Tạo bảng cache nếu chưa có
  await db.run(`
    CREATE TABLE IF NOT EXISTS numerology_cache (
      username TEXT,
      date TEXT,
      data TEXT,
      PRIMARY KEY (username, date)
    )
  `);

  const today = new Date().toISOString().split('T')[0];
  const cached = await db.get(
    'SELECT data FROM numerology_cache WHERE username = ? AND date = ?',
    [username, today]
  );

  if (cached) {
    console.log(`Cache hit for ${username} on ${today}`);
    return JSON.parse(cached.data);
  }

  const freshData = await getGeminiContent(birthdate, dominantNumber, soulNumber, personalityNumber, destinyNumber, today);
  await db.run(
    'INSERT OR REPLACE INTO numerology_cache (username, date, data) VALUES (?, ?, ?)',
    [username, today, JSON.stringify(freshData)]
  );
  console.log(`Cache miss - Stored new data for ${username} on ${today}`);
  return freshData;
}

// Hàm gọi Gemini API
async function getGeminiContent(birthdate, dominantNumber, soulNumber, personalityNumber, destinyNumber, today) {
  const currentYear = new Date().getFullYear();
  const personalCycle = (currentYear + parseInt(birthdate.split('/')[0])) % 9 || 9;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tạo nội dung bói toán nâng cao dựa trên thần số học với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, sinh ngày ${birthdate}. Trả về JSON hợp lệ với 4 phần sau:
                1. "life_path_analysis": Phân tích tổng quan cuộc đời (3-4 câu), sâu sắc, dùng số chủ đạo ${dominantNumber} và chu kỳ ${personalCycle}, hé lộ điểm mạnh, điểm yếu và định hướng chính trong cuộc sống.
                2. "life_lessons": Mảng 3 object, mỗi object có "lesson" (1 câu) và "detail" (2 câu), dùng số định mệnh ${destinyNumber}, ví dụ: [{"lesson": "Bài học về...", "detail": "Chi tiết..."}, ...], tập trung vào thử thách và trưởng thành.
                3. "personal_growth": Hướng phát triển cá nhân (3 câu), chi tiết, dùng số nhân cách ${personalityNumber}, chỉ ra cách khắc phục điểm yếu, phát huy điểm mạnh và bước đi cụ thể.
                4. "daily_insight": Một câu trả lời nâng cao về vận mệnh cho ngày ${today} (2-3 câu), dựa trên số chủ đạo ${dominantNumber} và số linh hồn ${soulNumber}, mang vibe bí ẩn, tích cực, định hướng cho ngày này, đảm bảo khác biệt mỗi ngày.
                Đảm bảo JSON hợp lệ, không markdown, chỉ trả về chuỗi JSON thuần túy, nội dung chuyên sâu, thực tế và có chút huyền bí!`
            }],
          }],
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini API lỗi: ${response.status}`);
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      return JSON.parse(rawText);
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackContent(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, today);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackContent(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, today);
  }
}

// Hàm fallback khi Gemini lỗi
function getFallbackContent(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, today) {
  const currentYear = new Date().getFullYear();
  const dayOfYear = Math.floor((new Date(today) - new Date(`${currentYear}-01-01`)) / (1000 * 60 * 60 * 24)); // Ngày trong năm
  const dailyVariation = (dayOfYear % 5) + 1; // Tạo biến thể (1-5) dựa trên ngày

  return {
    life_path_analysis: `Số chủ đạo ${dominantNumber} mang đến tầm nhìn lớn nhưng dễ thiếu kiên nhẫn. Chu kỳ ${personalCycle} năm ${currentYear} là giai đoạn bạn học cách kiểm soát bản thân. Đây là thời điểm định hình con đường phía trước.`,
    life_lessons: [
      { lesson: "Bài học về kiên nhẫn.", detail: "Số định mệnh ${destinyNumber} dạy bạn chờ đợi đúng thời điểm. Đừng vội vàng, mọi thứ sẽ đến khi bạn sẵn sàng." },
      { lesson: "Bài học về thất bại.", detail: "Thất bại là bước đệm quan trọng với số ${destinyNumber}. Hãy coi nó như bài kiểm tra để trưởng thành." },
      { lesson: "Bài học về trực giác.", detail: "Số ${destinyNumber} khuyên bạn tin vào cảm giác sâu thẳm. Nó sẽ dẫn bạn qua những ngã rẽ bất ngờ." }
    ],
    personal_growth: `Số ${personalityNumber} khuyên bạn tập trung vào mục tiêu cụ thể hơn. Đừng để sự thiếu thực tế cản bước. Bắt đầu từ những hành động nhỏ ngay hôm nay để tiến xa.`,
    daily_insight: `Hôm nay ${today}, số ${dominantNumber} và số linh hồn ${soulNumber} hé lộ một ngày biến động nhỏ (biến thể ${dailyVariation}). Vũ trụ đang thử thách bạn với cơ hội bất ngờ, hãy hành động nhanh để nắm bắt!`
  };
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  const birthdate = event.node.req.headers['x-birthdate'] || '14/03/2000';

  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(username);
  const personalityNumber = getPersonalityNumber(username);
  const destinyNumber = getDestinyNumber(username);

  const geminiContent = await getCachedNumerology(username, birthdate, dominantNumber, soulNumber, personalityNumber, destinyNumber);

  return {
    chart: {
      dominant: {
        number: dominantNumber,
        description: `Số chủ đạo ${dominantNumber}: Điểm mạnh là khả năng nhìn xa trông rộng và tư duy chiến lược. Điểm yếu là thiếu kiên nhẫn và dễ bị phân tâm khi gặp trở ngại. Bạn sinh ra để dẫn dắt, nhưng cần học cách kiên trì để đạt mục tiêu lớn!`
      },
      soul: {
        number: soulNumber,
        description: `Số linh hồn ${soulNumber}: Điểm mạnh là đam mê mãnh liệt và ý chí mạnh mẽ trong mọi việc bạn muốn. Điểm yếu là dễ để cảm xúc lấn át lý trí, gây ra quyết định vội vàng. Hãy biến khát khao thành sức mạnh để chinh phục mọi thử thách!`
      },
      personality: {
        number: personalityNumber,
        description: `Số nhân cách ${personalityNumber}: Điểm mạnh là sức hút tự nhiên, khả năng truyền cảm hứng cho người khác. Điểm yếu là đôi khi thiếu thực tế, mơ mộng quá mức. Dùng năng lượng của bạn để tạo ảnh hưởng tích cực và giữ đôi chân trên mặt đất!`
      },
      destiny: {
        number: destinyNumber,
        description: `Số định mệnh ${destinyNumber}: Điểm mạnh là sự sáng tạo và trực giác nhạy bén, dẫn bạn đến những thành tựu lớn. Điểm yếu là hay do dự, chần chừ trước quyết định quan trọng. Con đường của bạn là chinh phục đỉnh cao, hãy mạnh dạn bước đi!`
      }
    },
    ...geminiContent
  };
});