<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Thần Số Học Cho Trẻ Em</h2>
        <p class="text-gray-600">Phân tích toàn diện cho bé</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Thông tin của bé</h3>
          <!-- Input Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="childName" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên bé</label>
              <input
                v-model="formData.childName"
                type="text"
                id="childName"
                placeholder="Ví dụ: Nguyễn Minh Anh"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.childName ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.childName" class="text-red-600 text-sm mt-1">{{ errors.childName }}</p>
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY hoặc DD-MM-YYYY)</label>
              <input
                v-model="formData.birthDate"
                type="text"
                id="birthDate"
                placeholder="15/03/2018"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.birthDate ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.birthDate" class="text-red-600 text-sm mt-1">{{ errors.birthDate }}</p>
            </div>
          </div>
          <!-- Error Message -->
          <div v-if="errors.general" class="p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            {{ errors.general }}
          </div>
          <!-- Button -->
          <div class="flex justify-center">
            <button
              @click="analyzeChild"
              :disabled="loading"
              class="w-auto bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white py-3 px-8 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 shadow-md"
            >
              <span v-if="loading" class="flex items-center justify-center">
                <svg
                  class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Đang phân tích...
              </span>
              <span v-else>Phân tích ngay</span>
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="result" class="mt-8 space-y-6">
            <!-- Các con số chủ đạo -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Các con số chủ đạo
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-semibold text-gray-800 flex items-center">
                    <span class="mr-2 text-purple-600">{{ result.numbers.lifePath.symbol }}</span> Số Đường đời: {{ result.numbers.lifePath.number }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ result.numbers.lifePath.theme }}</p>
                  <div class="mt-2">
                    <h5 class="text-sm font-semibold text-gray-800">Điểm mạnh:</h5>
                    <ul class="list-disc pl-5 text-gray-600 text-sm">
                      <li v-for="strength in (Array.isArray(result.numbers.lifePath.strengths) ? result.numbers.lifePath.strengths : result.numbers.lifePath.strengths.split(', '))" :key="strength">{{ strength }}</li>
                    </ul>
                  </div>
                  <div class="mt-2">
                    <h5 class="text-sm font-semibold text-gray-800">Thách thức:</h5>
                    <ul class="list-disc pl-5 text-gray-600 text-sm">
                      <li v-for="challenge in (Array.isArray(result.numbers.lifePath.challenges) ? result.numbers.lifePath.challenges : result.numbers.lifePath.challenges.split(', '))" :key="challenge">{{ challenge }}</li>
                    </ul>
                  </div>
                </div>
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-semibold text-gray-800 flex items-center">
                    <span class="mr-2 text-purple-600">{{ result.numbers.soulUrge.symbol }}</span> Số Linh hồn: {{ result.numbers.soulUrge.number }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ result.numbers.soulUrge.desire }}</p>
                  <p class="text-sm text-gray-600 mt-1"><strong>Động lực:</strong> {{ result.numbers.soulUrge.motivation }}</p>
                </div>
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-semibold text-gray-800 flex items-center">
                    <span class="mr-2 text-purple-600">{{ result.numbers.personality.symbol }}</span> Số Nhân cách: {{ result.numbers.personality.number }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ result.numbers.personality.theme }}</p>
                  <div class="mt-2">
                    <h5 class="text-sm font-semibold text-gray-800">Điểm mạnh:</h5>
                    <ul class="list-disc pl-5 text-gray-600 text-sm">
                      <li v-for="strength in (Array.isArray(result.numbers.personality.strengths) ? result.numbers.personality.strengths : result.numbers.personality.strengths.split(', '))" :key="strength">{{ strength }}</li>
                    </ul>
                  </div>
                </div>
                <div class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                  <h4 class="font-semibold text-gray-800 flex items-center">
                    <span class="mr-2 text-purple-600">{{ result.numbers.destiny.symbol }}</span> Số Sứ mệnh: {{ result.numbers.destiny.number }}
                  </h4>
                  <p class="text-sm text-gray-600">{{ result.numbers.destiny.theme }}</p>
                  <div class="mt-2">
                    <h5 class="text-sm font-semibold text-gray-800">Tài năng:</h5>
                    <ul class="list-disc pl-5 text-gray-600 text-sm">
                      <li v-for="talent in (Array.isArray(result.numbers.destiny.talents) ? result.numbers.destiny.talents : result.numbers.destiny.talents.split(', '))" :key="talent">{{ talent }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Năm cá nhân -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Năm cá nhân {{ currentYear }}
              </h3>
              <div class="flex items-center mb-2 mt-4">
                <span class="text-3xl font-bold text-purple-600 mr-3">{{ result.personalYear.number }}</span>
                <div>
                  <h4 class="font-semibold text-gray-800">{{ result.personalYear.theme }}</h4>
                  <div class="mt-2">
                    <h5 class="text-sm font-semibold text-gray-800">Trọng tâm:</h5>
                    <ul class="list-disc pl-5 text-gray-600 text-sm">
                      <li v-for="focus in (Array.isArray(result.personalYear.focus) ? result.personalYear.focus : result.personalYear.focus.split(', '))" :key="focus">{{ focus }}</li>
                    </ul>
                  </div>
                  <div class="mt-2">
                    <h5 class="text-sm font-semibold text-gray-800">Từ khóa:</h5>
                    <ul class="list-disc pl-5 text-gray-600 text-sm">
                      <li v-for="keyword in (Array.isArray(result.personalYear.keywords) ? result.personalYear.keywords : result.personalYear.keywords.split(', '))" :key="keyword">{{ keyword }}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <!-- Tính cách -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </span>
                Tính cách của bé
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-wrap">{{ result.personalityTraits }}</p>
            </div>

            <!-- Tiềm năng -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-green-700 flex items-center">
                <span class="bg-green-100 rounded-full p-2 mr-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
                Tiềm năng của bé
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-wrap">{{ result.potential }}</p>
            </div>

            <!-- Thách thức -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-orange-700 flex items-center">
                <span class="bg-orange-100 rounded-full p-2 mr-2">
                  <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </span>
                Thách thức của bé
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-wrap">{{ result.challenges }}</p>
            </div>

            <!-- Ngắn hạn -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </span>
                Ngắn hạn (Tháng {{ currentMonthVietnamese }})
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-wrap">{{ result.shortTerm }}</p>
            </div>

            <!-- Trung hạn -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-green-700 flex items-center">
                <span class="bg-green-100 rounded-full p-2 mr-2">
                  <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                Trung hạn (Năm {{ currentYear }})
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-wrap">{{ result.mediumTerm }}</p>
            </div>

            <!-- Dài hạn -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </span>
                Dài hạn (Tương lai xa)
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-wrap">{{ result.longTerm }}</p>
            </div>

            <!-- Bản đồ 10 năm tới (Chart) -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="text-lg font-semibold text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553-2.276A1 1 0 0021 13.382V6.618a1 1 0 00-1.447-.894L15 8m0 9V4m0 13l-6-3" />
                  </svg>
                </span>
                Bản đồ 10 năm tới
              </h3>
              <ClientOnly>
                <div class="w-full h-80 relative">
                  <canvas ref="chartCanvas" id="tenYearChart"></canvas>
                </div>
              </ClientOnly>
            </div>

            <!-- Nút tải và chia sẻ -->
            <!-- <div class="flex flex-wrap gap-3 justify-center">
              <ClientOnly>
                <button
                  @click="downloadPDF"
                  class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Tải báo cáo PDF
                </button>
              </ClientOnly>
              <button
                @click="shareResult('zalo')"
                class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"
                  />
                </svg>
                Chia sẻ Zalo
              </button>
              <button
                @click="shareResult('facebook')"
                class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
              >
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
                Chia sẻ Facebook
              </button>
            </div> -->
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';
import Chart from 'chart.js/auto';

definePageMeta({ layout: 'view' });

const formData = ref({
  childName: '',
  birthDate: ''
});
const result = ref(null);
const loading = ref(false);
const chartCanvas = ref(null);
const errors = ref({
  childName: '',
  birthDate: '',
  general: ''
});
const currentYear = new Date().getFullYear();
const currentMonth = new Date().getMonth();
const currentMonthVietnamese = computed(() => {
  const months = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
  return months[currentMonth];
});

// Load saved data from localStorage on mount
onMounted(() => {
  const savedData = localStorage.getItem('childNumerologyData');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    formData.value = parsed.formData || {
      childName: '',
      birthDate: ''
    };
    result.value = parsed.result || null;
    if (result.value && result.value.tenYearMap) {
      setTimeout(() => renderChart(), 100);
    }
  }
});

// Save data to localStorage on change
watch([formData, result], () => {
  localStorage.setItem('childNumerologyData', JSON.stringify({
    formData: formData.value,
    result: result.value
  }));
}, { deep: true });

// Validate form
const validateForm = () => {
  errors.value = {
    childName: '',
    birthDate: '',
    general: ''
  };
  let isValid = true;

  if (!formData.value.childName.trim()) {
    errors.value.childName = 'Vui lòng nhập họ và tên bé';
    isValid = false;
  }
  if (!formData.value.birthDate.trim()) {
    errors.value.birthDate = 'Vui lòng nhập ngày sinh bé';
    isValid = false;
  } else if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(formData.value.birthDate)) {
    errors.value.birthDate = 'Vui lòng nhập ngày đúng định dạng DD/MM/YYYY hoặc DD-MM-YYYY';
    isValid = false;
  } else {
    const match = formData.value.birthDate.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
    const day = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const year = parseInt(match[3], 10);
    const date = new Date(year, month - 1, day);
    if (
      date.getDate() !== day ||
      date.getMonth() + 1 !== month ||
      date.getFullYear() !== year ||
      year < 1900 ||
      year > new Date().getFullYear()
    ) {
      errors.value.birthDate = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }

  return isValid;
};

const analyzeChild = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errors.value.general = '';
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/child', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: formData.value
    });
    result.value = response.childAnalysis;
    toast.success('Phân tích hoàn tất!', { position: 'top-center' });
    setTimeout(() => renderChart(), 100); // Vẽ chart sau khi có dữ liệu
  } catch (error) {
    console.error('Error analyzing child:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra!';
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

const shareResult = (platform) => {
  if (!result.value) return;
  const text = [
    `Thần số học cho bé ${formData.value.childName}`,
    `Ngày sinh: ${formData.value.birthDate}`,
    `Các con số chủ đạo:`,
    `- Số Đường đời: ${result.value.numbers.lifePath.number} (${result.value.numbers.lifePath.theme})`,
    `- Số Linh hồn: ${result.value.numbers.soulUrge.number} (${result.value.numbers.soulUrge.desire})`,
    `- Số Nhân cách: ${result.value.numbers.personality.number} (${result.value.numbers.personality.theme})`,
    `- Số Sứ mệnh: ${result.value.numbers.destiny.number} (${result.value.numbers.destiny.theme})`,
    `Năm cá nhân ${currentYear}: ${result.value.personalYear.number} (${result.value.personalYear.theme})`,
    `Tính cách: ${result.value.personalityTraits}`,
    `Tiềm năng: ${result.value.potential}`,
    `Thách thức: ${result.value.challenges}`,
    `Ngắn hạn (Tháng ${currentMonthVietnamese.value}): ${result.value.shortTerm}`,
    `Trung hạn (Năm ${currentYear}): ${result.value.mediumTerm}`,
    `Dài hạn: ${result.value.longTerm}`,
    `Bản đồ 10 năm tới:`,
    ...result.value.tenYearMap.map(y => `- ${y.year}: Số ${y.personalYear} (${y.theme})`)
  ].join('\n\n');

  if (platform === 'facebook' && process.client) {
    if (typeof FB !== 'undefined') {
      FB.ui({
        method: 'share',
        href: window.location.href,
        quote: text
      }, (response) => {
        if (response && !response.error) toast.success('Đã chia sẻ lên Facebook!');
        else toast.error('Có lỗi khi chia sẻ lên Facebook!');
      });
    } else {
      toast.error('Facebook SDK chưa tải, thử lại sau!');
    }
  } else if (platform === 'zalo' && process.client) {
    navigator.clipboard.writeText(text).then(() => {
      toast.success('Đã sao chép kết quả! Dán vào Zalo để chia sẻ.');
    }).catch(() => toast.error('Không thể sao chép!'));
  }
};

const downloadPDF = async () => {
  if (!process.client) return toast.error('Không thể tải PDF trên server!');
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(12);
  let y = 10;

  doc.setFontSize(16);
  doc.text(`Thần số học cho bé ${formData.value.childName}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Ngày sinh: ${formData.value.birthDate}`, 10, y); y += 7;
  y += 5;

  const addSection = (title, content) => {
    if (y > 260) { doc.addPage(); y = 10; }
    doc.setFontSize(14);
    doc.text(title, 10, y);
    y += 7;
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(content, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 10;
  };

  addSection('Các con số chủ đạo', [
    `Số Đường đời: ${result.value.numbers.lifePath.number} (${result.value.numbers.lifePath.theme})`,
    `Điểm mạnh: ${(Array.isArray(result.value.numbers.lifePath.strengths) ? result.value.numbers.lifePath.strengths : result.value.numbers.lifePath.strengths.split(', ')).join(', ')}`,
    `Thách thức: ${(Array.isArray(result.value.numbers.lifePath.challenges) ? result.value.numbers.lifePath.challenges : result.value.numbers.lifePath.challenges.split(', ')).join(', ')}`,
    `Số Linh hồn: ${result.value.numbers.soulUrge.number} (${result.value.numbers.soulUrge.desire})`,
    `Động lực: ${result.value.numbers.soulUrge.motivation}`,
    `Số Nhân cách: ${result.value.numbers.personality.number} (${result.value.numbers.personality.theme})`,
    `Điểm mạnh: ${(Array.isArray(result.value.numbers.personality.strengths) ? result.value.numbers.personality.strengths : result.value.numbers.personality.strengths.split(', ')).join(', ')}`,
    `Số Sứ mệnh: ${result.value.numbers.destiny.number} (${result.value.numbers.destiny.theme})`,
    `Tài năng: ${(Array.isArray(result.value.numbers.destiny.talents) ? result.value.numbers.destiny.talents : result.value.numbers.destiny.talents.split(', ')).join(', ')}`
  ].join('\n'));

  addSection(`Năm cá nhân ${currentYear}`, [
    `Số: ${result.value.personalYear.number} (${result.value.personalYear.theme})`,
    `Trọng tâm: ${(Array.isArray(result.value.personalYear.focus) ? result.value.personalYear.focus : result.value.personalYear.focus.split(', ')).join(', ')}`,
    `Từ khóa: ${(Array.isArray(result.value.personalYear.keywords) ? result.value.personalYear.keywords : result.value.personalYear.keywords.split(', ')).join(', ')}`
  ].join('\n'));

  addSection('Tính cách của bé', result.value.personalityTraits);
  addSection('Tiềm năng của bé', result.value.potential);
  addSection('Thách thức của bé', result.value.challenges);
  addSection(`Ngắn hạn (Tháng ${currentMonthVietnamese.value})`, result.value.shortTerm);
  addSection(`Trung hạn (Năm ${currentYear})`, result.value.mediumTerm);
  addSection('Dài hạn (Tương lai xa)', result.value.longTerm);

  doc.setFontSize(14);
  doc.text('Bản đồ 10 năm tới:', 10, y); y += 7;
  doc.setFontSize(12);
  result.value.tenYearMap.forEach(y => {
    if (y > 260) { doc.addPage(); y = 10; }
    const text = `${y.year}: Số ${y.personalYear} (${y.theme})`;
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 5;
  });

  doc.save(`child-numerology-${formData.value.childName}.pdf`);
};
</script>

<style scoped>
/* Custom transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>