<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex items-center justify-center p-4">
    <div class="w-full max-w-lg bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-center">
        <h1 class="text-2xl font-bold text-white">Thông Tin Tài Khoản</h1>
        <p class="text-purple-100 mt-1">Quản lý thông tin cá nhân và tokens của bạn</p>
      </div>

      <!-- Content -->
      <div class="p-6 md:p-8">
        <div v-if="!userStore.isStoreInitialized" class="space-y-4">
          <div class="w-full h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="w-full h-8 bg-gray-200 rounded-lg animate-pulse"></div>
          <div class="w-full h-8 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div v-else-if="error" class="text-center text-red-600">
          {{ error }}
        </div>
        <div v-else-if="!userStore.isAuthenticated" class="text-center text-gray-600">
          Vui lòng đăng nhập để xem thông tin tài khoản
        </div>
        <div v-else-if="!userData" class="text-center text-gray-600">
          Đang tải thông tin tài khoản...
        </div>
        <div v-else class="space-y-6">
          <!-- Thông tin người dùng -->
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                {{ userData.email || 'Chưa cập nhật' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Họ và Tên</label>
              <div class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                {{ userData.fullname || 'Chưa cập nhật' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Ngày Sinh</label>
              <div class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50">
                {{ formatDate(userData.birthdate) || 'Chưa cập nhật' }}
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Số Tokens</label>
              <div class="w-full px-4 py-3 border border-gray-300 rounded-lg bg-purple-50 text-purple-600 font-medium">
                {{ userData.tokens ?? '0' }} Tokens
              </div>
            </div>
          </div>

          <!-- Nút đăng xuất -->
          <button
            @click="logout"
            class="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:shadow-md transition-all flex justify-center items-center"
            :disabled="isLoggingOut"
          >
            <span v-if="!isLoggingOut">Đăng Xuất</span>
            <span v-else class="flex items-center">
              <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang xử lý...
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '~/stores/user'
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

const userStore = useUserStore()
const router = useRouter()

const userData = ref(null)
const isLoggingOut = ref(false)
const error = ref(null)

// Hàm định dạng ngày sinh
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return null; // Kiểm tra ngày không hợp lệ
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

// Kiểm tra trạng thái đăng nhập và lấy thông tin người dùng
const fetchUserData = async () => {
  if (!userStore.isAuthenticated || !userStore.user?.id) {
    error.value = 'Vui lòng đăng nhập để xem thông tin tài khoản'
    toast.error(error.value, {
      position: 'top-center',
      theme: 'colored'
    })
    await router.push('/dang-nhap')
    return
  }

  try {
    const userId = String(userStore.user.id) // Ép kiểu userId thành chuỗi
    console.log('Fetching user data for userId:', userId)
    const response = await $fetch(`/api/users/${userId}`, {
      method: 'GET'
    })
    console.log('API response:', response)
    userData.value = response.user
  } catch (err) {
    console.error('API error:', err)
    error.value = err.data?.message || 'Không thể tải thông tin tài khoản. Vui lòng thử lại.'
    toast.error(error.value, {
      position: 'top-center',
      theme: 'colored'
    })
  }
}

// Đăng xuất
const logout = async () => {
  isLoggingOut.value = true
  try {
    await userStore.logout()
    toast.success('Đăng xuất thành công!', {
      position: 'top-center',
      theme: 'colored'
    })
    await router.push('/dang-nhap')
  } catch (err) {
    toast.error('Đăng xuất thất bại. Vui lòng thử lại.', {
      position: 'top-center',
      theme: 'colored'
    })
  } finally {
    isLoggingOut.value = false
  }
}

// Theo dõi isStoreInitialized để lấy dữ liệu khi store sẵn sàng
watch(() => userStore.isStoreInitialized, (initialized) => {
  if (initialized && process.client) {
    fetchUserData()
  }
})

onMounted(() => {
  if (userStore.isStoreInitialized) {
    fetchUserData()
  }
})
</script>