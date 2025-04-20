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
          <!-- Email field (moved to top as requested) -->
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
            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-md transition-all"
          >
            Đăng Ký
          </button>
        </form>

        <!-- Social Login -->
        <div class="mt-8">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white text-gray-500">Hoặc đăng ký bằng</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-4">
            <GoogleLogin />
            <button
              class="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <svg class="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
              Facebook
            </button>
          </div>
        </div>

        <!-- Login link -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Đã có tài khoản?
            <router-link to="/dang-nhap" class="text-purple-600 font-medium hover:text-purple-500">Đăng nhập ngay</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const form = ref({
  email: '',
  fullName: '',
  birthdate: '',
  password: '',
  confirmPassword: ''
});

const handleRegister = () => {
  console.log('Register with:', form.value);
  // Thêm logic xử lý đăng ký ở đây
};
</script>