import { ref } from 'vue';
import { toast } from 'vue3-toastify';

export function useToken() {
  const tokens = ref(null); // Số dư token của user
  const isLoading = ref(false); // Trạng thái loading
  const error = ref(null); // Lưu trữ lỗi

  /**
   * Lấy số dư token của người dùng từ API /api/check-token-balance
   * @param {number} userId - ID của người dùng
   * @returns {Promise<number>} Số dư token
   */
//   async function fetchTokenBalance(userId) {
//     if (!userId) {
//       error.value = 'Thiếu userId';
//       toast.error(error.value);
//       return null;
//     }

//     isLoading.value = true;
//     error.value = null;

//     try {
//       const response = await $fetch('/api/check-token-balance', {
//         method: 'POST',
//         body: { userId },
//       });

//       tokens.value = response.tokens;
//       return response.tokens;
//     } catch (err) {
//       error.value = err.data?.statusMessage || 'Lỗi khi lấy số dư token';
//       toast.error(error.value);
//       return null;
//     } finally {
//       isLoading.value = false;
//     }
//   }

  /**
   * Trừ token của người dùng
   * @param {number} userId - ID của người dùng
   * @param {number} [amount=10] - Số token cần trừ (mặc định 10)
   * @param {string} [description] - Mô tả giao dịch
   * @returns {Promise<object>} Kết quả từ API
   */
  async function deductTokens(userId, amount = 10, description) {
    if (!userId) {
      error.value = 'Thiếu userId';
      toast.error(error.value);
      throw new Error(error.value);
    }

    if (!Number.isInteger(amount) || amount <= 0) {
      error.value = 'Số token không hợp lệ';
      toast.error(error.value);
      throw new Error(error.value);
    }

    isLoading.value = true;
    error.value = null;

    try {
      const response = await $fetch('/api/deduct-token', {
        method: 'POST',
        body: {
          userId,
          amount,
          description,
        },
      });

      // Cập nhật số dư token
      tokens.value = response.remainingTokens;

      return response;
    } catch (err) {
      error.value = err.data?.statusMessage || 'Lỗi khi trừ token';
    
      throw err;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    tokens,
    isLoading,
    error,
    // fetchTokenBalance,
    deductTokens,
  };
}