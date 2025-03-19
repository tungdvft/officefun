import { defineEventHandler, readBody, createError } from 'h3';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

async function checkDailyLimit(username, today) {
  const db = await getDb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS boss_chat_usage (
      username TEXT,
      date TEXT,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (username, date)
    )
  `);

  const record = await db.get(
    'SELECT count FROM boss_chat_usage WHERE username = ? AND date = ?',
    [username, today]
  );

  if (!record) {
    await db.run(
      'INSERT INTO boss_chat_usage (username, date, count) VALUES (?, ?, 0)',
      [username, today]
    );
    return 0;
  }
  return record.count;
}

async function incrementDailyLimit(username, today) {
  const db = await getDb();
  await db.run(
    'INSERT OR REPLACE INTO boss_chat_usage (username, date, count) VALUES (?, ?, COALESCE((SELECT count + 1 FROM boss_chat_usage WHERE username = ? AND date = ?), 1))',
    [username, today, username, today]
  );
}

async function saveLastReply(username, question, reply) {
  const db = await getDb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS boss_last_reply (
      username TEXT PRIMARY KEY,
      data TEXT,
      timestamp TEXT
    )
  `);
  await db.run(
    'INSERT OR REPLACE INTO boss_last_reply (username, data, timestamp) VALUES (?, ?, ?)',
    [username, JSON.stringify({ question, reply }), new Date().toISOString()]
  );
}

async function getUserGender(username) {
  const db = await getDb();
  const user = await db.get('SELECT gender FROM users WHERE username = ?', [username]);
  return user ? user.gender : 'Other'; // Mặc định 'Other' nếu không tìm thấy
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  const { message } = await readBody(event);
  const today = new Date().toISOString().split('T')[0];

  // Kiểm tra giới hạn
  const usageCount = await checkDailyLimit(username, today);
  if (usageCount >= 3) {
    throw createError({
      statusCode: 403,
      message: 'Hôm nay bạn đã dùng hết 3 lượt chat với Sếp, quay lại sau 0h nhé!'
    });
  }

  // Lấy gender của user
  const gender = await getUserGender(username);
  let address = 'mày'; // Mặc định
  if (gender === 'Male') address = 'chú mày';
  if (gender === 'Female') address = 'cô';

  const apiKey = process.env.GEMINI_API_KEY || '';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const prompt = `
    Bạn là ông sếp siêu thân thiện, hài hước như anh em trong văn phòng. Trả lời câu hỏi "${message}" ngắn gọn (2-3 câu), dí dỏm, ấm áp, kèm chút động viên. Xưng "anh" với người hỏi, gọi họ là "${address}", giữ vibe vui vẻ, tự nhiên, tránh lặp từ hay lan man!
  `;

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) throw new Error('API error');
    const data = await response.json();
    let bossReply = data.candidates[0].content.parts[0].text.trim();

    // Rút ngắn nếu dài
    bossReply = bossReply.split('.')[0] + '!';

    // Tăng số lượt sử dụng
    await incrementDailyLimit(username, today);
    // Lưu cả câu hỏi và câu trả lời
    await saveLastReply(username, message, bossReply);

    return { reply: bossReply };
  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    const fallbackReply = `Nghỉ hả ${address}? Ráng chút đi, anh bao trà sữa nha!`;
    await saveLastReply(username, message, fallbackReply);
    return { reply: fallbackReply };
  }
});