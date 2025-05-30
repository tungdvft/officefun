export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = useUserStore()
  
  // Nếu chưa khởi tạo thì khởi tạo
  if (!userStore.isAuthenticated) {
    userStore.initialize()
  }

  // Nếu truy cập route yêu cầu auth mà chưa đăng nhập
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return navigateTo('/dang-nhap')
  }

  // Nếu truy cập route login/register khi đã đăng nhập
  if ((to.path === '/dang-nhap' || to.path === '/dang-ky') && userStore.isAuthenticated) {
    return navigateTo('/')
  }
})