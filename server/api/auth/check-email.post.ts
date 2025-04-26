import { setupDatabase } from '../../db/sqlite';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase()
  const { email } = await readBody(event)

  if (!email) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email là bắt buộc'
    })
  }

  try {
    // Kiểm tra email có tồn tại trong database không
    const user = await db.get(
      `SELECT 
        id, 
        is_google_account,
        email_verified
       FROM users 
       WHERE email = ?`, 
      [email]
    )

    return {
      exists: !!user,
      isGoogleAccount: user?.is_google_account === 1,
      isVerified: user?.email_verified === 1
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi khi kiểm tra email',
      data: error
    })
  }
})