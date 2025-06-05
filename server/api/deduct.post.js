import { defineEventHandler, readBody } from 'h3'
import { setupDatabase } from '../db/sqlite'

const db = setupDatabase()

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { userId, amount } = body

  if (!userId || !amount || amount !== 10) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request: userId and amount (10) are required'
    })
  }

  try {
    // Bắt đầu transaction
    db.exec('BEGIN')

    // Tìm user
    const userStmt = db.prepare('SELECT tokens FROM users WHERE id = $1')
    const user = userStmt.query(userId).then(res => res[0])

    if (!user) {
      db.exec('ROLLBACK')
      throw createError({
        statusCode: 404,
        statusMessage: 'User not found'
      })
    }

    if (user.tokens < amount) {
      db.exec('ROLLBACK')
      throw createError({
        statusCode: 400,
        statusMessage: 'Insufficient tokens'
      })
    }

    // Cập nhật tokens
    const updateStmt = db.prepare('UPDATE users SET tokens = tokens - $1 WHERE id = $2')
    updateStmt.run(amount, userId)

    // Lấy số dư tokens mới
    const updatedUser = userStmt.get(userId)

    // Commit transaction
    db.exec('COMMIT')

    return {
      success: true,
      remainingTokens: updatedUser.tokens
    }
  } catch (error) {
    db.exec('ROLLBACK')
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Failed to deduct tokens'
    })
  }
})