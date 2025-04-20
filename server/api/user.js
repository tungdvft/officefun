// api/user.js
import { defineEventHandler, readBody, getQuery, getRouterParams } from 'h3'
import { setupDatabase } from '../db/sqlite'

export default defineEventHandler(async (event) => {
  const method = event.node.req.method
  const db = await setupDatabase()

  try {
    // Tạo bảng users nếu chưa có
    await db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        birthdate TEXT,
        gender TEXT,
        profession TEXT,
        displayName TEXT,
        createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
        updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // GET - Lấy danh sách users hoặc user cụ thể
    if (method === 'GET') {
      const { id } = getRouterParams(event) || {}
      const query = getQuery(event)
      
      // Lấy user theo ID
      if (id) {
        const user = await db.get('SELECT * FROM users WHERE id = ?', [id])
        if (!user) {
          throw createError({ statusCode: 404, message: 'User not found' })
        }
        return user
      }
      
      // Lấy user theo username
      if (query.username) {
        const user = await db.get('SELECT * FROM users WHERE username = ?', [query.username])
        if (!user) {
          throw createError({ statusCode: 404, message: 'User not found' })
        }
        return user
      }
      
      // Lấy tất cả users (có phân trang)
      const page = parseInt(query.page) || 1
      const limit = parseInt(query.limit) || 10
      const offset = (page - 1) * limit
      
      const users = await db.all('SELECT * FROM users LIMIT ? OFFSET ?', [limit, offset])
      const total = await db.get('SELECT COUNT(*) as count FROM users')
      
      return {
        data: users,
        pagination: {
          total: total.count,
          page,
          limit,
          totalPages: Math.ceil(total.count / limit)
        }
      }
    }

    // POST - Tạo user mới
    if (method === 'POST') {
      const body = await readBody(event)
      const { username, birthdate, gender, profession, displayName } = body

      // Validate required fields
      if (!username || !birthdate || !gender) {
        throw createError({ statusCode: 400, message: 'Missing required fields' })
      }

      // Check if username exists
      const existingUser = await db.get('SELECT id FROM users WHERE username = ?', [username])
      if (existingUser) {
        throw createError({ statusCode: 409, message: 'Username already exists' })
      }

      // Insert new user
      const result = await db.run(
        'INSERT INTO users (username, birthdate, gender, profession, displayName) VALUES (?, ?, ?, ?, ?)',
        [username, birthdate, gender, profession || null, displayName || username]
      )

      return {
        success: true,
        id: result.lastID,
        message: 'User created successfully'
      }
    }

    // PUT - Cập nhật user
    if (method === 'PUT') {
      const { id } = getRouterParams(event)
      const body = await readBody(event)
      const { username, birthdate, gender, profession, displayName } = body

      // Check if user exists
      const existingUser = await db.get('SELECT id FROM users WHERE id = ?', [id])
      if (!existingUser) {
        throw createError({ statusCode: 404, message: 'User not found' })
      }

      // Check if new username exists (if changed)
      if (username && username !== existingUser.username) {
        const usernameExists = await db.get('SELECT id FROM users WHERE username = ? AND id != ?', [username, id])
        if (usernameExists) {
          throw createError({ statusCode: 409, message: 'Username already taken' })
        }
      }

      // Update user
      await db.run(
        `UPDATE users SET 
          username = COALESCE(?, username),
          birthdate = COALESCE(?, birthdate),
          gender = COALESCE(?, gender),
          profession = ?,
          displayName = COALESCE(?, displayName),
          updatedAt = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [username, birthdate, gender, profession || null, displayName, id]
      )

      return {
        success: true,
        message: 'User updated successfully'
      }
    }

    // DELETE - Xóa user
    if (method === 'DELETE') {
      const { id } = getRouterParams(event)

      // Check if user exists
      const existingUser = await db.get('SELECT id FROM users WHERE id = ?', [id])
      if (!existingUser) {
        throw createError({ statusCode: 404, message: 'User not found' })
      }

      // Delete user and related tokens
      await db.run('DELETE FROM users WHERE id = ?', [id])
      await db.run('DELETE FROM tokens WHERE user_id = ?', [id])

      return {
        success: true,
        message: 'User deleted successfully'
      }
    }

    // PATCH - Cập nhật một phần thông tin user
    if (method === 'PATCH') {
      const { id } = getRouterParams(event)
      const body = await readBody(event)

      // Check if user exists
      const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [id])
      if (!existingUser) {
        throw createError({ statusCode: 404, message: 'User not found' })
      }

      // Validate username if being updated
      if (body.username && body.username !== existingUser.username) {
        const usernameExists = await db.get('SELECT id FROM users WHERE username = ? AND id != ?', [body.username, id])
        if (usernameExists) {
          throw createError({ statusCode: 409, message: 'Username already taken' })
        }
      }

      // Build dynamic update query
      const fieldsToUpdate = Object.keys(body).filter(key => key in existingUser)
      if (fieldsToUpdate.length === 0) {
        throw createError({ statusCode: 400, message: 'No valid fields to update' })
      }

      const setClause = fieldsToUpdate.map(field => `${field} = ?`).join(', ')
      const values = fieldsToUpdate.map(field => body[field])
      values.push(id)

      await db.run(
        `UPDATE users SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`,
        values
      )

      return {
        success: true,
        message: 'User partially updated successfully'
      }
    }

    throw createError({ statusCode: 405, message: 'Method not allowed' })
  } catch (error) {
    console.error('User API error:', error)
    return error
  }
})