import { setupDatabase } from '../db/sqlite';

// API để trừ token khi user thực hiện request
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { userId, amount = 10, description } = body; // Mặc định amount là 10

  // Kiểm tra input
  if (!userId || !Number.isInteger(amount) || amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu hoặc sai thông tin userId hoặc amount',
    });
  }

  const db = await setupDatabase();

  try {
    // Bắt đầu transaction
    await db.run('BEGIN TRANSACTION');

    // Kiểm tra số dư token của user
    const user = await db.get('SELECT tokens FROM users WHERE id = ?', [userId]);
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy user',
      });
    }

    if (user.tokens < amount) {
      throw createError({
        statusCode: 400,
        statusMessage: `Số dư token không đủ (cần ${amount}, hiện có ${user.tokens})`,
      });
    }

    // Trừ token trong bảng users
    await db.run(
      'UPDATE users SET tokens = tokens - ? WHERE id = ?',
      [amount, userId]
    );

    // Ghi lại giao dịch vào bảng token_transactions
    await db.run(
      'INSERT INTO token_transactions (user_id, amount, description) VALUES (?, ?, ?)',
      [userId, -amount, description || 'API request']
    );

    // Commit transaction
    await db.run('COMMIT');

    return {
      status: 'success',
      message: `Đã trừ ${amount} token từ user ${userId}`,
      remainingTokens: user.tokens - amount,
    };
  } catch (error) {
    // Rollback transaction nếu có lỗi
    await db.run('ROLLBACK');
    console.error('Lỗi khi trừ token:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi xử lý giao dịch token',
    });
  }
});
