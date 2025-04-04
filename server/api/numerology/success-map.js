import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalYearNumber
} from '../utils/numerologyUtils';

// Timeout configuration
const GEMINI_TIMEOUT = 10000; // 10 seconds
const FALLBACK_TIMEOUT = 3000; // 3 seconds

export default defineEventHandler(async (event) => {
  const startTime = Date.now();
  
  try {
    const { name, birthDate } = await readBody(event);

    // Validate input
    if (!name || !birthDate) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.'
      });
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Định dạng ngày sinh không hợp lệ. Vui lòng sử dụng định dạng DD/MM/YYYY.'
      });
    }

    // Calculate core numbers
    const numbers = {
      lifePath: calculateLifePathNumber(birthDate),
      expression: calculateExpressionNumber(name),
      soulUrge: calculateSoulUrgeNumber(name),
      personalYear: calculatePersonalYearNumber(birthDate, new Date().getFullYear())
    };

    console.log('[SuccessMap] Calculated numbers:', numbers);

    // Prepare Gemini prompt
    const prompt = `Dựa trên thần số học, tạo bản đồ thành công với ngày sinh ${birthDate} và các con số:
      - Số Đường đời: ${numbers.lifePath}
      - Số Tên: ${numbers.expression}
      - Số Linh hồn: ${numbers.soulUrge}
      - Số Cá nhân năm ${new Date().getFullYear()}: ${numbers.personalYear}
      Trả về JSON hợp lệ với các trường:
      - "lifePathNumber": Số Đường đời.
      - "expressionNumber": Số Tên.
      - "soulUrgeNumber": Số Linh hồn.
      - "personalYearNumber": Số Cá nhân năm hiện tại.
      - "goal": Mục tiêu lớn dựa trên Số Đường đời (4-5 câu).
      - "strengths": Điểm mạnh dựa trên Số Tên (3-4 câu).
      - "notes": Điểm cần lưu ý dựa trên Số Linh hồn (3-4 câu).
      - "strategy": Chiến lược năm hiện tại dựa trên Số Cá nhân (4-5 câu).
      - "milestones": Object chứa các cột mốc:
        - "shortTerm": Cột mốc ngắn hạn dựa trên Số Linh hồn (3-4 câu).
        - "mediumTerm": Cột mốc trung hạn dựa trên Số Tên (3-4 câu).
        - "longTerm": Cột mốc dài hạn dựa trên Số Đường đời (3-4 câu).
        - "currentYear": Cột mốc năm hiện tại dựa trên Số Cá nhân (3-4 câu).
      Giọng điệu tự nhiên, khách quan, dùng "bạn" thay vì tên cụ thể trong diễn giải, chỉ nhắc tên "${name}" ở câu đầu mỗi phần "goal", "strengths", "notes", "strategy". Chỉ trả về JSON thuần túy, không markdown trong JSON!`;

    // Call Gemini API with timeout
    let geminiResponse;
    try {
      geminiResponse = await Promise.race([
        callGeminiApi(prompt),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Gemini API timeout')), GEMINI_TIMEOUT)
        )
      ]);
    } catch (geminiError) {
      console.error('[SuccessMap] Gemini API error:', geminiError.message);
      throw new Error('Không thể kết nối với dịch vụ phân tích. Vui lòng thử lại sau.');
    }

    // Validate Gemini response
    if (!geminiResponse || 
        !geminiResponse.lifePathNumber || 
        !geminiResponse.milestones) {
      throw new Error('Dữ liệu phân tích không đầy đủ');
    }

    // Prepare response
    const response = {
      successMap: geminiResponse,
      meta: {
        processedIn: Date.now() - startTime,
        timestamp: new Date().toISOString()
      }
    };

    console.log(`[SuccessMap] Successfully processed request in ${response.meta.processedIn}ms`);
    return response;

  } catch (error) {
    console.error('[SuccessMap] Error:', error.message);
    
    // Fallback response with timeout protection
    try {
      const fallbackResponse = await Promise.race([
        getFallbackResponse(name, birthDate),
        new Promise((resolve) => 
          setTimeout(() => resolve(getBasicFallback(name, birthDate)), FALLBACK_TIMEOUT)
        )
      ]);
      
      return fallbackResponse;
    } catch (fallbackError) {
      console.error('[SuccessMap] Fallback failed:', fallbackError.message);
      throw createError({
        statusCode: 500,
        statusMessage: 'Lỗi hệ thống. Vui lòng thử lại sau.'
      });
    }
  }
});

// Optimized fallback response generator
function getFallbackResponse(name, birthDate) {
  const currentYear = new Date().getFullYear();
  const numbers = {
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name),
    personalYear: calculatePersonalYearNumber(birthDate, currentYear)
  };

  return {
    successMap: {
      lifePathNumber: numbers.lifePath,
      expressionNumber: numbers.expression,
      soulUrgeNumber: numbers.soulUrge,
      personalYearNumber: numbers.personalYear,
      goal: generateGoalText(name, numbers.lifePath),
      strengths: generateStrengthsText(name, numbers.expression),
      notes: generateNotesText(name, numbers.soulUrge),
      strategy: generateStrategyText(name, numbers.personalYear, currentYear),
      milestones: generateMilestones(numbers, currentYear)
    },
    isFallback: true
  };
}

// Helper functions for fallback response
function generateGoalText(name, lifePathNumber) {
  const goals = {
    1: `${name} với Số Đường đời 1 là người tiên phong, có khả năng lãnh đạo bẩm sinh. Mục tiêu của bạn là phát triển sự độc lập và tự tin, trở thành người dẫn đầu trong lĩnh vực của mình.`,
    2: `${name} với Số Đường đời 2 có tài ngoại giao và xây dựng mối quan hệ. Mục tiêu của bạn là tạo ra sự hài hòa và hợp tác trong mọi tình huống.`,
    3: `${name} với Số Đường đời 3 có khả năng sáng tạo và giao tiếp xuất sắc. Mục tiêu của bạn là thể hiện bản thân và truyền cảm hứng cho người khác.`,
    4: `${name} với Số Đường đời 4 có tư duy thực tế và kỷ luật. Mục tiêu của bạn là xây dựng nền tảng vững chắc cho bản thân và người thân.`,
    5: `${name} với Số Đường đời 5 khao khát tự do và trải nghiệm. Mục tiêu của bạn là sống trọn vẹn, khám phá thế giới và thích nghi với thay đổi.`,
    6: `${name} với Số Đường đời 6 có trách nhiệm và tình yêu thương. Mục tiêu của bạn là chăm sóc người khác và tạo ra sự cân bằng trong cuộc sống.`,
    7: `${name} với Số Đường đời 7 có trí tuệ và trực giác mạnh mẽ. Mục tiêu của bạn là khám phá sự thật và chia sẻ kiến thức với thế giới.`,
    8: `${name} với Số Đường đời 8 có tài năng quản lý và tổ chức. Mục tiêu của bạn là đạt được thành công vật chất và sử dụng nó một cách khôn ngoan.`,
    9: `${name} với Số Đường đời 9 có lòng nhân ái và tầm nhìn rộng. Mục tiêu của bạn là cống hiến cho cộng đồng và để lại di sản tích cực.`,
    11: `${name} với Số Đường đời 11 là người có tầm nhìn và lý tưởng cao. Mục tiêu của bạn là truyền cảm hứng và nâng cao nhận thức cho người khác.`,
    22: `${name} với Số Đường đời 22 có khả năng biến ước mơ thành hiện thực. Mục tiêu của bạn là tạo ra những thay đổi lớn lao và bền vững cho xã hội.`
  };
  return goals[lifePathNumber] || `${name} có một con đường đặc biệt với nhiều cơ hội phát triển bản thân và đóng góp cho xã hội.`;
}

function generateStrengthsText(name, expressionNumber) {
  const strengths = {
    1: `${name} có khả năng lãnh đạo và sáng tạo xuất sắc. Bạn độc lập, quyết đoán và có tầm nhìn rõ ràng.`,
    2: `${name} có tài ngoại giao và hợp tác. Bạn nhạy cảm, kiên nhẫn và biết lắng nghe người khác.`,
    3: `${name} có khả năng giao tiếp và sáng tạo vượt trội. Bạn lạc quan, hài hước và truyền cảm hứng.`,
    4: `${name} có tư duy thực tế và kỷ luật. Bạn đáng tin cậy, kiên trì và có khả năng tổ chức tốt.`,
    5: `${name} có khả năng thích nghi và đa tài. Bạn năng động, tò mò và luôn tìm kiếm trải nghiệm mới.`,
    6: `${name} có trách nhiệm và tình yêu thương. Bạn chu đáo, công bằng và có khả năng chăm sóc người khác.`,
    7: `${name} có trí tuệ và trực giác mạnh mẽ. Bạn phân tích sâu sắc, độc lập và luôn tìm kiếm sự thật.`,
    8: `${name} có tài năng quản lý và tổ chức. Bạn tham vọng, tự tin và có khả năng lãnh đạo.`,
    9: `${name} có lòng nhân ái và tầm nhìn rộng. Bạn sáng tạo, lý tưởng và quan tâm đến cộng đồng.`,
    11: `${name} có trực giác và cảm hứng đặc biệt. Bạn nhạy cảm, sáng tạo và có khả năng truyền cảm hứng.`,
    22: `${name} có khả năng biến ý tưởng thành hiện thực. Bạn thực tế, kiên trì và có tầm nhìn xa.`
  };
  return strengths[expressionNumber] || `${name} có nhiều điểm mạnh đặc biệt sẽ giúp bạn đạt được thành công.`;
}

// Minimal fallback when everything fails
function getBasicFallback(name, birthDate) {
  return {
    successMap: {
      lifePathNumber: 1,
      expressionNumber: 1,
      soulUrgeNumber: 1,
      personalYearNumber: 1,
      goal: 'Hệ thống đang bận. Vui lòng thử lại sau để nhận phân tích chi tiết.',
      strengths: 'Hệ thống đang bận. Vui lòng thử lại sau để nhận phân tích chi tiết.',
      notes: 'Hệ thống đang bận. Vui lòng thử lại sau để nhận phân tích chi tiết.',
      strategy: 'Hệ thống đang bận. Vui lòng thử lại sau để nhận phân tích chi tiết.',
      milestones: {
        shortTerm: 'Hệ thống đang bận. Vui lòng thử lại sau.',
        mediumTerm: 'Hệ thống đang bận. Vui lòng thử lại sau.',
        longTerm: 'Hệ thống đang bận. Vui lòng thử lại sau.',
        currentYear: 'Hệ thống đang bận. Vui lòng thử lại sau.'
      }
    },
    isFallback: true
  };
}