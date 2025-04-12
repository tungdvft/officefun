<template>
  <div class="container bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header Section -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553-2.276A1 1 0 0021 13.382V6.618a1 1 0 00-1.447-.894L15 8m0 9V4" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Bản Đồ Thành Công</h2>
          <p class="text-purple-100 mt-1">Khám phá hành trình phát triển của bạn</p>
        </div>
      </div>
    </div>
    <!-- Form Section -->
    <div v-if="!userInfo.name || editing" class="form-section p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div class="form-group">
          <label for="name" class="form-label">Họ và tên</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            placeholder="Ví dụ: Nguyễn Văn A"
            class="form-input"
          />
        </div>
        <div class="form-group">
          <label for="birthDate" class="form-label">Ngày sinh (dd/mm/yyyy)</label>
          <input
            v-model="form.birthDate"
            type="text"
            id="birthDate"
            placeholder="Ví dụ: 15/08/1995"
            class="form-input"
          />
        </div>
      </div>
      <button
        @click="fetchSuccessMap"
        :disabled="loading"
        class="submit-button"
      >
        <span v-if="loading" class="spinner"></span>
        {{ loading ? 'Đang phân tích...' : 'Xem bản đồ' }}
      </button>
    </div>

    <!-- User Info Section -->
    <div v-else class="user-info-section p-6 border-b">
      <div class="flex justify-between items-center">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">Bản đồ thành công của</h3>
          <p class="text-purple-600 font-medium">{{ userInfo.name }}</p>
          <p class="text-sm text-gray-500">Ngày sinh: {{ userInfo.birthDate }}</p>
        </div>
        <button
          @click="editing = true"
          class="edit-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </button>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="!userInfo.name && !loading" class="empty-state p-8 text-center">
      <div class="mx-auto w-16 h-16 text-purple-200 mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      </div>
      <h3 class="text-lg font-medium text-gray-600 mb-2">Khám phá bản đồ thành công của bạn</h3>
      <p class="text-gray-500">Nhập thông tin để xem phân tích chi tiết về mục tiêu, điểm mạnh và chiến lược phát triển</p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state p-8 text-center">
      <div class="spinner-large mx-auto mb-4"></div>
      <p class="text-gray-600">Đang phân tích thông tin của bạn...</p>
    </div>

    <!-- Results Section -->
    <div v-if="successMap && !loading" class="results-section p-6 space-y-8">
      <!-- Core Numbers -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="section-title">Mục tiêu lớn (Số Đường đời)</h3>
          <div class="flex items-start space-x-4">
            <div class="number-badge bg-purple-100 text-purple-900">
              {{ successMap.lifePathNumber }}
            </div>
            <p class="text-gray-700">{{ successMap.goal }}</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="section-title">Điểm mạnh (Số Tên)</h3>
          <div class="flex items-start space-x-4">
            <div class="number-badge bg-blue-100 text-blue-800">
              {{ successMap.expressionNumber }}
            </div>
            <p class="text-gray-700">{{ successMap.strengths }}</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="section-title">Điểm cần lưu ý (Số Linh hồn)</h3>
          <div class="flex items-start space-x-4">
            <div class="number-badge bg-amber-100 text-amber-800">
              {{ successMap.soulUrgeNumber }}
            </div>
            <p class="text-gray-700">{{ successMap.notes }}</p>
          </div>
        </div>
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h3 class="section-title">Chiến lược năm {{ currentYear }} (Số Cá nhân)</h3>
          <div class="flex items-start space-x-4">
            <div class="number-badge bg-green-100 text-green-800">
              {{ successMap.personalYearNumber }}
            </div>
            <p class="text-gray-700">{{ successMap.strategy }}</p>
          </div>
        </div>
      </div>

      <!-- Chart Section -->
      <div class="chart-section bg-white rounded-lg shadow-sm p-6">
        <h3 class="section-title">Hành trình thành công</h3>
        <div class="chart-container h-80">
          <canvas id="successMapChart"></canvas>
        </div>
      </div>

      <!-- Milestones -->
      <div class="milestones-section bg-white rounded-lg shadow-sm p-6">
        <h3 class="section-title">Các cột mốc thành công</h3>
        <div class="space-y-6">
          <div class="milestone-item">
            <div class="milestone-header">
              <div class="milestone-dot bg-purple-500"></div>
              <h4 class="milestone-title">Ngắn hạn (Số Linh hồn)</h4>
            </div>
            <p class="milestone-content">{{ successMap.milestones.shortTerm }}</p>
          </div>
          <div class="milestone-item">
            <div class="milestone-header">
              <div class="milestone-dot bg-blue-500"></div>
              <h4 class="milestone-title">Trung hạn (Số Tên)</h4>
            </div>
            <p class="milestone-content">{{ successMap.milestones.mediumTerm }}</p>
          </div>
          <div class="milestone-item">
            <div class="milestone-header">
              <div class="milestone-dot bg-amber-500"></div>
              <h4 class="milestone-title">Dài hạn (Số Đường đời)</h4>
            </div>
            <p class="milestone-content">{{ successMap.milestones.longTerm }}</p>
          </div>
          <div class="milestone-item">
            <div class="milestone-header">
              <div class="milestone-dot bg-green-500"></div>
              <h4 class="milestone-title">Năm {{ currentYear }} (Số Cá nhân)</h4>
            </div>
            <p class="milestone-content">{{ successMap.milestones.currentYear }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';

const currentYear = '2025';

// Form và trạng thái
const form = ref({
  name: '',
  birthDate: ''
});
const userInfo = ref({ name: '', birthDate: '' });
const successMap = ref(null);
const loading = ref(false);
const editing = ref(false);
let chartInstance = null;

// Vẽ biểu đồ hành trình thành công
const renderChart = () => {
  if (!successMap.value || !successMap.value.milestones) {
    console.error('Không có dữ liệu milestones để vẽ biểu đồ');
    return;
  }

  const ctx = document.getElementById('successMapChart')?.getContext('2d');
  if (!ctx) {
    console.error('Không tìm thấy canvas để vẽ biểu đồ');
    return;
  }

  if (chartInstance) {
    chartInstance.destroy();
  }

  const labels = ['Ngắn hạn', 'Trung hạn', 'Dài hạn', `Năm ${currentYear}`];
  const data = [
    successMap.value.soulUrgeNumber,      // Ngắn hạn
    successMap.value.expressionNumber,    // Trung hạn
    successMap.value.lifePathNumber,      // Dài hạn
    successMap.value.personalYearNumber   // Năm hiện tại
  ];
  const descriptions = [
    successMap.value.milestones.shortTerm,
    successMap.value.milestones.mediumTerm,
    successMap.value.milestones.longTerm,
    successMap.value.milestones.currentYear
  ];

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Hành trình thành công',
        data: data,
        borderColor: '#6d28d9',
        backgroundColor: 'rgba(139, 92, 246, 0.3)',
        fill: true,
        tension: 0.5,
        pointBackgroundColor: '#8b5cf6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 33, // Hỗ trợ số bậc thầy (11, 22, 33)
          title: {
            display: true,
            text: 'Giá trị thần số'
          },
          ticks: {
            stepSize: 1
          }
        },
        x: {
          title: {
            display: true,
            text: 'Mốc thời gian'
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const index = context.dataIndex;
              const value = context.raw;
              return `${labels[index]}: ${value} - ${descriptions[index]}`;
            }
          }
        }
      }
    }
  });
};

// Lấy dữ liệu bản đồ thành công
const fetchSuccessMap = async () => {
  if (!form.value.name || !form.value.birthDate) {
    toast.error('Vui lòng nhập đầy đủ tên và ngày sinh!', { position: 'top-center' });
    return;
  }
  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/success-map', {
      method: 'POST',
      body: {
        name: form.value.name,
        birthDate: form.value.birthDate
      }
    });
    console.log('Response từ API:', response);
    userInfo.value = { name: form.value.name, birthDate: form.value.birthDate };
    successMap.value = response.successMap;
    editing.value = false;
    toast.success('Bản đồ thành công đã sẵn sàng!', { position: 'top-center' });

    localStorage.setItem('successMapData', JSON.stringify({
      userInfo: userInfo.value,
      successMap: successMap.value
    }));

    setTimeout(() => renderChart(), 100);
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    toast.error('Không thể lấy bản đồ thành công!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Load dữ liệu từ localStorage khi mounted
onMounted(() => {
  const storedData = localStorage.getItem('successMapData');
  if (storedData) {
    const { userInfo: storedUserInfo, successMap: storedSuccessMap } = JSON.parse(storedData);
    console.log('Dữ liệu từ localStorage:', storedSuccessMap);
    userInfo.value = storedUserInfo;
    successMap.value = storedSuccessMap;
    renderChart();
  }
});

// Theo dõi thay đổi successMap để vẽ lại biểu đồ
watch(() => successMap.value, (newValue) => {
  if (newValue) {
    console.log('successMap thay đổi:', newValue);
    setTimeout(() => renderChart(), 100);
  }
});
</script>

<style scoped>
.success-map-container {
  max-width: 1000px;
  margin: 0 auto;
}

.header-section {
  background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%);
}

.form-label {
  @apply block text-gray-700 font-medium mb-2;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all;
}

.submit-button {
  @apply w-full md:w-auto px-6 py-3 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2;
}

.spinner {
  @apply border-2 border-white border-opacity-30 rounded-full border-t-white w-5 h-5 animate-spin;
}

.user-info-section {
  @apply border-b border-gray-200;
}

.edit-button {
  @apply p-2 text-gray-500 hover:text-purple-600 transition-colors;
}

.empty-state {
  @apply bg-gray-50;
}

.loading-state {
  @apply bg-gray-50;
}

.spinner-large {
  @apply border-4 border-purple-100 border-t-purple-600 rounded-full w-12 h-12 animate-spin mx-auto;
}

.section-title {
  @apply text-lg font-semibold text-gray-800 mb-3 flex items-center;
}

.number-badge {
  @apply flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center font-bold text-base;
}

.milestone-item {
  @apply pl-6 relative;
}

.milestone-header {
  @apply flex items-center mb-2;
}

.milestone-dot {
  @apply absolute left-0 w-3 h-3 rounded-full top-2;
}

.milestone-title {
  @apply font-medium text-gray-700;
}

.milestone-content {
  @apply text-gray-600 pl-4 border-l-2 border-gray-200;
}

.chart-container {
  position: relative;
  height: 300px;
}
</style>