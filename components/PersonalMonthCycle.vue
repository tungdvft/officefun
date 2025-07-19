<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <!-- Phần không bảo vệ (Tiêu đề, mô tả, bảng tóm tắt 3 tháng) -->
      <div v-for="section in introSection" :key="section.title" class="space-y-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-teal-700 mb-2">{{ section.title }}</h2>
          <p class="text-lg text-gray-600">{{ section.description }}</p>
        </div>
        <div v-if="section.type === 'monthTable' && monthData && monthData.length" class="bg-gradient-to-r from-teal-50 to-blue-50 p-6 rounded-2xl border border-teal-100 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-6 text-center">
            Chu Kỳ {{ monthData[0]?.month }}/{{ monthData[0]?.year }} - {{ monthData[2]?.month }}/{{ monthData[2]?.year }}
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div v-for="(month, index) in monthData" :key="index" class="bg-white p-4 rounded-lg shadow border border-gray-200 text-center">
              <div class="text-2xl font-bold text-teal-600 mb-1">{{ month.number }}</div>
              <div class="text-sm text-gray-500">Tháng {{ month.month }}/{{ month.year }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Phần thông báo lỗi, trạng thái tải, hoặc nội dung được bảo vệ -->
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Vui lòng đăng nhập để xem tiếp</h4>
            <button @click="errorAction" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">
              Đăng nhập
            </button>
          </div>

          <!-- Lỗi thiếu token -->
          <div v-else-if="errorMessage && errorType === 'topup'" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Không đủ token để xem tiếp</h4>
            <p class="text-gray-600 text-sm mt-1">Cần {{ tokenCost }} token. Vui lòng nạp thêm.</p>
            <button @click="navigateToTopup" class="mt-4 px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">
              Nạp thêm token
            </button>
          </div>

          <!-- Lỗi chung -->
          <div v-else-if="errorMessage" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
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
              <span class="text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>

          <!-- Lỗi dữ liệu -->
          <div v-else-if="!monthData || !monthData.length" class="text-center py-12 bg-red-50 rounded-lg">
            <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h4 class="text-red-600 font-medium text-lg">Không có dữ liệu</h4>
            <p class="text-gray-600 mt-1">Vui lòng nhập ngày sinh hợp lệ</p>
          </div>

          <!-- Yêu cầu đăng nhập hoặc mở khóa nội dung -->
          <div v-else-if="!isContentAccessible" class="text-center py-12">
            <div v-if="!userStore.isAuthenticated">
              <p class="text-gray-600 mb-4">Vui lòng đăng nhập để xem giải thích chi tiết.</p>
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

          <!-- Nội dung được bảo vệ (Giải thích chi tiết) -->
          <div v-else class="space-y-6">
            <div v-for="section in protectedSections" :key="section.title">
              <h3 class="text-2xl font-bold text-teal-700 text-center mb-6">{{ section.title }}</h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="(month, index) in section.months" :key="index" class="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                  <div class="bg-teal-500 px-6 py-4 text-white">
                    <div class="flex items-center">
                      <div class="text-3xl font-bold mr-3">{{ month.number }}</div>
                      <div>
                        <h4 class="text-lg font-semibold">Tháng {{ month.month }}/{{ month.year }}</h4>
                        <p class="text-teal-100 text-sm">Chu kỳ cá nhân</p>
                      </div>
                    </div>
                  </div>
                  <div class="p-6 space-y-4">
                    <div>
                      <h5 class="font-bold text-gray-800 mb-2 flex items-center">
                        <svg class="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        Năng lượng chủ đạo
                      </h5>
                      <p class="text-gray-600 text-sm leading-relaxed">{{ month.events }}</p>
                    </div>
                    <div class="pt-3 border-t border-gray-100">
                      <h5 class="font-bold text-gray-800 mb-2 flex items-center">
                        <svg class="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Lời khuyên
                      </h5>
                      <p class="text-gray-600 text-sm leading-relaxed">{{ month.focus }}</p>
                    </div>
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
import { ref, computed, watch, onMounted } from 'vue';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';
import personalMonthData from '~/data/PersonalMonthData.json';

const props = defineProps({
  birthDate: {
    type: String,
    default: '',
    validator: (value) => {
      if (!value) return true;
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    },
  },
});

const router = useRouter();
const userStore = useUserStore();
const monthData = ref([]);
const loading = ref(false);
const tokenCost = ref(5);
const description = 'Access to detailed monthly numerology predictions';
const { isLoading, errorMessage, errorType, isContentAccessible, hasSufficientTokens, checkAuthAndAccess, performAction, errorAction, navigateToTopup } = useProtectedContent(tokenCost.value, description);

// Phần không bảo vệ (Tiêu đề, mô tả, bảng tóm tắt 3 tháng)
const introSection = computed(() => [
  {
    title: 'Các Chỉ Số Tháng',
    description: 'Dự báo năng lượng 3 tháng tới',
    type: 'header',
  },
  {
    title: 'Bảng Tóm Tắt 3 Tháng',
    type: 'monthTable',
  },
]);

// Phần được bảo vệ (Giải thích chi tiết)
const protectedSections = computed(() => [
  {
    title: 'Luận Giải Chi Tiết',
    months: monthData.value || [],
  },
]);

// Tính số năm cá nhân
const calculatePersonalYear = (day, month, year) => {
  const sum = day.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0) +
              month.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0) +
              year.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  if ([11, 22].includes(sum)) return sum;
  let result = sum;
  while (result > 9) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result;
};

// Tính số tháng cá nhân
const calculatePersonalMonth = (personalYear, month) => {
  const sum = personalYear + month;
  if ([11, 22].includes(sum)) return sum;
  let result = sum;
  while (result > 9) {
    result = result.toString().split('').reduce((acc, digit) => acc + parseInt(digit), 0);
  }
  return result;
};

// Lấy và xử lý dữ liệu
const fetchMonthData = async () => {
  console.log('fetchMonthData called with birthDate:', props.birthDate);

  if (!props.birthDate) {
    loading.value = false;
    monthData.value = [];
    return;
  }

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    loading.value = false;
    monthData.value = [];
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
    monthData.value = [];
    return;
  }

  loading.value = true;
  monthData.value = [];

  try {
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const months = [];
    let year = currentYear;
    let month = currentMonth;
    for (let i = 0; i < 3; i++) {
      const personalYear = calculatePersonalYear(day, month, year);
      const personalMonth = calculatePersonalMonth(personalYear, month);
      const monthInfo = personalMonthData.personal_months.find((item) => item.number === personalMonth) || {
        events: `Tháng ${month}/${year} với số ${personalMonth}.`,
        focus: 'Tập trung vào mục tiêu ngắn hạn và duy trì sự cân bằng.',
      };
      months.push({
        year,
        month,
        number: personalMonth,
        events: monthInfo.events,
        focus: monthInfo.focus,
      });
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }

    monthData.value = months;
    console.log('monthData:', monthData.value);
  } catch (err) {
    console.error('Lỗi khi lấy dữ liệu:', err);
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const months = [];
    const sampleMonthData = {
      '2025-7': {
        number: 4,
        events: 'Công việc ổn định hơn, cơ hội tổ chức và xây dựng nền tảng vững chắc. Có thể đối mặt với khối lượng công việc lớn hoặc cần sắp xếp lại cuộc sống.',
        focus: 'Lập kế hoạch chi tiết cho công việc và tài chính. Hoàn thành các nhiệm vụ đang dở. Tập trung vào kỷ luật và tổ chức.',
      },
      '2025-8': {
        number: 5,
        events: 'Thay đổi bất ngờ, cơ hội mới trong công việc hoặc mối quan hệ. Có thể xuất hiện cơ hội du lịch hoặc trải nghiệm mới.',
        focus: 'Thử nghiệm ý tưởng mới, linh hoạt với thay đổi. Tận dụng cơ hội để học hỏi và mở rộng mạng lưới quan hệ.',
      },
      '2025-9': {
        number: 6,
        events: 'Tập trung vào gia đình và các mối quan hệ. Có thể phải giải quyết trách nhiệm cá nhân hoặc hỗ trợ người thân.',
        focus: 'Chăm sóc người thân, tạo môi trường hài hòa. Dành thời gian xây dựng các mối quan hệ bền vững.',
      },
    };
    let year = currentYear;
    let month = currentMonth;
    for (let i = 0; i < 3; i++) {
      const key = `${year}-${month}`;
      const personalYear = calculatePersonalYear(day, month, year);
      const personalMonth = calculatePersonalMonth(personalYear, month);
      const monthInfo = sampleMonthData[key] || {
        number: personalMonth,
        events: `Tháng ${month}/${year} với số ${personalMonth}.`,
        focus: 'Tập trung vào mục tiêu ngắn hạn và duy trì sự cân bằng.',
      };
      months.push({
        year,
        month,
        number: monthInfo.number,
        events: monthInfo.events,
        focus: monthInfo.focus,
      });
      month++;
      if (month > 12) {
        month = 1;
        year++;
      }
    }
    monthData.value = months;
  } finally {
    loading.value = false;
  }
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  console.log('Initializing auth for MonthlyNumerology...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
    await checkAuthAndAccess();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errorMessage.value = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    errorType.value = '';
  }
};

// Theo dõi props.birthDate
watch(() => props.birthDate, (newValue) => {
  console.log('watch birthDate triggered:', newValue);
  if (newValue && /^\d{2}\/\d{2}\/\d{4}$/.test(newValue)) {
    fetchMonthData();
    initializeAuth();
  } else {
    console.log('birthDate không hợp lệ khi watch:', newValue);
    monthData.value = [];
  }
});

// Gọi khi mount
onMounted(() => {
  console.log('Component mounted, birthDate:', props.birthDate);
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchMonthData();
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
