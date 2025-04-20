<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2c0 .738.402 1.378 1 1.723V15a1 1 0 001 1h2a1 1 0 001-1v-2.277c.598-.345 1-.985 1-1.723zm9 1c0-4.971-4.029-9-9-9s-9 4.029-9 9c0 2.232.811 4.275 2.156 5.854M12 3v1m5.657 1.343l-.707.707M21 12h-1m-1.343 5.657l-.707-.707M12 21v-1m-5.657-1.343l-.707.707" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Thần số học cho trẻ em</h2>
          <p class="text-purple-100 mt-1">Phân tích toàn diện cho bé</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-purple-700 mb-4">Thông tin của bé</h3>
        <div class="space-y-4">
          <div>
            <label for="childName" class="form-label">Họ và tên bé</label>
            <input v-model="formData.childName" type="text" id="childName" placeholder="Ví dụ: Nguyễn Minh Anh" class="form-input" />
          </div>
          <div>
            <label for="birthDate" class="form-label">Ngày sinh (dd/mm/yyyy hoặc dd-mm-yyyy)</label>
            <div class="relative">
              <input v-model="formData.birthDate" type="text" id="birthDate" placeholder="15/03/2018" class="form-input pl-10" />
              <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg> -->
            </div>
          </div>
        </div>
      </div>

      <button @click="analyzeChild" :disabled="loading" class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else>Phân tích ngay</span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="result" class="mt-6 space-y-6">
          <!-- Các con số chủ đạo -->
          <div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-900 mb-4">Các con số chủ đạo</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="p-4 bg-white rounded-lg shadow-sm">
                <h4 class="font-semibold text-gray-800 flex items-center">
                  <span class="mr-2">{{ result.numbers.lifePath.symbol }}</span> Số Đường đời: {{ result.numbers.lifePath.number }}
                </h4>
                <p class="text-sm text-gray-600">{{ result.numbers.lifePath.theme }}</p>
                <div class="mt-2">
                  <h5 class="text-sm font-semibold text-gray-800">Điểm mạnh:</h5>
                  <ul class="list-disc pl-5 text-gray-700 text-sm">
                    <li v-for="strength in (Array.isArray(result.numbers.lifePath.strengths) ? result.numbers.lifePath.strengths : result.numbers.lifePath.strengths.split(', '))" :key="strength">{{ strength }}</li>
                  </ul>
                </div>
                <div class="mt-2">
                  <h5 class="text-sm font-semibold text-gray-800">Thách thức:</h5>
                  <ul class="list-disc pl-5 text-gray-700 text-sm">
                    <li v-for="challenge in (Array.isArray(result.numbers.lifePath.challenges) ? result.numbers.lifePath.challenges : result.numbers.lifePath.challenges.split(', '))" :key="challenge">{{ challenge }}</li>
                  </ul>
                </div>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm">
                <h4 class="font-semibold text-gray-800 flex items-center">
                  <span class="mr-2">{{ result.numbers.soulUrge.symbol }}</span> Số Linh hồn: {{ result.numbers.soulUrge.number }}
                </h4>
                <p class="text-sm text-gray-600">{{ result.numbers.soulUrge.desire }}</p>
                <p class="text-sm text-gray-500 mt-1"><strong>Động lực:</strong> {{ result.numbers.soulUrge.motivation }}</p>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm">
                <h4 class="font-semibold text-gray-800 flex items-center">
                  <span class="mr-2">{{ result.numbers.personality.symbol }}</span> Số Nhân cách: {{ result.numbers.personality.number }}
                </h4>
                <p class="text-sm text-gray-600">{{ result.numbers.personality.theme }}</p>
                <div class="mt-2">
                  <h5 class="text-sm font-semibold text-gray-800">Điểm mạnh:</h5>
                  <ul class="list-disc pl-5 text-gray-700 text-sm">
                    <li v-for="strength in (Array.isArray(result.numbers.personality.strengths) ? result.numbers.personality.strengths : result.numbers.personality.strengths.split(', '))" :key="strength">{{ strength }}</li>
                  </ul>
                </div>
              </div>
              <div class="p-4 bg-white rounded-lg shadow-sm">
                <h4 class="font-semibold text-gray-800 flex items-center">
                  <span class="mr-2">{{ result.numbers.destiny.symbol }}</span> Số Sứ mệnh: {{ result.numbers.destiny.number }}
                </h4>
                <p class="text-sm text-gray-600">{{ result.numbers.destiny.theme }}</p>
                <div class="mt-2">
                  <h5 class="text-sm font-semibold text-gray-800">Tài năng:</h5>
                  <ul class="list-disc pl-5 text-gray-700 text-sm">
                    <li v-for="talent in (Array.isArray(result.numbers.destiny.talents) ? result.numbers.destiny.talents : result.numbers.destiny.talents.split(', '))" :key="talent">{{ talent }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Năm cá nhân -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 class="text-xl font-bold text-indigo-800 mb-4">Năm cá nhân {{ currentYear }}</h3>
            <div class="flex items-center mb-2">
              <span class="text-3xl font-bold text-indigo-600 mr-3">{{ result.personalYear.number }}</span>
              <div>
                <h4 class="font-semibold text-gray-800">{{ result.personalYear.theme }}</h4>
                <div class="mt-2">
                  <h5 class="text-sm font-semibold text-gray-800">Trọng tâm:</h5>
                  <ul class="list-disc pl-5 text-gray-700 text-sm">
                    <li v-for="focus in (Array.isArray(result.personalYear.focus) ? result.personalYear.focus : result.personalYear.focus.split(', '))" :key="focus">{{ focus }}</li>
                  </ul>
                </div>
                <div class="mt-2">
                  <h5 class="text-sm font-semibold text-gray-800">Từ khóa:</h5>
                  <ul class="list-disc pl-5 text-gray-700 text-sm">
                    <li v-for="keyword in (Array.isArray(result.personalYear.keywords) ? result.personalYear.keywords : result.personalYear.keywords.split(', '))" :key="keyword">{{ keyword }}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <!-- Tính cách -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-purple-900 mb-4 flex items-center">
              <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Tính cách của bé
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.personalityTraits }}</p>
          </div>

          <!-- Tiềm năng -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Tiềm năng của bé
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.potential }}</p>
          </div>

          <!-- Thách thức -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-orange-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Thách thức của bé
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.challenges }}</p>
          </div>

          <!-- Ngắn hạn -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-purple-900 mb-4 flex items-center">
              <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Ngắn hạn (Tháng {{ currentMonthVietnamese }})
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.shortTerm }}</p>
          </div>

          <!-- Trung hạn -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Trung hạn (Năm {{ currentYear }})
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.mediumTerm }}</p>
          </div>

          <!-- Dài hạn -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 class="text-xl font-bold text-indigo-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Dài hạn (Tương lai xa)
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.longTerm }}</p>
          </div>

          <!-- Bản đồ 10 năm tới (Chart) -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-purple-900 mb-4 flex items-center">
              <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553-2.276A1 1 0 0021 13.382V6.618a1 1 0 00-1.447-.894L15 8m0 9V4m0 13l-6-3" />
              </svg>
              Bản đồ 10 năm tới
            </h3>
            <ClientOnly>
              <div class="w-full h-80 relative">
                <canvas ref="chartCanvas" id="tenYearChart"></canvas>
              </div>
            </ClientOnly>
          </div>

          <!-- Nút chia sẻ -->
          <!-- <div class="flex flex-wrap gap-3 justify-center">
            <button @click="shareResult('facebook')" class="btn-share bg-blue-600 hover:bg-blue-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
              Chia sẻ Facebook
            </button>
            <button @click="shareResult('zalo')" class="btn-share bg-blue-500 hover:bg-blue-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
              </svg>
              Chia sẻ Zalo
            </button>
            <ClientOnly>
              <button @click="downloadResult" class="btn-share bg-gray-600 hover:bg-gray-700">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Tải PDF
              </button>
            </ClientOnly>
          </div> -->
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { toast } from 'vue3-toastify';
import { drawDOM, exportPDF } from '@progress/kendo-drawing';
import Chart from 'chart.js/auto';

definePageMeta({ layout: 'view' });

const formData = ref({
  childName: '',
  birthDate: ''
});

const result = ref(null);
const loading = ref(false);
const chartCanvas = ref(null);
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentMonthVietnamese = computed(() => {
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  return months[currentMonth];
});

const analyzeChild = async () => {
  if (!formData.value.childName) return toast.error('Vui lòng nhập họ và tên bé!', { position: 'top-center' });
  if (!formData.value.birthDate) return toast.error('Vui lòng nhập ngày sinh bé!', { position: 'top-center' });

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/child', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: formData.value
    });
    result.value = response.childAnalysis;
    toast.success('Phân tích hoàn tất!', { position: 'top-center' });
    setTimeout(() => renderChart(), 100); // Vẽ chart sau khi có dữ liệu
  } catch (error) {
    console.error('Error analyzing child:', error);
    toast.error(error.data?.message || 'Có lỗi xảy ra!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

// Vẽ biểu đồ
const renderChart = () => {
  if (!result.value || !result.value.tenYearMap || !chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext('2d');
  if (!ctx) return;

  const years = result.value.tenYearMap.map(y => y.year);
  const numbers = result.value.tenYearMap.map(y => y.personalYear);

  new Chart(ctx, {
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
              const yearData = result.value.tenYearMap[context.dataIndex];
              return [
                `Số: ${yearData.personalYear}`,
                `Chủ đề: ${yearData.theme}`,
                `Lời khuyên: ${yearData.advice}`
              ];
            }
          }
        }
      }
    }
  });
};


// Vẽ biểu đồ khi component được mount
onMounted(() => {
  if (result.value && result.value.tenYearMap) {
    renderChart();
  }
});
</script>

<style scoped>
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: opacity 0.5s, transform 0.5s;
}
.fade-slide-enter-from, .fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.form-label {
  @apply block text-gray-700 font-medium mb-1;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200;
}

.btn-primary {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 shadow-md font-medium;
}

.btn-share {
  @apply text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm;
}
</style>