<!-- components/LifePathDestinyDisplay.vue -->
<template>
  <div class="life-path-destiny-display">
    <h2 class="text-2xl font-bold text-center text-teal-800 mb-6">Tương Quan Số Đường Đời và Sứ Mệnh</h2>
    
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
        <!-- Hiển thị số Đường Đời và Sứ Mệnh -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Chỉ Số Của Bạn</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex items-center">
              <span class="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold text-lg mr-4">
                {{ lifePathNumber }}
              </span>
              <p class="text-gray-700 text-lg">Số Đường Đời: <span class="font-bold text-teal-600">{{ lifePathNumber }}</span></p>
            </div>
            <div class="flex items-center">
              <span class="w-12 h-12 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold text-lg mr-4">
                {{ destinyNumber }}
              </span>
              <p class="text-gray-700 text-lg">Số Sứ Mệnh: <span class="font-bold text-teal-600">{{ destinyNumber }}</span></p>
            </div>
          </div>
        </div>
        
        <!-- Luận giải chi tiết -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Luận Giải Chi Tiết</h3>
          <div class="prose prose-teal max-w-none space-y-3">
            <p class="text-gray-700"><strong>Tương Thích:</strong> {{ correlationData.compatibility }}</p>
            <p class="text-gray-700"><strong>Điểm Mạnh:</strong> {{ correlationData.strengths }}</p>
            <p class="text-gray-700"><strong>Thách Thức:</strong> {{ correlationData.challenges }}</p>
            <p class="text-gray-700"><strong>Giải Pháp:</strong> {{ correlationData.solutions }}</p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Yêu cầu nhập thông tin -->
    <div v-else class="empty-state p-4 text-center">
      <div class="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
        Vui lòng nhập ngày sinh hợp lệ (DD/MM/YYYY) để xem thông tin.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { calculateLifePathNumber, calculateExpressionNumber } from '@/utils/numerology-calculations'

const props = defineProps({
  birthDate: {
    type: String,
    default: '',
    validator: (value) => {
      if (!value) return true
      return /^\d{2}\/\d{2}\/\d{4}$/.test(value)
    },
  },
  fullName: {
    type: String,
    default: '',
  },
})

const lifePathNumber = ref(null)
const destinyNumber = ref(null)
const correlationData = ref(null)
const loading = ref(false)
const error = ref(null)

const showResult = computed(() => {
  return correlationData.value && lifePathNumber.value !== null && destinyNumber.value !== null
})

const fetchCorrelationData = async () => {
  loading.value = true
  error.value = null
  lifePathNumber.value = null
  destinyNumber.value = null
  correlationData.value = null

  try {
    if (!props.birthDate) {
      throw new Error('Vui lòng nhập ngày sinh')
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
      throw new Error('Định dạng ngày sinh không hợp lệ (DD/MM/YYYY)')
    }

    const [day, month, year] = props.birthDate.split('/').map(Number)
    const dateObj = new Date(year, month - 1, day)
    
    if (
      dateObj.getDate() !== day ||
      dateObj.getMonth() + 1 !== month ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      throw new Error('Ngày sinh không hợp lệ')
    }

    lifePathNumber.value = calculateLifePathNumber(props.birthDate)
    destinyNumber.value = calculateExpressionNumber(props.fullName)

    const fileName = `LifePath${lifePathNumber.value}CorrelationData.json`
    console.log('Đang tải file dữ liệu:', fileName)
    
    const response = await fetch(`/data/LifePathDestinyCorrelationData/${fileName}`)
    if (!response.ok) {
      throw new Error(`Không tìm thấy file dữ liệu cho Số Đường Đời ${lifePathNumber.value}`)
    }
    
    const data = await response.json()
    if (!data.correlations) {
      throw new Error(`Dữ liệu JSON không đúng định dạng (thiếu 'correlations')`)
    }

    const correlation = data.correlations.find(
      (item) => item.destiny === destinyNumber.value
    )

    if (correlation) {
      correlationData.value = correlation
      toast.success('Phân tích tương quan thành công!')
    } else {
      throw new Error(`Không tìm thấy dữ liệu tương quan cho Sứ Mệnh ${destinyNumber.value}`)
    }

  } catch (err) {
    console.error('Lỗi trong fetchCorrelationData:', err)
    error.value = err.message
    toast.error(err.message)
    
    correlationData.value = {
      compatibility: `Tạm thời chưa có dữ liệu chi tiết cho cặp số ${lifePathNumber.value} và ${destinyNumber.value}`,
      strengths: 'Đang cập nhật dữ liệu',
      challenges: 'Đang cập nhật dữ liệu',
      solutions: 'Đang cập nhật dữ liệu',
    }
  } finally {
    loading.value = false
  }
}

watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    if (newBirthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
      fetchCorrelationData()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.birthDate && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchCorrelationData()
  }
})
</script>

<style scoped>
.life-path-destiny-display {
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
  .life-path-destiny-display {
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