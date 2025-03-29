<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative">
      <!-- Loading bar -->
      <div
        v-if="loading"
        class="absolute top-0 left-0 h-1 bg-blue-500 animate-loading-bar"
        :style="{ width: loadingProgress + '%' }"
      ></div>
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
      <h1 class="text-2xl font-bold text-center text-gray-800 mb-6">Đăng ký tài khoản</h1>

      <!-- Form đăng ký -->
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="username" class="block text-gray-700 mb-2">Username (viết liền, không dấu)</label>
          <input
            v-model="username"
            type="text"
            id="username"
            placeholder="VD: nguyenvan"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': usernameError }"
            required
            @input="validateUsername"
          />
          <p v-if="usernameError" class="text-red-500 text-sm mt-1">{{ usernameError }}</p>
        </div>
        <div class="mb-4">
          <label for="birthdate" class="block text-gray-700 mb-2">Ngày sinh</label>
          <input
            v-model="birthdate"
            type="text"
            id="birthdate"
            placeholder="Nhập đúng định dạng DD-MM-YYYY (VD: 01-01-1990)"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': birthdateError }"
            required
            @input="validateBirthdate"
          />
          <p v-if="birthdateError" class="text-red-500 text-sm mt-1">{{ birthdateError }}</p>
        </div>
        <div class="mb-4">
          <label for="gender" class="block text-gray-700 mb-2">Giới tính</label>
          <select
            v-model="gender"
            id="gender"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Chọn giới tính</option>
            <option value="Male">Nam</option>
            <option value="Female">Nữ</option>
            <option value="Other">Khác</option>
          </select>
        </div>
        
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          :disabled="loading || isSubmitted"
        >
          {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
        </button>

        <!-- Thông báo lỗi chung -->
        <p v-if="formError" class="text-red-500 text-sm mt-4 text-center">{{ formError }}</p>
      </form>

      <div class="mt-4 text-center">
        <p class="text-gray-600">Đã có tài khoản?</p>
        <NuxtLink to="/login" class="text-blue-500 hover:underline">Đăng nhập ngay</NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

const username = ref('');
const birthdate = ref('');
const gender = ref('');
const loading = ref(false);
const isSubmitted = ref(false);
const loadingProgress = ref(0);
const usernameError = ref('');
const birthdateError = ref('');
const formError = ref(''); // Thêm biến để lưu lỗi chung

// Validate username: chỉ chứa chữ cái và số, không dấu, không khoảng trắng
function validateUsername() {
  const usernamePattern = /^[a-z0-9]+$/;
  if (!username.value) {
    usernameError.value = 'Username không được để trống.';
  } else if (!usernamePattern.test(username.value)) {
    usernameError.value = 'Username chỉ được chứa chữ cái thường và số, không dấu, không khoảng trắng.';
  } else {
    usernameError.value = '';
  }
}

// Validate birthdate: phải đúng định dạng DD-MM-YYYY, ngày hợp lệ, không trong tương lai
function validateBirthdate() {
  const birthdatePattern = /^\d{2}-\d{2}-\d{4}$/;
  if (!birthdate.value) {
    birthdateError.value = 'Ngày sinh không được để trống.';
    return;
  }

  if (!birthdatePattern.test(birthdate.value)) {
    birthdateError.value = 'Ngày sinh phải đúng định dạng DD-MM-YYYY (VD: 01-01-1990).';
    return;
  }

  const [day, month, year] = birthdate.value.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const today = new Date();

  // Kiểm tra ngày hợp lệ
  if (
    isNaN(date.getTime()) ||
    date.getDate() !== day ||
    date.getMonth() + 1 !== month ||
    date.getFullYear() !== year
  ) {
    birthdateError.value = 'Ngày sinh không hợp lệ.';
    return;
  }

  // Kiểm tra ngày không trong tương lai
  if (date > today) {
    birthdateError.value = 'Ngày sinh không được trong tương lai.';
    return;
  }

  birthdateError.value = '';
}

async function register() {
  // Reset lỗi chung
  formError.value = '';

  // Kiểm tra các trường required
  if (!username.value || !birthdate.value || !gender.value) {
    formError.value = 'Vui lòng điền đầy đủ các trường bắt buộc (Username, Ngày sinh, Giới tính).';
    return;
  }

  // Kiểm tra validate username và birthdate
  validateUsername();
  validateBirthdate();

  if (usernameError.value || birthdateError.value) {
    formError.value = 'Vui lòng sửa các lỗi trong form trước khi đăng ký.';
    return;
  }

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

    if (userResponse.value && !userResponse.value.error) {
      toast.error('Username đã tồn tại. Vui lòng chọn username khác.', {
        position: 'top-center',
      });
      clearInterval(progressInterval);
      return;
    }

    await $fetch('/api/user', {
      method: 'POST',
      body: {
        username: formattedUsername,
        birthdate: birthdate.value,
        gender: gender.value,
      },
    });

    toast.success('Đăng ký thành công! Đang chuyển về đăng nhập...', {
      position: 'top-center',
    });
    isSubmitted.value = true;
    loadingProgress.value = 100;
    clearInterval(progressInterval);
    setTimeout(() => navigateTo('/login'), 1000);
  } catch (error) {
    console.error('Error during registration:', error);
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