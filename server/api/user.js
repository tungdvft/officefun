import { setupDatabase } from '../db/sqlite'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const db = await setupDatabase()

  await db.run(
    'INSERT OR REPLACE INTO users (username, birthdate, profession) VALUES (?, ?, ?)',
    [body.username, body.birthdate, body.profession]
  )

  return { success: true }
})