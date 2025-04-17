<template>
  <button
    @click="handleGoogleLogin"
    class="google-login-button"
    :disabled="loading"
  >
    <svg class="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
      <path fill="none" d="M0 0h48v48H0z"/>
    </svg>
    {{ loading ? 'Đang đăng nhập...' : 'Google' }}
  </button>
</template>

<script>
import { ref } from 'vue';
import { useUserStore } from '~/stores/general';
import { toast } from 'vue3-toastify';

export default {
  setup() {
    const loading = ref(false);
    const config = useRuntimeConfig();
    const userStore = useUserStore();

    // Validate user data before sending to API
    const validateUserData = (user) => {
      console.log('Google userInfo:', user); // Debug Google user info
      return {
        id: String(user.sub || ''), // Ensure ID is a string, fallback to empty
        email: user.email || '',
        displayName: user.name || '',
        birthdate: user.birthdate || null
      };
    };

    // Load Google API script
    const loadGoogleScript = () => {
      return new Promise((resolve, reject) => {
        if (window.google?.accounts?.oauth2) {
          return resolve();
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google API'));
        document.head.appendChild(script);
      });
    };

    // Fetch user info from Google
    const fetchUserInfo = async (accessToken) => {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user info');
      }

      const userInfo = await response.json();
      console.log('Fetched Google userInfo:', userInfo); // Debug Google response
      return userInfo;
    };

    // Process Google login and sync with backend
    const processGoogleLogin = async (userInfo) => {
      const cleanData = validateUserData(userInfo);

      try {
        const response = await $fetch('/api/user/sync', {
          method: 'POST',
          body: cleanData
        });

        console.log('API /api/user/sync response:', response); // Debug API response

        // Validate API response
        if (response && typeof response.success === 'boolean' && response.user) {
          const { success, user } = response;

          if (success && user.id && user.email) {
            // Update user store
            userStore.$patch({
              id: user.id,
              email: user.email,
              fullname: user.displayName || user.name || '',
              isAuthenticated: true
            });

            // Fetch token balance if needed
            await userStore.fetchUserTokens();

            toast.success(`Chào mừng ${user.displayName || user.name || 'bạn'} quay trở lại!`);
            console.log('Redirecting to /xem'); // Debug redirect
            return await navigateTo('/xem'); // Ensure await for redirect
          } else {
            console.error('API response invalid: success or user data missing', response);
            toast.error('Đăng nhập thất bại: Dữ liệu người dùng không hợp lệ');
          }
        } else {
          console.error('Malformed API response:', response);
          toast.error('Đăng nhập thất bại: Phản hồi API không hợp lệ');
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error('Lỗi đăng nhập: ' + (error.message || 'Không xác định'));
      }
    };

    // Handle Google login
    const handleGoogleLogin = async () => {
      if (loading.value) return;

      try {
        loading.value = true;

        await loadGoogleScript();

        const client = google.accounts.oauth2.initTokenClient({
          client_id: config.public.googleClientId || '14260610616-tifcr2fa8031gmkiujk1l096rl8j67n4.apps.googleusercontent.com',
          scope: 'email profile openid',
          callback: async (response) => {
            try {
              if (response.error) {
                throw new Error(response.error);
              }

              const userInfo = await fetchUserInfo(response.access_token);
              await processGoogleLogin(userInfo);
            } catch (error) {
              console.error('Google login error:', error);
              toast.error('Lỗi đăng nhập với Google: ' + (error.message || 'Không xác định'));
            } finally {
              loading.value = false;
            }
          }
        });

        client.requestAccessToken();
      } catch (error) {
        console.error('Initialization error:', error);
        toast.error('Không thể khởi tạo Google API');
        loading.value = false;
      }
    };

    return { loading, handleGoogleLogin };
  }
};
</script>

<style scoped>
.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 10px 16px;
  width: 100%;
  background: white;
  color: #5f6368;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: 
    background-color 0.3s,
    box-shadow 0.3s;
}

.google-login-button:hover {
  background: #f7f8f8;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.google-login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 18px;
  height: 18px;
}
</style>