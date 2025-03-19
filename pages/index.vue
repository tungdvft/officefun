<template>
  <div class="relative py-10">
    <!-- Background full màn hình -->
    <div class="absolute inset-0 -z-10 bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 animate-gradient-bg">
      <div class="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
    </div>

    <!-- Tiêu đề -->
    <div class="flex justify-between items-center mb-3 max-w-3xl mx-auto px-4">
      <h1
        class="text-2xl md:text-3xl font-extrabold italic text-center w-full text-white bg-clip-text tracking-tight leading-tight"
      >
        Khám phá thế giới giải trí văn phòng được cá nhân hoá với Offitify, nơi AI mang đến những nội dung sáng tạo, được làm mới mỗi ngày.
      </h1>
    </div>
  </div>
  <div class="py-10">
    <div v-if="isDataLoaded" class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Daily Card -->
      <DailyCard :daily-data="dailyData" />
      <MusicCard v-if="activeTab === 'music'" :music-data="musicData" @refresh-music="refreshMusicWithVibe" />
      <!-- Game Section -->
      <GameSection class="mt-8" />
      <!-- Calendar Card -->
      <CalendarCard class="mt-8" />
      <!-- Task Manager -->
      <TaskManager v-if="userData.id" class="mt-8" :user-id="userData.id" />
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
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import DailyCard from '~/components/DailyCard.vue';
import MusicCard from '~/components/MusicCard.vue';
import GameSection from '~/components/GameSection.vue';
import CalendarCard from '~/components/CalendarCard.vue';
import TaskManager from '~/components/TaskManager.vue';


const username = ref(null);
const userData = ref({ username: '', birthdate: '', profession: '', displayName: '', id: '' });
const activeTab = ref('music');
const isUserLoaded = ref(false);

const tabs = [
  { id: 'music', label: 'Nhạc' },
  { id: 'restaurant', label: 'Ăn trưa' },
  { id: 'homestay', label: 'Homestay' },
];

// API Calls
const { data: dailyData, error: dailyError, execute: fetchDaily } = useFetch('/api/daily', {
  immediate: false, // Không gọi ngay
  headers: {
    'x-username': computed(() => encodeURIComponent(username.value || 'guest')),
    'x-birthdate': computed(() => encodeURIComponent(userData.value.birthdate || '14/03/2000')),
  },
});

const { data: musicData, error: musicError } = useFetch('/api/music', { immediate: true });
const { data: restaurantData, error: restaurantError } = useFetch('/api/restaurant', { immediate: true });
const { data: homestayData, error: homestayError } = useFetch('/api/homestay', {
  immediate: true,
  query: { lat: '22.2871', lon: '104.6167' },
});

onMounted(async () => {
  if (process.client) {
    username.value = localStorage.getItem('username');

    if (!username.value) {
      navigateTo('/login');
      return;
    }

    userData.value.username = username.value;

    try {
      const userResponse = await $fetch('/api/user', {
        method: 'GET',
        query: { username: username.value },
      });

      if (userResponse && !userResponse.error) {
        userData.value = userResponse;
      } else if (userResponse?.error === 'User not found') {
        toast.warn('Tài khoản chưa đồng bộ với server, vẫn dùng được tạm thời.', { position: 'top-center' });
      } else {
        toast.warn('Dữ liệu user không hợp lệ, dùng thông tin tạm thời.', { position: 'top-center' });
      }
    } catch (error) {
      console.error('onMounted - Error fetching user data:', error);
      toast.warn('Không thể kết nối server, dùng thông tin tạm thời.', { position: 'top-center' });
    }

    // Gọi API /api/daily sau khi userData load
    isUserLoaded.value = true;
    await fetchDaily();
  }
});

const dayOfWeek = computed(() => {
  const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
  return days[new Date().getDay()];
});

const dayContext = computed(() => {
  const today = new Date().getDay();
  if (today === 5) return 'cuối tuần bắt đầu đây';
  if (today === 6) return 'cuối tuần thật chill';
  if (today === 0) return 'chuẩn bị tinh thần tuần mới';
  return 'hôm nay tràn đầy năng lượng';
});

const creativeMood = computed(() => {
  const mood = musicData.value?.title || 'Mood';
  switch (mood) {
    case 'Monday Motivation': return 'bắt đầu tuần mới thật bùng nổ nhé!';
    case 'Tuesday Energy': return 'giữ tinh thần mạnh mẽ nào!';
    case 'Midweek Vibes': return 'giữa tuần chill chút thôi!';
    case 'Focus Thursday': return 'tập trung để vượt qua nào!';
    case 'Friday Chill': return 'thư giãn để đón cuối tuần nhé!';
    case 'Saturday Party': return 'bung xõa hết hôm nay đi!';
    case 'Sunday Relaxation': return 'thư giãn để chuẩn bị tuần mới nhé!';
    case 'Chill Vibes': return 'để mọi thứ nhẹ nhàng hơn nào!';
    case 'Party Mode': return 'khuấy động không khí lên thôi!';
    case 'Focus Flow': return 'giữ sự tập trung tuyệt đối nhé!';
    case 'Energetic Boost': return 'nạp năng lượng để bay cao nào!';
    case 'Romantic Mood': return 'thêm chút lãng mạn cho ngày đẹp nhé!';
    case 'Relax & Unwind': return 'thả lỏng và tận hưởng đi!';
    case 'Happy Tunes': return 'vui vẻ cả ngày luôn nhé!';
    default: return 'tận hưởng vibe của riêng bạn!';
  }
});

const isDataLoaded = computed(() => {
  const dailyLoaded =
    dailyData.value &&
    dailyData.value.officeTip &&
    dailyData.value.tarot &&
    dailyData.value.funFact &&
    dailyData.value.quote;

  const musicLoaded = musicData.value && musicData.value.title && musicData.value.description && musicData.value.url;
  const restaurantLoaded = restaurantData.value && restaurantData.value.restaurantSuggestion;
  const homestayLoaded = homestayData.value && homestayData.value.homestaySuggestion;

  return dailyLoaded && musicLoaded && restaurantLoaded && homestayLoaded && isUserLoaded.value;
});

async function refreshMusicWithVibe(vibe) {
  const { data } = await useFetch('/api/music', { query: { vibe } });
  musicData.value = data.value;
}

watch([dailyError, musicError, restaurantError, homestayError], ([dErr, mErr, rErr, hErr]) => {
  if (dErr) console.error('Error fetching daily data:', dErr);
  if (mErr) console.error('Error fetching music:', mErr);
  if (rErr) console.error('Error fetching restaurant:', rErr);
  if (hErr) console.error('Error fetching homestay:', hErr);
});
</script>