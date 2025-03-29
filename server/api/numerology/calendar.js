// server/api/numerology/calendar.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

function getPersonalDayNumber(birthDate, currentDate) {
  const [birthDay, birthMonth] = birthDate.split('/').map(Number);
  const [day, month, year] = currentDate.split('/').map(Number);
  const sum = (birthDay + birthMonth + day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 9;
}

function getDayType(number) {
  if ([1, 3, 5, 9].includes(number)) return { type: 'good', desc: 'Ngày tốt: Năng lượng tích cực, phù hợp hành động lớn.' };
  if ([2, 4, 6].includes(number)) return { type: 'average', desc: 'Ngày trung bình: Ổn định, thích hợp việc thường nhật.' };
  return { type: 'bad', desc: 'Ngày xấu: Năng lượng thấp, nên cẩn thận.' };
}

export default defineEventHandler(async (event) => {
  const { birthDate, monthYear } = await readBody(event);

  if (!birthDate || !monthYear) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: birthDate và monthYear là bắt buộc.',
    });
  }

  const [month, year] = monthYear.split('/').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDay = new Date(year, month - 1, 1).getDay(); // 0 = CN, 1 = T2, ...
  const offset = firstDay === 0 ? 6 : firstDay - 1; // Điều chỉnh để T2 là ngày đầu tuần

  const days = [];
  for (let i = 0; i < offset; i++) days.push({ number: null }); // Ngày trống đầu tháng
  for (let day = 1; day <= daysInMonth; day++) {
    const currentDate = `${day}/${month}/${year}`;
    const personalNumber = getPersonalDayNumber(birthDate, currentDate);
    const { type, desc } = getDayType(personalNumber);
    days.push({ number: day, personalNumber, type, desc });
  }
  while (days.length % 7 !== 0) days.push({ number: null }); // Điền ngày trống cuối tháng

  return {
    calendar: {
      month,
      year,
      days,
    },
  };
});