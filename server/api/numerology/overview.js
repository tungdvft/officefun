import { defineEventHandler } from 'h3';

export default defineEventHandler(async (event) => {
  const { name, birthdate, gender } = await readBody(event);

  if (!name || !birthdate || !gender) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Thiếu thông tin: name, birthdate và gender là bắt buộc.'
    });
  }

  const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

  const prompt = `
    Dựa trên thông tin cá nhân: tên "${name}", sinh ngày ${birthdate}, giới tính "${gender}".
    Trả về JSON hợp lệ với phần "overview" chứa:
    - "name": tên người dùng
    - "birthdate": ngày sinh
    - "gender": giới tính
    - "description": mô tả tổng quan ngắn gọn (5-7 câu) về hành trình cuộc đời dựa trên thông tin cá nhân.
    Trả về chuỗi JSON thuần túy, không dùng Markdown!
  `;

  try {
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
    const rawText = data.candidates[0].content.parts[0].text.replace(/```json|```/g, '').trim();
    return JSON.parse(rawText);
  } catch (error) {
    console.error('Lỗi gọi Gemini:', error);
    return {
      overview: {
        name,
        birthdate,
        gender,
        description: `Với tên "${name}", sinh ngày ${birthdate}, bạn là một cá nhân mang năng lượng đặc biệt, định hình qua giới tính ${gender}. Hành trình cuộc đời bạn là sự kết hợp giữa khám phá bản thân và hoàn thiện ước mơ.`
      }
    };
  }
});