export default defineNuxtRouteMiddleware(async (to, from) => {
    const userStore = useUserStore();
    await userStore.initialize();
    if (to.path === '/' && userStore.isAuthenticated) {
      return navigateTo('/xem');
    }
  });