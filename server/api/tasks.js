import { defineEventHandler, readBody, getQuery } from 'h3';
import { setupDatabase } from '../db/sqlite';

export default defineEventHandler(async (event) => {
  const db = await setupDatabase();
  const method = event.node.req.method;

  if (method === 'GET') {
    const { user_id } = getQuery(event);

    try {
      const tasks = await db.all('SELECT * FROM tasks WHERE user_id = ?', [user_id]);
      return tasks || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      throw error;
    }
  }

  if (method === 'POST') {
    const body = await readBody(event);
    const { user_id, title, description, due_date } = body;

    try {
      const result = await db.run(
        'INSERT INTO tasks (user_id, title, description, due_date) VALUES (?, ?, ?, ?)',
        [user_id, title, description, due_date]
      );
      return { success: true, id: result.lastID };
    } catch (error) {
      console.error('POST /api/tasks - Error inserting task:', error);
      throw error;
    }
  }

  if (method === 'PUT') {
    const body = await readBody(event);
    const { id, user_id, status } = body;

    try {
      const result = await db.run(
        'UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?',
        [status, id, user_id]
      );
      if (result.changes === 0) {
        throw new Error('Task not found or not authorized');
      }
      return { success: true };
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  }

  if (method === 'DELETE') {
    const body = await readBody(event);
    const { id, user_id } = body;

    try {
      const result = await db.run(
        'DELETE FROM tasks WHERE id = ? AND user_id = ?',
        [id, user_id]
      );
      if (result.changes === 0) {
        throw new Error('Task not found or not authorized');
      }
      return { success: true };
    } catch (error) {
      console.error('Error deleting task:', error);
      throw error;
    }
  }
});