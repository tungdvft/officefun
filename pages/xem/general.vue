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
      <PersonalityGroups :birth-date="birthDate" />
      <NumerologyCycles :birth-date="birthDate" />
      <NumerologyPyramid :birth-date="birthDate" />
      <PersonalYearIndex :birth-date="birthDate" />
      <PersonalMonthCycle :birth-date="birthDate" />
      <DestinyNumber :birth-date="birthDate" :full-name="fullName" />
      <LifePathDestinyDisplay :birth-date="birthDate" :full-name="fullName" />
      <ChallengeDisplay :birth-date="birthDate" :full-name="fullName" />
      <MaturityDisplay :birth-date="birthDate" :full-name="fullName" />
      <MaturePowerDisplay :birth-date="birthDate" :full-name="fullName" />
      <SoulUrgeDisplay :birth-date="birthDate" :full-name="fullName" />
      <LifePathAndSoulUrge :birth-date="birthDate" :full-name="fullName" />
      <SoulChallengeDisplay :birth-date="birthDate" :full-name="fullName" />
      <PersonalityDisplay :birth-date="birthDate" :full-name="fullName" />
      <NumerologyPowerChart 
      :birth-date="birthDate" :full-name="fullName"
    />
      <PersonalityChallengeDisplay :birth-date="birthDate" :full-name="fullName" />
      <WeaknessDisplay :birth-date="birthDate" :full-name="fullName" />
      <KarmicDebtDisplay :birth-date="birthDate" :full-name="fullName" />
      <NaturalAbilityDisplay :birth-date="birthDate" :full-name="fullName" />
      <OvercomeChallengeDisplay :birth-date="birthDate" :full-name="fullName" />
      <MentalCapacityDisplay :birth-date="birthDate" :full-name="fullName" />
      <ApproachMotivationDisplay :birth-date="birthDate" :full-name="fullName" />
      <ApproachCapacityDisplay :birth-date="birthDate" :full-name="fullName" />
      <ApproachAttitudeDisplay :birth-date="birthDate" :full-name="fullName" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import LifePathCalculator from '~/components/LifePathCalculator.vue';
import PersonalYearChart from '~/components/PersonalYearChart.vue';
import PersonalityGroups from '~/components/PersonalityGroups.vue';
import NumerologyCycles from '~/components/NumerologyCycles.vue';
import NumerologyPyramid from '~/components/NumerologyPyramid.vue';
import PersonalYearIndex from '~/components/PersonalYearIndex.vue';
import PersonalMonthCycle from '~/components/PersonalMonthCycle.vue';
import DestinyNumber from '~/components/DestinyNumber.vue';
import LifePathDestinyDisplay from '~/components/LifePathDestinyDisplay.vue';
import ChallengeDisplay from '~/components/ChallengeDisplay.vue';
import MaturityDisplay from '~/components/MaturityDisplay.vue';
import MaturePowerDisplay from '~/components/MaturePowerDisplay.vue';
import SoulUrgeDisplay from '~/components/SoulUrgeDisplay.vue';
import LifePathAndSoulUrge from '~/components/LifePathAndSoulUrge.vue';
import SoulChallengeDisplay from '~/components/SoulChallengeDisplay.vue';
import PersonalityDisplay from '~/components/PersonalityDisplay.vue';
import PersonalityChallengeDisplay from '~/components/PersonalityChallengeDisplay.vue';
import WeaknessDisplay from '~/components/WeaknessDisplay.vue';
import KarmicDebtDisplay from '~/components/KarmicDebtDisplay.vue';
import NaturalAbilityDisplay from '~/components/NaturalAbilityDisplay.vue';
import OvercomeChallengeDisplay from '~/components/OvercomeChallengeDisplay.vue';
import MentalCapacityDisplay from '~/components/MentalCapacityDisplay.vue';
import ApproachMotivationDisplay from '~/components/ApproachMotivationDisplay.vue';
import ApproachCapacityDisplay from '~/components/ApproachCapacityDisplay.vue';
import ApproachAttitudeDisplay from '~/components/ApproachAttitudeDisplay.vue';

definePageMeta({
  layout: "view",
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
      baseURL: useRuntimeConfig().public.apiBase,
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