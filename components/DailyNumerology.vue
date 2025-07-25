<template>
  <div class="mx-auto container p-6 bg-white rounded-xl shadow-lg sm:p-4">
    <!-- Header với thông tin metadata -->
    <div class="mb-8 p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-100">
      <h1 class="text-2xl font-bold text-teal-700">Thần số học hôm nay</h1>
      <p class="text-teal-600 mt-1">Ngày: {{ currentDate }}</p>
      <p v-if="dailyPrediction" class="text-teal-600 mt-1">Chủ đề: {{ universalTheme }}</p>
    </div>

    <!-- Số ngày cá nhân -->
    <div class="mb-10 bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
      <div class="flex flex-col items-center">
        <div class="relative">
          <!-- Animated circle background -->
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
          <!-- Number display -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-5xl font-bold text-teal-700">{{ personalDay || 'N/A' }}</span>
          </div>
        </div>
        <h3 class="text-2xl font-bold text-teal-800 mt-6">Số ngày cá nhân: {{ personalDay || 'N/A' }}</h3>
        <p v-if="dailyPrediction?.daily_forecast?.overview" class="text-lg text-gray-600 mt-2 max-w-lg">{{ dailyPrediction.daily_forecast.overview }}</p>
        <p v-else class="text-lg text-gray-600 mt-2 max-w-lg">Không có dự đoán cho số ngày cá nhân này.</p>
      </div>
    </div>

    <!-- Thông tin năng lượng vũ trụ -->
    <section v-if="currentPersonalDayData?.universal_energy" class="mb-10 p-6 bg-teal-50 rounded-xl">
      <h3 class="text-xl font-semibold text-teal-700 mb-4 flex items-center">
        <svg class="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        Năng lượng vũ trụ
      </h3>
      <div class="grid md:grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <p class="text-gray-700"><strong>Pha mặt trăng:</strong> {{ currentPersonalDayData.universal_energy.moon_phase || 'Không có' }}</p>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-sm">
          <p class="text-gray-700"><strong>Ảnh hưởng chiêm tinh:</strong> {{ currentPersonalDayData.universal_energy.astrological_impact || 'Không có' }}</p>
        </div>
      </div>
    </section>

    <!-- Phần thông báo lỗi, trạng thái tải, hoặc nút hành động -->
    <div v-if="isLoading" class="flex justify-center">
      <svg
        class="animate-spin h-8 w-8 text-teal-600"
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
    </div>
    <div v-else-if="errorMessage" class="text-red-600 text-center font-medium p-6">
      <template v-if="errorType === 'login'">
        Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để sử dụng tính năng này.
      </template>
      <template v-else-if="errorType === 'topup'">
        Không đủ token cho tính năng này. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!
      </template>
      <template v-else>
        {{ errorMessage }}
      </template>
    </div>
    <div v-else-if="error" class="text-red-600 text-center font-medium p-6">
      {{ error }}
    </div>
    <div v-else-if="!isContentAccessible" class="text-center p-6">
      <template v-if="!userStore.isAuthenticated">
        <p class="text-red-600 font-medium mb-4">Vui lòng <button @click="errorAction" class="action-button">Đăng Nhập</button> để sử dụng tính năng này.</p>
      </template>
      <template v-else-if="userStore.isAuthenticated && !hasSufficientTokens">
        <p class="text-red-600 font-medium mb-4">Không đủ token cho tính năng này. Hãy <button @click="navigateToTopup" class="action-button">Nạp thêm token</button> để trải nghiệm đầy đủ tính năng nhé!</p>
      </template>
      <template v-else>
        <button @click="performAction" class="action-button">Xem dự đoán chi tiết (Cần {{ tokenCost }} token)</button>
      </template>
    </div>
    <div v-else-if="isContentAccessible && dailyPrediction" class="space-y-10">
      <!-- Hồ sơ cá nhân -->
      <section class="p-6 bg-blue-50 rounded-xl">
        <h3 class="text-xl font-semibold text-blue-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          Hồ sơ cá nhân
        </h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <p class="text-gray-700"><strong>Nguyên mẫu:</strong> {{ dailyPrediction.profile?.archetype || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <p class="text-gray-700"><strong>Nguyên tố:</strong> {{ dailyPrediction.profile?.element || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <p class="text-gray-700"><strong>Số tương thích:</strong> {{ dailyPrediction.profile?.compatible_numbers?.join(', ') || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <p class="text-gray-700"><strong>Luân xa:</strong> {{ dailyPrediction.profile?.chakra || 'Không có' }}</p>
          </div>
        </div>
      </section>

      <!-- Lịch trình hàng ngày -->
      <section class="p-6 bg-teal-50 rounded-xl">
        <h3 class="text-xl font-semibold text-teal-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          Lịch trình hôm nay
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Buổi sáng</h4>
            <ul class="space-y-2 text-gray-700">
              <li><strong>Trọng tâm:</strong> {{ dailyPrediction.daily_forecast?.time_slots?.morning?.focus || 'Không có' }}</li>
              <li><strong>Hành động:</strong> {{ dailyPrediction.daily_forecast?.time_slots?.morning?.action || 'Không có' }}</li>
              <li v-if="dailyPrediction.daily_forecast?.time_slots?.morning?.warning"><strong>Cảnh báo:</strong> {{ dailyPrediction.daily_forecast.time_slots.morning.warning }}</li>
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Buổi chiều</h4>
            <ul class="space-y-2 text-gray-700">
              <li><strong>Trọng tâm:</strong> {{ dailyPrediction.daily_forecast?.time_slots?.afternoon?.focus || 'Không có' }}</li>
              <li><strong>Thời gian vàng:</strong> {{ dailyPrediction.daily_forecast?.time_slots?.afternoon?.golden_hour || 'Không có' }}</li>
              <li><strong>Đề xuất:</strong> {{ dailyPrediction.daily_forecast?.time_slots?.afternoon?.recommendation || 'Không có' }}</li>
              <li v-if="dailyPrediction.daily_forecast?.time_slots?.afternoon?.warning"><strong>Cảnh báo:</strong> {{ dailyPrediction.daily_forecast.time_slots.afternoon.warning }}</li>
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Buổi tối</h4>
            <ul class="space-y-2 text-gray-700">
              <li><strong>Trọng tâm:</strong> {{ dailyPrediction.daily_forecast?.time_slots?.evening?.focus || 'Không có' }}</li>
              <li><strong>Hoạt động:</strong> {{ dailyPrediction.daily_forecast?.time_slots?.evening?.activity || 'Không có' }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- Grid layout cho lời khuyên và thách thức -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Lời khuyên -->
        <section class="p-5 bg-green-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-xl font-semibold text-green-700">Lời khuyên</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <span class="text-green-500 mr-2">•</span>
              <span><strong>Công việc:</strong> {{ dailyPrediction.success_tools?.advice?.career || 'Không có' }}</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">•</span>
              <span><strong>Tình yêu:</strong> {{ dailyPrediction.success_tools?.advice?.love || 'Không có' }}</span>
            </li>
            <li class="flex items-start">
              <span class="text-green-500 mr-2">•</span>
              <span><strong>Tài chính:</strong> {{ dailyPrediction.success_tools?.advice?.finance || 'Không có' }}</span>
            </li>
          </ul>
        </section>

        <!-- Thách thức -->
        <section class="p-5 bg-amber-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-amber-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <h3 class="text-xl font-semibold text-amber-700">Thách thức</h3>
          </div>
          <ul class="space-y-3 text-gray-700">
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span>{{ dailyPrediction.success_tools?.challenge?.description || 'Không có' }}</span>
            </li>
            <li class="flex items-start">
              <span class="text-amber-500 mr-2">•</span>
              <span><strong>Giải pháp:</strong> {{ dailyPrediction.success_tools?.challenge?.solution || 'Không có' }}</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- Hướng dẫn tâm linh -->
      <section class="p-6 bg-teal-50 rounded-xl">
        <h3 class="text-xl font-semibold text-teal-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
            />
          </svg>
          Hướng dẫn tâm linh
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Thông điệp</h4>
            <p class="text-gray-700">{{ dailyPrediction.spiritual_guidance?.message || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Thiền</h4>
            <p class="text-gray-700">{{ dailyPrediction.spiritual_guidance?.meditation || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Khẳng định</h4>
            <p class="text-gray-700">{{ dailyPrediction.spiritual_guidance?.affirmation || 'Không có' }}</p>
          </div>
        </div>
      </section>

      <!-- May mắn -->
      <section class="p-6 bg-blue-50 rounded-xl">
        <h3 class="text-xl font-semibold text-blue-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          May mắn
        </h3>
        <div class="grid md:grid-cols-4 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-blue-600 mb-2">Màu sắc</h4>
            <p class="text-gray-700">{{ dailyPrediction.luck?.color?.usage || 'Không có' }}</p>
            <div
              v-if="dailyPrediction.luck?.color?.hex"
              class="w-6 h-6 rounded-full mt-2 border border-gray-300"
              :style="{ backgroundColor: dailyPrediction.luck?.color?.hex || '#000000' }"
            ></div>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-blue-600 mb-2">Con số</h4>
            <p class="text-gray-700">{{ dailyPrediction.luck?.number || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-blue-600 mb-2">Hướng</h4>
            <p class="text-gray-700">{{ dailyPrediction.luck?.direction || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-blue-600 mb-2">Vật may mắn</h4>
            <p class="text-gray-700">{{ dailyPrediction.luck?.object || 'Không có' }}</p>
          </div>
        </div>
      </section>

      <!-- Tương tác -->
      <section class="p-6 bg-pink-50 rounded-xl">
        <h3 class="text-xl font-semibold text-pink-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0l-4.243-4.243a2 2 0 010-2.828 2 2 0 012.828 0l2.829 2.829a2 2 0 002.828 0l4.243-4.243z"
            />
          </svg>
          Tương tác
        </h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-pink-600 mb-2">Câu hỏi nhật ký</h4>
            <p class="text-gray-700">{{ dailyPrediction.interactive?.journal_prompt || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-pink-600 mb-2">Câu hỏi phản hồi</h4>
            <p class="text-gray-700">{{ dailyPrediction.interactive?.feedback_question || 'Không có' }}</p>
          </div>
        </div>
      </section>

      <!-- Gợi ý hàng ngày -->
      <section class="p-6 bg-teal-50 rounded-xl">
        <h3 class="text-xl font-semibold text-teal-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-teal-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Gợi ý hôm nay
        </h3>
        <div class="grid md:grid-cols-3 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Không gian làm việc</h4>
            <p class="text-gray-700">{{ dailyPrediction.daily_tips?.workspace || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Tăng năng lượng</h4>
            <p class="text-gray-700">{{ dailyPrediction.daily_tips?.energy || 'Không có' }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-teal-600 mb-2">Thói quen</h4>
            <p class="text-gray-700">{{ dailyPrediction.daily_tips?.routine || 'Không có' }}</p>
          </div>
        </div>
      </section>

      <!-- Cá nhân và cộng đồng -->
      <section class="p-6 bg-purple-50 rounded-xl">
        <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          Cá nhân và cộng đồng
        </h3>
        <div class="grid md:grid-cols-2 gap-4">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-purple-600 mb-2">Cá nhân hóa</h4>
            <ul class="space-y-2 text-gray-700">
              <li><strong>Tương thích biểu đồ sinh:</strong> {{ currentPersonalDayData.premium_features?.personalized?.birth_chart_compatibility || 'Không có' }}</li>
            </ul>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-purple-600 mb-2">Cộng đồng</h4>
            <ul class="space-y-2 text-gray-700">
              <li><strong>Hashtag thịnh hành:</strong> {{ currentPersonalDayData.premium_features?.community?.trending_hashtag || 'Không có' }}</li>
              <li><strong>Hoạt động nhóm:</strong> {{ currentPersonalDayData.premium_features?.community?.group_activity || 'Không có' }}</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import personalDayData from '~/data/personal-day-data.js';
import { useProtectedContent } from '~/composables/useProtectedContent';
import { useUserStore } from '~/stores/user';

const props = defineProps({
  birthDate: { type: String, required: true },
});

const router = useRouter();
const tokenCost = ref(10);
const description = 'Access to daily numerology prediction';
const { isLoading, errorMessage, errorType, isContentAccessible, hasSufficientTokens, checkAuthAndAccess, performAction, errorAction, navigateToTopup } = useProtectedContent(tokenCost.value, description);

const userStore = useUserStore();
const isInitialLoad = ref(true);
const error = ref('');
const dailyPrediction = ref(null);
const personalDay = ref(null);
const lifePath = ref(null);
const universalTheme = ref('');
const currentPersonalDayData = ref(null);

const currentDate = computed(() => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
});

// Hàm điều hướng đến trang nạp token
// const navigateToTopup = () => {
//   console.log('Navigating to /nap-token');
//   router.push('/nap-token');
// };

// Hàm tính Số đường đời
const calculateLifePath = (birthDate) => {
  const digits = birthDate.replace(/[^0-9]/g, '').split('').map(Number);
  let sum = digits.reduce((acc, curr) => acc + curr, 0);
  while (sum > 9 && ![11, 22, 33].includes(sum)) {
    sum = sum.toString().split('').map(Number).reduce((acc, curr) => acc + curr, 0);
  }
  return sum;
};

// Hàm tính Số ngày cá nhân
const calculatePersonalDay = (birthDate, currentDate) => {
  const [day, month] = birthDate.split('/').map(Number);
  const [currentDay, currentMonth, currentYear] = currentDate.split('/').map(Number);
  const sum = day + month + currentDay + currentMonth + currentYear;
  if ([11, 22, 33].includes(sum)) return sum;
  let reduced = sum;
  while (reduced > 9) {
    reduced = String(reduced).split('').reduce((acc, digit) => acc + Number(digit), 0);
  }
  return reduced;
};

// Khởi tạo trạng thái đăng nhập và kiểm tra token
const initializeAuth = async () => {
  console.log('Initializing auth for DailyNumerology...');
  await userStore.initialize();
  await checkAuthAndAccess();
  console.log('Auth initialized, isAuthenticated:', userStore.isAuthenticated, 'tokenBalance:', userStore.user?.tokens);
};

// Tải dự đoán khi birthDate thay đổi
watch(
  () => props.birthDate,
  async (newBirthDate) => {
    error.value = '';
    dailyPrediction.value = null;
    universalTheme.value = '';
    currentPersonalDayData.value = null;
    personalDay.value = null;
    lifePath.value = null;

    try {
      // Kiểm tra định dạng birthDate
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
        throw new Error('Ngày sinh phải có định dạng DD/MM/YYYY.');
      }

      // Tính Số đường đời
      lifePath.value = calculateLifePath(newBirthDate);
      console.log('Life Path:', lifePath.value);

      // Tính Số ngày cá nhân
      personalDay.value = calculatePersonalDay(newBirthDate, currentDate.value);
      console.log('Personal Day:', personalDay.value);

      // Kiểm tra personalDay hợp lệ
      if (!personalDayData[personalDay.value]) {
        throw new Error(`Không có dữ liệu cho Số ngày cá nhân ${personalDay.value}. Vui lòng thêm file JSON tương ứng.`);
      }

      // Lấy dữ liệu JSON
      currentPersonalDayData.value = personalDayData[personalDay.value];
      console.log('Personal Day Data:', currentPersonalDayData.value);

      // Lấy universal theme
      universalTheme.value = currentPersonalDayData.value.universal_energy?.theme || 'Không có chủ đề';

      // Tìm dự đoán phù hợp với lifePath
      const predictions = currentPersonalDayData.value.predictions;
      if (!predictions || !Array.isArray(predictions)) {
        throw new Error(`Dữ liệu dự đoán không hợp lệ cho Số ngày cá nhân ${personalDay.value}.`);
      }

      dailyPrediction.value = predictions.find(p => p.life_path === lifePath.value);
      if (!dailyPrediction.value) {
        throw new Error(`Không tìm thấy dự đoán cho Số đường đời ${lifePath.value} với Số ngày cá nhân ${personalDay.value}.`);
      }
      console.log('Daily Prediction:', dailyPrediction.value);

      // Chỉ khởi tạo auth sau khi dữ liệu dự đoán được tải lần đầu
      if (isInitialLoad.value) {
        await initializeAuth();
        isInitialLoad.value = false;
      }
    } catch (err) {
      console.error('Lỗi khi xử lý dự đoán hàng ngày:', err);
      error.value = err.message || 'Đã xảy ra lỗi khi tải dự đoán. Vui lòng thử lại.';
    }
  },
  { immediate: true }
);
</script>

<style>
.action-button {
  @apply px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap mx-2;
}
</style>