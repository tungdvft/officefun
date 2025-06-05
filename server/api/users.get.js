import { setupDatabase } from '../db/sqlite';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const query = getQuery(event);
  const userId = query.id;
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;

  try {
    if (userId) {
      // Lấy thông tin một người dùng
      const user = await db.query(
        'SELECT id, email, fullname, birthdate, tokens, created_at, updated_at FROM users WHERE id = $1',
        [userId]
      ).then(res => res.rows[0]);

      if (!user) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Không tìm thấy người dùng',
        });
      }

      const transactions = await db.query(
        'SELECT id, user_id, amount, description, created_at FROM token_transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50',
        [userId]
      ).then(res => res.rows);

      return {
        success: true,
        data: {
          user,
          transactions,
        },
      };
    }

    // Lấy danh sách người dùng với phân trang (bỏ yêu cầu isAdmin)
    const totalResult = await db.query('SELECT COUNT(*) as total FROM users').then(res => res.rows[0]);
    const total = totalResult.total;
    const offset = (page - 1) * limit;

    const users = await db.query(
      'SELECT id, email, fullname, birthdate, tokens, created_at, updated_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    ).then(res => res.rows);

    return {
      success: true,
      data: {
        users,
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi lấy dữ liệu người dùng',
    });
  }
});