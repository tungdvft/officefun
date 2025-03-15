import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

// Hàm mở database
async function getDb() {
  return open({
    filename: './database.db',
    driver: sqlite3.Database
  })
}

// Hàm tính con số chủ đạo
function getLifePathNumber(birthdate) {
  const date = new Date(birthdate)
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()
  const sum = (day + month + year).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  let result = sum
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  }
  return result
}

async function getAIResponse(profession, lifePathNumber) {
  console.log(`Fetching Gemini API for profession: ${profession}, lifePathNumber: ${lifePathNumber}`)
  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Tạo nội dung bói toán và hữu ích cho dân văn phòng hôm nay, trả về dưới dạng JSON hợp lệ với 6 phần sau:
                1. "dailyNumerology": Dự đoán vận mệnh hôm nay dựa trên con số chủ đạo ${lifePathNumber} từ thần số học, ngắn gọn (2-3 câu), sáng tạo, tích cực, mang vibe bí ẩn và năng lượng vũ trụ.
                2. "weeklyNumerology": Dự đoán vận mệnh tuần này dựa trên con số chủ đạo ${lifePathNumber}, ngắn gọn (2-3 câu), góc nhìn dài hơn, truyền cảm hứng và định hướng.
                3. "tarot": Quẻ Tarot hôm nay (1 lá), ngắn gọn (2-3 câu), gộp tên lá bài và ý nghĩa thành một chuỗi duy nhất, tích cực, sáng tạo, phù hợp vibe công sở, ví dụ: "Hôm nay lá bài Tarot của bạn là The Star: Hy vọng tràn đầy, cơ hội công việc đang đến gần!".
                4. "officeTip": Mẹo văn phòng thực tế, ngắn gọn (2-3 câu) dành riêng cho ngành ${profession}, ví dụ: cách viết email chuyên nghiệp, hàm Excel hữu ích, mẹo quản lý thời gian, cụ thể và áp dụng được ngay.
                5. "funFact": Fact lạ lùng, ngắn gọn (1-2 câu) về văn phòng hoặc công việc, kiểu "nghe xong phải kể lại ngay".
                6. "quote": Câu trích dẫn ngầu lòi, ngắn gọn (1 câu), phong cách truyền cảm hứng hoặc vibe công sở, kèm tên tác giả.
                Đảm bảo trả về JSON hợp lệ, không thêm ký tự markdown chỉ trả về chuỗi JSON thuần túy, nội dung sáng tạo và "đỉnh của chóp"!`
            }]
          }]
        })
      }
    )
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const json = await response.json()
    let rawText = json.candidates[0].content.parts[0].text
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
    console.log('Gemini raw response:', rawText)
    return JSON.parse(rawText)
  } catch (error) {
    console.error('Error fetching Gemini:', error)
    return {
      dailyNumerology: `Số ${lifePathNumber} hôm nay báo hiệu: Một ngày đầy bất ngờ, hãy đón nhận với nụ cười!`,
      weeklyNumerology: `Tuần này, số ${lifePathNumber} khuyên bạn: Đừng ngại thử thách, vũ trụ luôn ủng hộ bạn!`,
      tarot: `Hôm nay lá bài Tarot của bạn là The Star: Hy vọng tràn đầy, cơ hội công việc đang đến gần!`,
      officeTip: `${profession} cần biết: Viết email ngắn gọn với tiêu đề "Cần phản hồi: [Chủ đề]" để tăng tỷ lệ được đọc ngay!`,
      funFact: `Máy photocopy từng được gọi là "trùm drama" vì hay kẹt đúng lúc gấp!`,
      quote: `"Làm việc thông minh hơn, không phải chăm chỉ hơn!" - Tim Ferriss`
    }
  }
}

export default defineEventHandler(async (event) => {
  const username = decodeURIComponent(event.node.req.headers['x-username'] || 'guest')
  console.log('Handling daily request for username:', username)

  let profession = 'văn phòng chung'
  let lifePathNumber = 0
  try {
    const db = await getDb()
    const user = await db.get('SELECT birthdate, profession FROM users WHERE username = ?', [username])
    if (user) {
      profession = user.profession || 'văn phòng chung'
      lifePathNumber = getLifePathNumber(user.birthdate)
    }
  } catch (dbError) {
    console.error('Database error:', dbError)
  }

  return await getAIResponse(profession, lifePathNumber)
})