import { defineEventHandler } from 'h3';
import {
  LifePathNumbers,
  SoulUrgeNumbers,
  PersonalityNumbers,
  ExpressionNumbers,
  NumerologyUtils
} from '../utils/numerology-meanings';

function getLifePathNumber(birthdate) {
  const [day, month, year] = birthdate.split('/').map(Number);
  if (!day || !month || !year) return 9;
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  return NumerologyUtils.reduceToSingleDigit(sum) || 9;
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

export default defineEventHandler(async (event) => {
  const { name, birthdate } = await readBody(event);

  if (!name || !birthdate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name và birthdate là bắt buộc.'
    });
  }

  const dominantNumber = getLifePathNumber(birthdate);
  const soulNumber = getSoulNumber(name);
  const personalityNumber = getPersonalityNumber(name);
  const destinyNumber = getDestinyNumber(name);

  const numerology = {
    age0_10: `Từ 0-10 tuổi, với số linh hồn ${soulNumber}, bạn bắt đầu cảm nhận thế giới qua ${SoulUrgeNumbers[soulNumber].motivation}. Đây là giai đoạn hình thành tính cách với khát vọng ${SoulUrgeNumbers[soulNumber].desire}. Bạn có xu hướng tò mò, nhạy cảm và thích khám phá mọi thứ xung quanh. Gia đình đóng vai trò quan trọng trong việc nuôi dưỡng sự tự tin và định hướng ban đầu. Sự hồn nhiên và năng lượng tích cực giúp bạn dễ dàng thích nghi với môi trường mới. Những trải nghiệm đầu đời sẽ ảnh hưởng lâu dài đến cách bạn nhìn nhận bản thân. Đây là thời điểm bạn bắt đầu bộc lộ những đặc điểm nổi bật trong tính cách. Sự hỗ trợ từ người thân giúp bạn phát triển một cách tự nhiên và thoải mái. Giai đoạn này đặt nền móng cho hành trình khám phá sau này. Khả năng sáng tạo và trí tưởng tượng của bạn cũng bắt đầu được khơi dậy. Những bài học đầu tiên về cảm xúc và mối quan hệ hình thành ở đây. Bạn có thể tỏ ra nhạy bén với những thay đổi nhỏ trong cuộc sống hàng ngày. Đây là thời kỳ bạn học cách tin tưởng vào trực giác của mình. Cuộc sống trong giai đoạn này thường đơn giản nhưng đầy ý nghĩa đối với sự phát triển cá nhân.`,
    age10_20: `Từ 10-20 tuổi, với số linh hồn ${soulNumber} và số chủ đạo ${dominantNumber}, bạn bước vào giai đoạn khám phá bản thân mạnh mẽ. Số linh hồn ${soulNumber} thúc đẩy bạn theo đuổi ${SoulUrgeNumbers[soulNumber].desire}, trong khi số chủ đạo ${dominantNumber} định hình mục đích ${LifePathNumbers[dominantNumber].purpose}. Đây là thời điểm bạn bắt đầu nhận thức rõ hơn về thế giới xung quanh. Bạn có thể cảm thấy thôi thúc tìm kiếm ý nghĩa sâu sắc hơn trong cuộc sống. Sự kết hợp này mang lại năng lượng độc lập và sáng tạo. Bạn thường thử nghiệm nhiều sở thích và đam mê khác nhau. Những mối quan hệ bạn bè bắt đầu ảnh hưởng đến tư duy và hành vi của bạn. Đây cũng là giai đoạn bạn học cách cân bằng giữa cảm xúc và lý trí. Những thử thách đầu tiên trong học tập và cuộc sống giúp bạn trưởng thành hơn. Số chủ đạo ${dominantNumber} khuyến khích bạn hướng tới ${LifePathNumbers[dominantNumber].theme}. Bạn có thể đối mặt với áp lực từ gia đình hoặc xã hội, nhưng điều này rèn luyện ý chí mạnh mẽ. Giai đoạn này là bước đệm để bạn chuẩn bị cho những mục tiêu lớn hơn trong tương lai. Sự tự tin của bạn dần được xây dựng qua những trải nghiệm thực tế. Đây là thời kỳ quan trọng để định hình giá trị cá nhân và ước mơ của bạn.`,
    age20_30: `Từ 20-30 tuổi, với số linh hồn ${soulNumber}, số chủ đạo ${dominantNumber} và số nhân cách ${personalityNumber}, bạn bắt đầu định hình con đường sự nghiệp và cuộc sống. Số linh hồn ${soulNumber} tiếp tục dẫn dắt bạn qua ${SoulUrgeNumbers[soulNumber].motivation}, trong khi số chủ đạo ${dominantNumber} định hướng bạn theo ${LifePathNumbers[dominantNumber].purpose}. Số nhân cách ${personalityNumber} thể hiện cách bạn thể hiện mình với thế giới qua ${PersonalityNumbers[personalityNumber].theme}. Đây là giai đoạn bạn tập trung vào việc xây dựng nền tảng cho tương lai. Bạn có thể đối mặt với nhiều cơ hội và thách thức trong công việc. Sự kết hợp này mang lại khả năng lãnh đạo và sáng tạo trong cách giải quyết vấn đề. Những mối quan hệ cá nhân trở nên sâu sắc hơn, phản ánh nhu cầu nội tâm của bạn. Bạn học cách cân bằng giữa tham vọng cá nhân và trách nhiệm xã hội. Giai đoạn này đòi hỏi bạn phải đưa ra những quyết định quan trọng về cuộc đời. Sự tự tin và kinh nghiệm tích lũy giúp bạn vượt qua khó khăn. Đây là thời điểm bạn bắt đầu nhận ra giá trị thực sự của bản thân. Năng lượng của số nhân cách ${personalityNumber} giúp bạn tạo ấn tượng mạnh mẽ với người khác. Bạn có thể khám phá thêm về đam mê và mục tiêu dài hạn. Đây là giai đoạn chuyển giao quan trọng để bước vào sự trưởng thành đầy đủ.`,
    age30_40: `Từ 30-40 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn tập trung vào việc khẳng định vị trí của mình trong cuộc sống. Số nhân cách ${personalityNumber} định hình cách bạn tương tác với thế giới qua ${PersonalityNumbers[personalityNumber].theme}. Số định mệnh ${destinyNumber} dẫn bạn tới ${ExpressionNumbers[destinyNumber].theme}, phản ánh sứ mệnh lâu dài của bạn. Đây là thời kỳ bạn đạt được sự ổn định trong sự nghiệp và gia đình. Bạn có thể trở thành người dẫn dắt trong công việc hoặc cộng đồng. Kinh nghiệm tích lũy từ trước giúp bạn đưa ra các quyết định sáng suốt hơn. Sự tự tin của bạn được củng cố qua những thành tựu cụ thể. Giai đoạn này đòi hỏi bạn phải cân bằng giữa công việc và đời sống cá nhân. Số định mệnh ${destinyNumber} khuyến khích bạn xây dựng một di sản lâu dài. Bạn có thể cảm thấy trách nhiệm lớn hơn đối với gia đình và xã hội. Đây là thời điểm bạn bắt đầu tận hưởng thành quả từ những nỗ lực trước đó. Sự kiên nhẫn và bền bỉ là chìa khóa để bạn vượt qua thử thách. Giai đoạn này đánh dấu sự trưởng thành hoàn toàn trong tính cách và tư duy của bạn. Bạn có thể truyền cảm hứng cho người khác qua hành động và kinh nghiệm của mình.`,
    age40_50: `Từ 40-50 tuổi, với số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn củng cố những gì đã đạt được. Số nhân cách ${personalityNumber} tiếp tục định hình ${PersonalityNumbers[personalityNumber].theme}, trong khi số định mệnh ${destinyNumber} dẫn dắt bạn qua ${ExpressionNumbers[destinyNumber].theme}. Đây là giai đoạn bạn đạt đỉnh cao trong sự nghiệp và sự ổn định cá nhân. Bạn có thể tập trung vào việc hoàn thiện các mục tiêu dài hạn. Kinh nghiệm sống phong phú giúp bạn xử lý mọi tình huống một cách khéo léo. Sự tự tin và uy tín của bạn được người khác công nhận. Giai đoạn này mang lại cảm giác hài lòng với những thành tựu đã đạt được. Bạn có thể bắt đầu nghĩ đến việc để lại dấu ấn cho thế hệ sau. Số định mệnh ${destinyNumber} thúc đẩy bạn hoàn thành sứ mệnh của mình. Đây là thời kỳ bạn cân bằng giữa việc tận hưởng cuộc sống và duy trì trách nhiệm. Sự kiên định và tầm nhìn xa giúp bạn vượt qua bất kỳ trở ngại nào. Bạn có thể trở thành nguồn cảm hứng cho gia đình và cộng đồng. Giai đoạn này là thời điểm bạn đạt được sự hài hòa trong cuộc sống.`,
    age50_60: `Từ 50-60 tuổi, với số nhân cách ${personalityNumber}, số định mệnh ${destinyNumber} và số chủ đạo ${dominantNumber}, bạn tổng hợp kinh nghiệm sống của mình. Số nhân cách ${personalityNumber} phản ánh ${PersonalityNumbers[personalityNumber].theme}, trong khi số định mệnh ${destinyNumber} dẫn bạn qua ${ExpressionNumbers[destinyNumber].theme}. Số chủ đạo ${dominantNumber} mang lại mục đích ${LifePathNumbers[dominantNumber].purpose}, kết nối lại với hành trình tổng thể của bạn. Đây là giai đoạn bạn nhìn lại những gì đã đạt được và chuẩn bị cho tương lai. Bạn có thể tập trung vào việc chia sẻ kinh nghiệm với thế hệ trẻ. Sự khôn ngoan và hiểu biết của bạn trở thành tài sản quý giá. Giai đoạn này mang lại sự bình yên và hài lòng trong tâm hồn. Bạn có thể tham gia các hoạt động cộng đồng hoặc gia đình nhiều hơn. Số chủ đạo ${dominantNumber} nhắc bạn về ${LifePathNumbers[dominantNumber].theme} trong cuộc sống. Đây là thời kỳ bạn tận hưởng thành quả lao động và tìm kiếm ý nghĩa sâu sắc hơn. Sự cân bằng giữa công việc và nghỉ ngơi trở nên quan trọng. Bạn có thể cảm thấy tự hào về những đóng góp của mình cho xã hội. Giai đoạn này là bước chuẩn bị cho một cuộc sống an nhàn sau này.`,
    age60_plus: `Từ 60 tuổi trở lên, với số chủ đạo ${dominantNumber}, số linh hồn ${soulNumber}, số nhân cách ${personalityNumber} và số định mệnh ${destinyNumber}, bạn tổng kết hành trình cuộc đời. Số chủ đạo ${dominantNumber} định hình ${LifePathNumbers[dominantNumber].purpose}, trong khi số linh hồn ${soulNumber} phản ánh ${SoulUrgeNumbers[soulNumber].desire}. Số nhân cách ${personalityNumber} thể hiện ${PersonalityNumbers[personalityNumber].theme}, và số định mệnh ${destinyNumber} hoàn thành ${ExpressionNumbers[destinyNumber].theme}. Đây là giai đoạn bạn nhìn lại toàn bộ cuộc sống với sự hài lòng và bình an. Bạn có thể tận hưởng thời gian bên gia đình và bạn bè thân thiết. Sự khôn ngoan tích lũy qua năm tháng trở thành nguồn cảm hứng cho người khác. Giai đoạn này mang lại cảm giác hoàn thành sứ mệnh cá nhân. Bạn có thể tham gia vào các hoạt động ý nghĩa để để lại di sản. Số linh hồn ${soulNumber} nhắc bạn sống đúng với ${SoulUrgeNumbers[soulNumber].motivation}. Đây là thời kỳ bạn tìm thấy sự thanh thản trong tâm hồn. Những giá trị bạn xây dựng được truyền lại cho thế hệ sau. Bạn có thể tập trung vào sức khỏe và sự thư giãn. Giai đoạn này là phần thưởng xứng đáng cho những nỗ lực suốt cuộc đời. Bạn sống với sự biết ơn và niềm vui giản dị.`,
    age0_10Advice: ['Khuyến khích sự tò mò và sáng tạo', 'Tạo môi trường an toàn để khám phá', 'Hỗ trợ phát triển cảm xúc', 'Dành thời gian chơi đùa và học hỏi', 'Nuôi dưỡng sự tự tin ban đầu'],
    age10_20Advice: ['Khuyến khích tìm kiếm đam mê', 'Hỗ trợ học tập và phát triển kỹ năng', 'Dạy cách quản lý cảm xúc', 'Tạo cơ hội giao tiếp xã hội', 'Định hướng mục tiêu rõ ràng'],
    age20_30Advice: ['Tập trung xây dựng sự nghiệp', 'Tận dụng sáng tạo và năng lượng', 'Học cách cân bằng công việc và cuộc sống', 'Xây dựng mối quan hệ ý nghĩa', 'Đặt mục tiêu dài hạn'],
    age30_40Advice: ['Củng cố sự nghiệp và gia đình', 'Tận dụng kinh nghiệm để phát triển', 'Duy trì sức khỏe thể chất và tinh thần', 'Xây dựng di sản cá nhân', 'Học cách quản lý áp lực'],
    age40_50Advice: ['Duy trì thành tựu đã đạt được', 'Chăm sóc sức khỏe kỹ lưỡng', 'Chia sẻ kinh nghiệm với người khác', 'Tận hưởng cuộc sống cá nhân', 'Chuẩn bị cho giai đoạn sau'],
    age50_60Advice: ['Chia sẻ tri thức và kinh nghiệm', 'Tập trung vào sức khỏe và thư giãn', 'Tham gia hoạt động cộng đồng', 'Tận hưởng thời gian với gia đình', 'Chuẩn bị cho nghỉ ngơi an nhàn'],
    age60_plusAdvice: ['Sống với sự biết ơn và bình an', 'Chia sẻ bài học cuộc đời', 'Duy trì các mối quan hệ thân thiết', 'Chăm sóc sức khỏe đều đặn', 'Tận hưởng niềm vui giản dị']
  };

  return { numerology };
});