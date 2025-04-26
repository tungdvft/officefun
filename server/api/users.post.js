import { setupDatabase } from '../db/sqlite';
import { hash } from 'bcrypt';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const body = await readBody(event);

  // Validate input
  if (!body.email || !body.fullName || !body.birthdate || !body.password || !body.confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin bắt buộc',
    });
  }

  if (body.password !== body.confirmPassword) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Mật khẩu xác nhận không khớp',
    });
  }

  try {
    // Bắt đầu giao dịch
    await db.run('BEGIN TRANSACTION');

    // Kiểm tra email đã tồn tại
    const existingUser = await db.get('SELECT id FROM users WHERE email = ?', [body.email]);
    if (existingUser) {
      await db.run('ROLLBACK');
      throw createError({
        statusCode: 409,
        statusMessage: 'Email đã được sử dụng',
      });
    }

    // Hash mật khẩu
    const hashedPassword = await hash(body.password, 10);

    // Tạo người dùng mới
    const result = await db.run(
      'INSERT INTO users (email, fullname, birthdate, password, tokens) VALUES (?, ?, ?, ?, ?)',
      [body.email, body.fullName, body.birthdate, hashedPassword, 100]
    );

    // Ghi giao dịch khởi tạo tokens
    await db.run(
      'INSERT INTO token_transactions (user_id, amount, description) VALUES (?, ?, ?)',
      [result.lastID, 100, 'Khởi tạo tokens cho tài khoản mới']
    );

    // Hoàn tất giao dịch
    await db.run('COMMIT');

    return {
      success: true,
      message: 'Đăng ký thành công',
      userId: result.lastID,
    };
  } catch (error) {
    // Hoàn tác nếu có lỗi
    await db.run('ROLLBACK');
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi tạo tài khoản',
    });
  }
});