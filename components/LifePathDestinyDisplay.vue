
<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Header section (không bảo vệ) -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-700 mb-2">Tương Quan Số Đường Đời & Sứ Mệnh</h2>
        <p class="text-lg text-gray-600">Khám phá mối quan hệ giữa con đường và mục đích cuộc đời bạn</p>
      </div>

      <transition name="fade-slide">
        <div v-if="showResult" class="space-y-8">
          <!-- Number display with visual connection (không bảo vệ) -->
          <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm">
            <div class="flex flex-col md:flex-row items-center justify-center gap-8">
              <!-- Life Path Number -->
              <div class="relative text-center">
                <div class="w-24 h-24 rounded-full bg-teal-100 border-4 border-teal-500 flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl font-bold text-teal-700">{{ lifePathNumber }}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Số Đường Đời</h3>
              </div>
              
              <!-- Connection arrow -->
              <div class="hidden md:block relative">
                <div class="w-16 h-1 bg-teal-300"></div>
                <div class="absolute -right-1 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-teal-300"></div>
              </div>
              
              <!-- Destiny Number -->
              <div class="relative text-center">
                <div class="w-24 h-24 rounded-full bg-purple-100 border-4 border-purple-500 flex items-center justify-center mx-auto mb-3">
                  <span class="text-3xl font-bold text-purple-700">{{ destinyNumber }}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-800">Số Sứ Mệnh</h3>
              </div>
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
                <!-- Compatibility card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-start mb-4">
                    <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-800">Mức độ tương thích</h4>
                      <p class="text-gray-600 mt-2">{{ correlationResult.compatibility }}</p>
                    </div>
                  </div>
                </div>

                <!-- Strengths card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-start mb-4">
                    <div class="flex-shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-800">Điểm mạnh kết hợp</h4>
                      <p class="text-gray-600 mt-2">{{ correlationResult.strengths }}</p>
                    </div>
                  </div>
                </div>

                <!-- Challenges card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-start mb-4">
                    <div class="flex-shrink-0 p-2 bg-red-100 rounded-lg text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-800">Thách thức cần vượt qua</h4>
                      <p class="text-gray-600 mt-2">{{ correlationResult.challenges }}</p>
                    </div>
                  </div>
                </div>

                <!-- Solutions card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex items-start mb-4">
                    <div class="flex-shrink-0 p-2 bg-green-100 rounded-lg text-green-600">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div class="ml-4">
                      <h4 class="text-lg font-semibold text-gray-800">Giải pháp hài hòa</h4>
                      <p class="text-gray-600 mt-2">{{ correlationResult.solutions }}</p>
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
            <span class="text-gray-600">Đang phân tích tương quan...</span>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="text-center py-12 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h4 class="text-red-600 font-medium text-lg">Đã xảy ra lỗi</h4>
          <p class="text-gray-600 mt-1">{{ error }}</p>
        </div>

        <!-- Empty state -->
        <div v-else class="text-center py-12 bg-yellow-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h4 class="text-yellow-700 font-medium text-lg">Thông tin cần thiết</h4>
          <p class="text-gray-600 mt-1">Vui lòng nhập ngày sinh và họ tên đầy đủ</p>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { calculateLifePathNumber, calculateExpressionNumber } from '@/utils/numerology-calculations';
import { correlationData } from '@/data/lifePathCorrelationData';

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

const lifePathNumber = ref(null);
const destinyNumber = ref(null);
const correlationResult = ref(null);
const loading = ref(false);
const error = ref(null);
const tokenCost = ref(10);
const description = 'Access to detailed life path and destiny correlation interpretation';
const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
const isLoggedIn = ref(false);
let handleAction = () => {};
const isInitialLoad = ref(true);

const showResult = computed(() => {
  return correlationResult.value && lifePathNumber.value !== null && destinyNumber.value !== null;
});

const loadCorrelationData = async () => {
  loading.value = true;
  error.value = null;
  lifePathNumber.value = null;
  destinyNumber.value = null;
  correlationResult.value = null;

  try {
    if (!props.birthDate) {
      throw new Error('Vui lòng nhập ngày sinh');
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
      throw new Error('Định dạng ngày sinh không hợp lệ (DD/MM/YYYY)');
    }

    const [day, month, year] = props.birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    
    if (
      dateObj.getDate() !== day ||
      dateObj.getMonth() + 1 !== month ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      throw new Error('Ngày sinh không hợp lệ');
    }

    lifePathNumber.value = calculateLifePathNumber(props.birthDate);
    destinyNumber.value = calculateExpressionNumber(props.fullName);

    if (!lifePathNumber.value || !destinyNumber.value) {
      throw new Error('Không thể tính toán các chỉ số số học');
    }

    // Kiểm tra Master Numbers
    if (![1, 2, 3, 4, 5, 6, 7, 8, 9].includes(lifePathNumber.value)) {
      throw new Error(`Số Đường Đời ${lifePathNumber.value} không được hỗ trợ`);
    }

    const data = correlationData[lifePathNumber.value];
    if (!data || !data.correlations) {
      throw new Error(`Không tìm thấy dữ liệu cho Số Đường Đời ${lifePathNumber.value}`);
    }

    const correlation = data.correlations.find(
      (item) => item.destiny === destinyNumber.value
    );

    if (correlation) {
      correlationResult.value = correlation;
    } else {
      throw new Error(`Không tìm thấy dữ liệu tương quan cho Sứ Mệnh ${destinyNumber.value}`);
    }

  } catch (err) {
    console.error('Lỗi trong loadCorrelationData:', err);
    error.value = err.message;
    
    correlationResult.value = {
      compatibility: `Tạm thời chưa có dữ liệu chi tiết cho cặp số ${lifePathNumber.value} và ${destinyNumber.value}`,
      strengths: 'Đang cập nhật dữ liệu',
      challenges: 'Đang cập nhật dữ liệu',
      solutions: 'Đang cập nhật dữ liệu',
    };
  } finally {
    loading.value = false;
  }
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  isLoggedIn.value = authStatus;
  handleAction = action;
};

// Theo dõi props.birthDate và props.fullName
watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    if (newBirthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
      loadCorrelationData();
      if (isInitialLoad.value) {
        initializeAuth();
        isInitialLoad.value = false;
      }
    }
  },
  { immediate: false }
);

// Gọi khi mount
onMounted(() => {
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    loadCorrelationData();
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

@media (max-width: 768px) {
  .container {
    padding: 1rem;
  }
  
  .text-3xl {
    font-size: 1.5rem;
  }
  
  .text-xl {
    font-size: 1.2rem;
  }
}
</style>
