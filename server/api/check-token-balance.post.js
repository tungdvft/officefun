import { setupDatabase } from '../db/sqlite';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const db = setupDatabase();
  const body = await readBody(event);
  const { userId } = body;

  if (!userId || !Number.isInteger(userId)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu hoặc sai userId',
    });
  }

  try {
    const stmt = db.prepare('SELECT tokens FROM users WHERE id = ?');
    const user = stmt.get(userId);

    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người dùng',
      });
    }

    const sufficient = user.tokens >= 10;

    return {
      status: 'success',
      sufficient,
      tokens: user.tokens,
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Lỗi khi kiểm tra số dư token',
    });
  }
});