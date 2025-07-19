<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Header section (không bảo vệ) -->
      <div class="text-center">
        <h2 class="text-3xl font-bold text-teal-700 mb-2">Chỉ Số Sứ Mệnh</h2>
        <p class="text-lg text-gray-600">Khám phá mục đích cuộc đời qua tên của bạn</p>
      </div>

      <!-- Destiny number card (không bảo vệ) -->
      <div v-if="destinyNumber && destinyData" class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
        <div class="flex flex-col items-center">
          <div class="relative">
            <svg class="w-32 h-32" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8" />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#0d9488"
                stroke-width="8"
                stroke-dasharray="283"
                stroke-dashoffset="283"
                stroke-linecap="round"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  dur="1.5s"
                  from="283"
                  to="0"
                  fill="freeze"
                  calcMode="spline"
                  keySplines="0.3 0 0.7 1"
                />
              </circle>
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-5xl font-bold text-teal-700">{{ destinyNumber }}</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-teal-800 mt-6">Sứ Mệnh Số {{ destinyNumber }}</h3>
          <p class="text-gray-600 mt-2 max-w-lg">{{ destinyData.traits }}</p>
        </div>
      </div>

      <transition name="fade-slide">
        <div>
          <!-- Trạng thái đang tải -->
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
              <span class="text-gray-600">Đang phân tích sứ mệnh của bạn...</span>
            </div>
          </div>

          <!-- Lỗi dữ liệu -->
          <div
            v-else-if="!destinyNumber || !destinyData"
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
              Vui lòng nhập đầy đủ họ tên và ngày sinh
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
            <!-- Detailed interpretation (bảo vệ) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Excellence card -->
              <div
                class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex items-start mb-4">
                  <div
                    class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">
                      Lĩnh vực xuất sắc
                    </h4>
                    <p class="text-gray-600 mt-2">{{ destinyData.excellence }}</p>
                  </div>
                </div>
              </div>

              <!-- Path card -->
              <div
                class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="flex items-start mb-4">
                  <div
                    class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                      />
                    </svg>
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">
                      Con đường phù hợp
                    </h4>
                    <p class="text-gray-600 mt-2">{{ destinyData.path }}</p>
                  </div>
                </div>
              </div>

              <!-- Challenges card -->
              <div
                class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2"
              >
                <div class="flex items-start mb-4">
                  <div
                    class="flex-shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-6 w-6"
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
                  </div>
                  <div class="ml-4">
                    <h4 class="text-lg font-semibold text-gray-800">
                      Thách thức tiềm ẩn
                    </h4>
                    <p class="text-gray-600 mt-2">{{ destinyData.challenges }}</p>
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
import destinyNumberData from '~/data/DestinyNumberData.json';
import { calculateExpressionNumber } from '@/utils/numerology-calculations';

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

const router = useRouter();
const userStore = useUserStore();
const destinyNumber = ref(null);
const destinyData = ref(null);
const loading = ref(false);
const tokenCost = ref(20); // Đồng bộ với NumerologyPyramid
const description = 'Access to detailed destiny numerology interpretation';
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

const fetchDestinyData = async () => {
  console.log(
    'fetchDestinyData called with birthDate:',
    props.birthDate,
    'fullName:',
    props.fullName
  );

  if (!props.fullName || props.fullName.trim() === '' || !props.birthDate) {
    loading.value = false;
    destinyNumber.value = null;
    destinyData.value = null;
    return;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    loading.value = false;
    destinyNumber.value = null;
    destinyData.value = null;
    return;
  }

  const [day, month, year] = props.birthDate.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  if (
    dateObj.getDate() !== day ||
    dateObj.getMonth() + 1 !== month ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    loading.value = false;
    destinyNumber.value = null;
    destinyData.value = null;
    return;
  }

  loading.value = true;
  destinyNumber.value = null;
  destinyData.value = null;

  try {
    const calculatedNumber = calculateExpressionNumber(props.fullName);
    if (!calculatedNumber) {
      throw new Error('Không thể tính số sứ mệnh từ tên cung cấp');
    }

    destinyNumber.value = calculatedNumber;
    destinyData.value =
      destinyNumberData.destiny_numbers.find(
        (item) => item.number === calculatedNumber
      ) || {
        traits: `Số sứ mission ${calculatedNumber}.`,
        excellence: 'Chưa có dữ liệu chi tiết.',
        path: 'Hãy khám phá thêm về bản thân.',
        challenges: 'Chưa xác định thách thức cụ thể.',
      };
    console.log('Destiny data fetched:', destinyData.value);
  } catch (err) {
    console.error('Lỗi trong fetchDestinyData:', err);
    destinyNumber.value = null;
    destinyData.value = null;
  } finally {
    loading.value = false;
  }
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  console.log('Initializing auth for DestinyNumber...');
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
    errorMessage.value =
      'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    errorType.value = '';
  }
};

// Theo dõi props.birthDate và props.fullName
watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    console.log(
      'watch triggered, birthDate:',
      newBirthDate,
      'fullName:',
      newFullName
    );
    if (
      newBirthDate &&
      newFullName &&
      /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)
    ) {
      fetchDestinyData();
    } else {
      console.log('Dữ liệu không hợp lệ khi watch:', {
        newBirthDate,
        newFullName,
      });
      destinyNumber.value = null;
      destinyData.value = null;
    }
  },
  { immediate: false }
);

// Gọi khi mount
onMounted(() => {
  console.log(
    'Component mounted, birthDate:',
    props.birthDate,
    'fullName:',
    props.fullName
  );
  if (
    props.birthDate &&
    props.fullName &&
    /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)
  ) {
    fetchDestinyData();
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
