<template>
  <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white py-8 px-4 sm:px-6">
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
              <!-- Lớp overlay ánh sáng vũ trụ (nebula) -->
              <div class="nebula-overlay"></div>
              <!-- Hiệu ứng hạt bụi vũ trụ -->
              <div class="cosmic-particles"></div>
              <!-- Vòng tròn mandala -->
              <div class="mandala-circle"></div>
              <!-- Các đường nét phát sáng -->
              <div class="mandala-lines"></div>
              <!-- Hiệu ứng ngôi sao -->
              <div class="stars-overlay"></div>
              <!-- Số Đường đời -->
              <div class="glow-number">{{ numerologyData.numerology.profile.numbers.lifePath }}</div>
            </div>
          </div>
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-800 mb-1 mt-3">{{ numerologyData.numerology.name }}</h2>
          <p class="text-gray-600">Ngày sinh: {{ numerologyData.numerology.birthDate }}</p>
          <!-- <p class="text-sm text-gray-500 mt-2">Thời gian xử lý: {{ numerologyData.meta.processedIn }}</p> -->
        </div>
      </div>

      <!-- Các chỉ số chính -->
      <!-- <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="(number, key) in mainNumbers" 
          :key="key"
          class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
        >
          <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 bg-blue-100 text-blue-600 rounded-lg p-3">
              <span class="text-xl font-bold">{{ number.value }}</span>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-gray-800 mb-1">{{ number.label }}</h3>
              <p class="text-gray-600 text-sm">{{ number.interpretation }}</p>
            </div>
          </div>
        </div>
      </div> -->

      <!-- Tổng quan -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          Tổng quan
        </h3>
        <p class="text-gray-700">{{ numerologyData.numerology.profile.overview }}</p>
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
function formatKey(key) {
  return keyMap[key] || key;
}

// Hàm gọi API
async function fetchNumerology() {
  isLoading.value = true;
  error.value = '';
  numerologyData.value = null;

  try {
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

    if (data) {
      numerologyData.value = data;
    } else {
      throw new Error('Response rỗng hoặc không hợp lệ');
    }
  } catch (err) {
    error.value = err.message || 'Có lỗi xảy ra khi gọi API. Vui lòng thử lại.';
    console.error('Lỗi khi gọi API:', err);
  } finally {
    isLoading.value = false;
  }
}
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
.space-background {
  background-image: url('https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  animation: spaceTwinkle 10s infinite ease-in-out;
  box-shadow: 0 0 40px rgba(75, 0, 130, 0.5); /* Thêm bóng tím đậm */
}

/* Hiệu ứng nhấp nháy không gian */
@keyframes spaceTwinkle {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}

/* Lớp overlay ánh sáng vũ trụ (nebula) */
.nebula-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(75, 0, 130, 0.3), transparent 70%);
  opacity: 0.6;
  z-index: 3;
  animation: nebulaGlow 15s infinite ease-in-out;
}

/* Hiệu ứng ánh sáng vũ trụ */
@keyframes nebulaGlow {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 0.9; }
}

/* Hiệu ứng hạt bụi vũ trụ */
.cosmic-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 4;
  overflow: hidden;
}

.cosmic-particles::before,
.cosmic-particles::after {
  content: '';
  position: absolute;
  width: 2px;
  height: 2px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  box-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
  animation: particleFloat 5s infinite linear;
}

.cosmic-particles::before {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.cosmic-particles::after {
  top: 70%;
  left: 60%;
  animation-delay: 2s;
}

/* Hiệu ứng hạt bụi trôi nổi */
@keyframes particleFloat {
  0% { transform: translate(0, 0); opacity: 0.8; }
  50% { opacity: 0.3; }
  100% { transform: translate(50px, 50px); opacity: 0; }
}

/* Hiệu ứng glow cho số */
.glow-number {
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 
               0 0 40px rgba(138, 43, 226, 0.8), /* Tím đậm */
               0 0 60px rgba(75, 0, 130, 0.7), /* Tím rất đậm */
               0 0 80px rgba(0, 191, 255, 0.5); /* Xanh lam đậm */
  color: white;
  font-size: 6rem;
  font-weight: 900;
  position: relative;
  z-index: 10;
  animation: glowPulse 2s infinite ease-in-out;
}

/* Hiệu ứng nhấp nháy cho số */
@keyframes glowPulse {
  0%, 100% { text-shadow: 0 0 20px rgba(255, 255, 255, 0.9), 0 0 40px rgba(138, 43, 226, 0.8), 0 0 60px rgba(75, 0, 130, 0.7), 0 0 80px rgba(0, 191, 255, 0.5); }
  50% { text-shadow: 0 0 30px rgba(255, 255, 255, 1), 0 0 50px rgba(138, 43, 226, 1), 0 0 80px rgba(75, 0, 130, 0.9), 0 0 100px rgba(0, 191, 255, 0.7); }
}

/* Vòng tròn mandala */
.mandala-circle {
  position: absolute;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(138, 43, 226, 0.2), transparent);
  border: 2px solid rgba(138, 43, 226, 0.7); /* Tím đậm */
  border-radius: 50%;
  box-shadow: 0 0 30px rgba(75, 0, 130, 0.5); /* Tím rất đậm */
  z-index: 5;
  animation: rotateMandala 20s linear infinite;
}

/* Hiệu ứng xoay chậm cho mandala */
@keyframes rotateMandala {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Họa tiết mandala */
.mandala-circle::before,
.mandala-circle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: transparent;
  border-radius: 50%;
  border: 1px dashed rgba(138, 43, 226, 0.5); /* Tím đậm */
  transform: translate(-50%, -50%) rotate(45deg);
}

.mandala-circle::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

/* Các đường nét phát sáng */
.mandala-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 8;
}

.mandala-lines::before,
.mandala-lines::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 80%;
  height: 1px;
  background: rgba(138, 43, 226, 0.7); /* Tím đậm */
  box-shadow: 0 0 15px rgba(75, 0, 130, 0.9); /* Tím rất đậm */
  transform: translate(-50%, -50%) rotate(30deg);
}

.mandala-lines::after {
  transform: translate(-50%, -50%) rotate(-30deg);
}

/* Hiệu ứng ngôi sao mờ ảo */
.stars-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.15), transparent);
  z-index: 2;
  animation: starFade 5s infinite ease-in-out;
}

/* Hiệu ứng nhấp nháy cho ngôi sao */
@keyframes starFade {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}
</style>