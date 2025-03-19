// server/api/inspiration.js
export default defineEventHandler(async (event) => {
  const apiKey = process.env.GEMINI_API_KEY || 'your_key_here';
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

  const today = new Date().toISOString().split('T')[0];
  const prompt = `Tạo một câu chuyện truyền cảm hứng dài 8-10 câu cho dân văn phòng, dựa trên ngày "${today}". Chủ đề: kiên trì nỗ lực với một mục tiêu sẽ thay đổi cuộc đời. Không dùng tên nhân vật cụ thể, bắt đầu bằng tình huống bất ngờ trong công việc, dẫn dắt qua khó khăn thực tế, có cao trào đầy cảm xúc, kết thúc bằng thay đổi lớn lao và thông điệp động viên mạnh mẽ. Trả về JSON: { "title": "tiêu đề", "story": "câu chuyện" }.`;

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

    // Làm sạch dữ liệu: loại bỏ ```json, ``` và các ký tự thừa
    rawText = rawText.replace(/```json|```/g, '').trim();

    // Parse JSON đã làm sạch
    const result = JSON.parse(rawText);
    return result;
  } catch (error) {
    console.error('Lỗi khi xử lý Gemini API:', error);
    return {
      title: "Bóng Tối Trước Bình Minh",
      story: "Một buổi sáng, máy in văn phòng bất ngờ kêu toáng lên rồi tắt ngúm, để lại đống báo cáo chưa hoàn thành ngay trước deadline. Một nhân viên quyết định ở lại sửa, dù chẳng ai tin cái máy cũ ấy còn cứu được. Đêm đó, tay dính mực, mắt cay xè, họ vẫn mày mò từng nút bấm, không bỏ cuộc. Sáng hôm sau, máy chạy lại, báo cáo kịp nộp, nhưng điều bất ngờ hơn là sếp nhìn thấy nỗ lực ấy. Từ một người chỉ biết cúi đầu làm việc, họ được giao dự án lớn với lời hứa thăng tiến. Không ai ngờ rằng một đêm kiên trì bên cái máy in cũ lại mở ra cánh cửa mới. Cuộc đời chẳng dễ dàng, nhưng chỉ cần bạn không ngừng cố gắng, ánh sáng sẽ đến. Đừng bỏ cuộc, vì bình minh luôn chờ phía trước!"
    };
  }
});