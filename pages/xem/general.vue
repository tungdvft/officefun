<template>
  <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
    <h1 class="text-3xl font-bold text-center text-indigo-600 mb-6">
      Tính Số Đường Đời & Chu Kỳ Vận Số
    </h1>

    <!-- Form nhập họ tên và ngày sinh -->
    <div class="mb-6">
      <label for="fullName" class="block text-lg font-medium text-gray-700 mb-2">
        Nhập họ tên
      </label>
      <input
        v-model="fullName"
        type="text"
        id="fullName"
        placeholder="VD: Nguyễn Văn A"
        class="mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
      />
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
       
      </div>
       <button
          @click="calculateNumbers"
          :disabled="isLoading"
          class="px-6 mt-3 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
        >
          {{ isLoading ? 'Đang tính...' : 'Tính toán' }}
        </button>
      <p class="mt-2 text-sm text-gray-600">
        Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY (ví dụ: 25/12/1990).
      </p>
      <p v-if="error" class="mt-2 text-red-600">{{ error }}</p>
    </div>

    <!-- Hiển thị kết quả -->
    <div v-if="birthDate" class="space-y-8">
      <LifePathCalculator :birth-date="birthDate" :result="result" />
      <PersonalYearChart :birth-date="birthDate" />
      <PersonalityGroups :birth-date="birthDate"/>
      <NumerologyCycles :birth-date="birthDate" />
      <NumerologyPyramid :birth-date="birthDate" />
      <PersonalYearIndex :birth-date="birthDate" />
      <PersonalMonthCycle :birth-date="birthDate" />
      <DestinyNumber :birth-date="birthDate"  :full-name="fullName"/>
      <LifePathDestinyDisplay 
        :birth-date="birthDate"
        :full-name="fullName"
      />
       <ChallengeDisplay 
        :birth-date="birthDate"
        :full-name="fullName"
      />
       <MaturityDisplay 
        :birth-date="birthDate"
        :full-name="fullName"
      />
       <MaturePowerDisplay 
        :birth-date="birthDate"
        :full-name="fullName"
      />
       <SoulUrgeDisplay 
        :birth-date="birthDate"
        :full-name="fullName"
      />
       <LifePathAndSoulUrge 
        :birth-date="birthDate"
        :full-name="fullName"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

definePageMeta({
  ssr: false
});

const fullName = ref('');
const birthDate = ref('');
const result = ref(null);
const error = ref('');
const isLoading = ref(false);
const showChart = ref(false);

const formatDateInput = (event) => {
  let value = event.target.value.replace(/[^0-9]/g, '');
  if (value.length > 2 && value.length <= 4) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  } else if (value.length > 4) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  }
  birthDate.value = value;
};

const calculateNumbers = async () => {
  error.value = '';
  result.value = null;
  isLoading.value = true;
  try {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(birthDate.value)) {
      throw new Error('Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY');
    }

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

    const lifePath = calculateLifePathNumber(birthDate.value);
    const lifePathStr = [11, 22].includes(lifePath) ? lifePath.toString() : lifePath.toString();

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

    console.log('Dữ liệu Số Đường Đời:', lifePathData.value);
    result.value = lifePathData.value;
  } catch (err) {
    console.error('Lỗi trong calculateNumbers:', err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
</style>