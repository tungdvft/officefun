<template>
  <div class="mb-12 p-6 bg-white rounded-xl shadow-lg">
    <div class="text-center mb-8">
      <h2 class="text-4xl font-bold text-teal-700 mb-3">Chu Kỳ Đường Đời</h2>
      <div class="w-24 h-1 bg-teal-500 mx-auto mb-4 rounded-full"></div>
      <p class="text-lg text-gray-600 max-w-2xl mx-auto">
        Ba giai đoạn quan trọng trong cuộc đời mỗi người: Gieo Hạt, Chín Muồi và Thu Hoạch.
        Mỗi chu kỳ mang những bài học và cơ hội riêng.
      </p>
    </div>

    <div v-if="error" class="p-4 bg-red-50 rounded-lg border border-red-200 mb-6">
      <div class="flex items-center text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <div v-else-if="lifePathCycles" class="mt-6">
      <transition name="fade-slide">
        <div>
          <div 
            v-for="(cycle, index) in lifePathCycles" 
            :key="cycle.cycle"
            class="border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-md hover:border-indigo-200"
            :class="cycleCardClasses[index]"
          >
            <div class="p-5">
              <div class="flex items-center justify-between mb-3">
                <h3 class="text-lg font-bold" :class="cycleTextColors[index]">
                  {{ cycle.cycle }}
                </h3>
                <span class="text-xs font-semibold px-2 py-1 rounded-full" :class="cycleBadgeClasses[index]">
                  Số {{ cycle.number }}
                </span>
              </div>
              
              <div class="flex items-center text-sm text-gray-500 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{{ cycle.ageRange }} ({{ cycle.yearRange }})</span>
              </div>

              <div class="space-y-4">
                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Ý nghĩa
                  </h4>
                  <p class="text-gray-600 text-sm">{{ cycle.description.meaning || 'Không có dữ liệu.' }}</p>
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Hướng dẫn
                  </h4>
                  <p class="text-gray-600 text-sm">{{ cycle.description.advice || 'Không có dữ liệu.' }}</p>
                </div>

                <div>
                  <h4 class="text-sm font-semibold text-gray-700 mb-1 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Tác động chính
                  </h4>
                  <ul class="text-gray-600 text-sm space-y-1 pl-5">
                    <li v-for="(impact, i) in (cycle.description.impact?.split('\n') || ['Không có dữ liệu.'])" 
                        :key="i" class="relative pl-3">
                      <span class="absolute left-0 top-2 w-1.5 h-1.5 rounded-full" :class="cycleDotColors[index]"></span>
                      {{ impact }}
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div class="px-5 py-3 border-t" :class="cycleFooterClasses[index]">
              <div class="flex items-center justify-between text-xs">
                <span class="font-medium" :class="cycleTextColors[index]">Giai đoạn quan trọng</span>
                <span class="font-semibold">{{ cycle.percentage }}% ảnh hưởng</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div class="h-1.5 rounded-full" :class="cycleBarColors[index]" 
                     :style="{ width: `${cycle.percentage}%` }"></div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>

    <div v-else-if="!error" class="text-center py-8">
      <div class="inline-flex flex-col items-center px-6 py-4 bg-gray-50 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500">Vui lòng nhập ngày sinh để xem phân tích chu kỳ đường đời</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { NumerologyUtils } from '~/utils/numerology-calculations';
import cycleDescriptions from '~/data/cycleDescriptions.json';

const props = defineProps({
  birthDate: String
});

const lifePathCycles = ref(null);
const error = ref('');

const cycleCardClasses = [
  'border-cyan-100 bg-cyan-50',
  'border-lime-100 bg-lime-50',
  'border-amber-100 bg-amber-50'
];

const cycleBarColors = [
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500'
];

const cycleTextColors = [
  'text-cyan-700',
  'text-lime-700',
  'text-amber-700'
];

const cycleBadgeClasses = [
  'bg-cyan-100 text-cyan-800',
  'bg-lime-100 text-lime-800',
  'bg-amber-100 text-amber-800'
];

const cycleDotColors = [
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500'
];

const cycleFooterClasses = [
  'border-cyan-200 bg-cyan-100',
  'border-lime-200 bg-lime-100',
  'border-amber-200 bg-amber-100'
];

watch(() => props.birthDate, (newDate) => {
  error.value = '';
  lifePathCycles.value = null;

  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!newDate || !datePattern.test(newDate)) {
    error.value = 'Ngày sinh không hợp lệ! Vui lòng nhập định dạng dd/mm/yyyy';
    return;
  }

  try {
    const [day, month, year] = newDate.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year) || day < 1 || day > 31 || month < 1 || month > 12 || year < 1900 || year > 2025) {
      error.value = 'Ngày sinh không hợp lệ! Vui lòng kiểm tra lại';
      return;
    }

    const cycles = [
      {
        cycle: 'Gieo Hạt',
        number: NumerologyUtils.reduceToSingleDigit(month),
        ageRange: '0 - 29 tuổi',
        yearRange: `${year} - ${year + 29}`,
        percentage: 30,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(month)]?.['Gieo Hạt'] || { meaning: 'Không có dữ liệu.', advice: 'Không có dữ liệu.', impact: 'Không có dữ liệu.' }
      },
      {
        cycle: 'Chín Muồi',
        number: NumerologyUtils.reduceToSingleDigit(day),
        ageRange: '30 - 56 tuổi',
        yearRange: `${year + 30} - ${year + 56}`,
        percentage: 40,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(day)]?.['Chín Muồi'] || { meaning: 'Không có dữ liệu.', advice: 'Không có dữ liệu.', impact: 'Không có dữ liệu.' }
      },
      {
        cycle: 'Thu Hoạch',
        number: NumerologyUtils.reduceToSingleDigit(year.toString().split('').reduce((a, b) => a + parseInt(b), 0)),
        ageRange: '57 tuổi trở đi',
        yearRange: `${year + 57}+`,
        percentage: 30,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(year.toString().split('').reduce((a, b) => a + parseInt(b), 0))]?.['Thu Hoạch'] || { meaning: 'Không có dữ liệu.', advice: 'Không có dữ liệu.', impact: 'Không có dữ liệu.' }
      }
    ];
    lifePathCycles.value = cycles;
  } catch (e) {
    error.value = e.message || 'Lỗi khi tính toán chu kỳ đường đời';
    console.error('Lỗi LifePathCycles:', e);
  }
}, { immediate: true });
</script>

<style scoped>
.hover\:shadow-md {
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}
.hover\:shadow-md:hover {
  transform: translateY(-2px);
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