<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Header section (không bảo vệ) -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-700 mb-2">Chỉ Số Thử Thách Sứ Mệnh</h2>
        <p class="text-lg text-gray-600">Khám phá những thách thức bạn cần vượt qua để hoàn thành sứ mệnh</p>
      </div>

      <transition name="fade-slide">
        <div v-if="number && data" class="space-y-8">
          <!-- Challenge number card (không bảo vệ) -->
          <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
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
                  <span class="text-5xl font-bold text-teal-700">{{ number }}</span>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-teal-800 mt-6">Thử Thách Sứ Mệnh Số {{ number }}</h3>
              <p class="text-gray-600 mt-2 max-w-lg">{{ data.description }}</p>
            </div>
          </div>

          <!-- Detailed interpretation (bảo vệ) -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Đang kiểm tra quyền truy cập...</span>
            </div>
          </div>
          <div v-else-if="errorMessage" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">{{ errorMessage }}</h4>
            <p v-if="hasSufficientTokens === false" class="text-gray-600 text-sm mt-1">Bạn không có đủ token. Vui lòng nạp thêm.</p>
          </div>
          <div v-else>
            <transition name="fade-slide">
              <div v-if="isContentAccessible" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Traits card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-start mb-4">
                    <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-800">Đặc điểm nổi bật</h4>
                      <p class="text-gray-600 mt-2">{{ data.traits }}</p>
                    </div>
                  </div>
                </div>

                <!-- Advice card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-start mb-4">
                    <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-800">Lời khuyên hữu ích</h4>
                      <p class="text-gray-600 mt-2">{{ data.advice }}</p>
                    </div>
                  </div>
                </div>

                <!-- Challenges card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                  <div class="flex items-start mb-4">
                    <div class="flex-shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-800">Thách thức chính</h4>
                      <p class="text-gray-600 mt-2">{{ data.challenges }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="!isContentAccessible" class="text-center p-6">
                <button
                  @click="handleAction"
                  class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                  :disabled="isLoading"
                >
                  {{ isLoggedIn ? `Xem tiếp (Cần ${tokenCost} tokens)` : 'Đăng nhập để xem tiếp' }}
                </button>
              </div>
            </transition>
          </div>
        </div>

        <!-- Loading state -->
        <div v-else-if="loading" class="text-center py-12">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">Đang phân tích thử thách sứ mệnh của bạn...</span>
          </div>
        </div>

        <!-- Error state -->
        <div v-else class="text-center py-12 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h4 class="text-red-600 font-medium text-lg">Không có dữ liệu</h4>
          <p class="text-gray-600 mt-1">Vui lòng nhập đầy đủ họ tên và ngày sinh để xem chỉ số thử thách sứ mệnh</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useNumerologyData } from '@/composables/useNumerologyData';

const props = defineProps({
  birthDate: {
    type: String,
    default: '',
    validator: (value) => {
      if (!value) return true;
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    },
  },
  fullName: {
    type: String,
    default: '',
  },
});

const birthDate = ref(props.birthDate);
const fullName = ref(props.fullName);
const { number, data, loading } = useNumerologyData('challenge', birthDate, fullName);
const tokenCost = ref(5);
const description = 'Access to detailed destiny challenge number interpretation';
const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
const isLoggedIn = ref(false);
let handleAction = () => {};
const isInitialLoad = ref(true);

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  isLoggedIn.value = authStatus;
  handleAction = action;
};

// Gọi khi mount
onMounted(() => {
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    initializeAuth();
    isInitialLoad.value = false;
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

/* Animation for cards */
.card-enter-active {
  transition: all 0.3s ease;
  transition-delay: calc(0.1s * var(--i));
}
.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
