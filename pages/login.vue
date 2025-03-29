<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative">
      <!-- Loading bar -->
      <div
        v-if="loading"
        class="absolute top-0 left-0 h-1 bg-blue-500 animate-loading-bar"
        :style="{ width: loadingProgress + '%' }"
      ></div>

      <!-- Logo -->
      <div class="flex items-center justify-center mb-3">
        <svg class="w-8 h-8 text-blue-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span
          class="text-xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text"
        >
          Offitify
        </span>
      </div>

      <!-- Welcome message -->
      <p class="text-center text-gray-600 mb-6">
        Vui lòng nhập tên đăng nhập để khám phá vô vàn những điều thú vị và bất ngờ với Offitify nhé!
      </p>

      <!-- Form đăng nhập -->
      <form @submit.prevent="submitForm">
        <div class="mb-4">
          <input
            v-model="username"
            type="text"
            placeholder="Username (viết liền, không dấu)"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          :disabled="loading || isSubmitted"
        >
          {{ loading ? 'Đang xử lý...' : 'Đăng nhập' }}
        </button>
      </form>

      <!-- Nút đăng ký -->
      <div class="mt-4 text-center">
        <p class="text-gray-600">Chưa có tài khoản?</p>
        <NuxtLink to="/register" class="text-blue-500 hover:underline">Đăng ký ngay</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const router = useRouter();
const username = ref('');
const loading = ref(false);
const isSubmitted = ref(false);
const loadingProgress = ref(0);

async function submitForm() {
  loading.value = true;
  isSubmitted.value = false;
  loadingProgress.value = 0;

  const progressInterval = setInterval(() => {
    if (loadingProgress.value < 90) {
      loadingProgress.value += 10;
    }
  }, 100);

  try {
    const formattedUsername = username.value.toLowerCase().replace(/\s/g, '');

    const { data: userResponse } = await useFetch('/api/user', {
      method: 'GET',
      query: { username: formattedUsername },
    });


    if (!userResponse.value || userResponse.value.error) {
      toast.error('Username chưa tồn tại. Vui lòng đăng ký trước!', {
        position: 'top-center',
      });
      clearInterval(progressInterval);
      return;
    }

    if (process.client) {
      localStorage.setItem('username', formattedUsername);
      toast.success('Đăng nhập thành công!', {
        position: 'top-center',
      });
      isSubmitted.value = true;
      loadingProgress.value = 100;
      clearInterval(progressInterval);
      setTimeout(() => router.push('/'), 1000);
    }
  } catch (error) {
    console.error('Error during login:', error);
    toast.error('Đã có lỗi xảy ra. Vui lòng thử lại.', {
      position: 'top-center',
    });
    clearInterval(progressInterval);
  } finally {
    loading.value = false;
  }
}

definePageMeta({
  layout: 'auth',
});
</script>

<style scoped>
.animate-loading-bar {
  transition: width 0.3s ease-in-out;
}
</style>