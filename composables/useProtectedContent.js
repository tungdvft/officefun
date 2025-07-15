import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useTokenStore } from '~/stores/token';

export function useProtectedContent(tokenCost, description) {
  const isLoading = ref(false);
  const errorMessage = ref('');
  const errorType = ref('');
  const isContentAccessible = ref(false);
  const hasSufficientTokens = ref(true);

  const router = useRouter();
  const tokenStore = useTokenStore();

  const checkAuthAndAccess = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    errorType.value = '';
    isContentAccessible.value = false;

    try {
      await tokenStore.initialize();

      if (!tokenStore.isLoggedIn) {
        errorMessage.value = 'Vui lòng Đăng Nhập để sử dụng tính năng này.';
        errorType.value = 'login';
        hasSufficientTokens.value = false;
        return { isLoggedIn: false, action: () => router.push('/dang-nhap') };
      }

      if (tokenStore.tokenBalance < tokenCost) {
        errorMessage.value = 'Không đủ token cho tính năng này. Hãy Nạp thêm token để trải nghiệm đầy đủ tính năng nhé!';
        errorType.value = 'topup';
        hasSufficientTokens.value = false;
        return { isLoggedIn: true, action: () => router.push('/nap-token') };
      }

      const success = tokenStore.deductTokens(tokenCost);
      if (success) {
        isContentAccessible.value = true;
        console.log(`Access granted for ${description}. Tokens deducted: ${tokenCost}`);
      } else {
        errorMessage.value = 'Không đủ token cho tính năng này. Hãy Nạp thêm token để trải nghiệm đầy đủ tính năng nhé!';
        errorType.value = 'topup';
        hasSufficientTokens.value = false;
        return { isLoggedIn: true, action: () => router.push('/nap-token') };
      }

      return { isLoggedIn: true, action: () => {} };
    } catch (error) {
      console.error('Error in checkAuthAndAccess:', error);
      errorMessage.value = 'Lỗi khi kiểm tra số dư token. Vui lòng thử lại!';
      errorType.value = 'generic';
      hasSufficientTokens.value = false;
      return { isLoggedIn: tokenStore.isLoggedIn, action: () => {} };
    } finally {
      isLoading.value = false;
    }
  };

  const errorAction = () => {
    if (errorType.value === 'login') {
      router.push('/dang-nhap');
    } else if (errorType.value === 'topup') {
      router.push('/nap-token');
    }
  };

  return {
    isLoading,
    errorMessage,
    errorType,
    isContentAccessible,
    hasSufficientTokens,
    checkAuthAndAccess,
    errorAction,
  };
}