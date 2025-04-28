import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS from '../utils/numerology-meanings.js';
import { 
  calculatePeakNumbers,
  calculateHiddenChallengeNumbers,
  checkKarmicNumbers,
  calculatePentagonNumbers
} from '../utils/numerology-calculations.js';

async function callGeminiApiWithTimeout(prompt, timeoutMs = 60000) { // Tăng timeout lên 60 giây
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await callGeminiApi(prompt, false, { signal: controller.signal });
    clearTimeout(timeout);
    return response;
  } catch (error) {
    clearTimeout(timeout);
    throw error;
  }
}

export default defineEventHandler(async (event) => {
  const { name, birthDate } = await readBody(event);

  // Kiểm tra đầu vào
  if (!name || !birthDate) {
    throw createError({ statusCode: 400, statusMessage: 'Thiếu thông tin: name và birthDate là bắt buộc.' });
  }

  // Kiểm tra định dạng birthDate
  const birthDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!birthDateRegex.test(birthDate)) {
    throw createError({ statusCode: 400, statusMessage: 'birthDate phải có định dạng DD/MM/YYYY.' });
  }

  // Kiểm tra tính hợp lệ của ngày sinh
  const [day, month, year] = birthDate.split('/').map(Number);
  const date = new Date(year, month - 1, day);
  if (isNaN(date.getTime()) || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    throw createError({ statusCode: 400, statusMessage: 'Ngày sinh không hợp lệ.' });
  }

  // Kiểm tra name
  if (name.trim().length < 2) {
    throw createError({ statusCode: 400, statusMessage: 'Tên phải có ít nhất 2 ký tự.' });
  }

  console.log('Đầu vào:', { name, birthDate });

  // Tính toán các chỉ số mở rộng
  let numbers = {};
  try {
    numbers.peaks = calculatePeakNumbers(birthDate) || { firstPeak: 1, secondPeak: 1, thirdPeak: 1, fourthPeak: 1 };
    numbers.hiddenChallenges = calculateHiddenChallengeNumbers(name) || { challenge1: 1, challenge2: 1, challenge3: 1, ultimateChallenge: 1 };
    numbers.karmic = checkKarmicNumbers(birthDate, name) || { inLifePath: false, inExpression: false, inBirthday: false, inPeaks: false };
    numbers.pentagon = calculatePentagonNumbers(birthDate, name) || { physical: 1, mental: 1, emotional: 1, intuitive: 1, spiritual: 1 };
    console.log('Kết quả tính toán:', JSON.stringify(numbers, null, 2));
  } catch (error) {
    console.error('Lỗi khi tính toán chỉ số:', error.message, error.stack);
    throw createError({ statusCode: 500, statusMessage: `Lỗi khi tính toán chỉ số thần số học: ${error.message}` });
  }

  // Kiểm tra và sửa cấu trúc numbers
  const missingFields = [];
  if (!numbers.peaks?.firstPeak) missingFields.push('peaks.firstPeak');
  if (!numbers.peaks?.secondPeak) missingFields.push('peaks.secondPeak');
  if (!numbers.peaks?.thirdPeak) missingFields.push('peaks.thirdPeak');
  if (!numbers.peaks?.fourthPeak) missingFields.push('peaks.fourthPeak');
  if (!numbers.hiddenChallenges?.ultimateChallenge) missingFields.push('hiddenChallenges.ultimateChallenge');
  if (numbers.karmic?.inLifePath === undefined) missingFields.push('karmic.inLifePath');
  if (!numbers.pentagon?.mental) missingFields.push('pentagon.mental');

  if (missingFields.length > 0) {
    console.warn('Cảnh báo: Cấu trúc numbers không hợp lệ, thiếu các trường:', missingFields);
    numbers.peaks = { ...numbers.peaks, firstPeak: 1, secondPeak: 1, thirdPeak: 1, fourthPeak: 1 };
    numbers.hiddenChallenges = { ...numbers.hiddenChallenges, challenge1: 1, challenge2: 1, challenge3: 1, ultimateChallenge: 1 };
    numbers.karmic = { ...numbers.karmic, inLifePath: false, inExpression: false, inBirthday: false, inPeaks: false };
    numbers.pentagon = { ...numbers.pentagon, physical: 1, mental: 1, emotional: 1, intuitive: 1, spiritual: 1 };
  }

  // Chuẩn bị prompt cho Gemini (đơn giản hóa)
  const prompt = `Tạo diễn giải thần số học bằng tiếng Việt cho ${name} (sinh ${birthDate}) với các chỉ số:
  
  **4 Đỉnh cao cuộc đời**:
  - Đỉnh 1: ${numbers.peaks.firstPeak} (${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.firstPeak]?.theme || 'Khởi đầu'})
  - Đỉnh 2: ${numbers.peaks.secondPeak} (${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.secondPeak]?.theme || 'Phát triển'})
  - Đỉnh 3: ${numbers.peaks.thirdPeak} (${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.thirdPeak]?.theme || 'Trưởng thành'})
  - Đỉnh 4: ${numbers.peaks.fourthPeak} (${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.fourthPeak]?.theme || 'Hoàn thiện'})
  
  **Thử thách ẩn**: ${numbers.hiddenChallenges.ultimateChallenge} (${NUMEROLOGY_MEANINGS.challenges?.[numbers.hiddenChallenges.ultimateChallenge]?.desc || 'Bài học'})
  
  **Nghiệp quả**: ${numbers.karmic.inLifePath ? 'Có nợ nghiệp' : 'Không có nợ nghiệp'}
  
  **Ngũ giác số (Tinh thần)**: ${numbers.pentagon.mental} (${NUMEROLOGY_MEANINGS.pentagon?.mental?.[numbers.pentagon.mental]?.trait || 'Tư duy'})
  
  Yêu cầu:
  1. Diễn giải ngắn gọn (2-3 câu mỗi phần), dùng "bạn", giọng thực tế.
  2. Trả về JSON hợp lệ:
     {
       "peaks": ["đỉnh 1", "đỉnh 2", "đỉnh 3", "đỉnh 4"],
       "challenges": ["thử thách"],
       "karmic": ["nghiệp quả"],
       "pentagon": ["ngũ giác"],
       "overview": ["tổng quan"]
     }
  3. Đảm bảo đúng số lượng phần tử (peaks: 4, challenges: 1, karmic: 1, pentagon: 1, overview: 1).
  4. Không thêm dấu ngoặc kép thừa trong khóa.
  5. Chỉ trả về JSON, không thêm văn bản ngoài.`;

  // Gọi Gemini API hoặc dùng fallback
  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
    console.log('Phản hồi từ Gemini API:', JSON.stringify(response, null, 2));
  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error.message, error.stack);
    response = {
      peaks: [
        `Đỉnh 1 (${numbers.peaks.firstPeak}): Bạn xây dựng nền tảng cá nhân trong giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.firstPeak]?.theme || 'khởi đầu'}. Sự độc lập giúp bạn đạt mục tiêu. Hãy tự tin tiến lên.`,
        `Đỉnh 2 (${numbers.peaks.secondPeak}): Giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.secondPeak]?.theme || 'phát triển'} tập trung vào mối quan hệ và kỹ năng. Cân bằng cá nhân và tập thể là chìa khóa. Hãy học hỏi và mở rộng tầm nhìn.`,
        `Đỉnh 3 (${numbers.peaks.thirdPeak}): Bạn đối mặt thử thách lớn trong giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.thirdPeak]?.theme || 'trưởng thành'}. Kiên nhẫn và kinh nghiệm sẽ giúp bạn vượt qua. Tập trung vào ổn định.`,
        `Đỉnh 4 (${numbers.peaks.fourthPeak}): Giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.fourthPeak]?.theme || 'hoàn thiện'} là lúc hoàn thiện mục tiêu dài hạn. Hãy để lại dấu ấn cá nhân. Tập trung vào giá trị lâu dài.`
      ],
      challenges: [
        `Thử thách số ${numbers.hiddenChallenges.ultimateChallenge} (${NUMEROLOGY_MEANINGS.challenges?.[numbers.hiddenChallenges.ultimateChallenge]?.desc || 'bài học'}) đòi hỏi bạn vượt qua khó khăn để trưởng thành. Hãy kiên trì và tập trung phát triển bản thân.`
      ],
      karmic: [
        `Bạn ${numbers.karmic.inLifePath ? 'mang nợ nghiệp cần giải quyết' : 'không có nợ nghiệp lớn'}. Chú ý bài học từ quá khứ để tiến bộ. Tiếp tục phát huy điểm mạnh.`
      ],
      pentagon: [
        `Tinh thần số ${numbers.pentagon.mental} (${NUMEROLOGY_MEANINGS.pentagon?.mental?.[numbers.pentagon.mental]?.trait || 'tư duy'}) giúp bạn đưa ra quyết định sáng suốt. Hãy tận dụng khả năng phân tích để thành công.`
      ],
      overview: [
        `Bạn có tiềm năng phát triển qua bốn đỉnh cao, với thử thách chính là số ${numbers.hiddenChallenges.ultimateChallenge}. Cân bằng độc lập và hợp tác để đạt mục tiêu dài hạn.`
      ]
    };
    console.warn('Đã sử dụng fallback do lỗi Gemini API:', error.message);
  }

  // Xử lý kết quả
  const interpretations = {};
  try {
    const isValidArray = (arr, expectedLength) => Array.isArray(arr) && arr.length === expectedLength && arr.every(item => typeof item === 'string' && item.trim());

    // Sửa khóa bất thường
    const cleanKey = (key) => key.replace(/^"|"$/g, '').replace(/\\"/g, '').replace(/\\\\/g, '');

    // Ánh xạ các khóa hợp lệ
    const validKeys = [
      { key: 'peaks', expectedLength: 4 },
      { key: 'challenges', expectedLength: 1 },
      { key: 'karmic', expectedLength: 1 },
      { key: 'pentagon', expectedLength: 1 },
      { key: 'overview', expectedLength: 1 }
    ];

    if (typeof response === 'object' && response !== null) {
      // Xử lý phản hồi dạng JSON
      let hasInvalidFields = false;
      for (const key in response) {
        const cleanedKey = cleanKey(key);
        const validKey = validKeys.find(vk => vk.key === cleanedKey);
        if (validKey) {
          if (isValidArray(response[key], validKey.expectedLength)) {
            interpretations[cleanedKey] = response[key].join('\n');
          } else {
            hasInvalidFields = true;
            interpretations[cleanedKey] = `Chưa có diễn giải do dữ liệu không hợp lệ từ Gemini API`;
          }
        }
      }

      // Đảm bảo tất cả khóa cần thiết có giá trị
      validKeys.forEach(({ key }) => {
        if (!(key in interpretations)) {
          interpretations[key] = `Chưa có diễn giải do thiếu trường ${key} trong phản hồi`;
        }
      });

      // Ghi log nếu JSON không hợp lệ
      if (hasInvalidFields) {
        console.warn('Cảnh báo: Phản hồi JSON từ Gemini API không hợp lệ:', {
          response: JSON.stringify(response, null, 2)
        });
      }
    } else {
      // Phản hồi không phải JSON, sử dụng fallback
      console.warn('Phản hồi không phải JSON, sử dụng fallback:', response);
      interpretations.peaks = response.peaks?.join('\n') || 'Chưa có diễn giải';
      interpretations.challenges = response.challenges?.join('\n') || 'Chưa có diễn giải';
      interpretations.karmic = response.karmic?.join('\n') || 'Chưa có diễn giải';
      interpretations.pentagon = response.pentagon?.join('\n') || 'Chưa có diễn giải';
      interpretations.overview = response.overview?.join('\n') || 'Chưa có diễn giải';
    }
  } catch (error) {
    console.error('Lỗi khi xử lý phản hồi:', error.message, error.stack);
    // Sử dụng fallback nếu xử lý lỗi
    interpretations.peaks = [
      `Đỉnh 1 (${numbers.peaks.firstPeak}): Bạn xây dựng nền tảng cá nhân trong giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.firstPeak]?.theme || 'khởi đầu'}. Sự độc lập giúp bạn đạt mục tiêu. Hãy tự tin tiến lên.`,
      `Đỉnh 2 (${numbers.peaks.secondPeak}): Giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.secondPeak]?.theme || 'phát triển'} tập trung vào mối quan hệ và kỹ năng. Cân bằng cá nhân và tập thể là chìa khóa. Hãy học hỏi và mở rộng tầm nhìn.`,
      `Đỉnh 3 (${numbers.peaks.thirdPeak}): Bạn đối mặt thử thách lớn trong giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.thirdPeak]?.theme || 'trưởng thành'}. Kiên nhẫn và kinh nghiệm sẽ giúp bạn vượt qua. Tập trung vào ổn định.`,
      `Đỉnh 4 (${numbers.peaks.fourthPeak}): Giai đoạn ${NUMEROLOGY_MEANINGS.peaks?.[numbers.peaks.fourthPeak]?.theme || 'hoàn thiện'} là lúc hoàn thiện mục tiêu dài hạn. Hãy để lại dấu ấn cá nhân. Tập trung vào giá trị lâu dài.`
    ].join('\n');
    interpretations.challenges = `Thử thách số ${numbers.hiddenChallenges.ultimateChallenge} (${NUMEROLOGY_MEANINGS.challenges?.[numbers.hiddenChallenges.ultimateChallenge]?.desc || 'bài học'}) đòi hỏi bạn vượt qua khó khăn để trưởng thành. Hãy kiên trì và tập trung phát triển bản thân.`;
    interpretations.karmic = `Bạn ${numbers.karmic.inLifePath ? 'mang nợ nghiệp cần giải quyết' : 'không có nợ nghiệp lớn'}. Chú ý bài học từ quá khứ để tiến bộ. Tiếp tục phát huy điểm mạnh.`;
    interpretations.pentagon = `Tinh thần số ${numbers.pentagon.mental} (${NUMEROLOGY_MEANINGS.pentagon?.mental?.[numbers.pentagon.mental]?.trait || 'tư duy'}) giúp bạn đưa ra quyết định sáng suốt. Hãy tận dụng khả năng phân tích để thành công.`;
    interpretations.overview = `Bạn có tiềm năng phát triển qua bốn đỉnh cao, với thử thách chính là số ${numbers.hiddenChallenges.ultimateChallenge}. Cân bằng độc lập và hợp tác để đạt mục tiêu dài hạn.`;
  }

  return { 
    numbers,
    interpretations
  };
});