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
            required
          />
        </div>
        <div class="mb-4">
          <label for="birthdate" class="block text-gray-700 mb-2">Ngày sinh</label>
          <VueDatePicker
            v-model="birthdate"
            id="birthdate"
            :max-date="new Date()"
            :enable-time-picker="false"
            placeholder="Chọn ngày sinh"
            format="dd-MM-yyyy" 
            :parse="parseDate" 
            class="w-full"
            required
          />
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
        <div class="mb-4">
          <label for="profession" class="block text-gray-700 mb-2">Ngành nghề</label>
          <select
            v-model="profession"
            id="profession"
            class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Chọn ngành nghề</option>
            <option value="KeToan">Kế toán</option>
            <option value="NhanSu">Nhân sự</option>
            <option value="Marketing">Marketing</option>
            <option value="KinhDoanh">Kinh doanh</option>
            <option value="CongNgheThongTin">Công nghệ thông tin</option>
            <option value="HanhChinh">Hành chính</option>
            <option value="ThietKe">Thiết kế</option>
            <option value="LuatSu">Luật sư</option>
          </select>
        </div>
        
        <button
          type="submit"
          class="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          :disabled="loading || isSubmitted"
        >
          {{ loading ? 'Đang xử lý...' : 'Đăng ký' }}
        </button>
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
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const username = ref('');
const birthdate = ref(''); // Giá trị sẽ là Date object từ VueDatePicker
const gender = ref('');
const profession = ref('');
const loading = ref(false);
const isSubmitted = ref(false);
const loadingProgress = ref(0);

// Hàm parse khi người dùng nhập tay
function parseDate(dateStr) {
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return new Date(`${year}-${month}-${day}`); // Chuyển DD-MM-YYYY về Date object
  }
  return null; // Trả về null nếu sai định dạng
}

// Hàm format Date thành DD-MM-YYYY
function formatDateToDDMMYYYY(date) {
  if (!date) return '';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

async function register() {
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

    // Format birthdate thành DD-MM-YYYY trước khi gửi API
    const formattedBirthdate = formatDateToDDMMYYYY(birthdate.value);

    await $fetch('/api/user', {
      method: 'POST',
      body: {
        username: formattedUsername,
        birthdate: formattedBirthdate, // Gửi dạng DD-MM-YYYY
        gender: gender.value,
        profession: profession.value,
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

.dp__input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  outline: none;
}
.dp__input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}
</style>