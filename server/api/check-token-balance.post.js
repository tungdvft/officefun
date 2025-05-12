import { setupDatabase } from '../db/sqlite';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase(); // Đảm bảo chờ setupDatabase hoàn tất
  const body = await readBody(event);
  let { userId } = body;

  // Ép kiểu userId sang số, chấp nhận cả chuỗi và số nguyên
  userId = Number(userId);
  if (isNaN(userId) || userId <= 0) {
    console.error('Invalid userId:', body.userId);
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu hoặc sai userId (phải là số nguyên dương)',
    });
  }

  try {
    console.log('Checking token balance for userId:', userId); // Log để debug
    const user = await db.get('SELECT tokens FROM users WHERE id = ?', [userId]);

    if (!user) {
      console.error('User not found for userId:', userId);
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