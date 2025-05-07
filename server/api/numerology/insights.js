import { defineEventHandler, createError, readBody } from 'h3'
import { calculatePersonalDayNumber } from '../utils/numerology-calculations'
import { callGeminiApi } from '../utils/commonApi'

export default defineEventHandler(async (event) => {
  try {
    console.log('API /numerology/insights called')
    const body = await readBody(event)
    const { birthDate, plans } = body

    if (!birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ngày sinh không hợp lệ. Vui lòng sử dụng định dạng DD/MM/YYYY'
      })
    }

    // Calculate Personal Day Number
    const personalDayNumber = calculatePersonalDayNumber(birthDate)

    // Process user plans
    const planList = plans ? plans.split(',').map(item => item.trim()).filter(item => item) : []

    // Prepare prompt for Gemini API
    const prompt = planList.length > 0
      ? `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Người dùng có các dự định: ${planList.join(', ')}. 
        Hãy chọn **một dự định** phù hợp nhất với năng lượng của số ${personalDayNumber} và giải thích ngắn gọn (2-3 câu) tại sao dự định này phù hợp.
        Cung cấp **một việc nên làm** và **một việc nên tránh** liên quan đến dự định này, mỗi cái kèm giải thích ngắn gọn (2-3 câu).
        Trả về định dạng JSON thuần túy:
        {
          "insight": {
            "selectedPlan": "string",
            "planExplanation": "string",
            "doToday": { "activity": "string", "explanation": "string" },
            "avoidToday": { "activity": "string", "explanation": "string" }
          }
        }
      `
      : `
        Dựa trên thần số học, hôm nay là ngày cá nhân số ${personalDayNumber}. 
        Hãy gợi ý **năm việc nên làm** và **năm việc nên tránh** phù hợp với năng lượng của số ${personalDayNumber}.
        Mỗi gợi ý kèm giải thích ngắn gọn (2-3 câu) tại sao nó phù hợp hoặc nên tránh.
        Trả về định dạng JSON thuần túy:
        {
          "insight": {
            "doToday": [
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" }
            ],
            "avoidToday": [
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" },
              { "activity": "string", "explanation": "string" }
            ]
          }
        }
      `

    // Call Gemini API
    let geminiResponse
    try {
      geminiResponse = await callGeminiApi(prompt)
      console.log('Gemini API response:', geminiResponse)
    } catch (apiError) {
      console.error('Gemini API call failed:', apiError.message)
      return getFallbackResponse(personalDayNumber, planList)
    }

    // Validate response
    if (planList.length > 0) {
      if (
        !geminiResponse ||
        !geminiResponse.insight ||
        !geminiResponse.insight.selectedPlan ||
        !geminiResponse.insight.planExplanation ||
        !geminiResponse.insight.doToday ||
        !geminiResponse.insight.avoidToday
      ) {
        console.error('Invalid Gemini response:', geminiResponse)
        return getFallbackResponse(personalDayNumber, planList)
      }
    } else {
      if (
        !geminiResponse ||
        !geminiResponse.insight ||
        !Array.isArray(geminiResponse.insight.doToday) ||
        geminiResponse.insight.doToday.length !== 5 ||
        !Array.isArray(geminiResponse.insight.avoidToday) ||
        geminiResponse.insight.avoidToday.length !== 5
      ) {
        console.error('Invalid Gemini response:', geminiResponse)
        return getFallbackResponse(personalDayNumber, planList)
      }
    }

    return {
      personalDayNumber,
      recommendations: geminiResponse
    }
  } catch (error) {
    console.error('Handler error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Lỗi server khi xử lý yêu cầu'
    })
  }
})

function getFallbackResponse(personalDayNumber, planList) {
  console.log('Using fallback response for personal day number:', personalDayNumber)
  const defaultSuggestions = {
    1: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng dẫn đầu và sáng tạo của số 1.`,
            doToday: { activity: 'Thực hiện dự định với sự tự tin.', explanation: 'Số 1 khuyến khích sự quyết đoán, giúp bạn dẫn đầu hiệu quả.' },
            avoidToday: { activity: 'Do dự khi đưa ra quyết định.', explanation: 'Số 1 cần sự độc lập, nên tránh chần chừ.' }
          }
        : {
            doToday: [
              { activity: 'Bắt đầu một dự án mới.', explanation: 'Số 1 mang năng lượng khởi xướng, khuyến khích bạn tự tin dẫn đầu.' },
              { activity: 'Lên kế hoạch cho mục tiêu cá nhân.', explanation: 'Số 1 hỗ trợ sự độc lập, giúp bạn định hướng tương lai.' },
              { activity: 'Thuyết trình ý tưởng mới.', explanation: 'Số 1 thúc đẩy sự sáng tạo, phù hợp với việc chia sẻ tầm nhìn.' },
              { activity: 'Tập luyện để tăng năng lượng.', explanation: 'Số 1 cần sự mạnh mẽ, tập thể dục giúp bạn tràn đầy sức sống.' },
              { activity: 'Gặp gỡ người có ảnh hưởng.', explanation: 'Số 1 khuyến khích kết nối với người truyền cảm hứng.' }
            ],
            avoidToday: [
              { activity: 'Trì hoãn công việc.', explanation: 'Số 1 cần hành động, trì hoãn làm giảm năng lượng tích cực.' },
              { activity: 'Phụ thuộc vào người khác.', explanation: 'Số 1 yêu cầu độc lập, dựa dẫm làm mất sự tự chủ.' },
              { activity: 'Tránh đưa ra ý kiến.', explanation: 'Số 1 cần sự tự tin, im lặng có thể kìm hãm sáng tạo.' },
              { activity: 'Làm việc nhóm quá nhiều.', explanation: 'Số 1 ưu tiên cá nhân, làm việc nhóm có thể gây phân tâm.' },
              { activity: 'Bỏ qua chi tiết quan trọng.', explanation: 'Số 1 cần sự chính xác để đạt mục tiêu.' }
            ]
          }
    },
    2: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng hòa hợp và nhạy cảm của số 2.`,
            doToday: { activity: 'Hỗ trợ đồng nghiệp hoặc bạn bè.', explanation: 'Số 2 khuyến khích sự hợp tác, giúp xây dựng mối quan hệ.' },
            avoidToday: { activity: 'Gây xung đột.', explanation: 'Số 2 cần hòa bình, tranh cãi làm mất cân bằng.' }
          }
        : {
            doToday: [
              { activity: 'Gặp gỡ bạn bè.', explanation: 'Số 2 khuyến khích kết nối, giúp bạn cảm thấy cân bằng.' },
              { activity: 'Lắng nghe ý kiến người khác.', explanation: 'Số 2 hỗ trợ sự nhạy cảm, giúp bạn hiểu sâu hơn.' },
              { activity: 'Tham gia làm việc nhóm.', explanation: 'Số 2 thúc đẩy hợp tác, mang lại kết quả tốt.' },
              { activity: 'Thiền để thư giãn.', explanation: 'Số 2 cần sự yên bình, thiền giúp bạn hài hòa.' },
              { activity: 'Giúp đỡ người cần hỗ trợ.', explanation: 'Số 2 khuyến khích sự sẻ chia, tạo cảm giác ý nghĩa.' }
            ],
            avoidToday: [
              { activity: 'Cô lập bản thân.', explanation: 'Số 2 cần kết nối, cô lập làm giảm năng lượng tích cực.' },
              { activity: 'Tranh cãi với người khác.', explanation: 'Số 2 yêu cầu hòa hợp, xung đột gây mất cân bằng.' },
              { activity: 'Bỏ qua cảm xúc người khác.', explanation: 'Số 2 cần sự nhạy cảm, thờ ơ làm tổn thương mối quan hệ.' },
              { activity: 'Làm việc một mình quá lâu.', explanation: 'Số 2 ưu tiên hợp tác, làm một mình gây mất hứng thú.' },
              { activity: 'Đưa ra quyết định vội vàng.', explanation: 'Số 2 cần cân nhắc kỹ, vội vàng có thể gây sai lầm.' }
            ]
          }
    },
    3: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng sáng tạo và vui vẻ của số 3.`,
            doToday: { activity: 'Thể hiện sự sáng tạo trong công việc.', explanation: 'Số 3 khuyến khích biểu đạt, giúp bạn tỏa sáng.' },
            avoidToday: { activity: 'Làm việc đơn điệu.', explanation: 'Số 3 cần sự năng động, công việc lặp lại gây nhàm chán.' }
          }
        : {
            doToday: [
              { activity: 'Viết lách hoặc vẽ tranh.', explanation: 'Số 3 thúc đẩy sự sáng tạo, giúp bạn thể hiện bản thân.' },
              { activity: 'Tham gia sự kiện xã hội.', explanation: 'Số 3 hỗ trợ sự vui vẻ, kết nối mang lại năng lượng.' },
              { activity: 'Chia sẻ câu chuyện thú vị.', explanation: 'Số 3 khuyến khích giao tiếp, giúp bạn truyền cảm hứng.' },
              { activity: 'Thử món ăn mới.', explanation: 'Số 3 cần sự mới mẻ, trải nghiệm ẩm thực khơi dậy niềm vui.' },
              { activity: 'Tổ chức một buổi tụ họp.', explanation: 'Số 3 yêu cầu sự sôi động, tụ họp mang lại hạnh phúc.' }
            ],
            avoidToday: [
              { activity: 'Làm việc nghiêm túc quá mức.', explanation: 'Số 3 cần niềm vui, sự cứng nhắc làm giảm năng lượng.' },
              { activity: 'Giữ im lặng trong nhóm.', explanation: 'Số 3 yêu cầu biểu đạt, im lặng kìm hãm sáng tạo.' },
              { activity: 'Lặp lại thói quen cũ.', explanation: 'Số 3 cần sự mới mẻ, thói quen gây nhàm chán.' },
              { activity: 'Tránh giao tiếp xã hội.', explanation: 'Số 3 ưu tiên kết nối, cô lập làm mất hứng thú.' },
              { activity: 'Tập trung vào chi tiết nhỏ.', explanation: 'Số 3 cần sự tự do, chi tiết làm giảm cảm hứng.' }
            ]
          }
    },
    4: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng ổn định và thực tế của số 4.`,
            doToday: { activity: 'Hoàn thành công việc theo kế hoạch.', explanation: 'Số 4 khuyến khích sự tổ chức, giúp bạn đạt mục tiêu.' },
            avoidToday: { activity: 'Hành động bốc đồng.', explanation: 'Số 4 cần sự cẩn thận, vội vàng gây sai lầm.' }
          }
        : {
            doToday: [
              { activity: 'Lập kế hoạch chi tiết.', explanation: 'Số 4 hỗ trợ sự tổ chức, giúp bạn xây dựng nền tảng vững chắc.' },
              { activity: 'Hoàn thành công việc dang dở.', explanation: 'Số 4 khuyến khích sự kiên trì, mang lại kết quả tốt.' },
              { activity: 'Kiểm tra tài chính cá nhân.', explanation: 'Số 4 cần sự thực tế, quản lý tài chính giúp ổn định.' },
              { activity: 'Sửa chữa hoặc dọn dẹp nhà cửa.', explanation: 'Số 4 yêu cầu trật tự, dọn dẹp tạo môi trường tốt.' },
              { activity: 'Học một kỹ năng thực tế.', explanation: 'Số 4 thúc đẩy sự phát triển, kỹ năng mang lại giá trị.' }
            ],
            avoidToday: [
              { activity: 'Hành động không có kế hoạch.', explanation: 'Số 4 cần sự cẩn thận, bốc đồng gây rối loạn.' },
              { activity: 'Bỏ qua chi tiết quan trọng.', explanation: 'Số 4 yêu cầu chính xác, bất cẩn dẫn đến sai lầm.' },
              { activity: 'Thay đổi kế hoạch đột ngột.', explanation: 'Số 4 cần ổn định, thay đổi gây mất phương hướng.' },
              { activity: 'Lãng phí thời gian.', explanation: 'Số 4 ưu tiên hiệu quả, lãng phí làm giảm năng suất.' },
              { activity: 'Tránh trách nhiệm.', explanation: 'Số 4 cần sự đáng tin cậy, trốn tránh gây mất uy tín.' }
            ]
          }
    },
    5: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng tự do và phiêu lưu của số 5.`,
            doToday: { activity: 'Khám phá điều mới mẻ.', explanation: 'Số 5 khuyến khích sự thay đổi, giúp bạn mở rộng tầm nhìn.' },
            avoidToday: { activity: 'Giới hạn bản thân.', explanation: 'Số 5 cần sự linh hoạt, thói quen cũ gây nhàm chán.' }
          }
        : {
            doToday: [
              { activity: 'Đi du lịch ngắn ngày.', explanation: 'Số 5 khuyến khích khám phá, giúp bạn trải nghiệm mới mẻ.' },
              { activity: 'Thử một hoạt động mới.', explanation: 'Số 5 hỗ trợ sự tò mò, mang lại cảm hứng.' },
              { activity: 'Gặp gỡ người lạ.', explanation: 'Số 5 thúc đẩy kết nối, mở rộng mạng lưới quan hệ.' },
              { activity: 'Thay đổi thói quen hàng ngày.', explanation: 'Số 5 cần sự linh hoạt, thay đổi tạo năng lượng.' },
              { activity: 'Học một kỹ năng nhanh.', explanation: 'Số 5 yêu cầu sự năng động, học hỏi mang lại giá trị.' }
            ],
            avoidToday: [
              { activity: 'Bám vào thói quen cũ.', explanation: 'Số 5 cần sự mới mẻ, thói quen làm giảm năng lượng.' },
              { activity: 'Làm việc lặp đi lặp lại.', explanation: 'Số 5 yêu cầu sự đa dạng, lặp lại gây nhàm chán.' },
              { activity: 'Tránh rủi ro nhỏ.', explanation: 'Số 5 cần sự táo bạo, sợ hãi kìm hãm cơ hội.' },
              { activity: 'Ở trong vùng an toàn.', explanation: 'Số 5 ưu tiên khám phá, an toàn làm mất hứng thú.' },
              { activity: 'Lập kế hoạch quá chi tiết.', explanation: 'Số 5 cần tự do, chi tiết gây gò bó.' }
            ]
          }
    },
    6: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng yêu thương và trách nhiệm của số 6.`,
            doToday: { activity: 'Dành thời gian cho người thân.', explanation: 'Số 6 khuyến khích sự chăm sóc, giúp bạn kết nối.' },
            avoidToday: { activity: 'Tập trung vào bản thân.', explanation: 'Số 6 cần sẻ chia, ích kỷ làm mất cân bằng.' }
          }
        : {
            doToday: [
              { activity: 'Dành thời gian cho gia đình.', explanation: 'Số 6 thúc đẩy sự yêu thương, mang lại cảm giác ấm áp.' },
              { activity: 'Giúp đỡ đồng nghiệp.', explanation: 'Số 6 hỗ trợ sự sẻ chia, tạo môi trường hài hòa.' },
              { activity: 'Tổ chức một bữa ăn chung.', explanation: 'Số 6 khuyến khích kết nối, bữa ăn mang lại niềm vui.' },
              { activity: 'Tham gia hoạt động cộng đồng.', explanation: 'Số 6 cần sự cống hiến, giúp bạn tạo giá trị.' },
              { activity: 'Lắng nghe người thân.', explanation: 'Số 6 yêu cầu sự quan tâm, lắng nghe tăng sự gắn kết.' }
            ],
            avoidToday: [
              { activity: 'Bỏ qua nhu cầu người khác.', explanation: 'Số 6 cần sự chăm sóc, thờ ơ làm tổn thương mối quan hệ.' },
              { activity: 'Tập trung vào lợi ích cá nhân.', explanation: 'Số 6 yêu cầu vị tha, ích kỷ gây mất cân bằng.' },
              { activity: 'Làm việc quá sức.', explanation: 'Số 6 cần sự hài hòa, làm việc quá mức gây mệt mỏi.' },
              { activity: 'Tránh trách nhiệm gia đình.', explanation: 'Số 6 ưu tiên trách nhiệm, trốn tránh làm mất uy tín.' },
              { activity: 'Gây căng thẳng trong nhóm.', explanation: 'Số 6 cần sự hòa hợp, căng thẳng làm giảm năng lượng.' }
            ]
          }
    },
    7: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng nội tâm và khám phá của số 7.`,
            doToday: { activity: 'Suy ngẫm về mục tiêu cá nhân.', explanation: 'Số 7 khuyến khích sự tĩnh lặng, giúp bạn hiểu bản thân.' },
            avoidToday: { activity: 'Phân tâm bởi sự ồn ào.', explanation: 'Số 7 cần tập trung, ồn ào làm mất sự tĩnh lặng.' }
          }
        : {
            doToday: [
              { activity: 'Thiền định.', explanation: 'Số 7 khuyến khích sự tĩnh lặng, giúp bạn kết nối với nội tâm.' },
              { activity: 'Nghiên cứu một chủ đề mới.', explanation: 'Số 7 hỗ trợ sự học hỏi, mở rộng kiến thức.' },
              { activity: 'Đi dạo một mình trong thiên nhiên.', explanation: 'Số 7 cần sự yên bình, thiên nhiên mang lại cảm hứng.' },
              { activity: 'Đọc sách triết học.', explanation: 'Số 7 yêu cầu sự sâu sắc, đọc sách giúp bạn suy ngẫm.' },
              { activity: 'Viết nhật ký.', explanation: 'Số 7 thúc đẩy tự phản ánh, viết lách giúp bạn hiểu rõ hơn.' }
            ],
            avoidToday: [
              { activity: 'Tham gia sự kiện đông người.', explanation: 'Số 7 cần sự tĩnh lặng, đám đông gây phân tâm.' },
              { activity: 'Làm việc nhóm quá nhiều.', explanation: 'Số 7 yêu cầu sự độc lập, làm nhóm làm giảm tập trung.' },
              { activity: 'Bị cuốn vào mạng xã hội.', explanation: 'Số 7 cần sự sâu sắc, mạng xã hội gây mất thời gian.' },
              { activity: 'Bỏ qua trực giác.', explanation: 'Số 7 ưu tiên trực giác, bỏ qua làm mất hướng đi.' },
              { activity: 'Làm việc vội vàng.', explanation: 'Số 7 cần sự cẩn thận, vội vàng gây sai lầm.' }
            ]
          }
    },
    8: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng tham vọng và thành công của số 8.`,
            doToday: { activity: 'Tập trung vào mục tiêu công việc.', explanation: 'Số 8 khuyến khích sự quyết đoán, giúp bạn đạt thành tựu.' },
            avoidToday: { activity: 'Lãng phí thời gian.', explanation: 'Số 8 cần hiệu quả, lãng phí làm giảm năng suất.' }
          }
        : {
            doToday: [
              { activity: 'Đàm phán hợp đồng.', explanation: 'Số 8 hỗ trợ sự quyết đoán, mang lại cơ hội thành công.' },
              { activity: 'Kiểm tra kế hoạch tài chính.', explanation: 'Số 8 khuyến khích quản lý, giúp bạn ổn định tài chính.' },
              { activity: 'Lãnh đạo một dự án.', explanation: 'Số 8 cần sự lãnh đạo, dẫn dắt mang lại uy tín.' },
              { activity: 'Tham gia cuộc họp quan trọng.', explanation: 'Số 8 yêu cầu sự hiện diện, họp giúp bạn tỏa sáng.' },
              { activity: 'Đặt mục tiêu dài hạn.', explanation: 'Số 8 thúc đẩy tham vọng, mục tiêu mang lại định hướng.' }
            ],
            avoidToday: [
              { activity: 'Làm việc không hiệu quả.', explanation: 'Số 8 cần năng suất, lãng phí làm giảm thành công.' },
              { activity: 'Tránh đưa ra quyết định.', explanation: 'Số 8 yêu cầu sự quyết đoán, do dự làm mất cơ hội.' },
              { activity: 'Chi tiêu không kiểm soát.', explanation: 'Số 8 cần quản lý, chi tiêu bừa bãi gây bất ổn.' },
              { activity: 'Làm việc không có kế hoạch.', explanation: 'Số 8 ưu tiên tổ chức, thiếu kế hoạch gây thất bại.' },
              { activity: 'Bỏ qua cơ hội networking.', explanation: 'Số 8 cần kết nối, bỏ qua làm mất lợi thế.' }
            ]
          }
    },
    9: {
      insight: planList.length > 0
        ? {
            selectedPlan: planList[Math.floor(Math.random() * planList.length)],
            planExplanation: `Dự định ${planList[0]} phù hợp với năng lượng nhân ái và lý tưởng của số 9.`,
            doToday: { activity: 'Tham gia hoạt động từ thiện.', explanation: 'Số 9 khuyến khích cống hiến, giúp bạn tạo giá trị.' },
            avoidToday: { activity: 'Tập trung vào lợi ích cá nhân.', explanation: 'Số 9 cần vị tha, ích kỷ làm mất ý nghĩa.' }
          }
        : {
            doToday: [
              { activity: 'Tham gia hoạt động từ thiện.', explanation: 'Số 9 khuyến khích cống hiến, mang lại ý nghĩa sâu sắc.' },
              { activity: 'Chia sẻ kiến thức với người khác.', explanation: 'Số 9 hỗ trợ sự sẻ chia, giúp bạn truyền cảm hứng.' },
              { activity: 'Hỗ trợ cộng đồng địa phương.', explanation: 'Số 9 cần sự nhân ái, hỗ trợ tạo giá trị.' },
              { activity: 'Viết bài về lý tưởng cá nhân.', explanation: 'Số 9 yêu cầu biểu đạt, viết lách mang lại cảm hứng.' },
              { activity: 'Tham gia sự kiện xã hội.', explanation: 'Số 9 thúc đẩy kết nối, sự kiện mang lại năng lượng.' }
            ],
            avoidToday: [
              { activity: 'Tập trung vào lợi ích cá nhân.', explanation: 'Số 9 cần vị tha, ích kỷ làm mất ý nghĩa.' },
              { activity: 'Bỏ qua cơ hội giúp đỡ.', explanation: 'Số 9 yêu cầu cống hiến, thờ ơ làm giảm giá trị.' },
              { activity: 'Giữ im lặng về lý tưởng.', explanation: 'Số 9 cần biểu đạt, im lặng kìm hãm cảm hứng.' },
              { activity: 'Làm việc vì lợi nhuận đơn thuần.', explanation: 'Số 9 ưu tiên ý nghĩa, lợi nhuận làm mất lý tưởng.' },
              { activity: 'Tránh kết nối cộng đồng.', explanation: 'Số 9 cần sẻ chia, cô lập làm giảm năng lượng.' }
            ]
          }
    }
  }

  const suggestion = defaultSuggestions[personalDayNumber] || defaultSuggestions[9]
  return {
    personalDayNumber,
    recommendations: suggestion
  }
}