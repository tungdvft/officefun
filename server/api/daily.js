import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

function getLifePathNumber(birthdate) {
  if (!birthdate || typeof birthdate !== 'string') {
    throw new Error('Invalid birthdate: must be a non-empty string');
  }

  let decodedBirthdate = decodeURIComponent(birthdate);
  let day, month, year;

  if (decodedBirthdate.includes('-')) {
    const parts = decodedBirthdate.split('-');
    if (parts.length !== 3) {
      throw new Error(`Invalid birthdate format: ${decodedBirthdate} must be DD-MM-YYYY or YYYY-MM-DD`);
    }
    if (parts[0].length === 4) {
      [year, month, day] = parts.map(part => part.padStart(2, '0')); 
    } else {
      [day, month, year] = parts.map(part => part.padStart(2, '0')); 
    }
  } else if (decodedBirthdate.includes('/')) {
    const parts = decodedBirthdate.split('/');
    if (parts.length !== 3) {
      throw new Error(`Invalid birthdate format: ${decodedBirthdate} must be DD-MM-YYYY or YYYY-MM-DD`);
    }
    [day, month, year] = parts.map(part => part.padStart(2, '0')); 
  } else {
    throw new Error(`Invalid birthdate format: ${decodedBirthdate} must be DD-MM-YYYY or YYYY-MM-DD`);
  }

  const formattedDate = `${year}-${month}-${day}`; 
  const date = new Date(formattedDate);
  if (isNaN(date.getTime())) {
    throw new Error(`Birthdate parsing failed: ${decodedBirthdate} is not a valid date`);
  }

  const sum = (day + month + year).split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result;
}

const apiKey = process.env.GEMINI_API_KEY || '';

async function getCachedDaily(username, profession, lifePathNumber) {
  const db = await getDb();
  
  await db.run(`
    CREATE TABLE IF NOT EXISTS daily_cache (
      username TEXT,
      date TEXT,
      data TEXT,
      PRIMARY KEY (username, date)
    )
  `);

  const today = new Date().toISOString().split('T')[0];
  const cached = await db.query(
    'SELECT data FROM daily_cache WHERE username = $1 AND date = $2',
    [username, today]
  ).then(res => res[0]);

  if (cached) {
    return JSON.parse(cached.data);
  }

  const effectiveLifePathNumber = lifePathNumber === 0 ? 1 : lifePathNumber;
  const freshData = await getAIResponse(profession, effectiveLifePathNumber);
  await db.run(
    'INSERT OR REPLACE INTO daily_cache (username, date, data) VALUES (?, ?, ?)',
    [username, today, JSON.stringify(freshData)]
  );
  return freshData;
}

async function getAIResponse(profession, lifePathNumber) {
  if (lifePathNumber === 0) {
    throw new Error('Invalid lifePathNumber: 0 is not a valid numerology number');
  }
  const maxRetries = 3;
  let attempts = 0;

  while (attempts < maxRetries) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{
                text: `Tạo nội dung bói toán và hữu ích cho dân văn phòng hôm nay, trả về dưới dạng JSON hợp lệ với 6 key trực tiếp (KHÔNG lồng object như {"9": "..."} hoặc {"CongNgheThongTin": "..."}), như sau:
                  {
                    "dailyNumerology": "Dự đoán vận mệnh hôm nay dựa trên con số chủ đạo ${lifePathNumber} từ thần số học (chỉ chấp nhận 1-9, 11, 22; không dùng số 0), ngắn gọn (2-3 câu), sáng tạo, tích cực, mang vibe bí ẩn và năng lượng vũ trụ.",
                    "weeklyNumerology": "Dự đoán vận mệnh tuần này dựa trên con số chủ đạo ${lifePathNumber}, ngắn gọn (2-3 câu), góc nhìn dài hơn, truyền cảm hứng và định hướng.",
                    "tarot": "Quẻ Tarot hôm nay (1 lá), ngắn gọn (2-3 câu), gộp tên lá bài và ý nghĩa thành một chuỗi duy nhất, tích cực, sáng tạo, phù hợp vibe công sở, ví dụ: 'Hôm nay lá bài Tarot của bạn là The Star: Hy vọng tràn đầy, cơ hội công việc đang đến gần!'.",
                    "officeTip": "Mẹo văn phòng thực tế, ngắn gọn (3-4 câu) dành riêng cho ngành ${profession}, cụ thể và áp dụng được ngay, ví dụ: 'Dùng hàm VLOOKUP trong Excel để tra cứu dữ liệu nhanh hơn.'",
                    "funFact": "Fact lạ lùng, ngắn gọn (2-3 câu) về văn phòng hoặc công việc, kiểu 'nghe xong phải kể lại ngay', ví dụ: '80% dân văn phòng thừa nhận từng giả vờ gõ phím khi sếp đi qua!'.",
                    "quote": "Câu trích dẫn ngầu lòi, ngắn gọn (1-2 câu), phong cách truyền cảm hứng hoặc vibe công sở, từ một người nổi tiếng thực tế (ví dụ: Steve Jobs, Oprah Winfrey, Albert Einstein), sáng tạo và không trùng quote phổ biến."
                  }
                  Đảm bảo trả về JSON hợp lệ, không thêm ký tự markdown, chỉ trả về chuỗi JSON thuần túy với 6 key trực tiếp như trên, nội dung sáng tạo và "đỉnh của chóp"!`
              }],
            }],
          }),
        }
      );
      if (!response.ok) {
        if (response.status === 429) {
          attempts++;
          const delay = Math.pow(2, attempts) * 1000;
          console.warn(`Rate limit hit, retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
      }
      const json = await response.json();
      let rawText = json.candidates[0].content.parts[0].text;
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      // Parse và chuẩn hóa dữ liệu
      let data = JSON.parse(rawText);
      if (typeof data !== 'object' || data === null || !data.dailyNumerology) {
        if (data && typeof data === 'object') {
          const possibleKeys = [lifePathNumber.toString(), profession];
          for (const key of possibleKeys) {
            if (data[key] && typeof data[key] === 'string') {
              data = { dailyNumerology: data[key] };
              break;
            }
          }
        }
        if (!data.dailyNumerology) {
          throw new Error('Invalid response format from Gemini');
        }
      }
      
      return {
        dailyNumerology: data.dailyNumerology || `Số ${lifePathNumber} hôm nay báo hiệu: Một ngày đầy bất ngờ, hãy đón nhận với nụ cười!`,
        weeklyNumerology: data.weeklyNumerology || `Tuần này, số ${lifePathNumber} khuyên bạn: Đừng ngại thử thách, vũ trụ luôn ủng hộ bạn!`,
        tarot: data.tarot || `Hôm nay lá bài Tarot của bạn là The Star: Hy vọng tràn đầy, cơ hội công việc đang đến gần!`,
        officeTip: data.officeTip || `${profession} cần biết: Viết email ngắn gọn với tiêu đề "Cần phản hồi: [Chủ đề]" để tăng tỷ lệ được đọc ngay!`,
        funFact: data.funFact || `Máy photocopy từng được gọi là "trùm drama" vì hay kẹt đúng lúc gấp!`,
        quote: data.quote || `"Thời gian là tài sản quý nhất, hãy dùng nó khôn ngoan." - Elon Musk`,
      };
    } catch (error) {
      console.error('Error fetching Gemini:', error);
      if (attempts === maxRetries - 1) return getFallbackResponse(profession, lifePathNumber);
      attempts++;
    }
  }
}

function getFallbackResponse(profession, lifePathNumber) {
  const effectiveLifePathNumber = lifePathNumber === 0 ? 1 : lifePathNumber;
  const quotes = [
    { text: `"Không có gì là không thể với một tâm trí sẵn sàng." - Napoleon Hill`, key: 'napoleon' },
    { text: `"Thành công là khả năng đi từ thất bại này đến thất bại khác mà không mất đi nhiệt huyết." - Winston Churchill`, key: 'churchill' },
    { text: `"Hãy làm việc chăm chỉ trong im lặng, để thành công làm tiếng ồn." - Frank Ocean`, key: 'ocean' },
    { text: `"Ý tưởng là khởi đầu, nhưng hành động mới là tất cả." - Walt Disney`, key: 'disney' },
    { text: `"Thời gian là tài sản quý nhất, hãy dùng nó khôn ngoan." - Elon Musk`, key: 'musk' },
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return {
    dailyNumerology: `Số ${effectiveLifePathNumber} hôm nay báo hiệu: Một ngày đầy bất ngờ, hãy đón nhận với nụ cười!`,
    weeklyNumerology: `Tuần này, số ${effectiveLifePathNumber} khuyên bạn: Đừng ngại thử thách, vũ trụ luôn ủng hộ bạn!`,
    tarot: `Hôm nay lá bài Tarot của bạn là The Star: Hy vọng tràn đầy, cơ hội công việc đang đến gần!`,
    officeTip: `${profession} cần biết: Viết email ngắn gọn với tiêu đề "Cần phản hồi: [Chủ đề]" để tăng tỷ lệ được đọc ngay!`,
    funFact: `Máy photocopy từng được gọi là "trùm drama" vì hay kẹt đúng lúc gấp!`,
    quote: randomQuote.text,
  };
}

export default defineEventHandler(async (event) => {
  const username = decodeURIComponent(event.node.req.headers['x-username'] || 'guest');
  const birthdateFromHeader = event.node.req.headers['x-birthdate'] || '';
  
  let profession = 'văn phòng chung';
  let lifePathNumber = 0;
  let birthdate = birthdateFromHeader;

  try {
    const db = await getDb();
    const user = await db.query('SELECT birthdate, profession FROM users WHERE username = $1', [username]).then(res => res[0]);

    if (!birthdate && user && user.birthdate) {
      birthdate = user.birthdate;
    }

    if (birthdate) {
      profession = (user && user.profession) || 'văn phòng chung';
      lifePathNumber = getLifePathNumber(birthdate);
    } else {
      console.warn(`No birthdate available for ${username}, using default lifePathNumber: 1`);
      lifePathNumber = 1;
    }
  } catch (dbError) {
    console.error('Database error:', dbError);
    lifePathNumber = 1;
  }

  return await getCachedDaily(username, profession, lifePathNumber);
});