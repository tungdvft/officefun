<template>
  <div class="min-h-screen relative">
    <!-- Background vũ trụ từ file local + overlay -->
    <div
      class="absolute inset-0 -z-10 bg-cover bg-center"
      style="background-image: url('/background-home.jpeg')"
    >
      <div class="absolute inset-0 bg-black/40"></div> <!-- Overlay tối nhẹ -->
    </div>
    <div class="py-10">
      <div v-if="isDataLoaded" class="container mx-auto px-4 sm:px-6 lg:px-8">
        <DailyCard v-if="dailyData" :daily-data="dailyData" :user-id="userData.id" />
      </div>

      <!-- Loading state -->
      <div v-else class="min-h-[50vh] flex items-center justify-center">
        <div class="text-center">
          <svg class="animate-spin h-8 w-8 text-yellow-200 mx-auto mb-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          <p class="text-gray-200 text-lg">Đang tải dữ liệu...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import DailyCard from '~/components/DailyCard.vue';

const username = ref(null);
const userData = ref({ username: '', birthdate: '', profession: '', displayName: '', id: '' });
const isUserLoaded = ref(false);

const { data: dailyData, error: dailyError, execute: fetchDaily } = useFetch('/api/daily', {
  immediate: false,
  headers: {
    'x-username': computed(() => encodeURIComponent(username.value || 'guest')),
    'x-birthdate': computed(() => encodeURIComponent(userData.value.birthdate || '14/03/2000')),
  },
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

    isUserLoaded.value = true;
    await fetchDaily();


  }
});

const isDataLoaded = computed(() => {
  const dailyLoaded =
    dailyData.value &&
    dailyData.value.officeTip &&
    dailyData.value.tarot &&
    dailyData.value.funFact &&
    dailyData.value.quote;

  return dailyLoaded && isUserLoaded.value;
});

watch([dailyError], ([dErr]) => {
  if (dErr) console.error('Error fetching daily data:', dErr);
});
</script>