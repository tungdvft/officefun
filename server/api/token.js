import { defineEventHandler, getQuery } from 'h3';
import { setupDatabase } from '../db/sqlite';

export default defineEventHandler(async (event) => {
  const { userId } = getQuery(event);
  
  if (!userId) {
    return { error: 'User ID is required' };
  }

  try {
    const db = await setupDatabase();
    const tokenInfo = await db.get(
      'SELECT balance FROM tokens WHERE user_id = ?',
      [userId]
    );

    return tokenInfo || { balance: 1000 }; // Trả về 1000 nếu là user mới
  } catch (error) {
    console.error('API /api/tokens - Server error:', error);
    return { error: 'Server error', message: error.message };
  }
});