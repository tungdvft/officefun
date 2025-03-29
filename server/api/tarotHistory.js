import { defineEventHandler, createError, getQuery } from 'h3';
import { setupDatabase } from '../db/sqlite.js';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const query = getQuery(event);
  const { user_id, date } = query;

  // Kiểm tra user_id và date
  if (!user_id || typeof user_id !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing or invalid user_id: user_id must be a non-empty string',
    });
  }

  if (!date || typeof date !== 'string') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing or invalid date: date must be a non-empty string',
    });
  }

  try {
    const history = await db.all(
      'SELECT * FROM tarot_history WHERE user_id = ? AND date = ?',
      [user_id, date]
    );

    // Parse dữ liệu từ JSON
    const parsedHistory = history.map(entry => {
      try {
        return {
          ...entry,
          data: JSON.parse(entry.data),
        };
      } catch (error) {
        console.error(`Error parsing history data for entry ${entry.id}:`, error.message);
        return {
          ...entry,
          data: null,
        };
      }
    });

    return parsedHistory;
  } catch (error) {
    console.error('Error fetching tarot history:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch tarot history: ${error.message}`,
    });
  }
});