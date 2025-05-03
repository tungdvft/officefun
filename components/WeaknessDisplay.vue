<template>
  <div class="weakness-display max-w-800px mx-auto p-5 font-inter">
    <h2 class="text-2xl font-bold text-center text-teal-800 mb-6">Các Điểm Yếu</h2>
    
    <!-- Thông báo lỗi -->
    <div v-if="error" class="p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded transition-all duration-300">
      {{ error }}
    </div>
    
    <!-- Trạng thái loading -->
    <div v-else-if="loading" class="p-4 text-center text-gray-600">
      <div class="animate-pulse">Đang tải dữ liệu...</div>
    </div>
    
    <!-- Hiển thị kết quả -->
    <div v-else-if="showResult" class="mt-6 animate-fadeIn">
      <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <h3 class="text-xl font-bold text-teal-800 mb-4">Các Điểm Yếu Của Bạn</h3>
        <p class="text-gray-700 text-lg">Các số điểm yếu: <span class="font-bold text-teal-600">{{ weaknessNumbers.join(', ') }}</span></p>
      </div>
      
      <div v-for="weakness in weaknessDataList" :key="weakness.number" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-6">
        <h3 class="text-xl font-bold text-teal-800 mb-4">Số {{ weakness.number }}</h3>
        <div class="prose prose-teal max-w-none space-y-3">
          <p class="text-gray-700"><strong>Mô tả:</strong> {{ weakness.description }}</p>
          <p class="text-gray-700"><strong>Lời khuyên:</strong></p>
          <ul class="list-disc pl-5">
            <li v-for="(advice, index) in weakness.advice" :key="index" class="text-gray-700">{{ advice }}</li>
          </ul>
        </div>
      </div>
    </div>
    
    <!-- Yêu cầu nhập thông tin -->
    <div v-else class="p-4 text-center animate-fadeIn">
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Vui lòng nhập họ tên hợp lệ để xem thông tin.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { calculateWeaknessNumbers } from '~/utils/numerology-calculations';
import weaknessDataJson from '~/data/weaknessData.json';

const props = defineProps({
  fullName: {
    type: String,
    default: '',
  },
});

const weaknessNumbers = ref([]);
const weaknessDataList = ref([]);
const loading = ref(false);
const error = ref(null);

const showResult = computed(() => {
  return weaknessDataList.value.length > 0 && weaknessNumbers.value.length > 0;
});

const loadWeaknessData = async () => {
  loading.value = true;
  error.value = null;
  weaknessNumbers.value = [];
  weaknessDataList.value = [];

  try {
    if (!props.fullName) {
      throw new Error('Vui lòng nhập đầy đủ họ tên');
    }

    weaknessNumbers.value = calculateWeaknessNumbers(props.fullName);

    if (!weaknessNumbers.value || weaknessNumbers.value.length === 0) {
      throw new Error('Không tìm thấy điểm yếu nào');
    }

    weaknessDataList.value = weaknessNumbers.value
      .map((number) => weaknessDataJson.weaknesses.find((weakness) => weakness.number === number))
      .filter(Boolean);

    if (weaknessDataList.value.length > 0) {
    } else {
      throw new Error('Không tìm thấy dữ liệu cho các số điểm yếu');
    }
  } catch (err) {
    console.error('Lỗi trong loadWeaknessData:', err);
    error.value = err.message;
    weaknessDataList.value = [{
      number: 0,
      description: 'Tạm thời chưa có dữ liệu chi tiết cho các điểm yếu',
      advice: ['Đang cập nhật dữ liệu'],
    }];
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.fullName,
  (newFullName) => {
    if (newFullName) {
      loadWeaknessData();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.weakness-display {
  font-family: 'Inter', Arial, sans-serif;
}

.transition-all {
  transition: all 0.3s ease;
}

.animate-fadeIn {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .weakness-display {
    padding: 15px;
  }
  .text-2xl {
    font-size: 1.4rem;
  }
  .text-xl {
    font-size: 1.2rem;
  }
  .text-lg {
    font-size: 1rem;
  }
}
</style>