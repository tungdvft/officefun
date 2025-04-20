import { defineEventHandler, getQuery } from 'h3'
import { setupDatabase } from '../db/sqlite'

export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event)
  
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID is required'
    })
  }

  try {
    const db = await setupDatabase()
    
    // Kiểm tra xem user có tồn tại không
    const userExists = await db.get('SELECT id FROM users WHERE id = ?', [userId])
    if (!userExists) {
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    // Lấy thông tin token, nếu không có sẽ tạo mới
    let tokenInfo = await db.get('SELECT * FROM tokens WHERE user_id = ?', [userId])
    
    if (!tokenInfo) {
      // Tạo mới token record với số dư mặc định 1000
      await db.run(
        'INSERT INTO tokens (user_id, balance) VALUES (?, ?)',
        [userId, 1000]
      )
      tokenInfo = { user_id: userId, balance: 1000 }
    }

    return tokenInfo
  } catch (error) {
    console.error('Token API error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: error.message
    })
  }
})