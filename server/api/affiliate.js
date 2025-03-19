// server/api/affiliate.js
export default defineEventHandler(async (event) => {
  // Hard-code tạm thời, sau này mày có thể gọi API từ Amazon/Shopee
  const products = [
    { id: 1, name: 'Tai nghe Bluetooth', price: '500k', link: 'https://your-affiliate-link.com/tai-nghe', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Sổ tay xịn', price: '150k', link: 'https://your-affiliate-link.com/so-tay', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'Cốc giữ nhiệt', price: '200k', link: 'https://your-affiliate-link.com/coc-giu-nhiet', image: 'https://via.placeholder.com/150' },
    { id: 4, name: 'Ghế công thái học', price: '2.5tr', link: 'https://your-affiliate-link.com/ghe-cth', image: 'https://via.placeholder.com/150' },
  ];

  return products;
});