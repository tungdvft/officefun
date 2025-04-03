<!-- pages/dashboard/index.vue -->
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
          :disabled="loading"
          class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
        >
          {{ loading ? 'Đang xử lý...' : 'Xem ngay' }}
        </button>
      </div>
      <div v-else class="flex justify-between items-center mb-4">
        <p class="text-gray-700">Kết quả cho: <span class="font-semibold">{{ userInfo.name }}</span></p>
        <button
          @click="editing = true"
          class="text-purple-500 hover:underline"
        >
          Cập nhật thông tin
        </button>
      </div>

      <!-- Tabs -->
      <div v-if="userInfo.name" class="flex space-x-4 border-b mb-4">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="switchTab(tab.value)"
          :class="[
            'py-2 px-4 font-medium',
            activeTab === tab.value
              ? 'border-b-2 border-purple-500 text-purple-700'
              : 'text-gray-500 hover:text-purple-700'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Nội dung -->
      <div v-if="!userInfo.name" class="text-center text-gray-600">
        <p>Nhập thông tin để khám phá thần số học của bạn!</p>
      </div>
      <div v-else-if="activeTab !== 'cycles' && results.periods && results.periods[activeTab]" class="mt-4 p-4 bg-purple-50 rounded-lg space-y-4">
        <div>
          <p class="text-purple-800 font-semibold text-lg">{{ resultTitle }}: {{ results.periods[activeTab].number }}</p>
          <p class="text-gray-700 mt-2">{{ results.periods[activeTab].description }}</p>
        </div>
        <div>
          <p class="text-purple-800 font-semibold text-lg">{{ shouldDoTitle }}</p>
          <p class="text-gray-700 mt-2">{{ results.periods[activeTab].shouldDo }}</p>
        </div>
        <div>
          <p class="text-purple-800 font-semibold text-lg">{{ shouldAvoidTitle }}</p>
          <p class="text-gray-700 mt-2">{{ results.periods[activeTab].shouldAvoid }}</p>
        </div>
        <div v-if="activeTab === 'day'">
          <p class="text-purple-800 font-semibold text-lg">Trưa nay ăn gì</p>
          <p class="text-gray-700 mt-2">{{ results.periods[activeTab].lunchSuggestion }}</p>
        </div>
      </div>
      <div v-else-if="activeTab === 'cycles' && results.cycles" class="mt-4 p-4 bg-purple-50 rounded-lg space-y-4">
        <h3 class="text-purple-800 font-semibold text-lg">Chu kỳ vận số 10 năm</h3>
        <canvas id="numerologyChart" height="100"></canvas>
        <div class="space-y-2">
          <div
            v-for="(cycle, year) in results.cycles"
            :key="year"
            class="p-3 bg-white rounded-lg shadow-sm"
          >
            <p class="text-purple-700 font-medium">Năm {{ year }} - Số cá nhân: {{ cycle.number }}</p>
            <p class="text-gray-700">{{ cycle.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { toast } from 'vue3-toastify'
import Chart from 'chart.js/auto'
definePageMeta({
  layout: 'dashboard'
});
export default {
  setup() {
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
    const results = ref({})
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

    // Methods
    const getVietnamDate = () => {
      const now = new Date()
      return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }))
    }

    const renderChart = () => {
      if (!results.value.cycles) return

      // Destroy existing chart if any
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }

      const ctx = document.getElementById('numerologyChart')
      if (!ctx) return

      const years = Object.keys(results.value.cycles)
      const numbers = years.map(year => results.value.cycles[year].number)

      chartInstance.value = new Chart(ctx, {
        type: 'line',
        data: {
          labels: years,
          datasets: [{
            label: 'Số cá nhân',
            data: numbers,
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.2)',
            fill: true,
            tension: 0.4
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 22,
              title: { display: true, text: 'Số cá nhân' }
            },
            x: {
              title: { display: true, text: 'Năm' }
            }
          }
        }
      })
    }

    const submitForm = async () => {
      if (!isFormValid.value) {
        toast.error('Vui lòng nhập đầy đủ thông tin hợp lệ!')
        return
      }

      loading.value = true
      try {
        const response = await fetch('/api/numerology/period', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: form.value.name,
            birthDate: form.value.birthDate
          })
        })

        if (!response.ok) throw new Error('Network response was not ok')

        const data = await response.json()
        userInfo.value = { name: form.value.name, birthDate: form.value.birthDate }
        results.value = data.numerology
        editing.value = false

        toast.success('Phân tích thành công!')
      } catch (error) {
        console.error('Error:', error)
        toast.error('Đã xảy ra lỗi khi lấy dữ liệu')
      } finally {
        loading.value = false
      }
    }

    // Lifecycle hooks
    onMounted(() => {
      // Load saved data if exists
      const savedData = localStorage.getItem('numerologyData')
      if (savedData) {
        const { userInfo: savedUserInfo, results: savedResults } = JSON.parse(savedData)
        userInfo.value = savedUserInfo
        results.value = savedResults
      }
    })

    onUnmounted(() => {
      // Clean up chart instance
      if (chartInstance.value) {
        chartInstance.value.destroy()
      }
    })

    // Watchers
    watch(
      () => activeTab.value,
      (newTab) => {
        if (newTab === 'cycles' && results.value.cycles) {
          nextTick(() => {
            renderChart()
          })
        }
      }
    )

    watch(
      () => results.value,
      (newResults) => {
        if (newResults.cycles && activeTab.value === 'cycles') {
          nextTick(() => {
            renderChart()
          })
        }
      },
      { deep: true }
    )

    return {
      tabs,
      activeTab,
      form,
      userInfo,
      results,
      loading,
      editing,
      isFormValid,
      resultTitle,
      submitForm,
      // ... other methods and computed properties
    }
  }
}
</script>