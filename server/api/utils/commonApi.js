import axios from 'axios';

const apiKey = process.env.GEMINI_API_KEY||'AIzaSyBUmUduPG0zvD4URlJEmNnxDRsxMsTpaR8';

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

    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      throw new Error('Gemini API không trả về dữ liệu hợp lệ');
    }

    let rawText = response.data.candidates[0].content.parts[0].text;
    rawText = rawText.replace(/```json|```/g, '').trim();

    console.log('Raw text from Gemini:', rawText); // Debug dữ liệu thô

    try {
      const parsedData = JSON.parse(rawText);
      // Không kiểm tra parsedData.answer nữa, vì prompt trả về {day, week, month, year}
      return parsedData;
    } catch (parseError) {
      console.error('Lỗi parse JSON từ Gemini:', parseError.message, 'Raw text:', rawText);
      throw new Error('Gemini API không trả về JSON hợp lệ');
    }
  } catch (error) {
    console.error('Lỗi gọi Gemini API:', error.message);
    throw error; // Ném lỗi để fallback trong period.js
  }
}