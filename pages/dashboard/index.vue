<template>
  <div class="space-y-8">
    <!-- Banner chào mừng -->
    <div class="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-2xl shadow-xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div class="relative z-10">
        <h1 class="text-4xl font-bold mb-2 animate-fade-in">Chào mừng đến với Thần số học</h1>
        <p class="text-lg opacity-90 mb-4">Khám phá năng lượng của bạn qua con số!</p>
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <span class="text-sm font-medium">Hôm nay là {{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- Card chính -->
    <div class="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
          Thần số học cá nhân
        </h2>
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span class="text-sm text-gray-500">Cập nhật theo thời gian thực</span>
        </div>
      </div>

      <!-- Form nhập thông tin -->
      <div v-if="!userInfo.name || editing" class="space-y-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label for="name" class="block text-gray-700 font-medium">Họ và tên</label>
            <div class="relative">
              <input
                v-model="form.name"
                type="text"
                id="name"
                placeholder="Ví dụ: Nguyễn Văn A"
                class="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>
          </div>
          <div class="space-y-2">
            <label for="birthDate" class="block text-gray-700 font-medium">Ngày sinh</label>
            <div class="relative">
              <input
                v-model="form.birthDate"
                type="text"
                id="birthDate"
                placeholder="dd/mm/yyyy (Ví dụ: 15/08/1995)"
                class="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <button
          @click="submitForm"
          :disabled="loading"
          class="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:transform-none disabled:shadow-none"
        >
          <span v-if="loading" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Đang phân tích...
          </span>
          <span v-else class="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Xem ngay
          </span>
        </button>
      </div>

      <!-- Thông tin người dùng -->
      <div v-else class="flex flex-col md:flex-row md:items-center md:justify-between mb-6 p-4 bg-purple-50 rounded-xl">
        <div class="flex items-center space-x-3 mb-3 md:mb-0">
          <div class="bg-purple-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <p class="text-gray-700">Kết quả cho:</p>
            <p class="font-semibold text-lg text-purple-800">{{ userInfo.name }}</p>
            <p class="text-sm text-gray-500">Ngày sinh: {{ userInfo.birthDate }}</p>
          </div>
        </div>
        <button
          @click="editing = true"
          class="px-4 py-2 bg-white text-purple-600 font-medium rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors duration-200 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Cập nhật
        </button>
      </div>

      <!-- Tabs -->
      <div v-if="userInfo.name" class="flex overflow-x-auto pb-2 mb-6 scrollbar-hide">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="switchTab(tab.value)"
          :class="[
            'px-5 py-3 font-medium rounded-lg mr-2 whitespace-nowrap transition-all duration-200',
            activeTab === tab.value
              ? 'bg-purple-100 text-purple-700 shadow-inner'
              : 'text-gray-500 hover:bg-gray-100'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

      <!-- Placeholder khi chưa nhập thông tin -->
      <div v-if="!userInfo.name" class="text-center py-12">
        <div class="mx-auto w-24 h-24 mb-4 text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 class="text-xl font-medium text-gray-600 mb-2">Bắt đầu khám phá thần số học</h3>
        <p class="text-gray-500 max-w-md mx-auto">Nhập tên và ngày sinh để xem phân tích chi tiết về số đường đời, năng lượng ngày, tuần, tháng, năm và chu kỳ vận số.</p>
      </div>

      <!-- Nội dung kết quả -->
      <div v-else-if="results && Object.keys(results).length > 0" class="space-y-8">
        <!-- Số đường đời (Tab Tổng quan) -->
        <div v-if="activeTab === 'general' && results.lifePathNumber" class="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-2xl">
          <h3 class="text-xl font-bold text-purple-800 mb-4">Số đường đời: {{ results.lifePathNumber.number }} {{ results.lifePathNumber.symbol }}</h3>
          <div class="prose prose-purple max-w-none">
            <p class="text-gray-700">{{ results.lifePathNumber.description }}</p>
          </div>
          <div class="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Điểm mạnh</h4>
              <ul class="list-disc pl-5 text-gray-700">
                <li v-for="strength in results.lifePathNumber.strengths" :key="strength">{{ strength }}</li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Thách thức</h4>
              <ul class="list-disc pl-5 text-gray-700">
                <li v-for="challenge in results.lifePathNumber.challenges" :key="challenge">{{ challenge }}</li>
              </ul>
            </div>
            <div>
              <h4 class="text-lg font-semibold text-gray-800 mb-2">Nghề nghiệp phù hợp</h4>
              <ul class="list-disc pl-5 text-gray-700">
                <li v-for="career in results.lifePathNumber.careers" :key="career">{{ career }}</li>
              </ul>
            </div>
          </div>
          <div class="mt-4">
            <h4 class="text-lg font-semibold text-gray-800 mb-2">Lời khuyên</h4>
            <p class="text-gray-700">{{ results.lifePathNumber.advice }}</p>
          </div>
        </div>

        <!-- Kết quả theo ngày/tuần/tháng/năm -->
        <div v-if="['day', 'week', 'month', 'year'].includes(activeTab) && results.periods && results.periods[activeTab]" class="space-y-6">
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-2xl">
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-xl font-bold text-purple-800">
                {{ resultTitle }}: <span class="text-3xl">{{ results.periods[activeTab].number }}</span> - {{ results.periods[activeTab].theme }}
              </h3>
              <div class="bg-white p-2 rounded-full shadow-sm">
                <span class="text-2xl font-bold text-purple-600">{{ results.periods[activeTab].number }}</span>
              </div>
            </div>
            <div class="prose prose-purple max-w-none">
              <p class="text-gray-700">{{ results.periods[activeTab].description }}</p>
            </div>
            <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">Tập trung</h4>
                <ul class="list-disc pl-5 text-gray-700">
                  <li v-for="focus in results.periods[activeTab].focus" :key="focus">{{ focus }}</li>
                </ul>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-2">Từ khóa</h4>
                <ul class="list-disc pl-5 text-gray-700">
                  <li v-for="keyword in results.periods[activeTab].keywords" :key="keyword">{{ keyword }}</li>
                </ul>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center mb-3">
                <div class="bg-green-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-800">{{ shouldDoTitle }}</h4>
              </div>
              <ul class="list-disc pl-11 text-gray-700 space-y-1">
                <li v-for="item in results.periods[activeTab].shouldDo" :key="item">{{ item }}</li>
              </ul>
            </div>

            <div class="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div class="flex items-center mb-3">
                <div class="bg-red-100 p-2 rounded-full mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                <h4 class="text-lg font-semibold text-gray-800">{{ shouldAvoidTitle }}</h4>
              </div>
              <ul class="list-disc pl-11 text-gray-700 space-y-1">
                <li v-for="item in results.periods[activeTab].shouldAvoid" :key="item">{{ item }}</li>
              </ul>
            </div>
          </div>

          <!-- Gợi ý ăn trưa -->
          <div v-if="activeTab === 'day' && results.periods.day.lunchSuggestion" class="bg-yellow-50 p-6 rounded-2xl border border-yellow-100">
            <div class="flex items-center mb-4">
              <div class="bg-yellow-100 p-2 rounded-full mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h4 class="text-lg font-semibold text-gray-800">Gợi ý ăn trưa</h4>
            </div>
            <ul class="list-disc pl-11 text-gray-700 space-y-1">
              <li v-for="item in results.periods.day.lunchSuggestion" :key="item">{{ item }}</li>
            </ul>
          </div>
        </div>

        <!-- Chu kỳ vận số -->
        <div v-if="activeTab === 'cycles' && results.cycles" class="space-y-6">
          <div class="bg-white p-6 rounded-2xl shadow-sm">
            <h3 class="text-xl font-bold text-purple-800 mb-4">Biểu đồ chu kỳ vận số 10 năm</h3>
            <div class="w-full h-80 relative">
              <canvas id="numerologyChart" class="w-full h-full"></canvas>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div
              v-for="(cycle, year) in results.cycles"
              :key="year"
              class="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 hover:border-purple-200"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-bold text-lg text-purple-700">Năm {{ year }}</h4>
                <span class="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Số {{ cycle.number }}</span>
              </div>
              <p class="text-gray-700">{{ cycle.description }}</p>
              <div class="mt-2">
                <h5 class="text-sm font-semibold text-gray-800">Tập trung:</h5>
                <ul class="list-disc pl-5 text-gray-700 text-sm">
                  <li v-for="focus in cycle.focus" :key="focus">{{ focus }}</li>
                </ul>
              </div>
              <div class="mt-2">
                <h5 class="text-sm font-semibold text-gray-800">Từ khóa:</h5>
                <ul class="list-disc pl-5 text-gray-700 text-sm">
                  <li v-for="keyword in cycle.keywords" :key="keyword">{{ keyword }}</li>
                </ul>
              </div>
            </div>
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
  { label: 'Chu kỳ vận số', value: 'cycles' },
  { label: 'Tổng quan', value: 'general' }
];
const activeTab = ref('day');

// Form và trạng thái
const form = ref({ name: '', birthDate: '' });
const userInfo = ref({ name: '', birthDate: '' });
const results = ref({});
const loading = ref(false);
const editing = ref(false);
let chartInstance = null;
let intervalId = null;

// Ngày hiện tại
const currentDate = computed(() => {
  const date = getVietnamDate();
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
});

// Tiêu đề động
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

// Hàm lấy ngày Việt Nam
const getVietnamDate = () => {
  return new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' }));
};

// Vẽ biểu đồ chu kỳ vận số
const renderChart = () => {
  if (!results.value.cycles) return;

  const ctx = document.getElementById('numerologyChart')?.getContext('2d');
  if (!ctx) return;

  if (chartInstance) chartInstance.destroy();

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
        borderWidth: 3,
        pointBackgroundColor: '#8b5cf6',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 33,
          title: { display: true, text: 'Số cá nhân', font: { weight: 'bold' } },
          grid: { color: 'rgba(0, 0, 0, 0.05)' }
        },
        x: {
          title: { display: true, text: 'Năm', font: { weight: 'bold' } },
          grid: { display: false }
        }
      },
      plugins: {
        legend: { display: true, position: 'top', labels: { font: { size: 14 } } },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          titleFont: { size: 16, weight: 'bold' },
          bodyFont: { size: 14 },
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
      body: { name: form.value.name, birthDate: form.value.birthDate }
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

// Kiểm tra và làm mới dữ liệu
const checkAndRefreshData = () => {
  const storedData = localStorage.getItem('numerologyData');
  const currentDate = getVietnamDate();
  const currentDay = currentDate.getDate();

  if (storedData) {
    const { userInfo: storedUserInfo, results: storedResults, timestamp } = JSON.parse(storedData);
    const storedDate = new Date(timestamp);
    const storedDay = storedDate.getDate();

    if (currentDay !== storedDay) {
      form.value.name = storedUserInfo.name;
      form.value.birthDate = storedUserInfo.birthDate;
      submitForm(true);
      console.log('Đã qua 0h, gọi lại API');
    } else {
      userInfo.value = storedUserInfo;
      results.value = storedResults;
      if (activeTab.value === 'cycles') renderChart();
    }
  }
};

// Lên lịch kiểm tra mỗi phút
const scheduleDailyCheck = () => {
  intervalId = setInterval(() => {
    const currentDate = getVietnamDate();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();

    if (hours === 0 && minutes <= 1) checkAndRefreshData();
  }, 60000);
};

// Lifecycle hooks
onMounted(() => {
  checkAndRefreshData();
  scheduleDailyCheck();
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (chartInstance) chartInstance.destroy();
});

// Theo dõi tab để vẽ biểu đồ
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

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.animate-fade-in {
  animation: fadeIn 1s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>