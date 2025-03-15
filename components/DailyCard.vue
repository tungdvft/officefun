<template>
  <div>
    <!-- Daily Numerology -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-indigo-500">
      <h2 class="text-xl font-semibold text-indigo-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m-3-3v6m-6 6h12m-3-3v6" />
        </svg>
        Vận mệnh hôm nay (Thần số học)
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.dailyNumerology }}</p>
    </div>

    <!-- Weekly Numerology -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-pink-500">
      <h2 class="text-xl font-semibold text-pink-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        Vận mệnh tuần này (Thần số học)
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.weeklyNumerology }}</p>
    </div>

    <!-- Numerology Advanced (Premium) -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
      <h2 class="text-xl font-semibold text-purple-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Thần số học nâng cao
      </h2>
      <div v-if="!isPremium">
        <p class="text-gray-600 leading-relaxed">Đăng ký gói Premium (200k/tháng) để xem biểu đồ số học, dự đoán chi tiết và lời khuyên cá nhân!</p>
        <button @click="upgradeToPremium" class="mt-4 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition">
          Nâng cấp ngay
        </button>
      </div>
      <div v-else class="space-y-6">
        <!-- Biểu đồ số học -->
        <div>
          <p class="text-gray-800 font-semibold mb-2">Biểu đồ số học:</p>
          <canvas ref="numerologyChart" height="200"></canvas>
        </div>
        <!-- Luận giải chi tiết -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-purple-800 font-semibold">Số chủ đạo ({{ advancedData.chart.dominant.number }})</p>
            <p class="text-gray-600">{{ advancedData.chart.dominant.description }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-purple-800 font-semibold">Số linh hồn ({{ advancedData.chart.soul.number }})</p>
            <p class="text-gray-600">{{ advancedData.chart.soul.description }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-purple-800 font-semibold">Số nhân cách ({{ advancedData.chart.personality.number }})</p>
            <p class="text-gray-600">{{ advancedData.chart.personality.description }}</p>
          </div>
          <div class="p-4 bg-purple-50 rounded-lg">
            <p class="text-purple-800 font-semibold">Số định mệnh ({{ advancedData.chart.destiny.number }})</p>
            <p class="text-gray-600">{{ advancedData.chart.destiny.description }}</p>
          </div>
        </div>
        <div>
          <p class="text-gray-800 font-semibold">Con đường cuộc đời:</p>
          <p class="text-gray-600 whitespace-pre-line">{{ advancedData.life_path_analysis }}</p>
        </div>
        <div>
          <p class="text-gray-800 font-semibold">Dự đoán tương lai:</p>
          <p class="text-gray-600 whitespace-pre-line">{{ advancedData.future_prediction }}</p>
        </div>
        <div>
          <p class="text-gray-800 font-semibold">Lời khuyên cá nhân:</p>
          <p class="text-gray-600 whitespace-pre-line">{{ advancedData.personal_advice }}</p>
        </div>
      </div>
    </div>

    <!-- Office Tip -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-blue-500">
      <h2 class="text-xl font-semibold text-blue-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Mẹo văn phòng
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.officeTip }}</p>
    </div>

    <!-- Tarot -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-purple-500">
      <h2 class="text-xl font-semibold text-purple-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
        Quẻ Tarot hôm nay
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.tarot }}</p>
    </div>

    <!-- Fun Fact -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500">
      <h2 class="text-xl font-semibold text-orange-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Fact vui
      </h2>
      <p class="text-gray-600 leading-relaxed">{{ dailyData.funFact }}</p>
    </div>

    <!-- Quote -->
    <div class="mb-6 bg-white rounded-xl shadow-lg p-6 border-l-4 border-rose-500">
      <h2 class="text-xl font-semibold text-rose-700 mb-3 flex items-center">
        <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 01-2-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Quote động lực
      </h2>
      <p class="text-gray-600 italic leading-relaxed">"{{ dailyData.quote }}"</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Chart from 'chart.js/auto'

defineProps({
  dailyData: { type: Object, required: true }
})

const isPremium = ref(false)
const advancedData = ref({})
const numerologyChart = ref(null)

onMounted(async () => {
  const username = localStorage.getItem('username') || 'guest'
  const premium = JSON.parse(localStorage.getItem(`premium_${username}`) || '{}')
  if (premium.status === 'active' && premium.expiresAt > Date.now()) {
    isPremium.value = true
    try {
      const encodedUsername = encodeURIComponent(username)
      const response = await fetch('/api/numerology/advanced', {
        headers: { 'x-username': encodedUsername }
      })
      if (response.ok) {
        advancedData.value = await response.json()

        if (numerologyChart.value) {
          const ctx = numerologyChart.value.getContext('2d')
          new Chart(ctx, {
            type: 'radar',
            data: {
              labels: ['Số chủ đạo', 'Số linh hồn', 'Số nhân cách', 'Số định mệnh'],
              datasets: [{
                label: 'Biểu đồ số học',
                data: [
                  advancedData.value.chart.dominant.number,
                  advancedData.value.chart.soul.number,
                  advancedData.value.chart.personality.number,
                  advancedData.value.chart.destiny.number
                ],
                backgroundColor: 'rgba(147, 51, 234, 0.2)',
                borderColor: 'rgba(147, 51, 234, 1)',
                borderWidth: 2
              }]
            },
            options: {
              scales: {
                r: {
                  beginAtZero: true,
                  max: 9,
                  ticks: { stepSize: 1 }
                }
              },
              plugins: {
                legend: { position: 'top' }
              }
            }
          })
        }
      } else {
        console.error('Lỗi lấy dữ liệu nâng cao:', response.status)
      }
    } catch (error) {
      console.error('Lỗi fetch advanced numerology:', error)
    }
  }
})

async function upgradeToPremium() {
  try {
    const username = localStorage.getItem('username') || 'guest'
    const encodedUsername = encodeURIComponent(username)
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: { 'x-username': encodedUsername }
    })
    const { url } = await response.json()
    window.location.href = url
  } catch (error) {
    console.error('Lỗi khi nâng cấp Premium:', error)
    alert('Có lỗi xảy ra, vui lòng thử lại!')
  }
}
</script>