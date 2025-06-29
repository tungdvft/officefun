import { setupDatabase } from '../db/sqlite';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const body = await readBody(event);
  let { userId, tokenCost = 10 } = body; // Mặc định tokenCost là 10

  // Ép kiểu userId sang số
  userId = Number(userId);
  tokenCost = Number(tokenCost);
  if (isNaN(userId) || userId <= 0 || isNaN(tokenCost) || tokenCost <= 0) {
    console.error('Invalid input:', { userId: body.userId, tokenCost: body.tokenCost });
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu hoặc sai userId/tokenCost (phải là số nguyên dương)',
    });
  }

  try {

    // Kiểm tra người dùng
    const user = await db.query('SELECT tokens FROM users WHERE id = $1', [userId]).then(res => res.rows[0]);
    if (!user) {
      console.error('User not found for userId:', userId);
      const users = await db.query('SELECT id FROM users').then(res => res.rows);
      console.log('Available user IDs:', users.map(u => u.id));
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người dùng',
      });
    }

    const sufficient = user.tokens >= tokenCost;

    return {
      success: true,
      sufficient,
      remainingTokens: user.tokens,
      message: sufficient ? `Người dùng có đủ ${tokenCost} token` : `Không đủ token, hiện có ${user.tokens} token`
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