// api/user.js
import { defineEventHandler, readBody, getQuery } from 'h3';
import { setupDatabase } from '../db/sqlite';

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;

  try {
    const db = await setupDatabase();

    // Tạo bảng users nếu chưa có
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        birthdate TEXT,
        gender TEXT,
        profession TEXT,  -- Cột này không bắt buộc
        displayName TEXT
      )
    `);

    if (method === 'POST') {
      const body = await readBody(event);
      const { username, birthdate, gender, profession, displayName } = body;

      // Kiểm tra các trường bắt buộc (bỏ profession)
      if (!username || !birthdate || !gender) {
        return { error: 'Missing required fields' };
      }

      // Kiểm tra username đã tồn tại chưa
      const existingUser = await db.get('SELECT username FROM users WHERE username = ?', [username]);
      if (existingUser) {
        return { error: 'Username already exists' };
      }

      const result = await db.run(
        'INSERT INTO users (username, birthdate, gender, profession, displayName) VALUES (?, ?, ?, ?, ?)',
        [username, birthdate, gender, profession || null, displayName || username] // profession có thể là null
      );
      return { success: true, id: result.lastID };
    } else if (method === 'GET') {
      const query = getQuery(event);
      const username = query.username;

      if (!username) {
        return { error: 'Username is required' };
      }

      const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

      if (!user) {
        return { error: 'User not found' };
      }
      return {
        id: user.id,
        username: user.username,
        birthdate: user.birthdate,
        gender: user.gender,
        profession: user.profession, // Có thể là null
        displayName: user.displayName,
      };
    } // Thêm vào api/user.js
    else if (method === 'PUT') {
      const body = await readBody(event);
      const { userId, amount } = body;
      
      if (!userId || amount === undefined) {
        return { error: 'Missing required fields' };
      }

      // Kiểm tra user có trong bảng tokens chưa
      const tokenRecord = await db.get('SELECT * FROM tokens WHERE user_id = ?', [userId]);
      
      if (!tokenRecord) {
        // Nếu chưa có, tạo mới với số dư ban đầu
        await db.run(
          'INSERT INTO tokens (user_id, balance) VALUES (?, ?)',
          [userId, amount]
        );
      } else {
        // Nếu đã có, cập nhật số dư
        await db.run(
          'UPDATE tokens SET balance = balance + ?, last_updated = CURRENT_TIMESTAMP WHERE user_id = ?',
          [amount, userId]
        );
      }
  
  return { success: true };
}

    return { error: 'Method not allowed' };
  } catch (error) {
    console.error('API /api/user - Server error:', error);
    return { error: 'Server error', message: error.message };
  }
});