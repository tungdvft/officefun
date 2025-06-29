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

  const checkAuthAndAccess = async () => {
    console.log('Starting checkAuthAndAccess, userStore:', userStore.user, 'isStoreInitialized:', userStore.isStoreInitialized);

    if (!userStore.isStoreInitialized) {
      console.log('Initializing userStore...');
      await userStore.initialize();
    }

    if (!userStore.user) {
      console.log('No user found, redirecting to login');
      return {
        isLoggedIn: false,
        action: () => router.push('/dang-nhap')
      };
    }

    const balanceResponse = await checkTokenBalance();
    console.log('Check token balance response:', balanceResponse);

    if (!balanceResponse.success) {
      console.log('Check token balance failed:', balanceResponse.message);
      errorMessage.value = balanceResponse.message;
      return {
        isLoggedIn: true,
        action: () => {}
      };
    }

    hasSufficientTokens.value = balanceResponse.sufficient;
    if (!balanceResponse.sufficient) {
      console.log('Insufficient tokens:', balanceResponse.message);
      errorMessage.value = balanceResponse.message;
    }

    return {
      isLoggedIn: true,
      action: balanceResponse.sufficient ? () => handleTokenDeduction() : () => {}
    };
  };

  const checkTokenBalance = async () => {
    try {
      console.log('Calling /api/check-token-balance with userId:', userStore.user.id, 'tokenCost:', tokenCost);
      const response = await fetch('/api/check-token-balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userStore.user.id,
          tokenCost
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const result = await response.json();
      console.log('Check token balance result:', result);
      return result;
    } catch (error) {
      console.error('Error in checkTokenBalance:', error);
      return {
        success: false,
        message: 'Lỗi khi kiểm tra số dư token: ' + error.message
      };
    }
  };

  const handleTokenDeduction = async () => {
    isLoading.value = true;
    errorMessage.value = null; // Reset errorMessage
    console.log('Starting handleTokenDeduction with userId:', userStore.user.id, 'tokenCost:', tokenCost, 'description:', description);

    try {
      const response = await fetch('/api/deduct-tokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userStore.user.id,
          tokenCost,
          description
        })
      });

      console.log('Deduct tokens HTTP status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const result = await response.json();
      console.log('Deduct tokens result:', result);

      if (result.success) {
        console.log('Token deduction successful, updating userStore with remainingTokens:', result.remainingTokens);
        try {
          await userStore.updateTokens(result.remainingTokens);
          console.log('userStore updated successfully');
        } catch (error) {
          console.error('Error in userStore.updateTokens:', error);
          throw new Error('Lỗi khi cập nhật số dư token: ' + error.message);
        }
        isContentAccessible.value = true;
        return {
          success: true,
          message: result.message
        };
      } else {
        console.log('Token deduction failed:', result.message);
        errorMessage.value = result.message;
        return {
          success: false,
          message: result.message
        };
      }
    } catch (error) {
      console.error('Error in handleTokenDeduction:', error);
      errorMessage.value = 'Lỗi xử lý giao dịch token: ' + error.message;
      return {
        success: false,
        message: 'Lỗi xử lý giao dịch token: ' + error.message
      };
    } finally {
      isLoading.value = false;
      console.log('handleTokenDeduction completed, isLoading:', isLoading.value, 'errorMessage:', errorMessage.value);
    }
  };

  return {
    isLoading,
    errorMessage,
    isContentAccessible,
    hasSufficientTokens,
    checkAuthAndAccess
  };
}