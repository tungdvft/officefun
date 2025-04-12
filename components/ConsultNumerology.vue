<template>
  <div class="container mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="bg-gradient-to-r from-purple-600 to-indigo-600 p-6">
      <div class="flex items-center">
        <div class="p-3 rounded-full bg-white bg-opacity-20 mr-4">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <h2 class="text-2xl font-bold text-white">Giải đáp thắc mắc</h2>
          <p class="text-purple-100 mt-1">Hỏi đáp dựa trên thần số học</p>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Form -->
      <div class="bg-gray-50 p-5 rounded-lg border border-gray-200">
        <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin và câu hỏi</h3>
        <div class="space-y-4">
          <div>
            <label for="name" class="form-label">Họ và tên</label>
            <input v-model="formData.name" type="text" id="name" placeholder="Ví dụ: Nguyễn Văn A" class="form-input" />
          </div>
          <div>
            <label for="birthDate" class="form-label">Ngày sinh (dd/mm/yyyy hoặc dd-mm-yyyy)</label>
            <div class="relative">
              <input v-model="formData.birthDate" type="text" id="birthDate" placeholder="15/03/1995" class="form-input pl-10" />
              <!-- <svg class="absolute left-3 top-3.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg> -->
            </div>
          </div>
          <div>
            <label for="question" class="form-label">Câu hỏi của bạn</label>
            <textarea v-model="formData.question" id="question" placeholder="Ví dụ: Tôi có nên học thạc sĩ trong năm nay không?" class="form-input h-24 resize-none"></textarea>
          </div>
        </div>
      </div>

      <button @click="consult" :disabled="loading" class="w-full btn-primary">
        <span v-if="loading" class="flex items-center justify-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </span>
        <span v-else>Gửi câu hỏi</span>
      </button>

      <!-- Kết quả -->
      <transition name="fade-slide">
        <div v-if="result" class="mt-6 space-y-6">
          <!-- Số chủ đạo -->
          <div class="bg-purple-50 p-6 rounded-xl border border-purple-100">
            <h3 class="text-xl font-bold text-purple-900 mb-4">Số chủ đạo</h3>
            <div class="flex items-center mb-2">
              <span class="text-3xl font-bold text-purple-600 mr-3">{{ result.lifePath }}</span>
              <div>
                <h4 class="font-semibold text-gray-800">Đường đời</h4>
                <p class="text-sm text-gray-500">{{ result.lifePathDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Số năm cá nhân -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 class="text-xl font-bold text-indigo-800 mb-4">Số năm cá nhân {{ currentYear }}</h3>
            <div class="flex items-center mb-2">
              <span class="text-3xl font-bold text-indigo-600 mr-3">{{ result.personalYear }}</span>
              <div>
                <h4 class="font-semibold text-gray-800">Năng lượng năm</h4>
                <p class="text-sm text-gray-500">{{ result.personalYearDesc }}</p>
              </div>
            </div>
          </div>

          <!-- Phân tích -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-purple-900 mb-4 flex items-center">
              <svg class="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Phân tích tổng quan
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.analysis }}</p>
          </div>

          <!-- Cơ hội -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-green-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Cơ hội
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.opportunities }}</p>
          </div>

          <!-- Thách thức -->
          <div class="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 class="text-xl font-bold text-orange-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Thách thức
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.challenges }}</p>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
            <h3 class="text-xl font-bold text-indigo-800 mb-4 flex items-center">
              <svg class="w-6 h-6 text-indigo-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Lời khuyên
            </h3>
            <p class="text-gray-700 whitespace-pre-wrap">{{ result.advice }}</p>
          </div>

          <!-- Nút chia sẻ -->
          <div class="flex flex-wrap gap-3 justify-center">
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
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { drawDOM, exportPDF } from '@progress/kendo-drawing';

definePageMeta({ layout: 'dashboard' });

const formData = ref({
  name: '',
  birthDate: '',
  question: ''
});

const result = ref(null);
const loading = ref(false);
const currentYear = new Date().getFullYear();

const consult = async () => {
  if (!formData.value.name) return toast.error('Vui lòng nhập họ và tên!', { position: 'top-center' });
  if (!formData.value.birthDate) return toast.error('Vui lòng nhập ngày sinh!', { position: 'top-center' });
  if (!formData.value.question) return toast.error('Vui lòng nhập câu hỏi!', { position: 'top-center' });

  loading.value = true;
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/consult', {
      method: 'POST',
      headers: { 
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: formData.value
    });
    result.value = response.consult;
    toast.success('Giải đáp hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error consulting:', error);
    toast.error(error.data?.message || 'Có lỗi xảy ra!', { position: 'top-center' });
  } finally {
    loading.value = false;
  }
};

const shareResult = (platform) => {
  if (!result.value) return;
  const text = formatResultForShare();

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

const downloadResult = async () => {
  if (!process.client || !result.value) {
    toast.error('Vui lòng đợi kết quả hoàn tất trước khi tải');
    return;
  }

  try {
    const container = document.createElement('div');
    container.style.width = '210mm';
    container.style.padding = '15mm';
    container.style.fontFamily = 'Times New Roman, serif';
    container.style.fontSize = '12pt';
    container.style.lineHeight = '1.5';
    container.style.color = '#333';
    document.body.appendChild(container);

    container.innerHTML = `
      <h1 style="font-size: 18pt; color: #6B46C1; margin-bottom: 10mm;">Giải đáp thắc mắc - ${formData.value.name}</h1>
      <div style="margin-bottom: 5mm;">
        <strong>Họ và tên:</strong> ${formData.value.name}<br>
        <strong>Ngày sinh:</strong> ${formData.value.birthDate}<br>
        <strong>Câu hỏi:</strong> ${formData.value.question}
      </div>
      <h2 style="font-size: 14pt; color: #805AD5; margin: 5mm 0;">Số chủ đạo: ${result.value.lifePath}</h2>
      <p>${result.value.lifePathDesc}</p>
      <h2 style="font-size: 14pt; color: #805AD5; margin: 5mm 0;">Số năm cá nhân ${currentYear}: ${result.value.personalYear}</h2>
      <p>${result.value.personalYearDesc}</p>
      <h2 style="font-size: 14pt; color: #805AD5; margin: 5mm 0;">Phân tích tổng quan</h2>
      <p>${result.value.analysis}</p>
      <h2 style="font-size: 14pt; color: #805AD5; margin: 5mm 0;">Cơ hội</h2>
      <p>${result.value.opportunities}</p>
      <h2 style="font-size: 14pt; color: #805AD5; margin: 5mm 0;">Thách thức</h2>
      <p>${result.value.challenges}</p>
      <h2 style="font-size: 14pt; color: #805AD5; margin: 5mm 0;">Lời khuyên</h2>
      <p>${result.value.advice}</p>
    `;

    const group = await drawDOM(container, {
      paperSize: 'A4',
      margin: { top: '10mm', left: '10mm', right: '10mm', bottom: '10mm' },
      scale: 0.7,
      keepTogether: 'p'
    });

    const pdfDataUri = await exportPDF(group);
    const link = document.createElement('a');
    link.href = pdfDataUri;
    link.download = `giai-dap-thac-mac-${formData.value.name}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    document.body.removeChild(container);

    toast.success('Tải PDF thành công!');
  } catch (error) {
    console.error('Lỗi khi tạo PDF:', error);
    toast.error('Có lỗi khi tạo PDF!');
  }
};

const formatResultForShare = () => {
  return [
    `Giải đáp thắc mắc cho ${formData.value.name}`,
    `Ngày sinh: ${formData.value.birthDate}`,
    `Câu hỏi: ${formData.value.question}`,
    `Số chủ đạo: ${result.value.lifePath}`,
    result.value.lifePathDesc,
    `Số năm cá nhân ${currentYear}: ${result.value.personalYear}`,
    result.value.personalYearDesc,
    `Phân tích:\n${result.value.analysis}`,
    `Cơ hội:\n${result.value.opportunities}`,
    `Thách thức:\n${result.value.challenges}`,
    `Lời khuyên:\n${result.value.advice}`
  ].join('\n\n');
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