<template>
  <div class="personality-challenge-display max-w-800px mx-auto p-5 font-inter">
    <h2 class="text-2xl font-bold text-center text-teal-800 mb-6">Chỉ số Thử Thách Nhân Cách</h2>
    
    <!-- Thông báo lỗi -->
    <div v-if="error" class="error-message p-4 mb-4 bg-red-100 border border-red-400 text-red-700 rounded">
      {{ error }}
    </div>
    
    <!-- Trạng thái loading -->
    <div v-else-if="loading" class="loading-state p-4 text-center text-gray-600">
      <div class="animate-pulse">Đang tải dữ liệu...</div>
    </div>
    
    <!-- Hiển thị kết quả -->
    <div v-else-if="showResult" class="result-container mt-6">
      <div class="space-y-6">
        <!-- Hiển thị số Thử Thách Nhân Cách -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Chỉ Số Của Bạn</h3>
          <div class="flex items-center">
            <span class="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold text-lg mr-4">
              {{ challengeNumber }}
            </span>
            <p class="text-gray-700 text-lg">Số Thử Thách Nhân Cách: <span class="font-bold text-teal-600">{{ challengeNumber }}</span></p>
          </div>
        </div>
        
        <!-- Luận giải chi tiết -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Luận Giải Chi Tiết</h3>
          <div class="prose prose-teal max-w-none space-y-3">
            <p class="text-gray-700"><strong>Mô tả:</strong> {{ challengeData.description }}</p>
            <p class="text-gray-700"><strong>Lời khuyên:</strong></p>
            <ul class="list-disc pl-5">
              <li v-for="(advice, index) in challengeData.advice" :key="index" class="text-gray-700">{{ advice }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Yêu cầu nhập thông tin -->
    <div v-else class="empty-state p-4 text-center">
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Vui lòng nhập họ tên và ngày sinh hợp lệ (DD/MM/YYYY) để xem thông tin.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { calculatePersonalityChallengeNumber } from '@/utils/numerology-calculations';
import personalityChallengeDataJson from '@/data/personalityChallengeData.json';

const props = defineProps({
  birthDate: {
    type: String,
    default: '',
    validator: (value) => {
      if (!value) return true;
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value);
    },
  },
  fullName: {
    type: String,
    default: '',
  },
});

const challengeNumber = ref(null);
const challengeData = ref(null);
const loading = ref(false);
const error = ref(null);

const showResult = computed(() => {
  return challengeData.value && challengeNumber.value !== null;
});

const loadChallengeData = async () => {
  loading.value = true;
  error.value = null;
  challengeNumber.value = null;
  challengeData.value = null;

  try {
    if (!props.birthDate || !props.fullName || props.fullName.trim() === '') {
      throw new Error('Vui lòng nhập đầy đủ họ tên và ngày sinh hợp lệ');
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
      throw new Error('Định dạng ngày sinh không hợp lệ (DD/MM/YYYY)');
    }

    const [day, month, year] = props.birthDate.split('/').map(Number);
    const dateObj = new Date(year, month - 1, day);

    if (
      dateObj.getDate() !== day ||
      dateObj.getMonth() + 1 !== month ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      throw new Error('Ngày sinh không hợp lệ');
    }

    challengeNumber.value = calculatePersonalityChallengeNumber(props.fullName, props.birthDate);
    console.log('challengeNumber.value', challengeNumber.value)
    if (!challengeNumber.value || challengeNumber.value < 1 || challengeNumber.value > 9) {
      throw new Error('Không thể tính toán Chỉ số Thử Thách Nhân Cách. Vui lòng kiểm tra lại thông tin.');
    }

    const data = personalityChallengeDataJson.challenges.find(
      (item) => item.number === challengeNumber.value
    );

    if (data) {
      challengeData.value = data;
    } else {
      throw new Error(`Không tìm thấy dữ liệu cho số ${challengeNumber.value}`);
    }
  } catch (err) {
    console.error('Lỗi trong loadChallengeData:', err);
    error.value = err.message;
    challengeData.value = {
      description: `Tạm thời chưa có dữ liệu chi tiết cho số ${challengeNumber.value || 'không xác định'}`,
      advice: ['Vui lòng thử lại với thông tin khác hoặc liên hệ hỗ trợ'],
    };
  } finally {
    loading.value = false;
  }
};

watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    if (newBirthDate && newFullName && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
      loadChallengeData();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.personality-challenge-display {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', Arial, sans-serif;
}

.error-message {
  transition: all 0.3s ease;
}

.loading-state {
  transition: all 0.3s ease;
}

.result-container {
  animation: fadeIn 0.5s ease;
}

.empty-state {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

@media (max-width: 640px) {
  .personality-challenge-display {
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