<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header với gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Thần số học chu kỳ vận số</h2>
          <p class="text-teal-100 mt-1">Khám phá chu kỳ vận số tương lai của bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="name" class="form-label">Họ và tên</label>
          <input v-model="formData.name" type="text" id="name" placeholder="Nguyễn Văn A" class="form-input" />
        </div>
        <div>
          <label for="birthdate" class="form-label">Ngày sinh (dd/mm/yyyy)</label>
          <div class="relative">
            <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="15/03/1995" class="form-input pl-10" />
          </div>
        </div>
      </div>

      <div class="form-group">
        <label class="form-label">Giới tính</label>
        <div class="flex space-x-6">
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="male" class="radio-input" />
            <span class="radio-label">Nam</span>
          </label>
          <label class="radio-option">
            <input type="radio" v-model="formData.gender" value="female" class="radio-input" />
            <span class="radio-label">Nữ</span>
          </label>
        </div>
      </div>

      <button @click="generateReport" :disabled="loading" class="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else>Xem báo cáo chu kỳ vận số</span>
      </button>

      <!-- Nội dung chu kỳ vận số -->
      <transition name="fade-slide">
        <div v-if="numerologyData" class="mt-6">
          <div class="space-y-6">
            <!-- Biểu đồ chu kỳ vận số -->
            <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-xl font-bold text-teal-800 mb-4">Biểu đồ chu kỳ vận số</h3>
              <ClientOnly>
                <canvas ref="cycleChart"></canvas>
              </ClientOnly>
            </div>
            <!-- Danh sách các năm -->
            <div v-for="year in Object.keys(numerologyData.cycles)" :key="year" class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <div class="flex items-center mb-4">
                <span class="w-10 h-10 flex items-center justify-center bg-teal-100 text-teal-700 rounded-full font-bold mr-3">{{ year }}</span>
                <h4 class="text-lg font-semibold text-gray-800">Năm {{ year }}</h4>
              </div>
              <div class="prose prose-teal max-w-none">
                <p class="text-gray-700">{{ numerologyData.cycles[year].description }}</p>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';

const formData = ref({
  name: '',
  birthdate: '',
  gender: 'male'
});
const numerologyData = ref(null);
const loading = ref(false);
const cycleChart = ref(null);
let chartInstance = null;

// Tạo biểu đồ chu kỳ vận số
const createCycleChart = () => {
  if (!process.client || !numerologyData.value || !cycleChart.value || !numerologyData.value.cycles) return;

  if (chartInstance) chartInstance.destroy();

  const years = Object.keys(numerologyData.value.cycles);
  const numbers = years.map(year => numerologyData.value.cycles[year].number);

  chartInstance = new Chart(cycleChart.value, {
    type: 'line',
    data: {
      labels: years,
      datasets: [
        {
          label: 'Số cá nhân',
          data: numbers,
          borderColor: '#14B8A6',
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          fill: true,
          tension: 0.4,
          pointBackgroundColor: '#14B8A6',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#14B8A6'
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Số ${context.raw}`
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 11,
          title: { display: true, text: 'Số cá nhân' }
        },
        x: {
          title: { display: true, text: 'Năm' }
        }
      }
    }
  });
};

// Theo dõi khi dữ liệu thay đổi để vẽ biểu đồ
watch(numerologyData, () => {
  if (numerologyData.value && numerologyData.value.cycles) {
    setTimeout(() => createCycleChart(), 100); // Đợi DOM render
  }
});

// Hàm format ngày sinh từ "dd-mm-yyyy" sang "dd/mm/yyyy"
const formatBirthdate = (birthdate) => {
  if (!birthdate) return '';
  return birthdate.replace(/-/g, '/');
};

const generateReport = async () => {
  if (!formData.value.name) {
    toast.error('Vui lòng nhập họ và tên!');
    return;
  }
  if (!formData.value.birthdate) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }
  if (!formData.value.gender) {
    toast.error('Vui lòng chọn giới tính!');
    return;
  }

  const formattedBirthdate = formatBirthdate(formData.value.birthdate);

  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(formattedBirthdate)) {
    toast.error('Ngày sinh không đúng định dạng (dd/mm/yyyy)!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/full', {
      method: 'POST',
      body: { name: formData.value.name, birthdate: formattedBirthdate, gender: formData.value.gender }
    });

    numerologyData.value = response.numerology;
    toast.success('Tạo báo cáo chu kỳ vận số hoàn tất!');
  } catch (error) {
    console.error('Error fetching numerology data:', error);
    toast.error('Không thể tạo báo cáo từ API, sử dụng dữ liệu mẫu!');
    numerologyData.value = {
      cycles: {
        2025: { number: 1, description: 'Năm 2025 với số 1 mang năng lượng khởi đầu. Đây là thời điểm bắt đầu dự án mới và tự tin tiến lên.' },
        2026: { number: 2, description: 'Năm 2026 với số 2 tập trung vào hợp tác. Hãy xây dựng mối quan hệ và tìm sự cân bằng.' },
        2027: { number: 3, description: 'Năm 2027 với số 3 tràn đầy sáng tạo. Hãy thể hiện bản thân và tận hưởng niềm vui.' },
        2028: { number: 4, description: 'Năm 2028 với số 4 là xây dựng nền tảng. Làm việc chăm chỉ để đạt sự ổn định.' },
        2029: { number: 5, description: 'Năm 2029 với số 5 mang đến thay đổi. Khám phá cơ hội mới và sống năng động.' },
        2030: { number: 6, description: 'Năm 2030 với số 6 nhấn mạnh gia đình. Chăm sóc người thân và tạo sự hài hòa.' },
        2031: { number: 7, description: 'Năm 2031 với số 7 khuyến khích nội tâm. Suy ngẫm và học hỏi sẽ mang lại giá trị.' },
        2032: { number: 8, description: 'Năm 2032 với số 8 là năm thành công. Tận dụng tham vọng để đạt mục tiêu lớn.' },
        2033: { number: 9, description: 'Năm 2033 với số 9 đánh dấu hoàn thiện. Chia sẻ kinh nghiệm và chuẩn bị khởi đầu mới.' },
        2034: { number: 1, description: 'Năm 2034 với số 1 mang năng lượng khởi đầu. Đây là thời điểm bắt đầu dự án mới và tự tin tiến lên.' }
      }
    };
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.form-label {
  @apply block text-gray-700 font-medium mb-2;
}
.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors;
}
.form-group {
  @apply space-y-2;
}
.radio-option {
  @apply flex items-center;
}
.radio-input {
  @apply mr-2;
}
.radio-label {
  @apply text-gray-700;
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>