import { parseISO, format } from 'date-fns';

export const formatDate = (dateInput, outputFormat = 'dd/MM/yyyy') => {
  try {
    let date;
    // Nếu input là chuỗi ISO hoặc định dạng khác, parse nó
    if (typeof dateInput === 'string') {
      // Kiểm tra xem có phải định dạng dd/MM/yyyy không
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateInput)) {
        const [day, month, year] = dateInput.split('/').map(Number);
        date = new Date(year, month - 1, day);
      } else {
        // Giả sử là ISO hoặc định dạng khác
        date = parseISO(dateInput);
      }
    } else if (dateInput instanceof Date) {
      date = dateInput;
    } else {
      throw new Error('Invalid date input');
    }

    // Kiểm tra xem date có hợp lệ không
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    // Định dạng ngày theo outputFormat
    return format(date, outputFormat);
  } catch (error) {
    console.error('Error formatting date:', error.message, 'Input:', dateInput);
    return ''; // Trả về chuỗi rỗng nếu lỗi
  }
};