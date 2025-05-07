<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="p-6 space-y-8">
      <h2 class="text-3xl font-bold text-center text-teal-700 mb-6">Chỉ Số Thử Thách Nhân Cách</h2>
      
      <transition name="fade-slide">
        <!-- Thông báo lỗi -->
        <div v-if="error" class="text-center py-12 bg-red-50 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <h4 class="text-red-600 font-medium text-lg">{{ error }}</h4>
        </div>
        
        <!-- Trạng thái loading -->
        <div v-else-if="loading" class="text-center py-12">
          <div class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-3 h-8 w-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-600">Đang phân tích chỉ số thử thách nhân cách...</span>
          </div>
        </div>
        
        <!-- Hiển thị kết quả -->
        <div v-else-if="showResult" class="space-y-6">
          <!-- Hiển thị số Thử Thách Nhân Cách -->
          <div class="bg-gradient-to-r from-teal-50 to-blue-50 p-8 rounded-2xl border border-teal-100 shadow-sm text-center">
            <div class="flex flex-col items-center">
              <div class="relative">
                <!-- Animated circle background -->
                <svg class="w-32 h-32" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e2e8f0" stroke-width="8"/>
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#0d9488" stroke-width="8" stroke-dasharray="283" 
                          stroke-dashoffset="283" stroke-linecap="round">
                    <animate attributeName="stroke-dashoffset" dur="1.5s" from="283" to="0" fill="freeze" calcMode="spline" keySplines="0.3 0 0.7 1"/>
                  </circle>
                </svg>
                <!-- Number display -->
                <div class="absolute inset-0 flex items-center justify-center">
                  <span class="text-5xl font-bold text-teal-700">{{ challengeNumber }}</span>
                </div>
              </div>
              <h3 class="text-2xl font-bold text-teal-800 mt-6">Chỉ Số Thử Thách Nhân Cách {{ challengeNumber }}</h3>
              <p class="text-gray-600 mt-2 max-w-lg">{{ challengeData.description }}</p>
            </div>
          </div>
          
          <!-- Luận giải chi tiết -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Mô tả card -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-start mb-4">
                <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-lg font-semibold text-gray-800">Mô tả</h4>
                  <p class="text-gray-600 mt-2">{{ challengeData.description }}</p>
                </div>
              </div>
            </div>

            <!-- Lĩnh vực xuất sắc card -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div class="flex items-start mb-4">
                <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-lg font-semibold text-gray-800">Lĩnh vực xuất sắc</h4>
                  <p class="text-gray-600 mt-2">{{ challengeData.excellence }}</p>
                </div>
              </div>
            </div>

            <!-- Con đường phù hợp card -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
              <div class="flex items-start mb-4">
                <div class="flex-shrink-0 p-2 bg-teal-100 rounded-lg text-teal-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-lg font-semibold text-gray-800">Con đường phù hợp</h4>
                  <p class="text-gray-600 mt-2">{{ challengeData.path }}</p>
                </div>
              </div>
            </div>

            <!-- Lời khuyên card -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow md:col-span-2">
              <div class="flex items-start mb-4">
                <div class="flex-shrink-0 p-2 bg-amber-100 rounded-lg text-amber-600">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div class="ml-4">
                  <h4 class="text-lg font-semibold text-gray-800">Lời khuyên</h4>
                  <ul class="list-disc pl-5 mt-2 text-gray-600">
                    <li v-for="(advice, index) in challengeData.advice" :key="index">{{ advice }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Yêu cầu nhập thông tin -->
        <div v-else class="text-center py-12 bg-yellow-100 rounded-lg">
          <div class="text-yellow-700">
            Vui lòng nhập họ tên và ngày sinh hợp lệ (DD/MM/YYYY) để xem thông tin.
          </div>
        </div>
      </transition>
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

    if (!challengeNumber.value || challengeNumber.value < 1 || challengeNumber.value > 9) {
      throw new Error('Không thể tính toán Chỉ số Thử Thách Nhân Cách. Vui lòng kiểm tra lại thông tin.');
    }

    const data = personalityChallengeDataJson.challenges.find(
      (item) => item.number === challengeNumber.value
    );

    if (data) {
      challengeData.value = data;
    } else {
      throw new Error(`Không tìm thấy dữ liệu cho Chỉ số Thử Thách Nhân Cách ${challengeNumber.value}`);
    }
  } catch (err) {
    console.error('Lỗi trong loadChallengeData:', err);
    error.value = err.message;
    challengeData.value = {
      description: `Tạm thời chưa có dữ liệu chi tiết cho Chỉ số Thử Thách Nhân Cách ${challengeNumber.value || 'không xác định'}`,
      excellence: 'Chưa có dữ liệu chi tiết.',
      path: 'Hãy khám phá thêm về bản thân.',
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
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Animation for cards */
.card-enter-active {
  transition: all 0.3s ease;
  transition-delay: calc(0.1s * var(--i));
}
.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

@media (max-width: 640px) {
  .container {
    padding: 15px;
  }
  
  .text-3xl {
    font-size: 1.8rem;
  }
  
  .text-2xl {
    font-size: 1.4rem;
  }
  
  .text-lg {
    font-size: 1rem;
  }
}
</style>