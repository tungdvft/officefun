import { defineEventHandler, readBody, createError } from 'h3';
import { setupDatabase } from '../../db/sqlite';

// Hàm kiểm tra định dạng ngày sinh
const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date) && date.getFullYear() >= 1900 && date.getFullYear() <= new Date().getFullYear();
};

// Hàm kiểm tra họ tên (hỗ trợ tiếng Việt)
const isValidFullname = (fullname) => {
  return typeof fullname === 'string' && fullname.trim().length > 0 && fullname.length <= 100 && /^[\p{L}\s]*$/u.test(fullname);
};

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const userId = event.context.params?.id;
  const body = await readBody(event);

  // 1. Kiểm tra userId
  if (!userId || isNaN(parseInt(userId))) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID người dùng không hợp lệ.',
    });
  }

  // 2. Kiểm tra dữ liệu đầu vào
  if (!isValidFullname(body.fullname)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Họ tên không hợp lệ. Phải là chuỗi, không quá 100 ký tự, và chỉ chứa chữ cái và khoảng trắng.',
    });
  }

  if (!body.birthdate || !isValidDate(body.birthdate)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ngày sinh không hợp lệ. Phải là định dạng yyyy-mm-dd và trong khoảng từ 1900 đến hiện tại.',
    });
  }

  if (body.tokens !== undefined && body.tokens !== null) {
    const tokens = parseInt(body.tokens, 10);
    if (isNaN(tokens) || tokens < 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tokens phải là số nguyên không âm.',
      });
    }
    body.tokens = tokens;
  }

  try {
    // 3. Bắt đầu giao dịch
    await db.query('BEGIN');

    // 4. Kiểm tra người dùng tồn tại và lấy tokens hiện tại
    const currentUser = await db.query('SELECT tokens FROM users WHERE id = $1', [userId]).then(res => res.rows[0]);
    if (!currentUser) {
      await db.query('ROLLBACK').catch((rollbackError) => {
        console.error('Rollback failed:', rollbackError);
      });
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người dùng.',
      });
    }

    // 5. Xác định giá trị tokens mới
    const newTokens = body.tokens !== undefined && body.tokens !== null ? body.tokens : (currentUser.tokens !== null ? currentUser.tokens : 200);

    // 6. Cập nhật thông tin người dùng
    const updateResult = await db.query(
      `UPDATE users SET 
        fullname = $1, 
        birthdate = $2,
        tokens = $3,
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $4`,
      [body.fullname, body.birthdate, newTokens, userId]
    );

    if (updateResult.changes === 0) {
      await db.query('ROLLBACK').catch((rollbackError) => {
        console.error('Rollback failed:', rollbackError);
      });
      throw createError({
        statusCode: 404,
        statusMessage: 'Không thể cập nhật thông tin người dùng.',
      });
    }

    // 7. Ghi giao dịch token nếu tokens thay đổi
    if (newTokens !== currentUser.tokens && currentUser.tokens !== null) {
      const tokenDifference = newTokens - currentUser.tokens;
      await db.query(
        'INSERT INTO token_transactions (user_id, amount, description) VALUES (?, ?, ?)',
        [userId, tokenDifference, 'Cập nhật tokens qua API']
      );
    } else if (currentUser.tokens === null && newTokens !== 200) {
      await db.query(
        'INSERT INTO token_transactions (user_id, amount, description) VALUES (?, ?, ?)',
        [userId, newTokens, 'Khởi tạo tokens']
      );
    }

    // 8. Lấy thông tin người dùng đã cập nhật
    const user = await db.query(
      'SELECT id, email, fullname, birthdate, tokens, created_at, updated_at FROM users WHERE id = $1',
      [userId]
    ).then(res => res.rows[0]);

    if (!user) {
      await db.query('ROLLBACK').catch((rollbackError) => {
        console.error('Rollback failed:', rollbackError);
      });
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người dùng sau khi cập nhật.',
      });
    }

    // 9. Hoàn tất giao dịch
    await db.query('COMMIT');

    return {
      success: true,
      user,
    };
  } catch (error) {
    // 10. Hoàn tác nếu có lỗi
    await db.queryXR('ROLLBACK').catch((rollbackError) => {
      console.error('Rollback failed:', rollbackError);
    });
    console.error('API Error:', {
      message: error.message,
      stack: error.stack,
      userId,
      body
    });
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server không xác định. Vui lòng thử lại sau.',
    });
  }
});