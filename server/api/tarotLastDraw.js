import { defineEventHandler, getQuery, createError } from 'h3';
import { setupDatabase } from '../db/sqlite.js'; // Điều chỉnh đường dẫn nếu cần

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const user_id = query.user_id;

  if (!user_id) {
    console.error('Missing user_id in query');
    throw createError({
      statusCode: 400,
      message: 'Thiếu user_id trong query!',
    });
  }

  try {
    const db = await setupDatabase();
    const result = await db.get(
      'SELECT data FROM tarot_last_draw WHERE user_id = ?',
      [user_id]
    );

    if (!result || !result.data) {
      return { data: null };
    }

    try {
      const parsedData = JSON.parse(result.data);
      return { data: parsedData };
    } catch (parseError) {
      console.error(`Error parsing JSON data for user_id ${user_id}:`, parseError.message);
      return { data: null }; // Trả về null thay vì throw error
    }
  } catch (error) {
    console.error(`Error fetching last tarot draw for user_id ${user_id}:`, error.message);
    throw createError({
      statusCode: 500,
      message: error.message || 'Lỗi khi lấy dữ liệu Tarot cuối cùng!',
    });
  }
});