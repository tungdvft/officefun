import { defineEventHandler, readBody } from 'h3';
import { setupDatabase } from '../db/sqlite';

/**
 * API handler to deduct tokens from a user's account and log the transaction
 * @param {object} event - H3 event object
 * @returns {object} Response with success status, remaining tokens, and message
 */
export default defineEventHandler(async (event) => {
  let db = null;
  try {
    // Initialize database connection
    db = await setupDatabase();

    // Read request body for userId, tokenCost, and description
    const { userId, tokenCost, description = 'Deducted for content access' } = await readBody(event);

    // Validate input
    if (!userId || !tokenCost || typeof tokenCost !== 'number' || tokenCost <= 0) {
      return {
        success: false,
        remainingTokens: null,
        message: 'Invalid input: userId and tokenCost (positive number) are required'
      };
    }

    // Begin transaction
    await db.query('BEGIN');

    // Check current tokens for the user
    const userResult = await db.query(
      'SELECT tokens FROM users WHERE id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      await db.query('ROLLBACK');
      return {
        success: false,
        remainingTokens: null,
        message: 'User not found'
      };
    }

    const currentTokens = userResult.rows[0].tokens;

    // Check if user has enough tokens
    if (currentTokens < tokenCost) {
      await db.query('ROLLBACK');
      return {
        success: false,
        remainingTokens: currentTokens,
        message: 'Không đủ token để thực hiện giao dịch'
      };
    }

    // Deduct tokens from users table
    const newTokens = currentTokens - tokenCost;
    await db.query(
      'UPDATE users SET tokens = $1 WHERE id = $2',
      [newTokens, userId]
    );

    // Log transaction in token_transactions table
    await db.query(
      'INSERT INTO token_transactions (user_id, amount, description, created_at) VALUES ($1, $2, $3, CURRENT_TIMESTAMP)',
      [userId, -tokenCost, description]
    );

    // Commit transaction
    await db.query('COMMIT');

    return {
      success: true,
      remainingTokens: newTokens,
      message: `Đã trừ ${tokenCost} token thành công`
    };
  } catch (error) {
    // Rollback transaction on error
    if (db) {
      await db.query('ROLLBACK');
    }
    console.error('Lỗi khi trừ token:', error);
    return {
      success: false,
      remainingTokens: null,
      message: `Lỗi: ${error.message || 'Không thể trừ token'}`
    };
  }
});