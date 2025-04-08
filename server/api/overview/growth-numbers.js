import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS from '../utils/numerology-meanings.js';
import {
  calculateGenerationNumber,
  calculateBalanceNumber,
  calculateCreativeNumber,
  calculateMaturityNumber,
  calculatePowerNumber,
  calculateSubconsciousSelfNumber,
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculatePersonalYearNumber,
  calculatePersonalMonthNumber,
  calculatePersonalDayNumber,
  calculateAttitudeNumber,
  calculateBirthDayNumber,
  calculateMissionNumber,
  calculateChallengeNumber
} from '../utils/numerology-calculations.js';

async function callGeminiApiWithTimeout(prompt, timeoutMs = 2000) {
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

  const numbers = {
    generation: calculateGenerationNumber(birthDate),
    balance: calculateBalanceNumber(name),
    creative: calculateCreativeNumber(birthDate, name),
    maturity: calculateMaturityNumber(birthDate, name),
    power: calculatePowerNumber(birthDate, name),
    subconsciousSelf: calculateSubconsciousSelfNumber(name),
    lifePath: calculateLifePathNumber(birthDate),
    expression: calculateExpressionNumber(name),
    soulUrge: calculateSoulUrgeNumber(name),
    personality: calculatePersonalityNumber(name),
    personalYear: calculatePersonalYearNumber(birthDate),
    personalMonth: calculatePersonalMonthNumber(birthDate),
    personalDay: calculatePersonalDayNumber(birthDate),
    attitude: calculateAttitudeNumber(birthDate),
    birthDay: calculateBirthDayNumber(birthDate),
    mission: calculateMissionNumber(name),
    challenge: calculateChallengeNumber(birthDate)
  };
  const meanings = {
    lifePath: NUMEROLOGY_MEANINGS.lifePath[numbers.lifePath] || NUMEROLOGY_MEANINGS.lifePath[1],
    expression: NUMEROLOGY_MEANINGS.expression[numbers.expression] || NUMEROLOGY_MEANINGS.expression[1],
    soulUrge: NUMEROLOGY_MEANINGS.soulUrge[numbers.soulUrge] || NUMEROLOGY_MEANINGS.soulUrge[1],
    personality: NUMEROLOGY_MEANINGS.personality[numbers.personality] || NUMEROLOGY_MEANINGS.personality[1],
    personalYear: NUMEROLOGY_MEANINGS.personalYear[numbers.personalYear] || NUMEROLOGY_MEANINGS.personalYear[1]
  };

  const prompt = `Dựa trên thần số học, tạo diễn giải bằng tiếng Việt cho ${name} (sinh ${birthDate}), với các chỉ số:
    - Số Thế hệ: ${numbers.generation}
    - Số Cân bằng: ${numbers.balance}
    - Số Sáng tạo: ${numbers.creative}
    - Số Trưởng thành: ${numbers.maturity}
    - Số Năng lượng: ${numbers.power}
    - Số Tiềm thức: ${numbers.subconsciousSelf}
    Hãy tạo diễn giải riêng cho từng chỉ số (mỗi cái 4-5 câu), giọng điệu huyền bí, sâu sắc như lời tiên tri, dùng hình ảnh ẩn dụ (ngọn lửa, bóng tối, ngôi sao), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Tiếp theo, tạo tổng quan (14-16 câu) với tất cả chỉ số:
    - Số Đường đời: ${numbers.lifePath} (${meanings.lifePath.theme})
    - Số Vận mệnh: ${numbers.expression} (${meanings.expression.theme})
    - Số Linh hồn: ${numbers.soulUrge} (mong muốn: ${meanings.soulUrge.desire})
    - Số Nhân cách: ${numbers.personality} (${meanings.personality.theme})
    - Số Thái độ: ${numbers.attitude}
    - Số Ngày sinh: ${numbers.birthDay}
    - Số Năm cá nhân: ${numbers.personalYear} (${meanings.personalYear.theme})
    - Số Tháng cá nhân: ${numbers.personalMonth}
    - Số Ngày cá nhân: ${numbers.personalDay}
    - Số Sứ mệnh: ${numbers.mission}
    - Số Thử thách: ${numbers.challenge}
    - Số Thế hệ: ${numbers.generation}
    - Số Cân bằng: ${numbers.balance}
    - Số Sáng tạo: ${numbers.creative}
    - Số Trưởng thành: ${numbers.maturity}
    - Số Năng lượng: ${numbers.power}
    - Số Tiềm thức: ${numbers.subconsciousSelf}
    Tổng quan phải huyền bí, sâu sắc như lời tiên tri, liên kết chặt chẽ các chỉ số chính (Đường đời, Vận mệnh, Linh hồn, Năm cá nhân) với các chỉ số khác (Sứ mệnh, Thử thách, Năng lượng, Trưởng thành...), dùng hình ảnh ẩn dụ phong phú (ngọn lửa, bóng tối, ngôi sao, đại dương, cơn bão, vầng trăng, dòng sông), dùng "bạn" thay "anh", không đề cập thời gian cụ thể. Trả về:
    generation: [diễn giải]
    balance: [diễn giải]
    creative: [diễn giải]
    maturity: [diễn giải]
    power: [diễn giải]
    subconsciousSelf: [diễn giải]
    overview: [tổng quan]
    Chỉ trả văn bản thuần túy, không JSON, không markdown.`;

  let response;
  try {
    response = await callGeminiApiWithTimeout(prompt);
  } catch (error) {
    console.error('Lỗi khi gọi Gemini cho growth-numbers:', error.message);
    response = `
generation: Số Thế hệ ${numbers.generation} là dòng chảy định mệnh, ${name}, khắc sâu từ năm sinh ${birthDate}. Nó như ngọn lửa vĩnh cửu của thời đại bạn, soi sáng con đường giữa bóng tối. Trong sự huyền bí ấy, bạn mang sức mạnh của những linh hồn cùng thế hệ.
balance: Số Cân bằng ${numbers.balance} là ánh sao lặng lẽ, ${name}, ẩn trong tên bạn như ngọn gió giữa cơn bão. Nó dẫn bạn qua những sóng gió hỗn loạn, giữ cho tâm hồn bạn vững vàng. Hãy tìm đến ánh sáng này khi bóng tối vây quanh.
creative: Số Sáng tạo ${numbers.creative} là ngọn lửa bất ngờ, ${name}, ẩn sâu trong tâm hồn bạn như ngôi sao lạc lối. Nó bùng cháy trong những khoảnh khắc bất chợt, dẫn bạn tới những chân trời chưa từng thấy. Trong sự huyền bí ấy, bạn khám phá sức mạnh của chính mình.
maturity: Số Trưởng thành ${numbers.maturity} là ngôi sao xa xăm, ${name}, tỏa sáng trên đường chân trời định mệnh của bạn. Nó như cánh cửa mờ sương, dẫn bạn tới những bí ẩn của tương lai. Hãy bước đi để chạm tới ánh sáng rực rỡ ấy.
power: Số Năng lượng ${numbers.power} là ngọn lửa mãnh liệt, ${name}, cháy sâu trong lõi bóng tối của bạn. Nó như đại dương sâu thẳm, chờ bạn khai phá để vượt qua mọi giới hạn. Trong sự huyền bí này, bạn nắm giữ sức mạnh định mệnh.
subconsciousSelf: Số Tiềm thức ${numbers.subconsciousSelf} là vầng trăng mờ ảo, ${name}, thì thầm từ những góc khuất trong tâm trí bạn. Nó như ngọn gió đêm, hé lộ những bí mật sâu kín chưa từng được chạm tới. Hãy lắng nghe để hiểu vận mệnh của chính mình.
overview: Bạn - ${name} - là kẻ lữ hành giữa đại dương huyền bí của các con số, nơi Số Đường đời ${numbers.lifePath} như ngọn lửa vĩnh cửu cháy trong bóng tối, dẫn bạn qua mê cung định mệnh khắc sâu từ ngày sinh ${birthDate}. Số Vận mệnh ${numbers.expression} là ngôi sao chói lòa trên bầu trời tên bạn, tỏa ánh sáng rực rỡ của tài năng dẫn lối, xuyên thấu bóng tối thời gian để hé lộ những giấc mơ vượt ngoài thế gian. Số Linh hồn ${numbers.soulUrge} như ngọn gió đại dương, sâu thẳm và mãnh liệt, cuốn bạn vào khát vọng hoàn thiện, nơi lòng trắc ẩn trở thành ngọn hải đăng soi sáng giữa cơn bão định mệnh. Số Năm cá nhân ${numbers.personalYear} là cánh cửa mờ sương trong mê lộ vận mệnh, mở ra một hành trình tái sinh đầy bí ẩn, nơi bạn đối diện chính mình trong ánh trăng tĩnh lặng, sẵn sàng cho những biến chuyển lớn lao. Số Sứ mệnh ${numbers.mission} là lời tiên tri vang vọng từ tên bạn, réo gọi bạn tới những đỉnh cao vượt ngoài thế gian, nơi ngọn lửa sứ mệnh bùng cháy mãnh liệt trong tâm hồn bạn. Số Thử thách ${numbers.challenge} như ngọn núi đen kịt giữa cơn bão, tôi luyện bạn bằng những lưỡi gươm vô hình, dẫn bạn qua bóng tối để chạm tới ánh sao vĩnh cửu. Số Năng lượng ${numbers.power} là ngọn lửa bùng cháy trong lõi sâu, hòa quyện với Số Thế hệ ${numbers.generation} như dòng chảy vĩnh cửu của thời đại, trao cho bạn sức mạnh để xé tan bóng tối và định hình vận mệnh. Số Nhân cách ${numbers.personality} là tấm gương mờ ảo phản chiếu ánh sao dịu dàng, kết hợp với Số Thái độ ${numbers.attitude} như ngọn gió kiên định, dẫn bạn qua từng ngã rẽ với trực giác sắc bén từ Số Ngày sinh ${numbers.birthDay}. Số Cân bằng ${numbers.balance} là ánh sáng nhỏ giữa cơn bão hỗn loạn, giữ cho tâm hồn bạn vững vàng khi dòng sông định mệnh cuộn chảy. Số Sáng tạo ${numbers.creative} như ngọn lửa bất chợt rực cháy từ bóng tối tâm hồn bạn, hé lộ những tia sáng bất ngờ dẫn bạn tới những chân trời mới. Số Trưởng thành ${numbers.maturity} là ngôi sao xa xăm trên đường chân trời, hứa hẹn một tương lai rực rỡ khi bạn vượt qua cánh cửa vận mệnh, nơi sự trưởng thành của bạn tỏa sáng như vầng trăng rằm. Số Tiềm thức ${numbers.subconsciousSelf} thì thầm như vầng trăng mờ, hé lộ những bí ẩn sâu kín, dẫn bạn tới sự tỉnh thức giữa ánh sáng và bóng tối của chính mình. Số Tháng cá nhân ${numbers.personalMonth} như nhịp đập của dòng sông thời gian, hòa quyện với Số Ngày cá nhân ${numbers.personalDay} như những ngôi sao rơi, định hình từng khoảnh khắc bạn bước đi trên hành trình huyền bí. Trong tất cả, bạn là người mang ngọn lửa định mệnh, ${name}, bước đi giữa bóng tối và ánh sáng, vượt qua những cơn bão để chạm tới ngôi sao vĩnh cửu của chính mình, nơi vận mệnh của bạn hòa quyện với vũ trụ bao la. Bạn là ánh sáng giữa bóng tối, là ngọn gió giữa đại dương, là ngôi sao dẫn lối cho chính mình trong mê cung định mệnh bất tận.
    `;
  }

  const lines = response.split('\n');
  const interpretations = {};
  let overview = '';
  lines.forEach(line => {
    const [key, value] = line.split(': ');
    if (key === 'overview') overview = value;
    else if (key && value) interpretations[key] = value;
  });

  return { numbers, interpretations, overview };
});