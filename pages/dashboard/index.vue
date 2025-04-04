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

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';

definePageMeta({
  layout: 'dashboard'
});

// Tabs
const tabs = [
  { label: 'Ngày hôm nay', value: 'day' },
  { label: 'Tuần này', value: 'week' },
  { label: 'Tháng này', value: 'month' },
  { label: 'Năm này', value: 'year' },
  { label: 'Chu kỳ vận số', value: 'cycles' }
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
let chartInstance = null;
let intervalId = null; // Để lưu ID của setInterval

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

// Hàm lấy ngày hiện tại theo múi giờ Việt Nam
const getVietnamDate = () => {
  const now = new Date();
  return new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
};

// Hàm tính số tuần theo múi giờ Việt Nam
const getWeekNumber = (date) => {
  const d = new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  yearStart.setHours(0, 0, 0, 0, { timeZone: 'Asia/Ho_Chi_Minh' });
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Vẽ biểu đồ chu kỳ vận số
const renderChart = () => {
  if (!results.value.cycles) return;

  const ctx = document.getElementById('numerologyChart')?.getContext('2d');
  if (!ctx) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const years = Object.keys(results.value.cycles);
  const numbers = years.map(year => results.value.cycles[year].number);

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: years,
      datasets: [{
        label: 'Số cá nhân',
        data: numbers,
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.2)',
        fill: true,
        tension: 0.4,
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          max: 22,
          title: { display: true, text: 'Số cá nhân' }
        },
        x: {
          title: { display: true, text: 'Năm' }
        }
      },
      plugins: {
        legend: { display: true, position: 'top' },
        tooltip: {
          callbacks: {
            label: (context) => {
              const year = context.label;
              const number = context.raw;
              const description = results.value.cycles[year].description;
              return `${year}: Số ${number} - ${description}`;
            }
          }
        }
      }
    }
  });
};

// Gửi form và lấy kết quả
const submitForm = async (force = false) => {
  if (!form.value.name || !form.value.birthDate) {
    if (!force) toast.error('Vui lòng nhập đầy đủ tên và ngày sinh!', { position: 'top-center' });
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

    const currentDate = getVietnamDate();
    localStorage.setItem('numerologyData', JSON.stringify({
      userInfo: userInfo.value,
      results: results.value,
      timestamp: currentDate.toISOString()
    }));
    if (!force) toast.success('Phân tích hoàn tất!', { position: 'top-center' });

    if (activeTab.value === 'cycles') {
      setTimeout(() => renderChart(), 100);
    }
  } catch (error) {
    console.error('Error:', error);
    if (!force) toast.error('Không thể lấy phân tích!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Kiểm tra và gọi lại API nếu qua 0h
const checkAndRefreshData = () => {
  const storedData = localStorage.getItem('numerologyData');
  const currentDate = getVietnamDate();
  const currentDay = currentDate.getDate();

  if (storedData) {
    const { userInfo: storedUserInfo, results: storedResults, timestamp } = JSON.parse(storedData);
    const storedDate = new Date(timestamp);
    const storedDay = storedDate.getDate();

    // Nếu khác ngày, gọi lại API
    if (currentDay !== storedDay) {
      form.value.name = storedUserInfo.name;
      form.value.birthDate = storedUserInfo.birthDate;
      submitForm(true); // Force gọi API mà không hiện toast
      console.log('Đã qua 0h, gọi lại API');
    } else {
      userInfo.value = storedUserInfo;
      results.value = storedResults;
      if (activeTab.value === 'cycles') {
        renderChart();
      }
    }
  }
};

// Lên lịch kiểm tra mỗi phút
const scheduleDailyCheck = () => {
  intervalId = setInterval(() => {
    const currentDate = getVietnamDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    // Kiểm tra nếu là 0h (00:00 - 00:01)
    if (hours === 0 && minutes <= 1) {
      checkAndRefreshData();
    }
  }, 60000); // Kiểm tra mỗi 60 giây
};

// Load dữ liệu và lên lịch khi vào trang
onMounted(() => {
  checkAndRefreshData(); // Kiểm tra ngay khi vào trang
  scheduleDailyCheck(); // Lên lịch kiểm tra mỗi phút
});

// Hủy interval khi component bị hủy
onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
  }
});

// Theo dõi thay đổi tab để vẽ biểu đồ
watch(() => activeTab.value, (newTab) => {
  if (newTab === 'cycles' && results.value.cycles) {
    setTimeout(() => renderChart(), 100);
  }
});

// Chuyển tab
const switchTab = (tabValue) => {
  activeTab.value = tabValue;
};
</script>