<template>
  <div class="py-10">
    <div v-if="isDataLoaded" class="max-w-4xl mx-auto px-4">
      <!-- Tiêu đề -->
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-3xl font-bold italic text-center w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text">
          Chào {{ dayOfWeek }} {{ username || 'bạn' }}, {{ dayContext }}, {{ creativeMood }}
        </h1>
      </div>

      <!-- Trợ lý cá nhân (Đặt riêng, không trong tab) -->
      <AssistantCard class="mb-8" />

      <!-- Daily Card -->
      <DailyCard :daily-data="dailyData" />

      <!-- Tabs for Recommendations -->
      <div class="mt-8">
        <div class="flex border-b">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['px-4 py-2 -mb-px', activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-600 font-semibold' : 'text-gray-600']"
          >
            {{ tab.label }}
          </button>
        </div>
        <div class="mt-4">
          <MusicCard v-if="activeTab === 'music'" :music-data="musicData" @refresh-music="refreshMusicWithVibe" />
          <RestaurantCard v-if="activeTab === 'restaurant'" :restaurant-data="restaurantData" />
          <HomestayCard v-if="activeTab === 'homestay'" :homestay-data="homestayData" @refresh-homestay="refreshHomestay" />
          <!-- Bỏ CalendarCard -->
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-else class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <svg class="animate-spin h-8 w-8 text-blue-500 mx-auto mb-4" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        <p class="text-gray-600 text-lg">Đang tải dữ liệu...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import DailyCard from './DailyCard.vue'
import MusicCard from './MusicCard.vue'
import RestaurantCard from './RestaurantCard.vue'
import HomestayCard from './HomestayCard.vue'
import AssistantCard from './AssistantCard.vue' // Giữ Trợ lý

const username = ref(null)
const activeTab = ref('music')

const tabs = [
  { id: 'music', label: 'Nhạc' },
  { id: 'restaurant', label: 'Ăn trưa' },
  { id: 'homestay', label: 'Homestay' }
  // Bỏ 'calendar' khỏi tabs
]

// Gọi các API
const { data: dailyData, error: dailyError, refresh: refreshDaily } = useFetch('/api/daily', {
  immediate: true,
  headers: { 'x-username': computed(() => encodeURIComponent(username.value || 'guest')) }
})
const { data: musicData, error: musicError, refresh: refreshMusic } = useFetch('/api/music', { 
  immediate: true 
})
const { data: restaurantData, error: restaurantError, refresh: refreshRestaurant } = useFetch('/api/restaurant', { 
  immediate: true 
})
const { data: homestayData, error: homestayError, refresh: refreshHomestayBase } = useFetch('/api/homestay', {
  immediate: true,
  query: { lat: '22.2871', lon: '104.6167' }
})

// Lấy username từ localStorage
if (process.client) {
  username.value = localStorage.getItem('username') || 'Guest'
  console.log('Username from localStorage:', username.value)
  // Giả lập Premium đã thanh toán
  localStorage.setItem(`premium_${username.value}`, JSON.stringify({
    status: 'active',
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // Còn 30 ngày
  }))
}

// Tính ngày trong tuần
const dayOfWeek = computed(() => {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']
  return days[new Date().getDay()]
})

// Ngữ cảnh ngày
const dayContext = computed(() => {
  const today = new Date().getDay()
  if (today === 5) return 'cuối tuần bắt đầu đây'
  if (today === 6) return 'cuối tuần thật chill'
  if (today === 0) return 'chuẩn bị tinh thần tuần mới'
  return 'hôm nay tràn đầy năng lượng'
})

// Mood sáng tạo dựa trên musicData.title
const creativeMood = computed(() => {
  const mood = musicData.value?.title || 'Mood'
  switch (mood) {
    case 'Monday Motivation': return 'bắt đầu tuần mới thật bùng nổ nhé!'
    case 'Tuesday Energy': return 'giữ tinh thần mạnh mẽ nào!'
    case 'Midweek Vibes': return 'giữa tuần chill chút thôi!'
    case 'Focus Thursday': return 'tập trung để vượt qua nào!'
    case 'Friday Chill': return 'thư giãn để đón cuối tuần nhé!'
    case 'Saturday Party': return 'bung xõa hết hôm nay đi!'
    case 'Sunday Relaxation': return 'thư giãn để chuẩn bị tuần mới nhé!'
    case 'Chill Vibes': return 'để mọi thứ nhẹ nhàng hơn nào!'
    case 'Party Mode': return 'khuấy động không khí lên thôi!'
    case 'Focus Flow': return 'giữ sự tập trung tuyệt đối nhé!'
    case 'Energetic Boost': return 'nạp năng lượng để bay cao nào!'
    case 'Romantic Mood': return 'thêm chút lãng mạn cho ngày đẹp nhé!'
    case 'Relax & Unwind': return 'thả lỏng và tận hưởng đi!'
    case 'Happy Tunes': return 'vui vẻ cả ngày luôn nhé!'
    default: return 'tận hưởng vibe của riêng bạn!'
  }
})

// Kiểm tra dữ liệu đã sẵn sàng
const isDataLoaded = computed(() => {
  const dailyLoaded = dailyData.value && 
    dailyData.value.dailyNumerology && 
    dailyData.value.weeklyNumerology && 
    dailyData.value.officeTip && 
    dailyData.value.tarot && 
    dailyData.value.funFact && 
    dailyData.value.quote

  const musicLoaded = musicData.value && 
    musicData.value.title && 
    musicData.value.description && 
    musicData.value.url

  const restaurantLoaded = restaurantData.value && 
    restaurantData.value.restaurantSuggestion

  const homestayLoaded = homestayData.value && 
    homestayData.value.homestaySuggestion

  return dailyLoaded && musicLoaded && restaurantLoaded && homestayLoaded
})

async function refreshData() {
  console.log('Refreshing data for:', username.value)
  await Promise.all([refreshDaily(), refreshMusic(), refreshRestaurant(), refreshHomestayBase()])
}

async function refreshMusicWithVibe(vibe) {
  const { data } = await useFetch('/api/music', { query: { vibe } })
  musicData.value = data.value
}

async function refreshHomestay({ lat, lon }) {
  const { data } = await useFetch('/api/homestay', { query: { lat, lon } })
  homestayData.value = data.value
}

watch([dailyError, musicError, restaurantError, homestayError], ([dErr, mErr, rErr, hErr]) => {
  if (dErr) console.error('Error fetching daily data:', dErr)
  if (mErr) console.error('Error fetching music:', mErr)
  if (rErr) console.error('Error fetching restaurant:', rErr)
  if (hErr) console.error('Error fetching homestay:', hErr)
})
</script>

<style scoped>
/* Không cần thêm CSS vì Tailwind đã xử lý */
</style>