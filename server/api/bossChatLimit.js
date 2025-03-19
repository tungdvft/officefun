import { defineEventHandler, getQuery } from 'h3';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

async function getDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database,
  });
}

async function checkLimit(username, date) {
  const db = await getDb();
  await db.run(`
    CREATE TABLE IF NOT EXISTS boss_chat_usage (
      username TEXT,
      date TEXT,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (username, date)
    )
  `);

  const record = await db.get(
    'SELECT count FROM boss_chat_usage WHERE username = ? AND date = ?',
    [username, date]
  );

  return record ? record.count : 0;
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  const query = getQuery(event);
  const date = query.date || new Date().toISOString().split('T')[0];

  try {
    const count = await checkLimit(username, date);
    return { count };
  } catch (error) {
    console.error('Error checking boss chat limit:', error);
    return { count: 0 }; // Fallback nếu lỗi
  }
});