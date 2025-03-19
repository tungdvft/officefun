import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbInstance = null;

export async function setupDatabase() {
  if (dbInstance) return dbInstance;

  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });


  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      birthdate TEXT,
      profession TEXT,
      displayName TEXT,
      gender TEXT,
      isPremium INTEGER DEFAULT 0
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT,
      description TEXT,
      due_date TEXT,
      status TEXT DEFAULT 'pending',
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS tarot_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  dbInstance = db;
  return db;
}

export default setupDatabase;