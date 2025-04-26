import { setupDatabase } from '../../db/sqlite';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const body = await readBody(event);

  // Kiểm tra dữ liệu đầu vào
  if (!body.email || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu email hoặc tên người dùng',
    });
  }

  try {
    // Bắt đầu giao dịch
    await db.run('BEGIN TRANSACTION');

    // Kiểm tra người dùng đã tồn tại
    let user = await db.get(
      'SELECT id, email, fullname, birthdate, tokens, avatar, is_google_account, email_verified FROM users WHERE email = ?',
      [body.email]
    );

    let isNewUser = false;

    if (!user) {
      // Tạo người dùng mới (không gán tokens ở bước này)
      const result = await db.run(
        `INSERT INTO users (
          email,
          fullname,
          avatar,
          is_google_account,
          email_verified
        ) VALUES (?, ?, ?, ?, ?)`,
        [body.email, body.name, body.picture || null, 1, 1]
      );

      // Lấy thông tin người dùng vừa tạo
      user = await db.get(
        'SELECT id, email, fullname, birthdate, tokens, avatar, is_google_account, email_verified FROM users WHERE id = ?',
        [result.lastID]
      );
      isNewUser = true;
    }

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Hoàn tất giao dịch
    await db.run('COMMIT');

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        birthdate: user.birthdate,
        avatar: user.avatar,
        is_google_account: user.is_google_account,
        email_verified: user.email_verified,
        tokens: user.tokens,
      },
      isNewUser,
      token,
    };
  } catch (error) {
    // Hoàn tác nếu có lỗi
    await db.run('ROLLBACK');
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi xử lý đăng nhập Google',
    });
  }
});