<!-- components/LifePathAndSoulUrge.vue -->
<template>
  <div class="life-path-soul-urge-display">
    <h2 class="text-2xl font-bold text-center text-teal-800 mb-6">Tương Quan Số Đường Đời và Số Linh Hồn</h2>
    
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
        <!-- Hiển thị số Đường Đời và Số Linh Hồn -->
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
                {{ soulUrgeNumber }}
              </span>
              <p class="text-gray-700 text-lg">Số Linh Hồn: <span class="font-bold text-teal-600">{{ soulUrgeNumber }}</span></p>
            </div>
          </div>
        </div>
        
        <!-- Luận giải chi tiết -->
        <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 class="text-xl font-bold text-teal-800 mb-4">Luận Giải Chi Tiết</h3>
          <div class="prose prose-teal max-w-none space-y-3">
            <p class="text-gray-700"><strong>Mô tả:</strong> {{ combinationData.description }}</p>
            <p class="text-gray-700"><strong>Điểm mạnh:</strong></p>
            <ul class="list-disc pl-5">
              <li v-for="(strength, index) in combinationData.strengths" :key="index" class="text-gray-700">{{ strength }}</li>
            </ul>
            <p class="text-gray-700"><strong>Điểm yếu:</strong></p>
            <ul class="list-disc pl-5">
              <li v-for="(weakness, index) in combinationData.weaknesses" :key="index" class="text-gray-700">{{ weakness }}</li>
            </ul>
            <p class="text-gray-700"><strong>Lời khuyên:</strong></p>
            <ul class="list-disc pl-5">
              <li v-for="(advice, index) in combinationData.advice" :key="index" class="text-gray-700">{{ advice }}</li>
            </ul>
            <p class="text-gray-700"><strong>Thách thức:</strong></p>
            <ul class="list-disc pl-5">
              <li v-for="(challenge, index) in combinationData.challenges" :key="index" class="text-gray-700">{{ challenge }}</li>
            </ul>
            <p class="text-gray-700"><strong>Đặc điểm nổi bật:</strong></p>
            <ul class="list-disc pl-5">
              <li v-for="(trait, index) in combinationData.traits" :key="index" class="text-gray-700">{{ trait }}</li>
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
import { ref, watch, onMounted, computed } from 'vue'
import { toast } from 'vue3-toastify'
import { calculateLifePathNumber } from '@/utils/numerology-calculations'

const calculateSoulUrgeNumber = (fullName) => {
  if (!fullName) return null
  const vowels = { a: 1, e: 5, i: 9, o: 6, u: 3 }
  const normalizedName = fullName
    .toLowerCase()
    .replace(/[^a-z]/g, '')
  let sum = normalizedName
    .split('')
    .reduce((sum, char) => (vowels[char] ? sum + vowels[char] : sum), 0)
  if (sum === 0) return null
  while (sum > 9 && sum !== 11 && sum !== 22) {
    sum = sum
      .toString()
      .split('')
      .reduce((s, digit) => s + parseInt(digit), 0)
  }
  return sum
}

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
const soulUrgeNumber = ref(null)
const combinationData = ref(null)
const loading = ref(false)
const error = ref(null)

const showResult = computed(() => {
  return combinationData.value && lifePathNumber.value !== null && soulUrgeNumber.value !== null
})

const fetchCombinationData = async () => {
  loading.value = true
  error.value = null
  lifePathNumber.value = null
  soulUrgeNumber.value = null
  combinationData.value = null

  try {
    if (!props.birthDate || !props.fullName) {
      throw new Error('Vui lòng nhập đầy đủ họ tên và ngày sinh')
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
    soulUrgeNumber.value = calculateSoulUrgeNumber(props.fullName)

    if (!lifePathNumber.value || !soulUrgeNumber.value) {
      throw new Error('Không thể tính toán các chỉ số số học')
    }

    const fileName = `LifePath${lifePathNumber.value}SoulUrgeData.json`
    console.log('Đang tải file dữ liệu:', fileName)
    
    const response = await fetch(`/data/LifePathAndSoulUrge/${fileName}`)
    if (!response.ok) {
      throw new Error(`Không tìm thấy file dữ liệu cho Số Đường Đời ${lifePathNumber.value}`)
    }
    
    const data = await response.json()
    if (!data.combinations) {
      throw new Error(`Dữ liệu JSON không đúng định dạng (thiếu 'combinations')`)
    }

    const combination = data.combinations.find(
      (item) => item.soulUrge === soulUrgeNumber.value
    )

    if (combination) {
      combinationData.value = combination
      toast.success('Phân tích tương quan thành công!')
    } else {
      throw new Error(`Không tìm thấy dữ liệu cho Số Linh Hồn ${soulUrgeNumber.value}`)
    }

  } catch (err) {
    console.error('Lỗi trong fetchCombinationData:', err)
    error.value = err.message
    toast.error(err.message)
    
    combinationData.value = {
      description: `Tạm thời chưa có dữ liệu chi tiết cho cặp số ${lifePathNumber.value} và ${soulUrgeNumber.value}`,
      strengths: ['Đang cập nhật dữ liệu'],
      weaknesses: ['Đang cập nhật dữ liệu'],
      advice: ['Đang cập nhật dữ liệu'],
      challenges: ['Đang cập nhật dữ liệu'],
      traits: ['Đang cập nhật dữ liệu'],
    }
  } finally {
    loading.value = false
  }
}

watch(
  [() => props.birthDate, () => props.fullName],
  ([newBirthDate, newFullName]) => {
    if (newBirthDate && newFullName && /^\d{2}\/\d{2}\/\d{4}$/.test(newBirthDate)) {
      fetchCombinationData()
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.birthDate && props.fullName && /^\d{2}\/\d{2}\/\d{4}$/.test(props.birthDate)) {
    fetchCombinationData()
  }
})
</script>

<style scoped>
.life-path-soul-urge-display {
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
  .life-path-soul-urge-display {
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