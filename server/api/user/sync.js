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

    const existingUser = await db.query('SELECT * FROM users WHERE id = $1', [cleanData.id]).then(res => res.rows[0]);

    let user;

    if (existingUser) {
      // Update existing user
      await db.query(
        `UPDATE users SET
          username = $1,
          email = $2,
          displayName = $3,
          birthdate = $4
        WHERE id = $5`,
        [
          cleanData.username,
          cleanData.email,
          cleanData.displayName,
          cleanData.birthdate,
          cleanData.id
        ]
      );

      // Fetch updated user
      user = await db.query('SELECT id, username, email, displayName, birthdate FROM users WHERE id = $1', [cleanData.id]).then(res => res.rows[0]);
    } else {
      // Create new user
      await db.query(
        `INSERT INTO users 
        (id, username, email, displayName, birthdate) 
        VALUES ($1, $2, $3, $4, $5)`,
        [
          cleanData.id,
          cleanData.username,
          cleanData.email,
          cleanData.displayName,
          cleanData.birthdate
        ]
      );

      // Grant 1000 tokens for new user
      await db.query(
        'INSERT INTO tokens (user_id, balance) VALUES ($1, $2)',
        [cleanData.id, 1000]
      );

      // Fetch newly created user
      user = await db.query('SELECT id, username, email, displayName, birthdate FROM users WHERE id = $1', [cleanData.id]).then(res => res.rows[0]);
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