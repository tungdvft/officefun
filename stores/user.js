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

    // Lưu vào store
    user.value = {
      id: data.id,
      email: data.email || '',
      fullname: data.fullname,
      birthdate: data.birthdate,
      tokens: data.tokens || 0 // Thêm tokens vào user
    };
    token.value = tokenData;
    isAuthenticated.value = true;

    // Lưu vào localStorage
    if (process.client) {
      try {
        const authData = {
          id: data.id,
          email: data.email || '',
          fullname: data.fullname,
          birthdate: data.birthdate,
          tokens: data.tokens || 0,
          token: tokenData
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
    console.log('Updating tokens to:', newTokens);
    user.value.tokens = newTokens;

    // Cập nhật localStorage
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
                tokens: parsedData.tokens || 0 // Khởi tạo tokens từ localStorage
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
    logout,
    initialize
  };
});