// server/api/motivation.js
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { goal, weeklyProgress } = body; // Mục tiêu và tiến trình tuần

  const apiKey = process.env.GEMINI_API_KEY || 'your_key_here';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const prompt = `Dựa trên mục tiêu "${goal}" và tiến trình tuần này "${JSON.stringify(weeklyProgress)}", tạo một thông điệp động viên ngắn (3-5 câu) cho người dùng. Giọng điệu tích cực, gần gũi, truyền cảm hứng để họ tiếp tục kiên trì. Trả về JSON: { "message": "thông điệp" }.`;

  try {
    const response = await fetch(`${url}?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json|```/g, '').trim(); // Làm sạch dữ liệu
    const result = JSON.parse(rawText);
    return result;
  } catch (error) {
    console.error('Lỗi khi gọi Gemini API:', error);
    return {
      message: "Tuần này bạn đã cố gắng hết mình rồi, tuyệt lắm! Đừng lo nếu chưa thấy kết quả ngay, cứ kiên trì, bạn đang đi đúng đường để chinh phục mục tiêu đấy!"
    };
  }
});