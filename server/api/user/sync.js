import { setupDatabase } from '../../db/sqlite';
import { createError } from 'h3';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const db = await setupDatabase();

  try {
    // Convert empty values to NULL
    const cleanData = {
      id: body.id || null,
      username: body.username || null, // Frontend does not send username, so this will be null
      email: body.email || null,
      displayName: body.displayName || null,
      birthdate: body.birthdate || null // Đảm bảo định dạng YYYY-MM-DD nếu có
    };

    // Validate required fields
    if (!cleanData.id || !cleanData.email) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: id or email'
      });
    }

    const existingUser = await db.get('SELECT * FROM users WHERE id = ?', [cleanData.id]);

    let user;

    if (existingUser) {
      // Update existing user
      await db.run(
        `UPDATE users SET
          username = ?,
          email = ?,
          displayName = ?,
          birthdate = ?
        WHERE id = ?`,
        [
          cleanData.username,
          cleanData.email,
          cleanData.displayName,
          cleanData.birthdate,
          cleanData.id
        ]
      );

      // Fetch updated user
      user = await db.get('SELECT id, username, email, displayName, birthdate FROM users WHERE id = ?', [cleanData.id]);
    } else {
      // Create new user
      await db.run(
        `INSERT INTO users 
        (id, username, email, displayName, birthdate) 
        VALUES (?, ?, ?, ?, ?)`,
        [
          cleanData.id,
          cleanData.username,
          cleanData.email,
          cleanData.displayName,
          cleanData.birthdate
        ]
      );

      // Grant 1000 tokens for new user
      await db.run(
        'INSERT INTO tokens (user_id, balance) VALUES (?, ?)',
        [cleanData.id, 1000]
      );

      // Fetch newly created user
      user = await db.get('SELECT id, username, email, displayName, birthdate FROM users WHERE id = ?', [cleanData.id]);
    }

    // Return success and user data
    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName || '',
        birthdate: user.birthdate || null
      }
    };
  } catch (error) {
    console.error('Database error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Database operation failed: ' + (error.message || 'Unknown error')
    });
  }
});