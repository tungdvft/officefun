import { defineEventHandler, getRouterParams, getQuery } from 'h3';
import { calculatePersonalYearNumber } from '~/utils/numerology-calculations';
import personalYear1 from '~/data/personal-years/1.js';
import personalYear2 from '~/data/personal-years/2.js';
import personalYear3 from '~/data/personal-years/3.js';
import personalYear4 from '~/data/personal-years/4.js';
import personalYear5 from '~/data/personal-years/5.js';
import personalYear6 from '~/data/personal-years/6.js';
import personalYear7 from '~/data/personal-years/7.js';
import personalYear8 from '~/data/personal-years/8.js';
import personalYear9 from '~/data/personal-years/9.js';
import personalYear11 from '~/data/personal-years/11.js';
import personalYear22 from '~/data/personal-years/22.js';

const personalYearData = {
  '1': personalYear1,
  '2': personalYear2,
  '3': personalYear3,
  '4': personalYear4,
  '5': personalYear5,
  '6': personalYear6,
  '7': personalYear7,
  '8': personalYear8,
  '9': personalYear9,
  '11': personalYear11,
  '22': personalYear22
};

export default defineEventHandler(async (event) => {
  const { lifePath } = getRouterParams(event);
  const { birthDate } = getQuery(event);
  const validLifePaths = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22'];

  if (!validLifePaths.includes(lifePath)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Số Đường Đời không hợp lệ.'
    });
  }

  if (!birthDate || !/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ngày sinh không hợp lệ (DD/MM/YYYY).'
    });
  }

  const [day, month, year] = birthDate.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getDate() !== day ||
    dateObj.getMonth() + 1 !== month ||
    year < 1900 ||
    year > 2025
  ) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ngày sinh không hợp lệ.'
    });
  }

  const cycles = [];
  for (let i = 0; i < 10; i++) {
    const targetYear = 2025 + i;
    const personalYear = calculatePersonalYearNumber(birthDate, targetYear);
    console.log(`API: Year=${targetYear}, BirthDate=${birthDate}, PersonalYear=${personalYear}`); // Debug log
    const personalYearStr = personalYear.toString();
    const data = personalYearData[personalYearStr];

    if (!data) {
      throw createError({
        statusCode: 500,
        statusMessage: `Không tìm thấy dữ liệu cho chu kỳ vận số ${personalYearStr}.`
      });
    }

    cycles.push({
      year: targetYear,
      number: personalYear,
      meaning: data.meaning,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      advice: data.advice
    });
  }

  return cycles;
});