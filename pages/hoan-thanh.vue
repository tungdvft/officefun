<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
        <h1 class="text-2xl font-bold text-white">Hoàn thiện hồ sơ</h1>
        <p class="text-purple-100 mt-1">Vui lòng nhập thông tin để tiếp tục</p>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="bg-red-50 text-red-600 p-4 text-center">
        {{ errorMessage }}
      </div>

      <!-- Form -->
      <div class="p-6 md:p-8">
        <form @submit.prevent="submitProfile" class="space-y-6">
          <!-- Full name field -->
          <div>
            <label for="fullname" class="block text-sm font-medium text-gray-700 mb-1">Họ tên đầy đủ</label>
            <input
              v-model="form.fullname"
              type="text"
              id="fullname"
              placeholder="Nhập họ tên đầy đủ"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              :disabled="loading"
            />
          </div>

          <!-- Birthdate field -->
          <div>
            <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <input
              type="text"
              id="birthdate"
              v-model="form.birthdate"
              pattern="\d{2}/\d{2}/\d{4}"
              placeholder="DD/MM/YYYY"
              class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              required
              :disabled="loading"
            />
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="loading || !formValid"
            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <span v-if="loading">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
            <span v-else>Lưu và tiếp tục</span>
          </button>
        </form>

        <!-- Additional info -->
        <div class="mt-6 text-center">
          <p class="text-sm text-gray-600">
            Bạn có thể cập nhật thông tin này sau trong phần Cài đặt tài khoản
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '~/stores/user';
import { useRoute, navigateTo } from '#app';
import { toast } from 'vue3-toastify';

const userStore = useUserStore();
const route = useRoute();
const loading = ref(false);
const errorMessage = ref('');

// Form data
const form = ref({
  fullname: '',
  birthdate: '' // Lưu dưới dạng string DD/MM/YYYY
});

// Validate birthdate format DD/MM/YYYY và kiểm tra khoảng 1900 đến hiện tại
const isValidBirthdate = (dateStr) => {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  if (!regex.test(dateStr)) return false;

  const [, day, month, year] = dateStr.match(regex);
  const date = new Date(`${year}-${month}-${day}`);
  if (isNaN(date.getTime())) return false;

  // Kiểm tra năm từ 1900 đến hiện tại
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  if (yearNum < 1900 || yearNum > currentYear) return false;

  // Kiểm tra ngày tháng hợp lệ
  return date.getDate() === parseInt(day) && date.getMonth() + 1 === parseInt(month);
};

// Kiểm tra form hợp lệ
const formValid = computed(() => {
  return form.value.fullname.trim() && isValidBirthdate(form.value.birthdate);
});

// Chuyển DD/MM/YYYY thành yyyy-MM-dd cho API
const formatDateForApi = (dateStr) => {
  if (!isValidBirthdate(dateStr)) return '';
  const [day, month, year] = dateStr.split('/');
  return `${year}-${month}-${day}`; // yyyy-MM-dd
};

// Khởi tạo form với dữ liệu từ store hoặc localStorage
const initializeForm = () => {
  // Ưu tiên lấy từ store
  if (userStore.user?.fullname || userStore.user?.birthdate) {
    form.value = {
      fullname: userStore.user.fullname || '',
      birthdate: userStore.user.birthdate || '' // DD/MM/YYYY
    };
    return;
  }

  // Nếu store không có, kiểm tra localStorage
  if (process.client) {
    const savedUser = localStorage.getItem('auth');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      form.value = {
        fullname: userData.fullname || '',
        birthdate: userData.birthdate || ''
      };
    }
  }
};

// Cập nhật thông tin user
const updateUserProfile = async () => {
  try {
    loading.value = true;
    errorMessage.value = '';

    // Lấy user ID và token từ store hoặc localStorage
    let userId = userStore.user?.id;
    let token = userStore.token;
    if (!userId && process.client) {
      const savedUser = localStorage.getItem('auth');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        userId = userData.id;
        token = userData.token;
      }
    }

    if (!userId || !token) {
      throw new Error('Không tìm thấy thông tin người dùng hoặc token');
    }

    // Gọi API cập nhật thông tin user
    const response = await $fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: {
        fullname: form.value.fullname.trim(),
        birthdate: formatDateForApi(form.value.birthdate) // yyyy-MM-dd
      }
    });

    // Kiểm tra response
    if (!response.success) {
      throw new Error(response.message || 'Cập nhật hồ sơ thất bại');
    }

    // Cập nhật store
    userStore.setUser({
      ...userStore.user,
      id: userId,
      fullname: form.value.fullname.trim(),
      birthdate: form.value.birthdate // Lưu DD/MM/YYYY
    });

    // Cập nhật localStorage
    if (process.client) {
      const savedUser = localStorage.getItem('auth');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        localStorage.setItem('auth', JSON.stringify({
          ...userData,
          fullname: form.value.fullname.trim(),
          birthdate: form.value.birthdate // Lưu DD/MM/YYYY
        }));
      }
    }

    toast.success('Hồ sơ đã được cập nhật!', {
      position: 'top-center',
      theme: 'colored'
    });

    // Chuyển hướng về trang đích hoặc mặc định '/xem'
    const redirect = route.query.redirect && typeof route.query.redirect === 'string' && route.query.redirect.startsWith('/')
      ? route.query.redirect
      : '/xem';
    await navigateTo(redirect);
  } catch (error) {
    console.error('Update profile error:', {
      message: error.message,
      status: error.status,
      data: error.data
    });
    errorMessage.value = error.data?.message || error.message || 'Lỗi khi cập nhật hồ sơ. Vui lòng thử lại!';
    toast.error(errorMessage.value, {
      position: 'top-center',
      theme: 'colored'
    });
  } finally {
    loading.value = false;
  }
};

// Submit form
const submitProfile = () => {
  if (!formValid.value) {
    errorMessage.value = 'Vui lòng nhập đầy đủ họ tên và ngày sinh hợp lệ (DD/MM/YYYY, từ 1900 đến hiện tại)';
    return;
  }
  updateUserProfile();
};

// Khởi tạo form khi component mounted
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
/* Không cần tùy chỉnh thêm vì input đã có style phù hợp */
</style>
