<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
        <h1 class="text-2xl font-bold text-white">Tạo Tài Khoản Mới</h1>
        <p class="text-purple-100 mt-1">Bắt đầu hành trình của bạn ngay hôm nay</p>
      </div>

      <!-- Form -->
      <div class="p-6 md:p-8">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Email field -->
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

          <!-- Full name field -->
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700 mb-1">Họ và tên đầy đủ</label>
            <input
              v-model="form.fullName"
              type="text"
              id="fullName"
              placeholder="Nhập họ tên đầy đủ"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
          </div>

          <!-- Birthdate field -->
          <div>
            <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input
              v-model="form.birthdate"
              type="date"
              id="birthdate"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
          </div>

          <!-- Password fields -->
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

          <div>
            <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Xác nhận mật khẩu</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              id="confirm-password"
              placeholder="Nhập lại mật khẩu"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
            >
          </div>

          <!-- Terms checkbox -->
          <div class="flex items-center">
            <input
              id="terms"
              type="checkbox"
              class="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              required
            >
            <label for="terms" class="ml-2 block text-sm text-gray-700">
              Tôi đồng ý với <a href="#" class="text-purple-600 hover:text-purple-500">Điều khoản dịch vụ</a> và <a href="#" class="text-purple-600 hover:text-purple-500">Chính sách bảo mật</a>
            </label>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-md transition-all flex justify-center items-center"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Đăng Ký</span>
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

        <!-- Login link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản?
            <NuxtLink to="/dang-nhap" class="text-purple-600 font-medium hover:text-purple-500">Đăng nhập ngay</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { toast } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';

const form = ref({
  email: '',
  fullName: '',
  birthdate: '',
  password: '',
  confirmPassword: ''
});

const isLoading = ref(false);

const handleRegister = async () => {
  // Validate password match
  if (form.value.password !== form.value.confirmPassword) {
    toast.error('Mật khẩu xác nhận không khớp', {
      position: 'top-center',
      theme: 'colored'
    });
    return;
  }

  isLoading.value = true;

  try {
    const response = await $fetch('/api/users', {
      method: 'POST',
      body: JSON.stringify(form.value)
    });

    toast.success('Đăng ký thành công! Vui lòng đăng nhập', {
      position: 'top-center',
      theme: 'colored'
    });

    // Reset form after successful registration
    form.value = {
      email: '',
      fullName: '',
      birthdate: '',
      password: '',
      confirmPassword: ''
    };

    // Redirect to login page
    await navigateTo('/dang-nhap');
  } catch (error) {
    let errorMessage = 'Đã xảy ra lỗi khi đăng ký';
    
    if (error.data && error.data.message) {
      errorMessage = error.data.message;
    } else if (error.response && error.response._data) {
      errorMessage = error.response._data.message || error.response._data;
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