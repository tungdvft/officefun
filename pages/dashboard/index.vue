<template>
  <div class="space-y-8">
    <!-- Banner chào mừng -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
      <h1 class="text-4xl font-bold mb-2">Chào mừng đến với Thần số học</h1>
      <p class="text-lg opacity-90">Khám phá năng lượng của bạn qua con số!</p>
    </div>

    <!-- Thần số học với 5 tab -->
    <div class="bg-white p-6 rounded-xl shadow-lg">
      <h2 class="text-2xl font-semibold text-purple-700 mb-4">Thần số học cá nhân</h2>

      <!-- Form nhập thông tin -->
      <div v-if="!userInfo.name || editing" class="space-y-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label for="name" class="block text-gray-700 font-medium mb-2">Họ và tên</label>
            <input
              v-model="form.name"
              type="text"
              id="name"
              placeholder="Ví dụ: Nguyễn Văn A"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label for="birthDate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
            <input
              v-model="form.birthDate"
              type="text"
              id="birthDate"
              placeholder="Ví dụ: 15/08/1995"
              class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>
        <button
          @click="submitForm"
          :disabled="loading || !isFormValid"
          class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors"
        >
          {{ loading ? 'Đang xử lý...' : 'Xem ngay' }}
        </button>
      </div>
      
      <!-- Hiển thị thông tin đã nhập -->
      <div v-else class="flex justify-between items-center mb-4">
        <p class="text-gray-700">
          Kết quả cho: <span class="font-semibold">{{ userInfo.name }}</span>
          <span class="text-sm text-gray-500 ml-2">({{ userInfo.birthDate }})</span>
        </p>
        <button
          @click="editing = true"
          class="text-purple-500 hover:underline flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Cập nhật
        </button>
      </div>

      <!-- Tabs -->
      <div v-if="userInfo.name" class="flex overflow-x-auto border-b mb-4 hide-scrollbar">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="switchTab(tab.value)"
          :class="[
            'py-2 px-4 font-medium whitespace-nowrap',
            activeTab === tab.value
              ? 'border-b-2 border-purple-500 text-purple-700'
              : 'text-gray-500 hover:text-purple-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Nội dung chính -->
      <div v-if="!userInfo.name" class="text-center py-8">
        <div class="max-w-md mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 class="text-lg font-medium text-gray-700 mb-2">Nhập thông tin của bạn</h3>
          <p class="text-gray-500">Vui lòng nhập tên và ngày sinh để xem phân tích thần số học</p>
        </div>
      </div>
      
      <!-- Nội dung theo tab -->
      <template v-else>
        <!-- Tab ngày/tuần/tháng/năm -->
        <div v-if="activeTab !== 'cycles'" class="mt-4 p-6 bg-purple-50 rounded-lg space-y-6">
          <template v-if="results.periods && results.periods[activeTab]">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-purple-800 font-semibold text-lg">{{ resultTitle }}: 
                <span class="text-2xl font-bold ml-2">{{ results.periods[activeTab].number }}</span>
              </p>
              <p class="text-gray-700 mt-3 leading-relaxed">{{ results.periods[activeTab].description }}</p>
            </div>
            
            <div class="grid md:grid-cols-2 gap-4">
              <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-purple-800 font-semibold text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                  {{ shouldDoTitle }}
                </p>
                <ul class="mt-3 space-y-2 text-gray-700">
                  <li v-for="(item, index) in results.periods[activeTab].shouldDo" :key="'do-'+index" class="flex items-start">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-green-500 mt-2 mr-2"></span>
                    {{ item }}
                  </li>
                </ul>
              </div>
              
              <div class="bg-white p-4 rounded-lg shadow-sm">
                <p class="text-purple-800 font-semibold text-lg flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                  {{ shouldAvoidTitle }}
                </p>
                <ul class="mt-3 space-y-2 text-gray-700">
                  <li v-for="(item, index) in results.periods[activeTab].shouldAvoid" :key="'avoid-'+index" class="flex items-start">
                    <span class="inline-block w-1.5 h-1.5 rounded-full bg-red-500 mt-2 mr-2"></span>
                    {{ item }}
                  </li>
                </ul>
              </div>
            </div>
            
            <div v-if="activeTab === 'day'" class="bg-white p-4 rounded-lg shadow-sm">
              <p class="text-purple-800 font-semibold text-lg flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                </svg>
                Gợi ý bữa trưa
              </p>
              <p class="text-gray-700 mt-3 leading-relaxed">{{ results.periods.day.lunchSuggestion }}</p>
            </div>
          </template>
          
          <div v-else class="text-center py-8 text-gray-500">
            Không có dữ liệu phân tích
          </div>
        </div>
        
        <!-- Tab chu kỳ vận số -->
        <div v-else class="mt-4 p-6 bg-purple-50 rounded-lg space-y-6">
          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h3 class="text-purple-800 font-semibold text-lg mb-4">Chu kỳ vận số 10 năm</h3>
            
            <div class="h-64 mb-6">
              <canvas id="numerologyChart"></canvas>
            </div>
            
            <div v-if="results.cycles && Object.keys(results.cycles).length" class="space-y-4">
              <div 
                v-for="(cycle, year) in results.cycles" 
                :key="year"
                class="p-4 border rounded-lg hover:bg-purple-50 transition-colors"
              >
                <p class="text-purple-700 font-medium text-lg">
                  Năm {{ year }} - 
                  <span class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 text-purple-800 ml-2">
                    {{ cycle.number }}
                  </span>
                </p>
                <p class="text-gray-700 mt-2">{{ cycle.description }}</p>
              </div>
            </div>
            
            <div v-else class="text-center py-8 text-gray-500">
              Không có dữ liệu chu kỳ
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
// Import từ Nuxt
const { $toast } = useNuxtApp()
definePageMeta({
  layout: 'dashboard'
});
// Import Chart.js
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

// Tabs configuration
const tabs = [
  { label: 'Ngày hôm nay', value: 'day' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Năm này', value: 'year' },
  { label: 'Chu kỳ vận số', value: 'cycles' }
]

// State
const activeTab = ref('day')
const form = ref({
  name: '',
  birthDate: ''
})
const userInfo = ref({})
const results = ref({
  periods: {},
  cycles: {}
})
const loading = ref(false)
const editing = ref(false)
const chartInstance = ref(null)

// Computed properties
const isFormValid = computed(() => {
  return form.value.name.trim() && /^\d{2}\/\d{2}\/\d{4}$/.test(form.value.birthDate.trim())
})

const resultTitle = computed(() => {
  const titles = {
    day: 'Số ngày cá nhân',
    week: 'Số tuần cá nhân',
    month: 'Số tháng cá nhân',
    year: 'Số năm cá nhân'
  }
  return titles[activeTab.value] || ''
})

const shouldDoTitle = computed(() => 'Những việc nên làm')
const shouldAvoidTitle = computed(() => 'Những việc nên tránh')

// Methods
const switchTab = (tab) => {
  activeTab.value = tab
}

const renderChart = () => {
  // Đảm bảo hủy biểu đồ cũ trước khi tạo mới
  if (chartInstance.value) {
    chartInstance.value.destroy()
    chartInstance.value = null
  }

  // Kiểm tra DOM element tồn tại
  const ctx = document.getElementById('numerologyChart')
  if (!ctx) {
    console.error('Không tìm thấy canvas element')
    return
  }

  // Kiểm tra dữ liệu hợp lệ
  if (!results.value.cycles || Object.keys(results.value.cycles).length === 0) {
    console.error('Không có dữ liệu chu kỳ để vẽ biểu đồ')
    return
  }

  // Chuẩn bị dữ liệu
  const years = Object.keys(results.value.cycles)
    .map(year => parseInt(year))
    .sort((a, b) => a - b)
    .map(year => year.toString())
  
  const numbers = years.map(year => results.value.cycles[year].number)

  // Tạo biểu đồ mới
  chartInstance.value = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Số cá nhân',
        data: numbers,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        borderWidth: 2,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => {
              const year = years[context.dataIndex]
              const desc = results.value.cycles[year].description
              return [`Năm ${year}: Số ${context.raw}`, desc]
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: Math.max(1, Math.min(...numbers) - 2),
          max: Math.min(22, Math.max(...numbers) + 2),
          ticks: { stepSize: 1 },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: { 
          grid: { display: false },
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    }
  })
}

const submitForm = async () => {
  if (!isFormValid.value) {
    $toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ!')
    return
  }

  loading.value = true
  try {
    // Sử dụng $fetch thay vì useFetch
    const data = await $fetch('/api/numerology/period', {
      method: 'POST',
      body: {
        name: form.value.name,
        birthDate: form.value.birthDate
      }
    })

    if (data?.success) {
      userInfo.value = { 
        name: form.value.name, 
        birthDate: form.value.birthDate 
      }
      
      results.value = {
        periods: data.data?.periods || {},
        cycles: data.data?.cycles || {}
      }

      // Format data if needed
      if (results.value.periods) {
        Object.keys(results.value.periods).forEach(period => {
          if (typeof results.value.periods[period].shouldDo === 'string') {
            results.value.periods[period].shouldDo = results.value.periods[period].shouldDo
              .split('. ')
              .filter(item => item.trim())
          }
          if (typeof results.value.periods[period].shouldAvoid === 'string') {
            results.value.periods[period].shouldAvoid = results.value.periods[period].shouldAvoid
              .split('. ')
              .filter(item => item.trim())
          }
        })
      }

      editing.value = false
      localStorage.setItem('numerologyData', JSON.stringify({
        userInfo: userInfo.value,
        results: results.value
      }))

      $toast.success('Phân tích thành công!')
    } else {
      throw new Error(data?.error?.message || 'Dữ liệu API không hợp lệ')
    }
  } catch (error) {
    console.error('API Error:', error)
    $toast.error(error.message || 'Đã xảy ra lỗi khi lấy dữ liệu')
    results.value = { periods: {}, cycles: {} }
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  const savedData = localStorage.getItem('numerologyData')
  if (savedData) {
    try {
      const parsedData = JSON.parse(savedData)
      if (parsedData.userInfo && parsedData.results) {
        userInfo.value = parsedData.userInfo
        form.value = {
          name: parsedData.userInfo.name,
          birthDate: parsedData.userInfo.birthDate
        }
        results.value = parsedData.results
      }
    } catch (e) {
      console.error('Error parsing saved data:', e)
      localStorage.removeItem('numerologyData')
    }
  }
})

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})

// Watchers
watch(activeTab, (newTab) => {
  if (newTab === 'cycles') {
    nextTick(() => {
      renderChart()
    })
  }
})

watch(
  () => results.value.cycles,
  (newVal) => {
    if (activeTab.value === 'cycles' && newVal) {
      nextTick(() => {
        renderChart()
      })
    }
  },
  { deep: true }
)
</script>

<style scoped>
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>