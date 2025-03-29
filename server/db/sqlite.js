import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

let dbInstance = null;

export async function setupDatabase() {
  if (dbInstance) return dbInstance;

  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database,
  });

  // Tạo bảng users
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

  // Tạo bảng tasks
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

  // Tạo bảng tarot_interactions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tarot_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      date TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // Tạo bảng tarot_last_draw
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tarot_last_draw (
      user_id TEXT PRIMARY KEY,
      data TEXT,
      timestamp TEXT
    )
  `);

  // Tạo bảng tarot_limit
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tarot_limit (
      user_id TEXT,
      date TEXT,
      count INTEGER DEFAULT 0,
      PRIMARY KEY (user_id, date)
    )
  `);

  // Tạo bảng tarot_history
  await db.exec(`
    CREATE TABLE IF NOT EXISTS tarot_history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT,
      spread_type TEXT,
      date TEXT,
      data TEXT,
      timestamp TEXT,
      UNIQUE(user_id, spread_type, date)
    )
  `);

  // Tạo bảng numerology_results
  await db.exec(`
    CREATE TABLE IF NOT EXISTS numerology_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      type TEXT NOT NULL,
      result TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  dbInstance = db;
  return db;
}

export default setupDatabase;