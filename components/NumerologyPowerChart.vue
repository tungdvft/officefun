<template>
  <div class="container numerology-charts mx-auto p-6 bg-white rounded-xl shadow-lg font-inter">
    <!-- Tiêu đề chính -->
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-teal-700 mb-3">
        Biểu đồ sức mạnh của bạn
      </h2>
      <div class="w-24 h-1 bg-teal-500 mx-auto mb-4 rounded-full"></div>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Khám phá biểu đồ tên, tổng hợp và sức mạnh với phân tích chi tiết về con số chủ đạo của bạn
      </p>
    </div>

    <!-- Trạng thái loading -->
    <div v-if="loading" class="p-8 text-center">
      <div class="inline-flex flex-col items-center">
        <svg class="animate-spin h-10 w-10 text-teal-600 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600 font-medium">Đang phân tích dữ liệu...</span>
      </div>
    </div>

    <!-- Trạng thái lỗi -->
    <div v-else-if="error" class="p-4 mb-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <div class="flex items-center">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- Biểu đồ -->
    <div v-else class="charts-container grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
      <!-- Biểu đồ Tên -->
      <div class="name-chart bg-gradient-to-b from-teal-50 to-white p-6 rounded-xl border border-teal-100 shadow-sm">
        <h3 class="text-center text-xl font-semibold text-teal-800 mb-5 pb-2 border-b border-teal-200">
          <span class="inline-block px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-sm mr-2">①</span>
          Biểu đồ Tên
        </h3>
        <div class="overflow-x-auto">
          <table class="m-auto text-center font-medium border-collapse">
            <tbody>
              <tr v-for="(row, rowIndex) in pythagoreanGrid" :key="`name-row-${rowIndex}`">
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="`name-cell-${rowIndex}-${cellIndex}`"
                  class="border border-gray-200 p-4 w-16 h-16 relative transition-all"
                  :class="getCellClasses(cell, nameChartData)"
                >
                  <span class="text-xl font-bold block">
                    {{ cell === 9 && nameChartData[99] ? '99' : cell }}
                  </span>
                  <span v-if="nameChartData[cell] || (cell === 9 && nameChartData[99])" 
                        class="absolute bottom-1 right-1 text-xs font-normal text-red-600">
                    {{ getFrequencyDisplay(cell, nameChartData) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 mt-4 text-center italic">
          Phân tích tần suất các con số trong tên của bạn
        </p>
      </div>

      <!-- Biểu đồ Tổng hợp -->
      <div class="combined-chart bg-gradient-to-b from-amber-50 to-white p-6 rounded-xl border border-amber-100 shadow-sm">
        <h3 class="text-center text-xl font-semibold text-amber-800 mb-5 pb-2 border-b border-amber-200">
          <span class="inline-block px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm mr-2">②</span>
          Biểu đồ Tổng hợp
        </h3>
        <div class="overflow-x-auto">
          <table class="m-auto text-center font-medium border-collapse">
            <tbody>
              <tr v-for="(row, rowIndex) in pythagoreanGrid" :key="`combined-row-${rowIndex}`">
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="`combined-cell-${rowIndex}-${cellIndex}`"
                  class="border border-gray-200 p-4 w-16 h-16 relative transition-all"
                  :class="getCellClasses(cell, combinedChartData)"
                >
                  <span class="text-xl font-bold block">
                    {{ cell === 9 && combinedChartData[99] ? '99' : cell }}
                  </span>
                  <span v-if="combinedChartData[cell] || (cell === 9 && combinedChartData[99]) || isCoreNumber(cell)" 
                        class="absolute bottom-1 right-1 text-xs font-normal flex items-center space-x-0.5">
                    <span v-if="combinedChartData[cell] || (cell === 9 && combinedChartData[99])" class="text-red-600">
                      {{ getFrequencyDisplay(cell, combinedChartData) }}
                    </span>
                    <span v-if="isCoreNumber(cell)" class="text-teal-600 text-sm">★</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 mt-4 text-center italic">
          Tổng hợp các con số quan trọng từ tên và ngày sinh
        </p>
      </div>

      <!-- Biểu đồ Sức mạnh -->
      <div class="power-chart bg-gradient-to-b from-purple-50 to-white p-6 rounded-xl border border-purple-100 shadow-sm">
        <h3 class="text-center text-xl font-semibold text-purple-800 mb-5 pb-2 border-b border-purple-200">
          <span class="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm mr-2">③</span>
          Biểu đồ Sức mạnh
        </h3>
        <div class="overflow-x-auto">
          <table class="m-auto text-center font-medium border-collapse">
            <tbody>
              <tr v-for="(row, rowIndex) in pythagoreanGrid" :key="`power-row-${rowIndex}`">
                <td
                  v-for="(cell, cellIndex) in row"
                  :key="`power-cell-${rowIndex}-${cellIndex}`"
                  class="border border-gray-200 p-4 w-16 h-16 relative transition-all"
                  :class="getPowerCellClasses(cell)"
                >
                  <span class="text-xl font-bold block">
                    {{ cell }}
                  </span>
                  <span v-if="powerChartData[cell] || isCoreNumber(cell)" 
                        class="absolute bottom-1 right-1 text-xs font-normal flex items-center space-x-0.5">
                    <span v-if="powerChartData[cell]" class="text-red-600">
                      {{ powerChartData[cell] }}
                    </span>
                    <span v-if="isCoreNumber(cell)" class="text-teal-600 text-sm">★</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="text-sm text-gray-500 mt-4 text-center italic">
          Các con số cốt lõi thể hiện sức mạnh tiềm ẩn của bạn
        </p>
      </div>
    </div>

    <!-- Diễn giải chung (bảo vệ) -->
    <div v-if="!loading && !error">
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-600">Đang kiểm tra quyền truy cập...</span>
        </div>
      </div>
      <div v-else-if="errorMessage" class="text-center py-12 bg-red-50 rounded-lg">
        <svg class="h-12 w-12 mx-auto text-red-500 mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
        </svg>
        <h4 class="text-red-600 font-medium text-lg">{{ errorMessage }}</h4>
        <p v-if="hasSufficientTokens === false" class="text-gray-600 text-sm mt-1">Bạn không có đủ token. Vui lòng nạp thêm.</p>
      </div>
      <div v-else>
        <transition name="fade-slide">
          <div v-if="isContentAccessible" class="interpretations mt-12">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                v-for="number in activeNumbers"
                :key="`interpretation-${number}`"
                class="p-6 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div class="flex items-start mb-4">
                  <div class="flex-shrink-0 bg-teal-100 text-teal-800 rounded-lg p-3 mr-4">
                    <span class="text-2xl font-bold">{{ number }}</span>
                  </div>
                  <div>
                    <h4 class="text-xl font-bold text-gray-800">
                      {{ getNumberTitle(number) }}
                      <span v-if="isCoreNumber(number)" class="ml-2 text-teal-500 text-sm align-super">★</span>
                    </h4>
                    <p class="text-gray-600 text-sm">{{ getNumberCoreMeaning(number) }}</p>
                  </div>
                </div>

                <div class="space-y-4">
                  <div class="grid grid-cols-3 gap-2 text-center bg-gray-50 p-2 rounded-lg">
                    <div class="p-2">
                      <span class="block text-xs text-gray-500 font-medium">Tần suất (Tên)</span>
                      <span class="block font-bold text-teal-700">{{ nameChartData[number] || 0 }}</span>
                    </div>
                    <div class="p-2">
                      <span class="block text-xs text-gray-500 font-medium">Tần suất (Tổng hợp)</span>
                      <span class="block font-bold text-amber-700">{{ combinedChartData[number] || 0 }}</span>
                    </div>
                    <div class="p-2">
                      <span class="block text-xs text-gray-500 font-medium">Tần suất (Sức mạnh)</span>
                      <span class="block font-bold text-purple-700">{{ powerChartData[number] || 0 }}</span>
                    </div>
                  </div>

                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p class="text-gray-700 mb-1"><span class="font-medium text-gray-800">Biểu tượng:</span> {{ getNumberSymbolism(number) }}</p>
                      <p class="text-gray-700 mb-1"><span class="font-medium text-gray-800">Nguyên tố:</span> {{ getNumberElement(number) }}</p>
                      <p class="text-gray-700 mb-1"><span class="font-medium text-gray-800">Hành tinh:</span> {{ getNumberPlanet(number) }}</p>
                      <p class="text-gray-700"><span class="font-medium text-gray-800">Màu sắc:</span> {{ getNumberColor(number) }}</p>
                    </div>
                    <div>
                      <p class="text-gray-700 mb-1"><span class="font-medium text-gray-800">Tác động tần suất:</span> {{ getNumberFrequencyImpact(number) }}</p>
                      <p class="text-gray-700"><span class="font-medium text-gray-800">Bài học tâm linh:</span> {{ getNumberSpiritualLesson(number) }}</p>
                    </div>
                  </div>

                  <div v-if="getNumberStrengths(number)" class="bg-green-50 p-3 rounded-lg">
                    <h5 class="font-medium text-green-800 mb-2 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Điểm mạnh
                    </h5>
                    <ul class="list-disc pl-5 text-green-700 text-sm space-y-1">
                      <li v-for="(strength, index) in getNumberStrengths(number)" :key="index">
                        {{ strength }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="getNumberChallenges(number)" class="bg-blue-50 p-3 rounded-lg">
                    <h5 class="font-medium text-blue-800 mb-2 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                      </svg>
                      Thách thức
                    </h5>
                    <ul class="list-disc pl-5 text-blue-700 text-sm space-y-1">
                      <li v-for="(challenge, index) in getNumberChallenges(number)" :key="index">
                        {{ challenge }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="getNumberCareerAdvice(number)" class="bg-indigo-50 p-3 rounded-lg">
                    <h5 class="font-medium text-indigo-800 mb-2 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                      Lời khuyên nghề nghiệp
                    </h5>
                    <ul class="list-disc pl-5 text-indigo-700 text-sm space-y-1">
                      <li v-for="(advice, index) in getNumberCareerAdvice(number)" :key="index">
                        {{ advice }}
                      </li>
                    </ul>
                  </div>

                  <div v-if="getNumberRelationshipTips(number)" class="bg-pink-50 p-3 rounded-lg">
                    <h5 class="font-medium text-pink-800 mb-2 flex items-center">
                      <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                      </svg>
                      Mẹo quan hệ
                    </h5>
                    <ul class="list-disc pl-5 text-pink-700 text-sm space-y-1">
                      <li v-for="(tip, index) in getNumberRelationshipTips(number)" :key="index">
                        {{ tip }}
                      </li>
                    </ul>
                  </div>

                  <p v-if="isCoreNumber(number)" class="text-xs text-teal-600 mt-2 flex items-center">
                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clip-rule="evenodd"></path>
                    </svg>
                    Đây là một trong những số cốt lõi của bạn
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-else-if="!isContentAccessible" class="text-center p-6">
            <button
              @click="handleAction"
              class="px-6 py-3 rounded-lg font-medium text-sm bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:shadow-lg transition-all duration-300 shadow-md whitespace-nowrap"
              :disabled="isLoading"
            >
              {{ isLoggedIn ? `Xem tiếp (Cần ${tokenCost} tokens)` : 'Đăng nhập để xem tiếp' }}
            </button>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useProtectedContent } from '~/composables/useProtectedContent';
import {
  calculateLifePathNumber,
  calculateExpressionNumber,
  calculateSoulUrgeNumber,
  calculatePersonalityNumber,
  calculateBirthDayNumber,
  calculatePeakNumbers
} from '~/utils/numerology-calculations';
import chartData from '~/data/powerChart.json';

// Bảng Pythagorean chuẩn
const pythagoreanGrid = [
  [4, 9, 2],
  [3, 5, 7],
  [8, 1, 6]
];

// Bảng ánh xạ chữ cái
const PYTHAGOREAN_CHART = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 6, g: 7, h: 8, i: 9,
  j: 1, k: 2, l: 3, m: 4, n: 5, o: 6, p: 7, q: 8, r: 9,
  s: 1, t: 2, u: 3, v: 4, w: 5, x: 6, y: 7, z: 8,
  á: 1, à: 1, ả: 1, ã: 1, ạ: 1,
  ă: 1, ắ: 1, ằ: 1, ẳ: 1, ẵ: 1, ặ: 1,
  â: 1, ấ: 1, ầ: 1, ẩ: 1, ẫ: 1, ậ: 1,
  đ: 4,
  é: 5, è: 5, ẻ: 5, ẽ: 5, ẹ: 5,
  ê: 5, ế: 5, ề: 5, ể: 5, ễ: 5, ệ: 5,
  í: 9, ì: 9, ỉ: 9, ĩ: 9, ị: 9,
  ó: 6, ò: 6, ỏ: 6, õ: 6, ọ: 6,
  ô: 6, ố: 6, ồ: 6, ổ: 6, ỗ: 6, ộ: 6,
  ơ: 6, ớ: 6, ờ: 6, ở: 6, ỡ: 6, ợ: 6,
  ú: 3, ù: 3, ủ: 3, ũ: 3, ụ: 3,
  ư: 3, ứ: 3, ừ: 3, ử: 3, ữ: 3, ự: 3,
  ý: 7, ỳ: 7, ỷ: 7, ỹ: 7, ỵ: 7
};

const props = defineProps({
  birthDate: {
    type: String,
    required: true,
    validator: (value) => /^\d{2}\/\d{2}\/\d{4}$/.test(value)
  },
  fullName: {
    type: String,
    required: true
  }
});

const loading = ref(false);
const error = ref(null);
const nameChartData = ref({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 });
const combinedChartData = ref({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 });
const powerChartData = ref({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 });
const tokenCost = ref(10);
const description = 'Access to detailed numerology chart interpretations';
const { isLoading, errorMessage, isContentAccessible, hasSufficientTokens, checkAuthAndAccess } = useProtectedContent(tokenCost.value, description);
const isLoggedIn = ref(false);
let handleAction = () => {};
const isInitialLoad = ref(true);

// Tính số cốt lõi
const coreNumbers = computed(() => {
  try {
    const lifePath = calculateLifePathNumber(props.birthDate);
    const expression = calculateExpressionNumber(props.fullName);
    const soulUrge = calculateSoulUrgeNumber(props.fullName);
    const personality = calculatePersonalityNumber(props.fullName);
    const birthday = calculateBirthDayNumber(props.birthDate);
    console.log('[NumerologyCharts] Core numbers:', { lifePath, expression, soulUrge, personality, birthday });
    return { lifePath, expression, soulUrge, personality, birthday };
  } catch (err) {
    console.error('[NumerologyCharts] Core numbers error:', err.message);
    return {};
  }
});

// Danh sách các số có tần suất
const activeNumbers = computed(() => {
  const numbers = new Set();
  Object.keys(nameChartData.value).forEach(key => {
    if (nameChartData.value[key] > 0 && key !== '99') numbers.add(Number(key));
  });
  Object.keys(combinedChartData.value).forEach(key => {
    if (combinedChartData.value[key] > 0 && key !== '99') numbers.add(Number(key));
  });
  Object.keys(powerChartData.value).forEach(key => {
    if (powerChartData.value[key] > 0) numbers.add(Number(key));
  });
  if (nameChartData.value[99] > 0 || combinedChartData.value[99] > 0) numbers.add(99);
  const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);
  console.log('[NumerologyCharts] Active numbers:', sortedNumbers);
  return sortedNumbers;
});

// Tính tần suất cho tất cả biểu đồ
const calculateCharts = async () => {
  console.log('[NumerologyCharts] Calculating charts:', {
    fullName: props.fullName,
    birthDate: props.birthDate
  });

  loading.value = true;
  error.value = null;
  nameChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 };
  combinedChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 };
  powerChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  try {
    if (!props.fullName || props.fullName.trim() === '') {
      throw new Error('Họ tên không được để trống');
    }
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
      throw new Error('Ngày sinh không hợp lệ, vui lòng dùng định dạng DD/MM/YYYY');
    }

    const [day, month, year] = props.birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime()) || dateObj.getDate() !== day || dateObj.getMonth() + 1 !== month) {
      throw new Error('Ngày sinh không hợp lệ');
    }

    // Tính số từ tên
    const cleanName = props.fullName.toLowerCase().replace(/[^a-zàáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ]/g, '');
    const nameNumbers = cleanName.split('').map(char => {
      const value = PYTHAGOREAN_CHART[char] || 0;
      console.log(`[NumerologyCharts] Name char: ${char}, value=${value}`);
      return value;
    }).filter(n => n > 0);

    console.log('[NumerologyCharts] Name numbers:', nameNumbers);

    // Biểu đồ Tên
    nameNumbers.forEach(num => {
      if (num >= 1 && num <= 9) {
        nameChartData.value[num]++;
      }
    });
    if (nameChartData.value[9] >= 5) {
      nameChartData.value[99] = nameChartData.value[9];
      nameChartData.value[9] = 0;
    }

    // Tính các chỉ số
    const lifePath = calculateLifePathNumber(props.birthDate);
    const expression = calculateExpressionNumber(props.fullName);
    const soulUrge = calculateSoulUrgeNumber(props.fullName);
    const personality = calculatePersonalityNumber(props.fullName);
    const birthday = calculateBirthDayNumber(props.birthDate);
    const peaks = Object.values(calculatePeakNumbers(props.birthDate));

    console.log('[NumerologyCharts] Calculated numbers:', {
      lifePath,
      expression,
      soulUrge,
      personality,
      birthday,
      peaks
    });

    // Biểu đồ Tổng hợp
    const combinedNumbers = [
      lifePath,
      expression,
      soulUrge,
      personality,
      birthday,
      ...peaks,
      ...nameNumbers
    ];
    combinedNumbers.forEach(num => {
      if (num >= 1 && num <= 9) {
        combinedChartData.value[num]++;
      }
    });
    if (combinedChartData.value[9] >= 5) {
      combinedChartData.value[99] = combinedChartData.value[9];
      combinedChartData.value[9] = 0;
    }

    // Biểu đồ Sức mạnh
    const powerNumbers = [
      lifePath,
      expression,
      soulUrge,
      personality,
      birthday,
      ...peaks
    ];
    powerNumbers.forEach(num => {
      if (num >= 1 && num <= 9) {
        powerChartData.value[num]++;
      }
    });

    console.log('[NumerologyCharts] Chart data:', {
      nameChartData: nameChartData.value,
      combinedChartData: combinedChartData.value,
      powerChartData: powerChartData.value
    });
  } catch (err) {
    console.error('[NumerologyCharts] Error:', err.message);
    error.value = err.message;
  } finally {
    loading.value = false;
  }
};

// Khởi tạo trạng thái đăng nhập và hành động
const initializeAuth = async () => {
  const { isLoggedIn: authStatus, action } = await checkAuthAndAccess();
  isLoggedIn.value = authStatus;
  handleAction = action;
};

// Kiểm tra số cốt lõi
const isCoreNumber = (cell) => {
  const isCore = Object.values(coreNumbers.value).includes(cell);
  console.log(`[NumerologyCharts] Checking core number ${cell}: ${isCore}`);
  return isCore;
};

// Hiển thị tần suất dạng lặp số
const getFrequencyDisplay = (cell, data) => {
  if (cell === 9 && data[99]) {
    return '9'.repeat(data[99]);
  }
  return data[cell] ? String(cell).repeat(data[cell]) : '';
};

// Lớp CSS cho ô (Biểu đồ Tên và Tổng hợp)
const getCellClasses = (cell, data) => ({
  'bg-teal-50': isCoreNumber(cell),
  'border-teal-300': isCoreNumber(cell),
  'bg-teal-100': data[cell] > 0 || (cell === 9 && data[99] > 0),
  'border-red-300': true,
  'bg-gray-100': !data[cell] && !(cell === 9 && data[99] > 0),
  'border-teal-400': (data[cell] >= 3 || (cell === 9 && data[99] >= 3)) && cell !== 99
});

// Lớp CSS cho ô (Biểu đồ Sức mạnh)
const getPowerCellClasses = (cell) => ({
  'bg-teal-50': isCoreNumber(cell),
  'border-teal-300': isCoreNumber(cell),
  'bg-teal-100': powerChartData.value[cell] > 0,
  'border-red-300': true,
  'bg-gray-100': !powerChartData.value[cell],
  'border-teal-400': powerChartData.value[cell] >= 3
});

// Lấy thông tin số
const getNumberTitle = (number) => {
  return chartData.numberMeanings[number]?.title || chartData.specialNumbers[number]?.title || 'Không xác định';
};

const getNumberCoreMeaning = (number) => {
  return chartData.numberMeanings[number]?.coreMeaning || chartData.specialNumbers[number]?.coreMeaning || 'Không có dữ liệu';
};

const getNumberSymbolism = (number) => {
  return chartData.numberMeanings[number]?.symbolism || chartData.specialNumbers[number]?.symbolism || 'Không có dữ liệu';
};

const getNumberElement = (number) => {
  return chartData.numberMeanings[number]?.element || chartData.specialNumbers[number]?.element || 'Không có dữ liệu';
};

const getNumberPlanet = (number) => {
  return chartData.numberMeanings[number]?.planet || chartData.specialNumbers[number]?.planet || 'Không có dữ liệu';
};

const getNumberColor = (number) => {
  return chartData.numberMeanings[number]?.color || chartData.specialNumbers[number]?.color || 'Không có dữ liệu';
};

const getNumberFrequencyImpact = (number) => {
  return chartData.numberMeanings[number]?.frequencyImpact || chartData.specialNumbers[number]?.frequencyImpact || 'Không có dữ liệu';
};

const getNumberStrengths = (number) => {
  return chartData.numberMeanings[number]?.strengths || chartData.specialNumbers[number]?.strengths || null;
};

const getNumberChallenges = (number) => {
  return chartData.numberMeanings[number]?.challenges || chartData.specialNumbers[number]?.challenges || null;
};

const getNumberCareerAdvice = (number) => {
  return chartData.numberMeanings[number]?.careerAdvice || chartData.specialNumbers[number]?.careerAdvice || null;
};

const getNumberRelationshipTips = (number) => {
  return chartData.numberMeanings[number]?.relationshipTips || chartData.specialNumbers[number]?.relationshipTips || null;
};

const getNumberSpiritualLesson = (number) => {
  return chartData.numberMeanings[number]?.spiritualLesson || chartData.specialNumbers[number]?.spiritualLesson || 'Không có dữ liệu';
};

// Theo dõi thay đổi props
watch(
  () => [props.fullName, props.birthDate],
  () => {
    if (props.fullName && props.birthDate) {
      calculateCharts();
      if (isInitialLoad.value) {
        initializeAuth();
        isInitialLoad.value = false;
      }
    } else {
      nameChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 };
      combinedChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0, 99: 0 };
      powerChartData.value = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
      error.value = 'Vui lòng nhập đầy đủ họ tên và ngày sinh';
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.numerology-charts {
  font-family: 'Inter', sans-serif;
}

.charts-container table {
  border-spacing: 0;
}

.charts-container td {
  border-width: 1px;
  transition: background-color 0.2s;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
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
