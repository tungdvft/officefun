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

    await db.run(`
      CREATE TABLE IF NOT EXISTS boss_last_reply (
        username TEXT PRIMARY KEY,
        data TEXT,
        timestamp TEXT
      )
    `);

    const result = await db.get(
      'SELECT data FROM boss_last_reply WHERE username = ?',
      [username]
    );

    if (!result) {
      return { data: null };
    }

    try {
      const parsedData = JSON.parse(result.data);
      return { data: { question: parsedData.question, reply: parsedData.reply } };
    } catch (parseError) {
      throw createError({
        statusCode: 500,
        message: 'Dữ liệu tin nhắn cuối không hợp lệ!',
      });
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message || 'Lỗi khi lấy dữ liệu tin nhắn cuối!',
    });
  }
});