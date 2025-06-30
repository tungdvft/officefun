<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <h2 class="text-3xl font-bold text-center text-teal-700 mb-6">Các Điểm Yếu</h2>
      
      <transition name="fade-slide">
        <!-- Thông báo lỗi -->
        <div v-if="error" class="text-center py-12 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h4 class="text-red-600 font-medium text-lg">{{ error }}</h4>
        </div>
        
        <!-- Trạng thái loading -->
        <div v-else-if="loading" class="text-center py-12">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">Đang phân tích các điểm yếu...</span>
          </div>
        </div>
        
        <!-- Hiển thị kết quả -->
        <div v-else-if="showResult" class="space-y-12">
          <!-- Lặp qua từng điểm yếu -->
          <div v-for="weakness in weaknessDataList" :key="weakness.number" class="space-y-6">
            <!-- Vòng tròn cho số điểm yếu -->
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
                    <span class="text-5xl font-bold text-teal-700">{{ weakness.number }}</span>
                  </div>
                </div>
                <h3 class="text-2xl font-bold text-teal-800 mt-6">Số Điểm Yếu {{ weakness.number }}</h3>
              </div>
            </div>
            
            <!-- Luận giải chi tiết (bảo vệ) -->
            <div v-if="accessStates[weakness.number]?.isLoading" class="text-center py-12">
              <div class="inline-flex items-center">
                <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600">Đang kiểm tra quyền truy cập...</span>
              </div>
            </div>
            <div v-else-if="accessStates[weakness.number]?.errorMessage" class="text-center py-12 bg-red-50 rounded-lg">
              <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
              <h4 class="text-red-600 font-medium text-lg">{{ accessStates[weakness.number]?.errorMessage }}</h4>
              <p v-if="accessStates[weakness.number]?.hasSufficientTokens === false" class="text-gray-600 text-sm mt-1">Bạn không có đủ token. Vui lòng nạp thêm.</p>
            </div>
            <div v-else>
              <transition name="fade-slide">
                <div v-if="accessStates[weakness.number]?.isContentAccessible" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Mô tả card -->
                  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                    <div class="flex items-start mb-4">
                      <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-lg font-semibold text-gray-800">Mô tả</h4>
                        <p class="text-gray-600 mt-2">{{ weakness.description }}</p>
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
                        <p class="text-gray-600 mt-2">{{ weakness.excellence }}</p>
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
                        <p class="text-gray-600 mt-2">{{ weakness.path }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Lời khuyên card -->
                  <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                    <div class="flex items-start mb-4">
                      <div class="flex-shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                      </div>
                      <div class="ml-4">
                        <h4 class="text-lg font-semibold text-gray-800">Lời khuyên</h4>
                        <ul class="list-disc pl-5 mt-2 text-gray-600">
                          <li v-for="(advice, index) in weakness.advice" :key="index">{{ advice }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else-if="!accessStates[weakness.number]?.isContentAccessible" class="text-center p-6">
                  <button
                    @click="accessStates[weakness.number]?.handleAction"
                    class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                    :disabled="accessStates[weakness.number]?.isLoading"
                  >
                    {{ isLoggedIn ? `Xem tiếp (Cần ${tokenCost} tokens)` : 'Đăng nhập để xem tiếp' }}
                  </button>
                </div>
              </transition>
            </div>
          </div>
        </div>
        
        <!-- Yêu cầu nhập thông tin -->
        <div v-else class="text-center py-12 bg-yellow-100 rounded-lg">
          <div class="text-yellow-700">
            Vui lòng nhập họ tên hợp lệ để xem thông tin.
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { calculateWeaknessNumbers } from '~/utils/numerology-calculations';
import weaknessDataJson from '~/data/weaknessData.json';

const props = defineProps({
  fullName: {
    type: String,
    default: '',
    validator: (value) => {
      if (!value) return true;
      return value.trim().length > 0;
    },
  },
});

const weaknessNumbers = ref([]);
const weaknessDataList = ref([]);
const loading = ref(false);
const error = ref(null);
const tokenCost = ref(5);
const isLoggedIn = ref(false);
const accessStates = ref({});
const isInitialLoad = ref(true);

const showResult = computed(() => {
  return weaknessDataList.value.length > 0 && weaknessNumbers.value.length > 0 && !error.value;
});

// Khởi tạo trạng thái đăng nhập và hành động cho mỗi điểm yếu
const initializeAuth = async (weaknessNumber) => {
  const description = `Access to detailed weakness number ${weaknessNumber} interpretations`;
  const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  if (isInitialLoad.value) {
    isLoggedIn.value = authStatus;
    isInitialLoad.value = false;
  }
  accessStates.value[weaknessNumber] = {
    isLoading,
    errorMessage,
    isContentAccessible,
    hasSufficientTokens,
    handleAction: action,
  };
};

const loadWeaknessData = async () => {
  loading.value = true;
  error.value = null;
  weaknessNumbers.value = [];
  weaknessDataList.value = [];
  accessStates.value = {};

  try {
    if (!props.fullName || props.fullName.trim() === '' || !/[a-z]/i.test(props.fullName)) {
      throw new Error('Vui lòng nhập họ tên hợp lệ chứa chữ cái');
    }

    weaknessNumbers.value = calculateWeaknessNumbers(props.fullName);

    if (!weaknessNumbers.value || weaknessNumbers.value.length === 0) {
      throw new Error('Không tìm thấy điểm yếu nào');
    }

    weaknessDataList.value = weaknessNumbers.value
      .map((number) => weaknessDataJson.weaknesses.find((weakness) => weakness.number === number))
      .filter(Boolean);

    if (weaknessDataList.value.length === 0) {
      throw new Error('Không tìm thấy dữ liệu cho các số điểm yếu');
    }

    // Khởi tạo trạng thái truy cập cho từng điểm yếu
    for (const weakness of weaknessDataList.value) {
      await initializeAuth(weakness.number);
    }
  } catch (err) {
    console.error('Lỗi trong loadWeaknessData:', err);
    error.value = err.message;
    weaknessDataList.value = [{
      number: 0,
      description: 'Tạm thời chưa có dữ liệu chi tiết cho các điểm yếu',
      excellence: 'Chưa có dữ liệu chi tiết.',
      path: 'Hãy khám phá thêm về bản thân.',
      advice: ['Vui lòng thử lại với họ tên khác hoặc liên hệ hỗ trợ'],
    }];
    await initializeAuth(0); // Khởi tạo trạng thái cho trường hợp lỗi
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.fullName,
  (newFullName) => {
    if (newFullName && newFullName.trim() && /[a-z]/i.test(newFullName)) {
      loadWeaknessData();
    }
  },
  { immediate: true }
);
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
  
  .w-32 {
    width: 6rem;
  }
  
  .h-32 {
    height: 6rem;
  }
  
  .text-5xl {
    font-size: 2.5rem;
  }
}
</style>
