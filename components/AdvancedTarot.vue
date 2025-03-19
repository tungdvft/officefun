<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-2xl font-semibold text-purple-700 mb-4 flex items-center">
      <svg class="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
      Bói Tarot Nâng Cao
    </h2>
    <p class="text-gray-600 mb-4">Trải bài 3 lá: Quá khứ - Hiện tại - Tương lai. Mỗi ngày được rút 3 lần!</p>

    <!-- Số lượt còn lại -->
    <p class="text-gray-700 mb-4">Lượt rút còn lại hôm nay: {{ remainingDraws }}</p>

    <!-- Nút rút bài -->
    <button
      @click="drawTarot"
      :disabled="isLimitReached || loading"
      class="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors disabled:bg-gray-400"
    >
      {{ loading ? 'Đang rút bài...' : isLimitReached ? 'Hết lượt hôm nay!' : 'Rút bài Tarot' }}
    </button>

    <!-- Kết quả Tarot -->
    <div v-if="tarotResult" class="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <h3 class="text-lg font-semibold text-purple-700 mb-2">Kết quả bói bài mới nhất:</h3>
      <p><strong>Quá khứ:</strong> {{ tarotResult.past }}</p>
      <p><strong>Hiện tại:</strong> {{ tarotResult.present }}</p>
      <p><strong>Tương lai:</strong> {{ tarotResult.future }}</p>
      <p class="mt-2"><strong>Diễn giải tổng quát:</strong> {{ tarotResult.interpretation }}</p>
    </div>

    <!-- Thông báo hết lượt -->
    <p v-if="isLimitReached" class="text-red-500 mt-2">Hôm nay bạn đã dùng hết 3 lượt, quay lại sau 0h nhé!</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

const props = defineProps({
  userId: {
    type: String,
    required: true,
  },
});

const tarotResult = ref(null);
const loading = ref(false);
const isLimitReached = ref(false);
const remainingDraws = ref(3);

async function checkLimit() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const response = await $fetch('/api/tarotLimit', {
      method: 'GET',
      query: { user_id: props.userId, date: today },
    });
    const usedDraws = response.count;
    remainingDraws.value = 3 - usedDraws;
    isLimitReached.value = usedDraws >= 3;
  } catch (error) {
    console.error('Error checking limit:', error);
    toast.error('Lỗi khi kiểm tra lượt bói!', { position: 'top-center' });
  }
}

async function fetchLastDraw() {
  try {
    const response = await $fetch('/api/tarotLastDraw', {
      method: 'GET',
      query: { user_id: props.userId },
    });
    if (response && response.data) {
      tarotResult.value = response.data;
    }
  } catch (error) {
    console.error('Error fetching last draw:', error);
  }
}

async function drawTarot() {
  loading.value = true;
  try {
    const today = new Date().toISOString().split('T')[0];
    const limitResponse = await $fetch('/api/tarotLimit', {
      method: 'GET',
      query: { user_id: props.userId, date: today },
    });

    if (limitResponse.count >= 3) {
      isLimitReached.value = true;
      remainingDraws.value = 0;
      toast.warn('Hôm nay bạn đã dùng hết 3 lượt, quay lại sau 0h nhé!', { position: 'top-center' });
      loading.value = false;
      return;
    }

    const response = await $fetch('/api/tarot', {
      method: 'POST',
      body: { user_id: props.userId },
    });

    tarotResult.value = response;

    const updatedLimit = await $fetch('/api/tarotLimit', {
      method: 'POST',
      body: { user_id: props.userId, date: today },
    });

    remainingDraws.value = 3 - updatedLimit.count;
    isLimitReached.value = updatedLimit.count >= 3;
    toast.success('Bài Tarot đã được rút!', { position: 'top-center' });
  } catch (error) {
    console.error('Error drawing tarot:', error);
    toast.error('Lỗi khi rút bài Tarot!', { position: 'top-center' });
    tarotResult.value = {
      past: 'The Sun - Thành công rực rỡ trong quá khứ đã mang lại niềm vui và năng lượng tích cực.',
      present: 'The Star - Hy vọng và cảm hứng đang dẫn lối, bạn đang tìm thấy ánh sáng trong bóng tối.',
      future: 'The World - Một chu kỳ hoàn thành, tương lai mở ra sự viên mãn và thành tựu lớn.',
      interpretation: 'Từ ánh sáng của quá khứ, bạn đang được dẫn dắt bởi hy vọng để tiến tới một tương lai trọn vẹn và rực rỡ.',
    };
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await checkLimit();
  await fetchLastDraw(); // Lấy lần rút cuối khi load trang
});
</script>

<style scoped>
/* Dùng Tailwind, không cần thêm CSS */
</style>