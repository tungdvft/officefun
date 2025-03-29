import { defineEventHandler } from 'h3';

function getLifePathNumber(birthdate) {
  const [day, month, year] = birthdate.split('/').map(Number);
  if (!day || !month || !year) return 9;
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 9;
}

function getSoulNumber(name) {
  const vowels = /[aeiou]/gi;
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc;
  }, 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi;
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc;
  }, 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 };
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

const apiKey = process.env.GEMINI_API_KEY || '';

async function getGeminiContent(birthdate, name, intention, partnerName = null, partnerBirthdate = null) {
  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const currentYear = new Date().getFullYear();
  const personalCycle = (currentYear + parseInt(birthdate.split('/')[0])) % 9 || 9;

  let partnerLifePath = null;
  let partnerSoulNumber = null;
  let partnerPersonalityNumber = null;
  let partnerDestinyNumber = null;
  let relationshipType = '';

  if (intention.includes('Phân tích mức độ hợp nhau') && partnerBirthdate && partnerName) {
    partnerLifePath = getLifePathNumber(partnerBirthdate);
    partnerSoulNumber = getSoulNumber(partnerName);
    partnerPersonalityNumber = getPersonalityNumber(partnerName);
    partnerDestinyNumber = getDestinyNumber(partnerName);
    relationshipType = intention.match(/mối quan hệ (\w+)/)?.[1] || 'không xác định';
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Dựa trên thần số học với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, sinh ngày ${birthdate}, và câu hỏi: "${intention}". Trả về JSON hợp lệ với các phần sau:
                1. "answer": Một đoạn văn dài hơn (8-10 câu), trả lời trực tiếp câu hỏi "${intention}" mà không thêm câu mở đầu thừa thãi. Nếu là phân tích mối quan hệ (${relationshipType}), phân tích chi tiết sự tương thích giữa người sinh ngày ${birthdate} (số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}) và ${partnerName} sinh ngày ${partnerBirthdate} (số chủ đạo ${partnerLifePath}, số linh hồn ${partnerSoulNumber}, số nhân cách ${partnerPersonalityNumber}, số định mệnh ${partnerDestinyNumber}), dựa trên sự kết hợp các con số thần số học của cả hai. Nhấn mạnh điểm mạnh, điểm yếu, tương tác giữa các số (so sánh số chủ đạo, số linh hồn, số nhân cách, số định mệnh của cả hai), sau đó kết thúc bằng một lời khuyên thực tế, cụ thể, dễ áp dụng (dùng "bạn" và "${partnerName}" thay vì nhắc ngày sinh, đề xuất hành động rõ ràng như trò chuyện, lập kế hoạch, thay đổi cách tiếp cận), tích hợp chu kỳ cá nhân ${personalCycle} nếu phù hợp. Nếu không phải phân tích mối quan hệ, trả lời câu hỏi với lời khuyên cụ thể dựa trên các số thần số học.
                2. "numbers": Một object chứa các số và diễn giải:
                   - "lifePath": ${dominantNumber}, "lifePathDescription": Diễn giải ý nghĩa số đường đời ${dominantNumber}.
                   - "soulUrge": ${soulNumber}, "soulUrgeDescription": Diễn giải ý nghĩa số linh hồn ${soulNumber}.
                   - "personality": ${personalityNumber}, "personalityDescription": Diễn giải ý nghĩa số nhân cách ${personalityNumber}.
                   - "destiny": ${destinyNumber}, "destinyDescription": Diễn giải ý nghĩa số định mệnh ${destinyNumber}.
                3. "celebrities": Mảng 3-5 người nổi tiếng cùng số đường đời ${dominantNumber}, ví dụ: ["Albert Einstein", "Keanu Reeves"].
                Đảm bảo JSON hợp lệ, không markdown, chỉ trả về chuỗi JSON thuần túy!`
            }],
          }],
        })
      }
    );

    if (!response.ok) throw new Error(`Gemini API lỗi: ${response.status}`);
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.answer || !parsedData.numbers || !parsedData.celebrities) {
        throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      }
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackContent(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, intention, partnerName, partnerBirthdate, partnerLifePath, partnerSoulNumber, partnerPersonalityNumber, partnerDestinyNumber, relationshipType);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackContent(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, intention, partnerName, partnerBirthdate, partnerLifePath, partnerSoulNumber, partnerPersonalityNumber, partnerDestinyNumber, relationshipType);
  }
}

function getFallbackContent(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, intention, partnerName, partnerBirthdate, partnerLifePath, partnerSoulNumber, partnerPersonalityNumber, partnerDestinyNumber, relationshipType) {
  const isRelationship = intention.includes('Phân tích mức độ hợp nhau');
  let answer = '';

  if (isRelationship && partnerBirthdate && partnerName && partnerLifePath) {
    answer = `Mối quan hệ giữa bạn (số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}) và ${partnerName} (số chủ đạo ${partnerLifePath}, số linh hồn ${partnerSoulNumber}, số nhân cách ${partnerPersonalityNumber}, số định mệnh ${partnerDestinyNumber}) có sự kết hợp độc đáo giữa lý tưởng và thực tế. Số chủ đạo ${dominantNumber} của bạn mang tinh thần nhân đạo và sáng tạo, trong khi số ${partnerLifePath} của ${partnerName} thường hướng đến sự độc lập và sâu sắc. Số linh hồn ${soulNumber} của bạn giúp bạn dễ dàng truyền cảm hứng, nhưng có thể xung đột nhẹ với số linh hồn ${partnerSoulNumber} của ${partnerName}, vốn thiên về cảm xúc nội tại. Số nhân cách ${personalityNumber} của bạn tạo ấn tượng mạnh mẽ, trong khi ${partnerName} với số ${partnerPersonalityNumber} lại có xu hướng kín đáo hơn. Số định mệnh ${destinyNumber} định hướng bạn đến những mục tiêu lớn, còn ${partnerName} với số ${partnerDestinyNumber} có thể tập trung vào sự ổn định. Điểm mạnh là sự bổ trợ về năng lượng sáng tạo và thực tế, điểm yếu là giao tiếp đôi khi không đồng điệu. Chu kỳ cá nhân ${personalCycle} hiện tại khuyến khích bạn cân bằng cảm xúc và hành động. Bạn và ${partnerName} nên ngồi lại trò chuyện ít nhất một lần mỗi tuần để hiểu rõ mong muốn của nhau và cùng lập kế hoạch cho tương lai.`;
  } else {
    answer = `Với số chủ đạo ${dominantNumber}, bạn có tiềm năng lớn trong chu kỳ cá nhân ${personalCycle}. Số linh hồn ${soulNumber} khuyên bạn lắng nghe trực giác, còn số nhân cách ${personalityNumber} thúc đẩy sự tự tin. Số định mệnh ${destinyNumber} hướng bạn đến thành công dài hạn. Hãy lập danh sách mục tiêu cụ thể và bắt đầu hành động ngay hôm nay.`;
  }

  return {
    answer,
    numbers: {
      lifePath: dominantNumber,
      lifePathDescription: `Số đường đời ${dominantNumber} biểu thị sự mạnh mẽ và độc lập.`,
      soulUrge: soulNumber,
      soulUrgeDescription: `Số linh hồn ${soulNumber} cho thấy bạn khao khát tự do trong tâm hồn.`,
      personality: personalityNumber,
      personalityDescription: `Số nhân cách ${personalityNumber} thể hiện bạn cuốn hút và năng động.`,
      destiny: destinyNumber,
      destinyDescription: `Số định mệnh ${destinyNumber} định hướng bạn đến sự cống hiến và thành công.`
    },
    celebrities: ['Người nổi tiếng 1', 'Người nổi tiếng 2', 'Người nổi tiếng 3']
  };
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  const { name, birthdate, intention, partnerName, partnerBirthdate } = await readBody(event);

  if (!name || !birthdate || !intention) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate, và intention là bắt buộc.',
    });
  }

  const geminiContent = await getGeminiContent(birthdate, name, intention, partnerName, partnerBirthdate);
  return geminiContent;
});