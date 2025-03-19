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
    CREATE TABLE IF NOT EXISTS assistant_usage (
      username TEXT,
      date TEXT,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (username, date)
    )
  `);

  const record = await db.get(
    'SELECT count FROM assistant_usage WHERE username = ? AND date = ?',
    [username, today]
  );

  if (!record) {
    await db.run(
      'INSERT INTO assistant_usage (username, date, count) VALUES (?, ?, 0)',
      [username, today]
    );
    return 0;
  }
  return record.count;
}

async function incrementDailyLimit(username, today) {
  const db = await getDb();
  await db.run(
    'INSERT OR REPLACE INTO assistant_usage (username, date, count) VALUES (?, ?, COALESCE((SELECT count + 1 FROM assistant_usage WHERE username = ? AND date = ?), 1))',
    [username, today, username, today]
  );
}

async function saveLastPlan(username, plan) {
  const db = await getDb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS assistant_last_plan (
      username TEXT PRIMARY KEY,
      data TEXT,
      timestamp TEXT
    )
  `);
  await db.run(
    'INSERT OR REPLACE INTO assistant_last_plan (username, data, timestamp) VALUES (?, ?, ?)',
    [username, JSON.stringify({ plan }), new Date().toISOString()]
  );
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  const { calendarEvents, mood, goals } = await readBody(event);
  const today = new Date().toISOString().split('T')[0];

  // Kiểm tra giới hạn
  const usageCount = await checkDailyLimit(username, today);
  if (usageCount >= 2) {
    throw createError({
      statusCode: 403,
      message: 'Hôm nay bạn đã dùng hết 2 lượt tạo kế hoạch, quay lại sau 0h nhé!'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || '';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const prompt = `
    Bạn là trợ lý cá nhân AI thông minh, chuyên nghiệp. Dựa trên thông tin sau, hãy tạo một kế hoạch ngày chi tiết (~500 từ) cho người dùng "${username}":
    - Lịch sự kiện: ${JSON.stringify(calendarEvents || [])} (nếu không có, giả định ngày trống).
    - Tâm trạng hôm nay: "${mood || 'bình thường'}".
    - Mục tiêu: "${goals || 'không có cụ thể'}".
    Kế hoạch phải bao gồm:
    - Lịch trình cụ thể (giờ nào làm gì).
    - Lời khuyên cá nhân hóa dựa trên tâm trạng và mục tiêu.
    - Theo dõi tiến độ mục tiêu (nếu có).
    Viết bằng tiếng Việt, phong cách thân thiện, chuyên nghiệp, không lặp lại nội dung cũ.
    Trả về dưới dạng chuỗi văn bản thuần túy, không thêm ký tự markdown hay JSON wrapper.
  `;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lỗi từ Gemini API:', response.status, errorText);
      throw new Error('Lỗi từ Gemini API');
    }

    const data = await response.json();
    const plan = data.candidates[0].content.parts[0].text;

    // Tăng số lượt sử dụng
    await incrementDailyLimit(username, today);
    // Lưu kế hoạch cuối
    await saveLastPlan(username, plan);

    return { plan };
  } catch (error) {
    console.error('Lỗi chi tiết khi gọi Gemini API:', error.message);
    throw createError({
      statusCode: 500,
      message: 'Lỗi tạo kế hoạch từ Gemini API. Vui lòng thử lại sau!'
    });
  }
});