import { defineEventHandler, getRouterParams } from 'h3';
import lifePath1 from '~/data/life-paths/1.js';
import lifePath2 from '~/data/life-paths/2.js';
import lifePath3 from '~/data/life-paths/3.js';
import lifePath4 from '~/data/life-paths/4.js';
import lifePath5 from '~/data/life-paths/5.js';
import lifePath6 from '~/data/life-paths/6.js';
import lifePath7 from '~/data/life-paths/7.js';
import lifePath8 from '~/data/life-paths/8.js';
import lifePath9 from '~/data/life-paths/9.js';
import lifePath11 from '~/data/life-paths/11.js';
import lifePath22 from '~/data/life-paths/22.js';

// Mapping các số đường đời với dữ liệu
const lifePathData = {
  '1': lifePath1,
  '2': lifePath2,
  '3': lifePath3,
  '4': lifePath4,
  '5': lifePath5,
  '6': lifePath6,
  '7': lifePath7,
  '8': lifePath8,
  '9': lifePath9,
  '11': lifePath11,
  '22': lifePath22
};

export default defineEventHandler(async (event) => {
  const { number } = getRouterParams(event);
  const validNumbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '11', '22'];

  if (!validNumbers.includes(number)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Số Đường Đời không hợp lệ. Vui lòng chọn từ 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, hoặc 22.'
    });
  }

  const data = lifePathData[number];
  if (!data) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Không tìm thấy dữ liệu cho Số Đường Đời này.'
    });
  }

  return data.default || data;
});