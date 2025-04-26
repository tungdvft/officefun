<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
        <h1 class="text-2xl font-bold text-white">Đăng Nhập Tài Khoản</h1>
        <p class="text-purple-100 mt-1">Chào mừng bạn quay trở lại</p>
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
import { useUserStore } from '~/stores/user'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const userStore = useUserStore()
const form = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const isLoading = ref(false)

// Khởi tạo store khi component được tạo


const handleLogin = async () => {
  if (!form.value.email || !form.value.password) {
    toast.error('Vui lòng nhập đầy đủ email và mật khẩu', {
      position: 'top-center',
      theme: 'colored'
    })
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: form.value.email,
        password: form.value.password,
        remember: rememberMe.value
      })
    })

    // Lưu thông tin user vào store
    userStore.setUser(response.user, response.token)

    toast.success('Đăng nhập thành công!', {
      position: 'top-center',
      theme: 'colored'
    })

    // Chuyển hướng sau 1 giây
    setTimeout(() => {
      navigateTo('/xem')
    }, 1000)
  } catch (error) {
    let errorMessage = 'Đăng nhập thất bại. Vui lòng thử lại'
    
    if (error.response && error.response._data) {
      errorMessage = error.response._data.message || errorMessage
    }

    toast.error(errorMessage, {
      position: 'top-center',
      theme: 'colored'
    })
  } finally {
    isLoading.value = false
  }
}
</script>