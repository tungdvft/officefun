<template>
  <div class="mb-8">
    <h3 class="text-lg font-semibold mb-2">Nhóm Tính Cách</h3>
    <p class="mb-4">
      Đây là các nhóm tính cách trong bản ngã của bạn. Bạn nên tập trung luyện tập những nhóm có tỷ lệ thấp nhất.
    </p>
    <div v-if="error" class="text-red-500 mb-4">{{ error }}</div>
    <div v-if="personalityGroups" class="grid gap-4">
      <div
        v-for="(group, index) in personalityGroups"
        :key="group.group"
        class="border p-4 rounded"
      >
        <h4 class="font-medium mb-2">{{ group.group }}: {{ group.traits }}</h4>
        <div class="flex items-center gap-2">
          <div
            :class="personalityBarColors[index]"
            class="h-6 rounded"
            :style="{ width: `${group.percentage}%` }"
          ></div>
          <span>{{ group.percentage }}%</span>
        </div>
      </div>
    </div>
    <div v-else-if="!error" class="text-gray-500">
      Chưa có dữ liệu nhóm tính cách. Vui lòng nhập ngày sinh hợp lệ.
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { calculateLifePathNumber } from '~/utils/numerology-calculations';
import lifePathData from '~/data/lifePathData.json';

const props = defineProps({
  birthDate: {
    type: String,
    default: ''
  }
});

const personalityGroups = ref(null);
const error = ref('');

const personalityBarColors = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500',
  'bg-indigo-500',
  'bg-teal-500',
  'bg-orange-500'
];

watch(() => props.birthDate, (newDate) => {
  error.value = '';
  personalityGroups.value = null;

  if (!newDate) {
    error.value = 'Vui lòng nhập ngày sinh!';
    return;
  }

  const datePattern = /^\d{1,2}\/\d{1,2}\/\d{4}$/;
  if (!datePattern.test(newDate)) {
    error.value = 'Ngày sinh không hợp lệ! Vui lòng nhập định dạng dd/mm/yyyy.';
    return;
  }

  try {
    const lifePath = calculateLifePathNumber(newDate);
    console.log('lifePath:', lifePath);
    console.log('lifePathData:', lifePathData);
    const result = lifePathData.find((item) => item.lifePathNumber === lifePath);
    console.log('result:', result);
    if (!result || !result.personalityGroups) {
      error.value = 'Không tìm thấy dữ liệu nhóm tính cách cho số đường đời này!';
      return;
    }
    personalityGroups.value = result.personalityGroups;
  } catch (e) {
    error.value = e.message || 'Lỗi khi tính nhóm tính cách!';
    console.error('Lỗi PersonalityGroups:', e);
  }
}, { immediate: true });
</script>

<style scoped>
/* Tailwind CSS được sử dụng trực tiếp trong template */
</style>