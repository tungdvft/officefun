<template>
  <ClientOnly>
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
      {{ loading ? 'Đang đăng nhập...' : 'Đăng nhập với Google' }}
    </button>
  </ClientOnly>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRoute, navigateTo } from '#app';
import { toast } from 'vue3-toastify';

const userStore = useUserStore();
const route = useRoute();
const loading = ref(false);

// Dynamic configuration based on environment
const runtimeConfig = useRuntimeConfig();
const googleClientId = runtimeConfig.public.googleClientId || '14260610616-tifcr2fa8031gmkiujk1l096rl8j67n4.apps.googleusercontent.com';
const currentOrigin = process.client ? window.location.origin : '';

const handleGoogleLogin = async () => {
  if (loading.value) return;

  try {
    loading.value = true;

    // Load Google API library if not already loaded
    if (!window.google?.accounts?.oauth2) {
      await new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Failed to load Google API'));
        document.head.appendChild(script);
      });
    }

    // Initialize Google OAuth client with dynamic redirect URI
    const client = google.accounts.oauth2.initTokenClient({
      client_id: googleClientId,
      scope: 'email profile openid',
      redirect_uri: `${currentOrigin}/api/auth/callback/google`,
      callback: async (response) => {
        try {
          if (response.error) {
            throw new Error(`Google OAuth error: ${response.error}`);
          }

          // Fetch user info from Google
          const userInfo = await fetchUserInfo(response.access_token);

          // Send to backend
          const { user, isNewUser, token } = await $fetch('/api/auth/google', {
            method: 'POST',
            body: {
              email: userInfo.email,
              name: userInfo.name,
              picture: userInfo.picture,
              access_token: response.access_token
            }
          });

          // Save user data
          saveUserData({ ...user, token, isAuthenticated: true });

          // Show appropriate message
          toast.success(isNewUser
            ? 'Tài khoản mới đã được tạo! Vui lòng hoàn thiện thông tin'
            : `Chào mừng ${user.fullname || userInfo.name} quay trở lại!`, {
            position: 'top-center',
            theme: 'colored'
          });

          // Redirect based on profile completion
          if (user.fullname && user.birthdate) {
            const redirect = route.query.redirect && typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
              ? route.query.redirect
              : '/xem';
            await navigateTo(redirect);
          } else {
            await navigateTo('/hoan-thanh');
          }
        } catch (error) {
          console.error('Google login error:', error);
          toast.error(error.message || 'Đăng nhập Google thất bại', {
            position: 'top-center',
            theme: 'colored'
          });
        } finally {
          loading.value = false;
        }
      }
    });

    // Request access token
    client.requestAccessToken();
  } catch (error) {
    console.error('Error initializing Google Sign-In:', error);
    toast.error('Không thể khởi tạo Google Sign-In', {
      position: 'top-center',
      theme: 'colored'
    });
    loading.value = false;
  }
};

const fetchUserInfo = async (accessToken) => {
  try {
    const response = await $fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    return response;
  } catch (error) {
    throw new Error(`Không thể lấy thông tin người dùng từ Google: ${error.message}`);
  }
};

const saveUserData = (userData) => {
  userStore.setUser(userData);
  localStorage.setItem('auth', JSON.stringify({
    id: userData.id,
    email: userData.email,
    fullname: userData.fullname,
    birthdate: userData.birthdate,
    avatar: userData.avatar,
    token: userData.token,
    isAuthenticated: true,
    lastLogin: new Date().toISOString()
  }));
};
</script>

<style scoped>
.google-login-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 12px 20px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background: white;
  color: #5f6368;
  border: 1px solid #dadce0;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: 
    background-color 0.3s,
    box-shadow 0.3s;
}

.google-login-button:hover {
  background: #f7f8f8;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.google-login-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google-icon {
  width: 20px;
  height: 20px;
}
</style>
