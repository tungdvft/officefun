import { ref } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

export function useProtectedContent(tokenCost = 1, description = 'Deducted for content access') {
  const userStore = useUserStore();
  const router = useRouter();
  const isLoading = ref(false);
  const errorMessage = ref(null);
  const isContentAccessible = ref(false);
  const hasSufficientTokens = ref(null);
  const errorAction = ref(() => {});

  const checkAuthAndAccess = async (customTokenCost = tokenCost, customDescription = description) => {
    console.log('checkAuthAndAccess: Starting with customTokenCost:', customTokenCost, 'customDescription:', customDescription, 'userStore:', userStore.user, 'isStoreInitialized:', userStore.isStoreInitialized);

    if (!userStore.isStoreInitialized) {
      console.log('checkAuthAndAccess: Initializing userStore...');
      await userStore.initialize();
    }

    if (!userStore.user) {
      console.log('checkAuthAndAccess: No user found, redirecting to login');
      errorMessage.value = 'Vui lòng đăng nhập để sử dụng tính năng này.';
      errorAction.value = () => router.push('/dang-nhap');
      return {
        isLoggedIn: false,
        action: () => router.push('/dang-nhap')
      };
    }

    console.log('checkAuthAndAccess: Checking token balance with customTokenCost:', customTokenCost);
    const balanceResponse = await checkTokenBalance(customTokenCost);
    console.log('checkAuthAndAccess: Check token balance response:', balanceResponse);

    if (!balanceResponse.success) {
      console.log('checkAuthAndAccess: Check token balance failed:', balanceResponse.message);
      errorMessage.value = 'Lỗi khi kiểm tra số dư token. Vui lòng thử lại!';
      errorAction.value = () => {};
      return {
        isLoggedIn: true,
        action: () => {}
      };
    }

    hasSufficientTokens.value = balanceResponse.sufficient;
    if (!balanceResponse.sufficient) {
      console.log('checkAuthAndAccess: Insufficient tokens');
      errorMessage.value = 'Không đủ token cho tính năng này. Hãy nạp thêm token để trải nghiệm full tính năng nhé!';
      errorAction.value = () => router.push('/nap-token');
      return {
        isLoggedIn: true,
        action: () => router.push('/nap-token')
      };
    }

    console.log('checkAuthAndAccess: Sufficient tokens, returning action for deduction with customTokenCost:', customTokenCost);
    return {
      isLoggedIn: true,
      action: () => handleTokenDeduction(customTokenCost, customDescription)
    };
  };

  const checkTokenBalance = async (requiredTokens) => {
    try {
      console.log('checkTokenBalance: Calling /api/check-token-balance with userId:', userStore.user.id, 'requiredTokens:', requiredTokens);
      const response = await fetch('/api/check-token-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': encodeURIComponent(userStore.user.email)
        },
        body: JSON.stringify({
          userId: userStore.user.id,
          tokenCost: requiredTokens
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const result = await response.json();
      console.log('checkTokenBalance: Result:', result);
      return result;
    } catch (error) {
      console.error('checkTokenBalance: Error:', error);
      return {
        success: false,
        message: 'Lỗi khi kiểm tra số dư token: ' + error.message
      };
    }
  };

  const handleTokenDeduction = async (deductionTokenCost, deductionDescription) => {
    isLoading.value = true;
    errorMessage.value = null;
    errorAction.value = () => {};
    console.log('handleTokenDeduction: Starting with userId:', userStore.user.id, 'deductionTokenCost:', deductionTokenCost, 'deductionDescription:', deductionDescription);

    try {
      console.log('handleTokenDeduction: Sending request to /api/deduct-tokens with body:', JSON.stringify({
        userId: userStore.user.id,
        tokenCost: deductionTokenCost,
        description: deductionDescription
      }));
      const response = await fetch('/api/deduct-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': encodeURIComponent(userStore.user.email)
        },
        body: JSON.stringify({
          userId: userStore.user.id,
          tokenCost: deductionTokenCost,
          description: deductionDescription
        })
      });

      console.log('handleTokenDeduction: Deduct tokens HTTP status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      console.log('handleTokenDeduction: Deduct tokens result:', result);

      if (result.success) {
        console.log('handleTokenDeduction: Token deduction successful, updating userStore with remainingTokens:', result.remainingTokens);
        try {
          await userStore.updateTokens(result.remainingTokens);
          console.log('handleTokenDeduction: userStore updated successfully');
        } catch (error) {
          console.error('handleTokenDeduction: Error in userStore.updateTokens:', error);
          throw new Error('Lỗi khi cập nhật số dư token: ' + error.message);
        }
        isContentAccessible.value = true;
        return {
          success: true,
          message: result.message
        };
      } else {
        console.log('handleTokenDeduction: Token deduction failed:', result.message);
        errorMessage.value = 'Không đủ token cho tính năng này. Hãy nạp thêm token để trải nghiệm full tính năng nhé!';
        errorAction.value = () => router.push('/nap-token');
        return {
          success: false,
          message: errorMessage.value
        };
      }
    } catch (error) {
      console.error('handleTokenDeduction: Error:', error);
      errorMessage.value = 'Lỗi xử lý giao dịch token: ' + error.message;
      errorAction.value = () => router.push('/nap-token');
      return {
        success: false,
        message: errorMessage.value
      };
    } finally {
      isLoading.value = false;
      console.log('handleTokenDeduction: Completed, isLoading:', isLoading.value, 'errorMessage:', errorMessage.value);
    }
  };

  return {
    isLoading,
    errorMessage,
    isContentAccessible,
    hasSufficientTokens,
    checkAuthAndAccess,
    errorAction
  };
}