
export default defineNuxtRouteMiddleware((to, from) => {
  // Chỉ chạy ở phía client
  if (!process.client) return;

  // Kiểm tra localStorage với key 'auth'
  const authData = localStorage.getItem('auth');
  let isAuthenticated = false;

  if (authData) {
    try {
      const parsedData = JSON.parse(authData);
      // Kiểm tra parsedData là object và không rỗng
      if (parsedData && typeof parsedData === 'object' && Object.keys(parsedData).length > 0) {
        isAuthenticated = true;
      }
    } catch (err) {
      console.error('Lỗi khi parse dữ liệu auth từ localStorage:', err);
    }
  }

  // Nếu không đăng nhập, chuyển hướng về trang đăng nhập với redirect query
  if (!isAuthenticated) {
    return navigateTo({
      path: '/dang-nhap',
      query: { redirect: to.fullPath },
    });
  }
});