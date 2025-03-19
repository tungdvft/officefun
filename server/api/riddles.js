// server/api/riddles.js
import { defineEventHandler } from 'h3';

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export default defineEventHandler(() => {
  const riddles = [
    { "icons": ["🕒", "📧", "🤐"], "answer": "Chờ email muộn", "options": ["Họp trễ giờ", "Gửi tin nhắn", "Chờ email muộn", "Đợi sếp duyệt"] },
    { "icons": ["📊", "🔍", "😓"], "answer": "Soi lỗi báo cáo", "options": ["Kiểm tra email", "Soi lỗi báo cáo", "Làm số liệu mới", "Chuẩn bị họp"] },
    { "icons": ["💻", "🚫", "🔧"], "answer": "Máy tính bị khóa", "options": ["Mạng bị chậm", "Máy tính bị khóa", "Họp đột xuất", "Phần mềm lỗi"] },
    { "icons": ["📅", "🔄", "😵"], "answer": "Lịch họp chồng chéo", "options": ["Deadline thay đổi", "Lịch họp chồng chéo", "Ngày lương trễ", "Nghỉ phép hủy"] },
    { "icons": ["🖨️", "📜", "🚨"], "answer": "Máy in kẹt giấy", "options": ["Họp khẩn cấp", "Gửi báo cáo", "Máy in kẹt giấy", "Máy tính treo"] },
    { "icons": ["📡", "📉", "😞"], "answer": "Wifi yếu giữa họp", "options": ["Mất điện đột ngột", "Wifi yếu giữa họp", "Họp bị hoãn", "Sếp gọi gấp"] },
    { "icons": ["📝", "✂️", "🤔"], "answer": "Cắt giảm nội dung", "options": ["Sửa báo cáo", "Thêm ý tưởng", "Cắt giảm nội dung", "Chuẩn bị họp"] },
    { "icons": ["💡", "🚫", "😑"], "answer": "Ý tưởng bị từ chối", "options": ["Họp bị hủy", "Ý tưởng bị từ chối", "Email bị lỗi", "Deadline kéo dài"] },
    { "icons": ["📞", "🔇", "😬"], "answer": "Quên bật mic", "options": ["Họp trễ giờ", "Gửi tin nhắn", "Quên bật mic", "Máy tính hỏng"] },
    { "icons": ["📂", "🔒", "😤"], "answer": "File bị khóa quyền", "options": ["Email bị spam", "Họp bị gián đoạn", "File bị khóa quyền", "Mạng bị ngắt"] },
    { "icons": ["🖥️", "🌩️", "💥"], "answer": "Máy tính crash", "options": ["Họp online lag", "Deadline sát nút", "Máy tính crash", "Wifi mất"] },
    { "icons": ["📅", "❓", "😕"], "answer": "Họp không rõ mục tiêu", "options": ["Deadline bất ngờ", "Nghỉ phép đột xuất", "Họp không rõ mục tiêu", "Email quan trọng"] },
    { "icons": ["📧", "🔄", "🤨"], "answer": "Email vòng vo", "options": ["Họp kéo dài", "Gửi báo cáo", "Email vòng vo", "Sếp phê duyệt"] },
    { "icons": ["🖌️", "📑", "🚫"], "answer": "Sửa báo cáo bị hủy", "options": ["Ý tưởng được duyệt", "Sửa báo cáo bị hủy", "Họp bị hoãn", "Deadline thay đổi"] },
    { "icons": ["📈", "⏳", "😰"], "answer": "Chờ số liệu cuối giờ", "options": ["Họp trễ giờ", "Gửi email gấp", "Chờ số liệu cuối giờ", "Nghỉ giữa ca"] },
    { "icons": ["📞", "🌐", "😖"], "answer": "Gọi họp online lỗi", "options": ["Wifi chập chờn", "Gọi họp online lỗi", "Họp trực tiếp", "Máy in hỏng"] },
    { "icons": ["💼", "🏃", "⏰"], "answer": "Chạy deadline muộn", "options": ["Họp sáng sớm", "Chạy deadline muộn", "Gửi tin nhắn", "Nghỉ phép gấp"] },
    { "icons": ["📋", "🔍", "🤯"], "answer": "Tìm lỗi hợp đồng", "options": ["Sửa báo cáo", "Tìm lỗi hợp đồng", "Họp nhóm", "Chuẩn bị email"] },
    { "icons": ["🖥️", "📡", "🕸️"], "answer": "Mạng nội bộ chậm", "options": ["Họp online lag", "Máy tính lỗi", "Mạng nội bộ chậm", "Email bị trễ"] },
    { "icons": ["📅", "🚫", "😣"], "answer": "Hủy họp phút chót", "options": ["Deadline bị lùi", "Hủy họp phút chót", "Email bị lỗi", "Nghỉ phép bất ngờ"] },
    { "icons": ["📧", "📎", "❌"], "answer": "Quên đính kèm file", "options": ["Họp trễ giờ", "Quên đính kèm file", "Gửi tin nhắn", "Sếp gọi gấp"] },
    { "icons": ["🖨️", "🔋", "😓"], "answer": "Máy in hết pin", "options": ["Máy tính hết pin", "Máy in hết pin", "Họp bị hoãn", "Wifi yếu"] },
    { "icons": ["📊", "📉", "🔧"], "answer": "Sửa lỗi biểu đồ", "options": ["Họp báo cáo", "Sửa lỗi biểu đồ", "Gửi email", "Chuẩn bị họp"] },
    { "icons": ["💻", "🔊", "😬"], "answer": "Loa họp bị rè", "options": ["Mic bị hỏng", "Loa họp bị rè", "Họp online lag", "Máy tính treo"] },
    { "icons": ["📝", "📅", "🚨"], "answer": "Quên ghi lịch họp", "options": ["Deadline sát nút", "Quên ghi lịch họp", "Email bị spam", "Nghỉ phép"] },
    { "icons": ["📡", "📞", "🤐"], "answer": "Đường truyền gián đoạn", "options": ["Họp bị hủy", "Gửi báo cáo", "Đường truyền gián đoạn", "Sếp phê duyệt"] },
    { "icons": ["💡", "📋", "⏳"], "answer": "Chờ duyệt ý tưởng", "options": ["Họp sáng sớm", "Gửi email", "Chờ duyệt ý tưởng", "Nộp báo cáo"] },
    { "icons": ["📧", "🔍", "😵"], "answer": "Tìm email cũ", "options": ["Họp nhóm", "Tìm email cũ", "Sửa báo cáo", "Chuẩn bị họp"] },
    { "icons": ["🖥️", "🔥", "😱"], "answer": "Máy tính quá nóng", "options": ["Họp online lag", "Máy tính quá nóng", "Deadline gấp", "Wifi mất"] },
    { "icons": ["📅", "🔇", "🤔"], "answer": "Họp im lặng lạ thường", "options": ["Deadline bị hủy", "Họp im lặng lạ thường", "Email quan trọng", "Nghỉ phép"] },
    { "icons": ["📞", "📝", "🚫"], "answer": "Quên ghi chú cuộc gọi", "options": ["Họp trễ giờ", "Gửi tin nhắn", "Quên ghi chú cuộc gọi", "Sếp phê duyệt"] },
    { "icons": ["📂", "🌐", "😤"], "answer": "Server file lỗi", "options": ["Họp bị gián đoạn", "Server file lỗi", "Email bị spam", "Mạng chậm"] },
    { "icons": ["🖨️", "📄", "🤨"], "answer": "In nhầm tài liệu", "options": ["Họp sáng sớm", "In nhầm tài liệu", "Gửi email", "Sửa báo cáo"] },
    { "icons": ["💻", "📅", "😴"], "answer": "Ngáp khi code", "options": ["Họp kéo dài", "Ngáp khi code", "Deadline sát nút", "Nghỉ giữa giờ"] },
    { "icons": ["📧", "📅", "🚨"], "answer": "Email nhắc họp gấp", "options": ["Họp bị hủy", "Email nhắc họp gấp", "Gửi báo cáo", "Sếp gọi gấp"] },
    { "icons": ["📊", "🔄", "😕"], "answer": "Số liệu bị đảo lộn", "options": ["Họp sáng sớm", "Số liệu bị đảo lộn", "Email bị lỗi", "Nộp báo cáo"] },
    { "icons": ["💡", "📞", "🤐"], "answer": "Ý tưởng bị ngắt lời", "options": ["Họp trễ giờ", "Gửi tin nhắn", "Ý tưởng bị ngắt lời", "Sếp phê duyệt"] },
    { "icons": ["📝", "📡", "😓"], "answer": "Mất kết nối khi ghi chú", "options": ["Họp bị hoãn", "Mất kết nối khi ghi chú", "Email bị spam", "Máy tính treo"] },
    { "icons": ["🖥️", "📉", "🚫"], "answer": "Phần mềm bị lỗi", "options": ["Họp online lag", "Phần mềm bị lỗi", "Deadline bị lùi", "Wifi yếu"] },
    { "icons": ["📅", "📞", "🤯"], "answer": "Cuộc gọi chồng lịch họp", "options": ["Họp sáng sớm", "Cuộc gọi chồng lịch họp", "Gửi email", "Nghỉ phép"] },
    { "icons": ["📧", "📜", "😖"], "answer": "Email dài lê thê", "options": ["Họp kéo dài", "Gửi báo cáo", "Email dài lê thê", "Sếp phê duyệt"] },
    { "icons": ["💼", "📅", "🚫"], "answer": "Hủy công tác phút chót", "options": ["Deadline bị hủy", "Hủy công tác phút chót", "Email bị lỗi", "Nghỉ phép"] },
    { "icons": ["📝", "🔍", "⏳"], "answer": "Kiểm tra biên bản họp", "options": ["Họp sáng sớm", "Kiểm tra biên bản họp", "Gửi email", "Nộp báo cáo"] },
    { "icons": ["💻", "📞", "😵"], "answer": "Họp online bị ngắt", "options": ["Họp online bị ngắt", "Deadline sát nút", "Email bị spam", "Máy tính treo"] },
    { "icons": ["📊", "📅", "🚫"], "answer": "Hủy báo cáo phút chót", "options": ["Hủy báo cáo phút chót", "Họp sáng sớm", "Gửi email", "Nghỉ phép"] },
    { "icons": ["📧", "📡", "😤"], "answer": "Email bị delay", "options": ["Họp bị gián đoạn", "Email bị delay", "Máy tính lỗi", "Mạng chậm"] },
    { "icons": ["🖥️", "📝", "🤔"], "answer": "Tìm file trình chiếu", "options": ["Họp sáng sớm", "Tìm file trình chiếu", "Gửi email", "Sửa báo cáo"] },
    { "icons": ["📅", "💤", "😴"], "answer": "Họp chiều buồn ngủ", "options": ["Họp chiều buồn ngủ", "Deadline sát nút", "Email bị spam", "Nghỉ giữa giờ"] },
    { "icons": ["📞", "📅", "🚨"], "answer": "Cuộc gọi khẩn giữa họp", "options": ["Họp bị hủy", "Cuộc gọi khẩn giữa họp", "Gửi báo cáo", "Sếp gọi gấp"] },
    { "icons": ["📊", "🔍", "😕"], "answer": "Số liệu không khớp", "options": ["Họp sáng sớm", "Số liệu không khớp", "Email bị lỗi", "Nộp báo cáo"] },
    { "icons": ["💡", "📝", "🤐"], "answer": "Ý tưởng không ai hiểu", "options": ["Họp trễ giờ", "Gửi tin nhắn", "Ý tưởng không ai hiểu", "Sếp phê duyệt"] },
    { "icons": ["📝", "📞", "😓"], "answer": "Ghi chú giữa cuộc gọi", "options": ["Họp bị hoãn", "Ghi chú giữa cuộc gọi", "Email bị spam", "Máy tính treo"] },
    { "icons": ["🖥️", "📡", "🚫"], "answer": "Mất mạng giữa họp", "options": ["Họp online lag", "Mất mạng giữa họp", "Deadline bị lùi", "Wifi yếu"] },
    { "icons": ["📅", "📝", "🤯"], "answer": "Quá tải lịch họp", "options": ["Họp sáng sớm", "Quá tải lịch họp", "Gửi email", "Nghỉ phép"] },
    { "icons": ["📧", "📅", "😖"], "answer": "Email họp trùng giờ", "options": ["Họp kéo dài", "Gửi báo cáo", "Email họp trùng giờ", "Sếp phê duyệt"] },
    { "icons": ["💼", "📞", "🚫"], "answer": "Khách hàng hủy hẹn", "options": ["Deadline bị hủy", "Khách hàng hủy hẹn", "Email bị lỗi", "Nghỉ phép"] },
    { "icons": ["📝", "📡", "⏳"], "answer": "Chờ mạng để gửi báo cáo", "options": ["Họp sáng sớm", "Chờ mạng để gửi báo cáo", "Gửi email", "Nộp báo cáo"] },
    { "icons": ["💻", "📅", "😵"], "answer": "Code bị lỗi trước họp", "options": ["Code bị lỗi trước họp", "Deadline sát nút", "Email bị spam", "Máy tính treo"] },
    { "icons": ["📊", "📅", "😴"], "answer": "Báo cáo dài buồn ngủ", "options": ["Báo cáo dài buồn ngủ", "Họp sáng sớm", "Gửi email", "Nghỉ phép"] }
  ];

  // Xáo trộn thứ tự options cho mỗi câu
  return riddles.map(riddle => ({
    ...riddle,
    options: shuffleArray([...riddle.options])
  }));
});