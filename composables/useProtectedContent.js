import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';

export function useProtectedContent(tokenCost, description) {
  const userStore = useUserStore();
  const router = useRouter();
  const isLoading = ref(false);
  const errorMessage = ref('');
  const errorType = ref('');
  const isContentAccessible = ref(false);

  // Kiểm tra số dư token đủ để truy cập nội dung
  const hasSufficientTokens = computed(() => userStore.user?.tokens >= tokenCost);

  // Kiểm tra quyền truy cập (chỉ kiểm tra, không trừ token, không đặt isContentAccessible)
  const checkAuthAndAccess = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    errorType.value = '';

    try {
      await userStore.initialize();

      if (!userStore.isAuthenticated) {
        errorMessage.value = 'Vui lòng Đăng Nhập để sử dụng tính năng này.';
        errorType.value = 'login';
        return { isLoggedIn: false, action: () => router.push('/dang-nhap') };
      }

      const tokenCheck = await userStore.checkTokenBalance(tokenCost);
      if (!tokenCheck.success) {
        errorMessage.value = tokenCheck.message || 'Không đủ token cho tính năng này. Hãy Nạp thêm token!';
        errorType.value = 'topup';
        return { isLoggedIn: true, action: () => router.push('/nap-token') };
      }

      // Không đặt isContentAccessible ở đây, chờ performAction
      return { isLoggedIn: true, action: () => {} };
    } catch (error) {
      console.error('Error in checkAuthAndAccess:', error);
      errorMessage.value = 'Lỗi khi kiểm tra quyền truy cập. Vui lòng thử lại!';
      errorType.value = 'generic';
      return { isLoggedIn: userStore.isAuthenticated, action: () => {} };
    } finally {
      isLoading.value = false;
    }
  };

  // Thực hiện hành động trừ token và đặt isContentAccessible
  const performAction = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    errorType.value = '';

    try {
      if (!userStore.isAuthenticated) {
        errorMessage.value = 'Vui lòng Đăng Nhập để sử dụng tính năng này.';
        errorType.value = 'login';
        return { isLoggedIn: false, action: () => router.push('/dang-nhap') };
      }

      const deductResult = await userStore.deductTokens(tokenCost, description);
      if (!deductResult.success) {
        errorMessage.value = deductResult.message || 'Không đủ token để thực hiện hành động. Hãy Nạp thêm token!';
        errorType.value = 'topup';
        return { isLoggedIn: true, action: () => router.push('/nap-token') };
      }

      // Chỉ đặt isContentAccessible thành true sau khi trừ token thành công
      isContentAccessible.value = true;
      console.log(`Action performed for ${description}. Tokens deducted: ${tokenCost}, New balance: ${userStore.user.tokens}`);
      return { isLoggedIn: true, action: () => {} };
    } catch (error) {
      console.error('Error in performAction:', error);
      errorMessage.value = 'Lỗi khi thực hiện hành động. Vui lòng thử lại!';
      errorType.value = 'generic';
      return { isLoggedIn: userStore.isAuthenticated, action: () => {} };
    } finally {
      isLoading.value = false;
    }
  };

  // Xử lý hành động khi có lỗi
  const errorAction = () => {
    if (errorType.value === 'login') {
      router.push('/dang-nhap');
    } else if (errorType.value === 'topup') {
      router.push('/nap-token');
    }
  };
  const navigateToTopup = () => {
    console.log('Navigating to /nap-token');
    router.push('/nap-token');
  };
  
  return {
    isLoading,
    errorMessage,
    errorType,
    isContentAccessible,
    hasSufficientTokens,
    checkAuthAndAccess,
    performAction,
    errorAction,
    navigateToTopup
  };
}