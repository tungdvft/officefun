<template>
  <div class="py-10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Tiêu đề -->
      <div class="flex justify-between items-center mb-8">
        <h1
          class="text-3xl font-bold italic text-center px-4 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-transparent bg-clip-text"
        >
          Offitify đang mở thử tính năng Premium cho người dùng mới. Nhanh tay trải nghiệm trước khi cần trả phí nhé!
        </h1>
      </div>

      <!-- Kiểm tra Premium (đã comment) -->
      <!-- <div v-if="!isPremium && userData.id !== 9" class="bg-yellow-100 p-6 rounded-xl shadow-lg mb-8 text-center">
        <p class="text-yellow-800 text-lg mb-4">
          Đăng ký gói Premium (200k/tháng) để truy cập Trợ lý cá nhân, Trò chuyện sếp ảo, Thần số học nâng cao và Bói Tarot nâng cao!
        </p>
        <button
          @click="upgradeToPremium"
          class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition"
        >
          Nâng cấp ngay
        </button>
      </div> -->

      <div>
        <AdvancedTarot v-if="userData.id" class="mb-8" :user-id="userData.id || 'guest'" />
        <!-- Thần số học nâng cao -->
        <div class="mb-8 bg-white rounded-xl shadow-lg p-6">
          <h2 class="text-2xl font-semibold text-purple-700 mb-6 flex items-center">
            <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 7h6m-3-3v6m-6 6h12m-3-3v6" />
            </svg>
            Thần số học nâng cao
          </h2>

          <div class="space-y-8">
            <div v-if="advancedData.life_path_analysis" class="p-6 bg-purple-50 rounded-lg">
              <p class="text-purple-800 font-semibold text-lg mb-2">Con đường cuộc đời</p>
              <p class="text-gray-700 whitespace-pre-line">{{ advancedData.life_path_analysis }}</p>
            </div>
            <div v-if="advancedData.life_lessons" class="p-6 bg-purple-50 rounded-lg">
              <p class="text-purple-800 font-semibold text-lg mb-4">Bài học cuộc sống</p>
              <div class="space-y-4">
                <div v-for="(lesson, index) in advancedData.life_lessons" :key="index" class="pl-4 border-l-2 border-purple-300">
                  <p class="text-gray-800 font-medium">{{ lesson.lesson }}</p>
                  <p class="text-gray-600 mt-1">{{ lesson.detail }}</p>
                </div>
              </div>
            </div>
            <div v-if="advancedData.personal_growth" class="p-6 bg-purple-50 rounded-lg">
              <p class="text-purple-800 font-semibold text-lg mb-2">Hướng phát triển cá nhân</p>
              <p class="text-gray-700 whitespace-pre-line">{{ advancedData.personal_growth }}</p>
            </div>
            <div v-if="advancedData.daily_insight" class="p-6 bg-purple-100 rounded-lg">
              <p class="text-purple-800 font-semibold text-lg mb-2">Vận mệnh hôm nay</p>
              <p class="text-gray-700 whitespace-pre-line">{{ advancedData.daily_insight }}</p>
            </div>
          </div>
        </div>

        <AssistantCard class="mb-8" />
        <VirtualBoss class="mb-8" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
import { toast } from 'vue3-toastify';
import AssistantCard from '~/components/AssistantCard.vue';
import VirtualBoss from '~/components/VirtualBoss.vue';
import AdvancedTarot from '~/components/AdvancedTarot.vue';

const userData = ref({ username: '', birthdate: '', profession: '', displayName: '', id: '', isPremium: false });
const isPremium = ref(false);
const advancedData = ref({});

onMounted(async () => {
  if (process.client) {
    const username = localStorage.getItem('username');
    if (!username) {
      navigateTo('/login');
      return;
    }
    userData.value.username = username;

    try {
      const userResponse = await $fetch('/api/user', {
        method: 'GET',
        query: { username },
      });
      if (userResponse && !userResponse.error) {
        userData.value = { ...userData.value, ...userResponse };
        isPremium.value = userResponse.isPremium || false;
      } else {
        throw new Error('Invalid user response');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.warn('Không thể tải thông tin user.', { position: 'top-center' });
      userData.value.id = 'guest'; // Fallback để content vẫn hiển thị
    }

    try {
      const encodedUsername = encodeURIComponent(username);
      const response = await fetch('/api/numerology/advanced', {
        headers: {
          'x-username': encodedUsername,
          'x-birthdate': userData.value.birthdate || '14/03/2000',
        },
      });
      if (response.ok) {
        advancedData.value = await response.json();
        await nextTick();
      } else {
        console.error('Error fetching numerology:', response.status);
      }
    } catch (error) {
      console.error('Error fetching numerology:', error);
    }
  }
});

async function upgradeToPremium() {
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/subscription', {
      method: 'POST',
      headers: { 'x-username': encodedUsername },
    });
    const { url } = await response.json();
    window.location.href = url;
  } catch (error) {
    console.error('Error upgrading to Premium:', error);
    toast.error('Có lỗi xảy ra, vui lòng thử lại!', { position: 'top-center' });
  }
}
</script>