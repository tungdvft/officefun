<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Header section (không bảo vệ) -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-700 mb-2">Chỉ Số Thử Thách Linh Hồn</h2>
        <p class="text-lg text-gray-600">Khám phá những thử thách sâu kín định hình hành trình tâm hồn bạn</p>
      </div>

      <!-- Soul challenge number card (không bảo vệ) -->
      <div v-if="soulChallengeNumber && challengeData" class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
        <div class="flex flex-col items-center">
          <div class="relative">
            <!-- Animated circle background -->
            <svg class="w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8"/>
              <circle cx="50" cy="50" r="45" fill="none" stroke="#0d9488" stroke-width="8" stroke-dasharray="283" 
                      stroke-dashoffset="283" stroke-linecap="round">
                <animate attributeName="stroke-dashoffset" dur="1.5s" from="283" to="0" fill="freeze" calcMode="spline" keySplines="0.3 0 0.7 1"/>
              </circle>
            </svg>
            <!-- Number display -->
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-5xl font-bold text-teal-700">{{ soulChallengeNumber }}</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-teal-800 mt-6">Chỉ Số Thử Thách Linh Hồn {{ soulChallengeNumber }}</h3>
          <p class="text-gray-600 mt-2 max-w-lg">{{ challengeData.description }}</p>
        </div>
      </div>

      <transition name="fade-slide">
        <div>
          <!-- Trạng thái đang tải quyền truy cập -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Đang kiểm tra quyền truy cập...</span>
            </div>
          </div>

          <!-- Lỗi đăng nhập -->
          <div v-else-if="errorMessage && errorType === 'login'" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Vui lòng đăng nhập để xem tiếp</h4>
            <button @click="errorAction" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">
              Đăng nhập
            </button>
          </div>

          <!-- Lỗi thiếu token -->
          <div v-else-if="errorMessage && errorType === 'topup'" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Không đủ token để xem tiếp</h4>
            <p class="text-gray-600 mt-1">Cần {{ tokenCost }} token. Vui lòng nạp thêm.</p>
            <button @click="navigateToTopup" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">
              Nạp thêm token
            </button>
          </div>

          <!-- Lỗi chung -->
          <div v-else-if="errorMessage" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">{{ errorMessage }}</h4>
          </div>

          <!-- Đang tải dữ liệu -->
          <div v-else-if="loading" class="text-center py-12">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Đang phân tích thử thách linh hồn...</span>
            </div>
          </div>

          <!-- Lỗi dữ liệu -->
          <div v-else-if="!soulChallengeNumber || !challengeData" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Không có dữ liệu</h4>
            <p class="text-gray-600 mt-1">Vui lòng nhập họ tên hợp lệ để xem thông tin.</p>
          </div>

          <!-- Yêu cầu đăng nhập hoặc mở khóa nội dung -->
          <div v-else-if="!isContentAccessible" class="text-center py-12">
            <div v-if="!userStore.isAuthenticated">
              <p class="text-gray-600 mb-4">Vui lòng đăng nhập để xem giải thích chi tiết.</p>
              <button @click="errorAction" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap" :disabled="isLoading">
                Đăng nhập để xem tiếp
              </button>
            </div>
            <div v-else-if="!hasSufficientTokens">
              <p class="text-red-600 font-medium mb-4">Không đủ token để xem tiếp. Cần {{ tokenCost }} token.</p>
              <button @click="navigateToTopup" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap" :disabled="isLoading">
                Nạp thêm token
              </button>
            </div>
            <div v-else>
              <button @click="performAction" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap" :disabled="isLoading">
                Xem tiếp (Cần {{ tokenCost }} token)
              </button>
            </div>
          </div>

          <!-- Nội dung được bảo vệ -->
          <div v-else class="space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Mô tả card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">Mô tả</h4>
                    <p class="text-gray-600 mt-2">{{ challengeData.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Lĩnh vực xuất sắc card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">Lĩnh vực xuất sắc</h4>
                    <p class="text-gray-600 mt-2">{{ challengeData.excellence }}</p>
                  </div>
                </div>
              </div>

              <!-- Con đường phù hợp card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">Con đường phù hợp</h4>
                    <p class="text-gray-600 mt-2">{{ challengeData.path }}</p>
                  </div>
                </div>
              </div>

              <!-- Lời khuyên card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">Lời khuyên</h4>
                    <ul class="list-disc pl-5 mt-2 text-gray-600">
                      <li v-for="(advice, index) in challengeData.advice" :key="index">{{ advice }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { calculateSoulChallengeNumber } from '@/utils/numerology-calculations';
import soulChallengeData from '@/data/soulChallengeData.json';

const props = defineProps({
  fullName: {
    type: String,
    default: '',
  },
});

const router = useRouter();
const userStore = useUserStore();
const fullName = ref(props.fullName);
const soulChallengeNumber = ref(null);
const challengeData = ref(null);
const loading = ref(false);
const error = ref(null);
const tokenCost = ref(5);
const description = 'Access to detailed soul challenge number interpretation';
const {
  isLoading,
  errorMessage,
  errorType,
  isContentAccessible,
  hasSufficientTokens,
  checkAuthAndAccess,
  performAction,
  errorAction,
  navigateToTopup,
} = useProtectedContent(tokenCost.value, description);

const loadChallengeData = async () => {
  loading.value = true;
  error.value = null;
  soulChallengeNumber.value = null;
  challengeData.value = null;

  try {
    if (!props.fullName || props.fullName.trim() === '') {
      throw new Error('Vui lòng nhập họ tên hợp lệ (chứa ít nhất một ký tự chữ cái)');
    }

    soulChallengeNumber.value = calculateSoulChallengeNumber(props.fullName);

    if (!soulChallengeNumber.value || soulChallengeNumber.value < 1 || soulChallengeNumber.value > 9) {
      throw new Error('Không thể tính toán Chỉ số Thử Thách Linh Hồn. Vui lòng kiểm tra lại họ tên.');
    }

    const data = soulChallengeData.challenges.find(
      (item) => item.number === soulChallengeNumber.value
    );

    if (data) {
      challengeData.value = data;
    } else {
      throw new Error(`Không tìm thấy dữ liệu cho Chỉ số Thử Thách Linh Hồn ${soulChallengeNumber.value}`);
    }

  } catch (err) {
    console.error('Lỗi trong loadChallengeData:', err);
    error.value = err.message;
    errorMessage.value = err.message;
    errorType.value = '';
  } finally {
    loading.value = false;
  }
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  console.log('Initializing auth for SoulChallengeDisplay...');
  try {
    await userStore.initialize();
    console.log(
      'User Store Initialized, isAuthenticated:',
      userStore.isAuthenticated,
      'tokenBalance:',
      userStore.user?.tokens
    );
    await checkAuthAndAccess();
    console.log(
      'Auth checked, isContentAccessible:',
      isContentAccessible.value,
      'hasSufficientTokens:',
      hasSufficientTokens.value
    );
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errorMessage.value = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    errorType.value = '';
  }
};

// Theo dõi props.fullName
watch(
  () => props.fullName,
  (newFullName) => {
    console.log('watch triggered, fullName:', newFullName);
    fullName.value = newFullName;
    if (newFullName && newFullName.trim()) {
      loadChallengeData();
      initializeAuth();
    } else {
      console.log('Dữ liệu không hợp lệ khi watch:', { newFullName });
      soulChallengeNumber.value = null;
      challengeData.value = null;
    }
  },
  { immediate: false }
);

// Gọi khi mount
onMounted(() => {
  console.log('Component mounted, fullName:', props.fullName);
  if (props.fullName && props.fullName.trim()) {
    loadChallengeData();
    initializeAuth();
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .container {
    padding: 15px;
  }
  
  .text-3xl {
    font-size: 1.8rem;
  }
  
  .text-2xl {
    font-size: 1.4rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
}
</style>