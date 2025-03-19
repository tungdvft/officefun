import { defineEventHandler, readBody } from 'h3';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

async function saveLastDraw(user_id, tarotResult) {
  const db = await getDb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS tarot_last_draw (
      user_id TEXT PRIMARY KEY,
      data TEXT,
      timestamp TEXT
    )
  `);
  await db.run(
    'INSERT OR REPLACE INTO tarot_last_draw (user_id, data, timestamp) VALUES (?, ?, ?)',
    [user_id, JSON.stringify(tarotResult), new Date().toISOString()]
  );
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { user_id } = body;
  const apiKey = process.env.GEMINI_API_KEY || 'YOUR_API_KEY_HERE';

  try {
    const timestamp = new Date().toISOString();
    const prompt = `
      Tạo một trải bài Tarot 3 lá (Quá khứ - Hiện tại - Tương lai) cho người dùng, dùng ID: ${user_id} để tạo sự ngẫu nhiên tại thời điểm ${timestamp}.
      Trả về đúng 4 dòng theo định dạng sau, KHÔNG thêm text thừa hay chèn ID vào kết quả:
      Quá khứ: [Tên lá bài] - [Ý nghĩa chi tiết, tích cực hoặc trung lập, khoảng 15-20 từ]
      Hiện tại: [Tên lá bài] - [Ý nghĩa chi tiết, tích cực hoặc trung lập, khoảng 15-20 từ]
      Tương lai: [Tên lá bài] - [Ý nghĩa chi tiết, tích cực hoặc trung lập, khoảng 15-20 từ]
      Diễn giải tổng quát: [Diễn giải chi tiết, sáng tạo, đậm chất tâm linh, dựa trên 3 lá bài vừa chọn, mang tính khích lệ, khoảng 120-130 từ để tổng kết quả đạt 150-160 từ, tránh tiêu cực]
      Chọn ngẫu nhiên 3 lá bài KHÁC NHAU từ 22 lá Major Arcana (The Fool, The Magician, The High Priestess, The Empress, The Emperor, The Hierophant, The Lovers, The Chariot, Strength, The Hermit, Wheel of Fortune, Justice, The Hanged Man, Death, Temperance, The Devil, The Tower, The Star, The Moon, The Sun, Judgement, The World).
      Đảm bảo không trùng lặp trong 3 vị trí, giữ ngôn ngữ huyền bí, sâu sắc, truyền cảm hứng tâm linh, tránh lặp từ hay lan man.
    `;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} - ${await response.text()}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;

    const lines = responseText.split('\n').filter(line => line.trim());
    const tarotResult = {
      past: lines.find(l => l.startsWith('Quá khứ:'))?.replace('Quá khứ: ', '') || 'The Empress - Sự sáng tạo và nuôi dưỡng đã gieo mầm cho những giá trị thiêng liêng trong linh hồn bạn.',
      present: lines.find(l => l.startsWith('Hiện tại:'))?.replace('Hiện tại: ', '') || 'The Star - Ánh sao hy vọng đang soi sáng, dẫn bạn qua bóng tối bằng trực giác và niềm tin.',
      future: lines.find(l => l.startsWith('Tương lai:'))?.replace('Tương lai: ', '') || 'The World - Vũ trụ hoàn thành lời hứa, mang đến sự viên mãn và kết nối với định mệnh cao cả.',
      interpretation: lines.find(l => l.startsWith('Diễn giải tổng quát:'))?.replace('Diễn giải tổng quát: ', '') || 'Từ những hạt giống thiêng liêng được gieo trong quá khứ bởi bàn tay sáng tạo của linh hồn, bạn đã vun đắp một nền tảng vững chắc. Hiện tại, ánh sao định mệnh rực rỡ trên bầu trời tâm thức, dẫn bạn qua những thử thách bằng trực giác sâu thẳm và niềm tin mãnh liệt. Tương lai mở ra như một vòng tròn hoàn hảo, nơi vũ trụ dang tay ôm lấy bạn, ban tặng sự viên mãn và hòa quyện linh hồn bạn vào vũ điệu vĩnh cửu của ánh sáng, nơi mọi giấc mơ đều trở thành hiện thực trong sự kết nối thiêng liêng với nguồn năng lượng thần thánh.',
    };

    const cards = [
      tarotResult.past.split(' - ')[0],
      tarotResult.present.split(' - ')[0],
      tarotResult.future.split(' - ')[0],
    ];
    if (new Set(cards).size !== 3) {
      console.warn('Duplicate cards detected, falling back to default.');
      tarotResult = {
        past: 'The Empress - Sự sáng tạo và nuôi dưỡng đã gieo mầm cho những giá trị thiêng liêng trong linh hồn bạn.',
        present: 'The Star - Ánh sao hy vọng đang soi sáng, dẫn bạn qua bóng tối bằng trực giác và niềm tin.',
        future: 'The World - Vũ trụ hoàn thành lời hứa, mang đến sự viên mãn và kết nối với định mệnh cao cả.',
        interpretation: 'Từ những hạt giống thiêng liêng được gieo trong quá khứ bởi bàn tay sáng tạo của linh hồn, bạn đã vun đắp một nền tảng vững chắc. Hiện tại, ánh sao định mệnh rực rỡ trên bầu trời tâm thức, dẫn bạn qua những thử thách bằng trực giác sâu thẳm và niềm tin mãnh liệt. Tương lai mở ra như một vòng tròn hoàn hảo, nơi vũ trụ dang tay ôm lấy bạn, ban tặng sự viên mãn và hòa quyện linh hồn bạn vào vũ điệu vĩnh cửu của ánh sáng, nơi mọi giấc mơ đều trở thành hiện thực trong sự kết nối thiêng liêng với nguồn năng lượng thần thánh.',
      };
    }

    // Lưu lần rút cuối
    await saveLastDraw(user_id, tarotResult);

    return tarotResult;
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    const fallbackResult = {
      past: 'The Empress - Sự sáng tạo và nuôi dưỡng đã gieo mầm cho những giá trị thiêng liêng trong linh hồn bạn.',
      present: 'The Star - Ánh sao hy vọng đang soi sáng, dẫn bạn qua bóng tối bằng trực giác và niềm tin.',
      future: 'The World - Vũ trụ hoàn thành lời hứa, mang đến sự viên mãn và kết nối với định mệnh cao cả.',
      interpretation: 'Từ những hạt giống thiêng liêng được gieo trong quá khứ bởi bàn tay sáng tạo của linh hồn, bạn đã vun đắp một nền tảng vững chắc. Hiện tại, ánh sao định mệnh rực rỡ trên bầu trời tâm thức, dẫn bạn qua những thử thách bằng trực giác sâu thẳm và niềm tin mãnh liệt. Tương lai mở ra như một vòng tròn hoàn hảo, nơi vũ trụ dang tay ôm lấy bạn, ban tặng sự viên mãn và hòa quyện linh hồn bạn vào vũ điệu vĩnh cửu của ánh sáng, nơi mọi giấc mơ đều trở thành hiện thực trong sự kết nối thiêng liêng với nguồn năng lượng thần thánh.',
    };
    await saveLastDraw(user_id, fallbackResult); // Lưu cả khi lỗi
    return fallbackResult;
  }
});