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
    console.log('Bắt đầu giao dịch');
    await db.query('BEGIN');

    console.log('Kiểm tra email:', body.email);
    const existingUser = await db.query('SELECT id FROM users WHERE email = $1', [body.email]);
    if (existingUser.rows.length > 0) {
      console.log('Email đã tồn tại');
       console.log(existingUser);
      await db.query('ROLLBACK');
      throw createError({
        statusCode: 409,
        statusMessage: 'Email đã được sử dụng',
      });
    }

    console.log('Hash mật khẩu');
    const hashedPassword = await hash(body.password, 10);

    console.log('Tạo người dùng mới');
    const result = await db.query(
      'INSERT INTO users (email, fullname, birthdate, password, tokens) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [body.email, body.fullName, body.birthdate, hashedPassword, 100]
    );

    console.log('Ghi giao dịch tokens');
    console.log(result);
    await db.query(
      'INSERT INTO token_transactions (user_id, amount, description) VALUES ($1, $2, $3)',
      [result.rows[0].id, 200, 'Khởi tạo tokens cho tài khoản mới']
    );

    console.log('Hoàn tất giao dịch');
    await db.query('COMMIT');

    return {
      success: true,
      message: 'Đăng ký thành công',
      userId: result.lastID,
    };
  } catch (error) {
    console.error('Lỗi trong quá trình xử lý:', error);
    try {
      await db.query('ROLLBACK');
    } catch (rollbackError) {
      console.error('Rollback thất bại:', rollbackError.message);
    }
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi tạo tài khoản',
    });
  }
  // Xóa khối finally hoặc không gọi db.close()
});