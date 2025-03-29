// server/utils/commonApi.js
import axios from 'axios';

const apiKey = process.env.GEMINI_API_KEY || '';

export async function callGeminiApi(prompt) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        contents: [{
          parts: [{ text: prompt }]
        }]
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    if (!response.data || !response.data.candidates) {
      throw new Error('Gemini API không trả về dữ liệu hợp lệ');
    }

    let rawText = response.data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json|```/g, '').trim();

    try {
      const parsedData = JSON.parse(rawText);
      if (!parsedData || !parsedData.answer) {
        throw new Error('Gemini API không trả về dữ liệu đầy đủ');
      }
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError, 'Raw text:', rawText);
      throw new Error('Không thể phân tích dữ liệu từ Gemini');
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini API:', error.message);
    throw error; // Ném lỗi để hàm gọi xử lý fallback
  }
}