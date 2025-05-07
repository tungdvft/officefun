import { defineEventHandler, createError, readBody } from 'h3'
import { calculatePersonalDayNumber } from '../utils/numerology-calculations'
import { callGeminiApi } from '../utils/commonApi'

export default defineEventHandler(async (event) => {
  try {
    console.log('API /numerology/food called')
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
    const foodList = preferences ? preferences.split(',').map(item => item.trim()).filter(item => item) : []

    // Prepare prompt for Gemini API
    const prompt = foodList.length > 0
      ? `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Người dùng cung cấp danh sách món ăn: ${foodList.join(', ')}. 
        Hãy chọn **một món ăn** phù hợp nhất với năng lượng của số ${personalDayNumber} từ danh sách này.
        Cung cấp giải thích ngắn gọn (2-3 câu) tại sao món ăn này phù hợp.
        Trả về định dạng JSON thuần túy:
        {
          "food": {
            "item": "string",
            "explanation": "string"
          }
        }
      `
      : `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Hãy gợi ý **năm món ăn** phù hợp với năng lượng của số ${personalDayNumber}.
        Mỗi món ăn kèm giải thích ngắn gọn (2-3 câu) tại sao nó phù hợp.
        Trả về định dạng JSON thuần túy:
        {
          "food": [
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
      return getFallbackResponse(personalDayNumber, foodList)
    }

    // Validate response
    if (foodList.length > 0) {
      if (!geminiResponse || !geminiResponse.food || !geminiResponse.food.item || !geminiResponse.food.explanation) {
        console.error('Invalid Gemini response:', geminiResponse)
        return getFallbackResponse(personalDayNumber, foodList)
      }
    } else {
      if (!geminiResponse || !Array.isArray(geminiResponse.food) || geminiResponse.food.length !== 5) {
        console.error('Invalid Gemini response:', geminiResponse)
        return getFallbackResponse(personalDayNumber, foodList)
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

function getFallbackResponse(personalDayNumber, foodList) {
  console.log('Using fallback response for personal day number:', personalDayNumber)
  const defaultSuggestions = {
    1: [
      { item: 'Phở bò', explanation: 'Phở bò mang năng lượng mạnh mẽ, phù hợp với sự dẫn dắt và sáng tạo của số 1.' },
      { item: 'Bánh mì', explanation: 'Bánh mì đa dạng và sáng tạo, khơi dậy sự khởi đầu của số 1.' },
      { item: 'Cơm gà', explanation: 'Cơm gà đơn giản nhưng đậm đà, hỗ trợ năng lượng tự tin của số 1.' },
      { item: 'Bún riêu', explanation: 'Bún riêu ấm áp, thúc đẩy sự quyết đoán của số 1.' },
      { item: 'Chả giò', explanation: 'Chả giò giòn rụm, phù hợp với tinh thần năng động của số 1.' }
    ],
    2: [
      { item: 'Gỏi cuốn', explanation: 'Gỏi cuốn nhẹ nhàng, hỗ trợ sự hòa hợp và nhạy cảm của số 2.' },
      { item: 'Bún chả', explanation: 'Bún chả cân bằng hương vị, phù hợp với năng lượng hợp tác của số 2.' },
      { item: 'Canh chua', explanation: 'Canh chua thanh mát, khơi dậy sự dịu dàng của số 2.' },
      { item: 'Bánh xèo', explanation: 'Bánh xèo gần gũi, hỗ trợ sự kết nối của số 2.' },
      { item: 'Nem chua', explanation: 'Nem chua độc đáo, phù hợp với sự tinh tế của số 2.' }
    ],
    3: [
      { item: 'Cơm tấm', explanation: 'Cơm tấm đa dạng, khơi dậy năng lượng vui vẻ và sáng tạo của số 3.' },
      { item: 'Bánh cuốn', explanation: 'Bánh cuốn tinh tế, phù hợp với sự biểu đạt của số 3.' },
      { item: 'Mì Quảng', explanation: 'Mì Quảng đậm đà, hỗ trợ tinh thần năng động của số 3.' },
      { item: 'Chả cá', explanation: 'Chả cá độc đáo, khơi dậy sự sáng tạo của số 3.' },
      { item: 'Bún bò Huế', explanation: 'Bún bò Huế mạnh mẽ, phù hợp với năng lượng biểu cảm của số 3.' }
    ],
    4: [
      { item: 'Hủ tiếu', explanation: 'Hủ tiếu đơn giản và chắc chắn, phù hợp với sự ổn định của số 4.' },
      { item: 'Bánh canh', explanation: 'Bánh canh mộc mạc, hỗ trợ năng lượng thực tế của số 4.' },
      { item: 'Cơm niêu', explanation: 'Cơm niêu truyền thống, khơi dậy sự kiên định của số 4.' },
      { item: 'Lẩu mắm', explanation: 'Lẩu mắm đậm đà, phù hợp với sự bền bỉ của số 4.' },
      { item: 'Bánh ướt', explanation: 'Bánh ướt nhẹ nhàng, hỗ trợ sự cẩn thận của số 4.' }
    ],
    5: [
      { item: 'Bún bò Huế', explanation: 'Bún bò Huế đậm đà, thúc đẩy sự tự do và phiêu lưu của số 5.' },
      { item: 'Phở gà', explanation: 'Phở gà nhẹ nhàng, phù hợp với tinh thần linh hoạt của số 5.' },
      { item: 'Cơm chiên', explanation: 'Cơm chiên đa dạng, hỗ trợ năng lượng thay đổi của số 5.' },
      { item: 'Mì xào', explanation: 'Mì xào năng động, khơi dậy sự tò mò của số 5.' },
      { item: 'Gỏi ngó sen', explanation: 'Gỏi ngó sen tươi mát, phù hợp với sự khám phá của số 5.' }
    ],
    6: [
      { item: 'Mì Quảng', explanation: 'Mì Quảng ấm áp, thể hiện tình yêu và trách nhiệm của số 6.' },
      { item: 'Bánh xèo', explanation: 'Bánh xèo gần gũi, hỗ trợ sự chăm sóc của số 6.' },
      { item: 'Cá kho tộ', explanation: 'Cá kho tộ đậm đà, khơi dậy sự ấm áp của số 6.' },
      { item: 'Gỏi gà', explanation: 'Gỏi gà nhẹ nhàng, phù hợp với năng lượng yêu thương của số 6.' },
      { item: 'Bún nước lèo', explanation: 'Bún nước lèo độc đáo, hỗ trợ sự sẻ chia của số 6.' }
    ],
    7: [
      { item: 'Bánh xèo', explanation: 'Bánh xèo độc đáo, phù hợp với sự nội tâm và khám phá của số 7.' },
      { item: 'Gỏi cuốn', explanation: 'Gỏi cuốn thanh tịnh, hỗ trợ sự suy ngẫm của số 7.' },
      { item: 'Canh chua', explanation: 'Canh chua nhẹ nhàng, khơi dậy sự tĩnh lặng của số 7.' },
      { item: 'Bún chả', explanation: 'Bún chả cân bằng, phù hợp với sự tinh tế của số 7.' },
      { item: 'Nem chua', explanation: 'Nem chua đặc biệt, hỗ trợ sự khám phá của số 7.' }
    ],
    8: [
      { item: 'Lẩu thái', explanation: 'Lẩu thái mạnh mẽ, hỗ trợ tham vọng và thành công của số 8.' },
      { item: 'Cơm tấm', explanation: 'Cơm tấm phong phú, phù hợp với năng lượng quyết đoán của số 8.' },
      { item: 'Bánh mì', explanation: 'Bánh mì đa dạng, khơi dậy sự hiệu quả của số 8.' },
      { item: 'Phở bò', explanation: 'Phở bò đậm đà, hỗ trợ sự lãnh đạo của số 8.' },
      { item: 'Bún riêu', explanation: 'Bún riêu phức hợp, phù hợp với sự tham vọng của số 8.' }
    ],
    9: [
      { item: 'Gỏi cuốn', explanation: 'Gỏi cuốn thanh nhẹ, phản ánh lòng nhân ái và lý tưởng của số 9.' },
      { item: 'Bún bò Huế', explanation: 'Bún bò Huế đậm đà, hỗ trợ sự cống hiến của số 9.' },
      { item: 'Cơm gà', explanation: 'Cơm gà đơn giản, khơi dậy sự sẻ chia của số 9.' },
      { item: 'Bánh cuốn', explanation: 'Bánh cuốn tinh tế, phù hợp với năng lượng lý tưởng của số 9.' },
      { item: 'Chả cá', explanation: 'Chả cá độc đáo, hỗ trợ sự nhân ái của số 9.' }
    ]
  }

  const suggestion = defaultSuggestions[personalDayNumber] || defaultSuggestions[9]
  return {
    personalDayNumber,
    recommendations: {
      food: foodList.length > 0
        ? { item: foodList[Math.floor(Math.random() * foodList.length)], explanation: `Món ${foodList[0]} được chọn vì nó phù hợp với năng lượng sáng tạo và tích cực của số ${personalDayNumber}.` }
        : suggestion
    }
  }
}