<template>
  <div class="mb-12 p-6 bg-white rounded-xl shadow-lg">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-teal-700 mb-3">Chu Kỳ Đường Đời</h2>
      <div class="w-24 h-1 bg-teal-500 mx-auto mb-4 rounded-full"></div>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Ba giai đoạn quan trọng trong cuộc đời mỗi người: Gieo Hạt, Chín Muồi và Thu Hoạch.
        Mỗi chu kỳ mang những bài học và cơ hội riêng.
      </p>
    </div>

    <div v-if="error" class="p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
      <div class="flex items-center text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <div v-else-if="lifePathCycles" class="mt-6">
      <transition name="fade-slide">
        <div>
          <!-- Chu kỳ đầu tiên (Gieo Hạt) - Luôn hiển thị -->
          <div 
            v-for="(cycle, index) in firstCycle" 
            :key="cycle.cycle"
            class="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-200"
            :class="cycleCardClasses[index]"
          >
            <div class="p-5">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-bold" :class="cycleTextColors[index]">
                  {{ cycle.cycle }}
                </h3>
                <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="cycleBadgeClasses[index]">
                  Số {{ cycle.number }}
                </span>
              </div>
              
              <div class="flex items-center text-sm text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ cycle.ageRange }} ({{ cycle.yearRange }})</span>
              </div>

              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ý nghĩa
                  </h4>
                  <p class="text-gray-600 text-sm">{{ cycle.description.meaning || 'Không có dữ liệu.' }}</p>
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Hướng dẫn
                  </h4>
                  <p class="text-gray-600 text-sm">{{ cycle.description.advice || 'Không có dữ liệu.' }}</p>
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Tác động chính
                  </h4>
                  <ul class="text-gray-600 text-sm space-y-1 pl-5">
                    <li v-for="(impact, i) in (cycle.description.impact?.split('\n') || ['Không có dữ liệu.'])" 
                        :key="i" class="relative pl-3">
                      <span class="absolute left-0 top-2 w-1.5 h-1.5 rounded-full" :class="cycleDotColors[index]"></span>
                      {{ impact }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="px-5 py-3 border-t" :class="cycleFooterClasses[index]">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium" :class="cycleTextColors[index]">Giai đoạn quan trọng</span>
                <span class="font-semibold">{{ cycle.percentage }}% ảnh hưởng</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div class="h-1.5 rounded-full" :class="cycleBarColors[index]" 
                     :style="{ width: `${cycle.percentage}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Các chu kỳ còn lại (Chín Muồi, Thu Hoạch) - Chỉ hiển thị khi isContentAccessible -->
          <div v-if="isContentAccessible" class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div 
              v-for="(cycle, index) in remainingCycles" 
              :key="cycle.cycle"
              class="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-200"
              :class="cycleCardClasses[index + 1]"
            >
              <div class="p-5">
                <div class="flex items-center justify-between mb-3">
                  <h3 class="text-lg font-bold" :class="cycleTextColors[index + 1]">
                    {{ cycle.cycle }}
                  </h3>
                  <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="cycleBadgeClasses[index + 1]">
                    Số {{ cycle.number }}
                  </span>
                </div>
                
                <div class="flex items-center text-sm text-gray-500 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{{ cycle.ageRange }} ({{ cycle.yearRange }})</span>
                </div>

                <div class="space-y-4">
                  <div>
                    <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Ý nghĩa
                    </h4>
                    <p class="text-gray-600 text-sm">{{ cycle.description.meaning || 'Không có dữ liệu.' }}</p>
                  </div>

                  <div>
                    <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Hướng dẫn
                    </h4>
                    <p class="text-gray-600 text-sm">{{ cycle.description.advice || 'Không có dữ liệu.' }}</p>
                  </div>

                  <div>
                    <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                      Tác động chính
                    </h4>
                    <ul class="text-gray-600 text-sm space-y-1 pl-5">
                      <li v-for="(impact, i) in (cycle.description.impact?.split('\n') || ['Không có dữ liệu.'])" 
                          :key="i" class="relative pl-3">
                        <span class="absolute left-0 top-2 w-1.5 h-1.5 rounded-full" :class="cycleDotColors[index + 1]"></span>
                        {{ impact }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div class="px-5 py-3 border-t" :class="cycleFooterClasses[index + 1]">
                <div class="flex items-center justify-between text-xs">
                  <span class="font-medium" :class="cycleTextColors[index + 1]">Giai đoạn quan trọng</span>
                  <span class="font-semibold">{{ cycle.percentage }}% ảnh hưởng</span>
                </div>
                <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                  <div class="h-1.5 rounded-full" :class="cycleBarColors[index + 1]" 
                       :style="{ width: `${cycle.percentage}%` }"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Phần thông báo lỗi, trạng thái tải, hoặc nút hành động -->
          <div v-if="remainingCycles.length > 0 && !isContentAccessible" class="text-center p-6">
            <div v-if="isLoading" class="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-md">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang kiểm tra quyền truy cập...
            </div>
            <div v-else-if="errorMessage && errorType === 'login'" class="text-red-600 font-medium">
              Vui lòng <button @click="errorAction" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">Đăng nhập</button> để xem tiếp.
            </div>
            <div v-else-if="errorMessage && errorType === 'topup'" class="text-red-600 font-medium">
              Không đủ token để xem tiếp. Hãy <button @click="navigateToTopup" class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap">Nạp thêm token</button>.
            </div>
            <div v-else-if="errorMessage" class="text-red-600 font-medium">
              {{ errorMessage }}
            </div>
            <div v-else-if="!userStore.isAuthenticated" class="text-center">
              <button
                @click="errorAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                :disabled="isLoading"
              >
                Đăng nhập để xem tiếp
              </button>
            </div>
            <div v-else-if="!hasSufficientTokens" class="text-center">
              <p class="text-red-600 font-medium mb-4">Không đủ token để xem tiếp. Cần {{ tokenCost }} token.</p>
              <button
                @click="navigateToTopup"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                :disabled="isLoading"
              >
                Nạp thêm token
              </button>
            </div>
            <div v-else class="text-center">
              <button
                @click="performAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
                :disabled="isLoading"
              >
                Xem tiếp (Cần {{ tokenCost }} token)
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div v-else-if="!error" class="text-center py-8">
      <div class="inline-flex flex-col items-center px-6 py-4 bg-gray-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500">Vui lòng nhập ngày sinh để xem phân tích chu kỳ đường đời</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { NumerologyUtils } from '~/utils/numerology-calculations';
import cycleDescriptions from '~/data/cycleDescriptions.json';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  birthDate: String
});

const router = useRouter();
const userStore = useUserStore();
const lifePathCycles = ref(null);
const error = ref('');
const tokenCost = ref(20); // Cập nhật chi phí thành 30 token
const description = 'Access to life path cycles analysis';
const { isLoading, errorMessage, errorType, isContentAccessible, hasSufficientTokens, checkAuthAndAccess, performAction, errorAction, navigateToTopup } = useProtectedContent(tokenCost.value, description);

// Màu sắc và style cho từng chu kỳ
const cycleCardClasses = [
  'border-cyan-100 bg-cyan-50',
  'border-lime-100 bg-lime-50',
  'border-amber-100 bg-amber-50'
];

const cycleBarColors = [
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500'
];

const cycleTextColors = [
  'text-cyan-700',
  'text-lime-700',
  'text-amber-700'
];

const cycleBadgeClasses = [
  'bg-cyan-100 text-cyan-800',
  'bg-lime-100 text-lime-800',
  'bg-amber-100 text-amber-800'
];

const cycleDotColors = [
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500'
];

const cycleFooterClasses = [
  'border-cyan-200 bg-cyan-100',
  'border-lime-200 bg-lime-100',
  'border-amber-200 bg-amber-100'
];

// Tạo mảng cho chu kỳ đầu tiên (Gieo Hạt)
const firstCycle = computed(() => {
  if (!lifePathCycles.value) return [];
  return [lifePathCycles.value[0]]; // Chỉ lấy chu kỳ Gieo Hạt
});

// Tạo mảng cho các chu kỳ còn lại (Chín Muồi, Thu Hoạch)
const remainingCycles = computed(() => {
  if (!lifePathCycles.value) return [];
  return lifePathCycles.value.slice(1); // Lấy các chu kỳ từ vị trí 1 trở đi
});

const initializeAuth = async () => {
  console.log('Initializing auth for NumerologyCycle...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated);
    await checkAuthAndAccess();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
  } catch (err) {
    console.error('Lỗi khi khởi tạo auth:', err);
    errorMessage.value = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    errorType.value = '';
  }
};

watch(() => props.birthDate, (newDate) => {
  error.value = '';
  lifePathCycles.value = null;

  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!newDate || !datePattern.test(newDate)) {
    error.value = 'Ngày sinh không hợp lệ! Vui lòng nhập định dạng dd/mm/yyyy';
    return;
  }

  try {
    const [day, month, year] = newDate.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2025) {
      error.value = 'Ngày sinh không hợp lệ! Vui lòng kiểm tra lại';
      return;
    }

    const cycles = [
      {
        cycle: 'Gieo Hạt',
        number: NumerologyUtils.reduceToSingleDigit(month),
        ageRange: '0 - 29 tuổi',
        yearRange: `${year} - ${year + 29}`,
        percentage: 30,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(month)]?.['Gieo Hạt'] || { meaning: 'Không có dữ liệu.', advice: 'Không có dữ liệu.', impact: 'Không có dữ liệu.' }
      },
      {
        cycle: 'Chín Muồi',
        number: NumerologyUtils.reduceToSingleDigit(day),
        ageRange: '30 - 56 tuổi',
        yearRange: `${year + 30} - ${year + 56}`,
        percentage: 40,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(day)]?.['Chín Muồi'] || { meaning: 'Không có dữ liệu.', advice: 'Không có dữ liệu.', impact: 'Không có dữ liệu.' }
      },
      {
        cycle: 'Thu Hoạch',
        number: NumerologyUtils.reduceToSingleDigit(year.toString().split('').reduce((a, b) => a + parseInt(b), 0)),
        ageRange: '57 tuổi trở đi',
        yearRange: `${year + 57}+`,
        percentage: 30,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(year.toString().split('').reduce((a, b) => a + parseInt(b), 0))]?.['Thu Hoạch'] || { meaning: 'Không có dữ liệu.', advice: 'Không có dữ liệu.', impact: 'Không có dữ liệu.' }
      }
    ];
    lifePathCycles.value = cycles;
  } catch (e) {
    error.value = e.message || 'Lỗi khi tính toán chu kỳ đường đời';
    console.error('Lỗi NumerologyCycle:', e);
  }
}, { immediate: true });

onMounted(() => {
  initializeAuth();
});
</script>

<style scoped>
/* Hiệu ứng transition */
.hover\:shadow-md {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.hover\:shadow-md:hover {
  transform: translateY(-2px);
}

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
