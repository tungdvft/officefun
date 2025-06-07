<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
        <h1 class="text-2xl font-bold text-white">Đăng Nhập Tài Khoản</h1>
        <p class="text-purple-100 mt-1">Vui lòng đăng nhập để sử dụng xem thần số học của bạn</p>
      </div>

      <!-- Form -->
      <div class="p-6 md:p-8">
        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              id="email"
              placeholder="Nhập email của bạn"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              v-model="form.password"
              type="password"
              id="password"
              placeholder="Nhập mật khẩu"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
          </div>

          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input
                id="remember-me"
                v-model="rememberMe"
                type="checkbox"
                class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              >
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">Ghi nhớ đăng nhập</label>
            </div>
            <NuxtLink to="/quen-mat-khau" class="text-sm text-purple-600 hover:text-purple-500">Quên mật khẩu?</NuxtLink>
          </div>

          <button
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-md transition-all flex justify-center items-center"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Đăng Nhập</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          </button>
        </form>

        <!-- Social Login -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Hoặc đăng nhập bằng</span>
            </div>
          </div>

          <div class="mt-6">
            <GoogleLogin />
          </div>
        </div>

        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Chưa có tài khoản?
            <NuxtLink to="/dang-ky" class="text-purple-600 font-medium hover:text-purple-500">Đăng ký ngay</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { toast } from 'vue3-toastify';

const userStore = useUserStore();
const form = ref({
  email: '',
  password: ''
});
const rememberMe = ref(false);
const isLoading = ref(false);

// Khởi tạo store khi component được mount
onMounted(() => {
  if (process.client) {
    userStore.initialize();
  }
});

const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    toast.error('Vui lòng nhập đầy đủ email và mật khẩu', {
      position: 'top-center',
      theme: 'colored'
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
        remember: rememberMe.value
      })
    });

    // Kiểm tra dữ liệu phản hồi
    if (!response.user || !response.user.id || !response.user.fullname || !response.user.birthdate || !response.token) {
      throw new Error('Dữ liệu phản hồi từ API không hợp lệ');
    }

    // Lưu thông tin user vào store
    userStore.setUser(response.user, response.token);

    toast.success('Đăng nhập thành công!', {
      position: 'top-center',
      theme: 'colored'
    });

    // Chuyển hướng nhanh hơn
    setTimeout(() => {
      navigateTo('/xem');
    }, 300);
  } catch (error) {
    let errorMessage = 'Đăng nhập thất bại. Vui lòng nhập đúng email hoặc mật khẩu.';

    // Kiểm tra lỗi từ API và gán thông báo thân thiện
    if (error.response && error.response._data && error.response._data.message) {
      // Nếu API trả về message cụ thể, sử dụng nó (nhưng đảm bảo không chứa thông tin nhạy cảm)
      errorMessage = error.response._data.message.includes('email') || error.response._data.message.includes('password')
        ? 'Email hoặc mật khẩu không đúng'
        : 'Đăng nhập thất bại. Vui lòng nhập đúng email hoặc mật khẩu.';
    } else if (error.status === 401) {
      errorMessage = 'Email hoặc mật khẩu không đúng';
    }

    toast.error(errorMessage, {
      position: 'top-center',
      theme: 'colored'
    });
  } finally {
    isLoading.value = false;
  }
};
</script>
