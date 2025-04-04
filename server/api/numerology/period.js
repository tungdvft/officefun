// server/api/numerology/period.js
import { defineEventHandler, createError, readBody } from 'h3'
import { callGeminiApi } from '../utils/commonApi'
import { 
  getCurrentDateInfo,
  calculateNumber,
  calculatePersonalYear,
  getPersonalYearMeaning
} from '../utils/numerologyUtils'

const DEFAULT_TIMEOUT = 10000 // 10 seconds

export default defineEventHandler(async (event) => {
  const startTime = Date.now()
  
  try {
    // 1. Validate request
    const body = await readBody(event)
    if (!body || !body.name || !body.birthDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
      })
    }

    const { name, birthDate } = body

    // 2. Validate date format
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng DD/MM/YYYY.'
      })
    }

    // 3. Calculate numerology numbers
    const dateInfo = getCurrentDateInfo()
    const periods = {
      day: { 
        number: calculateNumber(birthDate, 'day'), 
        text: `ngày ${dateInfo.currentDate}` 
      },
      week: { 
        number: calculateNumber(birthDate, 'week'), 
        text: `tuần ${dateInfo.currentWeek}` 
      },
      month: { 
        number: calculateNumber(birthDate, 'month'), 
        text: `tháng ${dateInfo.currentMonth}` 
      },
      year: { 
        number: calculateNumber(birthDate, 'year'), 
        text: `năm ${dateInfo.currentYear}` 
      }
    }

    // 4. Calculate 10-year cycles
    const cycles = {}
    const currentYearNum = parseInt(dateInfo.currentYear)
    for (let i = 0; i < 10; i++) {
      const targetYear = currentYearNum + i
      const personalYearNumber = calculatePersonalYear(birthDate, targetYear)
      cycles[targetYear] = {
        number: personalYearNumber,
        description: getPersonalYearMeaning(personalYearNumber)
      }
    }

    // 5. Generate Gemini prompt
    const prompt = generateGeminiPrompt(name, birthDate, periods, dateInfo)
    
    // 6. Call Gemini API with timeout
    const geminiResponse = await callGeminiWithTimeout(prompt)
    
    // 7. Validate Gemini response
    if (!isValidGeminiResponse(geminiResponse)) {
      throw new Error('Dữ liệu từ Gemini không hợp lệ')
    }

    // 8. Return success response
    return {
      success: true,
      data: {
        periods: geminiResponse,
        cycles
      },
      meta: {
        processedIn: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    }

  } catch (error) {
    console.error('API Error:', error)
    
    // 9. Return fallback response
    return {
      success: false,
      error: {
        message: error.message || 'Lỗi hệ thống',
        statusCode: error.statusCode || 500
      },
      data: generateFallbackData(),
      isFallback: true
    }
  }
})

// Helper functions
function generateGeminiPrompt(name, birthDate, periods, dateInfo) {
  return `Dựa trên thần số học, phân tích cho "${name}" (sinh ${birthDate}):
  Ngày ${dateInfo.currentDate} (số ${periods.day.number})
  Tuần ${dateInfo.currentWeek} (số ${periods.week.number})
  Tháng ${dateInfo.currentMonth} (số ${periods.month.number})
  Năm ${dateInfo.currentYear} (số ${periods.year.number})
  Trả về JSON với cấu trúc:
  {
    "day": {
      "number": Số cá nhân,
      "description": "Diễn giải 5-6 câu",
      "shouldDo": "4-5 gợi ý",
      "shouldAvoid": "3-4 điều nên tránh",
      "lunchSuggestion": "Gợi ý bữa trưa"
    },
    "week": { ... },
    "month": { ... },
    "year": { ... }
  }`
}

async function callGeminiWithTimeout(prompt) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT)

  try {
    return await callGeminiApi(prompt, { signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

function isValidGeminiResponse(response) {
  const requiredFields = ['day', 'week', 'month', 'year']
  return requiredFields.every(field => 
    response?.[field]?.number && 
    response?.[field]?.description && 
    response?.[field]?.shouldDo && 
    response?.[field]?.shouldAvoid
  )
}

function generateFallbackData() {
  const dateInfo = getCurrentDateInfo()
  return {
    periods: {
      day: {
        number: 1,
        description: 'Hệ thống đang bận. Vui lòng thử lại sau.',
        shouldDo: 'Vui lòng thử lại sau.',
        shouldAvoid: 'Vui lòng thử lại sau.',
        lunchSuggestion: 'Vui lòng thử lại sau.'
      },
      week: {
        number: 1,
        description: 'Hệ thống đang bận. Vui lòng thử lại sau.',
        shouldDo: 'Vui lòng thử lại sau.',
        shouldAvoid: 'Vui lòng thử lại sau.'
      },
      month: {
        number: 1,
        description: 'Hệ thống đang bận. Vui lòng thử lại sau.',
        shouldDo: 'Vui lòng thử lại sau.',
        shouldAvoid: 'Vui lòng thử lại sau.'
      },
      year: {
        number: 1,
        description: 'Hệ thống đang bận. Vui lòng thử lại sau.',
        shouldDo: 'Vui lòng thử lại sau.',
        shouldAvoid: 'Vui lòng thử lại sau.'
      }
    },
    cycles: {}
  }
}