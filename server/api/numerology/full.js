// server/api/numerology/full.js
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

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.',
    });
  }

  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);

  try {
    const prompt = `Dựa trên thần số học với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber}, sinh ngày ${birthdate}, tên ${name}, giới tính "${gender}". Trả về JSON hợp lệ với phần "numerology" chứa các trường sau: ` +
      `1. "lifePath": số chủ đạo, "lifePathDesc": mô tả ngắn gọn (1-2 câu). ` +
      `2. "soul": số linh hồn, "soulDesc": mô tả ngắn gọn (1-2 câu). ` +
      `3. "personality": số nhân cách, "personalityDesc": mô tả ngắn gọn (1-2 câu). ` +
      `4. "destiny": số định mệnh, "destinyDesc": mô tả ngắn gọn (1-2 câu). ` +
      `5. "age0_10": Diễn giải chi tiết (10-15 câu) về 0-10 tuổi dựa trên số linh hồn. ` +
      `6. "age10_20": Diễn giải chi tiết (10-15 câu) về 10-20 tuổi dựa trên số linh hồn và số chủ đạo. ` +
      `7. "age20_30": Diễn giải chi tiết (10-15 câu) về 20-30 tuổi dựa trên số linh hồn, số chủ đạo và số nhân cách. ` +
      `8. "age30_40": Diễn giải chi tiết (10-15 câu) về 30-40 tuổi dựa trên số nhân cách và số định mệnh. ` +
      `9. "age40_50": Diễn giải chi tiết (10-15 câu) về 40-50 tuổi dựa trên số nhân cách và số định mệnh. ` +
      `10. "age50_60": Diễn giải chi tiết (10-15 câu) về 50-60 tuổi dựa trên số nhân cách, số định mệnh và số chủ đạo. ` +
      `11. "age60_plus": Diễn giải chi tiết (10-15 câu) về 60+ tuổi kết hợp tất cả số. ` +
      `12. "age0_10Advice": Lời khuyên (3-5 câu) cho 0-10 tuổi. ` +
      `13. "age10_20Advice": Lời khuyên (3-5 câu) cho 10-20 tuổi. ` +
      `14. "age20_30Advice": Lời khuyên (3-5 câu) cho 20-30 tuổi. ` +
      `15. "age30_40Advice": Lời khuyên (3-5 câu) cho 30-40 tuổi. ` +
      `16. "age40_50Advice": Lời khuyên (3-5 câu) cho 40-50 tuổi. ` +
      `17. "age50_60Advice": Lời khuyên (3-5 câu) cho 50-60 tuổi. ` +
      `18. "age60_plusAdvice": Lời khuyên (3-5 câu) cho 60+ tuổi. ` +
      `Không thêm thông tin nào khác ngoài các trường trên. Không dùng Markdown trong JSON, chỉ trả về chuỗi JSON thuần túy!`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!response.ok) throw new Error(`Gemini API lỗi: ${response.status}`);
    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;

    rawText = rawText.replace(/```json|```/g, '').trim();
    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.numerology) throw new Error('Gemini API không trả về đầy đủ dữ liệu');
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      return getFallbackResponse(dominantNumber, soulNumber, personalityNumber, destinyNumber);
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return getFallbackResponse(dominantNumber, soulNumber, personalityNumber, destinyNumber);
  }
});

function getFallbackResponse(dominantNumber, soulNumber, personalityNumber, destinyNumber) {
  const numerology = {
    lifePath: dominantNumber,
    lifePathDesc: 'Biểu tượng của lòng nhân ái, lý tưởng và hoàn thiện.',
    soul: soulNumber,
    soulDesc: 'Biểu tượng của lòng nhân ái, lý tưởng và hoàn thiện.',
    personality: personalityNumber,
    personalityDesc: 'Số thầy, mang trực giác mạnh mẽ và tầm nhìn lớn.',
    destiny: destinyNumber,
    destinyDesc: 'Số thầy, mang trực giác mạnh mẽ và tầm nhìn lớn.',
    age0_10: `Từ 0-10 tuổi, với số linh hồn ${soulNumber}, đây là giai đoạn bạn bắt đầu cảm nhận thế giới qua lăng kính cảm xúc và sự nhạy bén bẩm sinh. Năng lượng của số ${soulNumber} khiến bạn tò mò, thích khám phá và dễ bị ảnh hưởng bởi môi trường xung quanh. Đây là thời kỳ hình thành những giá trị đầu tiên, nơi bạn học cách thể hiện bản thân qua lời nói và hành động. Bạn có thể nhạy cảm hơn so với bạn bè cùng trang lứa, thường quan tâm đến cảm xúc của người khác. Gia đình và những người thân cận đóng vai trò quan trọng trong việc định hình tính cách của bạn. Thách thức là bạn có thể dễ bị tổn thương nếu không nhận được sự hỗ trợ đầy đủ. Tuy nhiên, đây cũng là cơ hội để bạn phát triển sự đồng cảm và lòng trắc ẩn sớm trong đời. Bạn thường thích những hoạt động sáng tạo như vẽ, hát hoặc chơi trò chơi tưởng tượng. Sự ngây thơ kết hợp với khát vọng khám phá giúp bạn xây dựng nền tảng cho tương lai. Giai đoạn này là bước đầu tiên để bạn hiểu về bản thân và thế giới, dù còn phụ thuộc nhiều vào người lớn. Những trải nghiệm đầu đời sẽ để lại dấu ấn sâu sắc trong tâm hồn bạn. Cuối giai đoạn, bạn bắt đầu nhận ra điều gì thực sự quan trọng với mình, dù chỉ ở mức cảm nhận mơ hồ.`,
    age10_20: `Từ 10-20 tuổi, với số linh hồn ${soulNumber} và số chủ đạo ${dominantNumber}, bạn bước vào giai đoạn khám phá bản thân mạnh mẽ hơn, với khát khao khẳng định cá tính. Số ${soulNumber} tiếp tục mang đến sự nhạy bén cảm xúc, khiến bạn dễ bị cuốn vào những mối quan hệ bạn bè hoặc tình cảm đầu đời. Số chủ đạo ${dominantNumber} thúc đẩy bạn đặt ra những mục tiêu lớn, thường liên quan đến lý tưởng hoặc mong muốn tạo thay đổi. Đây là thời kỳ bạn bắt đầu tự lập hơn, nhưng cũng dễ gặp áp lực từ kỳ vọng của gia đình hoặc xã hội. Bạn có xu hướng sáng tạo và không ngại thử sức ở nhiều lĩnh vực như học tập, nghệ thuật hoặc hoạt động xã hội. Thách thức nằm ở việc cân bằng giữa cảm xúc và lý trí, vì bạn có thể dễ bị phân tâm. Cơ hội là bạn có thể phát triển tài năng sớm nếu được hướng dẫn đúng cách. Giai đoạn này, bạn thường bị thu hút bởi những người có cùng chí hướng hoặc những ý tưởng mới lạ. Những thất bại đầu tiên có thể xuất hiện, nhưng chúng giúp bạn trưởng thành nhanh chóng. Đây là thời điểm bạn học cách biến cảm hứng thành hành động cụ thể. Cuối giai đoạn, bạn sẽ có cái nhìn rõ hơn về con đường mình muốn theo đuổi, dù vẫn còn nhiều điều cần khám phá.`,
    age20_30: `Từ 20-30 tuổi, với số linh hồn ${soulNumber}, số chủ đạo ${dominantNumber} và số nhân cách ${personalityNumber}, bạn bước vào giai đoạn định hình sự nghiệp và cuộc sống cá nhân. Số ${soulNumber} mang đến khát vọng tự do và sáng tạo, khiến bạn không ngừng tìm kiếm ý nghĩa trong công việc và mối quan hệ. Số ${dominantNumber} thúc đẩy bạn hướng tới những mục tiêu lớn lao, thường gắn với lý tưởng hoặc giá trị cộng đồng. Số nhân cách ${personalityNumber} giúp bạn thể hiện mình một cách độc đáo, thu hút sự chú ý từ người khác. Đây là thời kỳ bạn có thể đạt được những thành tựu đầu tiên nếu biết tận dụng trực giác và sự kiên trì. Thách thức là bạn có thể gặp khó khăn trong việc ổn định, vì năng lượng trẻ trung vẫn khiến bạn muốn thay đổi. Cơ hội nằm ở khả năng xây dựng danh tiếng hoặc nền tảng tài chính vững chắc. Bạn thường bị thu hút bởi những công việc đòi hỏi tư duy sáng tạo hoặc khả năng lãnh đạo. Giai đoạn này, bạn học cách cân bằng giữa ước mơ và thực tế, đồng thời phát triển các mối quan hệ sâu sắc hơn. Cuối 20-30 tuổi, bạn bắt đầu nhận ra giá trị của sự kiên định và tầm quan trọng của việc sống đúng với bản thân.`,
    age30_40: `Từ 30-40 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn bước vào giai đoạn khẳng định bản thân trong sự nghiệp và gia đình. Số ${personalityNumber} mang đến trực giác mạnh mẽ, giúp bạn nhận diện cơ hội và đưa ra quyết định đúng đắn. Số định mệnh ${destinyNumber} định hình bạn thành người có sứ mệnh, thường gắn với việc hỗ trợ hoặc dẫn dắt người khác. Đây là thời kỳ bạn có thể đạt được thành công lớn trong công việc, đặc biệt nếu biết tận dụng thế mạnh của mình. Bạn bắt đầu xây dựng sự ổn định về tài chính và mối quan hệ, trở thành chỗ dựa cho người thân. Thách thức là áp lực từ kỳ vọng có thể khiến bạn căng thẳng, đòi hỏi sự cân bằng. Cơ hội nằm ở khả năng lãnh đạo và tạo ảnh hưởng trong cộng đồng. Giai đoạn này, bạn học cách kiểm soát cái tôi và hợp tác với người khác hiệu quả hơn. Cuối 30-40 tuổi, bạn sẽ có cái nhìn rõ ràng hơn về mục tiêu dài hạn và bắt đầu chuẩn bị cho tương lai.`,
    age40_50: `Từ 40-50 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, đây là giai đoạn bạn củng cố những gì đã đạt được và mở rộng tầm ảnh hưởng. Số ${personalityNumber} giúp bạn duy trì sự nhạy bén và khả năng lãnh đạo, khiến bạn trở thành người truyền cảm hứng. Số ${destinyNumber} định hướng bạn tới những mục tiêu lớn hơn, thường liên quan đến việc để lại dấu ấn trong công việc hoặc xã hội. Bạn có thể đạt đỉnh cao trong sự nghiệp nếu biết tận dụng kinh nghiệm tích lũy. Thách thức là bạn cần chú ý đến sức khỏe và tránh làm việc quá sức. Cơ hội nằm ở việc xây dựng di sản hoặc ổn định tài chính cho tương lai. Giai đoạn này, bạn trở nên thực tế hơn, nhưng vẫn giữ được khát vọng ban đầu. Mối quan hệ gia đình và cộng đồng đóng vai trò quan trọng trong việc hỗ trợ bạn. Cuối 40-50 tuổi, bạn bắt đầu suy ngẫm về ý nghĩa sâu xa của cuộc sống và chuẩn bị cho những năm tháng sau này.`,
    age50_60: `Từ 50-60 tuổi, với số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber} và số chủ đạo ${dominantNumber}, bạn bước vào giai đoạn tổng hợp kinh nghiệm và khẳng định vị thế. Số ${personalityNumber} mang đến sự điềm tĩnh và tầm nhìn xa, giúp bạn đưa ra quyết định sáng suốt. Số ${destinyNumber} tiếp tục định hình bạn thành người có sứ mệnh, thường gắn với việc chia sẻ kiến thức hoặc hỗ trợ người khác. Số chủ đạo ${dominantNumber} thúc đẩy bạn sống với lý tưởng, dù ở mức độ nhẹ nhàng hơn. Đây là thời kỳ bạn có thể tận hưởng thành quả từ những nỗ lực trước đó, cả về tài chính lẫn tinh thần. Thách thức là giữ gìn sức khỏe và tránh cảm giác mất phương hướng khi công việc giảm dần. Cơ hội nằm ở khả năng trở thành cố vấn hoặc người dẫn dắt thế hệ trẻ. Giai đoạn này, bạn học cách sống chậm lại và tập trung vào những giá trị cốt lõi. Cuối 50-60 tuổi, bạn sẽ sẵn sàng bước vào giai đoạn tiếp theo với sự hài lòng và bình yên.`,
    age60_plus: `Từ 60+ tuổi, kết hợp số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn bước vào thời kỳ tổng kết cuộc đời với trí tuệ và sự trưởng thành sâu sắc. Số ${dominantNumber} giúp bạn duy trì lý tưởng sống, trở thành người truyền cảm hứng cho thế hệ sau. Số linh hồn ${soulNumber} mang đến sự nhạy cảm, khiến bạn trở thành người lắng nghe và chia sẻ tuyệt vời. Số nhân cách ${personalityNumber} giúp bạn giữ sự điềm tĩnh và tầm nhìn xa trong mọi quyết định. Số định mệnh ${destinyNumber} định hình bạn thành người để lại di sản, có thể là kinh nghiệm hoặc giá trị tinh thần. Giai đoạn này, bạn ít quan tâm đến danh vọng mà tập trung vào sự bình yên nội tâm. Thách thức có thể là sức khỏe hoặc cảm giác cô đơn nếu không duy trì kết nối xã hội. Bạn sẽ tìm thấy niềm vui trong những điều giản dị như gia đình, thiên nhiên hoặc sáng tạo. Đây là thời kỳ bạn chia sẻ bài học cuộc sống với con cháu, trở thành biểu tượng của sự kiên cường. Thành tựu lớn nhất là cảm giác hài lòng với hành trình đã qua. Cuối đời, bạn để lại dấu ấn sâu đậm trong lòng những người xung quanh bằng lòng tốt và sự khôn ngoan.`,
    age0_10Advice: `Trong 0-10 tuổi, hãy khuyến khích sự sáng tạo và khám phá qua các hoạt động như vẽ, chơi nhạc hoặc đọc sách. Tạo môi trường tích cực để bạn phát triển sự đồng cảm và tự tin. Hỗ trợ bạn vượt qua những cảm xúc nhạy cảm bằng sự quan tâm và lắng nghe.`,
    age10_20Advice: `Từ 10-20 tuổi, hãy tập trung vào học tập và trải nghiệm, đừng ngại thử sức ở nhiều lĩnh vực. Giữ sự kiên nhẫn và xây dựng mối quan hệ tích cực với bạn bè. Tin vào bản thân, nhưng lắng nghe lời khuyên từ gia đình hoặc thầy cô.`,
    age20_30Advice: `Từ 20-30 tuổi, đặt mục tiêu rõ ràng trong sự nghiệp và bắt đầu xây dựng nền tảng tài chính. Tận dụng sáng tạo và trực giác để tìm hướng đi riêng. Cân bằng giữa công việc và cuộc sống cá nhân để tránh kiệt sức.`,
    age30_40Advice: `Từ 30-40 tuổi, tận dụng kinh nghiệm để phát triển sự nghiệp và củng cố mối quan hệ gia đình. Đừng ngại lãnh đạo hoặc thử thách bản thân với những mục tiêu lớn. Chú ý sức khỏe và lập kế hoạch tài chính dài hạn.`,
    age40_50Advice: `Từ 40-50 tuổi, tập trung vào việc duy trì thành tựu và mở rộng tầm ảnh hưởng. Chăm sóc sức khỏe và dành thời gian cho gia đình. Chuẩn bị kế hoạch nghỉ hưu để đảm bảo tương lai ổn định.`,
    age50_60Advice: `Từ 50-60 tuổi, chia sẻ kinh nghiệm với người trẻ và tận hưởng thành quả đã đạt được. Giữ lối sống lành mạnh và duy trì kết nối xã hội. Sống chậm lại để tìm sự bình yên trong tâm hồn.`,
    age60_plusAdvice: `Từ 60+ tuổi, chia sẻ bài học cuộc sống với con cháu và duy trì mối quan hệ thân thiết. Tìm niềm vui trong những hoạt động nhẹ nhàng như đọc sách, làm vườn. Chăm sóc sức khỏe và sống đơn giản để tận hưởng sự bình yên.`
  };

  if (dominantNumber !== 9 || soulNumber !== 9 || personalityNumber !== 11 || destinyNumber !== 11) {
    numerology.lifePathDesc = `Mang năng lượng của số ${dominantNumber}, định hình con đường sống của bạn.`;
    numerology.soulDesc = `Thể hiện khát vọng bên trong qua số ${soulNumber}.`;
    numerology.personalityDesc = `Phản ánh cách bạn thể hiện mình với số ${personalityNumber}.`;
    numerology.destinyDesc = `Hướng tới số phận được định sẵn với số ${destinyNumber}.`;
    numerology.age0_10 = `Từ 0-10 tuổi, với số linh hồn ${soulNumber}, bạn bắt đầu cuộc sống với sự tò mò và nhạy cảm đặc trưng. Năng lượng của số ${soulNumber} khiến bạn thích khám phá và dễ bị ảnh hưởng bởi môi trường xung quanh. Đây là giai đoạn hình thành tính cách cơ bản, nơi bạn học cách giao tiếp và thể hiện cảm xúc. Bạn có thể nhạy bén hơn bạn bè cùng tuổi, thường quan tâm đến người khác một cách tự nhiên. Gia đình đóng vai trò lớn trong việc định hình tư duy và giá trị của bạn. Thách thức là bạn dễ bị tổn thương nếu không được yêu thương đầy đủ. Cơ hội nằm ở việc phát triển sự sáng tạo và lòng trắc ẩn từ sớm. Bạn thường thích những trò chơi hoặc hoạt động mang tính tưởng tượng cao. Giai đoạn này giúp bạn xây dựng nền tảng cảm xúc cho tương lai. Cuối 0-10 tuổi, bạn bắt đầu hình thành ý thức về bản thân, dù còn mơ hồ và phụ thuộc vào người lớn.`;
    numerology.age10_20 = `Từ 10-20 tuổi, với số linh hồn ${soulNumber} và số chủ đạo ${dominantNumber}, bạn bước vào giai đoạn khám phá bản thân với khát vọng khẳng định mình. Số ${soulNumber} mang đến sự nhạy bén và cảm xúc mạnh mẽ, khiến bạn dễ bị cuốn vào tình bạn hoặc tình yêu đầu đời. Số ${dominantNumber} thúc đẩy bạn mơ ước lớn, thường gắn với những ý tưởng thay đổi thế giới. Đây là thời kỳ bạn bắt đầu độc lập hơn, nhưng cũng đối mặt với áp lực từ kỳ vọng bên ngoài. Bạn có xu hướng sáng tạo và thử sức ở nhiều lĩnh vực như học tập hoặc sở thích cá nhân. Thách thức là cân bằng giữa cảm xúc và lý trí khi đối mặt với thất bại. Cơ hội nằm ở việc phát triển tài năng nếu được hỗ trợ đúng cách. Bạn thường bị thu hút bởi những người có cùng chí hướng. Giai đoạn này, bạn học cách biến ý tưởng thành hành động, dù còn vụng về. Cuối 10-20 tuổi, bạn sẽ có cái nhìn rõ hơn về hướng đi của mình, dù vẫn cần thời gian để trưởng thành hoàn toàn.`;
    numerology.age20_30 = `Từ 20-30 tuổi, với số linh hồn ${soulNumber}, số chủ đạo ${dominantNumber} và số nhân cách ${personalityNumber}, bạn bắt đầu định hình con đường sự nghiệp và cuộc sống. Số ${soulNumber} khiến bạn khao khát tự do và sáng tạo, thúc đẩy bạn tìm kiếm ý nghĩa trong mọi việc. Số ${dominantNumber} hướng bạn tới những mục tiêu lớn, thường mang tính lý tưởng. Số ${personalityNumber} giúp bạn thể hiện cá tính độc đáo, thu hút sự chú ý từ người khác. Đây là giai đoạn bạn có thể đạt được thành công đầu tiên nếu kiên trì. Thách thức là bạn dễ bị phân tâm bởi quá nhiều lựa chọn. Cơ hội nằm ở việc xây dựng nền tảng vững chắc cho tương lai. Bạn thường thích những công việc đòi hỏi sự sáng tạo hoặc độc lập. Giai đoạn này, bạn học cách cân bằng giữa ước mơ và thực tế. Cuối 20-30 tuổi, bạn bắt đầu hiểu rõ hơn về bản thân và điều mình thực sự muốn.`;
    numerology.age30_40 = `Từ 30-40 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn tập trung khẳng định bản thân trong công việc và gia đình. Số ${personalityNumber} mang đến sự nhạy bén và khả năng lãnh đạo, giúp bạn đưa ra quyết định quan trọng. Số ${destinyNumber} định hình bạn thành người có mục tiêu rõ ràng, thường gắn với việc hỗ trợ người khác. Đây là thời kỳ bạn có thể đạt được thành công lớn nếu tận dụng kinh nghiệm. Bạn bắt đầu xây dựng sự ổn định về tài chính và mối quan hệ. Thách thức là áp lực từ công việc có thể ảnh hưởng đến sức khỏe. Cơ hội nằm ở khả năng tạo dựng danh tiếng hoặc vị thế. Giai đoạn này, bạn học cách hợp tác và kiểm soát cảm xúc tốt hơn. Cuối 30-40 tuổi, bạn sẽ có kế hoạch rõ ràng hơn cho tương lai.`;
    numerology.age40_50 = `Từ 40-50 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn củng cố thành tựu và mở rộng tầm ảnh hưởng. Số ${personalityNumber} giúp bạn duy trì sự tự tin và khả năng dẫn dắt. Số ${destinyNumber} hướng bạn tới những mục tiêu lớn hơn, thường liên quan đến cộng đồng. Đây là giai đoạn bạn có thể đạt đỉnh cao trong sự nghiệp. Thách thức là cần chú ý sức khỏe và tránh làm việc quá sức. Cơ hội nằm ở việc xây dựng di sản lâu dài. Bạn trở nên thực tế hơn, nhưng vẫn giữ được khát vọng. Mối quan hệ gia đình trở thành nguồn động lực lớn. Cuối 40-50 tuổi, bạn bắt đầu suy ngẫm về ý nghĩa cuộc sống.`;
    numerology.age50_60 = `Từ 50-60 tuổi, với số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber} và số chủ đạo ${dominantNumber}, bạn tổng hợp kinh nghiệm và tận hưởng thành quả. Số ${personalityNumber} mang đến sự điềm tĩnh và tầm nhìn xa. Số ${destinyNumber} định hình bạn thành người chia sẻ kiến thức. Số ${dominantNumber} giúp bạn sống với lý tưởng, dù nhẹ nhàng hơn. Đây là thời kỳ bạn có thể nghỉ ngơi hoặc trở thành cố vấn. Thách thức là giữ sức khỏe và tránh cô đơn. Cơ hội nằm ở việc truyền cảm hứng cho người trẻ. Giai đoạn này, bạn học cách sống chậm lại. Cuối 50-60 tuổi, bạn sẵn sàng cho giai đoạn tiếp theo với sự bình yên.`;
    numerology.age60_plus = `Từ 60+ tuổi, kết hợp số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn tổng kết cuộc đời với sự khôn ngoan và trưởng thành. Số ${dominantNumber} giúp bạn duy trì lý tưởng sống. Số ${soulNumber} mang đến sự nhạy cảm và khả năng lắng nghe. Số ${personalityNumber} giữ bạn điềm tĩnh và sâu sắc. Số ${destinyNumber} định hình bạn thành người để lại di sản tinh thần. Giai đoạn này, bạn tập trung vào sự bình yên nội tâm. Thách thức là sức khỏe và kết nối xã hội. Bạn tìm niềm vui trong những điều giản dị như gia đình, thiên nhiên. Đây là thời kỳ bạn chia sẻ bài học với con cháu. Cuối đời, bạn để lại dấu ấn bằng lòng tốt và trí tuệ.`;
    numerology.age0_10Advice = `Khuyến khích bạn khám phá qua trò chơi và học tập nhẹ nhàng. Tạo môi trường yêu thương để phát triển sự tự tin. Hỗ trợ bạn vượt qua sự nhạy cảm bằng sự quan tâm.`,
    numerology.age10_20Advice = `Tập trung học tập và thử sức ở nhiều lĩnh vực. Xây dựng mối quan hệ tích cực và giữ kiên nhẫn. Lắng nghe lời khuyên từ người lớn để định hướng tốt hơn.`,
    numerology.age20_30Advice = `Đặt mục tiêu sự nghiệp và bắt đầu xây dựng nền tảng. Tận dụng sáng tạo và cân bằng cuộc sống. Đừng ngại thất bại, đó là bài học quý giá.`,
    numerology.age30_40Advice = `Phát triển sự nghiệp và củng cố gia đình. Tận dụng kinh nghiệm để lãnh đạo. Chú ý sức khỏe và lập kế hoạch tài chính dài hạn.`,
    numerology.age40_50Advice = `Duy trì thành tựu và mở rộng ảnh hưởng. Chăm sóc sức khỏe và gia đình. Chuẩn bị kế hoạch nghỉ hưu ổn định.`,
    numerology.age50_60Advice = `Chia sẻ kinh nghiệm và tận hưởng thành quả. Giữ lối sống lành mạnh và kết nối xã hội. Sống chậm lại để tìm bình yên.`,
    numerology.age60_plusAdvice = `Chia sẻ bài học với con cháu và duy trì mối quan hệ. Tìm niềm vui trong hoạt động nhẹ nhàng. Chăm sóc sức khỏe và sống đơn giản để tận hưởng bình yên.`;
  }

  return { numerology };
}