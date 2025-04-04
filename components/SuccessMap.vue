<template>
  <div class="bg-white p-6 rounded-xl shadow-lg">
    <h2 class="text-2xl font-semibold text-purple-700 mb-4">Bản đồ thành công</h2>

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
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>
        <div>
          <label for="birthDate" class="block text-gray-700 font-medium mb-2">Ngày sinh (dd/mm/yyyy)</label>
          <input
            v-model="form.birthDate"
            type="text"
            id="birthDate"
            placeholder="Ví dụ: 15/08/1995"
            class="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            :class="{ 'border-red-500': errors.birthDate }"
          />
          <p v-if="errors.birthDate" class="text-red-500 text-sm mt-1">{{ errors.birthDate }}</p>
        </div>
      </div>
      <button
        @click="validateAndFetch"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-400 transition-colors flex items-center justify-center"
      >
        <span v-if="loading" class="inline-block mr-2">
          <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </span>
        {{ loading ? 'Đang phân tích...' : 'Xem bản đồ' }}
      </button>
    </div>

    <!-- Hiển thị thông tin đã nhập -->
    <div v-else class="flex justify-between items-center mb-4">
      <p class="text-gray-700">
        <span class="font-semibold">{{ userInfo.name }}</span>
        <span class="text-sm text-gray-500 ml-2">({{ userInfo.birthDate }})</span>
      </p>
      <button
        @click="editing = true"
        class="text-purple-500 hover:underline flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
        </svg>
        Cập nhật
      </button>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="mt-6 space-y-6">
      <div v-for="i in 5" :key="'skeleton-'+i" class="bg-gray-100 rounded-lg p-4 animate-pulse">
        <div class="h-6 w-1/3 bg-gray-200 rounded mb-3"></div>
        <div class="h-4 bg-gray-200 rounded w-full"></div>
        <div class="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
      </div>
    </div>

    <!-- Kết quả -->
    <div v-else-if="successMap && userInfo.name" class="mt-4 space-y-6">
      <!-- Biểu đồ đường -->
      <div class="bg-purple-50 p-4 rounded-lg">
        <h3 class="text-purple-700 font-semibold text-lg mb-4">Hành trình thành công qua thời gian</h3>
        <div class="h-64">
          <canvas ref="chartCanvas"></canvas>
        </div>
      </div>

      <!-- Thông tin chi tiết -->
      <div class="grid md:grid-cols-2 gap-4">
        <!-- Mục tiêu lớn -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
          <p class="text-purple-700 font-semibold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clip-rule="evenodd" />
            </svg>
            Mục tiêu lớn (Số Đường đời: {{ successMap.lifePathNumber }})
          </p>
          <p class="text-gray-700 mt-3 leading-relaxed">{{ successMap.goal }}</p>
        </div>

        <!-- Điểm mạnh -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
          <p class="text-purple-700 font-semibold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
            </svg>
            Điểm mạnh (Số Tên: {{ successMap.expressionNumber }})
          </p>
          <p class="text-gray-700 mt-3 leading-relaxed">{{ successMap.strengths }}</p>
        </div>

        <!-- Điểm cần lưu ý -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
          <p class="text-purple-700 font-semibold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            Điểm cần lưu ý (Số Linh hồn: {{ successMap.soulUrgeNumber }})
          </p>
          <p class="text-gray-700 mt-3 leading-relaxed">{{ successMap.notes }}</p>
        </div>

        <!-- Chiến lược năm -->
        <div class="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
          <p class="text-purple-700 font-semibold text-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12 1.586l-4 4v12.828l4-4V1.586zM3.707 3.293A1 1 0 002 4v10a1 1 0 00.293.707L6 18.414V5.586L3.707 3.293zM17.707 5.293L14 1.586v12.828l2.293 2.293A1 1 0 0018 16V6a1 1 0 00-.293-.707z" clip-rule="evenodd" />
            </svg>
            Chiến lược năm {{ currentYear }} (Số Cá nhân: {{ successMap.personalYearNumber }})
          </p>
          <p class="text-gray-700 mt-3 leading-relaxed">{{ successMap.strategy }}</p>
        </div>
      </div>

      <!-- Các cột mốc thành công -->
      <div class="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
        <p class="text-purple-700 font-semibold text-lg mb-4">Các cột mốc thành công</p>
        <div class="grid md:grid-cols-2 gap-4">
          <div v-for="(milestone, key) in milestonesList" :key="key" class="border-l-4 pl-4" :class="milestone.borderColor">
            <p class="text-purple-600 font-semibold flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
              </svg>
              {{ milestone.title }}
            </p>
            <p class="text-gray-700 mt-2">{{ milestone.text }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty state -->
    <div v-else-if="!userInfo.name" class="text-center py-8">
      <div class="max-w-md mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <h3 class="text-lg font-medium text-gray-700 mb-2">Nhập thông tin của bạn</h3>
        <p class="text-gray-500">Vui lòng nhập tên và ngày sinh để xem bản đồ thành công</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';

const currentYear = new Date().getFullYear();

// Form và trạng thái
const form = ref({
  name: '',
  birthDate: ''
});
const errors = ref({
  name: '',
  birthDate: ''
});
const userInfo = ref({});
const successMap = ref(null);
const loading = ref(false);
const editing = ref(false);
const chartInstance = ref(null);
const chartCanvas = ref(null);

// Danh sách cột mốc
const milestonesList = computed(() => {
  if (!successMap.value?.milestones) return [];
  
  return [
    {
      key: 'shortTerm',
      title: 'Ngắn hạn',
      text: successMap.value.milestones.shortTerm,
      borderColor: 'border-purple-300'
    },
    {
      key: 'mediumTerm',
      title: 'Trung hạn',
      text: successMap.value.milestones.mediumTerm,
      borderColor: 'border-purple-400'
    },
    {
      key: 'longTerm',
      title: 'Dài hạn',
      text: successMap.value.milestones.longTerm,
      borderColor: 'border-purple-500'
    },
    {
      key: 'currentYear',
      title: `Năm ${currentYear}`,
      text: successMap.value.milestones.currentYear,
      borderColor: 'border-purple-600'
    }
  ];
});

// Validate form
const validateForm = () => {
  let isValid = true;
  errors.value = { name: '', birthDate: '' };

  if (!form.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ tên';
    isValid = false;
  } else if (form.value.name.trim().length < 2) {
    errors.value.name = 'Tên quá ngắn';
    isValid = false;
  }

  if (!form.value.birthDate.trim()) {
    errors.value.birthDate = 'Vui lòng nhập ngày sinh';
    isValid = false;
  } else if (!/^\d{2}\/\d{2}\/\d{4}$/.test(form.value.birthDate.trim())) {
    errors.value.birthDate = 'Định dạng ngày sinh không hợp lệ (dd/mm/yyyy)';
    isValid = false;
  } else {
    // Kiểm tra ngày hợp lệ
    const [day, month, year] = form.value.birthDate.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    if (isNaN(date.getTime()) || 
        date.getDate() !== day || 
        date.getMonth() + 1 !== month || 
        date.getFullYear() !== year) {
      errors.value.birthDate = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }

  return isValid;
};

// Vẽ biểu đồ
const renderChart = () => {
  if (!successMap.value?.milestones || !chartCanvas.value) return;

  // Hủy biểu đồ cũ nếu tồn tại
  if (chartInstance.value) {
    chartInstance.value.destroy();
  }

  const labels = milestonesList.value.map(m => m.title);
  const data = [
    successMap.value.soulUrgeNumber,
    successMap.value.expressionNumber,
    successMap.value.lifePathNumber,
    successMap.value.personalYearNumber
  ];

  chartInstance.value = new Chart(chartCanvas.value, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Hành trình thành công',
        data: data,
        borderColor: '#6d28d9',
        backgroundColor: 'rgba(109, 40, 217, 0.1)',
        fill: true,
        tension: 0.4,
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
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              return `${context.dataset.label}: ${context.raw}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: Math.max(1, Math.min(...data) - 2),
          max: Math.min(22, Math.max(...data) + 2),
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
};

// Validate và lấy dữ liệu
const validateAndFetch = async () => {
  if (!validateForm()) return;
  await fetchSuccessMap();
};

// Lấy dữ liệu bản đồ thành công
const fetchSuccessMap = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/success-map', {
      method: 'POST',
      body: {
        name: form.value.name,
        birthDate: form.value.birthDate
      }
    });

    userInfo.value = { 
      name: form.value.name, 
      birthDate: form.value.birthDate 
    };
    successMap.value = response.successMap;
    editing.value = false;

    // Lưu vào localStorage
    localStorage.setItem('successMapData', JSON.stringify({
      userInfo: userInfo.value,
      successMap: successMap.value
    }));

    toast.success('Bản đồ thành công đã sẵn sàng!');
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
    toast.error('Không thể lấy bản đồ thành công. Vui lòng thử lại sau!');
  } finally {
    loading.value = false;
  }
};

// Khởi tạo
onMounted(() => {
  const storedData = localStorage.getItem('successMapData');
  if (storedData) {
    try {
      const { userInfo: storedUserInfo, successMap: storedSuccessMap } = JSON.parse(storedData);
      userInfo.value = storedUserInfo;
      form.value = {
        name: storedUserInfo.name,
        birthDate: storedUserInfo.birthDate
      };
      successMap.value = storedSuccessMap;
    } catch (e) {
      console.error('Lỗi khi đọc dữ liệu từ localStorage:', e);
      localStorage.removeItem('successMapData');
    }
  }
});

// Theo dõi thay đổi để render biểu đồ
watch([successMap, chartCanvas], () => {
  if (successMap.value && chartCanvas.value) {
    nextTick(renderChart);
  }
}, { immediate: true });

// Reset form khi bật chế độ chỉnh sửa
watch(editing, (newVal) => {
  if (newVal) {
    form.value = {
      name: userInfo.value.name,
      birthDate: userInfo.value.birthDate
    };
  }
});
</script>

<style scoped>
/* Tùy chỉnh thêm nếu cần */
</style>