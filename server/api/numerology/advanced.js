import { defineEventHandler } from 'h3'

// Hàm tính Số chủ đạo (Life Path Number) từ daily.js
function getLifePathNumber(birthdate) {
  const date = new Date(birthdate)
  const day = date.getDate().toString()
  const month = (date.getMonth() + 1).toString()
  const year = date.getFullYear().toString()
  const sum = (day + month + year).split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  let result = sum
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  }
  return result
}

// Hàm tính Số linh hồn (Soul Urge) từ nguyên âm trong tên
function getSoulNumber(name) {
  const vowels = /[aeiou]/gi
  const vowelValues = { a: 1, e: 5, i: 9, o: 6, u: 3 }
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return vowels.test(char) ? acc + (vowelValues[char] || 0) : acc
  }, 0)
  let result = sum
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  }
  return result
}

// Hàm tính Số nhân cách (Personality) từ phụ âm trong tên
function getPersonalityNumber(name) {
  const consonants = /[^aeiou\s]/gi
  const letterValues = { b: 2, c: 3, d: 4, f: 6, g: 7, h: 8, j: 1, k: 2, l: 3, m: 4, n: 5, p: 7, q: 8, r: 9, s: 1, t: 2, v: 4, w: 5, x: 6, y: 7, z: 8 }
  const sum = name.toLowerCase().split('').reduce((acc, char) => {
    return consonants.test(char) ? acc + (letterValues[char] || 0) : acc
  }, 0)
  let result = sum
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  }
  return result
}

// Hàm tính Số định mệnh (Destiny) từ toàn bộ tên
function getDestinyNumber(name) {
  const letterValues = { a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9, j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9, s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8 }
  const sum = name.toLowerCase().split('').reduce((acc, char) => acc + (letterValues[char] || 0), 0)
  let result = sum
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0)
  }
  return result
}

export default defineEventHandler(async (event) => {
  const username = event.node.req.headers['x-username'] || 'guest'
  const birthDate = localStorage.getItem('birthdate') || '14/03/2000' // Lấy từ localStorage, fallback nếu không có
  const dominantNumber = getLifePathNumber(birthDate)
  const soulNumber = getSoulNumber(username)
  const personalityNumber = getPersonalityNumber(username)
  const destinyNumber = getDestinyNumber(username)
  const currentYear = new Date().getFullYear()
  const personalCycle = (currentYear + 3 + 14) % 9 || 9

  return {
    chart: {
      dominant: {
        number: dominantNumber,
        description: `Số chủ đạo ${dominantNumber}: Đây là con số định hình bản chất sâu nhất của bạn. Với số ${dominantNumber}, bạn là người tìm kiếm sự thật, có nội tâm sâu sắc, thích khám phá tri thức và vũ trụ. Bạn thường sống lý trí nhưng đôi khi cần thả lỏng để kết nối với cảm xúc.`
      },
      soul: {
        number: soulNumber,
        description: `Số linh hồn ${soulNumber}: Con số này phản ánh khát vọng bên trong bạn. Số ${soulNumber} cho thấy bạn yêu thích sự ổn định, trật tự, và thường tìm kiếm sự an toàn trong công việc lẫn cuộc sống. Hãy lắng nghe trái tim để cân bằng với lý trí nhé!`
      },
      personality: {
        number: personalityNumber,
        description: `Số nhân cách ${personalityNumber}: Đây là cách người khác nhìn nhận bạn. Với số ${personalityNumber}, bạn toát lên vẻ lý tưởng, nhân đạo, và thường truyền cảm hứng cho đồng nghiệp. Đôi khi bạn cần thực tế hơn để tránh mơ mộng quá đà.`
      },
      destiny: {
        number: destinyNumber,
        description: `Số định mệnh ${destinyNumber}: Con số này hé lộ sứ mệnh cuộc đời bạn. Số ${destinyNumber} biểu thị sự sáng tạo, khả năng biểu đạt vượt trội, rất phù hợp với công việc văn phòng cần ý tưởng mới. Hãy tận dụng để tỏa sáng trong sự nghiệp!`
      }
    },
    life_path_analysis: `Con đường cuộc đời: Với số chủ đạo ${dominantNumber}, bạn có xu hướng tìm kiếm ý nghĩa sâu xa trong cuộc sống. Năm ${currentYear + 1}, chu kỳ cá nhân của bạn bước vào giai đoạn số ${personalCycle} (Thay đổi), hứa hẹn nhiều biến động tích cực trong công việc và các mối quan hệ. Hãy chuẩn bị tinh thần để đón nhận những cơ hội bất ngờ.`,
    future_prediction: `Dự đoán chi tiết:\n- Tháng 4/${currentYear + 1}: Một dự án mới sẽ mở ra, đòi hỏi bạn phải phát huy tối đa sự sáng tạo (số ${destinyNumber}).\n- Tháng 6/${currentYear + 1}: Cơ hội tài chính xuất hiện, có thể liên quan đến đầu tư.\n- Cuối năm ${currentYear + 1}: Thời điểm để định hướng lại mục tiêu dài hạn.`,
    personal_advice: `Lời khuyên: Trong 6 tháng tới, hãy dành thời gian thiền định hoặc viết nhật ký. Số ${personalityNumber} khuyên bạn tham gia hoạt động từ thiện để tăng năng lượng tích cực.`
  }
})