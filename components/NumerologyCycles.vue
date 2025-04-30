<template>
  <div class="mb-8">
    <h2 class="text-2xl font-semibold text-indigo-600 mb-4">Chu Kỳ Đường Đời</h2>
    <p class="mb-4 text-gray-700">Ba giai đoạn: Gieo Hạt, Chín, Thu Hoạch.</p>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-if="lifePathCycles" class="grid gap-4">
      <div v-for="(cycle, index) in lifePathCycles" :key="cycle.cycle" class="border p-4 rounded">
        <h3 class="font-medium mb-2">{{ cycle.cycle }} (Số: {{ cycle.number }})</h3>
        <p class="mb-2 text-gray-700">{{ cycle.ageRange }} - {{ cycle.yearRange }}</p>
        <div class="text-gray-600 text-sm">
          <p><strong>Ý nghĩa:</strong> {{ cycle.description?.meaning || 'Chưa có dữ liệu' }}</p>
          <p><strong>Hướng dẫn:</strong> {{ cycle.description?.advice || 'Chưa có dữ liệu' }}</p>
          <p><strong>Tác động:</strong></p>
          <ul class="list-disc pl-5">
            <li v-for="impact in (cycle.description?.impact?.split('\n') || ['Chưa có dữ liệu'])" :key="impact">{{ impact }}</li>
          </ul>
        </div>
        <div class="flex items-center gap-2 mt-2">
          <div :class="cycleBarColors[index]" class="h-6 rounded w-20"></div>
          <span>Số {{ cycle.number }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { NumerologyUtils } from '~/utils/numerology-calculations';
import cycleDescriptions from '~/data/cycleDescriptions.json';

const props = defineProps({
  birthDate: String
});

const lifePathCycles = ref(null);
const error = ref('');
const cycleBarColors = ['bg-cyan-500', 'bg-lime-500', 'bg-amber-500'];

watch(() => props.birthDate, (newDate) => {
  error.value = '';
  lifePathCycles.value = null;

  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!datePattern.test(newDate)) {
    error.value = 'Ngày sinh không hợp lệ!';
    return;
  }

  try {
    const [day, month, year] = newDate.split('/').map(Number);
    if (isNaN(day) || isNaN(month) || isNaN(year) || year < 1900 || year > 2025) {
      error.value = 'Ngày sinh không hợp lệ!';
      return;
    }

    const cycles = [
      {
        cycle: 'Gieo Hạt',
        number: NumerologyUtils.reduceToSingleDigit(month),
        ageRange: '0 - 29 tuổi',
        yearRange: `${year} - ${year + 29}`,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(month)]?.['Gieo Hạt'] || {}
      },
      {
        cycle: 'Chín',
        number: NumerologyUtils.reduceToSingleDigit(day),
        ageRange: '30 - 56 tuổi',
        yearRange: `${year + 30} - ${year + 56}`,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(day)]?.['Chín'] || {}
      },
      {
        cycle: 'Thu Hoạch',
        number: NumerologyUtils.reduceToSingleDigit(year.toString().split('').reduce((a, b) => a + parseInt(b), 0)),
        ageRange: '57 tuổi trở đi',
        yearRange: `${year + 57}+`,
        description: cycleDescriptions[NumerologyUtils.reduceToSingleDigit(year.toString().split('').reduce((a, b) => a + parseInt(b), 0))]?.['Thu Hoạch'] || {}
      }
    ];
    lifePathCycles.value = cycles;
  } catch (e) {
    error.value = e.message || 'Lỗi khi tính chu kỳ!';
  }
}, { immediate: true });
</script>

<style scoped>
</style>