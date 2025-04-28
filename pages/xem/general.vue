
<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-center text-indigo-600 mb-6">
      Tính Số Đường Đời & Chu Kỳ Vận Số
    </h1>

    <!-- Form nhập ngày sinh -->
    <div class="mb-6">
      <label for="birthDate" class="block text-lg font-medium text-gray-700 mb-2">
        Nhập ngày sinh (DD/MM/YYYY)
      </label>
      <div class="flex gap-4">
        <input
          v-model="birthDate"
          type="text"
          id="birthDate"
          placeholder="VD: 25/12/1990"
          maxlength="10"
          class="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          @input="formatDateInput"
          @keyup.enter="calculateNumbers"
        />
        <button
          @click="calculateNumbers"
          :disabled="isLoading"
          class="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {{ isLoading ? 'Đang tính...' : 'Tính toán' }}
        </button>
      </div>
      <p class="mt-2 text-sm text-gray-600">
        Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY (ví dụ: 25/12/1990).
      </p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- Hiển thị kết quả -->
      <LifePathCalculator :result="result" />
    <PersonalYearChart :cycles="personalYearCycles" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LifePathResult from '@/components/LifePathResult.vue';
import PersonalYearChart from '@/components/PersonalYearChart.vue';
import { calculateLifePathNumber } from '~/utils/numerology-calculations';

// Tắt SSR để tránh lỗi với Chart.js
definePageMeta({
  ssr: false
});

// State
const birthDate = ref('');
const result = ref(null);
const personalYearCycles = ref([]);
const error = ref('');
const isLoading = ref(false);

// Hàm định dạng input ngày sinh
const formatDateInput = (event) => {
  let value = event.target.value.replace(/[^0-9]/g, '');
  if (value.length > 2 && value.length <= 4) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  } else if (value.length > 4) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  }
  birthDate.value = value;
};

// Hàm tính Số Đường Đời và Chu Kỳ Vận Số
const calculateNumbers = async () => {
  error.value = '';
  result.value = null;
  personalYearCycles.value = [];
  isLoading.value = true;

  try {
    // Kiểm tra định dạng ngày sinh
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate.value)) {
      throw new Error('Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY');
    }

    // Kiểm tra ngày hợp lệ
    const [day, month, year] = birthDate.value.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);
    if (
      dateObj.getDate() !== day ||
      dateObj.getMonth() + 1 !== month ||
      year < 1900 ||
      year > 2025
    ) {
      throw new Error('Ngày sinh không hợp lệ.');
    }

    // Tính Số Đường Đời
    const lifePath = calculateLifePathNumber(birthDate.value);
    const lifePathStr = [11, 22].includes(lifePath) ? lifePath.toString() : lifePath.toString();

    // Gọi API Số Đường Đời
    const { data: lifePathData, error: lifePathError } = await useFetch(`/api/life-path/${lifePathStr}`, {
      baseURL: useRuntimeConfig().public.apiBase
    });

    if (lifePathError.value) {
      console.error('Lỗi API Số Đường Đời:', lifePathError.value);
      throw new Error('Lỗi khi lấy dữ liệu Số Đường Đời.');
    }

    if (!lifePathData.value) {
      throw new Error('Không tìm thấy dữ liệu cho Số Đường Đời này.');
    }

    result.value = lifePathData.value;

    // Gọi API Chu Kỳ Vận Số
    const { data: cycleData, error: cycleError } = await useFetch(`/api/personal-year-cycle/${lifePathStr}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      query: { birthDate: birthDate.value }
    });

    if (cycleError.value) {
      console.error('Lỗi API Chu Kỳ Vận Số:', cycleError.value);
      throw new Error('Lỗi khi lấy dữ liệu Chu Kỳ Vận Số.');
    }

    // Kiểm tra dữ liệu Chu Kỳ Vận Số
    if (!Array.isArray(cycleData.value) || !cycleData.value.every(cycle => cycle && typeof cycle.year === 'number' && typeof cycle.number === 'number')) {
      console.error('Dữ liệu Chu Kỳ Vận Số không hợp lệ:', cycleData.value);
      throw new Error('Dữ liệu Chu Kỳ Vận Số không hợp lệ.');
    }

    console.log('Dữ liệu Chu Kỳ Vận Số:', cycleData.value);
    personalYearCycles.value = [...cycleData.value]; // Tạo bản sao
  } catch (err) {
    console.error('Lỗi trong calculateNumbers:', err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>
