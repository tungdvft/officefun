export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore();
  
  console.log('[Middleware] Current auth status:', userStore.isAuthenticated);
  console.log('[Middleware] Current tokens:', userStore.tokens);
  
  // Nếu đang truy cập trang login mà đã đăng nhập thì chuyển hướng đến /xem
  if (to.path === '/login' && userStore.isAuthenticated) {
    console.log('[Middleware] Đã đăng nhập, redirect từ login sang /xem');
    return navigateTo('/xem');
  }
  
  // Nếu truy cập route yêu cầu auth mà chưa đăng nhập
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    console.log('[Middleware] Chưa đăng nhập, redirect đến login');
    return navigateTo('/login');
  }
  
  // Nếu truy cập route yêu cầu guest (chỉ cho khách) mà đã đăng nhập
  if (to.meta.requiresGuest && userStore.isAuthenticated) {
    console.log('[Middleware] Đã đăng nhập, không được phép vào trang guest');
    return navigateTo('/xem');
  }
});