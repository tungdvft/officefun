<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <h2 class="text-2xl font-bold text-gray-800">Google Analytics Dashboard</h2>
      <div class="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
        <select 
          v-model="timeRange" 
          @change="fetchAnalyticsData"
          class="px-3 py-2 border border-gray-300 rounded-md text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7daysAgo">7 ngày qua</option>
          <option value="30daysAgo">30 ngày qua</option>
          <option value="90daysAgo">90 ngày qua</option>
        </select>
        <button 
          @click="fetchAnalyticsData"
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        >
          Làm mới
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="flex justify-center items-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p class="text-sm text-red-700">Không thể tải dữ liệu Analytics: {{ error.message }}</p>
        </div>
      </div>
    </div>

    <!-- Main Dashboard -->
    <div v-else>
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard 
          title="Lượt truy cập" 
          :value="summary.users" 
          :change="summary.userChange"
          color="blue"
        />
        
        <DashboardCard 
          title="Phiên" 
          :value="summary.sessions" 
          :change="summary.sessionChange"
          color="green"
        />
        
        <DashboardCard 
          title="Lượt xem trang" 
          :value="summary.pageviews" 
          :change="summary.pageviewChange"
          color="purple"
        />
        
        <DashboardCard 
          title="Tỷ lệ thoát" 
          :value="summary.bounceRate" 
          :change="summary.bounceChange"
          is-percent
          color="amber"
        />
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <!-- Traffic Chart -->
        <div class="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Lưu lượng truy cập</h3>
          <div class="h-64">
            <ClientOnly>
              <LineChart 
                v-if="trafficChartData" 
                :chart-data="trafficChartData" 
              />
              <template #fallback>
                <div class="flex items-center justify-center h-full text-gray-500">
                  Đang tải biểu đồ...
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
        
        <!-- Top Pages -->
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Trang phổ biến</h3>
          <ul class="space-y-3">
            <li v-for="(page, index) in topPages" :key="index" class="flex justify-between">
              <span class="text-sm text-gray-600 truncate max-w-[180px]">{{ page.url }}</span>
              <span class="text-sm font-medium text-gray-900">{{ page.views }}</span>
            </li>
          </ul>
        </div>
      </div>

      <!-- Devices & Locations -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Devices -->
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Thiết bị</h3>
          <div class="h-64">
            <ClientOnly>
              <DoughnutChart 
                v-if="deviceChartData" 
                :chart-data="deviceChartData" 
              />
              <template #fallback>
                <div class="flex items-center justify-center h-full text-gray-500">
                  Đang tải biểu đồ...
                </div>
              </template>
            </ClientOnly>
          </div>
        </div>
        
        <!-- Locations -->
        <div class="bg-white p-4 rounded-lg border border-gray-200">
          <h3 class="text-lg font-medium text-gray-800 mb-4">Quốc gia</h3>
          <ul class="space-y-2">
            <li v-for="(country, index) in topCountries" :key="country.country" class="flex items-center">
              <span class="inline-block w-6 text-sm text-gray-500">{{ index + 1 }}</span>
              <span class="text-sm text-gray-600 flex-grow truncate max-w-[120px]">{{ country.country }}</span>
              <span class="text-sm font-medium text-gray-900">{{ country.sessions }}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
definePageMeta({
  layout: 'dashboard'
})


const timeRange = ref('7daysAgo')
const { data, pending, error, refresh } = await useAsyncData(
  'analytics-data',
  async () => {
    try {
      const { $ga } = useNuxtApp()
      
      const [summary, traffic, pages, countries, devices] = await Promise.all([
        $ga.getSummary(timeRange.value),
        $ga.getTraffic(timeRange.value),
        $ga.getTopPages(timeRange.value),
        $ga.getTopCountries(timeRange.value),
        $ga.getDeviceData(timeRange.value)
      ])
      
      return {
        summary,
        traffic,
        pages,
        countries,
        devices
      }
    } catch (err) {
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch analytics data'
      })
    }
  },
  {
    watch: [timeRange]
  }
)

// Computed properties
const summary = computed(() => data.value?.summary || {})
const trafficData = computed(() => data.value?.traffic || [])
const topPages = computed(() => data.value?.pages || [])
const topCountries = computed(() => data.value?.countries || [])
const deviceData = computed(() => data.value?.devices || [])

const trafficChartData = computed(() => ({
  labels: trafficData.value.map(item => item.date),
  datasets: [
    {
      label: 'Lượt truy cập',
      data: trafficData.value.map(item => item.users),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.3
    },
    {
      label: 'Phiên',
      data: trafficData.value.map(item => item.sessions),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.3
    }
  ]
}))

const deviceChartData = computed(() => ({
  labels: deviceData.value.map(item => item.device),
  datasets: [
    {
      data: deviceData.value.map(item => item.sessions),
      backgroundColor: [
        '#3B82F6',
        '#10B981',
        '#F59E0B',
        '#EF4444'
      ],
      hoverOffset: 4
    }
  ]
}))

// Refresh function
const fetchAnalyticsData = () => {
  refresh()
}
</script>