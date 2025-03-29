// server/api/numerology/fengshui.js
import { defineEventHandler, createError } from 'h3';
import { callGeminiApi } from '../utils/commonApi';

function getLifePathNumber(birthDate) {
  const [day, month, year] = birthDate.split('/').map(Number);
  if (!day || !month || !year) return 9;
  const sum = (day + month + year).toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  let result = sum;
  while (result > 9 && result !== 11 && result !== 22) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result || 9;
}

function getFengShuiData(lifePath) {
  switch (lifePath) {
    case 1:
      return { element: 'Thủy', direction: 'Bắc', colors: ['xanh dương', 'đen'], items: ['bể cá', 'nước chảy'] };
    case 2: case 5: case 8:
      return { element: 'Thổ', direction: 'Đông Bắc', colors: ['vàng', 'nâu'], items: ['đá quý', 'gốm sứ'] };
    case 3: case 4:
      return { element: 'Mộc', direction: 'Đông', colors: ['xanh lá'], items: ['cây xanh', 'gỗ tự nhiên'] };
    case 6: case 7:
      return { element: 'Kim', direction: 'Tây', colors: ['trắng', 'vàng kim'], items: ['kim loại', 'chuông gió'] };
    case 9:
      return { element: 'Hỏa', direction: 'Nam', colors: ['đỏ', 'tím'], items: ['nến', 'đèn đỏ'] };
    default:
      return { element: 'Thổ', direction: 'Tây Nam', colors: ['vàng', 'nâu'], items: ['đá phong thủy'] };
  }
}

export default defineEventHandler(async (event) => {
  const { birthDate } = await readBody(event);

  if (!birthDate) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: birthDate là bắt buộc.',
    });
  }

  const lifePath = getLifePathNumber(birthDate);
  const fengShui = getFengShuiData(lifePath);

  const prompt = `Dựa trên thần số học, số chủ đạo ${lifePath} từ ngày sinh "${birthDate}" thuộc ngũ hành "${fengShui.element}". Trả về JSON hợp lệ với phần "fengshui" chứa:
    1. "lifePath": số chủ đạo,
    2. "element": ngũ hành (Kim, Mộc, Thủy, Hỏa, Thổ),
    3. "direction": hướng tốt nhất (ví dụ: Bắc, Đông, Tây Nam),
    4. "colors": mảng màu sắc hợp mệnh (ví dụ: ["đỏ", "tím"]),
    5. "items": mảng vật phẩm phong thủy gợi ý (ví dụ: ["nến", "đèn đỏ"]),
    6. "analysis": phân tích ngắn (5-7 câu) về năng lượng của số chủ đạo kết hợp ngũ hành, gợi ý cách áp dụng hướng và màu sắc trong đời sống.
    Không dùng Markdown, chỉ trả về chuỗi JSON thuần túy!`;

  try {
    const data = await callGeminiApi(prompt);
    if (!data || !data.fengshui) throw new Error('Gemini API không trả về dữ liệu đầy đủ');
    return data;
  } catch (error) {
    console.error('Lỗi từ Gemini:', error);
    return {
      fengshui: {
        lifePath,
        element: fengShui.element,
        direction: fengShui.direction,
        colors: fengShui.colors,
        items: fengShui.items,
        analysis: `Số chủ đạo ${lifePath} thuộc ngũ hành ${fengShui.element}, mang năng lượng đặc trưng của ${fengShui.element.toLowerCase()}. Hướng ${fengShui.direction} sẽ hỗ trợ bạn thu hút tài lộc và bình an. Màu sắc ${fengShui.colors.join(', ')} giúp tăng cường vận may và sự hài hòa. Đặt ${fengShui.items.join(' hoặc ')} ở ${fengShui.direction} trong nhà để kích hoạt năng lượng tích cực. Đây là cách đơn giản để tối ưu phong thủy cá nhân.`
      }
    };
  }
});