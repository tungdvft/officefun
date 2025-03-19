import { defineEventHandler, readBody, getQuery } from 'h3';
import { setupDatabase } from '../db/sqlite';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const method = event.node.req.method;

  if (method === 'GET') {
    const { user_id, date } = getQuery(event);

    if (!user_id || !date) {
      return { error: 'Missing user_id or date', status: 400 };
    }

    try {
      const count = await db.get(
        'SELECT COUNT(*) as count FROM tarot_interactions WHERE user_id = ? AND date = ?',
        [user_id, date]
      );
      return { count: count ? count.count : 0 };
    } catch (error) {
      console.error('GET /api/tarotLimit - Error fetching count:', error.message);
      throw createError({
        statusCode: 500,
        statusMessage: 'Server Error',
        message: `Failed to fetch tarot limit: ${error.message}`,
      });
    }
  }

  if (method === 'POST') {
    const { user_id, date } = await readBody(event);

    if (!user_id || !date) {
      return { error: 'Missing user_id or date', status: 400 };
    }

    try {
      const count = await db.get(
        'SELECT COUNT(*) as count FROM tarot_interactions WHERE user_id = ? AND date = ?',
        [user_id, date]
      );

      if (count.count >= 3) {
        return { count: count.count };
      }

      await db.run(
        'INSERT INTO tarot_interactions (user_id, date) VALUES (?, ?)',
        [user_id, date]
      );
      return { count: count.count + 1 };
    } catch (error) {
      console.error('POST /api/tarotLimit - Error saving interaction:', error.message);
      throw createError({
        statusCode: 500,
        statusMessage: 'Server Error',
        message: `Failed to save tarot interaction: ${error.message}`,
      });
    }
  }

  return { error: 'Method not allowed', status: 405 };
});