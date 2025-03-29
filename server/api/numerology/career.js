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

async function getGeminiCareerGuidance(birthdate, name, currentJob) {
  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);
  const currentYear = new Date().getFullYear();
  const personalCycle = (currentYear + parseInt(birthdate.split('/')[0])) % 9 || 9;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `Dựa trên thần số học với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, sinh ngày ${birthdate}, tên ${name}, công việc hiện tại "${currentJob || 'chưa có'}". Trả về JSON hợp lệ với phần sau:
                1. "answer": Một đoạn văn dài (18-22 câu) định hướng nghề nghiệp chi tiết dựa trên các số thần số học, chia thành các mục rõ ràng bằng ký tự xuống dòng "\\n\\n". 
                - "Mục tiêu nghề nghiệp (Số chủ đạo ${dominantNumber})": Phân tích cách số chủ đạo định hình mục tiêu nghề nghiệp (2-3 câu). 
                - "Đam mê và động lực (Số linh hồn ${soulNumber})": Phân tích số linh hồn thể hiện đam mê và động lực bên trong (2-3 câu). 
                - "Phong cách làm việc (Số nhân cách ${personalityNumber})": Phân tích số nhân cách ảnh hưởng đến cách làm việc với người khác (2-3 câu). 
                - "Con đường dài hạn (Số định mệnh ${destinyNumber})": Phân tích số định mệnh chỉ ra hướng đi sự nghiệp lâu dài (2-3 câu). 
                - "Phân tích công việc hiện tại (${currentJob || 'chưa có'})": Nếu có công việc hiện tại, đánh giá mức độ phù hợp với các số trên (chủ đạo, linh hồn, nhân cách, định mệnh), cơ hội phát triển trong công việc này, gợi ý cải thiện hoặc chuyển hướng (3-4 câu); nếu không có, ghi "Hiện tại bạn chưa nhập công việc, định hướng sẽ dựa trên các số Thần số học" và bỏ qua phân tích cụ thể (1 câu). 
                - "Đề xuất nghề nghiệp cụ thể": Đề xuất 3 nghề nghiệp cụ thể (ví dụ: lập trình viên, giáo viên, nhà báo), mỗi nghề phân tích chi tiết (3-4 câu): lý do phù hợp với các số trên, cơ hội nghề nghiệp hiện tại, xu hướng phát triển trong tương lai (dựa trên bối cảnh 2025). 
                - "Lời khuyên thực tế (Chu kỳ cá nhân ${personalCycle})": Đưa ra 2-3 câu khuyên cụ thể (dùng "bạn" thay vì nhắc tên/ngày sinh) dựa trên chu kỳ cá nhân và công việc hiện tại (nếu có), như học kỹ năng mới, tìm cơ hội, hoặc thay đổi hướng đi. 
                Đảm bảo câu trả lời không có mở đầu thừa thãi, tập trung trực tiếp vào định hướng nghề nghiệp, sử dụng ngôn ngữ tự nhiên, dễ hiểu, không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`
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
      if (!parsedData || !parsedData.answer) {
        throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      }
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackCareerGuidance(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, currentJob);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackCareerGuidance(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, currentJob);
  }
}

function getFallbackCareerGuidance(dominantNumber, soulNumber, personalityNumber, destinyNumber, personalCycle, currentJob) {
  const answer = `Mục tiêu nghề nghiệp (Số chủ đạo ${dominantNumber}): Số chủ đạo ${dominantNumber} cho thấy bạn có xu hướng đặt mục tiêu lớn và mang tầm nhìn chiến lược. Điều này khiến bạn phù hợp với các vai trò lãnh đạo hoặc sáng tạo, nơi bạn có thể định hình hướng đi và tạo ra giá trị lâu dài.\n\n` +
    `Đam mê và động lực (Số linh hồn ${soulNumber}): Số linh hồn ${soulNumber} thể hiện bạn có đam mê với sự tự do và khám phá, luôn tìm kiếm ý nghĩa sâu sắc trong công việc. Bạn sẽ cảm thấy thỏa mãn khi được làm việc trong môi trường khuyến khích sự sáng tạo và phát triển cá nhân.\n\n` +
    `Phong cách làm việc (Số nhân cách ${personalityNumber}): Với số nhân cách ${personalityNumber}, bạn có khả năng giao tiếp tốt và dễ dàng hòa nhập với đồng nghiệp. Phong cách làm việc của bạn thiên về hợp tác, giúp bạn nổi bật trong các công việc đòi hỏi sự phối hợp nhóm hoặc tương tác xã hội.\n\n` +
    `Con đường dài hạn (Số định mệnh ${destinyNumber}): Số định mệnh ${destinyNumber} chỉ ra bạn hướng tới sự nghiệp ổn định và có ý nghĩa lâu dài. Bạn có tiềm năng xây dựng một con đường sự nghiệp vững chắc, tập trung vào việc tạo ra tác động tích cực cho cộng đồng hoặc tổ chức.\n\n` +
    `Phân tích công việc hiện tại (${currentJob || 'chưa có'}): ${currentJob ? 
      `Công việc "${currentJob}" hiện tại của bạn có thể phù hợp với số chủ đạo ${dominantNumber} nếu nó cho phép bạn phát huy tầm nhìn, và với số linh hồn ${soulNumber} nếu nó đáp ứng đam mê sáng tạo. Tuy nhiên, nếu công việc thiếu sự tương tác xã hội (số nhân cách ${personalityNumber}) hoặc không đảm bảo phát triển lâu dài (số định mệnh ${destinyNumber}), bạn nên cân nhắc cải thiện bằng cách học thêm kỹ năng liên quan hoặc tìm cơ hội mới. Cơ hội phát triển phụ thuộc vào việc bạn tận dụng được xu hướng công nghệ trong ngành này.` : 
      `Hiện tại bạn chưa nhập công việc, định hướng sẽ dựa trên các số Thần số học.`}\n\n` +
    `Đề xuất nghề nghiệp cụ thể:\n` +
    `- Lập trình viên: Phù hợp với số chủ đạo ${dominantNumber} nhờ khả năng tư duy logic và giải quyết vấn đề, kết hợp với số linh hồn ${soulNumber} yêu thích khám phá công nghệ mới. Ngành này hiện có nhu cầu cao trong AI và blockchain, với xu hướng phát triển mạnh đến 2025 nhờ chuyển đổi số. Cơ hội thăng tiến lớn nếu bạn nắm bắt kỹ năng lập trình AI hoặc phát triển ứng dụng phi tập trung.\n` +
    `- Giáo viên: Số nhân cách ${personalityNumber} giúp bạn truyền đạt kiến thức hiệu quả, kết hợp với số định mệnh ${destinyNumber} hướng tới sự nghiệp ý nghĩa. Giáo dục đang chuyển đổi với học trực tuyến, đến 2025 cần giáo viên có kỹ năng số, mở ra cơ hội lớn nếu bạn thích giảng dạy. Đây là lựa chọn tốt để tạo ảnh hưởng lâu dài.\n` +
    `- Chuyên viên marketing: Số linh hồn ${soulNumber} thúc đẩy sự sáng tạo trong chiến lược quảng bá, trong khi số nhân cách ${personalityNumber} hỗ trợ làm việc nhóm. Ngành marketing đang bùng nổ với quảng cáo số và phân tích dữ liệu, đến 2025 cần nhân lực am hiểu AI và nội dung cá nhân hóa. Cơ hội rộng mở nếu bạn đầu tư vào kỹ năng phân tích thị trường.\n\n` +
    `Lời khuyên thực tế (Chu kỳ cá nhân ${personalCycle}): Chu kỳ cá nhân ${personalCycle} khuyến khích bạn tập trung phát triển kỹ năng mới phù hợp với ${currentJob ? `công việc "${currentJob}" hoặc chuyển hướng sang` : ''} các lĩnh vực như công nghệ, giáo dục, hoặc marketing. Bạn nên tham gia khóa học ngắn hạn về lập trình, kỹ năng giảng dạy trực tuyến, hoặc công cụ marketing số để mở rộng cơ hội trong năm nay. Nếu công việc hiện tại không phù hợp, hãy thử sức với dự án nhỏ trong ngành mới để tìm hướng đi tốt hơn.`;

  return {
    answer
  };
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest';
  const { name, birthdate, currentJob } = await readBody(event);

  if (!name || !birthdate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthdate là bắt buộc.',
    });
  }

  const careerGuidance = await getGeminiCareerGuidance(birthdate, name, currentJob);
  return careerGuidance;
});