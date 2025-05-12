import { setupDatabase } from '../db/sqlite';
import { createError } from 'h3';
import fs from 'fs/promises';
import path from 'path';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  let { userId, amount = 10, description } = body;

  // Ép kiểu userId sang số
  userId = Number(userId);
  if (isNaN(userId) || userId <= 0) {
    console.error('Invalid userId:', body.userId);
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu hoặc sai userId (phải là số nguyên dương)',
    });
  }

  // Kiểm tra amount
  if (!Number.isInteger(amount) || amount <= 0) {
    console.error('Invalid amount:', amount);
    throw createError({
      statusCode: 400,
      statusMessage: 'Sai amount (phải là số nguyên dương)',
    });
  }

  const db = await setupDatabase();

  try {
    // Kiểm tra quyền ghi tệp
    const dbPath = path.resolve('./database.db');
    try {
      await fs.access(dbPath, fs.constants.W_OK);
    } catch (error) {
      console.error('Không có quyền ghi vào database.db:', error);
      throw createError({
        statusCode: 500,
        statusMessage: 'Cơ sở dữ liệu chỉ đọc, không thể ghi',
      });
    }

    // Bắt đầu transaction
    await db.run('BEGIN TRANSACTION');

    // Kiểm tra số dư token
    const user = await db.get('SELECT tokens FROM users WHERE id = ?', [userId]);
    if (!user) {
      console.error('User not found for userId:', userId);
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy user',
      });
    }

    if (user.tokens < amount) {
      console.error(`Insufficient tokens for userId ${userId}: need ${amount}, have ${user.tokens}`);
      throw createError({
        statusCode: 400,
        statusMessage: `Số dư token không đủ (cần ${amount}, hiện có ${user.tokens})`,
      });
    }

    // Trừ token
    await db.run('UPDATE users SET tokens = tokens - ? WHERE id = ?', [amount, userId]);

    // Ghi giao dịch
    await db.run(
      'INSERT INTO token_transactions (user_id, amount, description) VALUES (?, ?, ?)',
      [userId, -amount, description || 'API request']
    );

    // Commit
    await db.run('COMMIT');

    return {
      status: 'success',
      message: `Đã trừ ${amount} token từ user ${userId}`,
      remainingTokens: user.tokens - amount,
    };
  } catch (error) {
    // Rollback nếu có lỗi
    try {
      await db.run('ROLLBACK');
    } catch (rollbackError) {
      console.error('Lỗi khi rollback:', rollbackError);
    }
    console.error('Lỗi khi trừ token:', {
      userId,
      amount,
      error: error.message,
      stack: error.stack,
    });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage:
        error.code === 'SQLITE_READONLY'
          ? 'Cơ sở dữ liệu chỉ đọc, không thể ghi'
          : error.message || 'Lỗi khi xử lý giao dịch token',
    });
  }
});