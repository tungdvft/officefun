<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Header section (không bảo vệ) -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-700 mb-2">Số Biểu Đạt</h2>
        <p class="text-lg text-gray-600">Khám phá cách bạn thể hiện bản thân với thế giới</p>
      </div>

      <!-- Expression number card (không bảo vệ) -->
      <div v-if="expressionData" class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
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
              <span class="text-5xl font-bold text-teal-700">{{ expressionData.number }}</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-teal-800 mt-6">Số Biểu Đạt {{ expressionData.number }}</h3>
          <p class="text-gray-600 mt-2 max-w-lg">Số biểu đạt thể hiện cách bạn trình bày bản thân và tương tác với thế giới xung quanh thông qua lời nói, hành động và sáng tạo. Nó tiết lộ phong cách giao tiếp độc đáo và thế mạnh tự nhiên của bạn. Đây là năng lượng bạn tỏa ra, ảnh hưởng đến cách người khác nhìn nhận bạn. Số biểu đạt định hướng bạn phát huy tiềm năng để tạo dấu ấn riêng. Khám phá chi tiết để hiểu rõ hơn về cách bạn thể hiện mình.</p>
        </div>
      </div>

      <transition name="fade-slide">
        <div>
          <!-- Trạng thái đang tải quyền truy cập -->
          <div v-if="isLoading" class="text-center py-12">
            <div class="inline-flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="text-gray-600">Đang kiểm tra quyền truy cập...</span>
            </div>
          </div>

          <!-- Lỗi đăng nhập -->
          <div
            v-else-if="errorMessage && errorType === 'login'"
            class="text-center py-12 bg-red-50 rounded-lg"
          >
            <svg
              class="h-12 w-12 mx-auto text-red-500 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h4 class="text-red-600 font-medium text-lg">
              Vui lòng đăng nhập để xem tiếp
            </h4>
            <button
              @click="errorAction"
              class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
            >
              Đăng nhập
            </button>
          </div>

          <!-- Lỗi thiếu token -->
          <div
            v-else-if="errorMessage && errorType === 'topup'"
            class="text-center py-12 bg-red-50 rounded-lg"
          >
            <svg
              class="h-12 w-12 mx-auto text-red-500 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h4 class="text-red-600 font-medium text-lg">
              Không đủ token để xem tiếp
            </h4>
            <p class="text-gray-600 mt-1">
              Cần {{ tokenCost }} token. Vui lòng nạp thêm.
            </p>
            <button
              @click="navigateToTopup"
              class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
            >
              Nạp thêm token
            </button>
          </div>

          <!-- Lỗi chung -->
          <div
            v-else-if="errorMessage"
            class="text-center py-12 bg-red-50 rounded-lg"
          >
            <svg
              class="h-12 w-12 mx-auto text-red-500 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h4 class="text-red-600 font-medium text-lg">{{ errorMessage }}</h4>
          </div>

          <!-- Đang tải dữ liệu -->
          <div v-else-if="loading" class="text-center py-12">
            <div class="inline-flex items-center">
              <svg
                class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span class="text-gray-600">Đang phân tích số biểu đạt...</span>
            </div>
          </div>

          <!-- Lỗi dữ liệu -->
          <div
            v-else-if="!expressionData"
            class="text-center py-12 bg-red-50 rounded-lg"
          >
            <svg
              class="h-12 w-12 mx-auto text-red-500 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Không có dữ liệu</h4>
            <p class="text-gray-600 mt-1">
              Vui lòng nhập đầy đủ họ tên
            </p>
          </div>

          <!-- Yêu cầu đăng nhập hoặc mở khóa nội dung -->
          <div v-else-if="!isContentAccessible" class="text-center py-12">
            <div v-if="!userStore.isAuthenticated">
              <p class="text-gray-600 mb-4">
                Vui lòng đăng nhập để xem giải thích chi tiết.
              </p>
              <button
                @click="errorAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                :disabled="isLoading"
              >
                Đăng nhập để xem tiếp
              </button>
            </div>
            <div v-else-if="!hasSufficientTokens" class="text-red-600 text-center font-medium ">
              Không đủ token cho tính năng này. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
              <!-- <p class="text-gray-600 mt-2">Số dư token: {{ userStore.user?.tokens || 0 }}</p> -->
            </div>
            <div v-else>
              <button
                @click="performAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                :disabled="isLoading"
              >
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
                    <p class="text-gray-600 mt-2">{{ expressionData.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Đặc điểm nổi bật card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">Đặc điểm nổi bật</h4>
                    <p class="text-gray-600 mt-2">{{ expressionData.traits }}</p>
                  </div>
                </div>
              </div>

              <!-- Lời khuyên phát triển card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">Lời khuyên phát triển</h4>
                    <p class="text-gray-600 mt-2">{{ expressionData.advice }}</p>
                  </div>
                </div>
              </div>

              <!-- Thách thức tiềm ẩn card -->
              <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">Thách thức tiềm ẩn</h4>
                    <p class="text-gray-600 mt-2">{{ expressionData.challenges }}</p>
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
import { computed, ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '~/stores/user';
import { useProtectedContent } from '~/composables/useProtectedContent';
import expressionNumbers from '~/data/ExpressionNumbers.json';

const props = defineProps({
  fullName: {
    type: String,
    required: true,
  },
});

const router = useRouter();
const userStore = useUserStore();
const fullName = ref(props.fullName);
const loading = ref(false);
const tokenCost = ref(10); // Thay đổi từ 5 thành 10 để đồng bộ
const description = 'Access to detailed expression number interpretation';
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

// Hàm chuyển ký tự có dấu tiếng Việt sang không dấu
const removeVietnameseAccents = (str) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

// Hàm tính số biểu đạt
const calculateExpressionNumber = (name) => {
  if (!name) return null;

  // Bảng Pythagoras
  const letterValues = {
    J: 1, S: 1,
    B: 2, K: 2, T: 2,
    C: 3, L: 3,
    D: 4, M: 4, V: 4,
    N: 5, W: 5,
    F: 6, X: 6,
    P: 7, Y: 7,
    H: 8, Q: 8, Z: 8,
    R: 9,
  };

  // Chuyển tên sang không dấu và lấy phụ âm
  const normalizedName = removeVietnameseAccents(name).toUpperCase();
  const consonants = normalizedName
    .replace(/[^A-Z]/g, '') // Loại bỏ ký tự không phải chữ
    .split('')
    .filter(char => !['A', 'E', 'I', 'O', 'U'].includes(char)); // Loại nguyên âm, giữ Y

  // Tính tổng giá trị phụ âm
  let sum = consonants.reduce((acc, char) => acc + (letterValues[char] || 0), 0);

  // Rút gọn tổng về số biểu đạt
  if (sum === 22) return '22/4'; // Giữ số Master 22/4
  while (sum > 11) {
    sum = sum
      .toString()
      .split('')
      .reduce((acc, digit) => acc + parseInt(digit), 0);
  }

  return sum;
};

// Tính số biểu đạt từ fullName
const expressionNumber = computed(() => calculateExpressionNumber(fullName.value));

// Tìm dữ liệu tương ứng trong JSON
const expressionData = computed(() => {
  return expressionNumbers.numbers.find(
    item => item.number === expressionNumber.value || item.number.toString() === expressionNumber.value
  );
});

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  console.log('Initializing auth for ExpressionNumber...');
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
    if (newFullName) {
      initializeAuth();
    } else {
      console.log('Dữ liệu không hợp lệ khi watch:', { newFullName });
      loading.value = false;
    }
  },
  { immediate: false }
);

// Gọi khi mount
onMounted(() => {
  console.log('Component mounted, fullName:', props.fullName);
  if (props.fullName) {
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
</style>
