<template>
  <div class="min-h-screen from-blue-50 to-white py-8  sm:px-6">
    <!-- Header với background gradient -->
   <div class="relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-8 rounded-2xl shadow-xl overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
      <div class="relative z-10">
        <h1 class="text-4xl font-bold mb-2 animate-fade-in">Chào mừng đến với Thần số học</h1>
        <p class="text-lg opacity-90 mb-4">Khám phá năng lượng và hành trình của bạn qua con số!</p>
        
      </div>
    </div>

    <!-- Form nhập liệu -->
    <div class="container mx-auto bg-white rounded-xl shadow-md overflow-hidden mb-10 transition-all duration-300 hover:shadow-lg mt-3">
      <div class="p-6 sm:p-8">
        <form @submit.prevent="fetchNumerology" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
              <div class="relative">
                <input
                  v-model="name"
                  id="name"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
              <div class="relative">
                <input
                  v-model="birthDate"
                  id="birthDate"
                  type="text"
                  placeholder="DD/MM/YYYY"
                  pattern="\d{2}/\d{2}/\d{4}"
                  title="Định dạng: DD/MM/YYYY (ví dụ: 20/05/1988)"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                  required
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-md transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none"
          >
            <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {{ isLoading ? 'Đang phân tích...' : 'Xem kết quả' }}
          </button>
          <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>
        </form>
      </div>
    </div>

    <!-- Kết quả -->
    <div v-if="numerologyData && numerologyData.numerology" class="max-w-4xl mx-auto space-y-6">
      <!-- Profile header -->
      <div class="bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-6 sm:p-8 text-center bg-gradient-to-r from-blue-50 to-purple-50">
          <div class="inline-block relative">
  <!-- Nền không gian vũ trụ -->
  <div class="space-background w-64 h-64 rounded-full relative flex items-center justify-center">
    <!-- Số Đường đời -->
    <div class="glow-number">{{ numerologyData.numerology.profile.numbers.lifePath }}</div>
  </div>
</div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 mt-3">{{ numerologyData.numerology.name }}</h2>
          <p class="text-gray-600">Ngày sinh: {{ numerologyData.numerology.birthDate }}</p>
          <!-- <p class="text-sm text-gray-500 mt-2">Thời gian xử lý: {{ numerologyData.meta.processedIn }}</p> -->
        </div>
      </div>


      <!-- Tổng quan -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Tổng quan
        </h3>
        <div class="space-y-4">
  <!-- Cốt lõi - Màu xanh dương -->
        <div class="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-blue-700">Cốt lõi</h4>
          </div>
          <p class="text-gray-700 pl-11">{{ numerologyData.numerology.profile.overview.core }}</p>
        </div>

        <!-- Tương lai gần - Màu xanh lá -->
        <div class="p-4 bg-green-50 rounded-lg border-l-4 border-green-400 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-green-700">Tương lai gần</h4>
          </div>
          <p class="text-gray-700 pl-11">{{ numerologyData.numerology.profile.overview.nearFuture }}</p>
        </div>

        <!-- Thách thức và sức mạnh - Màu cam -->
        <div class="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-400 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-orange-700">Thách thức & Sức mạnh</h4>
          </div>
          <p class="text-gray-700 pl-11">{{ numerologyData.numerology.profile.overview.challengesAndStrengths }}</p>
        </div>

        <!-- Mục tiêu dài hạn - Màu tím -->
        <div class="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-400 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-purple-700">Mục tiêu dài hạn</h4>
          </div>
          <p class="text-gray-700 pl-11">{{ numerologyData.numerology.profile.overview.longTermGoals }}</p>
        </div>

        <!-- Cách người khác nhìn bạn - Màu chàm -->
        <div class="p-4 bg-indigo-50 rounded-lg border-l-4 border-indigo-400 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-indigo-700">Cách người khác nhìn bạn</h4>
          </div>
          <p class="text-gray-700 pl-11">{{ numerologyData.numerology.profile.overview.perception }}</p>
        </div>

        <!-- Công cụ hỗ trợ - Màu hồng -->
        <div class="p-4 bg-pink-50 rounded-lg border-l-4 border-pink-400 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div class="flex items-center mb-2">
            <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center mr-3">
              <svg class="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
            </div>
            <h4 class="font-semibold text-pink-700">Công cụ hỗ trợ</h4>
          </div>
          <p class="text-gray-700 pl-11">{{ numerologyData.numerology.profile.overview.tools }}</p>
        </div>
      </div>
      </div>

      <!-- Giải thích chi tiết -->
      <div class="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div class="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <h3 class="text-xl font-bold text-gray-800">Giải thích chi tiết các chỉ số</h3>
        </div>
        <div class="divide-y divide-gray-200">
          <div 
            v-for="(interpretation, key) in numerologyData.numerology.profile.interpretations" 
            :key="key"
            class="p-6 hover:bg-gray-50 transition-colors duration-200"
          >
            <div class="flex items-start">
              <div class="flex-shrink-0 bg-indigo-100 text-indigo-600 rounded-md p-2 mr-4">
                <span class="font-bold">{{ numerologyData.numerology.profile.numbers[key] }}</span>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-800 mb-1">{{ formatKey(key) }}</h4>
                <p class="text-gray-600">{{ interpretation }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'dashboard'
});

// State
const name = ref('');
const birthDate = ref('');
const numerologyData = ref(null);
const isLoading = ref(false);
const error = ref('');

// Ánh xạ key tiếng Anh sang tên tiếng Việt
const keyMap = {
  lifePath: 'Số Đường đời',
  expression: 'Số Vận mệnh',
  soulUrge: 'Số Linh hồn',
  personality: 'Số Nhân cách',
  attitude: 'Số Thái độ',
  birthDay: 'Số Ngày sinh',
  personalYear: 'Số Năm cá nhân',
  personalMonth: 'Số Tháng cá nhân',
  personalDay: 'Số Ngày cá nhân',
  mission: 'Số Sứ mệnh',
  challenge: 'Số Thử thách',
  generation: 'Số Thế hệ',
  balance: 'Số Cân bằng',
  creative: 'Số Sáng tạo',
  maturity: 'Số Trưởng thành',
  power: 'Số Năng lượng',
  subconsciousSelf: 'Số Tiềm thức'
};

// Các chỉ số chính để hiển thị nổi bật
const mainNumbers = computed(() => {
  if (!numerologyData.value?.numerology?.profile) return [];
  
  const profile = numerologyData.value.numerology.profile;
  return [
    { 
      label: 'Số Đường đời', 
      value: profile.numbers.lifePath,
      interpretation: profile.interpretations.lifePath
    },
    { 
      label: 'Số Vận mệnh', 
      value: profile.numbers.expression,
      interpretation: profile.interpretations.expression
    },
    { 
      label: 'Số Linh hồn', 
      value: profile.numbers.soulUrge,
      interpretation: profile.interpretations.soulUrge
    }
  ];
});

// Hàm định dạng key sang tiếng Việt
const formatKey = (key) => {
  return keyMap[key] || key;
};

// Hàm preload hình nền
const preloadImage = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = url;
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Không thể tải hình nền: ${url}`));
  });
};

// Hàm gọi API và preload hình nền
const fetchNumerology = async () => {
  isLoading.value = true;
  error.value = '';
  numerologyData.value = null;

  try {
    // Preload hình nền ngay khi nhấn nút
    const preloadPromise = preloadImage('/numerology-background.jpg');

    // Gọi API
    const response = await fetch('/api/overview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name.value.trim(),
        birthDate: birthDate.value.trim()
      })
    });

    if (!response.ok) {
      throw new Error(`API trả về lỗi: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();

    // Đợi cả API và preload hình nền hoàn tất
    await Promise.all([preloadPromise]);

    if (data) {
      numerologyData.value = data;
    } else {
      throw new Error('Response rỗng hoặc không hợp lệ');
    }
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi gọi API. Vui lòng thử lại.';
    console.error('Lỗi:', err);
  } finally {
    isLoading.value = false;
  }
};

// Hàm tải PDF (nếu bạn vẫn dùng)
const downloadPDF = async () => {
  const { default: jsPDF } = await import('jspdf');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  pdf.setFontSize(16);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Thần Số Học - Kết Quả Phân Tích', 105, 20, { align: 'center' });

  pdf.setFontSize(12);
  pdf.text(`Họ và tên: ${numerologyData.value.numerology.name}`, 20, 40);
  pdf.text(`Ngày sinh: ${numerologyData.value.numerology.birthDate}`, 20, 50);

  pdf.setFontSize(40);
  pdf.setTextColor(138, 43, 226);
  pdf.text(`${numerologyData.value.numerology.profile.numbers.lifePath}`, 105, 80, { align: 'center' });

  pdf.setFontSize(14);
  pdf.setTextColor(33, 33, 33);
  pdf.text('Tổng quan', 20, 100);
  pdf.setFontSize(12);
  const overviewLines = pdf.splitTextToSize(numerologyData.value.numerology.profile.overview, 170);
  pdf.text(overviewLines, 20, 110);

  let yPosition = 110 + overviewLines.length * 7 + 10;
  pdf.setFontSize(14);
  pdf.text('Giải thích chi tiết các chỉ số', 20, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  for (const [key, interpretation] of Object.entries(numerologyData.value.numerology.profile.interpretations)) {
    const number = numerologyData.value.numerology.profile.numbers[key];
    const title = `${formatKey(key)}: ${number}`;
    pdf.setFontSize(14);
    pdf.setTextColor(138, 43, 226);
    pdf.text(title, 20, yPosition);
    yPosition += 7;

    pdf.setFontSize(12);
    pdf.setTextColor(33, 33, 33);
    const interpretationLines = pdf.splitTextToSize(interpretation, 170);
    pdf.text(interpretationLines, 20, yPosition);
    yPosition += interpretationLines.length * 6 + 5;

    if (yPosition > 260) {
      pdf.addPage();
      yPosition = 20;
    }
  }

  pdf.save(`${numerologyData.value.numerology.name}_than_so_hoc.pdf`);
};
</script>

<style scoped>
/* Animation */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Áp dụng animation cho các phần tử kết quả */
.bg-white {
  animation: fadeIn 0.5s ease-out forwards;
}

/* Delay animation cho các items */
.grid > div:nth-child(1) { animation-delay: 0.1s; }
.grid > div:nth-child(2) { animation-delay: 0.2s; }
.grid > div:nth-child(3) { animation-delay: 0.3s; }
/* Nền không gian vũ trụ */
/* Nền không gian vũ trụ */
/* Nền không gian vũ trụ */
.space-background {
  background-image: url('/numerology-background.jpg'); /* Hình nền mới */
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(75, 0, 130, 0.5);
}

/* Hiệu ứng glow cho số */
.glow-number {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 
               0 0 40px rgba(138, 43, 226, 0.8),
               0 0 60px rgba(75, 0, 130, 0.7),
               0 0 80px rgba(0, 191, 255, 0.5);
  color: white;
  font-size: 6rem;
  font-weight: 900;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Căn giữa chính xác */
  z-index: 10;
}

/* Hiệu ứng nhấp nháy cho ngôi sao */
@keyframes starFade {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>