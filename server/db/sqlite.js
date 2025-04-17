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
    id TEXT PRIMARY KEY,  -- Đổi từ INTEGER sang TEXT vì Google ID là chuỗi
    username TEXT,
    email TEXT,
    birthdate TEXT,       -- Đảm bảo lưu dưới dạng chuỗi (YYYY-MM-DD)
    profession TEXT,
    displayName TEXT,
    gender TEXT,
    isPremium INTEGER DEFAULT 0
  )
`);

await db.exec(`
  CREATE TABLE IF NOT EXISTS tokens (
    user_id TEXT PRIMARY KEY,  -- Đổi từ INTEGER sang TEXT
    balance INTEGER DEFAULT 0,
    last_updated TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )
`);

  dbInstance = db;
  return db;
}

export default setupDatabase;