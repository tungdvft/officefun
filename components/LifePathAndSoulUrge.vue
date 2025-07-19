
<template>
  <div class="container mx-auto bg-white rounded-2xl shadow-xl overflow-hidden max-w-5xl">
    <div class="p-8 space-y-10">
      <!-- Header section -->
      <div class="text-center">
        <h2 class="text-4xl font-extrabold text-teal-700 mb-3">Tương Quan Số Đường Đời & Số Linh Hồn</h2>
        <p class="text-lg text-gray-600">Khám phá sự hòa hợp giữa hành trình cuộc sống và khát vọng nội tâm của bạn</p>
      </div>

      <!-- Main content with transition -->
      <transition name="fade-slide">
        <div>
          <!-- Nội dung chính -->
          <div v-if="showResult" class="space-y-10">
            <!-- Number display with visual connection -->
            <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-md">
              <div class="flex flex-col items-center gap-10">
                <!-- Number display -->
                <div class="flex flex-col md:flex-row items-center justify-center gap-10">
                  <!-- Life Path Number -->
                  <div class="relative text-center">
                    <div class="w-28 h-28 rounded-full bg-teal-100 border-4 border-teal-500 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-105">
                      <span class="text-4xl font-bold text-teal-700">{{ lifePathNumber }}</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800">Số Đường Đời</h3>
                  </div>

                  <!-- Connection arrow -->
                  <div class="hidden md:block relative">
                    <div class="w-20 h-1 bg-teal-400"></div>
                    <div class="absolute -right-2 top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-teal-400"></div>
                  </div>

                  <!-- Soul Urge Number -->
                  <div class="relative text-center">
                    <div class="w-28 h-28 rounded-full bg-purple-100 border-4 border-purple-500 flex items-center justify-center mx-auto mb-4 transition-transform hover:scale-105">
                      <span class="text-4xl font-bold text-purple-700">{{ soulUrgeNumber }}</span>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-800">Số Linh Hồn</h3>
                  </div>
                </div>

                <!-- Description -->
                <div class="text-center max-w-2xl mx-auto">
                  <p class="text-gray-600 text-lg">Sự kết hợp giữa Số Đường Đời và Số Linh Hồn tiết lộ cách mục đích sống hòa quyện với động lực nội tâm, định hình cách bạn đối mặt thử thách và phát huy thế mạnh. Khám phá chi tiết để hiểu rõ hơn về hành trình của bạn.</p>
                </div>
              </div>
            </div>

            <!-- Compatibility and Strengths cards -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Compatibility card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 p-3 bg-teal-100 rounded-lg text-teal-600">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">Mức độ tương thích</h4>
                    <p class="text-gray-600 mt-2 leading-relaxed">{{ combinationData.compatibility }}</p>
                  </div>
                </div>
              </div>

              <!-- Strengths card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                <div class="flex items-start gap-4">
                  <div class="flex-shrink-0 p-3 bg-amber-100 rounded-lg text-amber-600">
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div>
                    <h4 class="text-lg font-semibold text-gray-800">Điểm mạnh kết hợp</h4>
                    <p class="text-gray-600 mt-2 leading-relaxed">{{ combinationData.strengths }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Trạng thái đang tải quyền truy cập -->
            <div v-if="isLoading" class="text-center py-12">
              <div class="inline-flex items-center gap-3">
                <svg class="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600 text-lg">Đang kiểm tra quyền truy cập...</span>
              </div>
            </div>

            <!-- Lỗi đăng nhập -->
            <div v-else-if="errorMessage && errorType === 'login'" class="text-center py-12 bg-red-50 rounded-lg">
              <svg class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 class="text-red-600 font-medium text-lg">Vui lòng đăng nhập để xem tiếp</h4>
              <button @click="errorAction" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md">Đăng nhập</button>
            </div>

            <!-- Lỗi thiếu token -->
            <div v-else-if="errorMessage && errorType === 'topup'" class="text-center py-12 bg-red-50 rounded-lg">
              <svg class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 class="text-red-600 font-medium text-lg">Không đủ token để xem tiếp</h4>
              <p class="text-gray-600 mt-1">Cần {{ tokenCost }} token. Vui lòng nạp thêm.</p>
              <button @click="navigateToTopup" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md">Nạp thêm token</button>
            </div>

            <!-- Lỗi chung -->
            <div v-else-if="errorMessage" class="text-center py-12 bg-red-50 rounded-lg">
              <svg class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 class="text-red-600 font-medium text-lg">{{ errorMessage }}</h4>
            </div>

            <!-- Đang tải dữ liệu -->
            <div v-else-if="loading" class="text-center py-12">
              <div class="inline-flex items-center gap-3">
                <svg class="animate-spin h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span class="text-gray-600 text-lg">Đang phân tích tương quan...</span>
              </div>
            </div>

            <!-- Lỗi dữ liệu -->
            <div v-else-if="error" class="text-center py-12 bg-red-50 rounded-lg">
              <svg class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 class="text-red-600 font-medium text-lg">Đã xảy ra lỗi</h4>
              <p class="text-gray-600 mt-1">{{ error }}</p>
            </div>

            <!-- Yêu cầu đăng nhập hoặc mở khóa nội dung -->
            <div v-else-if="showResult && !isContentAccessible" class="text-center py-12 bg-gray-50 rounded-lg">
              <div v-if="!userStore.isAuthenticated">
                <p class="text-gray-600 mb-4 text-lg">Vui lòng đăng nhập để xem giải thích chi tiết.</p>
                <button @click="errorAction" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md" :disabled="isLoading">Đăng nhập để xem tiếp</button>
              </div>
              <div v-else-if="!hasSufficientTokens">
                <p class="text-red-600 font-medium mb-4 text-lg">Không đủ token để xem tiếp. Cần {{ tokenCost }} token.</p>
                <button @click="navigateToTopup" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md" :disabled="isLoading">Nạp thêm token</button>
              </div>
              <div v-else>
                <button @click="performAction" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md" :disabled="isLoading">Xem tiếp (Cần {{ tokenCost }} token)</button>
              </div>
            </div>

            <!-- Nội dung được bảo vệ -->
            <div v-else-if="isContentAccessible" class="space-y-10">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Challenges card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 p-3 bg-red-100 rounded-lg text-red-600">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-800">Thách thức cần vượt qua</h4>
                      <p class="text-gray-600 mt-2 leading-relaxed">{{ combinationData.challenges }}</p>
                    </div>
                  </div>
                </div>

                <!-- Solutions card -->
                <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div class="flex items-start gap-4">
                    <div class="flex-shrink-0 p-3 bg-green-100 rounded-lg text-green-600">
                      <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <div>
                      <h4 class="text-lg font-semibold text-gray-800">Giải pháp hài hòa</h4>
                      <p class="text-gray-600 mt-2 leading-relaxed">{{ combinationData.solutions }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty state -->
          <div v-else-if="!showResult && !loading && !error" class="text-center py-12 bg-yellow-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-yellow-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h4 class="text-yellow-700 font-medium text-lg">Thông tin cần thiết</h4>
            <p class="text-gray-600 mt-1">Vui lòng nhập ngày sinh và họ tên đầy đủ</p>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { calculateLifePathNumber, calculateSoulUrgeNumber } from '@/utils/numerology-calculations';
import { soulUrgeData } from '@/data/lifePathSoulUrgeData';

const props = defineProps({
  birthDate: {
    type: String,
    default: '',
    validator: (value) => !value || /^\d{2}\/\d{2}\/\d{4}$/.test(value),
  },
  fullName: {
    type: String,
    default: '',
  },
});

const router = useRouter();
const userStore = useUserStore();
const lifePathNumber = ref(null);
const soulUrgeNumber = ref(null);
const combinationData = ref(null);
const loading = ref(false);
const error = ref(null);
const tokenCost = ref(20);
const description = 'Truy cập giải thích chi tiết về tương quan Số Đường Đời và Số Linh Hồn';
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

const showResult = computed(() => {
  return combinationData.value && lifePathNumber.value !== null && soulUrgeNumber.value !== null;
});

const loadCombinationData = async () => {
  if (!props.fullName?.trim() || !props.birthDate) {
    loading.value = false;
    error.value = 'Vui lòng nhập ngày sinh và họ tên đầy đủ';
    return;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    loading.value = false;
    error.value = 'Định dạng ngày sinh không hợp lệ (DD/MM/YYYY)';
    return;
  }

  loading.value = true;
  error.value = null;
  lifePathNumber.value = null;
  soulUrgeNumber.value = null;
  combinationData.value = null;

  try {
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
    soulUrgeNumber.value = calculateSoulUrgeNumber(props.fullName);

    if (!lifePathNumber.value || !soulUrgeNumber.value) {
      throw new Error('Không thể tính toán các chỉ số số học');
    }

    if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22].includes(lifePathNumber.value)) {
      throw new Error(`Số Đường Đời ${lifePathNumber.value} không được hỗ trợ`);
    }

    if (![1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22].includes(soulUrgeNumber.value)) {
      throw new Error(`Số Linh Hồn ${soulUrgeNumber.value} không được hỗ trợ`);
    }

    const data = soulUrgeData[lifePathNumber.value];
    if (!data || !data.correlations) {
      throw new Error(`Không tìm thấy dữ liệu cho Số Đường Đời ${lifePathNumber.value}`);
    }

    const combination = data.correlations.find(
      (item) => item.soulUrge === soulUrgeNumber.value
    );

    if (combination) {
      combinationData.value = {
        compatibility: combination.compatibility,
        strengths: combination.strengths,
        challenges: combination.challenges,
        solutions: combination.solutions,
      };
    } else {
      throw new Error(`Không tìm thấy dữ liệu tương quan cho Số Linh Hồn ${soulUrgeNumber.value}`);
    }
  } catch (err) {
    console.error('Lỗi trong loadCombinationData:', err);
    error.value = err.message;
    combinationData.value = {
      compatibility: `Tạm thời chưa có dữ liệu chi tiết cho cặp số ${lifePathNumber.value} và ${soulUrgeNumber.value}`,
      strengths: 'Đang cập nhật dữ liệu',
      challenges: 'Đang cập nhật dữ liệu',
      solutions: 'Đang cập nhật dữ liệu',
    };
  } finally {
    loading.value = false;
  }
};

const initializeAuth = async () => {
  try {
    await userStore.initialize();
    await checkAuthAndAccess();
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errorMessage.value = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    errorType.value = '';
  }
};

watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    if (newBirthDate && newFullName && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
      loadCombinationData();
      initializeAuth();
    } else {
      lifePathNumber.value = null;
      soulUrgeNumber.value = null;
      combinationData.value = null;
      error.value = 'Vui lòng nhập ngày sinh và họ tên đầy đủ';
    }
  },
  { immediate: false }
);

onMounted(() => {
  if (props.birthDate && props.fullName && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    loadCombinationData();
    initializeAuth();
  }
});
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(15px);
}

@media (max-width: 768px) {
  .container {
    padding: 1.5rem;
  }

  .text-4xl {
    font-size: 2rem;
  }

  .text-xl {
    font-size: 1.25rem;
  }

  .text-lg {
    font-size: 1rem;
  }
}
</style>
