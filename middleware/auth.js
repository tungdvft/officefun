export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();

  // Kiểm tra localStorage với key 'auth'
  const authData = localStorage.getItem('auth');
  let isAuthenticated = false;

  if (authData) {
    try {
      const parsedData = JSON.parse(authData);
      // Kiểm tra dữ liệu auth có hợp lệ không (ví dụ: có id, email, hoặc các trường cần thiết)
      if (parsedData && parsedData.id && parsedData.email) {
        isAuthenticated = true;
        // Cập nhật userStore nếu chưa khởi tạo
        if (!userStore.isAuthenticated) {
          userStore.initialize(parsedData);
        }
      }
    } catch (err) {
      console.error('Lỗi khi parse dữ liệu auth từ localStorage:', err);
    }
  }

  // Nếu chưa khởi tạo userStore và không có authData hợp lệ, khởi tạo userStore
  if (!userStore.isAuthenticated && !isAuthenticated) {
    userStore.initialize();
  }

  // Nếu truy cập route yêu cầu auth mà chưa đăng nhập
  if (to.meta.requiresAuth && !isAuthenticated) {
    return navigateTo('/dang-nhap');
  }

  // Nếu truy cập route login/register khi đã đăng nhập
  if ((to.path === '/dang-nhap' || to.path === '/dang-ky') && isAuthenticated) {
    return navigateTo('/');
  }
});