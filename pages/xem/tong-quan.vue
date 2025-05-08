```vue
<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center py-8">
    <div class="container mx-auto px-4">
      <!-- Header section -->
      <div class="text-center mb-10">
        <h1 class="text-3xl md:text-4xl font-bold text-blue-800 mb-3">Thần Số Học Toàn Diện</h1>
        <p class="text-lg text-gray-600">Khám phá con số chủ đạo và các chỉ số quan trọng trong cuộc đời bạn</p>
      </div>

      <!-- Input form -->
      <div class="bg-white rounded-xl shadow-lg p-6 mb-10 border border-gray-100">
        <div class="space-y-6">
          <!-- Form inputs in two columns -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên đầy đủ</label>
              <input
                v-model="fullName"
                type="text"
                id="fullName"
                placeholder="Ví dụ: Nguyễn Văn A"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
              />
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="birthDate"
                type="text"
                id="birthDate"
                placeholder="Ví dụ: 25/12/1990"
                maxlength="10"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition text-base"
                @input="formatDateInput"
                @keyup.enter="calculateNumbers"
              />
            </div>
          </div>
          <p class="mt-2 text-sm text-gray-600">Vui lòng nhập ngày sinh theo định dạng DD/MM/YYYY</p>

          <!-- Submit button -->
          <div class="flex justify-center">
            <button
              @click="calculateNumbers"
              :disabled="isLoading || !birthDate || !fullName"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="!isLoading" class="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                Phân tích thần số học
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg
                  class="animate-spin h-5 w-5 text-white"
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
                Đang phân tích...
              </span>
            </button>
          </div>

          <!-- Error message -->
          <p v-if="error" class="mt-2 text-red-600 text-center font-medium">{{ error }}</p>
        </div>
      </div>

      <!-- Results section -->
      <transition name="slide-fade">
        <div v-if="startCalulation" class="space-y-8">
          <!-- Progress indicator -->
          <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <div class="bg-purple-100 p-2 rounded-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-purple-800">Báo cáo thần số học đã sẵn sàng</h3>
                <p class="text-gray-600">Cuộn xuống để xem các chỉ số chi tiết</p>
              </div>
            </div>
          </div>

          <!-- Components grid -->
          <div class="grid grid-cols-1 gap-8">
            <LifePathCalculator :birth-date="calculatedBirthDate" :result="result" />
            <PersonalYearChart :birth-date="calculatedBirthDate" />
            <PersonalityGroups :birth-date="calculatedBirthDate" />
            <NumerologyCycles :birth-date="calculatedBirthDate" />
            <NumerologyPyramid :birth-date="calculatedBirthDate" />
            <PersonalYearIndex :birth-date="calculatedBirthDate" />
            <PersonalMonthCycle :birth-date="calculatedBirthDate" />
            <DestinyNumber :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <LifePathDestinyDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <ChallengeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <MaturityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <MaturePowerDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <ExpressionNumber :full-name="calculatedFullName" />
            <SoulUrgeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <LifePathAndSoulUrge :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <SoulChallengeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <PersonalityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <NumerologyPowerChart :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <PersonalityChallengeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <WeaknessDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <!-- <KarmicDebtDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" /> -->
            <NaturalAbilityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <OvercomeChallengeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <MentalCapacityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <ApproachMotivationDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <ApproachCapacityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            <ApproachAttitudeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserStore } from '@/stores/user';
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
import NumerologyPowerChart from '~/components/NumerologyPowerChart.vue';
import ExpressionNumber from '~/components/ExpressionNumber.vue';

definePageMeta({
  layout: "view",
});

const fullName = ref('');
const birthDate = ref('');
const calculatedFullName = ref('');
const calculatedBirthDate = ref('');
const result = ref(null);
const error = ref('');
const isLoading = ref(false);
const startCalulation = ref(false);

// Lấy thông tin người dùng từ userStore
const userStore = useUserStore();
const user = userStore.user || { fullname: '', birthdate: '' }; // Fallback nếu user chưa có

// Hàm chuyển đổi định dạng ngày từ YYYY-MM-DD sang DD/MM/YYYY
const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return ''; // Trả về chuỗi rỗng nếu không hợp lệ
  }
  const [year, month, day] = dateStr.split('-');
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
};

// Khởi tạo giá trị từ userStore
fullName.value = user.fullname;
birthDate.value = formatDateToDDMMYYYY(user.birthdate);
calculatedFullName.value = user.fullname;
calculatedBirthDate.value = formatDateToDDMMYYYY(user.birthdate);

// Khôi phục dữ liệu từ localStorage khi trang được tải
onMounted(() => {
  const savedData = localStorage.getItem('numerologyData');
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData);
      const { fullName: savedFullName, birthDate: savedBirthDate, startCalulation: savedStartCalulation, result: savedResult } = parsedData;
      if (
        savedFullName &&
        savedBirthDate &&
        /^\d{2}\/\d{2}\/\d{4}$/.test(savedBirthDate) &&
        savedResult
      ) {
        fullName.value = savedFullName;
        birthDate.value = savedBirthDate;
        calculatedFullName.value = savedFullName;
        calculatedBirthDate.value = savedBirthDate;
        result.value = savedResult;
        startCalulation.value = savedStartCalulation;
      }
    } catch (err) {
      console.error('Lỗi khi khôi phục dữ liệu từ localStorage:', err);
    }
  }
});

const formatDateInput = (event) => {
  let value = event.target.value.replace(/[^0-9]/g, '');
  if (value.length > 2 && value.length <= 4) {
    value = `${value.slice(0, 2)}/${value.slice(2)}`;
  } else if (value.length > 4) {
    value = `${value.slice(0, 2)}/${value.slice(2, 4)}/${value.slice(4, 8)}`;
  }
  birthDate.value = value;
};

// Hàm tính số đường đời
const calculateLifePathNumber = (birthDate) => {
  const digits = birthDate.replace(/[^0-9]/g, '').split('').map(Number);
  let sum = digits.reduce((acc, curr) => acc + curr, 0);
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum.toString().split('').map(Number).reduce((acc, curr) => acc + curr, 0);
  }
  return sum;
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

    result.value = lifePathData.value;
    calculatedFullName.value = fullName.value;
    calculatedBirthDate.value = birthDate.value;
    startCalulation.value = true;

    // Lưu dữ liệu vào localStorage
    localStorage.setItem('numerologyData', JSON.stringify({
      fullName: calculatedFullName.value,
      birthDate: calculatedBirthDate.value,
      startCalulation: startCalulation.value,
      result: result.value,
    }));

    // Cuộn xuống phần kết quả sau khi tính toán
    setTimeout(() => {
      const resultsSection = document.querySelector('.bg-gradient-to-r.from-purple-50.to-blue-50.p-5.rounded-xl');
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 300);
  } catch (err) {
    console.error('Lỗi trong calculateNumbers:', err);
    error.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
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
```