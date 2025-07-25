<template>
  <div class="mb-10 p-6 bg-white rounded-xl shadow-md">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-teal-700 mb-3">Nhóm tính cách theo bản ngã</h2>
      <div class="w-24 h-1 bg-teal-500 mx-auto mb-4 rounded-full"></div>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Nhận diện nhóm tính cách đặc trưng qua Thần số học
      </p>
      <p class="text-base text-gray-600 max-w-2xl mx-auto mt-2">
        Dựa trên số đường đời, Thần số học phân tích bản ngã để xác định các nhóm tính cách nổi bật, giúp bạn hiểu rõ điểm mạnh và điểm yếu của mình.
      </p>
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
      <div class="flex items-center text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <div v-else-if="!personalityGroups" class="mt-6 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Vui lòng nhập ngày sinh hợp lệ để xem phân tích nhóm tính cách
      </p>
    </div>

    <div v-else class="mt-6 space-y-5">
      <transition name="fade-slide">
        <div>
          <!-- 2 nhóm đầu tiên (luôn hiển thị) -->
          <div 
            v-for="(group, index) in firstTwoGroups" 
            :key="group.group"
            class="group transition-all duration-200 hover:shadow-sm mb-2"
          >
            <div class="flex items-center justify-between mb-1">
              <h4 class="font-medium text-gray-800">
                <span class="inline-block w-6 h-6 rounded-full mr-2 text-white text-sm flex items-center justify-center"
                      :class="personalityBadgeColors[index]">
                  {{ index + 1 }}
                </span>
                {{ group.group }}
                <span class="text-xs font-normal text-gray-500 ml-2">({{ group.traits }})</span>
              </h4>
              <span class="font-medium" :class="percentageColor(group.percentage)">
                {{ group.percentage }}%
              </span>
            </div>
            
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                class="h-2.5 rounded-full transition-all duration-500 ease-out" 
                :class="personalityBarColors[index]"
                :style="{ width: `${group.percentage}%` }"
              ></div>
            </div>
          </div>

          <!-- Các nhóm còn lại (hiển thị khi isContentAccessible) -->
          <template v-if="isContentAccessible">
            <div 
              v-for="(group, index) in remainingGroups" 
              :key="group.group"
              class="group transition-all duration-200 hover:shadow-sm mb-2"
            >
              <div class="flex items-center justify-between mb-1">
                <h4 class="font-medium text-gray-800">
                  <span class="inline-block w-6 h-6 rounded-full mr-2 text-white text-sm flex items-center justify-center"
                        :class="personalityBadgeColors[index + firstTwoGroups.length]">
                    {{ index + firstTwoGroups.length + 1 }}
                  </span>
                  {{ group.group }}
                  <span class="text-xs font-normal text-gray-500 ml-2">({{ group.traits }})</span>
                </h4>
                <span class="font-medium" :class="percentageColor(group.percentage)">
                  {{ group.percentage }}%
                </span>
              </div>
              
              <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  class="h-2.5 rounded-full transition-all duration-500 ease-out" 
                  :class="personalityBarColors[index + firstTwoGroups.length]"
                  :style="{ width: `${group.percentage}%` }"
                ></div>
              </div>
            </div>
          </template>

          <!-- Nút hành động hoặc thông báo -->
          <div v-if="remainingGroups.length > 0 && !isContentAccessible" class="text-center p-6">
            <div v-if="isLoading" class="inline-flex items-center px-4 py-2 text-sm font-medium text-teal-700 bg-teal-100 rounded-md">
              <svg class="animate-spin -ml-1 mr-2 h-5 w-5 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Đang kiểm tra quyền truy cập...
            </div>
            <div v-else-if="errorMessage && errorType === 'login'" class="text-red-600 font-medium">
              Vui lòng <button @click="errorAction" class="px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md">Đăng nhập</button> để xem tiếp.
            </div>
            <div v-else-if="errorMessage && errorType === 'topup'" class="text-red-600 font-medium">
              Không đủ token để xem tiếp. Hãy <button @click="navigateToTopup" class="px-4 py-2 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md">Nạp thêm token</button>.
            </div>
            <div v-else-if="errorMessage" class="text-red-600 font-medium">
              {{ errorMessage }}
            </div>
            <div v-else-if="!userStore.isAuthenticated" class="text-center">
              <button
                @click="errorAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md"
                :disabled="isLoading"
              >
                Đăng nhập để xem tiếp
              </button>
            </div>
            <div v-else-if="!hasSufficientTokens" class="text-red-600 text-center font-medium ">
              Không đủ token cho tính năng này. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
              <!-- <p class="text-gray-600 mt-2">Số dư token: {{ userStore.user?.tokens || 0 }}</p> -->
            </div>
            <div v-else class="text-center">
              <button
                @click="performAction"
                class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md"
                :disabled="isLoading"
              >
                Xem tiếp (Cần {{ tokenCost }} token)
              </button>
              <!-- <p class="text-gray-600 mt-2">Số dư token: {{ userStore.user?.tokens || 0 }}</p> -->
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { calculateLifePathNumber } from '~/utils/numerology-calculations';
import lifePathData from '~/data/lifePathData.json';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

const props = defineProps({
  birthDate: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const userStore = useUserStore();
const personalityGroups = ref(null);
const error = ref('');
const tokenCost = ref(10); // Cập nhật chi phí thành 10 token
const description = 'Access to personality groups analysis';
const { isLoading, errorMessage, errorType, isContentAccessible, hasSufficientTokens, checkAuthAndAccess, performAction, errorAction, navigateToTopup } = useProtectedContent(tokenCost.value, description);

// Màu sắc cho thanh tiến trình
const personalityBarColors = [
  'bg-gradient-to-r from-red-500 to-red-400',
  'bg-gradient-to-r from-blue-500 to-blue-400',
  'bg-gradient-to-r from-green-500 to-green-400',
  'bg-gradient-to-r from-yellow-500 to-yellow-400',
  'bg-gradient-to-r from-purple-500 to-purple-400',
  'bg-gradient-to-r from-pink-500 to-pink-400',
  'bg-gradient-to-r from-indigo-500 to-indigo-400',
  'bg-gradient-to-r from-teal-500 to-teal-400',
  'bg-gradient-to-r from-orange-500 to-orange-400'
];

// Màu sắc cho badge số thứ tự
const personalityBadgeColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500'
];

// Tạo hai mảng cho các nhóm tính cách
const firstTwoGroups = computed(() => {
  if (!personalityGroups.value) return [];
  return [...personalityGroups.value].sort((a, b) => a.percentage - b.percentage).slice(0, 2);
});

const remainingGroups = computed(() => {
  if (!personalityGroups.value) return [];
  return [...personalityGroups.value].sort((a, b) => a.percentage - b.percentage).slice(2);
});

// Màu sắc cho phần trăm dựa trên giá trị
const percentageColor = (percent) => {
  if (percent < 20) return 'text-red-600';
  if (percent < 40) return 'text-yellow-600';
  if (percent < 60) return 'text-blue-600';
  if (percent < 80) return 'text-green-600';
  return 'text-purple-600';
};

const initializeAuth = async () => {
  console.log('Initializing auth for PersonalityGroups...');
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

watch(() => props.birthDate, (newDate) => {
  error.value = '';
  personalityGroups.value = null;

  if (!newDate) {
    error.value = 'Vui lòng nhập ngày sinh!';
    return;
  }

  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!datePattern.test(newDate)) {
    error.value = 'Ngày sinh không hợp lệ! Vui lòng nhập định dạng dd/mm/yyyy.';
    return;
  }

  try {
    const lifePath = calculateLifePathNumber(newDate);
    const result = lifePathData.find((item) => item.lifePathNumber === lifePath);
    
    if (!result || !result.personalityGroups) {
      error.value = 'Không tìm thấy dữ liệu nhóm tính cách cho số đường đời này!';
      return;
    }
    
    personalityGroups.value = result.personalityGroups.map(group => ({
      ...group,
      percentage: Math.min(100, Math.max(0, group.percentage)) // Đảm bảo % trong khoảng 0-100
    }));
    
  } catch (e) {
    error.value = e.message || 'Lỗi khi tính nhóm tính cách!';
    console.error('Lỗi PersonalityGroups:', e);
  }
}, { immediate: true });

onMounted(() => {
  initializeAuth();
});
</script>

<style scoped>
/* Thêm hiệu ứng mượt mà cho thanh progress */
.bg-gradient-to-r {
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
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
