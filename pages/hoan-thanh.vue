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
            >
          </div>

          <!-- Birthdate field -->
          <div>
            <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
            <VueDatePicker
              v-model="form.birthdate"
              id="birthdate"
              :format="'dd/MM/yyyy'"
              :max-date="maxBirthdate"
              placeholder="dd/mm/yyyy"
              :enable-time="false"
              :disabled="loading"
              class="w-full"
              required
              :clearable="false"
              :auto-apply="true"
              :text-input="{ format: 'dd/MM/yyyy' }"
              input-class-name="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
import { toast } from 'vue3-toastify';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

const userStore = useUserStore();
const loading = ref(false);
const errorMessage = ref('');

// Form data
const form = ref({
  fullname: '',
  birthdate: null // Lưu dưới dạng Date object
});

// Tính toán ngày sinh tối đa (12 tuổi trở lên)
const maxBirthdate = computed(() => {
  const today = new Date();
  return new Date(today.getFullYear() - 12, today.getMonth(), today.getDate());
});

// Kiểm tra form hợp lệ
const formValid = computed(() => {
  return form.value.fullname.trim() && form.value.birthdate instanceof Date;
});

// Format ngày thành yyyy-mm-dd cho API
const formatDateForApi = (date) => {
  if (!(date instanceof Date)) return '';
  return date.toISOString().split('T')[0]; // yyyy-mm-dd
};

// Khởi tạo form với dữ liệu từ store hoặc localStorage
const initializeForm = () => {
  // Ưưu tiên lấy từ store
  if (userStore.user?.fullname || userStore.user?.birthdate) {
    form.value = {
      fullname: userStore.user.fullname || '',
      birthdate: userStore.user.birthdate ? new Date(userStore.user.birthdate) : null
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
        birthdate: userData.birthdate ? new Date(userData.birthdate) : null
      };
    }
  }
};

// Cập nhật thông tin user
const updateUserProfile = async () => {
  try {
    loading.value = true;

    // Lấy user ID từ store hoặc localStorage
    let userId = userStore.user?.id;
    if (!userId && process.client) {
      const savedUser = localStorage.getItem('auth');
      if (savedUser) {
        userId = JSON.parse(savedUser).id;
      }
    }

    if (!userId) {
      throw new Error('Không tìm thấy thông tin người dùng');
    }

    // Gọi API cập nhật thông tin user
    const response = await $fetch(`/api/users/${userId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${userStore.token || ''}`,
      },
      body: {
        fullname: form.value.fullname,
        birthdate: formatDateForApi(form.value.birthdate) // Gửi yyyy-mm-dd
      }
    });

    if (response.success) {
      // Cập nhật store
      userStore.setUser({
        id: userId,
        email: userStore.user?.email || '',
        fullname: form.value.fullname,
        birthdate: formatDateForApi(form.value.birthdate)
      });

      // Cập nhật localStorage
      if (process.client) {
        const savedUser = localStorage.getItem('auth');
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          localStorage.setItem('auth', JSON.stringify({
            ...userData,
            fullname: form.value.fullname,
            birthdate: formatDateForApi(form.value.birthdate)
          }));
        }
      }

      toast.success('Hồ sơ đã được cập nhật!');
      await navigateTo('/xem');
    }
  } catch (error) {
    console.error('Update profile error:', {
      message: error.message,
      status: error.status,
      data: error.data,
    });
    errorMessage.value = error.data?.message || 'Lỗi khi cập nhật hồ sơ. Vui lòng thử lại sau!';
    toast.error(errorMessage.value);
  } finally {
    loading.value = false;
  }
};

const submitProfile = () => {
  if (!formValid.value) return;
  updateUserProfile();
};

// Khởi tạo form khi component mounted
onMounted(() => {
  initializeForm();
});
</script>

<style scoped>
/* Tùy chỉnh thêm nếu cần */
.dp__input {
  padding: 0 !important;
}
</style>