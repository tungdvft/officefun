import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { Client } from 'pg';
import * as fs from 'node:fs';
// const { Client } = require('pg');

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
    console.log('Connecting to PostgreSQL database...');
    const caCert = `
-----BEGIN CERTIFICATE-----
MIIEUDCCArigAwIBAgIUXdgjbRRT6Fm0TIGzMFBLbnmD9JwwDQYJKoZIhvcNAQEM
BQAwQDE+MDwGA1UEAww1ZWIxNDhiZTAtN2NlYy00ZmM2LTliOTItMTAyMmViOGM4
NzQyIEdFTiAxIFByb2plY3QgQ0EwHhcNMjUwNjA1MDc1NDE1WhcNMzUwNjAzMDc1
NDE1WjBAMT4wPAYDVQQDDDVlYjE0OGJlMC03Y2VjLTRmYzYtOWI5Mi0xMDIyZWI4
Yzg3NDIgR0VOIDEgUHJvamVjdCBDQTCCAaIwDQYJKoZIhvcNAQEBBQADggGPADCC
AYoCggGBALg34hvWsweEER1b6mscnmK3qQr4h/YJvGxgN/ik+etcdP9FXKlROnor
n+TipC1N6NryrgTOOUitMaLnQ6o+K6KFh/HKzeslNFEoJlF4H3ZDI3o1w3W+m0zD
9R/JZiUhTeAWB8dvhO9jpCYbX3WrQagddNub09YRB4paba21vhzHQoJWtJ0CU4ra
tAkowc1P3nOK32tWoYp0JMYboKMYMDb28mJl0D66pkexPYcSqUKQ6LK1pccfRuIK
Dooy1WrAhmVI5Xk69IN/RCFoJ2d6Sf+LB8OMPbXfko5pIOO9fDVSm9w/QoKJO70t
MHrlHyswv4QR1+6S4VsW7pkKT0V0RE/sOqG6t/1lLoU12z1ze9psUju5KtAYNM32
gfs53iWB5t6QRsnwjQPga21bpJphkSTzoYAHudOr31LeYXbGUl/6FMMq8QDwSrgy
zn26yE7jRQt9r3gsr0fJllJVoG5dQfWtx6i62UTtWeE5wT60lIeP2Kb5jOrJ3jsH
QoFql5dDvQIDAQABo0IwQDAdBgNVHQ4EFgQU9Lfe6Mp9vBBlRm0XGyrl3L5mAK4w
EgYDVR0TAQH/BAgwBgEB/wIBADALBgNVHQ8EBAMCAQYwDQYJKoZIhvcNAQEMBQAD
ggGBAAXwPmxe0BMV6sHQIhdGTxpJ1Zj536d4xiarakATOJQtKfsH2PqOUH5B77MU
5jCnGPZFhWpFHAXCzWahA9LG4YIUMsxuEXrRUplmI+WW6RvwI/0AaPugKGYy7pZy
UDGBI3ZPkCifAnSpgOUaPfOAVWkPSRYTy5Fd/eHC/lAM4vds4x2LDh3nr+KE2ZS5
MychP5RyCTLdi49Hon042EmW/a8BJOmLMclMtX4khECBs2m0mYZiKSZR/iS8TB+v
zcTWiG+1olxfMwqOgQbqN1+bzcsNS/az0uXvhu3KGksAkTCXW+BFGGLoaLtxxl6l
B5jlYtoXEuprhN+1gjb61OySiwhN2+L909h+2Q94Xm4aVhzG4r6Gkf/2nrmDW74G
22aQBKg+hxWiy5k2By0PVaqoabIur4gLZRXX3AGe/m3DMwJw3KVgitN5ZtkfHthd
01pNQ/IDqcFdxbxx2rxydlQgnyBVGrCGTSD0wx2bvWPKkF2UruZSuP+HtZNF8FVe
U9jkzg==
-----END CERTIFICATE-----

`;
    const db = new Client({
                        host: 'db-postgresql-sgp1-31453-do-user-14381096-0.g.db.ondigitalocean.com',
                        port: 25060,
                        user: 'doadmin',
                        password: 'AVNS_t5TZUG7fWdbYwPCgs2U',
                        database: 'defaultdb',
                        ssl: {
                          rejectUnauthorized: false,
                             ca: caCert
                               }     
                          });
    await db.connect()
    .then(() => console.log('Connected to PostgreSQL!'))
    .catch(err => console.error('Connection error', err.stack));
    // const db = await open({
    //   filename: './database.db',
    //   driver: sqlite3.Database,
    // });

    // Bật foreign key constraints
    // await db.query('PRAGMA foreign_keys = ON');

    // Tạo bảng users với cột tokens

    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE,
  fullname TEXT,
  birthdate DATE,
  gender TEXT CHECK(gender IN ('male', 'female', 'other')),
  password TEXT,
  avatar TEXT,
  tokens INTEGER DEFAULT 200,
  is_google_account BOOLEAN DEFAULT FALSE,
  google_id TEXT,
  email_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `);

    // Tạo bảng token_transactions để lưu lịch sử giao dịch token
    await db.query(`
      CREATE TABLE IF NOT EXISTS token_transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL,
  amount INTEGER NOT NULL, -- Số token thay đổi (dương: thêm, âm: trừ)
  description TEXT, -- Mô tả giao dịch (e.g., "API call", "Reward")
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create conditional index on users.google_id (PostgreSQL supports partial indexes)
CREATE INDEX IF NOT EXISTS idx_google_id 
ON users(google_id) 
WHERE google_id IS NOT NULL;

-- Create index on token_transactions.user_id
CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id 
ON token_transactions(user_id);
    `);

    // // Tạo index cho google_id
    // await db.query(`
    //   CREATE INDEX IF NOT EXISTS idx_google_id 
    //   ON users(google_id) WHERE google_id IS NOT NULL
    // `);

    // // Tạo index cho user_id trong token_transactions
    // await db.query(`
    //   CREATE INDEX IF NOT EXISTS idx_token_transactions_user_id 
    //   ON token_transactions(user_id)
    // `);

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
    await db.query(`
      ALTER TABLE users ADD COLUMN google_id TEXT
    `).catch(() => {
      console.log('Cột google_id đã tồn tại, bỏ qua ALTER TABLE');
    });

    // Bước 2: Cập nhật google_id cho các tài khoản Google hiện có
    await db.query(`
      UPDATE users 
      SET google_id = 'temp_' || id 
      WHERE google_id IS NULL AND is_google_account = true
    `);

    // Bước 3: Tạo unique index cho google_id
    await db.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_google_id 
      ON users(google_id) WHERE google_id IS NOT NULL
    `);
  } catch (error) {
    console.error('Lỗi khi chạy migration:', error);
    throw new Error('Migration thất bại');
  }
}

export default setupDatabase;