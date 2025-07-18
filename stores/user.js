import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(null);
  const isAuthenticated = ref(false);
  const isStoreInitialized = ref(false);

  // Lưu thông tin user vào store và localStorage
  const setUser = (data, tokenData) => {
    if (!data || !data.id || !data.fullname || !data.birthdate) {
      console.error('Dữ liệu không hợp lệ khi lưu user vào store:', { data, tokenData });
      return;
    }

    user.value = {
      id: data.id,
      email: data.email || '',
      fullname: data.fullname,
      birthdate: data.birthdate,
      tokens: data.tokens || 0,
    };
    token.value = tokenData;
    isAuthenticated.value = true;

    if (process.client) {
      try {
        const authData = {
          id: data.id,
          email: data.email || '',
          fullname: data.fullname,
          birthdate: data.birthdate,
          tokens: data.tokens || 0,
          token: tokenData,
        };
        localStorage.setItem('auth', JSON.stringify(authData));
        console.log('Lưu auth vào localStorage:', authData);
      } catch (error) {
        console.error('Lỗi khi lưu vào localStorage:', error);
      }
    }
  };

  // Cập nhật số dư token
  const updateTokens = (newTokens) => {
    if (!user.value) {
      console.error('Cannot update tokens: No user found in userStore');
      throw new Error('No user found in userStore');
    }
    if (typeof newTokens !== 'number' || newTokens < 0) {
      console.error('Invalid newTokens value:', newTokens);
      throw new Error('Invalid token balance');
    }
    console.log('Updating tokens to:', newTokens);
    user.value.tokens = newTokens;

    if (process.client) {
      try {
        const authData = JSON.parse(localStorage.getItem('auth') || '{}');
        authData.tokens = newTokens;
        localStorage.setItem('auth', JSON.stringify(authData));
        console.log('Updated tokens in localStorage:', authData);
      } catch (error) {
        console.error('Lỗi khi cập nhật tokens trong localStorage:', error);
      }
    }
  };

  // Kiểm tra số dư token từ server
  const checkTokenBalance = async (requiredTokens) => {
    if (!user.value) {
      console.error('Cannot check token balance: No user found in userStore');
      return { success: false, message: 'Không tìm thấy người dùng trong store' };
    }
    try {
      console.log('checkTokenBalance: Calling /api/check-token-balance with userId:', user.value.id, 'requiredTokens:', requiredTokens);
      const response = await fetch('/api/check-token-balance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': encodeURIComponent(user.value.email || ''),
        },
        body: JSON.stringify({
          userId: user.value.id,
          tokenCost: requiredTokens,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const result = await response.json();
      console.log('checkTokenBalance: Result:', result);
      if (result.success && typeof result.newBalance === 'number' && result.newBalance >= 0) {
        updateTokens(result.newBalance);
      }
      return result;
    } catch (error) {
      console.error('checkTokenBalance: Error:', error);
      return {
        success: false,
        message: 'Lỗi khi kiểm tra số dư token: ' + error.message,
      };
    }
  };

  // Trừ token từ server
  const deductTokens = async (tokenCost, description) => {
    if (!user.value) {
      console.error('Cannot deduct tokens: No user found in userStore');
      return { success: false, message: 'Không tìm thấy người dùng trong store' };
    }
    if (typeof tokenCost !== 'number' || tokenCost <= 0) {
      console.error('Invalid tokenCost:', tokenCost);
      return { success: false, message: 'Số token cần trừ không hợp lệ' };
    }
    try {
      console.log('deductTokens: Calling /api/deduct-tokens with userId:', user.value.id, 'tokenCost:', tokenCost, 'description:', description);
      const response = await fetch('/api/deduct-tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-username': encodeURIComponent(user.value.email || ''),
        },
        body: JSON.stringify({
          userId: user.value.id,
          tokenCost,
          description,
        }),
      });
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const result = await response.json();
      console.log('deductTokens: Result:', result);
      if (result.success) {
        // Kiểm tra newBalance hợp lệ
        if (typeof result.newBalance === 'number' && result.newBalance >= 0) {
          updateTokens(result.newBalance);
        } else {
          // Nếu API không trả về newBalance hợp lệ, trừ tokenCost trực tiếp
          const newBalance = Math.max(0, user.value.tokens - tokenCost);
          console.warn('API did not return valid newBalance, calculating locally:', { oldBalance: user.value.tokens, tokenCost, newBalance });
          updateTokens(newBalance);
        }
        console.log(`Tokens deducted: ${tokenCost} for ${description}. New balance: ${user.value.tokens}`);
        return { success: true, newBalance: user.value.tokens };
      }
      return result;
    } catch (error) {
      console.error('deductTokens: Error:', error);
      return {
        success: false,
        message: 'Lỗi khi trừ token: ' + error.message,
      };
    }
  };

  // Xóa thông tin user khỏi store và localStorage
  const logout = () => {
    user.value = null;
    token.value = null;
    isAuthenticated.value = false;
    if (process.client) {
      localStorage.removeItem('auth');
      console.log('Đã xóa auth khỏi localStorage');
    }
  };

  // Khởi tạo store từ localStorage
  const initialize = async () => {
    if (process.client && !isStoreInitialized.value) {
      try {
        const authData = localStorage.getItem('auth');
        console.log('Đọc auth từ localStorage:', authData);
        if (authData) {
          const parsedData = JSON.parse(authData);
          if (parsedData.id && parsedData.fullname && parsedData.birthdate) {
            setUser(
              {
                id: parsedData.id,
                email: parsedData.email || '',
                fullname: parsedData.fullname,
                birthdate: parsedData.birthdate,
                tokens: parsedData.tokens || 0,
              },
              parsedData.token
            );
          } else {
            console.error('localStorage.auth thiếu dữ liệu cần thiết:', parsedData);
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('Lỗi khi đọc localStorage:', error);
        logout();
      } finally {
        isStoreInitialized.value = true;
      }
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isStoreInitialized,
    setUser,
    updateTokens,
    checkTokenBalance,
    deductTokens,
    logout,
    initialize,
  };
});