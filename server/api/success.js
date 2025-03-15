import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  return { success: true } // Redirect về app
})