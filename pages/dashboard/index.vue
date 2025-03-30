<!-- pages/dashboard/index.vue -->
<template>
  <div class="space-y-8">
    <!-- Banner chào mừng -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
      <h1 class="text-4xl font-bold mb-2">Chào mừng đến với Thần số học</h1>
      <p class="text-lg opacity-90">Khám phá năng lượng của bạn qua con số!</p>
      <!-- <NuxtLink
        to="/baby-name"
        class="mt-4 inline-block bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-purple-100 transition"
      >
        Đặt tên con ngay
      </NuxtLink> -->
    </div>

    <!-- Grid các tính năng -->
    <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
        <div class="flex items-center mb-4">
          <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 class="text-xl font-semibold text-purple-700">Đặt tên con</h2>
        </div>
        <p class="text-gray-600">Tìm tên hoàn hảo cho bé yêu dựa trên năng lượng số học.</p>
        <NuxtLink to="/baby-name" class="mt-4 inline-block text-purple-500 hover:underline">Thử ngay</NuxtLink>
      </div>
    </div> -->

    <!-- Thần số học với 4 tab -->
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
      <div v-else-if="results[activeTab]" class="mt-4 p-4 bg-purple-50 rounded-lg space-y-4">
        <div>
          <p class="text-purple-800 font-semibold text-lg">{{ resultTitle }}: {{ results[activeTab].number }}</p>
          <p class="text-gray-700 mt-2">{{ results[activeTab].description }}</p>
        </div>
        <div>
          <p class="text-purple-800 font-semibold text-lg">{{ shouldDoTitle }}</p>
          <p class="text-gray-700 mt-2">{{ results[activeTab].shouldDo }}</p>
        </div>
        <div>
          <p class="text-purple-800 font-semibold text-lg">{{ shouldAvoidTitle }}</p>
          <p class="text-gray-700 mt-2">{{ results[activeTab].shouldAvoid }}</p>
        </div>
        <div v-if="activeTab === 'day'">
          <p class="text-purple-800 font-semibold text-lg">Trưa nay ăn gì</p>
          <p class="text-gray-700 mt-2">{{ results[activeTab].lunchSuggestion }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({
  layout: 'dashboard'
});

// Tabs
const tabs = [
  { label: 'Ngày hôm nay', value: 'day' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Năm này', value: 'year' }
];
const activeTab = ref('day');

// Form và trạng thái
const form = ref({
  name: '',
  birthDate: ''
});
const userInfo = ref({ name: '', birthDate: '' });
const results = ref({});
const loading = ref(false);
const editing = ref(false);

// Tiêu đề động dựa trên tab
const resultTitle = computed(() => {
  return activeTab.value === 'day' ? 'Số ngày cá nhân'
    : activeTab.value === 'week' ? 'Số tuần cá nhân'
    : activeTab.value === 'month' ? 'Số tháng cá nhân'
    : 'Số năm cá nhân';
});
const shouldDoTitle = computed(() => {
  return activeTab.value === 'day' ? 'Nên làm hôm nay'
    : activeTab.value === 'week' ? 'Nên làm trong tuần'
    : activeTab.value === 'month' ? 'Nên làm trong tháng'
    : 'Nên làm trong năm';
});
const shouldAvoidTitle = computed(() => {
  return activeTab.value === 'day' ? 'Nên tránh hôm nay'
    : activeTab.value === 'week' ? 'Nên tránh trong tuần'
    : activeTab.value === 'month' ? 'Nên tránh trong tháng'
    : 'Nên tránh trong năm';
});

// Kiểm tra tuần hiện tại
const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Load dữ liệu từ localStorage khi vào trang
onMounted(() => {
  const storedData = localStorage.getItem('numerologyData');
  if (storedData) {
    const { userInfo: storedUserInfo, results: storedResults, timestamp } = JSON.parse(storedData);
    const storedDate = new Date(timestamp);
    const currentDate = new Date('2025-03-30'); // Ngày hiện tại theo hệ thống
    const storedWeek = getWeekNumber(storedDate);
    const currentWeek = getWeekNumber(currentDate);

    if (storedWeek === currentWeek) {
      userInfo.value = storedUserInfo;
      results.value = storedResults;
    } else {
      localStorage.removeItem('numerologyData'); // Xóa nếu sang tuần mới
    }
  }
});

// Chuyển tab
const switchTab = (tabValue) => {
  activeTab.value = tabValue;
};

// Gửi form và lấy kết quả
const submitForm = async () => {
  if (!form.value.name || !form.value.birthDate) {
    toast.error('Vui lòng nhập đầy đủ tên và ngày sinh!', { position: 'top-center' });
    return;
  }
  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/period', {
      method: 'POST',
      body: {
        name: form.value.name,
        birthDate: form.value.birthDate
      }
    });
    userInfo.value = { name: form.value.name, birthDate: form.value.birthDate };
    results.value = response.numerology;
    editing.value = false;

    // Lưu vào localStorage với timestamp
    localStorage.setItem('numerologyData', JSON.stringify({
      userInfo: userInfo.value,
      results: results.value,
      timestamp: new Date('2025-03-30').toISOString()
    }));
    toast.success('Phân tích hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể lấy phân tích!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};
</script>