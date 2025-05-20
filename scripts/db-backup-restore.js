import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.join(__dirname, '../database.db')
const backupPath = path.join(__dirname, '../database.backup')

export function backup() {
  try {
    if (fs.existsSync(dbPath)) {
      fs.copyFileSync(dbPath, backupPath)
      console.log('✓ Backup thành công')
    }
  } catch (err) {
    console.error('✗ Backup thất bại:', err)
    process.exit(1)
  }
}

export function restore() {
  try {
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, dbPath)
      console.log('✓ Khôi phục thành công')
    }
  } catch (err) {
    console.error('✗ Khôi phục thất bại:', err)
  }
}

// Xử lý command line
const [_, __, action] = process.argv
if (action === 'backup') backup()
if (action === 'restore') restore()