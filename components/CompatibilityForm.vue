<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8">
    <div class="container mx-auto px-4">
      <!-- Header -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Xem mức độ hòa hợp</h1>
        <p class="text-lg text-gray-600">Khám phá sự tương hợp trong mối quan hệ của bạn</p>
      </div>

      <!-- Form -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
        <div class="space-y-6">
          <!-- Person Cards -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Person 1 Card -->
            <div class="space-y-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <h2 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </span>
                Thông tin người thứ nhất
              </h2>
              <div>
                <label for="name1" class="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input
                  v-model="name1"
                  id="name1"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
                  placeholder="Nhập họ tên"
                  required
                  @focus="clearError"
                />
              </div>
              <div>
                <label for="dob1" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                <input
                  v-model="dob1"
                  id="dob1"
                  type="date"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
                  required
                  @focus="clearError"
                  :max="maxDate"
                />
                <p v-if="dob1 && lifePath1" class="text-sm mt-2 text-purple-600">
                  Số đường đời: {{ lifePath1 }} {{ isMasterNumber(lifePath1) ? '(Số đặc biệt)' : '' }}
                </p>
              </div>
            </div>

            <!-- Person 2 Card -->
            <div class="space-y-4 p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors">
              <h2 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                </span>
                Thông tin người thứ hai
              </h2>
              <div>
                <label for="name2" class="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
                <input
                  v-model="name2"
                  id="name2"
                  type="text"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
                  placeholder="Nhập họ tên"
                  required
                  @focus="clearError"
                />
              </div>
              <div>
                <label for="dob2" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                <input
                  v-model="dob2"
                  id="dob2"
                  type="date"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
                  required
                  @focus="clearError"
                  :max="maxDate"
                />
                <p v-if="dob2 && lifePath2" class="text-sm mt-2 text-purple-600">
                  Số đường đời: {{ lifePath2 }} {{ isMasterNumber(lifePath2) ? '(Số đặc biệt)' : '' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Relationship Type -->
          <div class="space-y-2">
            <h2 class="text-lg font-semibold text-purple-700 flex items-center">
              <span class="bg-purple-100 p-2 rounded-full mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-1a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v1h-3zM4.75 12.094A5.973 5.973 0 004 15v1H1v-1a3 3 0 013.75-2.906z" />
                </svg>
              </span>
              Loại mối quan hệ
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition"
                     :class="{'border-purple-300 bg-purple-50': relationshipType === 'Người yêu'}">
                <input
                  v-model="relationshipType"
                  type="radio"
                  value="Người yêu"
                  class="mr-2 text-purple-600 focus:ring-purple-500"
                  required
                  @focus="clearError"
                />
                <div>
                  <p class="font-medium text-gray-800">Người yêu</p>
                  <p class="text-xs text-gray-600">Đang hẹn hò, yêu đương</p>
                </div>
              </label>
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition"
                     :class="{'border-purple-300 bg-purple-50': relationshipType === 'Vợ chồng'}">
                <input
                  v-model="relationshipType"
                  type="radio"
                  value="Vợ chồng"
                  class="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p class="font-medium text-gray-800">Vợ chồng</p>
                  <p class="text-xs text-gray-600">Đã kết hôn hoặc sắp cưới</p>
                </div>
              </label>
              <label class="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-purple-50 transition"
                     :class="{'border-purple-300 bg-purple-50': relationshipType === 'Đối tác'}">
                <input
                  v-model="relationshipType"
                  type="radio"
                  value="Đối tác"
                  class="mr-2 text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <p class="font-medium text-gray-800">Đối tác</p>
                  <p class="text-xs text-gray-600">Hợp tác làm ăn, kinh doanh</p>
                </div>
              </label>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="flex justify-center pt-4">
            <button
              type="button"
              @click="handleSubmit"
              :disabled="isLoading || !hasSufficientTokens"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="isLoading || loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ isLoading ? 'Đang kiểm tra quyền truy cập...' : 'Đang tính toán...' }}
              </span>
              <span v-else>{{ isLoggedIn ? `Xem kết quả (Cần ${tokenCost} tokens)` : 'Đăng nhập để xem kết quả' }}</span>
            </button>
          </div>
          <!-- Error Message -->
          <transition name="slide-fade">
            <div v-if="error" class="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-md">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                </svg>
                <strong class="font-medium">Lỗi:</strong>
              </div>
              <p class="mt-1 ml-7">{{ error }}</p>
              <p v-if="hasSufficientTokens === false" class="mt-1 ml-7 text-sm">Bạn không có đủ token. Vui lòng nạp thêm.</p>
            </div>
          </transition>
        </div>
      </div>

      <!-- Result -->
      <transition name="slide-fade">
        <div v-if="result && isContentAccessible" class="p-6 bg-white rounded-xl shadow-lg border border-gray-100">
          <div class="text-center mb-6">
            <h2 class="text-xl md:text-2xl font-bold text-purple-800">
              Kết quả hòa hợp giữa
              <span class="text-purple-600">{{ name1 }}</span> và
              <span class="text-purple-600">{{ name2 }}</span>
            </h2>
            <p class="text-gray-600 mt-1">Loại mối quan hệ: {{ relationshipType }}</p>
          </div>

          <!-- Compatibility Score -->
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-lg border border-purple-100 mb-6">
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 01-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                </span>
                Mức độ hòa hợp
              </h3>
              <span class="px-3 py-1 rounded-full text-sm font-medium"
                    :class="getScoreColorClass(result.percentage)">
                {{ result.compatibilityLevel }} ({{ result.percentage }}%)
              </span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2.5">
              <div class="h-2.5 rounded-full"
                   :class="getScoreBarColorClass(result.percentage)"
                   :style="`width: ${result.percentage}%`"></div>
            </div>
          </div>

          <!-- Result Details -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </span>
                Điểm mạnh
              </h3>
              <p class="text-gray-600">{{ result.details.strengths }}</p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </span>
                Điểm yếu
              </h3>
              <p class="text-gray-600">{{ result.details.weaknesses }}</p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
                  </svg>
                </span>
                Tiềm năng
              </h3>
              <p class="text-gray-600">{{ result.details.potential }}</p>
            </div>

            <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <h3 class="font-semibold text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </span>
                Thách thức
              </h3>
              <p class="text-gray-600">{{ result.details.challenges }}</p>
            </div>
          </div>

          <!-- Overview & Suggestions -->
          <div class="mt-6 space-y-6">
            <div class="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
              <h3 class="font-semibold text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-11a1 1 0 112 0v4a1 1 0 01-2 0V7zm1 8a1 1 0 100-2 1 1 0 000 2z" clip-rule="evenodd" />
                  </svg>
                </span>
                Tổng quan mối quan hệ
              </h3>
              <p class="text-gray-600">{{ result.details.overview.split('\n').slice(1).join('\n') }}</p>
            </div>

            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-lg shadow-sm border border-purple-100">
              <h3 class="font-semibold text-purple-700 mb-3 flex items-center">
                <span class="bg-purple-100 p-2 rounded-full mr-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                </span>
                Gợi ý cải thiện
              </h3>
              <p class="text-gray-600">{{ result.details.suggestions }}</p>
            </div>

            <!-- More Suggestions Button -->
            <div v-if="result && totalSuggestions < maxSuggestions" class="flex justify-center mt-6">
              <button
                @click="showMoreSuggestions"
                :disabled="loadingMore || isLoading || !hasSufficientTokensForMore"
                class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
              >
                <span v-if="loadingMore" class="flex items-center justify-center">
                  <svg
                    class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang tải...
                </span>
                <span v-else>{{ isLoggedIn ? `Xem thêm gợi ý (Cần ${tokenCostMore} tokens)` : 'Đăng nhập để xem thêm' }}</span>
              </button>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '@/stores/user';

// Form state
const name1 = ref('');
const dob1 = ref('');
const name2 = ref('');
const dob2 = ref('');
const relationshipType = ref('');
const result = ref(null);
const error = ref('');
const loading = ref(false);
const loadingMore = ref(false);
const totalSuggestions = ref(1);
const maxSuggestions = ref(5);
const tokenCost = ref(15);
const tokenCostMore = ref(5);
const description = 'Access to detailed compatibility analysis results';
const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
const isLoggedIn = ref(false);
const hasSufficientTokensForMore = ref(true);
let handleAction = () => {};
const userStore = useUserStore();

// Get current date for max date input
const maxDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

// Check if number is master number (11, 22)
const isMasterNumber = (num) => {
  return num === 11 || num === 22;
};

// Calculate life path number from date of birth (YYYY-MM-DD)
const calculateLifePath = (dob) => {
  if (!dob) return null;
  const [year, month, day] = dob.split('-').map(Number);
  const daySum = Math.floor(day / 10) + (day % 10);
  const monthSum = Math.floor(month / 10) + (month % 10);
  const yearSum = year.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  let sum = daySum + monthSum + yearSum;
  while (sum > 9 && !isMasterNumber(sum)) {
    sum = sum.toString().split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return sum;
};

// Computed properties for life path numbers
const lifePath1 = computed(() => calculateLifePath(dob1.value));
const lifePath2 = computed(() => calculateLifePath(dob2.value));

// Get color class based on compatibility score
const getScoreColorClass = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-800';
  if (score >= 60) return 'bg-blue-100 text-blue-800';
  if (score >= 40) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

// Get progress bar color based on compatibility score
const getScoreBarColorClass = (score) => {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
};

// Clear error message when user focuses on input
const clearError = () => {
  error.value = '';
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
      method: 'GET',
    });
    console.log('API /api/users response:', response);
    name1.value = response.user.fullname?.trim() || '';
    dob1.value = response.user.birthdate?.split('T')[0] || '';
  } catch (err) {
    console.error('Error fetching user data:', err);
    errorMessage.value = err.data?.message || 'Không thể tải thông tin tài khoản. Vui lòng nhập thủ công.';
    toast.error(errorMessage.value, { position: 'top-center' });
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
    errorMessage.value = error.data?.message || 'Không thể kiểm tra số dư token!';
    toast.error(errorMessage.value, { position: 'top-center' });
    hasSufficientTokensForMore.value = false;
    return false;
  }
};

// Khởi tạo trạng thái đăng nhập và kiểm tra token
const initializeAuth = async () => {
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  isLoggedIn.value = authStatus;
  handleAction = action;
  if (authStatus) {
    await checkTokenBalance(tokenCostMore.value);
  }
};

// Form submission handler
const handleSubmit = async () => {
  error.value = '';
  errorMessage.value = '';
  result.value = null;

  if (!name1.value || !name2.value) {
    error.value = 'Vui lòng nhập đầy đủ họ tên.';
    return;
  }
  if (!dob1.value || !dob2.value) {
    error.value = 'Vui lòng nhập đầy đủ ngày sinh.';
    return;
  }
  if (!relationshipType.value) {
    error.value = 'Vui lòng chọn loại mối quan hệ.';
    return;
  }

  if (isContentAccessible.value) {
    await getCompatibility();
  } else {
    await handleAction();
    if (isContentAccessible.value) {
      await getCompatibility();
    }
  }
};

async function getCompatibility() {
  loading.value = true;
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    console.log('Sending request to /api/compatibility with data:', { name1: name1.value, dob1: dob1.value, name2: name2.value, dob2: dob2.value, relationshipType: relationshipType.value });
    const response = await $fetch('/api/compatibility', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        name1: name1.value,
        dob1: dob1.value,
        name2: name2.value,
        dob2: dob2.value,
        relationshipType: relationshipType.value,
        suggestionCount: 1
      },
    });
    console.log('Response from /api/compatibility:', response);
    result.value = response.compatibility;
    totalSuggestions.value = 1;
    await checkTokenBalance(tokenCostMore.value);
    toast.success('Tính toán hòa hợp hoàn tất!', { position: 'top-center' });
    // Scroll to result
    setTimeout(() => {
      const resultElement = document.querySelector('[v-if="result"]');
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  } catch (error) {
    console.error('Error in getCompatibility:', error);
    errorMessage.value = error.data?.message || 'Không thể tính toán mức độ hòa hợp!';
    toast.error(errorMessage.value, { position: 'top-center' });
  } finally {
    loading.value = false;
  }
}

// Show more suggestions
async function showMoreSuggestions() {
  if (totalSuggestions.value >= maxSuggestions.value) {
    console.log('Reached maximum suggestions:', maxSuggestions.value);
    return;
  }

  errorMessage.value = '';
  console.log('Starting showMoreSuggestions, checking token balance...');

  const sufficientTokens = await checkTokenBalance(tokenCostMore.value);
  console.log('Token balance sufficient:', sufficientTokens);
  if (!sufficientTokens) {
    errorMessage.value = 'Bạn không có đủ token để xem thêm gợi ý!';
    toast.error(errorMessage.value, { position: 'top-center' });
    return;
  }

  loadingMore.value = true;
  try {
    const username = userStore.isAuthenticated ? userStore.user.email : 'guest';
    console.log('Sending request to /api/compatibility for more suggestions');
    const response = await $fetch('/api/compatibility', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: {
        name1: name1.value,
        dob1: dob1.value,
        name2: name2.value,
        dob2: dob2.value,
        relationshipType: relationshipType.value,
        suggestionCount: 1,
        excludeSuggestions: result.value.details.suggestions
      },
    });
    console.log('Response from /api/compatibility (more suggestions):', response);
    result.value.details.suggestions += '\n' + response.compatibility.details.suggestions;
    totalSuggestions.value += 1;
    await checkTokenBalance(tokenCostMore.value);
    toast.success('Đã tải thêm gợi ý!', { position: 'top-center' });
  } catch (error) {
    console.error('Error in showMoreSuggestions:', error);
    errorMessage.value = error.data?.message || 'Không thể tải thêm gợi ý!';
    toast.error(errorMessage.value, { position: 'top-center' });
  } finally {
    loadingMore.value = false;
    console.log('showMoreSuggestions completed, loadingMore:', loadingMore.value);
  }
}

// Theo dõi isStoreInitialized để lấy dữ liệu khi store sẵn sàng
watch(() => userStore.isStoreInitialized, (initialized) => {
  if (initialized && process.client) {
    console.log('User store initialized, running initializeAuth and fetchUserData');
    initializeAuth();
    fetchUserData();
  }
});

onMounted(() => {
  console.log('Component mounted, isStoreInitialized:', userStore.isStoreInitialized);
  if (userStore.isStoreInitialized) {
    initializeAuth();
    fetchUserData();
  }
});
</script>

<style scoped>
/* Custom transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

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

/* Custom scrollbar */
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

/* Responsive adjustments */
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
