import { defineEventHandler, createError } from 'h3';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  try {
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });
    return db;
  } catch (error) {
    console.error('Error opening database:', error.message);
    throw createError({
      statusCode: 500,
      message: 'Không thể kết nối database!',
    });
  }
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';

  try {
    const db = await getDb();

    // Tạo bảng nếu chưa có
    await db.run(`
      CREATE TABLE IF NOT EXISTS assistant_last_plan (
        username TEXT PRIMARY KEY,
        data TEXT,
        timestamp TEXT
      )
    `);

    const result = await db.get(
      'SELECT data FROM assistant_last_plan WHERE username = ?',
      [username]
    );

    if (!result) {
      return { data: null };
    }

    try {
      const parsedData = JSON.parse(result.data);
      return { data: parsedData.plan };
    } catch (parseError) {
      throw createError({
        statusCode: 500,
        message: 'Dữ liệu kế hoạch cuối cùng không hợp lệ!',
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Lỗi khi lấy dữ liệu kế hoạch cuối cùng!',
    });
  }
});