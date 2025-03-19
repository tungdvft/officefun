export default defineNuxtRouteMiddleware((to, from) => {
  if (process.client) {
    const username = localStorage.getItem('username');
    if (!username && to.path !== '/login' && to.path !== '/register' && to.path !== '/') {
      return navigateTo('/login');
    }
  }
});