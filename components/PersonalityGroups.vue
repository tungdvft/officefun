<template>
  <div class="mb-10 p-6 bg-white rounded-xl shadow-md">
    <div class="flex items-start mb-4">
      <div class="p-2 bg-indigo-100 rounded-lg mr-4">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      </div>
      <div>
        <h3 class="text-xl font-bold text-gray-800 mb-1">Phân Tích Nhóm Tính Cách</h3>
        <p class="text-gray-600">
          Các nhóm tính cách trong bản ngã của bạn. 
          <span class="font-medium text-indigo-600">Hãy tập trung cải thiện nhóm có tỷ lệ thấp nhất.</span>
        </p>
      </div>
    </div>

    <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
      <div class="flex items-center text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
        </svg>
        <span>{{ error }}</span>
      </div>
    </div>

    <div v-else-if="!personalityGroups" class="mt-6 p-4 bg-gray-50 rounded-lg text-center">
      <p class="text-gray-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Vui lòng nhập ngày sinh hợp lệ để xem phân tích nhóm tính cách
      </p>
    </div>

    <div v-else class="mt-6 space-y-5">
      <div 
        v-for="(group, index) in sortedGroups" 
        :key="group.group"
        class="group transition-all duration-200 hover:shadow-sm"
      >
        <div class="flex items-center justify-between mb-1">
          <h4 class="font-medium text-gray-800">
            <span class="inline-block w-6 h-6 rounded-full mr-2 text-white text-sm flex items-center justify-center"
                  :class="personalityBadgeColors[index]">
              {{ index + 1 }}
            </span>
            {{ group.group }}
            <span class="text-xs font-normal text-gray-500 ml-2">({{ group.traits }})</span>
          </h4>
          <span class="font-medium" :class="percentageColor(group.percentage)">
            {{ group.percentage }}%
          </span>
        </div>
        
        <div class="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            class="h-2.5 rounded-full transition-all duration-500 ease-out" 
            :class="personalityBarColors[index]"
            :style="{ width: `${group.percentage}%` }"
          ></div>
        </div>

        <div v-if="index === sortedGroups.length - 1" class="mt-3 px-3 py-2 bg-blue-50 rounded-lg text-sm text-blue-700">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Đây là nhóm tính cách bạn cần tập trung cải thiện nhiều nhất
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
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

// Màu sắc cho thanh tiến trình
const personalityBarColors = [
  'bg-gradient-to-r from-red-500 to-red-400',
  'bg-gradient-to-r from-blue-500 to-blue-400',
  'bg-gradient-to-r from-green-500 to-green-400',
  'bg-gradient-to-r from-yellow-500 to-yellow-400',
  'bg-gradient-to-r from-purple-500 to-purple-400',
  'bg-gradient-to-r from-pink-500 to-pink-400',
  'bg-gradient-to-r from-indigo-500 to-indigo-400',
  'bg-gradient-to-r from-teal-500 to-teal-400',
  'bg-gradient-to-r from-orange-500 to-orange-400'
];

// Màu sắc cho badge số thứ tự
const personalityBadgeColors = [
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

// Sắp xếp các nhóm theo tỷ lệ tăng dần
const sortedGroups = computed(() => {
  if (!personalityGroups.value) return [];
  return [...personalityGroups.value].sort((a, b) => a.percentage - b.percentage);
});

// Màu sắc cho phần trăm dựa trên giá trị
const percentageColor = (percent) => {
  if (percent < 20) return 'text-red-600';
  if (percent < 40) return 'text-yellow-600';
  if (percent < 60) return 'text-blue-600';
  if (percent < 80) return 'text-green-600';
  return 'text-purple-600';
};

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
    const result = lifePathData.find((item) => item.lifePathNumber === lifePath);
    
    if (!result || !result.personalityGroups) {
      error.value = 'Không tìm thấy dữ liệu nhóm tính cách cho số đường đời này!';
      return;
    }
    
    personalityGroups.value = result.personalityGroups.map(group => ({
      ...group,
      percentage: Math.min(100, Math.max(0, group.percentage)) // Đảm bảo % trong khoảng 0-100
    }));
    
  } catch (e) {
    error.value = e.message || 'Lỗi khi tính nhóm tính cách!';
    console.error('Lỗi PersonalityGroups:', e);
  }
}, { immediate: true });
</script>

<style scoped>
/* Thêm hiệu ứng mượt mà cho thanh progress */
.bg-gradient-to-r {
  transition: width 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>