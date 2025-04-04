import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';
import NUMEROLOGY_MEANINGS, { NumerologyUtils } from '../utils/numerology-meanings.js';

// Hàm tính toán
function getLifePathNumber(birthdate) {
  if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(birthdate)) return 9;
  const normalizedBirthdate = birthdate.replace(/-/g, '/');
  const [day, month, year] = normalizedBirthdate.split('/').map(Number);
  if (isNaN(day) || isNaN(month) || isNaN(year) || month > 12 || day > 31) return 9;
  return NumerologyUtils.reduceToSingleDigit(day + month + year) || 9;
}

function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi;
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 1;
}

async function getBabyName(motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest) {
  const motherLifePath = getLifePathNumber(motherBirthdate);
  const motherSoul = getSoulNumber(motherName);
  const motherPersonality = getPersonalityNumber(motherName);
  const motherDestiny = getDestinyNumber(motherName);
  const fatherLifePath = getLifePathNumber(fatherBirthdate);
  const fatherSoul = getSoulNumber(fatherName);
  const fatherPersonality = getPersonalityNumber(fatherName);
  const fatherDestiny = getDestinyNumber(fatherName);
  const babyLifePath = babyBirthdate ? getLifePathNumber(babyBirthdate) : null;
  const currentYear = new Date().getFullYear();
  const motherCycle = NumerologyUtils.reduceToSingleDigit(currentYear + parseInt(motherBirthdate.split(/[\/-]/)[0])) || 9;

  const motherLifePathData = NUMEROLOGY_MEANINGS.lifePath[motherLifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const motherSoulData = NUMEROLOGY_MEANINGS.soulUrge[motherSoul] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const motherPersonalityData = NUMEROLOGY_MEANINGS.personality[motherPersonality] || NUMEROLOGY_MEANINGS.personality[1];
  const motherDestinyData = NUMEROLOGY_MEANINGS.expression[motherDestiny] || NUMEROLOGY_MEANINGS.expression[1];
  const fatherLifePathData = NUMEROLOGY_MEANINGS.lifePath[fatherLifePath] || NUMEROLOGY_MEANINGS.lifePath[1];
  const fatherSoulData = NUMEROLOGY_MEANINGS.soulUrge[fatherSoul] || NUMEROLOGY_MEANINGS.soulUrge[1];
  const fatherPersonalityData = NUMEROLOGY_MEANINGS.personality[fatherPersonality] || NUMEROLOGY_MEANINGS.personality[1];
  const fatherDestinyData = NUMEROLOGY_MEANINGS.expression[fatherDestiny] || NUMEROLOGY_MEANINGS.expression[1];
  const babyLifePathData = babyLifePath ? (NUMEROLOGY_MEANINGS.lifePath[babyLifePath] || NUMEROLOGY_MEANINGS.lifePath[1]) : null;

  console.log('Numerology data:', { 
    mother: { lifePath: motherLifePath, soul: motherSoul, personality: motherPersonality, destiny: motherDestiny, cycle: motherCycle },
    father: { lifePath: fatherLifePath, soul: fatherSoul, personality: fatherPersonality, destiny: fatherDestiny },
    baby: babyLifePath ? { lifePath: babyLifePath } : 'No baby birthdate'
  });

  const prompt = `Dựa trên thần số học với thông tin mẹ: số chủ đạo ${motherLifePath} (${motherLifePathData.theme}), số linh hồn ${motherSoul} (${motherSoulData.desire}), số nhân cách ${motherPersonality} (${motherPersonalityData.theme}), số định mệnh ${motherDestiny} (${motherDestinyData.theme}), chu kỳ cá nhân ${motherCycle}, sinh ngày ${motherBirthdate}, tên ${motherName}; và bố: số chủ đạo ${fatherLifePath} (${fatherLifePathData.theme}), số linh hồn ${fatherSoul} (${fatherSoulData.desire}), số nhân cách ${fatherPersonality} (${fatherPersonalityData.theme}), số định mệnh ${fatherDestiny} (${fatherDestinyData.theme}), sinh ngày ${fatherBirthdate}, tên ${fatherName}; ${babyBirthdate ? `bé sinh ngày ${babyBirthdate}, số chủ đạo ${babyLifePath} (${babyLifePathData.theme})` : 'bé chưa có ngày sinh'}; giới tính con: ${gender}; tháng sinh con: ${babyBirthMonth || 'chưa xác định'}; yêu cầu thêm: "${additionalRequest || 'không có'}". Trả về JSON hợp lệ với:
    1. "numerology": Object chứa:
       - "motherLifePath": Số ${motherLifePath}, "motherLifePathDesc": Mô tả ngắn (1-2 câu) về ${motherLifePathData.theme} dựa trên ${motherLifePathData.strengths.join(', ')}.
       - "motherSoul": Số ${motherSoul}, "motherSoulDesc": Mô tả ngắn (1-2 câu) về ${motherSoulData.desire} dựa trên ${motherSoulData.motivation}.
       - "motherPersonality": Số ${motherPersonality}, "motherPersonalityDesc": Mô tả ngắn (1-2 câu) về ${motherPersonalityData.theme} dựa trên ${motherPersonalityData.workStyle}.
       - "motherDestiny": Số ${motherDestiny}, "motherDestinyDesc": Mô tả ngắn (1-2 câu) về ${motherDestinyData.theme} dựa trên ${motherDestinyData.talents.join(', ')}.
       - "fatherLifePath": Số ${fatherLifePath}, "fatherLifePathDesc": Mô tả ngắn (1-2 câu) về ${fatherLifePathData.theme} dựa trên ${fatherLifePathData.strengths.join(', ')}.
       - "fatherSoul": Số ${fatherSoul}, "fatherSoulDesc": Mô tả ngắn (1-2 câu) về ${fatherSoulData.desire} dựa trên ${fatherSoulData.motivation}.
       - "fatherPersonality": Số ${fatherPersonality}, "fatherPersonalityDesc": Mô tả ngắn (1-2 câu) về ${fatherPersonalityData.theme} dựa trên ${fatherPersonalityData.workStyle}.
       - "fatherDestiny": Số ${fatherDestiny}, "fatherDestinyDesc": Mô tả ngắn (1-2 câu) về ${fatherDestinyData.theme} dựa trên ${fatherDestinyData.talents.join(', ')}.
       - "babyLifePath": Số ${babyLifePath || 'chưa có'}, "babyLifePathDesc": Mô tả ngắn (1-2 câu) về ${babyLifePath ? babyLifePathData.theme : 'chưa xác định'} dựa trên ${babyLifePath ? babyLifePathData.strengths.join(', ') : 'không áp dụng'}.
       - "motherCycle": Số ${motherCycle}, "motherCycleDesc": Mô tả ngắn (1-2 câu) về năng lượng hiện tại dựa trên ${NUMEROLOGY_MEANINGS.personalYear[motherCycle].theme}.
    2. "analysis": Phân tích dài (12-15 câu) đề xuất tên con dựa trên giới tính ${gender}, tháng sinh ${babyBirthMonth || 'chưa xác định'}, yêu cầu "${additionalRequest || 'không có'}". Phân tích ${motherLifePathData.theme} (${motherLifePathData.strengths.join(', ')}) của mẹ và ${fatherLifePathData.theme} (${fatherLifePathData.strengths.join(', ')}) của bố${babyLifePath ? `, kết hợp ${babyLifePathData.theme} (${babyLifePathData.strengths.join(', ')}) của bé` : ''}. Xem xét ${motherSoulData.desire} (${motherSoulData.motivation}) và ${fatherSoulData.desire} (${fatherSoulData.motivation}) để tìm giá trị cốt lõi. Dùng ${motherPersonalityData.theme} (${motherPersonalityData.workStyle}) và ${fatherPersonalityData.theme} (${fatherPersonalityData.workStyle}) để tên dễ nhớ. Kết hợp ${motherDestinyData.theme} (${motherDestinyData.talents.join(', ')}) và ${fatherDestinyData.theme} (${fatherDestinyData.talents.join(', ')}) để tên mang ý nghĩa phát triển bền vững. Chu kỳ ${motherCycle} (${NUMEROLOGY_MEANINGS.personalYear[motherCycle].theme}) ảnh hưởng năng lượng hiện tại.
    3. "names": Mảng 3 tên (họ mặc định từ bố, hoặc theo yêu cầu), mỗi tên có:
       - "name": Tên đầy đủ,
       - "soul": Số linh hồn của tên,
       - "destiny": Số định mệnh của tên,
       - "meaning": Giải thích chi tiết (2-3 câu) dựa trên số của bố mẹ${babyLifePath ? ' và bé' : ''}.
    4. "tips": 2-3 lời khuyên ngắn dựa trên ${motherLifePathData.theme}, ${fatherLifePathData.theme}${babyLifePath ? `, và ${babyLifePathData.theme}` : ''}.
    Chỉ trả về JSON thuần túy, không dùng Markdown trong JSON!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.numerology || !data.analysis || !data.names) throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error.message);
    return getFallbackBabyName({
      motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest,
      motherLifePath, motherSoul, motherPersonality, motherDestiny, motherCycle,
      fatherLifePath, fatherSoul, fatherPersonality, fatherDestiny, babyLifePath,
      motherLifePathData, motherSoulData, motherPersonalityData, motherDestinyData,
      fatherLifePathData, fatherSoulData, fatherPersonalityData, fatherDestinyData, babyLifePathData
    });
  }
}

function getFallbackBabyName(params) {
  const {
    motherName, fatherName, babyBirthdate, gender, babyBirthMonth, additionalRequest,
    motherLifePath, motherSoul, motherPersonality, motherDestiny, motherCycle,
    fatherLifePath, fatherSoul, fatherPersonality, fatherDestiny, babyLifePath,
    motherLifePathData, motherSoulData, motherPersonalityData, motherDestinyData,
    fatherLifePathData, fatherSoulData, fatherPersonalityData, fatherDestinyData, babyLifePathData
  } = params;

  const fatherLastName = fatherName.split(' ')[0];
  const motherLastName = motherName.split(' ')[0];
  const lastName = additionalRequest?.includes('theo họ mẹ') ? motherLastName : fatherLastName;

  const numerology = {
    motherLifePath,
    motherLifePathDesc: `${motherLifePathData.theme} (${motherLifePath}) mang năng lượng ${motherLifePathData.strengths[0].toLowerCase()} và ${motherLifePathData.strengths[1].toLowerCase()} để định hướng tên con.`,
    motherSoul,
    motherSoulDesc: `${motherSoulData.desire} (${motherSoul}) thể hiện khát vọng ${motherSoulData.motivation.toLowerCase()} của mẹ.`,
    motherPersonality,
    motherPersonalityDesc: `${motherPersonalityData.theme} (${motherPersonality}) cho thấy phong cách ${motherPersonalityData.workStyle.toLowerCase()} trong tên con.`,
    motherDestiny,
    motherDestinyDesc: `${motherDestinyData.theme} (${motherDestiny}) định hình tương lai với ${motherDestinyData.talents[0].toLowerCase()} và ${motherDestinyData.talents[1].toLowerCase()}.`,
    fatherLifePath,
    fatherLifePathDesc: `${fatherLifePathData.theme} (${fatherLifePath}) mang năng lượng ${fatherLifePathData.strengths[0].toLowerCase()} và ${fatherLifePathData.strengths[1].toLowerCase()} để hỗ trợ tên con.`,
    fatherSoul,
    fatherSoulDesc: `${fatherSoulData.desire} (${fatherSoul}) thể hiện khát vọng ${fatherSoulData.motivation.toLowerCase()} của bố.`,
    fatherPersonality,
    fatherPersonalityDesc: `${fatherPersonalityData.theme} (${fatherPersonality}) cho thấy phong cách ${fatherPersonalityData.workStyle.toLowerCase()} trong tên con.`,
    fatherDestiny,
    fatherDestinyDesc: `${fatherDestinyData.theme} (${fatherDestiny}) định hình tương lai với ${fatherDestinyData.talents[0].toLowerCase()} và ${fatherDestinyData.talents[1].toLowerCase()}.`,
    babyLifePath: babyLifePath || null,
    babyLifePathDesc: babyLifePath ? `${babyLifePathData.theme} (${babyLifePath}) mang năng lượng ${babyLifePathData.strengths[0].toLowerCase()} và ${babyLifePathData.strengths[1].toLowerCase()}.` : 'Chưa xác định do không có ngày sinh bé.',
    motherCycle,
    motherCycleDesc: `${NUMEROLOGY_MEANINGS.personalYear[motherCycle].theme} (${motherCycle}) gợi ý năng lượng hiện tại của mẹ là ${NUMEROLOGY_MEANINGS.personalYear[motherCycle].theme.toLowerCase()}.`
  };

  const analysis = `Việc đặt tên con dựa trên giới tính ${gender}, tháng sinh ${babyBirthMonth || 'chưa xác định'}, và yêu cầu "${additionalRequest || 'không có'}" cần cân bằng năng lượng từ bố mẹ${babyLifePath ? ' và bé' : ''}. Số chủ đạo ${motherLifePath} (${motherLifePathData.theme.toLowerCase()}) của mẹ mang ${motherLifePathData.strengths[0].toLowerCase()} và ${motherLifePathData.strengths[1].toLowerCase()}, định hình tên con với tầm nhìn sâu sắc. Số chủ đạo ${fatherLifePath} (${fatherLifePathData.theme.toLowerCase()}) của bố với ${fatherLifePathData.strengths[0].toLowerCase()} và ${fatherLifePathData.strengths[1].toLowerCase()} gợi ý tên cần ý nghĩa mạnh mẽ. ${babyLifePath ? `Số chủ đạo ${babyLifePath} (${babyLifePathData.theme.toLowerCase()}) của bé bổ sung ${babyLifePathData.strengths[0].toLowerCase()} để tạo sự hài hòa.` : 'Do chưa có ngày sinh bé, tên dựa vào bố mẹ.'} Số linh hồn ${motherSoul} (${motherSoulData.desire.toLowerCase()}) của mẹ với ${motherSoulData.motivation.toLowerCase()} kết hợp số linh hồn ${fatherSoul} (${fatherSoulData.desire.toLowerCase()}) của bố với ${fatherSoulData.motivation.toLowerCase()} tạo giá trị cốt lõi. Số nhân cách ${motherPersonality} (${motherPersonalityData.theme.toLowerCase()}) với ${motherPersonalityData.workStyle.toLowerCase()} và ${fatherPersonality} (${fatherPersonalityData.theme.toLowerCase()}) với ${fatherPersonalityData.workStyle.toLowerCase()} giúp tên dễ nhớ và gần gũi. Số định mệnh ${motherDestiny} (${motherDestinyData.theme.toLowerCase()}) với ${motherDestinyData.talents[0].toLowerCase()} và ${fatherDestiny} (${fatherDestinyData.theme.toLowerCase()}) với ${fatherDestinyData.talents[0].toLowerCase()} đảm bảo tên mang ý nghĩa phát triển bền vững. Chu kỳ cá nhân ${motherCycle} (${NUMEROLOGY_MEANINGS.personalYear[motherCycle].theme.toLowerCase()}) của mẹ ảnh hưởng đến năng lượng hiện tại khi chọn tên. Tháng sinh ${babyBirthMonth || 'chưa xác định'} nếu có sẽ thêm ý nghĩa, như tháng 3 nhấn mạnh sự sáng tạo. Yêu cầu "${additionalRequest || 'không có'}" được tích hợp để cá nhân hóa. Tên được đề xuất cân bằng năng lượng của cả gia đình để mang lại điều tốt đẹp cho con.`;

  const names = gender === 'male' ? [
    {
      name: `${lastName} Gia Bảo`,
      soul: getSoulNumber('Gia Bảo'),
      destiny: getDestinyNumber('Gia Bảo'),
      meaning: `"Gia" từ ${motherDestinyData.theme.toLowerCase()} mang ${motherDestinyData.talents[0].toLowerCase()} tượng trưng cho sự gắn kết gia đình, "Bảo" từ ${motherSoulData.desire.toLowerCase()} với ${motherSoulData.motivation.toLowerCase()} thể hiện sự quý giá${babyLifePath ? `, bổ trợ ${babyLifePathData.theme.toLowerCase()} của bé` : ''}. Tên này mang năng lượng ấm áp và bền vững.`
    },
    {
      name: `${lastName} Minh Khang`,
      soul: getSoulNumber('Minh Khang'),
      destiny: getDestinyNumber('Minh Khang'),
      meaning: `"Minh" từ ${motherLifePathData.theme.toLowerCase()} với ${motherLifePathData.strengths[0].toLowerCase()} biểu thị trí tuệ, "Khang" từ ${fatherDestinyData.theme.toLowerCase()} với ${fatherDestinyData.talents[0].toLowerCase()} tượng trưng cho sự thịnh vượng${babyLifePath ? `, cân bằng với ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này mạnh mẽ và năng động.`
    },
    {
      name: `${lastName} Đức Anh`,
      soul: getSoulNumber('Đức Anh'),
      destiny: getDestinyNumber('Đức Anh'),
      meaning: `"Đức" từ ${fatherSoulData.desire.toLowerCase()} với ${fatherSoulData.motivation.toLowerCase()} thể hiện phẩm chất tốt, "Anh" từ ${motherLifePathData.theme.toLowerCase()} với ${motherLifePathData.strengths[1].toLowerCase()} mang ý nghĩa nổi bật${babyLifePath ? `, hài hòa với ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này nhân hậu và thông minh.`
    }
  ] : gender === 'female' ? [
    {
      name: `${lastName} Minh Anh`,
      soul: getSoulNumber('Minh Anh'),
      destiny: getDestinyNumber('Minh Anh'),
      meaning: `"Minh" từ ${motherLifePathData.theme.toLowerCase()} với ${motherLifePathData.strengths[0].toLowerCase()} biểu thị sự sáng suốt, "Anh" từ ${fatherSoulData.desire.toLowerCase()} với ${fatherSoulData.motivation.toLowerCase()} mang vẻ đẹp tinh tế${babyLifePath ? `, phù hợp ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này nhẹ nhàng và nổi bật.`
    },
    {
      name: `${lastName} Bảo Ngọc`,
      soul: getSoulNumber('Bảo Ngọc'),
      destiny: getDestinyNumber('Bảo Ngọc'),
      meaning: `"Bảo" từ ${motherSoulData.desire.toLowerCase()} với ${motherSoulData.motivation.toLowerCase()} biểu thị sự quý giá, "Ngọc" từ ${fatherPersonalityData.theme.toLowerCase()} với ${fatherPersonalityData.strengths[0].toLowerCase()} thể hiện sự thanh lịch${babyLifePath ? `, bổ trợ ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này sang trọng và nữ tính.`
    },
    {
      name: `${lastName} Gia Linh`,
      soul: getSoulNumber('Gia Linh'),
      destiny: getDestinyNumber('Gia Linh'),
      meaning: `"Gia" từ ${motherDestinyData.theme.toLowerCase()} với ${motherDestinyData.talents[0].toLowerCase()} tượng trưng cho sự gắn kết, "Linh" từ ${fatherDestinyData.theme.toLowerCase()} với ${fatherDestinyData.talents[1].toLowerCase()} mang ý nghĩa thông minh${babyLifePath ? `, hài hòa ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này dịu dàng và mạnh mẽ.`
    }
  ] : [
    {
      name: `${lastName} Minh Hân`,
      soul: getSoulNumber('Minh Hân'),
      destiny: getDestinyNumber('Minh Hân'),
      meaning: `"Minh" từ ${motherLifePathData.theme.toLowerCase()} với ${motherLifePathData.strengths[0].toLowerCase()} thể hiện trí tuệ, "Hân" từ ${motherDestinyData.theme.toLowerCase()} với ${motherDestinyData.talents[1].toLowerCase()} mang ý nghĩa niềm vui${babyLifePath ? `, phù hợp ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này trung tính và tích cực.`
    },
    {
      name: `${lastName} Gia Bảo`,
      soul: getSoulNumber('Gia Bảo'),
      destiny: getDestinyNumber('Gia Bảo'),
      meaning: `"Gia" từ ${motherDestinyData.theme.toLowerCase()} với ${motherDestinyData.talents[0].toLowerCase()} biểu thị sự gắn kết, "Bảo" từ ${motherSoulData.desire.toLowerCase()} với ${motherSoulData.motivation.toLowerCase()} thể hiện sự quý giá${babyLifePath ? `, bổ trợ ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này ấm áp và trung tính.`
    },
    {
      name: `${lastName} Đức Anh`,
      soul: getSoulNumber('Đức Anh'),
      destiny: getDestinyNumber('Đức Anh'),
      meaning: `"Đức" từ ${fatherSoulData.desire.toLowerCase()} với ${fatherSoulData.motivation.toLowerCase()} thể hiện phẩm chất tốt, "Anh" từ ${motherLifePathData.theme.toLowerCase()} với ${motherLifePathData.strengths[1].toLowerCase()} mang ý nghĩa nổi bật${babyLifePath ? `, cân bằng ${babyLifePathData.theme.toLowerCase()}` : ''}. Tên này sâu sắc và trung tính.`
    }
  ];

  const tips = [
    `Tận dụng ${motherLifePathData.strengths[0].toLowerCase()} của ${motherLifePathData.theme.toLowerCase()} để chọn tên mang ý nghĩa sâu sắc.`,
    `Kết hợp ${fatherLifePathData.strengths[1].toLowerCase()} của ${fatherLifePathData.theme.toLowerCase()} để tên có năng lượng mạnh mẽ${babyLifePath ? `, cân nhắc ${babyLifePathData.theme.toLowerCase()} của bé nếu có ngày sinh` : ''}.`,
    'Tham khảo ý kiến gia đình để tên vừa ý nghĩa vừa phù hợp truyền thống.'
  ];

  return { numerology, analysis, names, tips };
}

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest } = body;

    if (!motherName || !motherBirthdate || !fatherName || !fatherBirthdate || !gender) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Thiếu thông tin bắt buộc: motherName, motherBirthdate, fatherName, fatherBirthdate, gender.'
      });
    }

    const result = await getBabyName(motherName, motherBirthdate, fatherName, fatherBirthdate, babyBirthdate, gender, babyBirthMonth, additionalRequest);
    return result;
  } catch (error) {
    console.error('API error:', error.message);
    throw createError({
      statusCode: 500,
      statusMessage: 'Lỗi server: ' + error.message
    });
  }
});