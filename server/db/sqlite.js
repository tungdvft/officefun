import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

export async function setupDatabase() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  })

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      birthdate TEXT,
      profession TEXT
    )
  `)

  return db
}