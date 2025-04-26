import { setupDatabase } from '../../db/sqlite';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const userId = event.context.params?.id;
  const body = await readBody(event);

  // Kiểm tra userId
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu ID người dùng',
    });
  }

  // Kiểm tra dữ liệu đầu vào
  if (!body.fullname || !body.birthdate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Họ tên và ngày sinh là bắt buộc',
    });
  }

  // Kiểm tra tokens nếu được cung cấp
  if (body.tokens !== undefined) {
    if (!Number.isInteger(body.tokens) || body.tokens < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tokens phải là số nguyên không âm',
      });
    }
  }

  try {
    // Bắt đầu giao dịch
    await db.run('BEGIN TRANSACTION');

    // Lấy số dư tokens hiện tại
    const currentUser = await db.get('SELECT tokens FROM users WHERE id = ?', [userId]);
    if (!currentUser) {
      await db.run('ROLLBACK');
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người dùng',
      });
    }

    // Xác định giá trị tokens mới
    let newTokens = body.tokens !== undefined ? body.tokens : currentUser.tokens;
    if (newTokens === null || newTokens === undefined) {
      newTokens = 100; // Gán 100 tokens mặc định nếu chưa có
    }

    // Cập nhật thông tin người dùng
    await db.run(
      `UPDATE users SET 
        fullname = ?, 
        birthdate = ?,
        tokens = ?,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [body.fullname, body.birthdate, newTokens, userId]
    );

    // Ghi giao dịch token nếu tokens thay đổi hoặc được khởi tạo
    if (newTokens !== currentUser.tokens) {
      const tokenDifference = newTokens - (currentUser.tokens || 0);
      await db.run(
        'INSERT INTO token_transactions (user_id, amount, description) VALUES (?, ?, ?)',
        [userId, tokenDifference, currentUser.tokens === null ? 'Khởi tạo tokens' : 'Cập nhật tokens qua API']
      );
    }

    // Lấy thông tin người dùng đã cập nhật
    const user = await db.get(
      'SELECT id, email, fullname, birthdate, tokens, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (!user) {
      await db.run('ROLLBACK');
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người dùng',
      });
    }

    // Hoàn tất giao dịch
    await db.run('COMMIT');

    return {
      success: true,
      user,
    };
  } catch (error) {
    // Hoàn tác nếu có lỗi
    await db.run('ROLLBACK');
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi cập nhật thông tin người dùng',
    });
  }
});