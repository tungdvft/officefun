```vue
<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Chọn Ngày Cưới Theo Thần Số Học</h1>
        <p class="text-lg text-gray-600">Tìm ngày tốt nhất cho hạnh phúc lứa đôi của bạn</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
        <div class="flex items-center mb-4">
          <span class="bg-purple-100 p-2 rounded-full mr-2">
            <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <h2 class="text-xl font-semibold text-purple-700">Thông tin hai người</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Thông tin người thứ nhất -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                Thông tin người thứ nhất
              </h3>
              <div>
                <label for="brideName" class="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input
                  v-model="formData.brideName"
                  type="text"
                  id="brideName"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.brideName ? 'border-red-500' : 'border-gray-300']"
                  @focus="clearError"
                />
                <p v-if="errors.brideName" class="text-red-600 text-sm mt-1">{{ errors.brideName }}</p>
              </div>
              <div>
                <label for="brideBirthdate" class="block text-sm font-medium text-gray-700 mt-3 mb-2">Ngày sinh (DD/MM/YYYY)</label>
                <input
                  v-model="formData.brideBirthdate"
                  type="text"
                  id="brideBirthdate"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.brideBirthdate ? 'border-red-500' : 'border-gray-300']"
                  @focus="clearError"
                />
                <p v-if="errors.brideBirthdate" class="text-red-600 text-sm mt-1">{{ errors.brideBirthdate }}</p>
              </div>
            </div>
          </div>

          <!-- Thông tin người thứ hai -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path>
                  </svg>
                </span>
                Thông tin người thứ hai
              </h3>
              <div>
                <label for="groomName" class="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input
                  v-model="formData.groomName"
                  type="text"
                  id="groomName"
  
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.groomName ? 'border-red-500' : 'border-gray-300']"
                  @focus="clearError"
                />
                <p v-if="errors.groomName" class="text-red-600 text-sm mt-1">{{ errors.groomName }}</p>
              </div>
              <div>
                <label for="groomBirthdate" class="block text-sm font-medium text-gray-700 mt-3 mb-2">Ngày sinh (DD/MM/YYYY)</label>
                <input
                  v-model="formData.groomBirthdate"
                  type="text"
                  id="groomBirthdate"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.groomBirthdate ? 'border-red-500' : 'border-gray-300']"
                  @focus="clearError"
                />
                <p v-if="errors.groomBirthdate" class="text-red-600 text-sm mt-1">{{ errors.groomBirthdate }}</p>
              </div>
            </div>
          </div>

          <!-- Khoảng thời gian -->
          <div class="space-y-4">
            <div class="bg-white p-4 rounded-lg border border-gray-200 hover:border-purple-300 transition-colors">
              <h3 class="text-sm font-medium text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Khoảng thời gian
              </h3>
              <div>
                <label for="startDate" class="block text-sm font-medium text-gray-700 mb-2">Từ ngày (DD/MM/YYYY)</label>
                <input
                  v-model="formData.startDate"
                  type="text"
                  id="startDate"
                  placeholder="VD: 01/06/2025"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.startDate ? 'border-red-500' : 'border-gray-300']"
                  @focus="clearError"
                />
                <p v-if="errors.startDate" class="text-red-600 text-sm mt-1">{{ errors.startDate }}</p>
              </div>
              <div>
                <label for="endDate" class="block text-sm font-medium text-gray-700 mt-3 mb-2">Đến ngày (DD/MM/YYYY)</label>
                <input
                  v-model="formData.endDate"
                  type="text"
                  id="endDate"
                  placeholder="VD: 30/06/2025"
                  :class="['w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base', errors.endDate ? 'border-red-500' : 'border-gray-300']"
                  @focus="clearError"
                />
                <p v-if="errors.endDate" class="text-red-600 text-sm mt-1">{{ errors.endDate }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Nút tìm ngày và thông báo lỗi -->
        <div v-if="isLoading || loading" class="flex justify-center pt-4">
          <svg class="animate-spin h-8 w-8 text-purple-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <div v-else-if="errorMessage" class="text-red-600 text-center font-medium p-6">
          <template v-if="errorType === 'login'">
            Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để tìm ngày cưới.
          </template>
          <template v-else-if="errorType === 'topup'">
            Không đủ token để tìm ngày cưới. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
          </template>
          <template v-else>
            {{ errorMessage }}
          </template>
        </div>
        <div v-else-if="errors.general" class="text-red-600 text-center font-medium p-6">
          {{ errors.general }}
        </div>
        <div v-else class="flex justify-center pt-4">
          <button
            @click="fetchWeddingDates"
            class="action-button"
          >
            {{ userStore.isAuthenticated ? `Tìm ngày cưới tốt nhất (Cần ${tokenCost} tokens)` : 'Đăng nhập để tìm ngày cưới' }}
          </button>
        </div>
      </div>

      <!-- Kết quả -->
      <transition name="slide-fade">
        <div v-if="result?.numerology && isContentAccessible" class="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <div class="flex items-center mb-4">
            <span class="bg-purple-100 p-2 rounded-full mr-2">
              <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <h2 class="text-xl font-semibold text-purple-700">Kết quả ngày cưới đề xuất</h2>
          </div>

          <!-- Thông tin cặp đôi -->
          <div class="bg-purple-50 p-6 rounded-xl border border-purple-100 mb-6">
            <h3 class="text-xl font-bold text-purple-800 mb-4">Thông số thần số học</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="text-lg font-semibold text-purple-700 mb-2 flex items-center">
                  <svg class="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Người thứ nhất: {{ formData.brideName }}
                </h4>
                <ul class="space-y-1">
                  <li class="flex justify-between"><span class="text-gray-600">Đường đời:</span> <span class="font-medium">{{ result.numerology.bride.lifePath }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Số linh hồn:</span> <span class="font-medium">{{ result.numerology.bride.soul }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Số định mệnh:</span> <span class="font-medium">{{ result.numerology.bride.destiny }}</span></li>
                </ul>
              </div>
              <div class="bg-white p-4 rounded-lg shadow-sm">
                <h4 class="text-lg font-semibold text-purple-700 mb-2 flex items-center">
                  <svg class="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Người thứ hai: {{ formData.groomName }}
                </h4>
                <ul class="space-y-1">
                  <li class="flex justify-between"><span class="text-gray-600">Đường đời:</span> <span class="font-medium">{{ result.numerology.groom.lifePath }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Số linh hồn:</span> <span class="font-medium">{{ result.numerology.groom.soul }}</span></li>
                  <li class="flex justify-between"><span class="text-gray-600">Số định mệnh:</span> <span class="font-medium">{{ result.numerology.groom.destiny }}</span></li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Ngày đề xuất -->
          <div>
            <h3 class="text-xl font-bold text-purple-800 mb-4">Ngày cưới đề xuất</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div v-for="(suggestion, index) in result.numerology.suggestions" :key="index"
                   class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div class="text-center mb-3">
                  <div class="text-3xl font-bold text-purple-600">{{ suggestion.dayNumber }}</div>
                  <div class="text-lg font-medium text-gray-700">{{ suggestion.date }}</div>
                  <div class="mt-2">
                    <span class="inline-flex items-center px-2 py-1 rounded-full text-sm font-medium"
                          :class="{
                            'bg-green-100 text-green-800': suggestion.compatibilityScore * 10 >= 80,
                            'bg-blue-100 text-blue-800': suggestion.compatibilityScore * 10 >= 60 && suggestion.compatibilityScore * 10 < 80,
                            'bg-yellow-100 text-yellow-800': suggestion.compatibilityScore * 10 >= 40 && suggestion.compatibilityScore * 10 < 60,
                            'bg-red-100 text-red-800': suggestion.compatibilityScore * 10 < 40
                          }">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ suggestion.compatibilityScore * 10 }}/100
                    </span>
                  </div>
                </div>
                <p class="text-gray-700 text-sm">{{ suggestion.desc }}</p>
              </div>
            </div>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-purple-50 p-6 rounded-xl border border-purple-100 mt-6">
            <h4 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
              <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Lời khuyên từ chuyên gia
            </h4>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.numerology.advice }}</p>
          </div>

          <!-- Nút xem thêm gợi ý -->
          <div v-if="result.numerology && isContentAccessible && totalSuggestions < maxSuggestions" class="flex justify-center mt-6">
            <button
              @click="showMoreSuggestions"
              class="action-button"
              :disabled="loadingMore || !hasSufficientTokensForMore"
            >
              <svg v-if="loadingMore" class="animate-spin h-5 w-5 mr-2 inline-block text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {{ loadingMore ? 'Đang tải...' : userStore.isAuthenticated ? `Xem thêm gợi ý (Cần ${tokenCostMore} tokens)` : 'Đăng nhập để xem thêm' }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';
import { useRouter } from 'vue-router';

definePageMeta({ layout: 'view' });

const router = useRouter();
const userStore = useUserStore();

// Form state
const formData = ref({
  brideName: '',
  brideBirthdate: '',
  groomName: '',
  groomBirthdate: '',
  startDate: '',
  endDate: ''
});
const errors = ref({
  brideName: '',
  brideBirthdate: '',
  groomName: '',
  groomBirthdate: '',
  startDate: '',
  endDate: '',
  general: ''
});
const result = ref(null);
const loading = ref(false);
const loadingMore = ref(false);
const totalSuggestions = ref(0);
const maxSuggestions = ref(5);
const tokenCost = ref(30);
const tokenCostMore = ref(5);
const description = 'Access to wedding date selection based on numerology';
const {
  isLoading,
  errorMessage,
  errorType,
  isContentAccessible,
  hasSufficientTokens,
  checkAuthAndAccess,
  performAction,
  errorAction,
  navigateToTopup
} = useProtectedContent(tokenCost.value, description);
const hasSufficientTokensForMore = ref(true);

// Hàm lưu vào localStorage
const saveToLocalStorage = () => {
  localStorage.setItem('weddingDateSelectorForm', JSON.stringify(formData.value));
  localStorage.setItem('weddingDateSelectorResult', JSON.stringify(result.value));
};

// Hàm tải từ localStorage
const loadFromLocalStorage = () => {
  const savedForm = localStorage.getItem('weddingDateSelectorForm');
  const savedResult = localStorage.getItem('weddingDateSelectorResult');
  if (savedForm) {
    formData.value = JSON.parse(savedForm);
  }
  if (savedResult) {
    result.value = JSON.parse(savedResult);
    totalSuggestions.value = result.value?.numerology?.suggestions?.length || 0;
  }
};

// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return dateStr;
  const [_, year, month, day] = match;
  return `${day}/${month}/${year}`;
};

// Hàm xóa lỗi
const clearError = () => {
  errors.value = {
    brideName: '',
    brideBirthdate: '',
    groomName: '',
    groomBirthdate: '',
    startDate: '',
    endDate: '',
    general: ''
  };
  errorMessage.value = '';
};

// Hàm lấy thông tin người dùng từ API
const fetchUserData = async () => {
  if (!userStore.isAuthenticated || !userStore.user?.id) {
    console.log('User not authenticated, skipping fetchUserData');
    return;
  }

  try {
    const userIdValue = String(userStore.user.id);
    console.log('Fetching user data for userId:', userIdValue);
    const response = await $fetch(`/api/users/${userIdValue}`, {
      method: 'GET'
    });
    console.log('API /api/users response:', response);
    formData.value.brideName = response.user.fullname?.trim() || '';
    formData.value.brideBirthdate = response.user.birthdate ? formatDateToDDMMYYYY(response.user.birthdate.split('T')[0]) : '';
  } catch (err) {
    console.error('Error fetching user data:', err);
    errors.value.general = err.data?.message || 'Không thể tải thông tin tài khoản. Vui lòng nhập thủ công.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Hàm kiểm tra số dư token
const checkTokenBalance = async (requiredTokens) => {
  if (!userStore.isAuthenticated || !userStore.user?.id) {
    console.log('User not authenticated, setting hasSufficientTokensForMore to false');
    hasSufficientTokensForMore.value = false;
    return false;
  }

  try {
    const response = await $fetch('/api/check-token-balance', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(userStore.user.email),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: { userId: String(userStore.user.id), requiredTokens }
    });
    console.log(`Check token balance response:`, response);
    hasSufficientTokensForMore.value = response.hasSufficientTokens;
    return response.hasSufficientTokens;
  } catch (error) {
    console.error('Error checking token balance:', error);
    errors.value.general = error.data?.message || 'Không thể kiểm tra số dư token!';
    toast.error(errors.value.general, { position: 'top-center' });
    hasSufficientTokensForMore.value = false;
    return false;
  }
};

// Khởi tạo trạng thái đăng nhập và kiểm tra token
const initializeAuth = async () => {
  console.log('Initializing auth for WeddingDateSelector...');
  try {
    await userStore.initialize();
    console.log('User Store Initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
    await checkAuthAndAccess();
    console.log('Auth checked, isContentAccessible:', isContentAccessible.value, 'hasSufficientTokens:', hasSufficientTokens.value);
    if (userStore.isAuthenticated) {
      await checkTokenBalance(tokenCostMore.value);
    }
  } catch (err) {
    console.error('Error initializing auth:', err);
    errors.value.general = 'Không thể khởi tạo trạng thái đăng nhập. Vui lòng thử lại.';
    toast.error(errors.value.general, { position: 'top-center' });
  }
};

// Hàm validate form
const validateForm = () => {
  errors.value = {
    brideName: '',
    brideBirthdate: '',
    groomName: '',
    groomBirthdate: '',
    startDate: '',
    endDate: '',
    general: ''
  };
  let isValid = true;

  // Kiểm tra trường trống
  if (!formData.value.brideName.trim()) {
    errors.value.brideName = 'Vui lòng nhập họ tên người thứ nhất';
    isValid = false;
  }
  if (!formData.value.brideBirthdate.trim()) {
    errors.value.brideBirthdate = 'Vui lòng nhập ngày sinh người thứ nhất';
    isValid = false;
  }
  if (!formData.value.groomName.trim()) {
    errors.value.groomName = 'Vui lòng nhập họ tên người thứ hai';
    isValid = false;
  }
  if (!formData.value.groomBirthdate.trim()) {
    errors.value.groomBirthdate = 'Vui lòng nhập ngày sinh người thứ hai';
    isValid = false;
  }
  if (!formData.value.startDate.trim()) {
    errors.value.startDate = 'Vui lòng nhập ngày bắt đầu';
    isValid = false;
  }
  if (!formData.value.endDate.trim()) {
    errors.value.endDate = 'Vui lòng nhập ngày kết thúc';
    isValid = false;
  }

  // Kiểm tra định dạng ngày
  const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const validateDate = (dateStr, field) => {
    if (!dateStr) return true;
    const match = dateStr.match(dateRegex);
    if (!match) {
      errors.value[field] = 'Ngày không đúng định dạng DD/MM/YYYY';
      return false;
    }
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() + 1 !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      (field === 'startDate' || field === 'endDate' ? year > new Date().getFullYear() + 5 : year > new Date().getFullYear())
    ) {
      errors.value[field] = 'Ngày không hợp lệ';
      return false;
    }
    return true;
  };

  if (formData.value.brideBirthdate && !validateDate(formData.value.brideBirthdate, 'brideBirthdate')) {
    isValid = false;
  }
  if (formData.value.groomBirthdate && !validateDate(formData.value.groomBirthdate, 'groomBirthdate')) {
    isValid = false;
  }
  if (formData.value.startDate && !validateDate(formData.value.startDate, 'startDate')) {
    isValid = false;
  }
  if (formData.value.endDate && !validateDate(formData.value.endDate, 'endDate')) {
    isValid = false;
  }

  // Kiểm tra startDate < endDate
  if (formData.value.startDate && formData.value.endDate) {
    const startMatch = formData.value.startDate.match(dateRegex);
    const endMatch = formData.value.endDate.match(dateRegex);
    if (startMatch && endMatch) {
      const startDate = new Date(parseInt(startMatch[3]), parseInt(startMatch[2]) - 1, parseInt(startMatch[1]));
      const endDate = new Date(parseInt(endMatch[3]), parseInt(endMatch[2]) - 1, parseInt(endMatch[1]));
      if (startDate > endDate) {
        errors.value.endDate = 'Ngày kết thúc phải sau ngày bắt đầu';
        isValid = false;
      }
    }
  }

  return isValid;
};

// Hàm tìm ngày cưới
const fetchWeddingDates = async () => {
  if (!process.client) {
    console.warn('fetchWeddingDates called on server-side, ignoring.');
    return;
  }
  if (!validateForm()) {
    return;
  }

  if (isContentAccessible.value) {
    await getWeddingDates();
  } else {
    try {
      await performAction();
      if (isContentAccessible.value) {
        await getWeddingDates();
      } else {
        toast.error(errorMessage.value, { position: 'top-center' });
      }
    } catch (err) {
      console.error('Error in performAction:', err);
      toast.error(errorMessage.value || 'Có lỗi khi kiểm tra quyền truy cập', { position: 'top-center' });
    }
  }
};

// Hàm lấy dữ liệu ngày cưới từ API
async function getWeddingDates() {
  loading.value = true;
  errors.value.general = '';
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    console.log('Sending request to /api/numerology/wedding-date with data:', formData.value);
    const response = await $fetch('/api/numerology/wedding-date', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: { ...formData.value, suggestionCount: 3 }
    });
    console.log('Response from /api/numerology/wedding-date:', response);
    result.value = response;
    totalSuggestions.value = response.numerology.suggestions.length;
    await checkTokenBalance(tokenCostMore.value);
    toast.success('Đã tìm thấy ngày cưới tốt nhất!', { position: 'top-center' });
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="result?.numerology && isContentAccessible"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    console.error('Error in getWeddingDates:', error);
    errors.value.general = error.data?.message || 'Không thể tìm ngày cưới!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
}

// Hàm xem thêm gợi ý
async function showMoreSuggestions() {
  if (totalSuggestions.value >= maxSuggestions.value) {
    console.log('Reached maximum suggestions:', maxSuggestions.value);
    errors.value.general = 'Đã đạt số lượng gợi ý tối đa!';
    toast.error(errors.value.general, { position: 'top-center' });
    return;
  }

  if (!process.client) {
    console.warn('showMoreSuggestions called on server-side, ignoring.');
    return;
  }

  const sufficientTokens = await checkTokenBalance(tokenCostMore.value);
  console.log('Token balance sufficient:', sufficientTokens);
  if (!sufficientTokens) {
    errors.value.general = 'Bạn không có đủ token để xem thêm gợi ý! Hãy nạp thêm token.';
    toast.error(errors.value.general, { position: 'top-center' });
    return;
  }

  loadingMore.value = true;
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    console.log('Sending request to /api/numerology/wedding-date for more suggestions');
    const response = await $fetch('/api/numerology/wedding-date', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        brideName: formData.value.brideName,
        brideBirthdate: formData.value.brideBirthdate,
        groomName: formData.value.groomName,
        groomBirthdate: formData.value.groomBirthdate,
        startDate: formData.value.startDate,
        endDate: formData.value.endDate,
        suggestionCount: 1,
        excludeSuggestions: result.value.numerology.suggestions.map(s => s.date)
      }
    });
    console.log('Response from /api/numerology/wedding-date (more suggestions):', response);
    result.value.numerology.suggestions.push(...response.numerology.suggestions);
    totalSuggestions.value += response.numerology.suggestions.length;
    await checkTokenBalance(tokenCostMore.value);
    toast.success('Đã tải thêm gợi ý ngày cưới!', { position: 'top-center' });
  } catch (error) {
    console.error('Error in showMoreSuggestions:', error);
    errors.value.general = error.data?.message || 'Không thể tải thêm gợi ý!';
    toast.error(errors.value.general, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
    console.log('showMoreSuggestions completed, loadingMore:', loadingMore.value);
  }
}

// Tải dữ liệu khi component được mounted
onMounted(() => {
  console.log('Component mounted, isStoreInitialized:', userStore.isStoreInitialized);
  loadFromLocalStorage();
  if (userStore.isStoreInitialized) {
    initializeAuth();
    fetchUserData();
  }
});

// Theo dõi thay đổi để lưu vào localStorage
watch(formData, () => {
  saveToLocalStorage();
}, { deep: true });

watch(result, () => {
  saveToLocalStorage();
}, { deep: true });

// Theo dõi isStoreInitialized để lấy dữ liệu khi store sẵn sàng
watch(() => userStore.isStoreInitialized, (initialized) => {
  if (initialized && process.client) {
    console.log('User store initialized, running initializeAuth and fetchUserData');
    initializeAuth();
    fetchUserData();
  }
});
</script>

<style scoped>
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md;
}

::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}

@media (max-width: 640px) {
  .container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  h1 {
    font-size: 1.875rem;
  }
}
</style>
```