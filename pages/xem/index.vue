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
                Phân tích tổng quan
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
            <!-- Error message -->
            <p v-if="error" class="mt-2 text-red-600 text-center font-medium">{{ error }}</p>
          </div>
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

          <!-- DailyNumerology component -->
          <div class="grid grid-cols-1 gap-8">
            <DailyNumerology :birth-date="calculatedBirthDate" />
          </div>

          <!-- Button to show detailed components -->
          <div v-if="!showDetailedComponents" class="flex justify-center">
            <button
              @click="showDetails"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 shadow-md"
            >
              <span class="flex items-center justify-center gap-2">
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
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                Xem diễn giải chi tiết
              </span>
            </button>
          </div>

          <!-- Detailed components (shown when showDetails is true) -->
          <transition name="slide-fade">
            <div v-if="showDetailedComponents" class="grid grid-cols-1 gap-8" id="detailed-components">
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
              <NaturalAbilityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
              <OvercomeChallengeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
              <MentalCapacityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
              <ApproachMotivationDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
              <ApproachCapacityDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
              <ApproachAttitudeDisplay :birth-date="calculatedBirthDate" :full-name="calculatedFullName" />
            </div>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useGeneralStore } from '~/stores/general';
import { useRouter } from 'vue-router';
import { useHead } from '@unhead/vue';
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
import NumerologyPowerChart from '~/components/NumerologyPowerChart.vue';
import ExpressionNumber from '~/components/ExpressionNumber.vue';
import PersonalityChallengeDisplay from '~/components/PersonalityChallengeDisplay.vue';
import WeaknessDisplay from '~/components/WeaknessDisplay.vue';
import NaturalAbilityDisplay from '~/components/NaturalAbilityDisplay.vue';
import OvercomeChallengeDisplay from '~/components/OvercomeChallengeDisplay.vue';
import MentalCapacityDisplay from '~/components/MentalCapacityDisplay.vue';
import ApproachMotivationDisplay from '~/components/ApproachMotivationDisplay.vue';
import ApproachCapacityDisplay from '~/components/ApproachCapacityDisplay.vue';
import ApproachAttitudeDisplay from '~/components/ApproachAttitudeDisplay.vue';
import DailyNumerology from '~/components/DailyNumerology.vue';

definePageMeta({
  layout: 'view',
});

useHead({
  title: 'Thần Số Học Toàn Diện - Khám Phá Con Số Chủ Đạo Của Bạn',
  meta: [
    { name: 'description', content: 'Khám phá ý nghĩa con số chủ đạo, số đường đời, và các chỉ số thần số học khác dựa trên ngày sinh và tên của bạn. Phân tích chi tiết giúp bạn hiểu rõ bản thân và định hướng cuộc sống.' },
    { name: 'keywords', content: 'thần số học, con số chủ đạo, số đường đời, phân tích thần số học, dự đoán tương lai, ý nghĩa ngày sinh' },
    { name: 'robots', content: 'index, follow' },
    { property: 'og:title', content: 'Thần Số Học Toàn Diện - Khám Phá Con Số Chủ Đạo' },
    { property: 'og:description', content: 'Tìm hiểu con số chủ đạo và các chỉ số thần số học quan trọng của bạn. Nhập ngày sinh và tên để nhận phân tích chi tiết.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: 'https://luangiaithanso.com/xem' },
  ],
  link: [
    { rel: 'canonical', href: 'https://luangiaithanso.com/xem' },
  ],
});

const generalStore = useGeneralStore();
const router = useRouter();

const fullName = ref('');
const birthDate = ref('');
const calculatedFullName = ref('');
const calculatedBirthDate = ref('');
const result = ref(null);
const error = ref('');
const isLoading = ref(false);
const startCalulation = ref(false);
const showDetailedComponents = ref(false);

// Hàm để hiển thị các component chi tiết và cuộn xuống
const showDetails = () => {
  showDetailedComponents.value = true;
  setTimeout(() => {
    const detailedSection = document.getElementById('detailed-components');
    if (detailedSection) {
      detailedSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 100);
};

// Khởi tạo giá trị từ generalStore, localStorage userData, hoặc localStorage auth
onMounted(async () => {
  // 1. Ưu tiên khôi phục từ generalStore
  if (generalStore.hasData) {
    fullName.value = generalStore.fullname;
    birthDate.value = generalStore.birthdate;
    calculatedFullName.value = generalStore.fullname;
    calculatedBirthDate.value = generalStore.birthdate;

    try {
      const lifePath = calculateLifePathNumber(generalStore.birthdate);
      const lifePathStr = [11, 22].includes(lifePath) ? lifePath.toString() : lifePath.toString();
      const { data: lifePathData, error: lifePathError } = await useFetch(`/api/life-path/${lifePathStr}`, {
        baseURL: useRuntimeConfig().public.apiBase,
      });

      if (lifePathError.value) {
        console.error('Lỗi API Số Đường Đời từ generalStore:', lifePathError.value);
        error.value = 'Lỗi khi lấy dữ liệu Số Đường Đời.';
        return;
      }

      if (!lifePathData.value) {
        error.value = 'Không tìm thấy dữ liệu cho Số Đường Đời này.';
        return;
      }

      result.value = lifePathData.value;
      startCalulation.value = true;
      return; // Thoát sớm nếu dữ liệu từ generalStore hợp lệ
    } catch (err) {
      console.error('Lỗi khi tính toán result từ generalStore:', err);
      error.value = err.message;
    }
  }

  // 2. Nếu generalStore không có dữ liệu, kiểm tra localStorage với key 'userData'
  const savedUserData = localStorage.getItem('userData');
  if (savedUserData) {
    try {
      const parsedData = JSON.parse(savedUserData);
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
        return; // Thoát sớm nếu dữ liệu từ 'userData' hợp lệ
      }
    } catch (err) {
      console.error('Lỗi khi khôi phục dữ liệu từ localStorage (userData):', err);
    }
  }

  // 3. Nếu không có dữ liệu hợp lệ từ 'userData', kiểm tra localStorage với key 'auth'
  const savedAuthData = localStorage.getItem('auth');
  if (savedAuthData) {
    try {
      const parsedData = JSON.parse(savedAuthData);
      const { fullname: savedFullName, birthdate: savedBirthDate } = parsedData;
      if (
        savedFullName &&
        savedBirthDate &&
        (savedBirthDate.match(/^\d{2}\/\d{2}\/\d{4}$/) || savedBirthDate.match(/^\d{4}-\d{2}-\d{2}T/))
      ) {
        // Chuyển đổi birthdate từ định dạng ISO nếu cần
        let formattedBirthDate = savedBirthDate;
        if (savedBirthDate.includes('T')) {
          const dateObj = new Date(savedBirthDate);
          formattedBirthDate = `${String(dateObj.getDate()).padStart(2, '0')}/${String(dateObj.getMonth() + 1).padStart(2, '0')}/${dateObj.getFullYear()}`;
        }
        fullName.value = savedFullName;
        birthDate.value = formattedBirthDate;
        calculatedFullName.value = savedFullName;
        calculatedBirthDate.value = formattedBirthDate;

        // Tính toán result cho auth data
        try {
          const lifePath = calculateLifePathNumber(formattedBirthDate);
          const lifePathStr = [11, 22].includes(lifePath) ? lifePath.toString() : lifePath.toString();
          const { data: lifePathData, error: lifePathError } = await useFetch(`/api/life-path/${lifePathStr}`, {
            baseURL: useRuntimeConfig().public.apiBase,
          });

          if (lifePathError.value) {
            console.error('Lỗi API Số Đường Đời từ auth:', lifePathError.value);
            error.value = 'Lỗi khi lấy dữ liệu Số Đường Đời.';
            return;
          }

          if (!lifePathData.value) {
            error.value = 'Không tìm thấy dữ liệu cho Số Đường Đời này.';
            return;
          }

          result.value = lifePathData.value;
          startCalulation.value = true;
        } catch (err) {
          console.error('Lỗi khi tính toán result từ auth:', err);
          error.value = err.message;
        }
      }
    } catch (err) {
      console.error('Lỗi khi khôi phục dữ liệu từ localStorage (auth):', err);
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

    // Lưu dữ liệu vào generalStore
    await generalStore.fetchNumerology({
      fullname: fullName.value,
      birthdate: birthDate.value,
    });

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

    // Lưu dữ liệu vào localStorage với key 'userData'
    localStorage.setItem('userData', JSON.stringify({
      fullName: calculatedFullName.value,
      birthDate: calculatedBirthDate.value,
      startCalulation: startCalulation.value,
      result: result.value,
    }));

    // Cuộn xuống phần kết quả
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