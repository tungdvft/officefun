<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Định hướng nghề nghiệp</h2>
          <p class="text-purple-100 mt-1">Khám phá nghề nghiệp phù hợp với tính cách và năng lực của bạn</p>
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
          <label for="birthdate" class="form-label">Ngày sinh (dd/mm/yyyy hoặc dd-mm-yyyy)</label>
          <div class="relative">
            <input v-model="formData.birthdate" type="text" id="birthdate" placeholder="15/03/1995" class="form-input pl-10" />
            <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg> -->
          </div>
        </div>
      </div>

      <div>
        <label for="currentJob" class="form-label">Công việc hiện tại (nếu có)</label>
        <input v-model="formData.currentJob" type="text" id="currentJob" placeholder="Ví dụ: Lập trình viên, Giáo viên..." class="form-input" />
      </div>

      <button @click="getCareerGuidance" :disabled="loading" class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang phân tích...
        </span>
        <span v-else>Xem định hướng nghề nghiệp</span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="result" class="mt-6 space-y-6">
          <!-- Tổng quan -->
          <div class="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-900 mb-4">Định hướng nghề nghiệp</h3>
            <div class="space-y-4">
              <div>
                <h4 class="text-lg font-semibold text-purple-700 flex items-center">
                  <svg class="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mục tiêu nghề nghiệp
                </h4>
                <p class="text-gray-700 whitespace-pre-wrap">{{ result.careerGoals }}</p>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-purple-700 flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Đam mê và động lực
                </h4>
                <p class="text-gray-700 whitespace-pre-wrap">{{ result.passionAndMotivation }}</p>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-purple-700 flex items-center">
                  <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M12 4v8m-8 8h16" />
                  </svg>
                  Phong cách làm việc
                </h4>
                <p class="text-gray-700 whitespace-pre-wrap">{{ result.workStyle }}</p>
              </div>
              <div>
                <h4 class="text-lg font-semibold text-purple-700 flex items-center">
                  <svg class="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Con đường dài hạn
                </h4>
                <p class="text-gray-700 whitespace-pre-wrap">{{ result.longTermPath }}</p>
              </div>
              <div v-if="formData.currentJob">
                <h4 class="text-lg font-semibold text-purple-700 flex items-center">
                  <svg class="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m0-2v-2m0-2V7m6 10v-2m0-2v-2m0-2V7m-9 10h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Phân tích công việc hiện tại
                </h4>
                <p class="text-gray-700 whitespace-pre-wrap">{{ result.currentJobAnalysis }}</p>
              </div>
            </div>
          </div>

          <!-- Đề xuất nghề nghiệp -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(suggestion, index) in result.careerSuggestions" :key="index" class="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
              <h4 class="text-lg font-semibold text-purple-700 mb-3">{{ suggestion.job }}</h4>
              <p class="text-gray-700 mb-2"><strong>Lý do phù hợp:</strong> {{ suggestion.reason }}</p>
              <p class="text-gray-700 mb-2"><strong>Cơ hội hiện tại:</strong> {{ suggestion.opportunities }}</p>
              <p class="text-gray-700"><strong>Xu hướng tương lai:</strong> {{ suggestion.trends }}</p>
            </div>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h4 class="text-lg font-semibold text-indigo-700 mb-3 flex items-center">
              <svg class="w-5 h-5 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lời khuyên thực tế
            </h4>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.practicalAdvice }}</p>
          </div>

          <!-- Nút chia sẻ -->
          <!-- <div class="flex flex-wrap gap-3 justify-center">
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
                Lưu PDF
              </button>
            </ClientOnly>
          </div> -->
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({ layout: 'view' });

const formData = ref({
  name: '',
  birthdate: '',
  currentJob: ''
});
const result = ref(null);
const loading = ref(false);

const getCareerGuidance = async () => {
  if (!formData.value.name) return toast.error('Vui lòng nhập họ và tên!', { position: 'top-center' });
  if (!formData.value.birthdate) return toast.error('Vui lòng nhập ngày sinh!', { position: 'top-center' });

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/career', {
      method: 'POST',
      headers: { 'x-username': encodeURIComponent(username) },
      body: formData.value
    });
    result.value = response;
    toast.success('Định hướng nghề nghiệp đã hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    toast.error(error.data?.message || 'Có lỗi xảy ra!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};


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