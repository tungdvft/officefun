import { setupDatabase } from '../../db/sqlite'; // Bạn xác nhận đã import đúng
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const userId = parseInt(event.context.params?.id);

  // Kiểm tra userId chặt chẽ hơn
  if (!userId || isNaN(userId) || userId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'ID người dùng không hợp lệ',
    });
  }

  try {
    // Truy vấn lấy dữ liệu, đảm bảo định dạng ngày đúng
    const result = await db.query(
      `SELECT id, email, fullname, 
              TO_CHAR(birthdate, 'YYYY-MM-DD') AS birthdate, 
              tokens 
       FROM users 
       WHERE id = $1`,
      [userId]
    );

    console.log('Raw query result:', result.rows); // Log để debug

    const user = result.rows[0];
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Not Found',
        message: 'Không tìm thấy người dùng',
      });
    }

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
        birthdate: user.birthdate, // Đã định dạng thành YYYY-MM-DD
        tokens: user.tokens,
      },
    };
  } catch (error) {
    console.error('Error fetching user:', error); // Log lỗi chi tiết
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal Server Error',
      message: error.message || 'Lỗi khi lấy thông tin người dùng',
    });
  }
});