import { setupDatabase } from '../db/sqlite';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const body = await readBody(event);
  let { userId } = body;

  // Ép kiểu userId sang số
  userId = Number(userId);
  if (isNaN(userId) || userId <= 0) {
    console.error('Invalid userId:', body.userId);
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu hoặc sai userId (phải là số nguyên dương)',
    });
  }

  try {
    console.log('Checking token balance for userId:', userId);

    // Kiểm tra bảng users
    const tableExists = await db.query(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='users'"
    ).then(res => res.length > 0);
    if (!tableExists) {
      console.error('Table users does not exist');
      throw createError({
        statusCode: 500,
        statusMessage: 'Bảng users không tồn tại trong cơ sở dữ liệu',
      });
    }

    // Kiểm tra người dùng
    const user = await db.query('SELECT tokens FROM users WHERE id = $1', [userId]).then(res => res.rows[0]);
    if (!user) {
      console.error('User not found for userId:', userId);
      // Log tất cả user IDs hiện có để debug
      const users = await db.all('SELECT id FROM users');
      console.log('Available user IDs:', users.map(u => u.id));
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
    console.error('Lỗi kiểm tra số dư token:', {
      userId,
      error: error.message,
      stack: error.stack,
    });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Lỗi khi kiểm tra số dư token',
    });
  }
});