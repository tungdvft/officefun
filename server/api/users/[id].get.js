import { setupDatabase } from '../../db/sqlite';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const userId = event.context.params?.id;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Thiếu ID người dùng'
    });
  }

  try {
    const user = await db.query('SELECT id, email, fullname, birthdate, tokens FROM users WHERE id = $1', [userId]).then(res => res.rows[0]);
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Không tìm thấy người dùng'
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        birthdate: user.birthdate,
        tokens: user.tokens
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Lỗi khi lấy thông tin người dùng'
    });
  }
});