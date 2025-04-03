import { defineEventHandler, createError } from 'h3'
import { callGeminiApi } from '../utils/commonApi'

// Utility functions
function getCurrentDateInfo() {
  const today = new Date()
  const day = today.getDate()
  const month = today.getMonth() + 1
  const year = today.getFullYear()

  // Tính ngày bắt đầu tuần (thứ 2)
  const startOfWeek = new Date(today)
  startOfWeek.setDate(day - (today.getDay() || 7) + 1)
  
  return {
    currentDate: `${padZero(day)}/${padZero(month)}/${year}`,
    currentWeek: `Tuần từ ${padZero(startOfWeek.getDate())}/${padZero(startOfWeek.getMonth()+1)}/${year} đến ${padZero(day)}/${padZero(month)}/${year}`,
    currentMonth: `${padZero(month)}/${year}`,
    currentYear: `${year}`
  }
}

function padZero(num) {
  return num.toString().padStart(2, '0')
}

function validateBirthDate(birthDate) {
  return /^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)
}

function reduceToSingleDigit(num) {
  if (num === 11 || num === 22) return num
  
  while (num > 9) {
    num = num.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  }
  return num || 1
}

// Numerology calculations
function calculatePeriodNumber(birthDate, period, dateInfo) {
  if (!validateBirthDate(birthDate)) return 1
  
  const [birthDay, birthMonth] = birthDate.split('/').map(Number)
  let sum

  switch (period) {
    case 'day':
      const [day, month, year] = dateInfo.currentDate.split('/').map(Number)
      sum = birthDay + birthMonth + day + month + year
      break
    case 'week':
      const [startDay] = dateInfo.currentWeek.split(' đến ')[0].split('/').map(Number)
      sum = birthDay + birthMonth + startDay + 3 + 2025 // 3 là số cố định cho tuần
      break
    case 'month':
      const [mMonth, mYear] = dateInfo.currentMonth.split('/').map(Number)
      sum = birthDay + birthMonth + mMonth + mYear
      break
    case 'year':
      sum = birthDay + birthMonth + parseInt(dateInfo.currentYear)
      break
    default:
      sum = 1
  }

  return reduceToSingleDigit(sum)
}

// Gemini API handler
async function getGeminiAnalysis(name, birthDate, dateInfo) {
  const prompt = `
    Bạn là chuyên gia thần số học. Hãy phân tích cho ${name} (sinh ${birthDate}) theo các chu kỳ sau:
    
    Ngày ${dateInfo.currentDate} (số ${calculatePeriodNumber(birthDate, 'day', dateInfo)})
    Tuần ${dateInfo.currentWeek} (số ${calculatePeriodNumber(birthDate, 'week', dateInfo)})
    Tháng ${dateInfo.currentMonth} (số ${calculatePeriodNumber(birthDate, 'month', dateInfo)})
    Năm ${dateInfo.currentYear} (số ${calculatePeriodNumber(birthDate, 'year', dateInfo)})
    
    Yêu cầu:
    1. Trả về PURE JSON (không có markdown hay text nào khác)
    2. Đúng cấu trúc sau:
    {
      "day": {
        "number": 5,
        "description": "...",
        "shouldDo": ["..."],
        "shouldAvoid": ["..."],
        "lunchSuggestion": "..."
      },
      "week": { ... },
      "month": { ... },
      "year": { ... }
    }
    
    QUAN TRỌNG: CHỈ TRẢ VỀ JSON, KHÔNG CÓ BẤT KỲ TEXT NÀO KHÁC!`

  try {
    const response = await callGeminiApi(prompt)
    const cleanedResponse = response.replace(/```json|```/g, '').trim()
    return JSON.parse(cleanedResponse)
  } catch (error) {
    console.error('Gemini API error:', error)
    return null
  }
}

// Main API handler
export default defineEventHandler(async (event) => {
  const { name, birthDate } = await readBody(event)

  // Validation
  if (!name || !birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc'
    })
  }

  if (!validateBirthDate(birthDate)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Định dạng birthDate không hợp lệ. Yêu cầu dd/mm/yyyy'
    })
  }

  const dateInfo = getCurrentDateInfo()
  
  // Calculate 10-year cycles
  const cycles = {}
  const currentYear = parseInt(dateInfo.currentYear)
  
  for (let i = 0; i < 10; i++) {
    const year = currentYear + i
    const number = reduceToSingleDigit(
      parseInt(birthDate.split('/')[0]) + 
      parseInt(birthDate.split('/')[1]) + 
      year
    )
    
    cycles[year] = {
      number,
      description: getPersonalYearMeaning(number)
    }
  }

  // Get analysis
  let analysis = await getGeminiAnalysis(name, birthDate, dateInfo)
  
  if (!analysis) {
    console.log('Using fallback analysis')
    analysis = generateFallbackAnalysis(name, birthDate, dateInfo)
  }

  return {
    success: true,
    data: {
      numerology: {
        periods: analysis,
        cycles
      },
      meta: {
        generatedAt: new Date().toISOString(),
        source: analysis ? 'gemini' : 'fallback'
      }
    }
  }
})

// Helper functions
function getPersonalYearMeaning(number) {
  const meanings = {
    1: 'Năm của khởi đầu mới và sự độc lập',
    2: 'Năm của hợp tác và cân bằng',
    3: 'Năm của sáng tạo và giao tiếp',
    4: 'Năm của ổn định và xây dựng nền tảng',
    5: 'Năm của thay đổi và tự do',
    6: 'Năm của trách nhiệm và gia đình',
    7: 'Năm của tìm hiểu nội tâm',
    8: 'Năm của thành công vật chất',
    9: 'Năm của hoàn thành và buông bỏ',
    11: 'Năm đặc biệt với trực giác mạnh mẽ',
    22: 'Năm đặc biệt để hiện thực hóa ước mơ lớn'
  }
  return meanings[number] || 'Ý nghĩa năm cá nhân'
}

function generateFallbackAnalysis(name, birthDate, dateInfo) {
  const periods = ['day', 'week', 'month', 'year']
  const result = {}
  
  periods.forEach(period => {
    const number = calculatePeriodNumber(birthDate, period, dateInfo)
    
    result[period] = {
      number,
      description: `${name} trong ${period === 'day' ? 'ngày' : period} này có năng lượng số ${number}`,
      shouldDo: getRandomAdvice('do', number),
      shouldAvoid: getRandomAdvice('avoid', number),
      ...(period === 'day' && { lunchSuggestion: getLunchSuggestion(number) })
    }
  })
  
  return result
}

function getRandomAdvice(type, number) {
  const advice = {
    do: [
      'Tập trung vào các mục tiêu quan trọng',
      'Dành thời gian cho người thân',
      'Học hỏi điều mới',
      'Lập kế hoạch chi tiết'
    ],
    avoid: [
      'Trì hoãn công việc quan trọng',
      'Tiêu xài hoang phí',
      'Xung đột không cần thiết'
    ]
  }
  
  // Thêm advice dựa trên con số
  if (number === 1) advice.do.push('Hãy quyết đoán trong các quyết định')
  if (number === 2) advice.do.push('Lắng nghe nhiều hơn')
  
  return advice[type]
}

function getLunchSuggestion(number) {
  const suggestions = [
    'Phở bò - món ăn truyền thống đầy năng lượng',
    'Cơm tấm sườn - hương vị đậm đà miền Nam',
    'Bánh mì chảo - nhanh gọn nhưng đủ chất',
    'Bún chả cá - thanh mát cho ngày làm việc'
  ]
  return suggestions[number % suggestions.length]
}