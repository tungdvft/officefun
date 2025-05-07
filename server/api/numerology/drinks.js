import { defineEventHandler, createError, readBody } from 'h3'
import { calculatePersonalDayNumber } from '../utils/numerology-calculations'
import { callGeminiApi } from '../utils/commonApi'

export default defineEventHandler(async (event) => {
  try {
    console.log('API /numerology/drinks called')
    const body = await readBody(event)
    const { birthDate, preferences } = body

    if (!birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ngày sinh không hợp lệ. Vui lòng sử dụng định dạng DD/MM/YYYY'
      })
    }

    // Calculate Personal Day Number
    const personalDayNumber = calculatePersonalDayNumber(birthDate)

    // Process user preferences
    const drinkList = preferences ? preferences.split(',').map(item => item.trim()).filter(item => item) : []

    // Prepare prompt for Gemini API
    const prompt = drinkList.length > 0
      ? `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Người dùng cung cấp danh sách đồ uống: ${drinkList.join(', ')}. 
        Hãy chọn **một đồ uống** phù hợp nhất với năng lượng của số ${personalDayNumber} từ danh sách này.
        Cung cấp giải thích ngắn gọn (2-3 câu) tại sao đồ uống này phù hợp.
        Trả về định dạng JSON thuần túy:
        {
          "drink": {
            "item": "string",
            "explanation": "string"
          }
        }
      `
      : `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Hãy gợi ý **năm đồ uống** phù hợp với năng lượng của số ${personalDayNumber}.
        Mỗi đồ uống kèm giải thích ngắn gọn (2-3 câu) tại sao nó phù hợp.
        Trả về định dạng JSON thuần túy:
        {
          "drink": [
            { "item": "string", "explanation": "string" },
            { "item": "string", "explanation": "string" },
            { "item": "string", "explanation": "string" },
            { "item": "string", "explanation": "string" },
            { "item": "string", "explanation": "string" }
          ]
        }
      `

    // Call Gemini API
    let geminiResponse
    try {
      geminiResponse = await callGeminiApi(prompt)
      console.log('Gemini API response:', geminiResponse)
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError.message)
      return getFallbackResponse(personalDayNumber, drinkList)
    }

    // Validate response
    if (drinkList.length > 0) {
      if (!geminiResponse || !geminiResponse.drink || !geminiResponse.drink.item || !geminiResponse.drink.explanation) {
        console.error('Invalid Gemini response:', geminiResponse)
        return getFallbackResponse(personalDayNumber, drinkList)
      }
    } else {
      if (!geminiResponse || !Array.isArray(geminiResponse.drink) || geminiResponse.drink.length !== 5) {
        console.error('Invalid Gemini response:', geminiResponse)
        return getFallbackResponse(personalDayNumber, drinkList)
      }
    }

    return {
      personalDayNumber,
      recommendations: geminiResponse
    }
  } catch (error) {
    console.error('Handler error:', error)
    throw createError({
      statusCode: error.statusCode || 400,
      statusMessage: error.message || 'Lỗi khi xử lý yêu cầu'
    })
  }
})

function getFallbackResponse(personalDayNumber, drinkList) {
  console.log('Using fallback response for personal day number:', personalDayNumber)
  const defaultSuggestions = {
    1: [
      { item: 'Cà phê sữa', explanation: 'Cà phê sữa tỉnh táo, phù hợp với sự dẫn đầu và sáng tạo của số 1.' },
      { item: 'Nước cam', explanation: 'Nước cam tươi sáng, khơi dậy năng lượng khởi đầu của số 1.' },
      { item: 'Trà đào', explanation: 'Trà đào ngọt ngào, hỗ trợ sự tự tin của số 1.' },
      { item: 'Sữa tươi', explanation: 'Sữa tươi bổ dưỡng, phù hợp với tinh thần mạnh mẽ của số 1.' },
      { item: 'Nước dừa', explanation: 'Nước dừa tươi mát, thúc đẩy sự quyết đoán của số 1.' }
    ],
    2: [
      { item: 'Trà đào', explanation: 'Trà đào nhẹ nhàng, hỗ trợ sự hòa hợp và nhạy cảm của số 2.' },
      { item: 'Nước chanh', explanation: 'Nước chanh thanh mát, phù hợp với năng lượng dịu dàng của số 2.' },
      { item: 'Sữa đậu nành', explanation: 'Sữa đậu nành nhẹ nhàng, khơi dậy sự cân bằng của số 2.' },
      { item: 'Sinh tố bơ', explanation: 'Sinh tố bơ mịn màng, hỗ trợ sự kết nối của số 2.' },
      { item: 'Nước ép táo', explanation: 'Nước ép táo ngọt ngào, phù hợp với sự tinh tế của số 2.' }
    ],
    3: [
      { item: 'Nước ép cam', explanation: 'Nước ép cam tươi sáng, khơi dậy sự vui vẻ và sáng tạo của số 3.' },
      { item: 'Trà sữa', explanation: 'Trà sữa ngọt ngào, phù hợp với năng lượng biểu cảm của số 3.' },
      { item: 'Sinh tố xoài', explanation: 'Sinh tố xoài rực rỡ, hỗ trợ tinh thần năng động của số 3.' },
      { item: 'Nước mía', explanation: 'Nước mía ngọt mát, khơi dậy sự sáng tạo của số 3.' },
      { item: 'Cà phê đen', explanation: 'Cà phê đen mạnh mẽ, phù hợp với năng lượng sôi nổi của số 3.' }
    ],
    4: [
      { item: 'Sữa tươi', explanation: 'Sữa tươi bổ dưỡng, phù hợp với sự ổn định và thực tế của số 4.' },
      { item: 'Nước dừa', explanation: 'Nước dừa thanh mát, hỗ trợ năng lượng kiên định của số 4.' },
      { item: 'Trà xanh', explanation: 'Trà xanh thanh tịnh, khơi dậy sự cẩn thận của số 4.' },
      { item: 'Sinh tố dâu', explanation: 'Sinh tố dâu nhẹ nhàng, phù hợp với sự bền bỉ của số 4.' },
      { item: 'Nước ép dứa', explanation: 'Nước ép dứa tươi mát, hỗ trợ sự tổ chức của số 4.' }
    ],
    5: [
      { item: 'Nước dừa', explanation: 'Nước dừa tươi mát, thúc đẩy sự tự do và phiêu lưu của số 5.' },
      { item: 'Cà phê đen', explanation: 'Cà phê đen mạnh mẽ, phù hợp với tinh thần linh hoạt của số 5.' },
      { item: 'Trà sữa', explanation: 'Trà sữa đa dạng, hỗ trợ năng lượng thay đổi của số 5.' },
      { item: 'Sinh tố chuối', explanation: 'Sinh tố chuối năng động, khơi dậy sự tò mò của số 5.' },
      { item: 'Nước ép cà rốt', explanation: 'Nước ép cà rốt bổ dưỡng, phù hợp với sự khám phá của số 5.' }
    ],
    6: [
      { item: 'Trà sữa', explanation: 'Trà sữa ngọt ngào, thể hiện tình yêu và trách nhiệm của số 6.' },
      { item: 'Nước chanh', explanation: 'Nước chanh thanh mát, hỗ trợ sự chăm sóc của số 6.' },
      { item: 'Sinh tố xoài', explanation: 'Sinh tố xoài ấm áp, khơi dậy sự sẻ chia của số 6.' },
      { item: 'Cà phê sữa', explanation: 'Cà phê sữa gần gũi, phù hợp với năng lượng yêu thương của số 6.' },
      { item: 'Nước ép táo', explanation: 'Nước ép táo dịu dàng, hỗ trợ sự kết nối của số 6.' }
    ],
    7: [
      { item: 'Trà xanh', explanation: 'Trà xanh thanh tịnh, phù hợp với sự nội tâm và khám phá của số 7.' },
      { item: 'Nước chanh', explanation: 'Nước chanh nhẹ nhàng, hỗ trợ sự suy ngẫm của số 7.' },
      { item: 'Sinh tố dâu', explanation: 'Sinh tố dâu tinh tế, khơi dậy sự tĩnh lặng của số 7.' },
      { item: 'Nước ép cam', explanation: 'Nước ép cam thanh mát, phù hợp với sự tinh tế của số 7.' },
      { item: 'Sữa đậu nành', explanation: 'Sữa đậu nành dịu nhẹ, hỗ trợ sự khám phá của số 7.' }
    ],
    8: [
      { item: 'Cà phê đen', explanation: 'Cà phê đen mạnh mẽ, hỗ trợ tham vọng và thành công của số 8.' },
      { item: 'Bia', explanation: 'Bia sảng khoái, phù hợp với năng lượng quyết đoán của số 8.' },
      { item: 'Nước mía', explanation: 'Nước mía ngọt mát, khơi dậy sự hiệu quả của số 8.' },
      { item: 'Trà đào', explanation: 'Trà đào đa dạng, hỗ trợ sự lãnh đạo của số 8.' },
      { item: 'Sinh tố bơ', explanation: 'Sinh tố bơ phong phú, phù hợp với sự tham vọng của số 8.' }
    ],
    9: [
      { item: 'Sinh tố xoài', explanation: 'Sinh tố xoài tươi sáng, phản ánh lòng nhân ái và lý tưởng của số 9.' },
      { item: 'Nước ép cam', explanation: 'Nước ép cam rực rỡ, hỗ trợ sự cống hiến của số 9.' },
      { item: 'Trà sữa', explanation: 'Trà sữa ngọt ngào, khơi dậy sự sẻ chia của số 9.' },
      { item: 'Nước chanh', explanation: 'Nước chanh thanh mát, phù hợp với năng lượng lý tưởng của số 9.' },
      { item: 'Cà phê sữa', explanation: 'Cà phê sữa ấm áp, hỗ trợ sự nhân ái của số 9.' }
    ]
  }

  const suggestion = defaultSuggestions[personalDayNumber] || defaultSuggestions[9]
  return {
    personalDayNumber,
    recommendations: {
      drink: drinkList.length > 0
        ? { item: drinkList[Math.floor(Math.random() * drinkList.length)], explanation: `Đồ uống ${drinkList[0]} được chọn vì nó phù hợp với năng lượng tích cực và sáng tạo của số ${personalDayNumber}.` }
        : suggestion
    }
  }
}