<!-- components/PersonalityDisplay.vue -->
<template>
  <div class="personality-display">
    <h2 class="text-2xl font-bold text-center text-teal-800 mb-6">Chỉ Số Nhân Cách</h2>
    
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
        <!-- Hiển thị số Nhân Cách -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Chỉ Số Của Bạn</h3>
          <div class="flex items-center">
            <span class="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold text-lg mr-4">
              {{ personalityNumber }}
            </span>
            <p class="text-gray-700 text-lg">Chỉ Số Nhân Cách: <span class="font-bold text-teal-600">{{ personalityNumber }}</span></p>
          </div>
        </div>
        
        <!-- Luận giải chi tiết -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Luận Giải Chi Tiết</h3>
          <div class="prose prose-teal max-w-none space-y-3">
            <p class="text-gray-700"><strong>Mô tả:</strong> {{ selectedPersonalityData.description }}</p>
            <p class="text-gray-700"><strong>Lời khuyên:</strong></p>
            <ul class="list-disc pl-5">
              <li v-for="(advice, index) in selectedPersonalityData.advice" :key="index" class="text-gray-700">{{ advice }}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Yêu cầu nhập thông tin -->
    <div v-else class="empty-state p-4 text-center">
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Vui lòng nhập họ tên hợp lệ để xem thông tin.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { calculatePersonalityNumber } from '@/utils/numerology-calculations'
import personalityData from '@/data/personalityData.json'

const props = defineProps({
  fullName: {
    type: String,
    default: '',
  },
})

const personalityNumber = ref(null)
const selectedPersonalityData = ref(null)
const loading = ref(false)
const error = ref(null)

const showResult = computed(() => {
  return selectedPersonalityData.value && personalityNumber.value !== null
})

const loadPersonalityData = async () => {
  loading.value = true
  error.value = null
  personalityNumber.value = null
  selectedPersonalityData.value = null

  try {
    if (!props.fullName || props.fullName.trim() === '') {
      throw new Error('Vui lòng nhập họ tên hợp lệ (chứa ít nhất một ký tự chữ cái)')
    }

    personalityNumber.value = calculatePersonalityNumber(props.fullName)

    if (!personalityNumber.value || personalityNumber.value < 1 || personalityNumber.value > 9) {
      throw new Error('Không thể tính toán Chỉ số Nhân Cách. Vui lòng kiểm tra lại họ tên.')
    }

    const data = personalityData.personalities.find(
      (item) => item.number === personalityNumber.value
    )

    if (data) {
      selectedPersonalityData.value = data
    } else {
      throw new Error(`Không tìm thấy dữ liệu cho Chỉ số Nhân Cách ${personalityNumber.value}`)
    }

  } catch (err) {
    console.error('Lỗi trong loadPersonalityData:', err)
    error.value = err.message
    
    selectedPersonalityData.value = {
      description: `Tạm thời chưa có dữ liệu chi tiết cho Chỉ số Nhân Cách ${personalityNumber.value || 'không xác định'}`,
      advice: ['Vui lòng thử lại với họ tên khác hoặc liên hệ hỗ trợ'],
    }
  } finally {
    loading.value = false
  }
}

watch(
  () => props.fullName,
  (newFullName) => {
    if (newFullName && newFullName.trim()) {
      loadPersonalityData()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.fullName && props.fullName.trim()) {
    loadPersonalityData()
  }
})
</script>

<style scoped>
.personality-display {
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
  .personality-display {
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