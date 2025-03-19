import { defineEventHandler, getQuery, createError } from 'h3';
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
  const query = getQuery(event); // Lấy query params đúng cách trong H3
  const user_id = query.user_id;

  if (!user_id) {
    console.error('Missing user_id in query');
    throw createError({
      statusCode: 400,
      message: 'Thiếu user_id trong query!',
    });
  }


  try {
    const db = await getDb();
    const result = await db.get(
      'SELECT data FROM tarot_last_draw WHERE user_id = ?',
      [user_id]
    );

    if (!result) {
      return { data: null };
    }


    try {
      const parsedData = JSON.parse(result.data);
      return { data: parsedData };
    } catch (parseError) {
      console.error(`Error parsing JSON data for user_id ${user_id}:`, parseError.message);
      throw createError({
        statusCode: 500,
        message: 'Dữ liệu Tarot cuối cùng không hợp lệ!',
      });
    }
  } catch (error) {
    console.error(`Error fetching last tarot draw for user_id ${user_id}:`, error.message);
    throw createError({
      statusCode: 500,
      message: error.message || 'Lỗi khi lấy dữ liệu Tarot cuối cùng!',
    });
  }
});