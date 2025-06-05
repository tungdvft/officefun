// api/numerology/results.js
import { defineEventHandler, readBody, createError } from 'h3';
import setupDatabase from '../../db/sqlite.js'; // Điều chỉnh đường dẫn tùy theo cấu trúc project của mày

// Khởi tạo database
const dbPromise = setupDatabase();

export default defineEventHandler(async (event) => {
  const method = event.node.req.method;
  const username = event.node.req.headers['x-username'] || 'guest';
  const db = await dbPromise;

  if (method === 'POST') {
    const { type, result } = await readBody(event);
    if (!type || !result) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin: type và result là bắt buộc.',
      });
    }

    await db.run(
      'INSERT INTO numerology_results (username, type, result) VALUES (?, ?, ?)',
      [username, type, JSON.stringify(result)]
    );
    return { success: true };
  }

  if (method === 'GET') {
    const results = await db.query(
      'SELECT type, result FROM numerology_results WHERE username = ?$1ORDER BY created_at DESC',
      [username]
    ).then(res => res.rows);
    const formattedResults = {};
    results.forEach(row => {
      formattedResults[row.type] = JSON.parse(row.result);
    });
    return formattedResults;
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method không được hỗ trợ.',
  });
});