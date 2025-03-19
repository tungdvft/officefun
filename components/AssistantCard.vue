<template>
  <div class="bg-white rounded-xl shadow-xl p-6 transition-all hover:shadow-2xl">
    <h2 class="text-2xl font-bold text-teal-700 mb-4 flex items-center">
      <svg class="w-7 h-7 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m-9-2h12M5 21h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
      Trợ lý cá nhân AI
    </h2>
    <!-- <div v-if="!isPremium" class="text-center">
      <p class="text-gray-600 mb-4">Trải nghiệm trợ lý AI thông minh với gói Premium (200k/tháng)!</p>
      <button @click="upgradeToPremium" class="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-2 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md">
        Nâng cấp ngay
      </button>
    </div> -->
    <div>
      <!-- Số lượt còn lại -->
      <p class="text-gray-700 mb-4">Lượt tạo kế hoạch còn lại hôm nay: {{ remainingPlans }}</p>

      <!-- Form -->
      <div class="space-y-4">
        <div>
          <label class="block text-gray-700 font-medium mb-1">Tâm trạng hôm nay:</label>
          <input v-model="mood" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="Ví dụ: Vui, mệt, căng thẳng..." />
        </div>
        <div>
          <label class="block text-gray-700 font-medium mb-1">Mục tiêu hôm nay:</label>
          <textarea v-model="goals" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:outline-none resize-none" rows="3" placeholder="Ví dụ: Hoàn thành báo cáo, tập gym 1 tiếng..."></textarea>
        </div>
        <button 
          @click="getPlan" 
          :disabled="isLoading || isLimitReached" 
          class="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-teal-600 hover:to-cyan-600 transition-all shadow-md flex items-center justify-center disabled:bg-gray-400"
        >
          <svg v-if="isLoading" class="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
          {{ isLoading ? 'Đang tạo kế hoạch...' : isLimitReached ? 'Hết lượt hôm nay!' : 'Lấy kế hoạch' }}
        </button>
      </div>

      <!-- Thông báo hết lượt -->
      <p v-if="isLimitReached" class="text-red-500 mt-2">Hôm nay bạn đã dùng hết 2 lượt, quay lại sau 0h nhé!</p>

      <!-- Output -->
      <div v-if="plan" class="mt-6 p-4 bg-teal-50 rounded-lg border border-teal-200">
        <h3 class="text-lg font-semibold text-teal-700 mb-2">Kế hoạch mới nhất:</h3>
        <p class="text-gray-800 whitespace-pre-line leading-relaxed">{{ plan }}</p>
        <button @click="savePlan" class="mt-4 bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-all">
          Lưu kế hoạch
        </button>
      </div>
      <p v-else-if="!isLoading" class="mt-4 text-gray-500 italic">Nhập tâm trạng và mục tiêu để nhận kế hoạch chi tiết nhé!</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const isPremium = ref(false);
const mood = ref('');
const goals = ref('');
const plan = ref('');
const isLoading = ref(false);
const remainingPlans = ref(2);
const isLimitReached = ref(false);

onMounted(async () => {
  const username = localStorage.getItem('username') || 'guest';
  const premium = JSON.parse(localStorage.getItem(`premium_${username}`) || '{}');
  if (premium.status === 'active' && premium.expiresAt > Date.now()) {
    isPremium.value = true;
    await checkLimit();
    await fetchLastPlan(); // Lấy kế hoạch cuối khi mounted
  }
});

async function checkLimit() {
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const today = new Date().toISOString().split('T')[0];
    const response = await fetch('/api/assistantLimit', {
      method: 'GET',
      headers: { 'x-username': encodedUsername },
      query: { date: today },
    });
    const data = await response.json();
    const usedPlans = data.count || 0;
    remainingPlans.value = 2 - usedPlans;
    isLimitReached.value = usedPlans >= 2;
  } catch (error) {
    console.error('Error checking assistant limit:', error);
    remainingPlans.value = 2;
  }
}

async function fetchLastPlan() {
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const response = await fetch('/api/assistantLastPlan', {
      method: 'GET',
      headers: { 'x-username': encodedUsername },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.data) {
        plan.value = data.data;
      }
    }
  } catch (error) {
    console.error('Error fetching last plan:', error);
  }
}

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
    console.error('Lỗi khi nâng cấp Premium:', error);
    alert('Có lỗi xảy ra, vui lòng thử lại!');
  }
}

async function getPlan() {
  if (!mood.value || !goals.value) {
    alert('Vui lòng nhập tâm trạng và mục tiêu!');
    return;
  }
  isLoading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const encodedUsername = encodeURIComponent(username);
    const events = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    const today = new Date().toISOString().split('T')[0];

    const limitResponse = await fetch('/api/assistantLimit', {
      method: 'GET',
      headers: { 'x-username': encodedUsername },
      query: { date: today },
    });
    const limitData = await limitResponse.json();
    if (limitData.count >= 2) {
      isLimitReached.value = true;
      remainingPlans.value = 0;
      alert('Hôm nay bạn đã dùng hết 2 lượt tạo kế hoạch, quay lại sau 0h nhé!');
      isLoading.value = false;
      return;
    }

    const response = await fetch('/api/assistant', {
      method: 'POST',
      headers: { 
        'x-username': encodedUsername,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ calendarEvents: events, mood: mood.value, goals: goals.value }),
    });

    if (response.ok) {
      const data = await response.json();
      plan.value = data.plan;
      await checkLimit();
    } else if (response.status === 403) {
      const errorData = await response.json();
      alert(errorData.message);
      await checkLimit();
    } else {
      throw new Error('Lỗi từ server');
    }
  } catch (error) {
    console.error('Lỗi fetch assistant plan:', error);
    plan.value = 'Có lỗi xảy ra khi tạo kế hoạch, vui lòng thử lại!';
  } finally {
    isLoading.value = false;
  }
}

function savePlan() {
  const blob = new Blob([plan.value], { type: 'text/plain' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `KeHoach_${new Date().toLocaleDateString('vi-VN')}.txt`;
  link.click();
}
</script>