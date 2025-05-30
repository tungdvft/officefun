import { useUserStore } from '~/stores/userStore';
import { navigateTo } from '#app';

export default defineNuxtRouteMiddleware((to, from) => {
  // Chỉ chạy phía client để tránh lỗi server-side
  if (process.client) {
    const userStore = useUserStore();

    // Đợi store khởi tạo nếu chưa sẵn sàng
    if (!userStore.isStoreInitialized) {
      userStore.initialize();
    }

    // Kiểm tra trạng thái đăng nhập
    if (!userStore.user || Object.keys(userStore.user).length === 0) {
      // Chuyển hướng đến trang đăng nhập
      return navigateTo('/dang-nhap', { redirect: true });
    }
  }
});