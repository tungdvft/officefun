<template>
  <div class="mx-auto p-6 bg-white rounded-xl shadow-lg sm:p-4">
    <!-- Header với ngày hiện tại -->
    <div class="mb-8 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100">
      <h1 class="text-2xl font-bold text-indigo-700">Thần số học hôm nay</h1>
      <p class="text-indigo-600 mt-1">Ngày: {{ currentDate }}</p>
    </div>

    <!-- Kết quả -->
    <div v-if="dailyPrediction" class="space-y-10">
      <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
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
              <span class="text-5xl font-bold text-teal-700">{{ personalDay }}</span>
            </div>
          </div>
          <h3 class="text-2xl font-bold text-teal-800 mt-6">Số ngày cá nhân: {{ personalDay }}</h3>
        </div>
      </div>

      <!-- Grid layout cho các thông tin dự đoán -->
      <div class="grid md:grid-cols-2 gap-6">
        <!-- Lời khuyên -->
        <section class="p-5 bg-green-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            <h3 class="text-xl font-semibold text-green-700">Lời khuyên</h3>
          </div>
          <p class="text-gray-700">{{ dailyPrediction.advice }}</p>
        </section>

        <!-- Điểm mạnh -->
        <section class="p-5 bg-blue-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <h3 class="text-xl font-semibold text-blue-700">Điểm mạnh</h3>
          </div>
          <p class="text-gray-700">{{ dailyPrediction.strength }}</p>
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
          <p class="text-gray-700">{{ dailyPrediction.challenge }}</p>
        </section>

        <!-- Hành động đề xuất -->
        <section class="p-5 bg-pink-50 rounded-lg">
          <div class="flex items-center mb-3">
            <svg class="h-5 w-5 text-pink-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 class="text-xl font-semibold text-pink-700">Hành động đề xuất</h3>
          </div>
          <p class="text-gray-700">{{ dailyPrediction.action }}</p>
        </section>
      </div>

      <!-- Thông điệp tâm linh, màu sắc và con số may mắn -->
      <section class="p-6 bg-purple-50 rounded-xl">
        <h3 class="text-xl font-semibold text-purple-700 mb-4 flex items-center">
          <svg class="h-6 w-6 text-purple-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Thông tin hôm nay
        </h3>
        <div class="grid md:grid-cols-3 gap-6">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-purple-600 mb-2">Thông điệp tâm linh</h4>
            <p class="text-gray-700">{{ dailyPrediction.spiritual_message }}</p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-purple-600 mb-2">Màu sắc may mắn</h4>
            <p class="text-gray-700" :style="{ color: luckyColorHex }">
              {{ dailyPrediction.lucky_color }}
            </p>
          </div>
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-lg font-medium text-purple-600 mb-2">Con số may mắn</h4>
            <p class="text-gray-700">{{ dailyPrediction.lucky_number }}</p>
          </div>
        </div>
      </section>
    </div>

    <!-- Loading hoặc lỗi -->
    <div v-else-if="isLoading" class="flex justify-center">
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
    <div v-else-if="error" class="text-red-600 text-center font-medium p-6">{{ error }}</div>
    <div v-else class="text-gray-600 text-center p-6">Không tìm thấy dự đoán cho ngày này.</div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import personalDayData from '~/data/personal-day-data.js';

const props = defineProps({
  birthDate: { type: String, required: true },
});

const isLoading = ref(false);
const error = ref('');
const dailyPrediction = ref(null);
const personalDay = ref(null);
const lifePath = ref(null);
const currentDate = computed(() => {
  const today = new Date();
  return `${String(today.getDate()).padStart(2, '0')}/${String(today.getMonth() + 1).padStart(2, '0')}/${today.getFullYear()}`;
});

// Hàm tính Số đường đời
const calculateLifePath = (birthDate) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    throw new Error('Ngày sinh không đúng định dạng DD/MM/YYYY.');
  }
  const digits = birthDate.replace(/[^0-9]/g, '').split('').map(Number);
  let sum = digits.reduce((acc, curr) => acc + curr, 0);
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = sum.toString().split('').map(Number).reduce((acc, curr) => acc + curr, 0);
  }
  return sum;
};

// Hàm tính Số ngày cá nhân
const calculatePersonalDay = (birthDate, currentDate) => {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate)) {
    throw new Error('Ngày sinh không đúng định dạng DD/MM/YYYY.');
  }
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

// Hàm chuyển đổi màu sắc sang mã hex
const luckyColorHex = computed(() => {
  if (!dailyPrediction.value) return '#000000';
  const colorMap = {
    'Đỏ ánh kim': '#FF4040',
    'Xanh ngọc ánh kim': '#40E0D0',
    'Vàng ánh kim': '#FFD700',
    'Xanh lá cây ánh kim': '#228B22',
    'Cam ánh kim': '#FF8C00',
    'Hồng ánh kim': '#FF69B4',
    'Tím ánh kim': '#800080',
    'Bạc ánh kim': '#C0C0C0',
    'Xám ánh kim': '#808080',
    'Trắng ánh kim': '#F5F5F5',
    'Đỏ đậm': '#8B0000',
    'Xanh lam đậm': '#00008B',
    'Vàng sáng': '#FFFF00',
    'Xanh lá cây đậm': '#006400',
    'Cam rực rỡ': '#FF4500',
    'Hồng phấn': '#FFC1CC',
    'Tím đậm': '#4B0082',
    'Vàng kim đậm': '#B8860B',
    'Trắng ngọc trai': '#F5F6F5',
    'Vàng nhạt': '#FFFACD',
    'Xanh ngọc bích': '#00CED1',
    'Vàng chanh': '#FFF44F',
    'Xanh lá cây nhạt': '#98FB98',
    'Cam nhạt': '#FFDAB9',
    'Hồng phấn đậm': '#FF82AB',
    'Tím nhạt': '#E6E6FA',
    'Xám đậm': '#2F4F4F',
    'Đỏ hồng': '#FF4040',
    'Hồng nhạt': '#FFB6C1',
  };
  return colorMap[dailyPrediction.value.lucky_color] || '#000000';
});

// Tải dự đoán khi birthDate thay đổi
watch(
  () => props.birthDate,
  async (newBirthDate) => {
    if (!newBirthDate) {
      error.value = 'Vui lòng cung cấp ngày sinh.';
      return;
    }
    isLoading.value = true;
    error.value = '';
    dailyPrediction.value = null;

    try {
      // Kiểm tra định dạng birthDate
      if (!/^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
        throw new Error('Ngày sinh không đúng định dạng DD/MM/YYYY.');
      }

      // Tính Số đường đời
      lifePath.value = calculateLifePath(newBirthDate);

      // Tính Số ngày cá nhân
      personalDay.value = calculatePersonalDay(newBirthDate, currentDate.value);

      // Kiểm tra personalDay hợp lệ
      if (!personalDayData[personalDay.value]) {
        throw new Error(`Không tìm thấy dữ liệu cho Số ngày cá nhân ${personalDay.value}.`);
      }

      // Tìm dự đoán phù hợp với lifePath
      const predictions = personalDayData[personalDay.value].predictions;
      if (!predictions || !Array.isArray(predictions)) {
        throw new Error(`Dữ liệu dự đoán không hợp lệ cho Số ngày cá nhân ${personalDay.value}.`);
      }

      dailyPrediction.value = predictions.find(p => p.life_path === lifePath.value);
      if (!dailyPrediction.value) {
        throw new Error(`Không tìm thấy dự đoán cho Số đường đời ${lifePath.value} với Số ngày cá nhân ${personalDay.value}.`);
      }
    } catch (err) {
      console.error('Lỗi khi xử lý dự đoán hàng ngày:', err);
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  },
  { immediate: true }
);
</script>

<style scoped>
/* Responsive adjustments */
@media (max-width: 640px) {
  .mx-auto {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}
</style>
