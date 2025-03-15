import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username']
  const { calendarEvents, mood, goals } = await readBody(event)

  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8'
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const prompt = `
    Bạn là trợ lý cá nhân AI thông minh, chuyên nghiệp. Dựa trên thông tin sau, hãy tạo một kế hoạch ngày chi tiết (~500 từ) cho người dùng "${username}":
    - Lịch sự kiện: ${JSON.stringify(calendarEvents || [])} (nếu không có, giả định ngày trống).
    - Tâm trạng hôm nay: "${mood || 'bình thường'}".
    - Mục tiêu: "${goals || 'không có cụ thể'}".
    Kế hoạch phải bao gồm:
    - Lịch trình cụ thể (giờ nào làm gì).
    - Lời khuyên cá nhân hóa dựa trên tâm trạng và mục tiêu.
    - Theo dõi tiến độ mục tiêu (nếu có).
    Viết bằng tiếng Việt, phong cách thân thiện, chuyên nghiệp, không lặp lại nội dung cũ.
    Trả về dưới dạng chuỗi văn bản thuần túy, không thêm ký tự markdown hay JSON wrapper.
  `

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Lỗi từ Gemini API:', response.status, errorText)
      throw new Error('Lỗi từ Gemini API')
    }

    const data = await response.json()
    const plan = data.candidates[0].content.parts[0].text
    return { plan }
  } catch (error) {
    console.error('Lỗi chi tiết khi gọi Gemini API:', error.message)
    throw createError({ 
      statusCode: 500, 
      message: 'Lỗi tạo kế hoạch từ Gemini API. Vui lòng thử lại sau!' 
    })
  }
})