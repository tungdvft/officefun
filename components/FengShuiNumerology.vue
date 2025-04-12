<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header với gradient -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Số học phong thủy</h2>
          <p class="text-purple-100 mt-1">Khám phá phong thủy phù hợp với vận mệnh của bạn</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form nhập liệu -->
      <div class="bg-gray-50 p-5 rounded-xl border border-gray-200">
        <label for="birthDate" class="form-label">Ngày sinh của bạn (dd/mm/yyyy)</label>
        <div class="relative">
          <input
            v-model="birthDate"
            type="text"
            id="birthDate"
            placeholder="Nhập ngày sinh, ví dụ: 15/08/1995"
            class="form-input pl-10"
          />
          <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg> -->
        </div>
      </div>

      <button
        @click="generateFengShui"
        :disabled="loading"
        class="w-full btn-primary"
      >
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else class="flex items-center justify-center">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Xem phong thủy
        </span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="fengShuiData" class="mt-6 space-y-6">
          <!-- Thông tin cơ bản -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Số chủ đạo
              </h3>
              <div class="flex items-center">
                <span class="text-4xl font-bold text-purple-600 mr-4">{{ fengShuiData.lifePath }}</span>
                <p class="text-gray-700">{{ fengShuiData.lifePathDesc }}</p>
              </div>
            </div>

            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
                Ngũ hành
              </h3>
              <div class="flex items-center">
                <span class="text-4xl font-bold" :class="elementColorClass">{{ fengShuiData.element }}</span>
                <p class="text-gray-700 ml-4">{{ fengShuiData.elementDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Màu sắc hợp mệnh -->
          <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
              <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              Màu sắc hợp mệnh
            </h3>
            <div class="flex flex-wrap gap-3">
              <span 
                v-for="(color, index) in fengShuiData.colors" 
                :key="index"
                class="px-3 py-1.5 rounded-full text-sm font-medium"
                :class="colorClass(color)"
              >
                {{ color }}
              </span>
            </div>
          </div>

          <!-- Hướng và vật phẩm -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Hướng tốt nhất
              </h3>
              <p class="text-gray-700">{{ fengShuiData.direction }}</p>
              <p class="text-gray-500 text-sm mt-2">{{ fengShuiData.directionDesc }}</p>
            </div>

            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-purple-700 mb-3 flex items-center">
                <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Vật phẩm phong thủy
              </h3>
              <ul class="list-disc pl-5 space-y-1">
                <li v-for="(item, index) in fengShuiData.items" :key="index" class="text-gray-700">
                  {{ item }}
                </li>
              </ul>
            </div>
          </div>

          <!-- Phân tích chi tiết -->
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-900 mb-4">Phân tích phong thủy</h3>
            <div class="prose prose-purple max-w-none">
              <p class="whitespace-pre-wrap">{{ fengShuiData.analysis }}</p>
            </div>
          </div>

          <!-- Nút chia sẻ -->
          <div class="flex flex-wrap gap-3 justify-center">
            <button @click="shareResult('zalo')" class="btn-share bg-blue-500 hover:bg-blue-600">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm4.441 16.892c-2.102.144-6.784.144-8.883 0-2.276-.156-2.541-1.27-2.558-4.892.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0 2.277.156 2.541 1.27 2.559 4.892-.018 3.629-.285 4.736-2.559 4.892zm-6.441-7.234l4.917 2.338-4.917 2.346v-4.684z"/>
              </svg>
              Chia sẻ Zalo
            </button>
            <button @click="shareResult('facebook')" class="btn-share bg-blue-600 hover:bg-blue-700">
              <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
              </svg>
              Chia sẻ Facebook
            </button>
            <ClientOnly>
              <button @click="downloadResult" class="btn-share bg-gray-600 hover:bg-gray-700">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                </svg>
                Tải kết quả
              </button>
            </ClientOnly>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { toast } from 'vue3-toastify';

const birthDate = ref('');
const fengShuiData = ref(null);
const loading = ref(false);

const elementColorClass = computed(() => {
  if (!fengShuiData.value) return '';
  const element = fengShuiData.value.element.toLowerCase();
  switch(element) {
    case 'kim': return 'text-gray-500';
    case 'mộc': return 'text-green-600';
    case 'thủy': return 'text-blue-600';
    case 'hỏa': return 'text-red-600';
    case 'thổ': return 'text-yellow-600';
    default: return 'text-purple-600';
  }
});

const colorClass = (color) => {
  const colorMap = {
    'Vàng': 'bg-yellow-100 text-yellow-800',
    'Trắng': 'bg-gray-100 text-gray-800',
    'Xanh lá': 'bg-green-100 text-green-800',
    'Xanh dương': 'bg-blue-100 text-blue-800',
    'Đỏ': 'bg-red-100 text-red-800',
    'Tím': 'bg-purple-100 text-purple-900',
    'Hồng': 'bg-pink-100 text-pink-800',
    'Đen': 'bg-gray-800 text-white',
    'Nâu': 'bg-yellow-800 text-white'
  };
  return colorMap[color] || 'bg-gray-100 text-gray-800';
};

const generateFengShui = async () => {
  if (!birthDate.value) {
    toast.error('Vui lòng nhập ngày sinh!');
    return;
  }

  loading.value = true;
  try {
    const response = await $fetch('/api/numerology/fengshui', {
      method: 'POST',
      body: { birthDate: birthDate.value },
    });

    fengShuiData.value = response.fengshui;
    toast.success('Phân tích phong thủy hoàn tất!');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Không thể tạo phân tích!');
  } finally {
    loading.value = false;
  }
};

const shareResult = (platform) => {
  toast.success(`Đã chia sẻ qua ${platform === 'zalo' ? 'Zalo' : 'Facebook'}!`);
};

const downloadResult = () => {
  toast.success('Đã tải kết quả thành công!');
};
</script>

<style>
/* Animation */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

/* Form styles */
.form-label {
  @apply block text-gray-700 font-medium mb-1.5 text-sm;
}

.form-input {
  @apply w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-200 text-sm;
}

.btn-primary {
  @apply bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 shadow-md font-medium text-sm;
}

.btn-share {
  @apply text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 text-sm;
}

/* Prose style for content */
.prose-purple strong {
  @apply text-purple-600 font-semibold;
}
</style>