
import { setupDatabase } from '../db/sqlite'
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken'

export default defineEventHandler(async (event) => {
  const db = await setupDatabase()
  const body = await readBody(event)

  // Validate request body
  if (!body.email || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Email và mật khẩu là bắt buộc'
    })
  }

  try {
    // Fetch user from database
    const user = await db.query('SELECT * FROM users WHERE email = $1', [body.email]).then(res => res.rows[0])
    
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email hoặc mật khẩu không đúng'
      })
    }

    // Check if user.password exists
    if (!user.password) {
      console.error('User password is missing in database for email:', body.email);
      throw createError({
        statusCode: 500,
        statusMessage: 'Lỗi hệ thống: Dữ liệu người dùng không hợp lệ'
      })
    }

    // Log the inputs for debugging (remove in production)
    console.log('body.password:', body.password);
    console.log('user.password:', user.password);

    // Compare passwords
    const passwordMatch = await compare(body.password, user.password)
    if (!passwordMatch) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Email hoặc mật khẩu không đúng'
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: body.remember ? '30d' : '1d' }
    )

    // Remove password from response
    const { password, ...userWithoutPassword } = user
    
    return {
      success: true,
      token,
      user: userWithoutPassword
    }
  } catch (error) {
    console.error('Login error:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi khi đăng nhập'
    })
  }
})
