<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Giải Đáp Thắc Mắc - Thần Số Học</h2>
        <p class="text-gray-600">Hỏi đáp dựa trên năng lượng số của bạn</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin và câu hỏi</h3>
          <!-- Input Form for Name and Birth Date in Two Columns -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="Ví dụ: Nguyễn Văn A"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
            <div>
              <label for="birthDate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY)</label>
              <input
                v-model="formData.birthDate"
                type="text"
                id="birthDate"
                placeholder="Ví dụ: 15/03/1995"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
              />
            </div>
          </div>
          <!-- Question Input -->
          <div>
            <label for="question" class="block text-sm font-medium text-gray-700 mb-2">Câu hỏi của bạn</label>
            <textarea
              v-model="formData.question"
              id="question"
              placeholder="Ví dụ: Tôi có nên học thạc sĩ trong năm nay không?"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition h-24 resize-none"
            ></textarea>
          </div>
          <div class="flex justify-center">
            <button
              @click="consult"
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
                Đang xử lý...
              </span>
              <span v-else>Gửi câu hỏi</span>
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="result" class="mt-8 space-y-6">
            <!-- Số chủ đạo -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-purple-800">
                    Số chủ đạo: <span class="text-2xl font-bold">{{ result.lifePath }}</span>
                  </h3>
                  <p class="text-gray-600 mt-1">{{ result.lifePathDesc }}</p>
                </div>
              </div>
            </div>

            <!-- Số năm cá nhân -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <div class="flex items-center">
                <div class="bg-purple-100 p-2 rounded-lg mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 text-purple-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-purple-800">
                    Số năm cá nhân {{ currentYear }}: <span class="text-2xl font-bold">{{ result.personalYear }}</span>
                  </h3>
                  <p class="text-gray-600 mt-1">{{ result.personalYearDesc }}</p>
                </div>
              </div>
            </div>

            <!-- Phân tích -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-medium text-purple-700 flex items-center">
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
                Phân tích tổng quan
              </h3>
              <p class="text-gray-600 mt-2">{{ result.analysis }}</p>
            </div>

            <!-- Cơ hội -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fill-rule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Cơ hội
              </h3>
              <p class="text-gray-600 mt-2">{{ result.opportunities }}</p>
            </div>

            <!-- Thách thức -->
            <div class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 class="font-medium text-purple-700 flex items-center">
                <span class="bg-purple-100 rounded-full p-2 mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 w-5 text-purple-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M7 2a1 1 0 00-.707 1.707L7 4.414v3.758a1 1 0 01-.293.707l-4 4C.817 14.769 2.156 18 4.828 18h10.343c2.673 0 4.012-3.231 2.122-5.121l-4-4A1 1 0 0113 8.172V4.414l.707-.707A1 1 0 0013 2H7zm2 6.172V4h2v4.172a3 3 0 00.879 2.12l1.027 1.028a4 4 0 00-2.171.102l-.47.156a4 4 0 01-2.53 0l-.563-.187a1.993 1.993 0 00-.114-.035l1.063-1.063A3 3 0 009 8.172z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </span>
                Thách thức
              </h3>
              <p class="text-gray-600 mt-2">{{ result.challenges }}</p>
            </div>

            <!-- Lời khuyên -->
            <div class="bg-gradient-to-r from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-100">
              <h3 class="font-medium text-purple-700 flex items-center">
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
                Lời khuyên
              </h3>
              <p class="text-gray-600 mt-2">{{ result.advice }}</p>
            </div>

            <!-- Nút chia sẻ -->
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import { drawDOM, exportPDF } from '@progress/kendo-drawing';

definePageMeta({ layout: 'view' });

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
      <h1 style="font-size: 18pt; color: #1E40AF; margin-bottom: 10mm;">Giải đáp thắc mắc - ${formData.value.name}</h1>
      <div style="margin-bottom: 5mm;">
        <strong>Họ và tên:</strong> ${formData.value.name}<br>
        <strong>Ngày sinh:</strong> ${formData.value.birthDate}<br>
        <strong>Câu hỏi:</strong> ${formData.value.question}
      </div>
      <h2 style="font-size: 14pt; color: #6B46C1; margin: 5mm 0;">Số chủ đạo: ${result.value.lifePath}</h2>
      <p>${result.value.lifePathDesc}</p>
      <h2 style="font-size: 14pt; color: #6B46C1; margin: 5mm 0;">Số năm cá nhân ${currentYear}: ${result.value.personalYear}</h2>
      <p>${result.value.personalYearDesc}</p>
      <h2 style="font-size: 14pt; color: #6B46C1; margin: 5mm 0;">Phân tích tổng quan</h2>
      <p>${result.value.analysis}</p>
      <h2 style="font-size: 14pt; color: #6B46C1; margin: 5mm 0;">Cơ hội</h2>
      <p>${result.value.opportunities}</p>
      <h2 style="font-size: 14pt; color: #6B46C1; margin: 5mm 0;">Thách thức</h2>
      <p>${result.value.challenges}</p>
      <h2 style="font-size: 14pt; color: #6B46C1; margin: 5mm 0;">Lời khuyên</h2>
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