<!-- components/SuccessMap.vue -->
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
        @click="fetchSuccessMap"
        :disabled="loading"
        class="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 disabled:bg-gray-400"
      >
        {{ loading ? 'Đang xử lý...' : 'Xem bản đồ' }}
      </button>
    </div>
    <div v-else class="flex justify-between items-center mb-4">
      <p class="text-gray-700">Bản đồ thành công của: <span class="font-semibold">{{ userInfo.name }}</span></p>
      <button
        @click="editing = true"
        class="text-purple-500 hover:underline"
      >
        Cập nhật thông tin
      </button>
    </div>

    <!-- Kết quả -->
    <div v-if="!userInfo.name" class="text-center text-gray-600">
      <p>Nhập thông tin để khám phá bản đồ thành công của bạn!</p>
    </div>
    <div v-else-if="successMap" class="mt-4 p-4 bg-purple-50 rounded-lg space-y-6">
      <!-- Biểu đồ đường -->
      <div>
        <h3 class="text-purple-700 font-semibold text-lg mb-2">Hành trình thành công qua thời gian</h3>
        <canvas id="successMapChart" height="100"></canvas>
      </div>

      <div>
        <p class="text-purple-700 font-semibold text-lg">Mục tiêu lớn (Số Đường đời: {{ successMap.lifePathNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.goal }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Điểm mạnh (Số Tên: {{ successMap.expressionNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.strengths }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Điểm cần lưu ý (Số Linh hồn: {{ successMap.soulUrgeNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.notes }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Chiến lược năm {{ currentYear }} (Số Cá nhân: {{ successMap.personalYearNumber }})</p>
        <p class="text-gray-700 mt-2">{{ successMap.strategy }}</p>
      </div>
      <div>
        <p class="text-purple-700 font-semibold text-lg">Các cột mốc thành công</p>
        <div class="space-y-4 mt-2">
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc ngắn hạn</p>
            <p class="text-gray-700">{{ successMap.milestones.shortTerm }}</p>
          </div>
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc trung hạn</p>
            <p class="text-gray-700">{{ successMap.milestones.mediumTerm }}</p>
          </div>
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc dài hạn</p>
            <p class="text-gray-700">{{ successMap.milestones.longTerm }}</p>
          </div>
          <div>
            <p class="text-purple-600 font-semibold">Cột mốc năm {{ currentYear }}</p>
            <p class="text-gray-700">{{ successMap.milestones.currentYear }}</p>
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
  // Dùng các số thần số học làm giá trị minh họa (vì API không trả value)
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
      scales: {
        y: {
          beginAtZero: true,
          max: 22, // Giới hạn tối đa là 22 (master number)
          title: {
            display: true,
            text: 'Giá trị'
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
    console.log('Response từ API:', response); // Debug dữ liệu API trả về
    userInfo.value = { name: form.value.name, birthDate: form.value.birthDate };
    successMap.value = response.successMap;
    editing.value = false;
    toast.success('Bản đồ thành công đã sẵn sàng!', { position: 'top-center' });

    // Lưu vào localStorage
    localStorage.setItem('successMapData', JSON.stringify({
      userInfo: userInfo.value,
      successMap: successMap.value
    }));

    // Vẽ biểu đồ
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
    console.log('Dữ liệu từ localStorage:', storedSuccessMap); // Debug dữ liệu localStorage
    userInfo.value = storedUserInfo;
    successMap.value = storedSuccessMap;
    renderChart();
  }
});

// Theo dõi thay đổi successMap để vẽ lại biểu đồ
watch(() => successMap.value, (newValue) => {
  if (newValue) {
    console.log('successMap thay đổi:', newValue); // Debug khi successMap cập nhật
    setTimeout(() => renderChart(), 100);
  }
});
</script>