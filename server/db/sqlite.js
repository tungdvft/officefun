import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// Biến lưu trữ instance cơ sở dữ liệu
let dbInstance = null;

/**
 * Khởi tạo và cấu hình cơ sở dữ liệu SQLite
 * @returns {Promise<Database>} Instance của cơ sở dữ liệu
 */
export async function setupDatabase() {
  // Nếu đã có instance, trả về để tránh mở lại
  if (dbInstance) return dbInstance;

  try {
    // Mở kết nối đến cơ sở dữ liệu SQLite
    const db = await open({
      filename: './database.db',
      driver: sqlite3.Database,
    });

    // Bật foreign key constraints
    await db.exec('PRAGMA foreign_keys = ON');

    // Tạo bảng users với cột tokens
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        username TEXT UNIQUE,
        fullname TEXT,
        birthdate TEXT,
        gender TEXT CHECK(gender IN ('male', 'female', 'other')),
        password TEXT,
        avatar TEXT,
        tokens INTEGER DEFAULT 100, -- Số dư token, mặc định 100
        is_google_account BOOLEAN DEFAULT 0,
        google_id TEXT,
        email_verified BOOLEAN DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tạo bảng token_transactions để lưu lịch sử giao dịch token
    await db.exec(`
      CREATE TABLE IF NOT EXISTS token_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amount INTEGER NOT NULL, -- Số token thay đổi (dương: thêm, âm: trừ)
        description TEXT, -- Mô tả giao dịch (e.g., "API call", "Reward")
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tạo index cho google_id
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_google_id 
      ON users(google_id) WHERE google_id IS NOT NULL
    `);

    // Tạo index cho user_id trong token_transactions
    await db.exec(`
      CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id 
      ON token_transactions(user_id)
    `);

    // Lưu instance
    dbInstance = db;

    // Chạy migration an toàn
    await safeMigration(db);

    return db;
  } catch (error) {
    console.error('Lỗi khi khởi tạo cơ sở dữ liệu:', error);
    throw new Error('Không thể khởi tạo cơ sở dữ liệu');
  }
}

/**
 * Thực hiện migration an toàn để thêm hoặc cập nhật cột google_id
 * @param {Database} db Instance của cơ sở dữ liệu
 */
async function safeMigration(db) {
  try {
    // Bước 1: Thêm cột google_id nếu chưa tồn tại
    await db.exec(`
      ALTER TABLE users ADD COLUMN google_id TEXT
    `).catch(() => {
      console.log('Cột google_id đã tồn tại, bỏ qua ALTER TABLE');
    });

    // Bước 2: Cập nhật google_id cho các tài khoản Google hiện có
    await db.exec(`
      UPDATE users 
      SET google_id = 'temp_' || id 
      WHERE google_id IS NULL AND is_google_account = 1
    `);

    // Bước 3: Tạo unique index cho google_id
    await db.exec(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_google_id 
      ON users(google_id) WHERE google_id IS NOT NULL
    `);
  } catch (error) {
    console.error('Lỗi khi chạy migration:', error);
    throw new Error('Migration thất bại');
  }
}

export default setupDatabase;