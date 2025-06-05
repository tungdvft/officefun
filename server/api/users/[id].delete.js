import { setupDatabase } from '../../db/sqlite';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const userId = event.context.params?.id;

  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu ID người dùng',
    });
  }

  try {
    // Kiểm tra người dùng tồn tại
    const user = await db.query('SELECT id FROM users WHERE id = $1', [userId]).then(res => res.rows[0]);
    if (!user) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Không tìm thấy người dùng',
      });
    }

    // Xóa người dùng (token_transactions sẽ tự động xóa do ON DELETE CASCADE)
    await db.query('DELETE FROM users WHERE id = $1', [userId]);

    return {
      success: true,
      message: 'Xóa người dùng thành công',
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi xóa người dùng',
    });
  }
});