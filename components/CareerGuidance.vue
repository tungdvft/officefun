<template>
  <div class="bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
    <div class="container mx-auto p-4">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl md:text-4xl font-bold text-blue-800 mb-2">Định Hướng Nghề Nghiệp</h2>
        <p class="text-gray-600">Khám phá nghề nghiệp phù hợp với tính cách và năng lực của bạn</p>
      </div>

      <!-- Main Content -->
      <div class="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100">
        <!-- Form -->
        <div class="space-y-6">
          <h3 class="text-lg font-semibold text-purple-700 mb-4">Nhập thông tin cá nhân</h3>
          <!-- Input Form -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input
                v-model="formData.name"
                type="text"
                id="name"
                placeholder="Nguyễn Văn A"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.name ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.name" class="text-red-600 text-sm mt-1">{{ errors.name }}</p>
            </div>
            <div>
              <label for="birthdate" class="block text-sm font-medium text-gray-700 mb-2">Ngày sinh (DD/MM/YYYY hoặc DD-MM-YYYY)</label>
              <input
                v-model="formData.birthdate"
                type="text"
                id="birthdate"
                placeholder="15/03/1995"
                :class="['w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition', errors.birthdate ? 'border-red-500' : 'border-gray-300']"
              />
              <p v-if="errors.birthdate" class="text-red-600 text-sm mt-1">{{ errors.birthdate }}</p>
            </div>
          </div>
          <div>
            <label for="currentJob" class="block text-sm font-medium text-gray-700 mb-2">Công việc hiện tại (nếu có)</label>
            <input
              v-model="formData.currentJob"
              type="text"
              id="currentJob"
              placeholder="Ví dụ: Lập trình viên, Giáo viên..."
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            />
          </div>
          <!-- Error Message -->
          <div v-if="errors.general" class="p-4 bg-red-100 text-red-700 rounded-lg text-sm border border-red-200">
            {{ errors.general }}
          </div>
          <!-- Button -->
          <div class="flex justify-center">
            <button
              @click="getCareerGuidance"
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
              <span v-else>Xem định hướng nghề nghiệp</span>
            </button>
          </div>
        </div>

        <!-- Results Section -->
        <transition name="slide-fade">
          <div v-if="result" class="mt-8 space-y-6">
            <!-- Tổng quan -->
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
                Định hướng nghề nghiệp
              </h3>
              <div class="space-y-4 mt-4">
                <div>
                  <h4 class="text-base font-semibold text-purple-700 flex items-center">
                    <svg class="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mục tiêu nghề nghiệp
                  </h4>
                  <p class="text-gray-600 whitespace-pre-wrap">{{ result.careerGoals }}</p>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-purple-700 flex items-center">
                    <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Đam mê và động lực
                  </h4>
                  <p class="text-gray-600 whitespace-pre-wrap">{{ result.passionAndMotivation }}</p>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-purple-700 flex items-center">
                    <svg class="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 1.857h10M12 4v8m-8 8h16" />
                    </svg>
                    Phong cách làm việc
                  </h4>
                  <p class="text-gray-600 whitespace-pre-wrap">{{ result.workStyle }}</p>
                </div>
                <div>
                  <h4 class="text-base font-semibold text-purple-700 flex items-center">
                    <svg class="w-5 h-5 text-yellow-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Con đường dài hạn
                  </h4>
                  <p class="text-gray-600 whitespace-pre-wrap">{{ result.longTermPath }}</p>
                </div>
                <div v-if="formData.currentJob">
                  <h4 class="text-base font-semibold text-purple-700 flex items-center">
                    <svg class="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m0-2v-2m0-2V7m6 10v-2m0-2v-2m0-2V7m-9 10h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Phân tích công việc hiện tại
                  </h4>
                  <p class="text-gray-600 whitespace-pre-wrap">{{ result.currentJobAnalysis }}</p>
                </div>
              </div>
            </div>

            <!-- Đề xuất nghề nghiệp -->
            <div>
              <h3 class="text-lg font-semibold text-purple-700 mb-4 flex items-center">
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
                Đề xuất nghề nghiệp
              </h3>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div
                  v-for="(suggestion, index) in result.careerSuggestions"
                  :key="index"
                  class="bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h4 class="text-base font-semibold text-purple-700 mb-3">{{ suggestion.job }}</h4>
                  <p class="text-gray-600 mb-2"><strong>Lý do phù hợp:</strong> {{ suggestion.reason }}</p>
                  <p class="text-gray-600 mb-2"><strong>Cơ hội hiện tại:</strong> {{ suggestion.opportunities }}</p>
                  <p class="text-gray-600"><strong>Xu hướng tương lai:</strong> {{ suggestion.trends }}</p>
                </div>
              </div>
            </div>

            <!-- Lời khuyên -->
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
                Lời khuyên thực tế
              </h3>
              <p class="text-gray-600 mt-2 whitespace-pre-wrap">{{ result.practicalAdvice }}</p>
            </div>

            <!-- Nút tải và chia sẻ -->
            <!-- <div class="flex flex-wrap gap-3 justify-center">
              <ClientOnly>
                <button
                  @click="downloadResult"
                  class="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200 shadow-sm"
                >
                  <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
                  </svg>
                  Lưu PDF
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
import { ref, onMounted, watch } from 'vue';
import { toast } from 'vue3-toastify';

definePageMeta({ layout: 'view' });

const formData = ref({
  name: '',
  birthdate: '',
  currentJob: ''
});
const result = ref(null);
const loading = ref(false);
const errors = ref({
  name: '',
  birthdate: '',
  general: ''
});

// Load saved data from localStorage on mount
onMounted(() => {
  const savedData = localStorage.getItem('careerGuidanceData');
  if (savedData) {
    const parsed = JSON.parse(savedData);
    formData.value = parsed.formData || {
      name: '',
      birthdate: '',
      currentJob: ''
    };
    result.value = parsed.result || null;
  }
});

// Save data to localStorage on change
watch([formData, result], () => {
  localStorage.setItem('careerGuidanceData', JSON.stringify({
    formData: formData.value,
    result: result.value
  }));
}, { deep: true });

// Validate form
const validateForm = () => {
  errors.value = {
    name: '',
    birthdate: '',
    general: ''
  };
  let isValid = true;

  if (!formData.value.name.trim()) {
    errors.value.name = 'Vui lòng nhập họ và tên';
    isValid = false;
  }
  if (!formData.value.birthdate.trim()) {
    errors.value.birthdate = 'Vui lòng nhập ngày sinh';
    isValid = false;
  } else if (!/^\d{2}[\/-]\d{2}[\/-]\d{4}$/.test(formData.value.birthdate)) {
    errors.value.birthdate = 'Vui lòng nhập ngày đúng định dạng DD/MM/YYYY hoặc DD-MM-YYYY';
    isValid = false;
  } else {
    const match = formData.value.birthdate.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
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
      errors.value.birthdate = 'Ngày sinh không hợp lệ';
      isValid = false;
    }
  }

  return isValid;
};

const getCareerGuidance = async () => {
  if (!validateForm()) return;

  loading.value = true;
  errors.value.general = '';
  try {
    const username = localStorage.getItem('username') || 'guest';
    const response = await $fetch('/api/numerology/career', {
      method: 'POST',
      headers: {
        'x-username': encodeURIComponent(username),
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: formData.value
    });
    result.value = response;
    toast.success('Định hướng nghề nghiệp đã hoàn tất!', { position: 'top-center' });
  } catch (error) {
    console.error('Error:', error);
    errors.value.general = error.data?.message || 'Có lỗi xảy ra!';
  } finally {
    loading.value = false;
  }
};

const shareResult = (platform) => {
  if (!result.value) return;
  const text = [
    `Định hướng nghề nghiệp cho ${formData.value.name}`,
    `Ngày sinh: ${formData.value.birthdate}`,
    formData.value.currentJob ? `Công việc hiện tại: ${formData.value.currentJob}` : '',
    `Mục tiêu nghề nghiệp: ${result.value.careerGoals}`,
    `Đam mê và động lực: ${result.value.passionAndMotivation}`,
    `Phong cách làm việc: ${result.value.workStyle}`,
    `Con đường dài hạn: ${result.value.longTermPath}`,
    formData.value.currentJob ? `Phân tích công việc hiện tại: ${result.value.currentJobAnalysis}` : '',
    `Đề xuất nghề nghiệp:`,
    ...result.value.careerSuggestions.map(s => `- ${s.job}\n  Lý do phù hợp: ${s.reason}\n  Cơ hội hiện tại: ${s.opportunities}\n  Xu hướng tương lai: ${s.trends}`),
    `Lời khuyên thực tế: ${result.value.practicalAdvice}`
  ].filter(Boolean).join('\n\n');

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
  if (!process.client) return toast.error('Không thể tải PDF trên server!');
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF();
  doc.setFont('helvetica');
  doc.setFontSize(12);
  let y = 10;

  doc.setFontSize(16);
  doc.text(`Định hướng nghề nghiệp cho ${formData.value.name}`, 10, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Ngày sinh: ${formData.value.birthdate}`, 10, y); y += 7;
  if (formData.value.currentJob) {
    doc.text(`Công việc hiện tại: ${formData.value.currentJob}`, 10, y); y += 7;
  }
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

  addSection('Mục tiêu nghề nghiệp', result.value.careerGoals);
  addSection('Đam mê và động lực', result.value.passionAndMotivation);
  addSection('Phong cách làm việc', result.value.workStyle);
  addSection('Con đường dài hạn', result.value.longTermPath);
  if (formData.value.currentJob) {
    addSection('Phân tích công việc hiện tại', result.value.currentJobAnalysis);
  }

  doc.setFontSize(14);
  doc.text('Đề xuất nghề nghiệp:', 10, y); y += 7;
  doc.setFontSize(12);
  result.value.careerSuggestions.forEach(s => {
    if (y > 260) { doc.addPage(); y = 10; }
    const text = `${s.job}\nLý do phù hợp: ${s.reason}\nCơ hội hiện tại: ${s.opportunities}\nXu hướng tương lai: ${s.trends}`;
    const lines = doc.splitTextToSize(text, 180);
    doc.text(lines, 10, y);
    y += lines.length * 7 + 5;
  });

  addSection('Lời khuyên thực tế', result.value.practicalAdvice);

  doc.save(`career-guidance-${formData.value.name}.pdf`);
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