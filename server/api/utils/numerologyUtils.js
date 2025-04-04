export function getCurrentDateInfo() {
  const today = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  const day = today.getDate();
  const month = today.getMonth() + 1;
  const year = today.getFullYear();

  const startOfWeek = new Date(today);
  const dayOfWeek = today.getDay() || 7;
  startOfWeek.setDate(day - (dayOfWeek - 1));
  const startDay = startOfWeek.getDate();
  const startMonth = startOfWeek.getMonth() + 1;

  return {
    currentDate: `${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentWeek: `Tuần từ ${startDay < 10 ? '0' + startDay : startDay}/${startMonth < 10 ? '0' + startMonth : startMonth}/${year} - ${day < 10 ? '0' + day : day}/${month < 10 ? '0' + month : month}/${year}`,
    currentMonth: `${month < 10 ? '0' + month : month}/${year}`,
    currentYear: `${year}`
  };
}

export function calculateNumber(birthDate, period) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const { currentDate, currentWeek, currentMonth, currentYear } = getCurrentDateInfo();

  let sum;
  switch (period) {
    case 'day':
      const [day, month, year] = currentDate.split('/').map(Number);
      sum = birthDay + birthMonth + day + month + year;
      break;
    case 'week':
      const [startDay] = currentWeek.split(' - ')[0].split('/').map(Number);
      sum = birthDay + birthMonth + startDay + 3 + 2025; // 3 represents week energy
      break;
    case 'month':
      const [monthNum, yearNum] = currentMonth.split('/').map(Number);
      sum = birthDay + birthMonth + monthNum + yearNum;
      break;
    case 'year':
      sum = birthDay + birthMonth + parseInt(currentYear);
      break;
    default:
      return 1;
  }

  return reduceToSingleDigit(sum);
}

export function calculatePersonalYear(birthDate, targetYear) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) return 1;
  
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  let sum = birthDay + birthMonth + targetYear;
  
  // Master numbers 11 and 22 are not reduced
  if (sum === 11 || sum === 22) return sum;
  
  return reduceToSingleDigit(sum);
}

function reduceToSingleDigit(number) {
  let result = number;
  while (result > 9) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 1;
}

export function getPersonalYearMeaning(number) {
  const meanings = {
    1: 'Khởi đầu mới, thời điểm để hành động và độc lập.',
    2: 'Hợp tác, tập trung vào cảm xúc và kiên nhẫn.',
    3: 'Sáng tạo, giao tiếp, mang lại niềm vui và năng lượng.',
    4: 'Xây dựng nền tảng, ổn định, cần sự chăm chỉ.',
    5: 'Thay đổi, tự do, thích hợp cho phiêu lưu.',
    6: 'Trách nhiệm, yêu thương, chú trọng gia đình.',
    7: 'Tìm hiểu, nội tâm, thời gian cho tâm linh.',
    8: 'Thành công, quyền lực, cơ hội về tài chính.',
    9: 'Kết thúc chu kỳ, nhân đạo, thời điểm buông bỏ.',
    11: 'Trực giác mạnh, truyền cảm hứng cho bản thân và người khác.',
    22: 'Xây dựng lớn, biến ước mơ lớn thành hiện thực.'
  };
  return meanings[number] || 'Không xác định';
}